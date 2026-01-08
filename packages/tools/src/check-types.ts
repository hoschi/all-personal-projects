import { checkTsConfig, exitWithMessage } from "./utils/config-check.js";

if (!checkTsConfig()) {
    exitWithMessage("TypeScript not configured. Run 'bun run init' in a new project.");
}

const result = await Bun.spawn(["bunx", "tsc", "--noEmit"], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

process.exit(result.exitCode);
