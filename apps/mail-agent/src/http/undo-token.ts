import { createHmac, timingSafeEqual } from "node:crypto"

const UNDO_TOKEN_VERSION = 1 as const

type UndoTokenPayload = {
  v: typeof UNDO_TOKEN_VERSION
  gmailMessageId: string
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url")
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8")
}

function createSignature(payloadBase64Url: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(payloadBase64Url)
    .digest("base64url")
}

export function createUndoToken(
  gmailMessageId: string,
  undoTokenSecret: string,
): string {
  const payload: UndoTokenPayload = {
    v: UNDO_TOKEN_VERSION,
    gmailMessageId,
  }

  const payloadBase64Url = toBase64Url(JSON.stringify(payload))
  const signature = createSignature(payloadBase64Url, undoTokenSecret)

  return `${payloadBase64Url}.${signature}`
}

export function verifyUndoToken(
  token: string,
  undoTokenSecret: string,
): UndoTokenPayload {
  const [payloadBase64Url, signature] = token.split(".")

  if (!payloadBase64Url || !signature) {
    throw new Error("Undo token has invalid format.")
  }

  const expectedSignature = createSignature(payloadBase64Url, undoTokenSecret)

  const receivedBuffer = Buffer.from(signature, "utf8")
  const expectedBuffer = Buffer.from(expectedSignature, "utf8")

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    throw new Error("Undo token signature is invalid.")
  }

  const payloadUnknown: unknown = JSON.parse(fromBase64Url(payloadBase64Url))

  if (typeof payloadUnknown !== "object" || payloadUnknown === null) {
    throw new Error("Undo token payload is invalid.")
  }

  const payload = payloadUnknown as {
    v?: unknown
    gmailMessageId?: unknown
  }

  if (
    payload.v !== UNDO_TOKEN_VERSION ||
    typeof payload.gmailMessageId !== "string" ||
    payload.gmailMessageId.length === 0
  ) {
    throw new Error("Undo token payload schema mismatch.")
  }

  return {
    v: UNDO_TOKEN_VERSION,
    gmailMessageId: payload.gmailMessageId,
  }
}
