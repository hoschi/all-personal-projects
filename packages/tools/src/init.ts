#!/usr/bin/env bun

import { existsSync, writeFileSync } from "fs";

console.log("Initializing ESLint and TypeScript configuration...");

// Check and create eslint.config.mjs
if (!existsSync("eslint.config.mjs")) {
    console.log("Creating eslint.config.mjs...");
    writeFileSync(
        "eslint.config.mjs",
        `export { default } from "@repo/eslint-config/base";\n`
    );
}

// Check and create tsconfig.json
if (!existsSync("tsconfig.json")) {
    console.log("Creating tsconfig.json...");
    writeFileSync(
        "tsconfig.json",
        JSON.stringify(
            {
                extends: "@repo/typescript-config/base.json",
                compilerOptions: {
                    strict: true,
                    types: ["bun-types"]
                }
            },
            null,
            2
        ) + "\n"
    );
}

console.log("Done! You may need to install dependencies: bun install and");
