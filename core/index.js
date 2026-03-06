/**
 * Cleudocode Core - Módulo Principal
 * 
 * Super máquina de criar códigos para desenvolvedores
 * Baseado em AIOS + AIOX-Core
 * 
 * @version 2.0.0
 */

// Config
export { ConfigCache, globalConfigCache } from './config/config-cache.js'
export { configLoader, loadAgentConfig, loadConfigSections } from './config/config-loader.js'

// Session
export { ContextDetector } from './session/context-detector.js'
export { SessionContextLoader } from './session/context-loader.js'

// Elicitation
export { ElicitationEngine } from './elicitation/elicitation-engine.js'
export { ElicitationSessionManager } from './elicitation/session-manager.js'
export { agentElicitationSteps } from './elicitation/agent-elicitation.js'
export { taskElicitationSteps } from './elicitation/task-elicitation.js'
export { workflowElicitationSteps } from './elicitation/workflow-elicitation.js'

// Orchestration
export { CleudocodeOrchestrator } from './orchestration/orchestrator.js'
export { AgentRegistry } from './orchestration/agent-registry.js'
export { TaskDispatcher } from './orchestration/task-dispatcher.js'
export { WorkflowEngine } from './orchestration/workflow-engine.js'

// Execution
export { CodeGenerator } from './execution/code-generator.js'
export { CodeExecutor } from './execution/code-executor.js'
export { Sandbox } from './execution/sandbox.js'

// Memory
export { ContextManager } from './memory/context-manager.js'
export { VectorStore } from './memory/vector-store.js'
export { SessionStore } from './memory/session-store.js'

// Registry
export { ServiceRegistry } from './registry/service-registry.js'
export { TemplateRegistry } from './registry/template-registry.js'

// Quality Gates
export { CodeReviewer } from './quality-gates/code-reviewer.js'
export { Linter } from './quality-gates/linter.js'
export { Tester } from './quality-gates/tester.js'
export { SecurityScanner } from './quality-gates/security-scanner.js'

// Utils
export { CodeFormatter } from './utils/code-formatter.js'
export { YAMLValidator } from './utils/yaml-validator.js'
export { OutputFormatter } from './utils/output-formatter.js'

// Doctor
export { HealthCheck } from './doctor/health-check.js'

// Metadata
export const version = '2.0.0'
export const moduleName = 'cleudocode-core'
