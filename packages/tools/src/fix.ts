import { checkEslintConfig } from "./utils/config-check.js";

if (!checkEslintConfig()) {
    console.error("ESLint not configured. Run 'bun run init' in a new project.");
    process.exit(1);
}

const result = await Bun.spawn(["bunx", "eslint", "--fix", "."], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

process.exit(result.exitCode);

export { };
