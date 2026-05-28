import type { AgentChatRequest, AgentChatResponse } from '../agents/chatTypes.js'
import { generateOpenAIResponse, hasOpenAIKey } from './openaiProvider.js'
import { createMockAgentResponse } from '../mock/mockAgentResponse.js'

export async function generateAgentChatResponse(request: AgentChatRequest): Promise<AgentChatResponse> {
  // Provider order:
  // 1. OpenAI when OPENAI_API_KEY exists on the backend.
  // 2. Mock fallback when no key exists or provider call fails.
  // Never expose provider secrets to frontend React code.
  if (!hasOpenAIKey()) return createMockAgentResponse(request)

  try {
    return await generateOpenAIResponse(request)
  } catch (error) {
    console.error('[ai-provider] OpenAI failed, returning mock fallback:', error instanceof Error ? error.message : error)
    return createMockAgentResponse(request)
  }
}
