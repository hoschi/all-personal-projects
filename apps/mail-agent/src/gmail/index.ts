import Debug from "debug"
import { google, type gmail_v1 } from "googleapis"

import type { BootstrapConfig } from "../config"
import { prisma } from "../data/prisma"

const AGENT_STATE_ID = "mail-agent-state" as const
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
] as const
const FULL_SYNC_MAX_RESULTS = 50 as const

export type NormalizedGmailMessage = {
  gmailMessageId: string
  gmailThreadId: string
  sender: string
  recipients: string[]
  subject: string
  bodyText: string
  bodyHtmlReduced: string
  labels: string[]
  threadMessageCount: number
  threadParticipants: string[]
  historyId: string | null
  internalDateIso: string | null
}

export type GmailPollMode = "history" | "full_sync"

export type GmailPollResult = {
  mode: GmailPollMode
  cursorBefore: string | null
  cursorAfter: string | null
  candidateMessageIds: string[]
  normalizedMessages: NormalizedGmailMessage[]
}

export type GmailAppliedAction = "keep" | "delete"

export type GmailApplyActionResult = {
  appliedAction: GmailAppliedAction
  addedLabelIds: string[]
  removedLabelIds: string[]
}

export type GmailUndoAction = "undo_keep" | "undo_delete"

export type GmailApplyUndoActionResult = {
  userAction: GmailUndoAction
  addedLabelIds: string[]
  removedLabelIds: string[]
}

function createGmailClient(config: BootstrapConfig) {
  const auth = new google.auth.OAuth2({
    clientId: config.gmailClientId,
    clientSecret: config.gmailClientSecret,
  })

  auth.setCredentials({
    refresh_token: config.gmailRefreshToken,
    scope: GMAIL_SCOPES.join(" "),
  })

  return google.gmail({ version: "v1", auth })
}

function getHeaderValue(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string | null {
  const value = headers?.find(
    (header) => header.name?.toLowerCase() === name,
  )?.value

  if (!value) {
    return null
  }

  return value.trim().length > 0 ? value.trim() : null
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")

  return Buffer.from(normalized, "base64").toString("utf8")
}

function collectBodyParts(
  part: gmail_v1.Schema$MessagePart | undefined,
  collected: { plainText: string[]; html: string[] },
) {
  if (!part) {
    return
  }

  const mimeType = part.mimeType?.toLowerCase()
  const bodyData = part.body?.data

  if (bodyData && mimeType === "text/plain") {
    collected.plainText.push(decodeBase64Url(bodyData))
  }

  if (bodyData && mimeType === "text/html") {
    collected.html.push(decodeBase64Url(bodyData))
  }

  part.parts?.forEach((nestedPart: gmail_v1.Schema$MessagePart) =>
    collectBodyParts(nestedPart, collected),
  )
}

function reduceHtmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parseCsvHeader(value: string | null): string[] {
  if (!value) {
    return []
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

function toIsoDate(value: string | null | undefined): string | null {
  if (!value) {
    return null
  }

  const asNumber = Number(value)

  if (!Number.isNaN(asNumber)) {
    return new Date(asNumber).toISOString()
  }

  const parsed = new Date(value)

  return Number.isNaN(parsed.valueOf()) ? null : parsed.toISOString()
}

function extractHistoryCandidateMessageIds(
  response: gmail_v1.Schema$ListHistoryResponse,
): string[] {
  const ids = new Set<string>()

  response.history?.forEach((historyItem: gmail_v1.Schema$History) => {
    historyItem.messages?.forEach((message: gmail_v1.Schema$Message) => {
      if (message.id) {
        ids.add(message.id)
      }
    })

    historyItem.messagesAdded?.forEach(
      (entry: gmail_v1.Schema$HistoryMessageAdded) => {
        if (entry.message?.id) {
          ids.add(entry.message.id)
        }
      },
    )

    historyItem.labelsAdded?.forEach(
      (entry: gmail_v1.Schema$HistoryLabelAdded) => {
        if (entry.message?.id) {
          ids.add(entry.message.id)
        }
      },
    )

    historyItem.labelsRemoved?.forEach(
      (entry: gmail_v1.Schema$HistoryLabelRemoved) => {
        if (entry.message?.id) {
          ids.add(entry.message.id)
        }
      },
    )
  })

  return [...ids]
}

async function readStoredCursor(): Promise<string | null> {
  const debug = Debug("app:db:readStoredCursor")
  debug("Reading stored Gmail cursor")

  const state = await prisma.agentState.findUnique({
    where: { id: AGENT_STATE_ID },
  })

  debug("Read stored Gmail cursor: hasCursor=%s", !!state?.gmailHistoryId)

  return state?.gmailHistoryId ?? null
}

async function persistCursor(gmailHistoryId: string | null) {
  const debug = Debug("app:db:persistCursor")
  debug("Persisting Gmail cursor: hasCursor=%s", !!gmailHistoryId)

  await prisma.agentState.upsert({
    where: { id: AGENT_STATE_ID },
    update: { gmailHistoryId },
    create: {
      id: AGENT_STATE_ID,
      gmailHistoryId,
    },
  })

  debug("Persisted Gmail cursor")
}

async function fetchNormalizedMessage(
  gmailClient: gmail_v1.Gmail,
  messageId: string,
): Promise<NormalizedGmailMessage | null> {
  const messageResponse = await gmailClient.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  })

  const message = messageResponse.data

  if (!message.id || !message.threadId) {
    return null
  }

  const threadResponse = await gmailClient.users.threads.get({
    userId: "me",
    id: message.threadId,
    format: "metadata",
    metadataHeaders: ["From"],
  })

  const headers = message.payload?.headers
  const sender = getHeaderValue(headers, "from") ?? ""
  const recipients = [
    ...parseCsvHeader(getHeaderValue(headers, "to")),
    ...parseCsvHeader(getHeaderValue(headers, "cc")),
  ]
  const subject = getHeaderValue(headers, "subject") ?? ""

  const bodyCollected = {
    plainText: [] as string[],
    html: [] as string[],
  }

  collectBodyParts(message.payload, bodyCollected)

  if (bodyCollected.plainText.length === 0 && message.payload?.body?.data) {
    bodyCollected.plainText.push(decodeBase64Url(message.payload.body.data))
  }

  const bodyText = bodyCollected.plainText.join("\n").trim()
  const bodyHtmlRaw = bodyCollected.html.join("\n").trim()

  const threadParticipants = Array.from(
    new Set<string>(
      (threadResponse.data.messages ?? [])
        .map(
          (threadMessage: gmail_v1.Schema$Message) =>
            getHeaderValue(threadMessage.payload?.headers, "from") ?? "",
        )
        .filter((value: string) => value.length > 0),
    ),
  )

  return {
    gmailMessageId: message.id,
    gmailThreadId: message.threadId,
    sender,
    recipients,
    subject,
    bodyText,
    bodyHtmlReduced: reduceHtmlToText(bodyHtmlRaw),
    labels: message.labelIds ?? [],
    threadMessageCount: threadResponse.data.messages?.length ?? 0,
    threadParticipants,
    historyId: message.historyId ?? null,
    internalDateIso: toIsoDate(message.internalDate),
  }
}

async function fetchNormalizedMessages(
  gmailClient: gmail_v1.Gmail,
  messageIds: string[],
): Promise<NormalizedGmailMessage[]> {
  const debug = Debug("app:action:fetchNormalizedMessages")
  debug(
    "Fetching normalized messages: candidateMessageCount=%d",
    messageIds.length,
  )

  const normalized = await Promise.all(
    messageIds.map((messageId) =>
      fetchNormalizedMessage(gmailClient, messageId),
    ),
  )

  const result = normalized.filter(
    (message): message is NormalizedGmailMessage => message !== null,
  )

  debug("Fetched normalized messages: normalizedMessageCount=%d", result.length)

  return result
}

function filterNormalizedMessagesByManagedLabelIds(
  normalizedMessages: NormalizedGmailMessage[],
  managedLabelIds: Set<string>,
): NormalizedGmailMessage[] {
  if (managedLabelIds.size === 0) {
    return normalizedMessages
  }

  return normalizedMessages.filter(
    (message) =>
      !message.labels.some((labelId) => managedLabelIds.has(labelId)),
  )
}

async function runFullSync(
  gmailClient: gmail_v1.Gmail,
  managedLabelIds: Set<string>,
): Promise<GmailPollResult> {
  const debug = Debug("app:action:runFullSync")
  debug("Running full sync")

  const cursorBefore = await readStoredCursor()

  const listResponse = await gmailClient.users.messages.list({
    userId: "me",
    maxResults: FULL_SYNC_MAX_RESULTS,
  })

  const candidateMessageIds = (listResponse.data.messages ?? [])
    .map((message: gmail_v1.Schema$Message) => message.id)
    .filter(
      (id: string | null | undefined): id is string => typeof id === "string",
    )

  debug(
    "Full sync listed messages: candidateMessageCount=%d",
    candidateMessageIds.length,
  )

  const unfilteredNormalizedMessages = await fetchNormalizedMessages(
    gmailClient,
    candidateMessageIds,
  )
  const normalizedMessages = filterNormalizedMessagesByManagedLabelIds(
    unfilteredNormalizedMessages,
    managedLabelIds,
  )

  const profileResponse = await gmailClient.users.getProfile({
    userId: "me",
  })

  const cursorAfter = profileResponse.data.historyId ?? null

  if (cursorAfter) {
    await persistCursor(cursorAfter)
  }

  debug(
    "Full sync finished: cursorBefore=%s, cursorAfter=%s, normalizedMessageCount=%d, skippedManagedCount=%d",
    cursorBefore,
    cursorAfter,
    normalizedMessages.length,
    unfilteredNormalizedMessages.length - normalizedMessages.length,
  )

  return {
    mode: "full_sync",
    cursorBefore,
    cursorAfter,
    candidateMessageIds,
    normalizedMessages,
  }
}

function isInvalidHistoryError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false
  }

  const maybeCode = (error as { code?: number }).code
  const maybeStatus = (error as { status?: number }).status
  const maybeResponseStatus = (error as { response?: { status?: number } })
    .response?.status

  return maybeCode === 404 || maybeStatus === 404 || maybeResponseStatus === 404
}

async function resolveLabelIdByName(
  gmailClient: gmail_v1.Gmail,
  labelName: string,
): Promise<string> {
  const debug = Debug("app:action:resolveLabelIdByName")
  debug("Resolving Gmail label id: labelName=%s", labelName)

  const labelsResponse = await gmailClient.users.labels.list({
    userId: "me",
  })

  const matchingLabel = labelsResponse.data.labels?.find(
    (label) => label.name === labelName,
  )

  if (!matchingLabel?.id) {
    throw new Error(
      `Configured Gmail label "${labelName}" was not found in mailbox labels.`,
    )
  }

  debug(
    "Resolved Gmail label id: labelName=%s, labelId=%s",
    labelName,
    matchingLabel.id,
  )

  return matchingLabel.id
}

export function createGmailSync(config: BootstrapConfig) {
  const debug = Debug("app:action:createGmailSync")
  debug("Creating Gmail sync adapter")

  const gmailClient = createGmailClient(config)
  const configuredLabelIdCache = new Map<string, string>()
  let managedLabelIdsCache: Set<string> | null = null

  async function getConfiguredLabelId(labelName: string): Promise<string> {
    const debug = Debug("app:action:getConfiguredLabelId")

    const cached = configuredLabelIdCache.get(labelName)

    if (cached) {
      debug("Label id cache hit: labelName=%s", labelName)
      return cached
    }

    const resolved = await resolveLabelIdByName(gmailClient, labelName)
    configuredLabelIdCache.set(labelName, resolved)

    debug("Label id cache store: labelName=%s, labelId=%s", labelName, resolved)

    return resolved
  }

  async function getManagedLabelIdsByPrefix(): Promise<Set<string>> {
    const debug = Debug("app:action:getManagedLabelIdsByPrefix")

    if (managedLabelIdsCache) {
      debug(
        "Managed label id cache hit: labelPrefix=%s, labelCount=%d",
        config.labels.aiLabelPrefix,
        managedLabelIdsCache.size,
      )
      return managedLabelIdsCache
    }

    const labelsResponse = await gmailClient.users.labels.list({
      userId: "me",
    })

    const labelIds = new Set(
      (labelsResponse.data.labels ?? [])
        .filter((label) => {
          const labelName = label.name?.trim()

          if (!labelName) {
            return false
          }

          return (
            labelName === config.labels.aiLabelPrefix ||
            labelName.startsWith(`${config.labels.aiLabelPrefix}/`)
          )
        })
        .map((label) => label.id)
        .filter((labelId): labelId is string => !!labelId),
    )

    managedLabelIdsCache = labelIds
    debug(
      "Managed label ids resolved: labelPrefix=%s, labelCount=%d",
      config.labels.aiLabelPrefix,
      labelIds.size,
    )

    return labelIds
  }

  async function applyAction(
    gmailMessageId: string,
    deleteIt: boolean,
  ): Promise<GmailApplyActionResult> {
    const debug = Debug("app:action:applyGmailAction")
    debug(
      "Applying Gmail action: gmailMessageId=%s, deleteIt=%s",
      gmailMessageId,
      deleteIt,
    )

    const keepLabelId = await getConfiguredLabelId(config.labels.keep)
    const deleteLabelId = await getConfiguredLabelId(config.labels.delete)
    const hiddenLabelId = await getConfiguredLabelId(config.labels.hidden)

    const appliedAction: GmailAppliedAction = deleteIt ? "delete" : "keep"

    const addedLabelIds = deleteIt ? [deleteLabelId] : [keepLabelId]

    const removedLabelIds = deleteIt
      ? ["INBOX", keepLabelId, hiddenLabelId]
      : [deleteLabelId, hiddenLabelId]

    await gmailClient.users.messages.modify({
      userId: "me",
      id: gmailMessageId,
      requestBody: {
        addLabelIds: addedLabelIds,
        removeLabelIds: removedLabelIds,
      },
    })

    debug(
      "Applied Gmail action: gmailMessageId=%s, appliedAction=%s, addedLabelCount=%d, removedLabelCount=%d",
      gmailMessageId,
      appliedAction,
      addedLabelIds.length,
      removedLabelIds.length,
    )

    return {
      appliedAction,
      addedLabelIds,
      removedLabelIds,
    }
  }

  async function applyUndoAction(
    gmailMessageId: string,
    previousAppliedAction: GmailAppliedAction,
  ): Promise<GmailApplyUndoActionResult> {
    const debug = Debug("app:action:applyGmailUndoAction")
    debug(
      "Applying Gmail undo action: gmailMessageId=%s, previousAppliedAction=%s",
      gmailMessageId,
      previousAppliedAction,
    )

    const keepLabelId = await getConfiguredLabelId(config.labels.keep)
    const deleteLabelId = await getConfiguredLabelId(config.labels.delete)
    const hiddenLabelId = await getConfiguredLabelId(config.labels.hidden)

    const userAction: GmailUndoAction =
      previousAppliedAction === "delete" ? "undo_delete" : "undo_keep"

    const addedLabelIds =
      previousAppliedAction === "delete"
        ? ["INBOX", keepLabelId]
        : [deleteLabelId]
    const removedLabelIds =
      previousAppliedAction === "delete"
        ? [deleteLabelId, hiddenLabelId]
        : ["INBOX", keepLabelId, hiddenLabelId]

    await gmailClient.users.messages.modify({
      userId: "me",
      id: gmailMessageId,
      requestBody: {
        addLabelIds: addedLabelIds,
        removeLabelIds: removedLabelIds,
      },
    })

    debug(
      "Applied Gmail undo action: gmailMessageId=%s, userAction=%s, addedLabelCount=%d, removedLabelCount=%d",
      gmailMessageId,
      userAction,
      addedLabelIds.length,
      removedLabelIds.length,
    )

    return {
      userAction,
      addedLabelIds,
      removedLabelIds,
    }
  }

  return {
    async poll(): Promise<GmailPollResult> {
      const debug = Debug("app:action:pollGmail")
      debug("Starting Gmail poll")

      const managedLabelIds = await getManagedLabelIdsByPrefix()

      const cursorBefore = await readStoredCursor()

      debug("Loaded cursor for poll: cursorBefore=%s", cursorBefore)

      if (!cursorBefore) {
        debug("No cursor available, switching to full sync")
        return runFullSync(gmailClient, managedLabelIds)
      }

      try {
        const historyResponse = await gmailClient.users.history.list({
          userId: "me",
          startHistoryId: cursorBefore,
          historyTypes: ["messageAdded", "labelAdded", "labelRemoved"],
        })

        const candidateMessageIds = extractHistoryCandidateMessageIds(
          historyResponse.data,
        )
        const unfilteredNormalizedMessages = await fetchNormalizedMessages(
          gmailClient,
          candidateMessageIds,
        )
        const normalizedMessages = filterNormalizedMessagesByManagedLabelIds(
          unfilteredNormalizedMessages,
          managedLabelIds,
        )

        const cursorAfter = historyResponse.data.historyId ?? cursorBefore

        await persistCursor(cursorAfter)

        debug(
          "History poll finished: cursorBefore=%s, cursorAfter=%s, candidateMessageCount=%d, normalizedMessageCount=%d, skippedManagedCount=%d",
          cursorBefore,
          cursorAfter,
          candidateMessageIds.length,
          normalizedMessages.length,
          unfilteredNormalizedMessages.length - normalizedMessages.length,
        )

        return {
          mode: "history",
          cursorBefore,
          cursorAfter,
          candidateMessageIds,
          normalizedMessages,
        }
      } catch (error: unknown) {
        if (!isInvalidHistoryError(error)) {
          debug("History poll failed with non-recoverable error")
          throw error
        }

        debug("History cursor invalid, falling back to full sync")

        return runFullSync(gmailClient, managedLabelIds)
      }
    },
    applyAction,
    applyUndoAction,
  }
}
