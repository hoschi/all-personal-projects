import Debug from "debug"
import { google, type gmail_v1 } from "googleapis"

import type { BootstrapConfig } from "../config"
import { prisma } from "../data/prisma"

const AGENT_STATE_ID = "mail-agent-state" as const
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
] as const
const FULL_SYNC_PAGE_SIZE = 5 as const
const NORMALIZED_MESSAGE_FETCH_BATCH_SIZE = 5 as const

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
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function reduceHtmlToMarkdown(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(
      /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      (_match, href: string, text: string) => {
        const label = reduceHtmlToText(text)
        return label.length > 0 ? `[${label}](${href.trim()})` : href.trim()
      },
    )
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/(li|p|div|section|article|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
}

function looksLikeHtmlContent(value: string): boolean {
  return /<[^>]+>|<!--|<!doctype|<html/i.test(value)
}

function normalizePlainTextBody(value: string): string {
  return value
    .replace(/<!--[\s\S]*?-->/g, " ")
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

export async function clearCursor() {
  const debug = Debug("app:db:clearCursor")
  debug("Clearing Gmail cursor")

  await prisma.agentState.upsert({
    where: { id: AGENT_STATE_ID },
    update: { gmailHistoryId: null },
    create: {
      id: AGENT_STATE_ID,
      gmailHistoryId: null,
    },
  })

  debug("Cleared Gmail cursor - next start will perform full sync")
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

  const bodyTextRaw = bodyCollected.plainText.join("\n").trim()
  const bodyHtmlRaw = bodyCollected.html.join("\n").trim()
  const bodyTextFromHtml = reduceHtmlToMarkdown(bodyHtmlRaw)
  const bodyTextNormalized = normalizePlainTextBody(bodyTextRaw)
  const bodyText =
    bodyTextNormalized.length > 0 && !looksLikeHtmlContent(bodyTextRaw)
      ? bodyTextNormalized
      : bodyTextFromHtml.length > 0
        ? bodyTextFromHtml
        : bodyTextNormalized

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

  const normalized: Array<NormalizedGmailMessage | null> = []

  for (
    let startIndex = 0;
    startIndex < messageIds.length;
    startIndex += NORMALIZED_MESSAGE_FETCH_BATCH_SIZE
  ) {
    const messageIdsBatch = messageIds.slice(
      startIndex,
      startIndex + NORMALIZED_MESSAGE_FETCH_BATCH_SIZE,
    )
    debug(
      "Fetching normalized messages batch: batchStart=%d, batchSize=%d",
      startIndex,
      messageIdsBatch.length,
    )

    const batchNormalized = await Promise.all(
      messageIdsBatch.map((messageId) =>
        fetchNormalizedMessage(gmailClient, messageId),
      ),
    )

    normalized.push(...batchNormalized)
  }

  const normalizedNonNull = normalized.filter(
    (message): message is NormalizedGmailMessage => message !== null,
  )

  debug(
    "Fetched normalized messages: normalizedMessageCount=%d",
    normalizedNonNull.length,
  )

  return normalizedNonNull
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

function sortNormalizedMessagesByInternalDate(
  normalizedMessages: NormalizedGmailMessage[],
): NormalizedGmailMessage[] {
  return normalizedMessages.toSorted((left, right) => {
    if (left.internalDateIso === null && right.internalDateIso === null) {
      return left.gmailMessageId.localeCompare(right.gmailMessageId)
    }

    if (left.internalDateIso === null) {
      return 1
    }

    if (right.internalDateIso === null) {
      return -1
    }

    const leftTimestamp = Date.parse(left.internalDateIso)
    const rightTimestamp = Date.parse(right.internalDateIso)

    if (Number.isNaN(leftTimestamp) && Number.isNaN(rightTimestamp)) {
      return left.gmailMessageId.localeCompare(right.gmailMessageId)
    }

    if (Number.isNaN(leftTimestamp)) {
      return 1
    }

    if (Number.isNaN(rightTimestamp)) {
      return -1
    }

    if (leftTimestamp === rightTimestamp) {
      return left.gmailMessageId.localeCompare(right.gmailMessageId)
    }

    return leftTimestamp - rightTimestamp
  })
}

async function runFullSync(
  gmailClient: gmail_v1.Gmail,
  managedLabelIds: Set<string>,
  gmailFilterQuery: string,
): Promise<GmailPollResult> {
  const debug = Debug("app:action:runFullSync")

  // Build dynamic filter query excluding AI-managed labels
  const aiLabelExclusions = Array.from(managedLabelIds)
    .map((labelId) => `-label:${labelId}`)
    .join(" ")

  const dynamicFilterQuery = `${gmailFilterQuery} ${aiLabelExclusions}`.trim()

  debug(
    "Running full sync page: baseQuery=%s, aiLabelExclusions=%s, finalQuery=%s, pageSize=%d",
    gmailFilterQuery,
    aiLabelExclusions,
    dynamicFilterQuery,
    FULL_SYNC_PAGE_SIZE,
  )

  const cursorBefore = await readStoredCursor()
  const listResponse = await gmailClient.users.messages.list({
    userId: "me",
    maxResults: FULL_SYNC_PAGE_SIZE,
    q: dynamicFilterQuery,
  })

  const candidateMessageIds = (listResponse.data.messages ?? [])
    .map((message: gmail_v1.Schema$Message) => message.id)
    .filter(
      (id: string | null | undefined): id is string => typeof id === "string",
    )

  debug(
    "Full sync page loaded: pageCandidateCount=%d, hasNextPage=%s",
    candidateMessageIds.length,
    !!listResponse.data.nextPageToken,
  )

  const unfilteredNormalizedMessages = await fetchNormalizedMessages(
    gmailClient,
    candidateMessageIds,
  )
  const normalizedMessages = filterNormalizedMessagesByManagedLabelIds(
    unfilteredNormalizedMessages,
    managedLabelIds,
  )
  const sortedNormalizedMessages =
    sortNormalizedMessagesByInternalDate(normalizedMessages)

  let cursorAfter = cursorBefore

  if (candidateMessageIds.length === 0) {
    const profileResponse = await gmailClient.users.getProfile({
      userId: "me",
    })

    cursorAfter = profileResponse.data.historyId ?? null

    if (cursorAfter) {
      await persistCursor(cursorAfter)
    }
  }

  debug(
    "Full sync page finished: cursorBefore=%s, cursorAfter=%s, candidateMessageCount=%d, normalizedMessageCount=%d, skippedManagedCount=%d",
    cursorBefore,
    cursorAfter,
    candidateMessageIds.length,
    sortedNormalizedMessages.length,
    unfilteredNormalizedMessages.length - normalizedMessages.length,
  )

  return {
    mode: "full_sync",
    cursorBefore,
    cursorAfter,
    candidateMessageIds,
    normalizedMessages: sortedNormalizedMessages,
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
        return runFullSync(
          gmailClient,
          managedLabelIds,
          config.gmailFilterQuery,
        )
      }

      try {
        const candidateMessageIds = new Set<string>()
        let pageToken: string | undefined
        let pageCount = 0
        let cursorAfter = cursorBefore

        do {
          const historyResponse = await gmailClient.users.history.list({
            userId: "me",
            startHistoryId: cursorBefore,
            historyTypes: ["messageAdded", "labelAdded", "labelRemoved"],
            pageToken,
          })
          pageCount += 1

          for (const candidateMessageId of extractHistoryCandidateMessageIds(
            historyResponse.data,
          )) {
            candidateMessageIds.add(candidateMessageId)
          }

          cursorAfter = historyResponse.data.historyId ?? cursorAfter
          pageToken = historyResponse.data.nextPageToken ?? undefined

          debug(
            "History page loaded: page=%d, totalCandidateCount=%d, hasNextPage=%s",
            pageCount,
            candidateMessageIds.size,
            !!pageToken,
          )
        } while (pageToken)

        const candidateMessageIdsList = [...candidateMessageIds]
        const unfilteredNormalizedMessages = await fetchNormalizedMessages(
          gmailClient,
          candidateMessageIdsList,
        )
        const normalizedMessages = filterNormalizedMessagesByManagedLabelIds(
          unfilteredNormalizedMessages,
          managedLabelIds,
        )
        const sortedNormalizedMessages =
          sortNormalizedMessagesByInternalDate(normalizedMessages)

        await persistCursor(cursorAfter)

        debug(
          "History poll finished: cursorBefore=%s, cursorAfter=%s, candidateMessageCount=%d, normalizedMessageCount=%d, skippedManagedCount=%d",
          cursorBefore,
          cursorAfter,
          candidateMessageIdsList.length,
          sortedNormalizedMessages.length,
          unfilteredNormalizedMessages.length - normalizedMessages.length,
        )

        return {
          mode: "history",
          cursorBefore,
          cursorAfter,
          candidateMessageIds: candidateMessageIdsList,
          normalizedMessages: sortedNormalizedMessages,
        }
      } catch (error: unknown) {
        if (!isInvalidHistoryError(error)) {
          debug("History poll failed with non-recoverable error")
          throw error
        }

        debug("History cursor invalid, falling back to full sync")
        await persistCursor(null)

        return runFullSync(
          gmailClient,
          managedLabelIds,
          config.gmailFilterQuery,
        )
      }
    },
    applyAction,
    applyUndoAction,
  }
}
