export interface ConversationHistoryItem {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface AgentChatRequest {
  agentId: string
  agentName: string
  agentSystemPrompt: string
  userMessage: string
  conversationHistory: ConversationHistoryItem[]
}

export interface AgentChatResponse {
  assistantMessage: string
  agentId: string
  timestamp: string
  mock: boolean
}
