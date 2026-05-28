export type AgentStatus = 'Active' | 'Training' | 'Draft' | 'Paused'
export type Priority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'New' | 'In Progress' | 'Waiting for Review' | 'Completed'
export type ProductStage = 'Ideas' | 'Niche Validation' | 'Prototype' | '48h Demand Test' | 'Launch Ready' | 'Killed / Archived'
export type ProductDecision = 'Build' | 'Improve' | 'Kill'

export interface Agent {
  id: string
  name: string
  role: string
  status: AgentStatus
  mission: string
  avatar: string
  tools: string[]
  lastActivity: string
  responsibilities: string
  inputData: string
  outputData: string
  knowledgeBase: string
  businessRules: string
  successMetrics: string
  humanApprovalRequired: boolean
  notes: string
  connectedAgents: string[]
  prompt: string
  trainingProfile: string
  agentId: string
  workload: number
  tasksAssigned: number
  tasksCompleted: number
  tasksInReview: number
  lastActive: string
  connectedAgentIds: string[]
  outputType: string
  approvalRequired: boolean
  priority: Priority
  mapPosition: {
    x: number
    y: number
  }
  visualIdentity: string
  liveState: 'Thinking' | 'Working' | 'Reviewing' | 'Waiting' | 'Idle' | 'Needs Approval'
  currentAction: string
  portraitGradient: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  assignedAgent: string
  status: TaskStatus
  output: string
}

export interface KnowledgeItem {
  id: string
  title: string
  category: string
  description: string
  connectedAgents: string[]
  lastUpdated: string
}

export interface ProductIdea {
  id: string
  productName: string
  targetNiche: string
  customerPain: string
  productPromise: string
  productType: string
  expectedPrice: string
  confidenceScore: number
  stage: ProductStage
  assignedAgents: string[]
  nextAction: string
  validationNotes: string
  createdAt: string
  landingPageStatus: string
  landingPageUrl: string
  adBudget: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  emailSignups: number
  buyNowClicks: number
  conversionRate: number
  decision: ProductDecision
  contentAngles: string[]
  hooks: string[]
  shortVideoIdeas: string[]
  platform: string
  CTA: string
  contentStatus: string
  leadMagnet: string
  emailSequence: string[]
  offerEmail: string
  bonus: string
  deadline: string
  funnelStatus: string
}

export interface ChatMessage {
  id: string
  agentId: string
  sender: 'user' | 'agent'
  text: string
  time: string
}
