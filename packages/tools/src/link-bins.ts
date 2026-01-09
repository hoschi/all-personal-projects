#!/usr/bin/env bun

/**
 * BUG: bun install doesn't link workspaces package.json/bin entries
 * https://github.com/oven-sh/bun/issues/19782
 *
 * This script creates symlinks for all bin entries in workspace packages
 * Usage: bun run packages/tools/src/link-bins.ts
 */

import { existsSync, mkdirSync, readFileSync, symlinkSync, unlinkSync, readdirSync, lstatSync } from "fs";
import { join, dirname } from "path";

// Script is at packages/tools/src/link-bins.ts, root is 3 levels up
const SCRIPT_PATH = import.meta.filename;
const ROOT_DIR = dirname(dirname(dirname(dirname(SCRIPT_PATH))));
const BIN_DIR = join(ROOT_DIR, "node_modules/.bin");

// Create bin directory if it doesn't exist
if (!existsSync(BIN_DIR)) {
  mkdirSync(BIN_DIR, { recursive: true });
}

// Find all package.json files in workspaces and apps
function findPackageJsonFiles(dir: string): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;

      const pkgJson = join(fullPath, "package.json");
      if (existsSync(pkgJson)) {
        results.push(pkgJson);
      }

      // Recurse into subdirectories
      results.push(...findPackageJsonFiles(fullPath));
    }
  }

  return results;
}

// Find all package.json files
const packageJsonFiles = [
  ...findPackageJsonFiles(join(ROOT_DIR, "packages")),
  ...findPackageJsonFiles(join(ROOT_DIR, "apps")),
];

for (const pkgJsonPath of packageJsonFiles) {
  const pkgDir = dirname(pkgJsonPath);

  try {
    const pkgJsonContent = readFileSync(pkgJsonPath, "utf-8");
    const pkg = JSON.parse(pkgJsonContent);

    if (!pkg.bin || typeof pkg.bin !== "object") {
      continue;
    }

    for (const [name, path] of Object.entries(pkg.bin)) {
      const normalizedPath = (path as string).replace(/^\.\//, "");
      const fullPath = join(pkgDir, normalizedPath);
      const linkPath = join(BIN_DIR, name);

      let linkExists = false;
      try {
        linkExists = lstatSync(linkPath).isSymbolicLink() || lstatSync(linkPath).isFile();
      } catch {
        // Link doesn't exist
      }

      if (linkExists) {
        unlinkSync(linkPath);
      }

      if (existsSync(fullPath)) {
        symlinkSync(fullPath, linkPath);
        console.log(`${name} -> ${normalizedPath}`);
      } else {
        console.error(`WARNING: ${fullPath} not found`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${pkgJsonPath}:`, error);
  }
}
