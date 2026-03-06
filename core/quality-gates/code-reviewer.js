/**
 * Code Reviewer
 * 
 * Revisão automática de código
 */

import { EventEmitter } from 'node:events'

export class CodeReviewer extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.rules = this.loadRules()
  }

  /**
   * Revisa código
   */
  async review(code, options = {}) {
    this.emit('review:start', { code, options })
    
    const {
      language = 'javascript',
      checkStyle = true,
      checkSecurity = true,
      checkPerformance = true,
      checkBestPractices = true
    } = options
    
    const issues = []
    
    // Análise de estilo
    if (checkStyle) {
      const styleIssues = this.checkStyle(code, language)
      issues.push(...styleIssues)
    }
    
    // Análise de segurança
    if (checkSecurity) {
      const securityIssues = this.checkSecurity(code)
      issues.push(...securityIssues)
    }
    
    // Análise de performance
    if (checkPerformance) {
      const performanceIssues = this.checkPerformance(code)
      issues.push(...performanceIssues)
    }
    
    // Melhores práticas
    if (checkBestPractices) {
      const bestPracticesIssues = this.checkBestPractices(code, language)
      issues.push(...bestPracticesIssues)
    }
    
    const result = {
      issues,
      score: this.calculateScore(issues, code),
      summary: this.generateSummary(issues),
      suggestions: this.generateSuggestions(issues),
      reviewedAt: Date.now()
    }
    
    this.emit('review:complete', result)
    return result
  }

  /**
   * Verifica estilo de código
   */
  checkStyle(code, language) {
    const issues = []
    
    // Verificar linhas longas
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      if (line.length > 100) {
        issues.push({
          type: 'style',
          severity: 'warning',
          line: index + 1,
          message: `Linha muito longa (${line.length} caracteres, máximo 100)`,
          suggestion: 'Quebre a linha em múltiplas linhas'
        })
      }
    })
    
    // Verificar funções grandes
    const functionMatches = code.match(/function\s+\w+\s*\([^)]*\)\s*\{/g) || []
    if (functionMatches.length > 0) {
      // Análise simplificada
      issues.push({
        type: 'style',
        severity: 'info',
        message: 'Verifique se as funções têm menos de 50 linhas',
        suggestion: 'Funções grandes devem ser refatoradas'
      })
    }
    
    return issues
  }

  /**
   * Verifica segurança
   */
  checkSecurity(code) {
    const issues = []
    
    // Verificar eval
    if (code.includes('eval(')) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Uso de eval() detectado',
        suggestion: 'Evite eval(), use alternativas seguras'
      })
    }
    
    // Verificar innerHTML
    if (code.includes('.innerHTML')) {
      issues.push({
        type: 'security',
        severity: 'warning',
        message: 'Uso de innerHTML pode causar XSS',
        suggestion: 'Use textContent ou sanitize o input'
      })
    }
    
    // Verificar senhas hardcoded
    if (/password\s*[:=]\s*['"][^'"]+['"]/i.test(code)) {
      issues.push({
        type: 'security',
        severity: 'critical',
        message: 'Senha hardcoded detectada',
        suggestion: 'Use variáveis de ambiente'
      })
    }
    
    return issues
  }

  /**
   * Verifica performance
   */
  checkPerformance(code) {
    const issues = []
    
    // Verificar loops aninhados
    const loopMatches = code.match(/(for|while)\s*\(/g) || []
    if (loopMatches.length >= 3) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: 'Múltiplos loops detectados - verifique complexidade',
        suggestion: 'Considere otimizar algoritmos'
      })
    }
    
    return issues
  }

  /**
   * Verifica melhores práticas
   */
  checkBestPractices(code, language) {
    const issues = []
    
    // Verificar console.log em produção
    if (code.includes('console.log(')) {
      issues.push({
        type: 'best-practice',
        severity: 'info',
        message: 'console.log detectado',
        suggestion: 'Remova logs antes de produzir'
      })
    }
    
    // Verificar TODOs
    if (code.includes('// TODO')) {
      issues.push({
        type: 'best-practice',
        severity: 'info',
        message: 'TODOs encontrados',
        suggestion: 'Resolva ou documente os TODOs'
      })
    }
    
    return issues
  }

  /**
   * Calcula score de qualidade
   */
  calculateScore(issues, code) {
    const weights = {
      critical: 10,
      major: 5,
      warning: 2,
      info: 1
    }
    
    let penalty = 0
    issues.forEach(issue => {
      penalty += weights[issue.severity] || 0
    })
    
    const baseScore = 100
    const score = Math.max(0, baseScore - penalty)
    
    return {
      overall: score,
      grade: this.scoreToGrade(score)
    }
  }

  /**
   * Converte score para nota
   */
  scoreToGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  /**
   * Gera resumo
   */
  generateSummary(issues) {
    const bySeverity = {
      critical: issues.filter(i => i.severity === 'critical').length,
      major: issues.filter(i => i.severity === 'major').length,
      warning: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length
    }
    
    return {
      total: issues.length,
      bySeverity,
      message: this.getSummaryMessage(bySeverity)
    }
  }

  /**
   * Gera mensagem de resumo
   */
  getSummaryMessage(bySeverity) {
    if (bySeverity.critical > 0) {
      return `⚠️ ${bySeverity.critical} problema(s) crítico(s) encontrado(s)`
    }
    if (bySeverity.major > 0) {
      return `⚡ ${bySeverity.major} problema(s) importante(s) encontrado(s)`
    }
    if (bySeverity.warning > 0) {
      return `⚠️ ${bySeverity.warning} aviso(s) encontrado(s)`
    }
    return '✅ Código parece bom!'
  }

  /**
   * Gera sugestões
   */
  generateSuggestions(issues) {
    const suggestions = []
    
    const uniqueTypes = [...new Set(issues.map(i => i.type))]
    
    if (uniqueTypes.includes('security')) {
      suggestions.push('Priorize correções de segurança')
    }
    if (uniqueTypes.includes('performance')) {
      suggestions.push('Otimize código para melhor performance')
    }
    if (uniqueTypes.includes('style')) {
      suggestions.push('Ajuste estilo de código conforme padrões')
    }
    
    return suggestions
  }

  /**
   * Carrega regras
   */
  loadRules() {
    // TODO: Carregar regras de arquivo de configuração
    return {}
  }
}
