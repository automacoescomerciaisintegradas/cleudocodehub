/**
 * YAML Validator
 * 
 * Validação de arquivos YAML
 */

export class YAMLValidator {
  constructor(options = {}) {
    this.options = options
  }

  /**
   * Valida conteúdo YAML
   */
  validate(content, options = {}) {
    const { strict = false } = options
    
    const errors = []
    const warnings = []
    
    // Validações básicas
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      const lineNum = index + 1
      
      // Verificar tabs
      if (line.includes('\t')) {
        warnings.push({
          line: lineNum,
          message: 'Use espaços em vez de tabs'
        })
      }
      
      // Verificar espaços em branco no final
      if (line !== line.trimEnd()) {
        warnings.push({
          line: lineNum,
          message: 'Remova espaços em branco no final da linha'
        })
      }
    })
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }
}

// Função utilitária
export function validateYAML(content, options) {
  const validator = new YAMLValidator()
  return validator.validate(content, options)
}
