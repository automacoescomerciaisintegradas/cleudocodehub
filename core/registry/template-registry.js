/**
 * Template Registry
 * 
 * Registro de templates de código
 */

import fs from 'node:fs/promises'
import path from 'node:path'

export class TemplateRegistry {
  constructor(options = {}) {
    this.options = options
    this.templates = new Map()
    this.templatesPath = options.templatesPath || 'templates'
  }

  /**
   * Carrega templates do diretório
   */
  async loadTemplates() {
    try {
      const files = await fs.readdir(this.templatesPath)
      
      for (const file of files) {
        if (file.startsWith('.')) continue
        
        const templatePath = path.join(this.templatesPath, file)
        const content = await fs.readFile(templatePath, 'utf-8')
        
        this.templates.set(file, {
          name: file,
          path: templatePath,
          content,
          loadedAt: Date.now()
        })
      }
    } catch (error) {
      // Templates não encontrados, usar padrão
    }
  }

  /**
   * Obtém template
   */
  getTemplate(name) {
    return this.templates.get(name)
  }

  /**
   * Registra template
   */
  registerTemplate(name, content) {
    this.templates.set(name, {
      name,
      content,
      loadedAt: Date.now()
    })
  }

  /**
   * Lista templates
   */
  listTemplates() {
    return Array.from(this.templates.keys())
  }
}
