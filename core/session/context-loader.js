/**
 * Session Context Loader
 * 
 * Carrega contexto de sessão
 */

export class SessionContextLoader {
  constructor(options = {}) {
    this.options = options
    this.sessions = new Map()
  }

  /**
   * Carrega contexto de sessão
   */
  async loadContext(sessionId) {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)
    }
    
    const context = {
      id: sessionId,
      createdAt: Date.now(),
      data: {},
      history: []
    }
    
    this.sessions.set(sessionId, context)
    return context
  }

  /**
   * Atualiza contexto de sessão
   */
  async updateContext(sessionId, data) {
    const context = await this.loadContext(sessionId)
    
    context.data = { ...context.data, ...data }
    context.history.push({
      timestamp: Date.now(),
      action: 'update',
      data
    })
    
    return context
  }

  /**
   * Obtém histórico de sessão
   */
  async getHistory(sessionId, limit = 10) {
    const context = await this.loadContext(sessionId)
    return context.history.slice(-limit)
  }

  /**
   * Limpa sessão
   */
  async clearSession(sessionId) {
    this.sessions.delete(sessionId)
  }

  /**
   * Lista sessões ativas
   */
  listSessions() {
    return Array.from(this.sessions.keys())
  }
}
