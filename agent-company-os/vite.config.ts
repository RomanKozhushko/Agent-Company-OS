import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleAgentChat } from './api/agents/chat/handler'

function localApiPlugin(): Plugin {
  return {
    name: 'agent-company-os-local-api',
    configureServer(server) {
      server.middlewares.use('/api/agents/chat', (request, response) => {
        void handleAgentChat(request, response)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
})
