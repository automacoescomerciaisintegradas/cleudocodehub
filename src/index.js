/**
 * Cleudocode Core - Main Entry Point
 * 
 * AI Orchestration Framework para desenvolvimento com agentes AI
 * 
 * @module cleudocode-core
 * @version 1.0.0
 */

export { version } from '../package.json'

/**
 * Inicializa o Cleudocode Core
 * @returns {Object} Configuração inicializada
 */
export function init() {
  console.log('Cleudocode Core initialized')
  return {
    version: '1.0.0',
    name: 'cleudocode-core'
  }
}

export default { init }
