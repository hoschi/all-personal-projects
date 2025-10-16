import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiError, HttpApiGroup, HttpApiSchema } from "@effect/platform"
import { Effect, Layer, Schema } from "effect"

class Video extends Schema.Class<Video>("Video")({
    id: Schema.Number,
    title: Schema.NonEmptyString
}) { }

const idParam = HttpApiSchema.param("id", Schema.NumberFromString)

const fakeDb: Record<number, Video> = [
    {
        id: 1,
        title: 'my first title'
    },
    {
        id: 42,
        title: 'The Answer'
    },

].reduce((dict, video) => ({ ...dict, [video.id]: video }), {})

console.log("videos", fakeDb)

const getVideos = HttpApiEndpoint.get("getVideos", "/Videos").addSuccess(
    Schema.Array(Video)
)

const getVideo = HttpApiEndpoint.get("getVideo")`/Video/${idParam}`
    .addSuccess(Video)
    // Add a 404 error response for this endpoint
    .addError(HttpApiError.NotFound)

const VideoApi = HttpApi.make("VideoApi").add(HttpApiGroup.make("Videos")
    .add(getVideos)
    .add(getVideo)
)

const VideoLive = HttpApiBuilder.group(VideoApi, "Videos", (handlers) =>
    handlers
        .handle("getVideo", ({ path: { id } }) => fakeDb[id] ? Effect.succeed(fakeDb[id]) : new HttpApiError.NotFound())
        .handle("getVideos", () => Effect.succeed(Object.values(fakeDb))
        ))


export const VideoApiLive = HttpApiBuilder.api(VideoApi).pipe(Layer.provide(VideoLive))