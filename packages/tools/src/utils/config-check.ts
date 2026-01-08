import { existsSync } from "fs";

export function checkEslintConfig(): boolean {
    return existsSync("eslint.config.mjs") || existsSync(".eslintrc.json");
}

export function checkTsConfig(): boolean {
    return existsSync("tsconfig.json");
}

export function exitWithMessage(message: string, code: number = 1): never {
    console.error(message);
    process.exit(code);
}
