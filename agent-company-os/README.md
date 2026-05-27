# Agent Company OS

A polished first working prototype of a futuristic AI company command centre.

## Stack

- React
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Vite
- Local Vite middleware API for chat
- Local state and mock data only; ready for future backend/API integration

## Features

- Premium dark glassmorphism SaaS dashboard
- Agent structure map with clickable agent nodes
- Agent registry cards with roles, missions, tools and status
- Editable agent detail side panel
- Add, duplicate and delete agents
- Mock chat interface per selected agent with quick prompts
- API-ready local chat endpoint at `POST /api/agents/chat`
- Task assignment form and task board
- Knowledge base items connected to agents
- Settings placeholder for future configuration/API integration
- Responsive desktop/tablet/mobile layout

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Chat API architecture

Current flow:

```text
Agent Chat UI → POST /api/agents/chat → /api/agents/chat/handler.ts → /lib/ai/aiProvider.ts → /lib/mock/mockAgentResponse.ts
```

Request body:

```json
{
  "agentId": "boss",
  "agentName": "Boss Agent",
  "agentSystemPrompt": "...",
  "userMessage": "Create a task plan",
  "conversationHistory": []
}
```

Response body:

```json
{
  "assistantMessage": "...",
  "agentId": "boss",
  "timestamp": "2026-05-25T08:00:00.000Z",
  "mock": true
}
```

Future OpenAI, Claude or OpenClaw bridge integration should be added inside `lib/ai/aiProvider.ts`. Do not put provider secrets in frontend code.

## Validation

Current prototype passes:

```bash
npm run build
npm run lint
```
