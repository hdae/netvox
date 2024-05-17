import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import LicensePlugin from "rollup-plugin-license"
import { defineConfig } from 'vite'
import { ViteStaticCopyOptions, viteStaticCopy } from "vite-plugin-static-copy"

const files: ViteStaticCopyOptions = {
    targets: [
        {
            src: resolve(__dirname, "node_modules", "@ricky0123", "vad-web", "dist", "vad.worklet.bundle.min.js").replaceAll(/\\/g, "/"),
            dest: ""
        },
        {
            src: resolve(__dirname, "node_modules", "@ricky0123", "vad-web", "dist", "silero_vad.onnx").replaceAll(/\\/g, "/"),
            dest: ""
        },
        {
            src: resolve(__dirname, "node_modules", "onnxruntime-web", "dist", "*.wasm").replaceAll(/\\/g, "/"),
            dest: ""
        }
    ]
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [
        react(),
        viteStaticCopy(files),
        LicensePlugin({ thirdParty: { output: resolve(__dirname, "build", "third", "LICENSE.netvox_ui.txt") } }),
    ],
    esbuild: {
        legalComments: "none"
    },
    build: {
        outDir: resolve(__dirname, "build", "dist"),
    }
})
