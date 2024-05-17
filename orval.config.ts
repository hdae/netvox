import { defineConfig } from 'orval'

export default defineConfig({
    voicevox: {
        input: "./src/api/voicevox/openapi.json",
        output: {
            target: "./src/api/voicevox/api.ts",
            baseUrl: "http://localhost:50021"
        }
    },
    voicevox_query: {
        input: "./src/api/voicevox/openapi.json",
        output: {
            target: "./src/api/voicevox/query.ts",
            baseUrl: "http://localhost:50021",
            client: "react-query",
        }
    }
})
