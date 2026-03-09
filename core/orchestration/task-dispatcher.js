/**
 * Task Dispatcher — com integração LLM real
 *
 * AIDEV-NOTE: ADR-002 — LLM-Agnostic via provedor abstrato
 * Integrado com llm-provider.js para execução real de agentes
 */

import { EventEmitter } from 'node:events'
import fs from 'node:fs'
import path from 'node:path'
import { ask, getBestProvider } from '../llm/llm-provider.js'

export class TaskDispatcher extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.queue = []
    this.executing = new Map()
    this.completed = []
  }

  async dispatch(agentName, task, options = {}) {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.emit('task:dispatched', { taskId, agent: agentName, task })

    const taskInfo = {
      id: taskId,
      agent: agentName,
      task,
      options,
      status: 'pending',
      createdAt: Date.now(),
    }

    this.queue.push(taskInfo)
    return this.execute(taskInfo)
  }

  async execute(taskInfo) {
    taskInfo.status = 'executing'
    taskInfo.startedAt = Date.now()
    this.executing.set(taskInfo.id, taskInfo)
    this.emit('task:executing', taskInfo)

    try {
      const result = await this.executeWithLLM(taskInfo)

      taskInfo.status = 'completed'
      taskInfo.completedAt = Date.now()
      taskInfo.result = result

      this.completed.push(taskInfo)
      this.executing.delete(taskInfo.id)

      this.emit('task:completed', taskInfo)
      return result
    } catch (error) {
      taskInfo.status = 'failed'
      taskInfo.error = error.message
      taskInfo.failedAt = Date.now()
      this.executing.delete(taskInfo.id)
      this.emit('task:failed', taskInfo)
      throw error
    }
  }

  /**
   * Carrega o system prompt do agente a partir do arquivo .md
   */
  loadAgentPrompt(agentName) {
    const locations = [
      path.join(process.cwd(), '.agents/agents', `${agentName}.md`),
      path.join(process.cwd(), 'agents', agentName, 'AGENT.md'),
      path.join(new URL('../../agents', import.meta.url).pathname, agentName, 'AGENT.md'),
    ]

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        return fs.readFileSync(loc, 'utf-8')
      }
    }

    // Prompt genérico se o agente não tiver arquivo
    return `Você é ${agentName}, um agente especializado do framework Cleudocode.
Responda sempre em português brasileiro.
Seja preciso, técnico e direto.`
  }

  /**
   * Executa tarefa com LLM real
   */
  async executeWithLLM(taskInfo) {
    const { agent: agentName, task, options } = taskInfo

    const systemPrompt = this.loadAgentPrompt(agentName)
    const provider = getBestProvider(options)

    const response = await ask(systemPrompt, task, {
      provider: options.provider || provider,
      model: options.model,
      temperature: options.temperature,
      verbose: options.verbose,
    })

    return {
      success: true,
      output: response,
      agent: agentName,
      provider,
      metadata: {
        taskId: taskInfo.id,
        duration: Date.now() - taskInfo.startedAt,
      },
    }
  }

  listQueue() {
    return this.queue.map(t => ({ id: t.id, agent: t.agent, task: t.task, status: t.status }))
  }

  listExecuting() { return Array.from(this.executing.values()) }
  listCompleted(limit = 10) { return this.completed.slice(-limit) }
  clearQueue() { this.queue = []; this.emit('queue:cleared') }
}
