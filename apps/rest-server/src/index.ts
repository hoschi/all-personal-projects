import { hello, MyApiLive } from "@repo/video-service/video";
import { Layer } from "effect";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import {
    HttpApiBuilder
} from "@effect/platform";
import { createServer } from "node:http";



console.log(hello('mytest'))

const ServerLive = HttpApiBuilder.serve().pipe(
    Layer.provide(MyApiLive),
    Layer.provide(BunHttpServer.layer(createServer))
)

// Launch the server
Layer.launch(ServerLive).pipe(BunRuntime.runMain)