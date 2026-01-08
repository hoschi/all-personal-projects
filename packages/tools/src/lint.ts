#!/usr/bin/env bun
import { $ } from "bun";
import { checkEslintConfig, exitWithMessage } from "./utils/config-check.js";

if (!checkEslintConfig()) {
    exitWithMessage("ESLint not configured. Run 'bun run init' to set up ESLint.");
}

await $`FORCE_COLOR=1 eslint .`;