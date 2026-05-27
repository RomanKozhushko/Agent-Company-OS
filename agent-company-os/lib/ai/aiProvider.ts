import type { AgentChatRequest, AgentChatResponse } from '../agents/chatTypes'
import { createMockAgentResponse } from '../mock/mockAgentResponse'

export async function generateAgentChatResponse(request: AgentChatRequest): Promise<AgentChatResponse> {
  // Future integration point:
  // - OpenAI API client can be called here.
  // - Claude API client can be called here.
  // - OpenClaw bridge/session routing can be called here.
  // Keep API keys and provider secrets only on the backend side, never in frontend React code.
  return createMockAgentResponse(request)
}
