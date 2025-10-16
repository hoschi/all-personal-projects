import {
    HttpApi,
    HttpApiBuilder,
    HttpApiEndpoint,
    HttpApiGroup
} from "@effect/platform"
import { Effect, Layer, Schema } from "effect"

// Define our API with one group named "Greetings" and one endpoint called "hello-world"
const MyApi = HttpApi.make("MyApi").add(
    HttpApiGroup.make("Greetings").add(
        HttpApiEndpoint.get("hello-world")`/`.addSuccess(Schema.String)
    )
)

// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(MyApi, "Greetings", (handlers) =>
    handlers.handle("hello-world", () => Effect.succeed("Hello, World!!!"))
)

// Provide the implementation for the API
export const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive))

export const hello = (input: string): string => `hallo: ${input}`