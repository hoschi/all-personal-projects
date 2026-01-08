#!/usr/bin/env bun
import { $ } from "bun";
import { checkTsConfig, exitWithMessage } from "./utils/config-check.js";

if (!checkTsConfig()) {
    exitWithMessage("TypeScript not configured. Run 'bun run init' to set up TypeScript.");
}

await $`FORCE_COLOR=1 tsc --noEmit`;
