import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup
} from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Schema } from "effect"
import { createServer } from "node:http"

const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(VideoApiLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3055 }))
)

// Launch the server
Layer.launch(ServerLive).pipe(NodeRuntime.runMain)