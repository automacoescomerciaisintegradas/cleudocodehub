/**
 * Agent Registry
 * 
 * Registro e gerenciamento de agentes AI
 */

import { EventEmitter } from 'node:events'
import fs from 'fs-extra'
import path from 'node:path'

export class AgentRegistry extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.agents = new Map()
    this.agentsPath = options.agentsPath || '.agents/agents'
  }

  /**
   * Carrega agentes do diretório
   */
  async loadAgents() {
    this.emit('agents:loading')
    
    try {
      const files = await fs.readdir(this.agentsPath)
      const agentFiles = files.filter(f => f.endsWith('.md'))
      
      for (const file of agentFiles) {
        const content = await fs.readFile(path.join(this.agentsPath, file), 'utf-8')
        const name = file.replace('.md', '')
        
        const agent = {
          name,
          file: path.join(this.agentsPath, file),
          content,
          loaded: true,
          loadedAt: Date.now()
        }
        
        this.agents.set(name, agent)
      }
      
      this.emit('agents:loaded', { count: this.agents.size })
    } catch (error) {
      this.emit('agents:error', { error })
    }
  }

  /**
   * Registra um novo agente
   */
  async registerAgent(name, config) {
    const agent = {
      name,
      config,
      file: path.join(this.agentsPath, `${name}.md`),
      loaded: true,
      loadedAt: Date.now()
    }
    
    this.agents.set(name, agent)
    this.emit('agent:registered', { name })
    
    return agent
  }

  /**
   * Obtém um agente
   */
  getAgent(name) {
    return this.agents.get(name)
  }

  /**
   * Verifica se agente existe
   */
  hasAgent(name) {
    return this.agents.has(name)
  }

  /**
   * Lista todos os agentes
   */
  listAgents() {
    return Array.from(this.agents.entries()).map(([name, agent]) => ({
      name,
      loaded: agent.loaded,
      loadedAt: agent.loadedAt
    }))
  }

  /**
   * Conta agentes registrados
   */
  count() {
    return this.agents.size
  }

  /**
   * Remove um agente
   */
  async removeAgent(name) {
    if (this.agents.has(name)) {
      this.agents.delete(name)
      this.emit('agent:removed', { name })
    }
  }

  /**
   * Limpa todos os agentes
   */
  clear() {
    this.agents.clear()
    this.emit('agents:cleared')
  }
}
