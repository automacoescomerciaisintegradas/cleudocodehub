/**
 * Cleudocode Core - CommonJS Exports
 */

const { ConfigCache, globalConfigCache } = require('./config/config-cache.js')
const { configLoader, loadAgentConfig } = require('./config/config-loader.js')
const { ContextDetector } = require('./session/context-detector.js')
const { SessionContextLoader } = require('./session/context-loader.js')
const { ElicitationEngine } = require('./elicitation/elicitation-engine.js')
const { CleudocodeOrchestrator } = require('./orchestration/orchestrator.js')
const { CodeGenerator } = require('./execution/code-generator.js')
const { ContextManager } = require('./memory/context-manager.js')
const { CodeReviewer } = require('./quality-gates/code-reviewer.js')
const { HealthCheck } = require('./doctor/health-check.js')

module.exports = {
  // Config
  ConfigCache,
  globalConfigCache,
  configLoader,
  loadAgentConfig,
  
  // Session
  ContextDetector,
  SessionContextLoader,
  
  // Elicitation
  ElicitationEngine,
  
  // Orchestration
  CleudocodeOrchestrator,
  
  // Execution
  CodeGenerator,
  
  // Memory
  ContextManager,
  
  // Quality
  CodeReviewer,
  
  // Doctor
  HealthCheck,
  
  // Metadata
  version: '2.0.0',
  moduleName: 'cleudocode-core'
}
