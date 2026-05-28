import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleAgentChat } from './handler'

export default async function agentChat(request: IncomingMessage, response: ServerResponse) {
  await handleAgentChat(request, response)
}
