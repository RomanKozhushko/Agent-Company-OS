interface AgentChatBody {
  agentId?: unknown
  agentName?: unknown
  agentSystemPrompt?: unknown
  userMessage?: unknown
  conversationHistory?: unknown
}

interface ApiRequest {
  method?: string
  body?: unknown
  [Symbol.asyncIterator]?: () => AsyncIterator<unknown>
}

interface ApiResponse {
  statusCode: number
  setHeader: (name: string, value: string) => void
  end: (body: string) => void
}

interface ConversationHistoryItem {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

interface AgentChatRequest {
  agentId: string
  agentName: string
  agentSystemPrompt: string
  userMessage: string
  conversationHistory: ConversationHistoryItem[]
}

interface MockAgentResponse {
  assistantMessage: string
  agentId: string
  timestamp: string
  mock: boolean
}

function bodyType(body: unknown) {
  if (body === undefined) return 'undefined'
  if (body === null) return 'null'
  if (Array.isArray(body)) return 'array'
  return typeof body
}

async function readBody(request: ApiRequest): Promise<unknown> {
  if (request.body !== undefined) {
    if (typeof request.body === 'string') {
      try {
        return request.body.trim() ? JSON.parse(request.body) : {}
      } catch {
        return { userMessage: request.body }
      }
    }

    return request.body
  }

  if (!request[Symbol.asyncIterator]) return {}

  const chunks: Buffer[] = []
  const stream = request as AsyncIterable<unknown>
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  if (!rawBody.trim()) return {}

  try {
    return JSON.parse(rawBody)
  } catch {
    return { userMessage: rawBody }
  }
}

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function normalizeConversationHistory(value: unknown): ConversationHistoryItem[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item): ConversationHistoryItem[] => {
    if (!item || typeof item !== 'object') return []
    const entry = item as Partial<ConversationHistoryItem>
    const role = entry.role === 'user' || entry.role === 'assistant' ? entry.role : undefined
    const content = readString(entry.content, '')
    if (!role || !content) return []
    return [{ role, content, timestamp: typeof entry.timestamp === 'string' ? entry.timestamp : undefined }]
  })
}

function normalizeAgentChatRequest(body: unknown): AgentChatRequest {
  const parsed = body && typeof body === 'object' ? body as AgentChatBody : {}

  return {
    agentId: readString(parsed.agentId, 'mock-agent'),
    agentName: readString(parsed.agentName, 'Mock Agent'),
    agentSystemPrompt: readString(parsed.agentSystemPrompt, ''),
    userMessage: readString(parsed.userMessage, 'No valid user message received.'),
    conversationHistory: normalizeConversationHistory(parsed.conversationHistory),
  }
}

function createMockResponse(body: unknown, reason?: string): MockAgentResponse {
  const request = normalizeAgentChatRequest(body)
  const promptPreview = request.agentSystemPrompt.slice(0, 120)

  return {
    agentId: request.agentId,
    timestamp: new Date().toISOString(),
    mock: true,
    assistantMessage: [
      `${request.agentName} online. Mock chat backend is working.`,
      reason ? `Safe mode reason: ${reason}` : 'This is a Vercel-compatible mock response.',
      `Received: “${request.userMessage}”`,
      request.conversationHistory.length > 0 ? `Conversation history items received: ${request.conversationHistory.length}.` : 'No previous conversation history received.',
      promptPreview ? `Instruction preview: ${promptPreview}` : 'No system prompt was required for this mock response.',
    ].join('\n\n'),
  }
}

async function generateProviderResponse(body: unknown): Promise<MockAgentResponse> {
  const request = normalizeAgentChatRequest(body)

  try {
    const provider = await import('../../../lib/ai/aiProvider')
    return await provider.generateAgentChatResponse(request)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown provider import/call error'
    console.error('[agent-chat-vercel] provider failed, returning mock fallback', message)
    return createMockResponse(request, message)
  }
}

function sendMock(response: ApiResponse, payload: MockAgentResponse) {
  response.statusCode = 200
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

export default async function agentChat(request: ApiRequest, response: ApiResponse) {
  let parsedBody: unknown = {}

  try {
    console.log('[agent-chat-vercel] method', request.method)
    console.log('[agent-chat-vercel] body type', bodyType(request.body))

    parsedBody = await readBody(request)
    const parsed = parsedBody && typeof parsedBody === 'object' ? parsedBody as AgentChatBody : {}
    console.log('[agent-chat-vercel] agentId', readString(parsed.agentId, 'missing-agent-id'))

    if (request.method !== 'POST') {
      sendMock(response, createMockResponse(parsedBody, `Unsupported method ${request.method ?? 'UNKNOWN'}. Use POST.`))
      return
    }

    sendMock(response, await generateProviderResponse(parsedBody))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown serverless error'
    console.error('[agent-chat-vercel] caught error', message)
    sendMock(response, createMockResponse(parsedBody, message))
  }
}
