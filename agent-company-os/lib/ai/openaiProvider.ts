import type { AgentChatRequest, AgentChatResponse, ConversationHistoryItem } from '../agents/chatTypes.js'

interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
}

function toOpenAIMessages(request: AgentChatRequest): OpenAIChatMessage[] {
  const historyMessages = request.conversationHistory
    .filter((message: ConversationHistoryItem) => message.content.trim())
    .map((message): OpenAIChatMessage => ({
      role: message.role,
      content: message.content,
    }))

  return [
    {
      role: 'system',
      content: [
        `You are ${request.agentName}.`,
        request.agentSystemPrompt || 'You are an AI-R&D Lab agent for premium B2B digital products.',
        'Return practical, concise, business-focused answers. Do not invent facts. If unsure, state assumptions clearly.',
      ].join('\n\n'),
    },
    ...historyMessages,
    {
      role: 'user',
      content: request.userMessage,
    },
  ]
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

export async function generateOpenAIResponse(request: AgentChatRequest): Promise<AgentChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: toOpenAIMessages(request),
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unable to read OpenAI error body')
    throw new Error(`OpenAI request failed with ${response.status}: ${errorText.slice(0, 500)}`)
  }

  const data = await response.json() as OpenAIChatCompletionResponse
  const assistantMessage = data.choices?.[0]?.message?.content?.trim()

  if (!assistantMessage) {
    throw new Error('OpenAI response did not include assistant content')
  }

  return {
    assistantMessage,
    agentId: request.agentId,
    timestamp: new Date().toISOString(),
    mock: false,
  }
}
