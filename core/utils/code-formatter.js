/**
 * Code Formatter
 * 
 * Formatação de código
 */

export class CodeFormatter {
  constructor(options = {}) {
    this.options = options
  }

  /**
   * Formata código
   */
  async format(code, options = {}) {
    const { language = 'javascript', indentSize = 2 } = options
    
    // Formatação básica
    let formatted = code
    
    // Remover linhas em branco extras
    formatted = formatted.replace(/\n\s*\n\s*\n/g, '\n\n')
    
    // Remover espaços em branco no final
    formatted = formatted.split('\n').map(line => line.trimEnd()).join('\n')
    
    return formatted
  }

  /**
   * Formata para JavaScript
   */
  formatJavaScript(code) {
    return this.format(code, { language: 'javascript' })
  }

  /**
   * Formata para Python
   */
  formatPython(code) {
    return this.format(code, { language: 'python', indentSize: 4 })
  }
}
