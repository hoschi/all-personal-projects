import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
