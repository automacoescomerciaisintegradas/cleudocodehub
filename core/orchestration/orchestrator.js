/**
 * Cleudocode Orchestrator
 * 
 * Principal componente de orquestração de agentes AI
 * Gerencia criação, execução e coordenação de agentes
 */

import { EventEmitter } from 'node:events'
import { AgentRegistry } from './agent-registry.js'
import { TaskDispatcher } from './task-dispatcher.js'
import { WorkflowEngine } from './workflow-engine.js'
import { ContextManager } from '../memory/context-manager.js'
import { CodeGenerator } from '../execution/code-generator.js'
import { CodeReviewer } from '../quality-gates/code-reviewer.js'

export class CleudocodeOrchestrator extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.agentRegistry = new AgentRegistry()
    this.taskDispatcher = new TaskDispatcher()
    this.workflowEngine = new WorkflowEngine(this)
    this.contextManager = new ContextManager()
    this.codeGenerator = new CodeGenerator()
    this.codeReviewer = new CodeReviewer()
    this.sessions = new Map()
    this.activeAgents = new Set()
  }

  /**
   * Inicializa o orquestrador
   */
  async initialize() {
    this.emit('orchestrator:initializing')
    
    // Carregar agentes registrados
    await this.agentRegistry.loadAgents()
    
    // Inicializar gerenciador de contexto
    await this.contextManager.initialize()
    
    this.emit('orchestrator:initialized')
  }

  /**
   * Cria um novo agente
   * @param {string} name - Nome do agente
   * @param {Object} config - Configuração do agente
   */
  async createAgent(name, config) {
    this.emit('agent:creating', { name, config })
    
    const agent = await this.agentRegistry.registerAgent(name, config)
    
    this.emit('agent:created', { name, agent })
    return agent
  }

  /**
   * Ativa um agente para uso
   * @param {string} name - Nome do agente
   */
  async activateAgent(name) {
    if (!this.agentRegistry.hasAgent(name)) {
      throw new Error(`Agente "${name}" não encontrado`)
    }
    
    this.activeAgents.add(name)
    this.emit('agent:activated', { name })
    
    return this.agentRegistry.getAgent(name)
  }

  /**
   * Executa uma tarefa com um agente
   * @param {string} agentName - Nome do agente
   * @param {string} task - Descrição da tarefa
   * @param {Object} options - Opções de execução
   */
  async runTask(agentName, task, options = {}) {
    this.emit('task:starting', { agent: agentName, task })
    
    // Ativar agente se necessário
    if (!this.activeAgents.has(agentName)) {
      await this.activateAgent(agentName)
    }
    
    // Obter contexto da sessão
    const sessionId = options.sessionId || await this.createSession()
    const context = await this.contextManager.getContext(sessionId)
    
    // Executar tarefa
    const result = await this.taskDispatcher.dispatch(agentName, task, {
      ...options,
      context,
      sessionId
    })
    
    // Atualizar contexto
    await this.contextManager.updateContext(sessionId, {
      lastTask: task,
      lastResult: result,
      timestamp: Date.now()
    })
    
    this.emit('task:completed', { agent: agentName, task, result })
    return result
  }

  /**
   * Gera código baseado em especificação
   * @param {Object} spec - Especificação do código
   * @param {Object} options - Opções de geração
   */
  async generateCode(spec, options = {}) {
    this.emit('code:generating', { spec, options })
    
    const sessionId = options.sessionId || await this.createSession()
    
    // Gerar código
    const code = await this.codeGenerator.generate(spec, {
      ...options,
      sessionId
    })
    
    // Revisar código
    if (options.review !== false) {
      const review = await this.codeReviewer.review(code)
      code.review = review
    }
    
    // Salvar no contexto
    await this.contextManager.updateContext(sessionId, {
      generatedCode: code,
      timestamp: Date.now()
    })
    
    this.emit('code:generated', { code, sessionId })
    return code
  }

  /**
   * Executa um workflow
   * @param {string} workflowName - Nome do workflow
   * @param {Object} params - Parâmetros do workflow
   */
  async runWorkflow(workflowName, params = {}) {
    this.emit('workflow:starting', { name: workflowName, params })
    
    const result = await this.workflowEngine.execute(workflowName, params)
    
    this.emit('workflow:completed', { name: workflowName, result })
    return result
  }

  /**
   * Cria uma nova sessão
   * @param {Object} options - Opções da sessão
   */
  async createSession(options = {}) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.sessions.set(sessionId, {
      id: sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      tasks: [],
      context: {},
      ...options
    })
    
    await this.contextManager.createContext(sessionId)
    
    this.emit('session:created', { sessionId })
    return sessionId
  }

  /**
   * Obtém informações de uma sessão
   * @param {string} sessionId - ID da sessão
   */
  async getSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Sessão "${sessionId}" não encontrada`)
    }
    
    session.context = await this.contextManager.getContext(sessionId)
    return session
  }

  /**
   * Lista todas as sessões ativas
   */
  listSessions() {
    return Array.from(this.sessions.values()).map(s => ({
      id: s.id,
      createdAt: s.createdAt,
      lastActivity: s.lastActivity
    }))
  }

  /**
   * Lista todos os agentes disponíveis
   */
  listAgents() {
    return this.agentRegistry.listAgents()
  }

  /**
   * Obtém estatísticas do orquestrador
   */
  getStats() {
    return {
      sessions: this.sessions.size,
      activeAgents: this.activeAgents.size,
      registeredAgents: this.agentRegistry.count()
    }
  }

  /**
   * Limpa recursos
   */
  async dispose() {
    this.emit('orchestrator:disposing')
    
    // Fechar todas as sessões
    for (const sessionId of this.sessions.keys()) {
      await this.contextManager.closeContext(sessionId)
    }
    
    this.sessions.clear()
    this.activeAgents.clear()
    
    this.emit('orchestrator:disposed')
  }
}
