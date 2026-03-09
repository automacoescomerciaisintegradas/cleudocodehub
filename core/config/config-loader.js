/**
 * Config Loader
 *
 * AIDEV-NOTE: Carrega .cleudocode-core (formato YAML) com cache e fallback
 */

import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import { globalConfigCache } from './config-cache.js'

const CONFIG_FILE = '.cleudocode-core'

// Busca o arquivo de config subindo a árvore de diretórios
function findConfigFile(startDir = process.cwd()) {
  let dir = startDir
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, CONFIG_FILE)
    if (fsSync.existsSync(candidate)) return candidate
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return path.join(startDir, CONFIG_FILE)
}

/**
 * Carrega configuração YAML do arquivo .cleudocode-core
 */
export async function loadConfig(options = {}) {
  const cacheKey = 'config:main'

  if (!options.force && globalConfigCache.has(cacheKey)) {
    return globalConfigCache.get(cacheKey)
  }

  try {
    const configPath = findConfigFile()
    const content = await fs.readFile(configPath, 'utf-8')
    const config = yaml.load(content) || {}

    globalConfigCache.set(cacheKey, config)
    return config
  } catch {
    return getDefaultConfig()
  }
}

/**
 * Carrega configuração de agente específico
 * Busca em agents/<nome>/AGENT.md ou .agents/agents/<nome>.md
 */
export async function loadAgentConfig(agentName) {
  const cacheKey = `config:agent:${agentName}`

  if (globalConfigCache.has(cacheKey)) {
    return globalConfigCache.get(cacheKey)
  }

  const locations = [
    path.join(process.cwd(), 'agents', agentName, 'AGENT.md'),
    path.join(process.cwd(), '.agents/agents', `${agentName}.md`),
  ]

  for (const agentPath of locations) {
    try {
      const content = await fs.readFile(agentPath, 'utf-8')
      const config = { name: agentName, content, path: agentPath, loaded: true }
      globalConfigCache.set(cacheKey, config)
      return config
    } catch { /* tenta próximo */ }
  }

  throw new Error(`Agente "${agentName}" não encontrado. Use: cleudocode-core agents --list`)
}

/**
 * Carrega seções específicas da configuração
 */
export async function loadConfigSections(...sections) {
  const config = await loadConfig()
  return Object.fromEntries(sections.filter(s => config[s]).map(s => [s, config[s]]))
}

function getDefaultConfig() {
  return {
    version: '2.0.0',
    settings: { language: 'pt-BR', default_agent: 'dev', verbose: false },
    llms: { models: [{ name: 'qwen2.5-coder:1.5b', backend: 'ollama', enabled: true }] },
  }
}

export const configLoader = {
  load: loadConfig,
  loadAgent: loadAgentConfig,
  loadSections: loadConfigSections,
}
