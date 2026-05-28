import type { IncomingMessage, ServerResponse } from 'node:http'
import type { AgentChatRequest, AgentChatResponse } from '../../../lib/agents/chatTypes.js'
import { generateAgentChatResponse } from '../../../lib/ai/aiProvider.js'

type RequestWithBody = IncomingMessage & { body?: unknown }

function safeLog(label: string, payload?: unknown) {
  console.log(`[agent-chat] ${label}`, payload ?? '')
}

async function readJsonBody(request: RequestWithBody): Promise<unknown> {
  if (request.body && typeof request.body === 'object') return request.body
  if (typeof request.body === 'string') return request.body ? JSON.parse(request.body) : {}

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

function createSafeMockResponse(body: unknown, reason: string): AgentChatResponse {
  const partial = body && typeof body === 'object' ? body as Partial<AgentChatRequest> : {}
  const agentId = typeof partial.agentId === 'string' ? partial.agentId : 'mock-agent'
  const agentName = typeof partial.agentName === 'string' ? partial.agentName : 'Mock Agent'
  const userMessage = typeof partial.userMessage === 'string' ? partial.userMessage : 'No valid user message received.'

  return {
    agentId,
    timestamp: new Date().toISOString(),
    mock: true,
    assistantMessage: [
      `${agentName} online in safe mock mode.`,
      `Reason: ${reason}`,
      `Received: “${userMessage}”`,
      'The backend returned a compatible mock response instead of failing completely.',
    ].join('\n\n'),
  }
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

export async function handleAgentChat(request: RequestWithBody, response: ServerResponse) {
  safeLog('request received')
  safeLog('method', request.method)

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    sendJson(response, 405, { error: 'Method not allowed', allowedMethods: ['POST'] })
    return
  }

  let body: unknown = {}

  try {
    body = await readJsonBody(request)
    safeLog('parsed body', {
      hasAgentId: Boolean((body as Partial<AgentChatRequest>)?.agentId),
      hasAgentName: Boolean((body as Partial<AgentChatRequest>)?.agentName),
      hasUserMessage: Boolean((body as Partial<AgentChatRequest>)?.userMessage),
      historyCount: Array.isArray((body as Partial<AgentChatRequest>)?.conversationHistory) ? (body as Partial<AgentChatRequest>).conversationHistory?.length : 0,
    })

    if (!isAgentChatRequest(body)) {
      const fallback = createSafeMockResponse(body, 'Invalid or incomplete agent chat request body')
      safeLog('response returned', { statusCode: 200, mock: true, fallback: true })
      sendJson(response, 200, fallback)
      return
    }

    // The real AI provider will be connected behind this function later.
    // Frontend never receives or stores provider secrets.
    const result = await generateAgentChatResponse(body)
    safeLog('response returned', { statusCode: 200, mock: result.mock, agentId: result.agentId })
    sendJson(response, 200, result)
  } catch (error) {
    console.error('[agent-chat] caught error', error)
    const fallback = createSafeMockResponse(body, error instanceof Error ? error.message : 'Unknown backend error')
    safeLog('response returned', { statusCode: 200, mock: true, fallback: true })
    sendJson(response, 200, fallback)
  }
}
