//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  ...tanstackConfig,
  {
    ignores: [".output/"],
  },
]
