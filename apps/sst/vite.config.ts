import { config as dotenvConfig } from "dotenv"
import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

import { textImprovementEnvSchema } from "./src/contracts/text-improvement-env"

dotenvConfig({ path: ".env.base", quiet: true })
dotenvConfig({ path: ".env", override: true, quiet: true })

textImprovementEnvSchema.parse({
  SST_WHISPER_ENDPOINT: process.env.SST_WHISPER_ENDPOINT,
  SST_OLLAMA_ENDPOINT: process.env.SST_OLLAMA_ENDPOINT,
  SST_OLLAMA_MODEL_ID: process.env.SST_OLLAMA_MODEL_ID,
})

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  // See https://github.com/TanStack/router/issues/5738
  resolve: {
    alias: [
      { find: "use-sync-external-store/shim/index.js", replacement: "react" },
    ],
  },
})

export default config
