import { existsSync, readFileSync, writeFileSync } from "fs";
import { checkEslintConfig, checkTsConfig } from "./utils/config-check.js";

const eslintConfigContent = `export { default } from "@repo/eslint-config/base";\n`;
const tsconfigContent = `{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "strict": true,
    "types": ["bun-types"]
  }
}
`;

async function updatePackageJson() {
    if (!existsSync("package.json")) {
        console.error("No package.json found in current directory.");
        process.exit(1);
    }

    const packageJson = JSON.parse(readFileSync("package.json", "utf-8"));

    if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
    }

    const newDeps = {
        "@types/bun": "^1.2.0",
        "@repo/eslint-config": "*",
        "@repo/typescript-config": "*",
        eslint: "^9",
        typescript: "^5"
    };

    let updated = false;
    for (const [key, value] of Object.entries(newDeps)) {
        if (!packageJson.devDependencies[key]) {
            packageJson.devDependencies[key] = value;
            updated = true;
        }
    }

    if (updated) {
        writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
        console.log("Updated package.json with new devDependencies.");
    } else {
        console.log("package.json already has required devDependencies.");
    }
}

async function main() {
    console.log("Initializing project configuration...");

    // Check and create ESLint config
    if (!checkEslintConfig()) {
        console.log("Creating eslint.config.mjs...");
        writeFileSync("eslint.config.mjs", eslintConfigContent);
    } else {
        console.log("ESLint config already exists.");
    }

    // Check and create tsconfig.json
    if (!checkTsConfig()) {
        console.log("Creating tsconfig.json...");
        writeFileSync("tsconfig.json", tsconfigContent);
    } else {
        console.log("TypeScript config already exists.");
    }

    // Update package.json with devDependencies
    await updatePackageJson();

    console.log("Initialization complete!");
}

main().catch(console.error);

export { };
