import { google, type gmail_v1 } from "googleapis"

import { createBootstrapConfig } from "../config"

const PREVIEW_LIMIT = 5 as const
const USER_ID = "me" as const
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
] as const

function getHeaderValue(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string,
): string {
  const value = headers?.find(
    (header) => header.name?.toLowerCase() === name.toLowerCase(),
  )?.value

  return value?.trim() ?? ""
}

async function main() {
  const config = createBootstrapConfig()

  const auth = new google.auth.OAuth2({
    clientId: config.gmailClientId,
    clientSecret: config.gmailClientSecret,
  })

  auth.setCredentials({
    refresh_token: config.gmailRefreshToken,
    scope: GMAIL_SCOPES.join(" "),
  })

  const gmailClient = google.gmail({ version: "v1", auth })

  const listResponse = await gmailClient.users.messages.list({
    userId: USER_ID,
    maxResults: PREVIEW_LIMIT,
    q: "in:anywhere",
  })

  const listedMessages = listResponse.data.messages ?? []

  const preview = (
    await Promise.all(
      listedMessages.map(async (message) => {
        if (!message.id) {
          return null
        }

        const messageResponse = await gmailClient.users.messages.get({
          userId: USER_ID,
          id: message.id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        })

        const data = messageResponse.data

        if (!data.id || !data.threadId) {
          return null
        }

        return {
          gmailMessageId: data.id,
          gmailThreadId: data.threadId,
          sender: getHeaderValue(data.payload?.headers, "From"),
          subject: getHeaderValue(data.payload?.headers, "Subject"),
          date: getHeaderValue(data.payload?.headers, "Date"),
          labels: data.labelIds ?? [],
        }
      }),
    )
  ).filter(
    (message): message is NonNullable<typeof message> => message !== null,
  )

  console.log(
    JSON.stringify(
      {
        listedMessageCount: listedMessages.length,
        previewCount: preview.length,
        preview,
      },
      null,
      2,
    ),
  )
}

main().catch((error: unknown) => {
  throw new Error("gmail read smoke failed", { cause: error })
})
