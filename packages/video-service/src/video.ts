import { HttpApi, HttpApiBuilder, HttpApiEndpoint, HttpApiError, HttpApiGroup, HttpApiSchema } from "@effect/platform"
import { client } from "@repo/db/client"
import { Effect, Either, Layer, Schema, Option } from "effect"

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

const f = async () => {
    const videos = await client.video.findMany()
}

const getVideos = HttpApiEndpoint.get("getVideos", "/Videos").addSuccess(
    Schema.Array(Video)
).addError(HttpApiError.HttpApiDecodeError)

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
        .handle("getVideo", ({ path: { id } }) =>
            Effect.fromNullable(fakeDb[id]).pipe(
                Effect.mapError(() => new HttpApiError.NotFound())
            )
        )
        .handle("getVideos", () => Effect.gen(function* () {
            //return Object.values(fakeDb)
            const videos = yield* Effect.promise(() => client.video.findMany())
            if (videos.length <= 0) {
                return yield* Effect.fail(new HttpApiError.HttpApiDecodeError())
            }

            const videoOne = yield* Schema.decodeUnknownEither(Video)(videos[0])

            return [videoOne]
        })
        ))


export const VideoApiLive = HttpApiBuilder.api(VideoApi).pipe(Layer.provide(VideoLive))