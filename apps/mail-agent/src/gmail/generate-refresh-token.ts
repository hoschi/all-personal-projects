import { spawn } from "node:child_process"
import { createServer } from "node:http"

import { config as dotenvConfig } from "dotenv"
import { google } from "googleapis"
import { z } from "zod"

const LOOPBACK_HOST = "127.0.0.1" as const
const LOOPBACK_PORT = 3000 as const
const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
] as const

const gmailAuthEnvSchema = z.object({
  MAIL_AGENT_GMAIL_CLIENT_ID: z.string().trim().min(1),
  MAIL_AGENT_GMAIL_CLIENT_SECRET: z.string().trim().min(1),
})

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

function readGmailAuthEnv() {
  const result = gmailAuthEnvSchema.safeParse(process.env)

  if (result.success) {
    return result.data
  }

  const details = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ")

  throw new Error(`Invalid environment for gmail auth CLI: ${details}`)
}

function openBrowser(url: string) {
  if (process.platform !== "darwin") {
    return
  }

  const child = spawn("open", [url], {
    detached: true,
    stdio: "ignore",
  })

  child.unref()
}

async function waitForAuthorizationCode(redirectUri: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const server = createServer((request, response) => {
      const requestUrl = new URL(request.url ?? "/", redirectUri)
      const authorizationCode = requestUrl.searchParams.get("code")
      const oauthError = requestUrl.searchParams.get("error")

      if (oauthError) {
        response.statusCode = 400
        response.end("Authorization failed. Check terminal output.")
        server.close(() => {
          reject(new Error(`OAuth authorization failed: ${oauthError}`))
        })
        return
      }

      if (!authorizationCode) {
        response.statusCode = 400
        response.end("Missing authorization code.")
        return
      }

      response.statusCode = 200
      response.end("Authorization complete. You can close this tab.")
      server.close((closeError) => {
        if (closeError) {
          reject(closeError)
          return
        }

        resolve(authorizationCode)
      })
    })

    server.on("error", (error) => {
      reject(error)
    })

    server.listen(LOOPBACK_PORT, LOOPBACK_HOST, () => {
      console.log("Gmail OAuth setup started.")
      console.log(`Listening on ${redirectUri}`)
    })
  })
}

async function main() {
  const env = readGmailAuthEnv()
  const redirectUri = `http://${LOOPBACK_HOST}:${LOOPBACK_PORT}`

  const oauthClient = new google.auth.OAuth2({
    clientId: env.MAIL_AGENT_GMAIL_CLIENT_ID,
    clientSecret: env.MAIL_AGENT_GMAIL_CLIENT_SECRET,
    redirectUri,
  })

  const authorizeUrl = oauthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [...GMAIL_SCOPES],
  })

  console.log("Open this URL to authorize access:")
  console.log(authorizeUrl)
  openBrowser(authorizeUrl)

  const authorizationCode = await waitForAuthorizationCode(redirectUri)
  const { tokens } = await oauthClient.getToken(authorizationCode)

  if (!tokens.refresh_token) {
    throw new Error(
      "No refresh token received. Revoke prior consent and rerun this command.",
    )
  }

  console.log("\nRefresh token:")
  console.log(tokens.refresh_token)
  console.log("\nAdd this to apps/mail-agent/.env:")
  console.log(
    `MAIL_AGENT_GMAIL_REFRESH_TOKEN=${JSON.stringify(tokens.refresh_token)}`,
  )
}

main().catch((error: unknown) => {
  throw new Error("gmail auth CLI failed", { cause: error })
})
