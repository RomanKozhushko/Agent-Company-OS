import type { AgentChatRequest, AgentChatResponse } from '../agents/chatTypes'

const roleHints: Record<string, string> = {
  boss: 'I will run the Product Lab pipeline, coordinate the agents and make the next Build / Improve / Kill decision.',
  trend: 'I will scan B2B market signals, platform conversations, buyer pain and product opportunity patterns.',
  niche: 'I will validate the micro-niche for pain urgency, buyer clarity, buying power, competition and confidence.',
  architect: 'I will turn validated pain into a premium B2B digital product concept with modules, deliverables and outcomes.',
  prototype: 'I will outline first-version assets such as templates, calculators, SOP packs, checklists, guides or prompt systems.',
  demand: 'I will read 48h demand-test metrics: landing page status, CTR, CPC, signups, buy-now clicks and conversion rate.',
  content: 'I will create content angles, hooks, short video ideas, platform direction and CTAs for demand testing.',
  email: 'I will create lead magnets, email sequences, offer emails, bonuses, deadlines and funnel status.',
  qc: 'I will check usefulness, uniqueness, realism, hallucination risk, business value and buyer clarity before approval.',
}

export function createMockAgentResponse(request: AgentChatRequest): AgentChatResponse {
  const historyCount = request.conversationHistory.length
  const promptPreview = request.agentSystemPrompt.trim().slice(0, 140)
  const roleHint = roleHints[request.agentId] ?? 'I will use my system instructions, tools and connected knowledge to prepare a useful lab response.'

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
