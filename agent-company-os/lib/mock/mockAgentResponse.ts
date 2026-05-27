import type { AgentChatRequest, AgentChatResponse } from '../agents/chatTypes'

const roleHints: Record<string, string> = {
  boss: 'I will split this into clear actions, route the work to the right agents and keep the final result simple.',
  market: 'I will look for opportunities, competitors, client pain points and market gaps before suggesting next moves.',
  offer: 'I will convert this into a clear offer with package logic, benefits, price reasoning and buying clarity.',
  sales: 'I will turn this into direct, human outreach that avoids spam and moves the lead to the next step.',
  website: 'I will think in landing pages, UX, SEO structure, CTA clarity and publish-ready website sections.',
  crm: 'I will track status, next action, reminder timing and make sure no lead is forgotten.',
  qc: 'I will check realism, clarity, risk, commercial strength and weak points before approval.',
}

export function createMockAgentResponse(request: AgentChatRequest): AgentChatResponse {
  const historyCount = request.conversationHistory.length
  const promptPreview = request.agentSystemPrompt.trim().slice(0, 140)
  const roleHint = roleHints[request.agentId] ?? 'I will use my system instructions, tools and connected knowledge to prepare a useful response.'

  return {
    agentId: request.agentId,
    timestamp: new Date().toISOString(),
    mock: true,
    assistantMessage: [
      `${request.agentName} online. ${roleHint}`,
      `Received: “${request.userMessage}”`,
      historyCount > 0 ? `I can see ${historyCount} previous message${historyCount === 1 ? '' : 's'} in this conversation.` : 'This is the start of our conversation.',
      promptPreview ? `Using my current instruction layer: ${promptPreview}${request.agentSystemPrompt.length > 140 ? '…' : ''}` : 'No custom system prompt is configured yet.',
      'Next AI step: replace this mock responder in /lib/ai with OpenAI, Claude or OpenClaw bridge integration.',
    ].join('\n\n'),
  }
}
