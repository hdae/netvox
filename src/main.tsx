// Reset CSS
import "ress"

// Style CSS
import "./main.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { App } from "./App"

const root = document.getElementById("root")
if (root === null) throw new Error("Failed to initialize application.")

const client = new QueryClient()

createRoot(root).render(
    <StrictMode>
        <QueryClientProvider client={client}>
            <App />
        </QueryClientProvider>
    </StrictMode>
)
