// import { tanstackConfig } from "@tanstack/eslint-config"
import { config } from "@repo/eslint-config/base"

export default [
  // "eslint.config.js", TODO https://github.com/TanStack/create-tsrouter-app/issues/80
  //...tanstackConfig,
  ...config,
  {
    ignores: [".output/"],
  },
]
