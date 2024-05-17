/// <reference lib="deno.worker" />

import { cache, exists } from "!cache"
import { Hono } from "!hono"
import { upgradeWebSocket } from "!hono/helper"
import { serveStatic } from "!hono/middleware"
import { initialize, transcribe } from "!netvox"

// Setup signals
const startResolvers = Promise.withResolvers<number>()

// Communicate to main
onmessage = ({ data }: MessageEvent) => {
    // Passing port number
    if (typeof data === "number") {
        startResolvers.resolve(data)
        console.log(data)
    }
}

// Download model
const model_url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-q5_0.bin?download=true"
if (!await exists(model_url)) {
    console.log("モデルをダウンロード中...")
}
const model = await cache(model_url)

// Initialize whisper
console.log("モデルを読み込み中...")
initialize(model.path)

// Setup hono
const app = new Hono()
    .get(
        "/socket",
        upgradeWebSocket(() => {
            return {
                onMessage: async (event, socket) => {
                    if (event.data instanceof ArrayBuffer) {
                        const audio = new Float32Array(event.data)
                        try {
                            socket.send(await transcribe(new Uint8Array(audio.buffer)))
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }
            }
        })
    )
    .use("*", serveStatic({ root: "dist" }))

// Ready...
postMessage({})

// Wait for port nego.
const port = await startResolvers.promise

// Start server.
Deno.serve({ port }, app.fetch)
