import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { initialAgents, initialKnowledge, initialProducts, initialTasks } from './mockData'
import type { Agent, AgentStatus, ChatMessage, KnowledgeItem, Priority, ProductIdea, ProductStage, Task, TaskStatus } from './types'
import type { AgentChatRequest, AgentChatResponse } from '../lib/agents/chatTypes'

const navItems = ['Dashboard', 'Product Lab', 'Demand Tests', 'Content Engine', 'Email Funnel', 'Agents', 'Structure Map', 'Chat', 'Tasks', 'Knowledge Base', 'Settings'] as const
type View = (typeof navItems)[number]
const statuses: AgentStatus[] = ['Active', 'Training', 'Draft', 'Paused']
const priorities: Priority[] = ['Low', 'Medium', 'High']
const taskStatuses: TaskStatus[] = ['New', 'In Progress', 'Waiting for Review', 'Completed']
const characterImageByAgent: Record<string, string> = { boss: 'boss', trend: 'market', niche: 'crm', architect: 'offer', prototype: 'website', demand: 'sales', content: 'website', email: 'crm', qc: 'qc' }
const productStages: ProductStage[] = ['Ideas', 'Niche Validation', 'Prototype', '48h Demand Test', 'Launch Ready', 'Killed / Archived']

const uid = () => Math.random().toString(36).slice(2, 9)
const emptyAgent = (): Agent => ({
  id: `agent-${uid()}`,
  name: '',
  role: '',
  status: 'Draft',
  mission: '',
  avatar: '✧',
  tools: [],
  lastActivity: 'Just created',
  responsibilities: '',
  inputData: '',
  outputData: '',
  knowledgeBase: '',
  businessRules: '',
  successMetrics: '',
  humanApprovalRequired: true,
  notes: '',
  connectedAgents: ['boss'],
  prompt: '',
  trainingProfile: 'Custom training profile for this lab operator.',
  agentId: `AG-${Math.floor(Math.random() * 900 + 100)}`,
  workload: 12,
  tasksAssigned: 0,
  tasksCompleted: 0,
  tasksInReview: 0,
  lastActive: 'Just now',
  connectedAgentIds: ['boss'],
  outputType: 'Custom output',
  approvalRequired: true,
  priority: 'Medium',
  mapPosition: { x: 50, y: 58 },
  visualIdentity: 'Custom AI worker',
  liveState: 'Idle',
  currentAction: 'Awaiting assignment',
  portraitGradient: 'custom',
})

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'Active' || status === 'Completed' ? 'emerald' :
    status === 'High' || status === 'Waiting for Review' ? 'rose' :
    status === 'Training' || status === 'In Progress' || status === 'Medium' ? 'amber' : 'slate'
  return <span className={`badge badge-${tone}`}>{status}</span>
}

function SidebarNavigation({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand-mark"><span>RD</span><div><b>Agent Company OS</b><small>AI-R&D Lab</small></div></div>
      <nav className="nav-list">
        {navItems.map((item) => <button key={item} onClick={() => setView(item)} className={view === item ? 'active' : ''}>{item}</button>)}
      </nav>
      <div className="side-card">
        <span className="pulse" />
        <b>System online</b>
        <p>AI-R&D Lab mode. Product pipeline and mock API layer ready.</p>
      </div>
    </aside>
  )
}

function DashboardHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="dashboard-hero glass-panel">
      <div>
        <p className="eyebrow">AI-R&D Lab for Premium B2B Digital Products</p>
        <h1>Agent Company OS</h1>
        <p className="subtitle">Analyse trends, validate micro-niches, build premium prototypes and test demand</p>
      </div>
      <button className="primary-btn" onClick={onAdd}>Add Lab Agent</button>
    </header>
  )
}

function SummaryCards({ products }: { agents: Agent[]; tasks: Task[]; products: ProductIdea[] }) {
  const activeDemandTests = products.filter((product) => product.stage === '48h Demand Test').length
  const launchReady = products.filter((product) => product.stage === 'Launch Ready').length
  const killed = products.filter((product) => product.stage === 'Killed / Archived').length
  const averageConfidence = Math.round(products.reduce((sum, product) => sum + product.confidenceScore, 0) / Math.max(products.length, 1))
  const nextDecision = products.find((product) => product.stage === '48h Demand Test')?.decision ?? 'Improve'
  const cards = [
    ['Products in Lab', products.length.toString(), 'active candidates'],
    ['Active Demand Tests', activeDemandTests.toString(), '48h validation'],
    ['Launch Ready Products', launchReady.toString(), 'ready to sell'],
    ['Killed Ideas', killed.toString(), 'archived fast'],
    ['Average Confidence Score', `${averageConfidence}%`, 'portfolio signal'],
    ['Next Product Decision', nextDecision, 'Build / Improve / Kill'],
  ]
  return <section className="summary-grid">{cards.map(([label, value, hint]) => <div className="metric-card glass-panel" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>)}</section>
}

type StructureFilter = 'All' | 'Active' | 'Needs Attention' | 'Training' | 'Draft' | 'High workload' | 'Needs review'
type StructureViewMode = 'Command Map' | 'Grid View' | 'Table View'
const primaryStructureFilters: StructureFilter[] = ['All', 'Active', 'Needs Attention']
const advancedStructureFilters: StructureFilter[] = ['Training', 'Draft', 'High workload', 'Needs review']
const structureViewModes: StructureViewMode[] = ['Command Map', 'Grid View', 'Table View']

function isConnectedToSelected(agent: Agent, selectedAgent: Agent) {
  return agent.id === selectedAgent.id || selectedAgent.connectedAgentIds.includes(agent.id) || agent.connectedAgentIds.includes(selectedAgent.id)
}

function filteredStructureAgents(agents: Agent[], filter: StructureFilter) {
  if (filter === 'Active') return agents.filter((agent) => agent.status === 'Active')
  if (filter === 'Needs Attention') return agents.filter((agent) => agent.tasksInReview > 0 || agent.workload >= 70 || agent.liveState === 'Needs Approval')
  if (filter === 'Training') return agents.filter((agent) => agent.status === 'Training')
  if (filter === 'Draft') return agents.filter((agent) => agent.status === 'Draft')
  if (filter === 'High workload') return agents.filter((agent) => agent.workload >= 70)
  if (filter === 'Needs review') return agents.filter((agent) => agent.tasksInReview > 0)
  return agents
}

function StructureMapFilters({ filter, setFilter, viewMode, setViewMode }: { filter: StructureFilter; setFilter: (filter: StructureFilter) => void; viewMode: StructureViewMode; setViewMode: (mode: StructureViewMode) => void }) {
  return <div className="structure-toolbar simplified-toolbar"><div className="structure-filter-group primary-filters">{primaryStructureFilters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}<label className="advanced-filter-select"><span>More</span><select value={advancedStructureFilters.includes(filter) ? filter : ''} onChange={(event) => setFilter((event.target.value || 'All') as StructureFilter)}><option value="">Advanced filters</option>{advancedStructureFilters.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><div className="structure-filter-group view-modes">{structureViewModes.map((item) => <button key={item} className={viewMode === item ? 'active' : ''} onClick={() => setViewMode(item)}>{item}</button>)}</div></div>
}

function AgentConnectionLines({ agents, selectedAgent }: { agents: Agent[]; selectedAgent: Agent }) {
  const boss = agents.find((agent) => agent.id === 'boss') ?? agents[0]
  if (!boss) return null
  return <svg className="connection-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="commandLine" x1="0" x2="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient></defs>
    {agents.filter((agent) => agent.id !== boss.id).map((agent) => {
      const highlighted = isConnectedToSelected(agent, selectedAgent) || selectedAgent.id === boss.id
      return <line key={agent.id} x1={boss.mapPosition.x} y1={boss.mapPosition.y + 8} x2={agent.mapPosition.x} y2={agent.mapPosition.y} className={highlighted ? 'connection-line active' : 'connection-line'} />
    })}
  </svg>
}

function AgentPerson({ agent }: { agent: Agent }) {
  return <div className={`ai-character-frame character-${agent.portraitGradient}`} aria-label={`${agent.name} AI character`}>
    <span className="character-orbit" />
    <img src={`/characters/${characterImageByAgent[agent.id] ?? agent.id}.png`} alt={`${agent.name} AI character portrait`} onError={(event) => { event.currentTarget.style.display = 'none' }} />
    <div className="character-fallback"><span>{agent.avatar}</span></div>
  </div>
}

function LiveStatePill({ state }: { state: Agent['liveState'] }) {
  return <span className={`live-state live-${state.toLowerCase().replaceAll(' ', '-')}`}><i />{state}</span>
}

function AgentNode3D({ agent, selectedAgent, onSelect, onOpen }: { agent: Agent; selectedAgent: Agent; onSelect: (id: string) => void; onOpen?: (id: string) => void }) {
  const selected = agent.id === selectedAgent.id
  const related = isConnectedToSelected(agent, selectedAgent)
  const isBoss = agent.id === 'boss'
  return <button className={`agent-node-3d worker-node agent-${agent.id} ${isBoss ? 'boss-worker' : ''} ${selected ? 'selected' : ''} ${related ? 'related' : 'dimmed'} identity-${agent.portraitGradient}`} style={{ left: `${agent.mapPosition.x}%`, top: `${agent.mapPosition.y}%` }} onClick={() => onSelect(agent.id)}>
    <span className="node-glow" />
    <AgentPerson agent={agent} />
    <div className="worker-copy">
      <LiveStatePill state={agent.liveState} />
      <h3>{agent.name}</h3>
      <p className="worker-role">{agent.visualIdentity}</p>
      <p className="worker-action">{agent.currentAction}</p>
    </div>
    <span className="node-tooltip">{agent.role} · {agent.outputType}</span>
    {onOpen && <span className="node-open" onClick={(event) => { event.stopPropagation(); onOpen(agent.id) }}>Open Agent</span>}
  </button>
}

function DigitalCommandMap({ agents, selectedAgent, onSelect, onOpen, fullPage = false }: { agents: Agent[]; selectedAgent: Agent; onSelect: (id: string) => void; onOpen?: (id: string) => void; fullPage?: boolean }) {
  return <div className={`command-map-stage ${fullPage ? 'office-stage asset-boardroom-stage' : ''}`}><img className="boardroom-scene-asset" src="/boardroom/agent-company-boardroom.png" alt="AI agents seated around a futuristic boardroom table" /><div className="boardroom-asset-vignette" /><div className="office-backwall" /><div className="office-holo-table" /><div className="map-grid-plane" /><AgentConnectionLines agents={agents} selectedAgent={selectedAgent} />{agents.map((agent) => <AgentNode3D key={agent.id} agent={agent} selectedAgent={selectedAgent} onSelect={onSelect} onOpen={onOpen} />)}</div>
}

function AgentAccountingPanel({ agent, agents }: { agent: Agent; agents: Agent[] }) {
  const connectedNames = agent.connectedAgentIds.map((id) => agents.find((item) => item.id === id)?.name).filter(Boolean).join(', ')
  const rows = [
    ['Agent ID', agent.agentId], ['Status', agent.status], ['Role', agent.role], ['Live state', agent.liveState], ['Current activity', agent.currentAction], ['Tasks assigned', agent.tasksAssigned], ['Tasks completed', agent.tasksCompleted], ['Tasks waiting for review', agent.tasksInReview], ['Current workload', `${agent.workload}%`], ['Last active time', agent.lastActive], ['Connected agents', connectedNames || 'None'], ['Main output type', agent.outputType], ['Human approval required', agent.approvalRequired ? 'Yes' : 'No'], ['Priority', agent.priority],
  ]
  return <aside className="accounting-panel glass-panel"><div className="panel-head selected-agent-head"><div><p className="eyebrow">Selected agent</p><h2>{agent.name}</h2><small>{agent.visualIdentity}</small></div><AgentPerson agent={agent} /></div><p className="selected-agent-mission">{agent.mission}</p><div className="account-workload"><span>Workload</span><strong>{agent.workload}%</strong><div className="workload-track"><i style={{ width: `${agent.workload}%` }} /></div></div><div className="accounting-rows">{rows.map(([label, value]) => <div key={label.toString()}><span>{label}</span><b>{value}</b></div>)}</div><div className="prompt-preview"><span>Prompt / system instruction preview</span><p>{agent.prompt}</p></div></aside>
}

function StructureStatsBar({ agents }: { agents: Agent[] }) {
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksAssigned, 0)
  const avgLoad = Math.round(agents.reduce((sum, agent) => sum + agent.workload, 0) / Math.max(agents.length, 1))
  const active = agents.filter((agent) => agent.status === 'Active').length
  return <div className="structure-stats-bar glass-panel"><div><span>Total agents</span><b>{agents.length}</b></div><div><span>Active agents</span><b>{active}</b></div><div><span>Total tasks</span><b>{totalTasks}</b></div><div><span>Average workload</span><b>{avgLoad}%</b></div></div>
}

function AgentGridView({ agents, selectedAgent, onSelect }: { agents: Agent[]; selectedAgent: Agent; onSelect: (id: string) => void }) {
  return <div className="structure-grid-view premium-agent-grid">{agents.map((agent) => <button key={agent.id} className={`premium-agent-tile identity-${agent.portraitGradient} ${selectedAgent.id === agent.id ? 'selected' : ''}`} onClick={() => onSelect(agent.id)}><div className="tile-portrait"><AgentPerson agent={agent} /></div><div className="tile-copy"><LiveStatePill state={agent.liveState} /><h3>{agent.name}</h3><p>{agent.visualIdentity}</p><small>{agent.currentAction}</small></div><span className="tile-orbit" /></button>)}</div>
}

function AgentTableView({ agents, selectedId, onSelect }: { agents: Agent[]; selectedId: string; onSelect: (id: string) => void }) {
  return <div className="agent-table-view glass-panel"><table><thead><tr><th>Agent</th><th>Status</th><th>Role</th><th>Tasks</th><th>Review</th><th>Workload</th><th>Output</th><th>Approval</th></tr></thead><tbody>{agents.map((agent) => <tr key={agent.id} className={selectedId === agent.id ? 'selected' : ''} onClick={() => onSelect(agent.id)}><td><b>{agent.name}</b><small>{agent.agentId}</small></td><td><StatusBadge status={agent.status} /></td><td>{agent.role}</td><td>{agent.tasksCompleted}/{agent.tasksAssigned}</td><td>{agent.tasksInReview}</td><td>{agent.workload}%</td><td>{agent.outputType}</td><td>{agent.approvalRequired ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div>
}

function AgentStructureMap({ agents, selectedId, onSelect, onOpen, fullPage = false }: { agents: Agent[]; selectedId: string; onSelect: (id: string) => void; onOpen?: (id: string) => void; fullPage?: boolean }) {
  const [filter, setFilter] = useState<StructureFilter>('All')
  const [viewMode, setViewMode] = useState<StructureViewMode>('Command Map')
  const selectedAgent = agents.find((agent) => agent.id === selectedId) ?? agents[0]
  const visibleAgents = filteredStructureAgents(agents, filter)
  if (!selectedAgent) return null
  return (
    <section className={`structure structure-command glass-panel ${fullPage ? 'structure-full-page' : ''}`}>
      <div className="section-title"><div><p className="eyebrow">Lab Structure Map</p><h2>AI-R&D Product Lab</h2><span className="map-subtitle">Trend research, micro-niche validation, prototype creation and launch testing — details stay in the selected-agent panel</span></div><span>{visibleAgents.length}/{agents.length} agents visible</span></div>
      <StructureMapFilters filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} />
      <div className="structure-command-layout">
        <div className="structure-main-area">
          {viewMode === 'Command Map' && <DigitalCommandMap agents={visibleAgents} selectedAgent={selectedAgent} onSelect={onSelect} onOpen={onOpen} fullPage={fullPage} />}
          {viewMode === 'Grid View' && <AgentGridView agents={visibleAgents} selectedAgent={selectedAgent} onSelect={onSelect} />}
          {viewMode === 'Table View' && <AgentTableView agents={visibleAgents} selectedId={selectedAgent.id} onSelect={onSelect} />}
        </div>
        <AgentAccountingPanel agent={selectedAgent} agents={agents} />
      </div>
      <StructureStatsBar agents={agents} />
    </section>
  )
}

function AgentCard({ agent, onOpen, onChat }: { agent: Agent; onOpen: () => void; onChat: () => void }) {
  return (
    <article className="agent-card glass-panel">
      <div className="agent-top"><div className="avatar">{agent.avatar}</div><StatusBadge status={agent.status} /></div>
      <h3>{agent.name}</h3><p className="role">{agent.role}</p><p className="mission">{agent.mission}</p>
      <div className="tool-row">{agent.tools.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}</div>
      <small className="activity">{agent.lastActivity}</small>
      <div className="card-actions"><button onClick={onOpen}>Open Agent</button><button onClick={onChat}>Chat</button></div>
    </article>
  )
}

function AgentList({ agents, onOpen, onChat }: { agents: Agent[]; onOpen: (id: string) => void; onChat: (id: string) => void }) {
  return <section className="agent-grid">{agents.map((agent) => <AgentCard key={agent.id} agent={agent} onOpen={() => onOpen(agent.id)} onChat={() => onChat(agent.id)} />)}</section>
}

function Field({ label, value, onChange, textarea = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return <label className="field"><span>{label}</span>{textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}</label>
}

function AgentDetailPanel({ agent, agents, onSave, onDuplicate, onDelete, onChat, onAssign, onClose }: { agent: Agent; agents: Agent[]; onSave: (agent: Agent) => void; onDuplicate: (agent: Agent) => void; onDelete: (id: string) => void; onChat: (id: string) => void; onAssign: (id: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(agent)
  const set = <K extends keyof Agent>(key: K, value: Agent[K]) => setDraft((a) => ({ ...a, [key]: value }))
  return (
    <aside className="detail-panel glass-panel">
      <div className="panel-head"><div><p className="eyebrow">Agent profile</p><h2>{agent.name}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div>
      <div className="form-grid">
        <Field label="Agent Name" value={draft.name} onChange={(v) => set('name', v)} />
        <Field label="Role" value={draft.role} onChange={(v) => set('role', v)} />
        <label className="field"><span>Status</span><select value={draft.status} onChange={(e) => set('status', e.target.value as AgentStatus)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
        <Field label="Mission" value={draft.mission} onChange={(v) => set('mission', v)} textarea />
        <Field label="Main Responsibilities" value={draft.responsibilities} onChange={(v) => set('responsibilities', v)} textarea />
        <Field label="Input Data" value={draft.inputData} onChange={(v) => set('inputData', v)} textarea />
        <Field label="Output Data" value={draft.outputData} onChange={(v) => set('outputData', v)} textarea />
        <Field label="Tools" value={draft.tools.join(', ')} onChange={(v) => set('tools', v.split(',').map((x) => x.trim()).filter(Boolean))} />
        <Field label="Knowledge Base" value={draft.knowledgeBase} onChange={(v) => set('knowledgeBase', v)} textarea />
        <Field label="Business Rules" value={draft.businessRules} onChange={(v) => set('businessRules', v)} textarea />
        <Field label="Success Metrics" value={draft.successMetrics} onChange={(v) => set('successMetrics', v)} textarea />
        <label className="field"><span>Human Approval Required</span><select value={draft.humanApprovalRequired ? 'Yes' : 'No'} onChange={(e) => set('humanApprovalRequired', e.target.value === 'Yes')}><option>Yes</option><option>No</option></select></label>
        <Field label="Notes" value={draft.notes} onChange={(v) => set('notes', v)} textarea />
        <label className="field"><span>Connected Agents</span><select multiple value={draft.connectedAgents} onChange={(e) => set('connectedAgents', Array.from(e.target.selectedOptions).map((o) => o.value))}>{agents.filter((a) => a.id !== draft.id).map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label>
        <Field label="Training Profile" value={draft.trainingProfile} onChange={(v) => set('trainingProfile', v)} textarea />
        <Field label="Prompt / System Instructions" value={draft.prompt} onChange={(v) => set('prompt', v)} textarea />
      </div>
      <div className="panel-actions"><button className="primary-btn" onClick={() => onSave(draft)}>Save Changes</button><button onClick={() => onDuplicate(draft)}>Duplicate Agent</button><button onClick={() => onDelete(draft.id)}>Delete Agent</button><button onClick={() => onChat(draft.id)}>Start Chat</button><button onClick={() => onAssign(draft.id)}>Assign Task</button></div>
    </aside>
  )
}

function AddAgentModal({ agents, onAdd, onClose }: { agents: Agent[]; onAdd: (agent: Agent) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(emptyAgent())
  const submit = (event: FormEvent) => { event.preventDefault(); if (!draft.name.trim()) return; onAdd({ ...draft, id: `agent-${uid()}` }); onClose() }
  return (
    <div className="modal-backdrop"><form className="modal glass-panel" onSubmit={submit}>
      <div className="panel-head"><div><p className="eyebrow">Create operator</p><h2>Add New Agent</h2></div><button type="button" className="icon-btn" onClick={onClose}>×</button></div>
      <Field label="Agent Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
      <Field label="Agent Type" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
      <Field label="Mission" value={draft.mission} onChange={(v) => setDraft({ ...draft, mission: v })} textarea />
      <Field label="Responsibilities" value={draft.responsibilities} onChange={(v) => setDraft({ ...draft, responsibilities: v })} textarea />
      <Field label="Tools" value={draft.tools.join(', ')} onChange={(v) => setDraft({ ...draft, tools: v.split(',').map((x) => x.trim()).filter(Boolean) })} />
      <Field label="Knowledge Sources" value={draft.knowledgeBase} onChange={(v) => setDraft({ ...draft, knowledgeBase: v })} />
      <Field label="Output Format" value={draft.outputData} onChange={(v) => setDraft({ ...draft, outputData: v })} />
      <label className="field"><span>Connected To</span><select value={draft.connectedAgents[0] ?? 'boss'} onChange={(e) => setDraft({ ...draft, connectedAgents: [e.target.value] })}>{agents.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label>
      <label className="field"><span>Status</span><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as AgentStatus })}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
      <Field label="Custom Instructions" value={draft.prompt} onChange={(v) => setDraft({ ...draft, prompt: v })} textarea />
      <button className="primary-btn" type="submit">Save Agent</button>
    </form></div>
  )
}

function AgentChat({ agent, messages, onSend }: { agent: Agent; messages: ChatMessage[]; onSend: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const quick = ['Analyse this product opportunity', 'Validate this micro-niche', 'Design product lab stage gates', 'Read demand-test metrics', 'Create content + email assets', 'Recommend Build / Improve / Kill']
  const send = async (value = text) => {
    if (!value.trim() || sending) return
    setSending(true)
    setText('')
    await onSend(value)
    setSending(false)
  }
  return <section className="chat-shell glass-panel"><aside className="chat-profile"><div className="avatar big">{agent.avatar}</div><h2>{agent.name}</h2><p>{agent.role}</p><StatusBadge status={agent.status} /><p className="mission">{agent.mission}</p></aside><main className="chat-main"><div className="quick-prompts">{quick.map((q) => <button key={q} onClick={() => void send(q)} disabled={sending}>{q}</button>)}</div><div className="messages">{messages.map((m) => <div key={m.id} className={`message ${m.sender}`}><span>{m.text}</span><small>{m.time}</small></div>)}{sending && <div className="message agent"><span>{agent.name} is thinking through the backend endpoint…</span><small>API-ready mock</small></div>}</div><div className="composer"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void send()} placeholder={`Message ${agent.name}...`} disabled={sending} /><button className="primary-btn" onClick={() => void send()} disabled={sending}>{sending ? 'Sending…' : 'Send'}</button></div></main></section>
}

function TaskBoard({ tasks, agents, onAddTask, onMove }: { tasks: Task[]; agents: Agent[]; onAddTask: (task: Task) => void; onMove: (id: string, status: TaskStatus) => void }) {
  const [draft, setDraft] = useState<Task>({ id: `task-${uid()}`, title: '', description: '', priority: 'Medium', dueDate: '', assignedAgent: agents[0]?.id ?? '', status: 'New', output: '' })
  const submit = (e: FormEvent) => { e.preventDefault(); if (!draft.title.trim()) return; onAddTask({ ...draft, id: `task-${uid()}` }); setDraft({ ...draft, title: '', description: '', output: '' }) }
  return <section className="task-layout"><form className="task-form glass-panel" onSubmit={submit}><h2>Assign Task</h2><Field label="Task Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} /><Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} textarea /><label className="field"><span>Priority</span><select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}>{priorities.map((p) => <option key={p}>{p}</option>)}</select></label><label className="field"><span>Due Date</span><input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></label><label className="field"><span>Assigned Agent</span><select value={draft.assignedAgent} onChange={(e) => setDraft({ ...draft, assignedAgent: e.target.value })}>{agents.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label><Field label="Output / Result" value={draft.output} onChange={(v) => setDraft({ ...draft, output: v })} textarea /><button className="primary-btn">Create Task</button></form><div className="board">{taskStatuses.map((status) => <div className="board-column glass-panel" key={status}><h3>{status}</h3>{tasks.filter((t) => t.status === status).map((task) => <article className="task-card" key={task.id}><div><b>{task.title}</b><StatusBadge status={task.priority} /></div><p>{task.description}</p><small>{agents.find((a) => a.id === task.assignedAgent)?.name} · Due {task.dueDate || 'not set'}</small><select value={task.status} onChange={(e) => onMove(task.id, e.target.value as TaskStatus)}>{taskStatuses.map((s) => <option key={s}>{s}</option>)}</select>{task.output && <em>{task.output}</em>}</article>)}</div>)}</div></section>
}

function KnowledgeBase({ items, agents, onAdd }: { items: KnowledgeItem[]; agents: Agent[]; onAdd: (item: KnowledgeItem) => void }) {
  const [draft, setDraft] = useState({ title: '', category: 'Research & Validation', description: '', connectedAgents: [agents[0]?.id ?? 'boss'] })
  const submit = (e: FormEvent) => { e.preventDefault(); if (!draft.title.trim()) return; onAdd({ ...draft, id: `k-${uid()}`, lastUpdated: 'Just now' }); setDraft({ ...draft, title: '', description: '' }) }
  return <section className="knowledge-layout"><form className="glass-panel kb-form" onSubmit={submit}><h2>Knowledge Base</h2><Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} /><Field label="Category" value={draft.category} onChange={(v) => setDraft({ ...draft, category: v })} /><Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} textarea /><label className="field"><span>Connected agents</span><select multiple value={draft.connectedAgents} onChange={(e) => setDraft({ ...draft, connectedAgents: Array.from(e.target.selectedOptions).map((o) => o.value) })}>{agents.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select></label><button className="primary-btn">Store Knowledge</button></form><div className="knowledge-grid">{items.map((item) => <article className="knowledge-card glass-panel" key={item.id}><p className="eyebrow">{item.category}</p><h3>{item.title}</h3><p>{item.description}</p><small>{item.connectedAgents.map((id) => agents.find((a) => a.id === id)?.name).filter(Boolean).join(', ')} · {item.lastUpdated}</small></article>)}</div></section>
}

function ProductLab({ products, agents }: { products: ProductIdea[]; agents: Agent[] }) {
  return <section className="product-lab-page"><div className="page-head"><div><p className="eyebrow">Product Lab</p><h1>Premium B2B Product Pipeline</h1><span>Ideas → validation → prototype → 48h demand test → launch decision</span></div></div><div className="product-pipeline">{productStages.map((stage) => <div className="product-stage glass-panel" key={stage}><h3>{stage}</h3>{products.filter((product) => product.stage === stage).map((product) => <article className="product-card" key={product.id}><div className="product-card-head"><b>{product.productName}</b><StatusBadge status={`${product.confidenceScore}%`} /></div><p>{product.productPromise}</p><small>{product.targetNiche}</small><div className="product-meta"><span>{product.productType}</span><span>{product.expectedPrice}</span><span>{product.decision}</span></div><em>{product.nextAction}</em><small>{product.assignedAgents.map((id) => agents.find((agent) => agent.id === id)?.name).filter(Boolean).join(', ')}</small></article>)}</div>)}</div></section>
}

function DemandTests({ products }: { products: ProductIdea[] }) {
  return <section className="lab-table-page"><div className="page-head"><div><p className="eyebrow">Demand Tests</p><h1>48h Validation Metrics</h1></div></div><div className="agent-table-view glass-panel"><table><thead><tr><th>Product</th><th>Landing</th><th>Budget</th><th>Impressions</th><th>Clicks</th><th>CTR</th><th>CPC</th><th>Signups</th><th>Buy Now</th><th>Conv.</th><th>Decision</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><b>{product.productName}</b><small>{product.landingPageUrl || 'No URL yet'}</small></td><td>{product.landingPageStatus}</td><td>£{product.adBudget}</td><td>{product.impressions}</td><td>{product.clicks}</td><td>{product.ctr}%</td><td>£{product.cpc}</td><td>{product.emailSignups}</td><td>{product.buyNowClicks}</td><td>{product.conversionRate}%</td><td><StatusBadge status={product.decision} /></td></tr>)}</tbody></table></div></section>
}

function ContentEngine({ products }: { products: ProductIdea[] }) {
  return <section className="knowledge-layout"><div className="glass-panel kb-form"><p className="eyebrow">Content Engine</p><h2>Angles, Hooks & Short-Video Ideas</h2><p className="mission">Content exists to test pain, product promise and market pull before overbuilding.</p></div><div className="knowledge-grid">{products.map((product) => <article className="knowledge-card glass-panel" key={product.id}><p className="eyebrow">{product.platform} · {product.contentStatus}</p><h3>{product.productName}</h3><p><b>Angles:</b> {product.contentAngles.join(' / ')}</p><p><b>Hooks:</b> {product.hooks.join(' ')}</p><p><b>Short videos:</b> {product.shortVideoIdeas.join(' / ')}</p><small>CTA: {product.CTA}</small></article>)}</div></section>
}

function EmailFunnel({ products }: { products: ProductIdea[] }) {
  return <section className="knowledge-layout"><div className="glass-panel kb-form"><p className="eyebrow">Email Funnel</p><h2>B2B Sales Engine Assets</h2><p className="mission">Lead magnets, sequences and offer emails turn validation traffic into buyer intent.</p></div><div className="knowledge-grid">{products.map((product) => <article className="knowledge-card glass-panel" key={product.id}><p className="eyebrow">{product.funnelStatus}</p><h3>{product.productName}</h3><p><b>Lead magnet:</b> {product.leadMagnet}</p><p><b>Sequence:</b> {product.emailSequence.join(' → ')}</p><p><b>Offer email:</b> {product.offerEmail}</p><small>Bonus: {product.bonus} · Deadline: {product.deadline}</small></article>)}</div></section>
}

function SettingsPage() {
  return <section className="settings-grid">{['Lab name', 'Positioning', 'Default approval mode', 'Agent status options', 'Task priority options', 'AI provider placeholder', 'Export / Import product pipeline'].map((label, index) => <label className="field glass-panel" key={label}><span>{label}</span><input defaultValue={index === 0 ? 'Agent Company OS' : index === 1 ? 'AI-R&D Lab for Premium B2B Digital Products' : ''} placeholder="Configure later" /></label>)}</section>
}

function Dashboard({ agents, tasks, products, onAdd, onOpen }: { agents: Agent[]; tasks: Task[]; products: ProductIdea[]; onAdd: () => void; onOpen: (id: string) => void }) {
  return <><DashboardHeader onAdd={onAdd} /><SummaryCards agents={agents} tasks={tasks} products={products} /><div className="dashboard-command-room"><AgentStructureMap agents={agents} selectedId="boss" onSelect={onOpen} onOpen={onOpen} fullPage /></div><section className="activity-feed glass-panel dashboard-activity"><div className="section-title"><div><p className="eyebrow">Live feed</p><h2>Recent agent activity</h2></div></div>{agents.slice(0, 6).map((a) => <div className="activity-item" key={a.id}><span>{a.avatar}</span><div><b>{a.name}</b><p>{a.lastActivity}</p></div></div>)}</section></>
}

function App() {
  const [view, setView] = useState<View>('Dashboard')
  const [agents, setAgents] = useState(initialAgents)
  const [tasks, setTasks] = useState(initialTasks)
  const [knowledge, setKnowledge] = useState(initialKnowledge)
  const [products] = useState(initialProducts)
  const [selectedAgentId, setSelectedAgentId] = useState('boss')
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'm1', agentId: 'boss', sender: 'agent', text: 'AI-R&D Lab online. Give me a trend, niche or product idea and I will route it through research, validation, prototype, offer, launch and quality review.', time: '07:15' }])
  const selectedAgent = useMemo(() => agents.find((a) => a.id === selectedAgentId) ?? agents[0], [agents, selectedAgentId])
  const openAgent = (id: string) => { setSelectedAgentId(id); setDetailOpen(true) }
  const openChat = (id: string) => { setSelectedAgentId(id); setView('Chat'); setDetailOpen(false) }
  const saveAgent = (agent: Agent) => setAgents((list) => list.map((a) => a.id === agent.id ? { ...agent, lastActivity: 'Profile edited · just now' } : a))
  const duplicateAgent = (agent: Agent) => setAgents((list) => [...list, { ...agent, id: `agent-${uid()}`, name: `${agent.name} Copy`, status: 'Draft', lastActivity: 'Duplicated · just now' }])
  const deleteAgent = (id: string) => { if (agents.length <= 1) return; setAgents((list) => list.filter((a) => a.id !== id)); setSelectedAgentId('boss'); setDetailOpen(false) }
  const sendMessage = async (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage: ChatMessage = { id: `m-${uid()}`, agentId: selectedAgent.id, sender: 'user', text, time }
    const conversationForAgent = messages.filter((message) => message.agentId === selectedAgent.id)

    setMessages((list) => [...list, userMessage])

    const payload: AgentChatRequest = {
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
      agentSystemPrompt: selectedAgent.prompt,
      userMessage: text,
      conversationHistory: conversationForAgent.map((message) => ({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text,
        timestamp: message.time,
      })),
    }

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error(`Agent chat failed with ${response.status}`)

      const result = await response.json() as AgentChatResponse
      const replyTime = new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages((list) => [...list, { id: `m-${uid()}`, agentId: result.agentId, sender: 'agent', text: result.assistantMessage, time: replyTime }])
      setAgents((list) => list.map((a) => a.id === selectedAgent.id ? { ...a, lastActivity: `Chat handled via /api/agents/chat · ${replyTime}` } : a))
    } catch (error) {
      console.error(error)
      setMessages((list) => [...list, { id: `m-${uid()}`, agentId: selectedAgent.id, sender: 'agent', text: 'Backend chat endpoint failed. Check the local dev server and try again.', time }])
    }
  }
  const render = () => {
    if (view === 'Dashboard') return <Dashboard agents={agents} tasks={tasks} products={products} onAdd={() => setAddOpen(true)} onOpen={openAgent} />
    if (view === 'Product Lab') return <ProductLab products={products} agents={agents} />
    if (view === 'Demand Tests') return <DemandTests products={products} />
    if (view === 'Content Engine') return <ContentEngine products={products} />
    if (view === 'Email Funnel') return <EmailFunnel products={products} />
    if (view === 'Agents') return <><div className="page-head"><div><p className="eyebrow">Agent registry</p><h1>AI-R&D Lab Team</h1></div><button className="primary-btn" onClick={() => setAddOpen(true)}>Add Lab Agent</button></div><AgentList agents={agents} onOpen={openAgent} onChat={openChat} /></>
    if (view === 'Structure Map') return <AgentStructureMap agents={agents} selectedId={selectedAgentId} onSelect={setSelectedAgentId} onOpen={openAgent} fullPage />
    if (view === 'Chat') return <AgentChat agent={selectedAgent} messages={messages.filter((m) => m.agentId === selectedAgent.id || m.agentId === 'boss')} onSend={sendMessage} />
    if (view === 'Tasks') return <TaskBoard tasks={tasks} agents={agents} onAddTask={(task) => setTasks((list) => [task, ...list])} onMove={(id, status) => setTasks((list) => list.map((t) => t.id === id ? { ...t, status } : t))} />
    if (view === 'Knowledge Base') return <KnowledgeBase items={knowledge} agents={agents} onAdd={(item) => setKnowledge((list) => [item, ...list])} />
    return <SettingsPage />
  }
  return <div className="app-shell"><SidebarNavigation view={view} setView={setView} /><main className="content">{render()}</main>{detailOpen && selectedAgent && <AgentDetailPanel agent={selectedAgent} agents={agents} onSave={saveAgent} onDuplicate={duplicateAgent} onDelete={deleteAgent} onChat={openChat} onAssign={(id) => { setSelectedAgentId(id); setView('Tasks'); setDetailOpen(false) }} onClose={() => setDetailOpen(false)} />}{addOpen && <AddAgentModal agents={agents} onAdd={(agent) => { setAgents((list) => [...list, agent]); setSelectedAgentId(agent.id) }} onClose={() => setAddOpen(false)} />}</div>
}

export default App
