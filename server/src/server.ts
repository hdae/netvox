/// <reference lib="deno.worker" />

import { cache, exists } from "!cache"
import { Hono } from "!hono"
import { upgradeWebSocket } from "!hono/helper"
import { serveStatic } from "!hono/middleware"
import { initialize, transcribe } from "!netvox"

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

// Start server.
Deno.serve({ port: 8000 }, app.fetch)
