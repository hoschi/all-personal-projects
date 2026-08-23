import { describe, expect, test } from "bun:test"
import {
  decideHook,
  decideShellCommand,
  decideToolUse,
} from "./cursor-agent-guard"

const OHS = "/Users/x/repos/kims/scripts/ohs-search-merged.sh"
const PREFIXES = [
  `OHS_NODE_BIN=$HOME/.asdf/shims/node ${OHS}`,
  `OHS_NODE_BIN=/Users/x/.asdf/shims/node ${OHS}`,
  OHS,
]

describe("decideShellCommand", () => {
  test("erlaubt den OHS-Aufruf in der Form, die der Prompt vorschreibt", () => {
    const cmd = `OHS_NODE_BIN=$HOME/.asdf/shims/node ${OHS} --vault-type arbeit --no-yt --limit 3 --json 'effect schema'`
    expect(decideShellCommand(cmd, PREFIXES)).toEqual({ permission: "allow" })
  })

  test("erlaubt den OHS-Aufruf mit aufgelöstem Home", () => {
    const cmd = `OHS_NODE_BIN=/Users/x/.asdf/shims/node ${OHS} --json 'x'`
    expect(decideShellCommand(cmd, PREFIXES).permission).toBe("allow")
  })

  test("erlaubt den Wrapper ohne Env-Prefix", () => {
    expect(decideShellCommand(`${OHS} --json 'x'`, PREFIXES).permission).toBe(
      "allow",
    )
  })

  test("lehnt einen fremden Befehl ab", () => {
    const decision = decideShellCommand("echo hi", PREFIXES)
    expect(decision.permission).toBe("deny")
    expect(decision.user_message).toContain("Allowlist")
  })

  test("lehnt einen angehängten Zweitbefehl ab", () => {
    const cmd = `OHS_NODE_BIN=$HOME/.asdf/shims/node ${OHS} --json 'x' ; rm -rf /`
    expect(decideShellCommand(cmd, PREFIXES).permission).toBe("deny")
  })

  test("lehnt Pipe, Kommando-Ersetzung und Umleitung ab", () => {
    for (const suffix of ["| sh", "$(id)", "> /tmp/x"]) {
      const cmd = `${OHS} --json 'x' ${suffix}`
      expect(decideShellCommand(cmd, PREFIXES).permission).toBe("deny")
    }
  })

  test("lehnt einen anderen Interpreter in OHS_NODE_BIN ab", () => {
    const cmd = `OHS_NODE_BIN=/bin/sh ${OHS} --json 'x'`
    expect(decideShellCommand(cmd, PREFIXES).permission).toBe("deny")
  })

  test("lehnt ein Präfix ab, das nur zufällig gleich anfängt", () => {
    expect(
      decideShellCommand(`${OHS}-boese --json 'x'`, PREFIXES).permission,
    ).toBe("deny")
  })

  test("lehnt leere und nicht-textuelle Befehle ab", () => {
    expect(decideShellCommand("   ", PREFIXES).permission).toBe("deny")
    expect(decideShellCommand(undefined, PREFIXES).permission).toBe("deny")
  })

  test("lehnt alles ab, wenn die Allowlist leer ist", () => {
    expect(decideShellCommand(`${OHS} --json 'x'`, []).permission).toBe("deny")
  })

  test("lehnt überlange Befehle ab", () => {
    const cmd = `${OHS} --json '${"a".repeat(5000)}'`
    expect(decideShellCommand(cmd, PREFIXES).permission).toBe("deny")
  })
})

describe("decideToolUse", () => {
  test("lässt das Shell-Werkzeug durch, ohne es freizugeben", () => {
    // Neutral statt "allow": ein Allow hier würde die Befehlsprüfung in
    // beforeShellExecution überspringen.
    expect(decideToolUse("Shell")).toEqual({})
  })

  test("sperrt jedes andere Werkzeug", () => {
    for (const tool of ["Read", "Write", "Grep", "Fetch", "Delete", "Ls"]) {
      const decision = decideToolUse(tool)
      expect(decision.permission).toBe("deny")
      expect(decision.user_message).toContain(tool)
    }
  })
})

describe("decideHook", () => {
  test("routet preToolUse auf die Werkzeug-Prüfung", () => {
    expect(
      decideHook({ hook_event_name: "preToolUse", tool_name: "Read" }, PREFIXES)
        .permission,
    ).toBe("deny")
  })

  test("routet beforeShellExecution auf die Befehls-Prüfung", () => {
    expect(
      decideHook(
        {
          hook_event_name: "beforeShellExecution",
          command: `${OHS} --json 'x'`,
        },
        PREFIXES,
      ).permission,
    ).toBe("allow")
  })

  test("lehnt ein unbekanntes Hook-Ereignis ab (fail closed)", () => {
    expect(
      decideHook({ hook_event_name: "afterFileEdit" }, PREFIXES).permission,
    ).toBe("deny")
    expect(decideHook({}, PREFIXES).permission).toBe("deny")
  })
})
