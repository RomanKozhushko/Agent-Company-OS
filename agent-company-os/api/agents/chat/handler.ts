import type { IncomingMessage, ServerResponse } from 'node:http'
import type { AgentChatRequest } from '../../../lib/agents/chatTypes'
import { generateAgentChatResponse } from '../../../lib/ai/aiProvider'

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

function isAgentChatRequest(value: unknown): value is AgentChatRequest {
  if (!value || typeof value !== 'object') return false

  const body = value as Partial<AgentChatRequest>
  return (
    typeof body.agentId === 'string' &&
    typeof body.agentName === 'string' &&
    typeof body.agentSystemPrompt === 'string' &&
    typeof body.userMessage === 'string' &&
    Array.isArray(body.conversationHistory)
  )
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

export async function handleAgentChat(request: IncomingMessage, response: ServerResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed' })
    return
  }

  try {
    const body = await readJsonBody(request)

    if (!isAgentChatRequest(body)) {
      sendJson(response, 400, { error: 'Invalid agent chat request' })
      return
    }

    // The real AI provider will be connected behind this function later.
    // Frontend never receives or stores provider secrets.
    const result = await generateAgentChatResponse(body)
    sendJson(response, 200, result)
  } catch (error) {
    console.error('Agent chat endpoint failed:', error)
    sendJson(response, 500, { error: 'Agent chat failed' })
  }
}
