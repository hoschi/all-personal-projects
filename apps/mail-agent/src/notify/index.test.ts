import { expect, test } from "bun:test"

import { TEST_ONLY, type NotificationInput } from "."

const BASE_NOTIFICATION_INPUT: NotificationInput = {
  gmailMessageId: "gmail-message-id",
  appliedAction: "delete",
  subject: "SPRING-Sale kommt zurück! - Feinewerkzeuge.de",
  summary:
    "Newsletter von Feinewerkzeuge.de kündigt den SPRING-Sale an - inkl. Kontakt (Telefon, E-Mail).",
  undoUrl:
    "http://192.168.178.91:3070/mail-agent/undo?token=eyJ2IjoxLCJnbWFpbE1lc3NhZ2VJZCI6IjE5ZDk1MWExNGFmYTlkMTAifQ.XxhPau57ohBuGzwbajU0FNpn3ybxZmxOx9QTJWri-ZM",
}

test("formatTelegramMessage escapes MarkdownV2 special characters", () => {
  const message = TEST_ONLY.formatTelegramMessage(
    BASE_NOTIFICATION_INPUT,
    "MarkdownV2",
  )

  expect(message).toContain("SPRING\\-Sale")
  expect(message).toContain("zurück\\!")
  expect(message).toContain("Feinewerkzeuge\\.de")
  expect(message).toContain("an \\- inkl\\.")
  expect(message).toContain("\\(Telefon, E\\-Mail\\)")
})

test("formatTelegramMessage emits one undo link and no debug test links", () => {
  const message = TEST_ONLY.formatTelegramMessage(
    BASE_NOTIFICATION_INPUT,
    "MarkdownV2",
  )

  expect(message.match(/\[UNDO\]\(/g)?.length ?? 0).toBe(1)
  expect(message).not.toContain("[❌](")
  expect(message).not.toContain("TEST GOOGLE")
  expect(message).not.toContain("TEST LOCAL")
})
