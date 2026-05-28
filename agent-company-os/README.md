# Agent Company OS

A working prototype of an operating system for:

**AI-R&D Lab → Premium B2B Products → B2B Sales Engine**

The app researches trends, validates micro-niches, prototypes premium B2B digital products, runs 48h demand tests, prepares content/email assets and supports Build / Improve / Kill product decisions.

## Stack

- React
- TypeScript
- Tailwind CSS v4 via `@tailwindcss/vite`
- Vite
- Local Vite middleware API for chat
- Local state and mock data only; ready for future backend/API integration

## Main sections

- Dashboard
- Product Lab
- Demand Tests
- Content Engine
- Email Funnel
- Agents
- Structure Map
- Chat
- Tasks
- Knowledge Base
- Settings

## Product Lab pipeline

- Ideas
- Niche Validation
- Prototype
- 48h Demand Test
- Launch Ready
- Killed / Archived

## Lab agents

- Lab Director Agent
- Trend Scanner Agent
- Micro-Niche Analyst Agent
- Product Architect Agent
- Prototype Builder Agent
- Demand Test Agent
- Content Engine Agent
- Email Funnel Agent
- Quality Control Agent

## Example product candidates

- Contractor Pricing & Quote Engine
- Airbnb Turnover Operating System
- Property Investor Toolkit
- Small Business AI Operations Pack
- Local Service Business Growth Kit
- SOP Pack for Service Businesses

## Chat API architecture

Current flow:

```text
Agent Chat UI → POST /api/agents/chat → /api/agents/chat/handler.ts → /lib/ai/aiProvider.ts → /lib/mock/mockAgentResponse.ts
```

Future OpenAI, Claude or OpenClaw bridge integration should be added inside `lib/ai/aiProvider.ts`. Do not put provider secrets in frontend code.

## Run locally

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
```
