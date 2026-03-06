/**
 * Task Dispatcher
 * 
 * Dispatch e execução de tarefas para agentes
 */

import { EventEmitter } from 'node:events'

export class TaskDispatcher extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.queue = []
    this.executing = new Map()
    this.completed = []
  }

  /**
   * Dispatch de tarefa para agente
   */
  async dispatch(agentName, task, options = {}) {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.emit('task:dispatched', { taskId, agent: agentName, task })
    
    const taskInfo = {
      id: taskId,
      agent: agentName,
      task,
      options,
      status: 'pending',
      createdAt: Date.now()
    }
    
    this.queue.push(taskInfo)
    
    // Executar tarefa
    return this.execute(taskInfo)
  }

  /**
   * Executa uma tarefa
   */
  async execute(taskInfo) {
    taskInfo.status = 'executing'
    taskInfo.startedAt = Date.now()
    this.executing.set(taskInfo.id, taskInfo)
    
    this.emit('task:executing', taskInfo)
    
    try {
      // Simular execução (será integrado com LLM)
      const result = await this.executeTask(taskInfo)
      
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
   * Executa a tarefa (integração com LLM)
   */
  async executeTask(taskInfo) {
    // TODO: Integrar com LLM para execução real
    // Por enquanto, retorna resultado simulado
    
    return {
      success: true,
      message: `Tarefa "${taskInfo.task}" executada pelo agente "${taskInfo.agent}"`,
      output: 'Código gerado com sucesso',
      metadata: {
        taskId: taskInfo.id,
        agent: taskInfo.agent,
        duration: Date.now() - taskInfo.startedAt
      }
    }
  }

  /**
   * Lista tarefas na fila
   */
  listQueue() {
    return this.queue.map(t => ({
      id: t.id,
      agent: t.agent,
      task: t.task,
      status: t.status
    }))
  }

  /**
   * Lista tarefas em execução
   */
  listExecuting() {
    return Array.from(this.executing.values())
  }

  /**
   * Lista tarefas completas
   */
  listCompleted(limit = 10) {
    return this.completed.slice(-limit)
  }

  /**
   * Limpa fila
   */
  clearQueue() {
    this.queue = []
    this.emit('queue:cleared')
  }
}
