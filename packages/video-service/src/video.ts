import {
    HttpApi,
    HttpApiBuilder,
    HttpApiEndpoint,
    HttpApiGroup
} from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer, Schema } from "effect"
import { createServer } from "node:http"

// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const VideoApi = HttpApi.make("MyApi").add(
    HttpApiGroup.make("Greetings").add(
        HttpApiEndpoint.get("hello-world")`/`.addSuccess(Schema.String)
    )
)

// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(VideoApi, "Greetings", (handlers) =>
    handlers.handle("hello-world", () => Effect.succeed("Hello, World!"))
)

// Provide the implementation for the API
export const VideoApiLive = HttpApiBuilder.api(VideoApi).pipe(Layer.provide(GreetingsLive))