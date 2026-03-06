/**
 * Health Check
 * 
 * Verifica saúde do sistema
 */

import { EventEmitter } from 'node:events'

export class HealthCheck extends EventEmitter {
  constructor() {
    super()
    this.checks = new Map()
    
    // Registrar checks padrão
    this.registerCheck('node', this.checkNode.bind(this))
    this.registerCheck('config', this.checkConfig.bind(this))
    this.registerCheck('agents', this.checkAgents.bind(this))
  }

  /**
   * Registra um check
   */
  registerCheck(name, fn) {
    this.checks.set(name, fn)
  }

  /**
   * Executa todos os checks
   */
  async run() {
    const results = []
    
    for (const [name, fn] of this.checks.entries()) {
      try {
        const result = await fn()
        results.push({ name, ...result })
      } catch (error) {
        results.push({
          name,
          status: 'error',
          message: error.message
        })
      }
    }
    
    return {
      timestamp: Date.now(),
      checks: results,
      healthy: results.every(r => r.status === 'ok'),
      summary: this.generateSummary(results)
    }
  }

  /**
   * Check: Node.js
   */
  async checkNode() {
    const version = process.version
    const required = 'v18.0.0'
    
    const satisfies = this.satisfiesVersion(version, required)
    
    return {
      status: satisfies ? 'ok' : 'error',
      message: `Node.js ${version} (required: ${required})`,
      details: { version, required }
    }
  }

  /**
   * Check: Configuração
   */
  async checkConfig() {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    
    try {
      const configPath = path.join(process.cwd(), '.cleudocode-core')
      await fs.access(configPath)
      
      return {
        status: 'ok',
        message: 'Configuração encontrada'
      }
    } catch {
      return {
        status: 'warning',
        message: 'Configuração não encontrada (.cleudocode-core)'
      }
    }
  }

  /**
   * Check: Agentes
   */
  async checkAgents() {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    
    try {
      const agentsPath = path.join(process.cwd(), '.agents/agents')
      const files = await fs.readdir(agentsPath)
      const count = files.filter(f => f.endsWith('.md')).length
      
      return {
        status: count > 0 ? 'ok' : 'warning',
        message: `${count} agente(s) registrado(s)`,
        details: { count }
      }
    } catch {
      return {
        status: 'warning',
        message: 'Diretório de agentes não encontrado'
      }
    }
  }

  /**
   * Gera resumo
   */
  generateSummary(results) {
    const ok = results.filter(r => r.status === 'ok').length
    const warnings = results.filter(r => r.status === 'warning').length
    const errors = results.filter(r => r.status === 'error').length
    
    return {
      total: results.length,
      ok,
      warnings,
      errors,
      message: this.getSummaryMessage(ok, warnings, errors)
    }
  }

  /**
   * Mensagem de resumo
   */
  getSummaryMessage(ok, warnings, errors) {
    if (errors > 0) {
      return `❌ ${errors} erro(s) encontrado(s)`
    }
    if (warnings > 0) {
      return `⚠️ ${warnings} aviso(s) encontrado(s)`
    }
    return `✅ Todos os checks passaram (${ok})`
  }

  /**
   * Verifica versão
   */
  satisfiesVersion(version, required) {
    const current = version.replace('v', '').split('.').map(Number)
    const min = required.replace('v', '').split('.').map(Number)
    
    for (let i = 0; i < 3; i++) {
      if (current[i] > min[i]) return true
      if (current[i] < min[i]) return false
    }
    
    return true
  }
}

// Instância singleton
export const healthCheck = new HealthCheck()
