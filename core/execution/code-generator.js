/**
 * Code Generator
 * 
 * Gera código automaticamente baseado em especificações
 * Suporta múltiplas linguagens e frameworks
 */

import { EventEmitter } from 'node:events'
import { TemplateRegistry } from '../registry/template-registry.js'
import { CodeFormatter } from '../utils/code-formatter.js'

export class CodeGenerator extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = options
    this.templateRegistry = new TemplateRegistry()
    this.formatter = new CodeFormatter()
    this.generators = new Map()
    
    // Registrar geradores padrão
    this.registerGenerator('javascript', this.generateJavaScript.bind(this))
    this.registerGenerator('typescript', this.generateTypeScript.bind(this))
    this.registerGenerator('python', this.generatePython.bind(this))
    this.registerGenerator('api', this.generateAPI.bind(this))
    this.registerGenerator('component', this.generateComponent.bind(this))
  }

  /**
   * Gera código baseado em especificação
   * @param {Object} spec - Especificação do código
   * @param {Object} options - Opções de geração
   */
  async generate(spec, options = {}) {
    this.emit('generate:start', { spec, options })
    
    const {
      language = 'javascript',
      type = 'function',
      name,
      description,
      inputs,
      outputs,
      dependencies = [],
      tests = true,
      docs = true
    } = spec
    
    // Selecionar gerador
    const generator = this.generators.get(type) || this.generators.get(language)
    
    if (!generator) {
      throw new Error(`Gerador não encontrado para: ${type || language}`)
    }
    
    // Gerar código principal
    const code = await generator(spec, options)
    
    // Formatar código
    const formatted = await this.formatter.format(code, { language })
    
    // Gerar testes se solicitado
    let testCode = null
    if (tests) {
      testCode = await this.generateTests(formatted, { language, name })
    }
    
    // Gerar documentação se solicitado
    let documentation = null
    if (docs) {
      documentation = await this.generateDocumentation(formatted, { language, name, description })
    }
    
    const result = {
      code: formatted,
      tests: testCode,
      documentation,
      metadata: {
        language,
        type,
        name,
        generatedAt: Date.now(),
        dependencies
      }
    }
    
    this.emit('generate:complete', { result })
    return result
  }

  /**
   * Gera código JavaScript
   */
  async generateJavaScript(spec, options) {
    const { name, inputs = [], outputs, description, async = false } = spec
    
    const params = inputs.map(i => i.name).join(', ')
    const asyncKeyword = async ? 'async ' : ''
    
    return `/**
 * ${description || `Função ${name}`}
 * ${inputs.map(i => `@param {${i.type || 'any'}} ${i.name} - ${i.description || ''}`).join('\n * ')}
 * ${outputs ? `@returns {${outputs.type || 'any'}} ${outputs.description || ''}` : ''}
 */
${asyncKeyword}function ${name}(${params}) {
  // TODO: Implementar lógica
  
  ${outputs ? `// Retorno esperado: ${outputs.type}` : ''}
}

module.exports = { ${name} }
`
  }

  /**
   * Gera código TypeScript
   */
  async generateTypeScript(spec, options) {
    const { name, inputs = [], outputs, description, async = false } = spec
    
    const params = inputs.map(i => `${i.name}${i.optional ? '?' : ''}: ${i.type || 'any'}`).join(', ')
    const asyncKeyword = async ? 'async ' : ''
    const returnType = outputs ? `: ${outputs.type || 'any'}` : ''
    
    return `/**
 * ${description || `Função ${name}`}
 * ${inputs.map(i => `@param {${i.type || 'any'}} ${i.name} - ${i.description || ''}`).join('\n * ')}
 * ${outputs ? `@returns {${outputs.type || 'any'}} ${outputs.description || ''}` : ''}
 */
export ${asyncKeyword}function ${name}(${params})${returnType} {
  // TODO: Implementar lógica
  
  ${outputs ? `// Retorno esperado: ${outputs.type}` : ''}
}
`
  }

  /**
   * Gera código Python
   */
  async generatePython(spec, options) {
    const { name, inputs = [], outputs, description, async = false } = spec
    
    const params = inputs.map(i => `${i.name}: ${i.type || 'Any'}${i.default !== undefined ? ` = ${i.default}` : ''}`).join(', ')
    const asyncKeyword = async ? 'async ' : ''
    const returnType = outputs ? ` -> ${outputs.type || 'Any'}` : ''
    
    return `"""
${description || `Função ${name}`}

${inputs.map(i => `Args:\n    ${i.name}: ${i.description || i.type || 'Any'}`).join('\n')}

Returns:
    ${outputs ? `${outputs.type}: ${outputs.description || ''}` : 'None'}
"""
${asyncKeyword}def ${name}(${params})${returnType}:
    # TODO: Implementar lógica
    pass
`
  }

  /**
   * Gera API REST
   */
  async generateAPI(spec, options) {
    const { name, endpoints = [], framework = 'express' } = spec
    
    if (framework === 'express') {
      return this.generateExpressAPI(name, endpoints)
    }
    
    if (framework === 'fastapi') {
      return this.generateFastAPI(name, endpoints)
    }
    
    throw new Error(`Framework "${framework}" não suportado`)
  }

  /**
   * Gera API Express
   */
  async generateExpressAPI(name, endpoints) {
    const routes = endpoints.map(ep => `
app.${ep.method || 'get'}('${ep.path}', async (req, res) => {
  // TODO: Implementar ${ep.description || ep.path}
  res.json({ message: '${ep.path} endpoint' })
})
`).join('\n')
    
    return `const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

${routes}

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})

module.exports = app
`
  }

  /**
   * Gera API FastAPI
   */
  async generateFastAPI(name, endpoints) {
    const routes = endpoints.map(ep => `
@app.${ep.method || 'get'}("${ep.path}")
async def ${ep.handler || ep.path.replace(/\//g, '_').replace(/^_/, '')}():
    """${ep.description || `Endpoint ${ep.path}`}"""
    return {"message": "${ep.path} endpoint"}
`).join('\n')
    
    return `from fastapi import FastAPI
from typing import Optional

app = FastAPI(
    title="${name}",
    description="API generated by Cleudocode Core",
    version="1.0.0"
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": __import__('datetime').datetime.now().isoformat()}

${routes}

# To run: uvicorn main:app --reload
`
  }

  /**
   * Gera componente React
   */
  async generateComponent(spec, options) {
    const { name, props = [], state = [], hooks = [] } = spec
    
    const propTypes = props.map(p => `  ${p.name}${p.required ? '' : '?'}: ${p.type || 'any'};`).join('\n')
    
    const stateInit = state.map(s => `  const [${s.name}, set${this.capitalize(s.name)}] = useState(${s.initial || 'null'})`).join('\n  ')
    
    const hookImports = hooks.map(h => `import ${h.name} from '${h.from}'`).join('\n')
    
    return `import React, { useState${hooks.length > 0 ? ', ' + hooks.map(h => h.name).join(', ') : ''} } from 'react'
${hookImports ? hookImports + '\n' : ''}
interface ${name}Props {
${propTypes}
}

export const ${name}: React.FC<${name}Props> = (${props.map(p => p.name).join(', ')}) => {
  ${stateInit}
  
  // TODO: Implementar lógica do componente
  
  return (
    <div className="${this.kebabCase(name)}">
      {/* TODO: Renderizar conteúdo */}
    </div>
  )
}

export default ${name}
`
  }

  /**
   * Gera testes para o código
   */
  async generateTests(code, options) {
    const { language, name } = options
    
    if (language === 'python') {
      return `import pytest

def test_${name}():
    """Teste básico para ${name}"""
    # TODO: Implementar teste
    assert True

def test_${name}_edge_cases():
    """Teste de casos extremos"""
    # TODO: Implementar testes de borda
    assert True
`
    }
    
    // JavaScript/TypeScript
    return `const { ${name} } = require('./${name}')

describe('${name}', () => {
  it('should work correctly', async () => {
    // TODO: Implementar teste
    expect(true).toBe(true)
  })
  
  it('should handle edge cases', async () => {
    // TODO: Testar casos extremos
    expect(true).toBe(true)
  })
})
`
  }

  /**
   * Gera documentação
   */
  async generateDocumentation(code, options) {
    const { language, name, description } = options
    
    return `# ${name}

${description || `Documentação para ${name}`}

## Uso

\`\`\`${language === 'python' ? 'python' : 'javascript'}
// Exemplo de uso
const result = ${name}()
\`\`\`

## Parâmetros

<!-- TODO: Documentar parâmetros -->

## Retorno

<!-- TODO: Documentar retorno -->

## Exemplos

<!-- TODO: Adicionar exemplos -->

## Veja Também

<!-- TODO: Links relacionados -->
`
  }

  /**
   * Registra um gerador personalizado
   */
  registerGenerator(type, generator) {
    this.generators.set(type, generator)
  }

  /**
   * Carrega templates do registry
   */
  async loadTemplates() {
    await this.templateRegistry.loadTemplates()
  }

  /**
   * Utils
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }
}
