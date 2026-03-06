/**
 * Config Loader
 * 
 * Carregamento de configuração lazy-loading
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { globalConfigCache } from './config-cache.js'

const CONFIG_FILE = '.cleudocode-core'

/**
 * Carrega configuração do arquivo
 */
export async function loadConfig(options = {}) {
  const cacheKey = 'config:main'
  
  if (!options.force && globalConfigCache.has(cacheKey)) {
    return globalConfigCache.get(cacheKey)
  }
  
  try {
    const configPath = path.join(process.cwd(), CONFIG_FILE)
    const content = await fs.readFile(configPath, 'utf-8')
    
    // Parse YAML (simplificado para JSON)
    const config = JSON.parse(content)
    
    globalConfigCache.set(cacheKey, config)
    return config
  } catch (error) {
    // Retornar configuração padrão
    return getDefaultConfig()
  }
}

/**
 * Carrega configuração de agente específico
 */
export async function loadAgentConfig(agentName) {
  const cacheKey = `config:agent:${agentName}`
  
  if (globalConfigCache.has(cacheKey)) {
    return globalConfigCache.get(cacheKey)
  }
  
  try {
    const agentPath = path.join(process.cwd(), '.agents/agents', `${agentName}.md`)
    const content = await fs.readFile(agentPath, 'utf-8')
    
    const config = {
      name: agentName,
      content,
      loaded: true
    }
    
    globalConfigCache.set(cacheKey, config)
    return config
  } catch (error) {
    throw new Error(`Agente "${agentName}" não encontrado`)
  }
}

/**
 * Carrega seções específicas da configuração
 */
export async function loadConfigSections(...sections) {
  const config = await loadConfig()
  const result = {}
  
  for (const section of sections) {
    if (config[section]) {
      result[section] = config[section]
    }
  }
  
  return result
}

/**
 * Obtém configuração padrão
 */
function getDefaultConfig() {
  return {
    version: '1.0.0',
    settings: {
      language: 'pt-BR',
      default_agent: 'general-purpose',
      verbose: false
    }
  }
}

export const configLoader = {
  load: loadConfig,
  loadAgent: loadAgentConfig,
  loadSections: loadConfigSections
}
