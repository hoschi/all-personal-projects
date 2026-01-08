#!/usr/bin/env bun

import { checkEslintConfig, exitWithMessage } from "./utils/config-check.js";

if (!checkEslintConfig()) {
    exitWithMessage("ESLint not configured. Run 'bun run init' in a new project.");
}

const result = await Bun.spawn(["bunx", "eslint", "."], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

process.exit(result.exitCode);
