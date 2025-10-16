import { VideoApiLive } from "@repo/video-service/video";
import { Layer } from "effect";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import {
    HttpApiBuilder
} from "@effect/platform";



const ServerLive = HttpApiBuilder.serve().pipe(
    Layer.provide(VideoApiLive),
    Layer.provide(BunHttpServer.layer({ port: 3055 }))
)

// Launch the server
Layer.launch(ServerLive).pipe(BunRuntime.runMain)