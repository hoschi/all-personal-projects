import { Layer } from "effect"
import { BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { HttpApiBuilder } from "@effect/platform"
import { VideoApiLive } from "@repo/video-service/video"

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(VideoApiLive),
  Layer.provide(BunHttpServer.layer({ port: 3055 })),
)

// Launch the server
// @ts-expect-error idk man
Layer.launch(ServerLive).pipe(BunRuntime.runMain)
