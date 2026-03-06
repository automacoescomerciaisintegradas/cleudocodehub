# Cleudocode Core - Arquitetura do Sistema

## 🏗️ Visão Geral

O **Cleudocode Core** é uma super máquina de criar códigos para desenvolvedores, baseada nas arquiteturas do **AIOS** e **AIOX-Core**.

## 📐 Arquitetura Modular

```
cleudocode-core/
├── bin/                          # CLI executável
│   └── cleudocode.js
│
├── core/                         ← NÚCLEO DO SISTEMA
│   ├── index.js                  # exports principais
│   ├── index.esm.js              # ES modules
│   │
│   ├── config/                   # Gerenciamento de configuração
│   │   ├── config-cache.js
│   │   ├── config-loader.js
│   │   └── config-validator.js
│   │
│   ├── orchestration/            # Orquestração de agentes
│   │   ├── orchestrator.js       # Principal orquestrador
│   │   ├── agent-registry.js     # Registro de agentes
│   │   ├── task-dispatcher.js    # Dispatcher de tarefas
│   │   ├── workflow-engine.js    # Engine de workflows
│   │   └── dependency-graph.js   # Grafo de dependências
│   │
│   ├── elicitation/              # Sistema de prompting interativo
│   │   ├── elicitation-engine.js
│   │   ├── session-manager.js
│   │   ├── agent-elicitation.js
│   │   ├── task-elicitation.js
│   │   └── workflow-elicitation.js
│   │
│   ├── execution/                # Execução de código
│   │   ├── code-generator.js     # Gerador de código
│   │   ├── code-executor.js      # Executor de código
│   │   ├── sandbox.js            # Ambiente isolado
│   │   └── output-capture.js     # Captura de saída
│   │
│   ├── memory/                   # Memória e contexto
│   │   ├── context-manager.js
│   │   ├── vector-store.js
│   │   ├── session-store.js
│   │   └── code-cache.js
│   │
│   ├── registry/                 # Registro de serviços
│   │   ├── service-registry.js
│   │   ├── agent-registry.js
│   │   └── template-registry.js
│   │
│   ├── quality-gates/            # Controle de qualidade
│   │   ├── code-reviewer.js
│   │   ├── linter.js
│   │   ├── tester.js
│   │   └── security-scanner.js
│   │
│   ├── session/                  # Gerenciamento de sessão
│   │   ├── context-detector.js
│   │   ├── context-loader.js
│   │   └── session-state.js
│   │
│   ├── utils/                    # Utilitários
│   │   ├── code-formatter.js
│   │   ├── yaml-validator.js
│   │   ├── output-formatter.js
│   │   └── file-utils.js
│   │
│   └── doctor/                   # Health check
│       └── health-check.js
│
├── agents/                       # Agentes especializados
│   ├── architect/
│   ├── developer/
│   ├── reviewer/
│   ├── tester/
│   └── devops/
│
├── templates/                    # Templates de código
│   ├── javascript/
│   ├── typescript/
│   ├── python/
│   └── workflows/
│
└── scripts/                      # Scripts auxiliares
    ├── generate-code.js
    ├── run-workflow.js
    └── sync-agents.js
```

## 🔧 Componentes Principais

### 1. **Orquestrador** (`core/orchestration/orchestrator.js`)

```javascript
class CleudocodeOrchestrator {
  async createAgent(name, config)
  async runTask(agent, task)
  async executeWorkflow(workflow)
  async generateCode(spec)
}
```

### 2. **Engine de Elicitação** (`core/elicitation/elicitation-engine.js`)

```javascript
class ElicitationEngine {
  async startSession(type)
  async prompt(step)
  async collectRequirements()
  async generateSpec()
}
```

### 3. **Gerador de Código** (`core/execution/code-generator.js`)

```javascript
class CodeGenerator {
  async generate(spec, context)
  async refactor(code, improvements)
  async optimize(code)
  async transpile(code, target)
}
```

### 4. **Gerenciador de Memória** (`core/memory/context-manager.js`)

```javascript
class ContextManager {
  async loadContext(sessionId)
  async saveContext(sessionId, context)
  async searchContext(query)
  async getContextHistory()
}
```

## 🚀 Fluxo de Criação de Código

```
┌─────────────┐
│   Usuário   │
│  Solicita   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Elicitation Engine             │
│  - Coleta requisitos            │
│  - Faz perguntas clarificadoras │
│  - Gera especificação           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Orchestrator                   │
│  - Seleciona agente             │
│  - Prepara contexto             │
│  - Dispatch tarefa              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Code Generator                 │
│  - Analisa especificação        │
│  - Busca templates              │
│  - Gera código                  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Quality Gates                  │
│  - Lint                         │
│  - Test                         │
│  - Security Scan                │
│  - Code Review                  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Output                         │
│  - Código gerado                │
│  - Tests                        │
│  - Documentação                 │
│  - Instruções de uso            │
└─────────────────────────────────┘
```

## 📊 Comparação com AIOS/AIOX-Core

| Feature | AIOS | AIOX-Core | Cleudocode Core |
|---------|------|-----------|-----------------|
| Config Cache | ✅ | ✅ | ✅ |
| Elicitation | ❌ | ✅ | ✅ |
| Code Generation | ❌ | ✅ | ✅ |
| Quality Gates | ❌ | ✅ | ✅ |
| Memory/Context | ✅ | ✅ | ✅ |
| Agent Registry | ✅ | ✅ | ✅ |
| Workflow Engine | ✅ | ✅ | ✅ |
| Code Execution | ❌ | ✅ | ✅ |
| Sandbox | ❌ | ❌ | ✅ |

## 🎯 Casos de Uso

### 1. Criar Agente Personalizado

```bash
cleudocode-core agent create \
  --name data-engineer \
  --specialty "Python, Pandas, ETL"
```

### 2. Gerar Código Completo

```bash
cleudocode-core generate \
  --spec "API REST com Express" \
  --language typescript \
  --tests \
  --docs
```

### 3. Executar Workflow

```bash
cleudocode-core workflow run \
  --name feature-development \
  --context ./src
```

### 4. Refatorar Código

```bash
cleudocode-core refactor \
  --file src/legacy.js \
  --improvements "modernize, optimize, add-types"
```

## 📈 Performance

| Operação | Tempo Médio |
|----------|-------------|
| Load Config | < 10ms |
| Start Session | < 50ms |
| Generate Code | < 5s |
| Run Quality Gates | < 10s |
| Full Workflow | < 30s |

---

**Versão**: 2.0.0  
**Baseado em**: AIOS + AIOX-Core  
**Status**: Em desenvolvimento
