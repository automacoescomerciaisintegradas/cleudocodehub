/**
 * Output Formatter
 * 
 * Formatação de saída para terminal
 */

import picocolors from 'picocolors'

export class OutputFormatter {
  constructor(options = {}) {
    this.options = options
    this.colors = options.colors !== false
  }

  /**
   * Formata saída de sucesso
   */
  success(message) {
    return this.colors ? picocolors.green(`✓ ${message}`) : `✓ ${message}`
  }

  /**
   * Formata saída de erro
   */
  error(message) {
    return this.colors ? picocolors.red(`✗ ${message}`) : `✗ ${message}`
  }

  /**
   * Formata saída de aviso
   */
  warn(message) {
    return this.colors ? picocolors.yellow(`⚠ ${message}`) : `⚠ ${message}`
  }

  /**
   * Formata saída de informação
   */
  info(message) {
    return this.colors ? picocolors.blue(`ℹ ${message}`) : `ℹ ${message}`
  }

  /**
   * Formata código para exibição
   */
  code(code, language = 'javascript') {
    return this.colors ? picocolors.cyan(code) : code
  }

  /**
   * Formata JSON
   */
  json(obj, indent = 2) {
    return JSON.stringify(obj, null, indent)
  }

  /**
   * Cria caixa de texto
   */
  box(title, content) {
    const width = Math.max(title.length, ...content.split('\n').map(l => l.length).concat([0]))
    const border = '─'.repeat(width + 2)
    
    return `
╭${border}╮
│ ${title.padEnd(width)} │
├${border}┤
${content.split('\n').map(l => `│ ${l.padEnd(width)} │`).join('\n')}
╰${border}╯
`
  }
}

// Singleton
export const formatter = new OutputFormatter()
