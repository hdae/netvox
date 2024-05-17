// import { getAvailablePortSync } from "!port"
import { SizeHint, Webview } from "@webview/webview"

// const port = getAvailablePortSync({ port: { start: 60000, end: 65535 } })
const port = 8000
const worker = new Worker(new URL("./worker.ts", import.meta.url).href, { type: "module" })

// Wait for worker start
const waitForWorker = Promise.withResolvers<void>()
worker.onmessage = () => waitForWorker.resolve()
await waitForWorker.promise
worker.postMessage(port)

// Create webview
const webview = new Webview()
webview.title = "NetVox"
webview.size = {
    hint: SizeHint.FIXED,
    width: 640,
    height: 480,
}
webview.navigate(`http://localhost:${port}/`)
webview.run()

// Shutdown server
worker.terminate()
