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
  const state = await prisma.agentState.findUnique({
    where: { id: AGENT_STATE_ID },
  })

  return state?.gmailHistoryId ?? null
}

async function persistCursor(gmailHistoryId: string | null) {
  await prisma.agentState.upsert({
    where: { id: AGENT_STATE_ID },
    update: { gmailHistoryId },
    create: {
      id: AGENT_STATE_ID,
      gmailHistoryId,
    },
  })
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
  const normalized = await Promise.all(
    messageIds.map((messageId) =>
      fetchNormalizedMessage(gmailClient, messageId),
    ),
  )

  return normalized.filter(
    (message): message is NormalizedGmailMessage => message !== null,
  )
}

async function runFullSync(
  gmailClient: gmail_v1.Gmail,
): Promise<GmailPollResult> {
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

  const normalizedMessages = await fetchNormalizedMessages(
    gmailClient,
    candidateMessageIds,
  )

  const profileResponse = await gmailClient.users.getProfile({
    userId: "me",
  })

  const cursorAfter = profileResponse.data.historyId ?? null

  if (cursorAfter) {
    await persistCursor(cursorAfter)
  }

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
  const labelsResponse = await gmailClient.users.labels.list({
    userId: "me",
  })

  const matchingLabel = labelsResponse.data.labels?.find(
    (label) => label.name === labelName,
  )

  if (!matchingLabel?.id) {
    throw new Error(
      `Configured Gmail label \"${labelName}\" was not found in mailbox labels.`,
    )
  }

  return matchingLabel.id
}

export function createGmailSync(config: BootstrapConfig) {
  const gmailClient = createGmailClient(config)
  const configuredLabelIdCache = new Map<string, string>()

  async function getConfiguredLabelId(labelName: string): Promise<string> {
    const cached = configuredLabelIdCache.get(labelName)

    if (cached) {
      return cached
    }

    const resolved = await resolveLabelIdByName(gmailClient, labelName)
    configuredLabelIdCache.set(labelName, resolved)

    return resolved
  }

  async function applyAction(
    gmailMessageId: string,
    deleteIt: boolean,
  ): Promise<GmailApplyActionResult> {
    const aiManagedLabelId = await getConfiguredLabelId(config.labels.aiManaged)
    const keepLabelId = await getConfiguredLabelId(config.labels.keep)
    const deleteLabelId = await getConfiguredLabelId(config.labels.delete)

    const appliedAction: GmailAppliedAction = deleteIt ? "delete" : "keep"

    const addedLabelIds = deleteIt
      ? [aiManagedLabelId, deleteLabelId]
      : [aiManagedLabelId, keepLabelId]

    const removedLabelIds = deleteIt ? ["INBOX", keepLabelId] : [deleteLabelId]

    await gmailClient.users.messages.modify({
      userId: "me",
      id: gmailMessageId,
      requestBody: {
        addLabelIds: addedLabelIds,
        removeLabelIds: removedLabelIds,
      },
    })

    return {
      appliedAction,
      addedLabelIds,
      removedLabelIds,
    }
  }

  return {
    async poll(): Promise<GmailPollResult> {
      const cursorBefore = await readStoredCursor()

      if (!cursorBefore) {
        return runFullSync(gmailClient)
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
        const normalizedMessages = await fetchNormalizedMessages(
          gmailClient,
          candidateMessageIds,
        )

        const cursorAfter = historyResponse.data.historyId ?? cursorBefore

        await persistCursor(cursorAfter)

        return {
          mode: "history",
          cursorBefore,
          cursorAfter,
          candidateMessageIds,
          normalizedMessages,
        }
      } catch (error: unknown) {
        if (!isInvalidHistoryError(error)) {
          throw error
        }

        return runFullSync(gmailClient)
      }
    },
    applyAction,
  }
}
