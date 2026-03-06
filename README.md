# 🚀 Cleudocode Core

> **Super Máquina de Criar Códigos para Desenvolvedores**

[![npm version](https://img.shields.io/npm/v/cleudocode-core.svg)](https://www.npmjs.com/package/cleudocode-core)
[![npm downloads](https://img.shields.io/npm/dm/cleudocode-core.svg)](https://www.npmjs.com/package/cleudocode-core)
[![license](https://img.shields.io/npm/l/cleudocode-core.svg)](LICENSE)
[![Node.js](https://img.shields.io/node/v/cleudocode-core.svg)](https://nodejs.org/)

Cleudocode Core é uma **super máquina de criar códigos** baseada nas arquiteturas do **AIOS** e **AIOX-Core**. Gera código automaticamente, gerencia agentes AI, e executa workflows completos de desenvolvimento.

## ✨ Features

### 🧠 Core Poderoso
- **Orquestração de Agentes** - Gerencie múltiplos agentes AI especializados
- **Geração de Código** - Crie código automaticamente em JavaScript, TypeScript, Python
- **Workflows** - Execute fluxos completos (feature development, bug fix, code review)
- **Elicitação Interativa** - Prompting inteligente para coletar requisitos
- **Memória e Contexto** - Mantenha contexto entre sessões
- **Quality Gates** - Code review automático, linting, testes, segurança

### 🤖 Agentes Especializados
- `@architect` - Arquitetura de software
- `@dev` - Desenvolvimento de código
- `@reviewer` - Revisão de código
- `@tester` - Criação de testes
- `@devops` - Infra e CI/CD

### 🔌 Multi-LLM
- OpenAI (GPT-4, GPT-4o)
- Anthropic (Claude 3)
- Google (Gemini)
- Ollama (modelos locais)
- vLLM (self-hosted)

## 🚀 Instalação

### Via NPX (Recomendado)

```bash
npx cleudocode-core@latest init
```

### Instalação Global

```bash
npm install -g cleudocode-core
```

## 🎯 Início Rápido

### 1. Inicializar Projeto

```bash
cd meu-projeto
npx cleudocode-core init
```

Isso cria:
- `.cleudocode-core` - Configuração principal
- `AGENTS.md` - Configuração de agentes
- `.agents/` - Estrutura de agentes
- `core/` - Core do sistema

### 2. Gerar Código

```bash
# Gerar API REST
cleudocode-core generate \
  --spec "API REST com Express" \
  --language typescript \
  --tests \
  --docs

# Gerar componente React
cleudocode-core generate \
  --type component \
  --name UserProfile \
  --props "user: object, onEdit: function"
```

### 3. Executar Workflow

```bash
# Desenvolvimento de feature
cleudocode-core workflow run \
  --name feature-development \
  --requirement "Criar endpoint de usuário"

# Code review
cleudocode-core workflow run \
  --name code-review \
  --files "src/**/*.js"
```

### 4. Usar Agentes

```bash
# Listar agentes
cleudocode-core agents --list

# Executar tarefa com agente
cleudocode-core run dev -t "criar função de validação de email"

# Revisar código
cleudocode-core run reviewer -t "revisar src/auth.js"
```

## 📖 Comandos Principais

| Comando | Descrição |
|---------|-----------|
| `init` | Inicializa Cleudocode Core no projeto |
| `generate [spec]` | Gera código automaticamente |
| `run <agente> -t <tarefa>` | Executa tarefa com agente |
| `workflow run <nome>` | Executa workflow |
| `agents` | Gerencia agentes |
| `review <file>` | Revisa código |
| `config` | Mostra configuração |
| `doctor` | Verifica saúde do sistema |

## 🏗️ Arquitetura

```
cleudocode-core/
├── bin/                    # CLI executável
├── core/                   ← NÚCLEO DO SISTEMA
│   ├── config/             # Configuração
│   ├── orchestration/      # Orquestração de agentes
│   ├── elicitation/        # Prompting interativo
│   ├── execution/          # Geração de código
│   ├── memory/             # Memória e contexto
│   ├── registry/           # Registro de serviços
│   ├── quality-gates/      # Code review, linting
│   ├── session/            # Gerenciamento de sessão
│   ├── utils/              # Utilitários
│   └── doctor/             # Health check
├── agents/                 # Agentes especializados
└── templates/              # Templates de código
```

### Módulo Core

```javascript
import {
  CleudocodeOrchestrator,
  CodeGenerator,
  ElicitationEngine,
  ContextManager,
  CodeReviewer,
  WorkflowEngine
} from 'cleudocode-core'

// Criar orquestrador
const orchestrator = new CleudocodeOrchestrator()
await orchestrator.initialize()

// Gerar código
const code = await orchestrator.generateCode({
  language: 'typescript',
  type: 'api',
  name: 'UserService',
  endpoints: [
    { method: 'get', path: '/users' },
    { method: 'post', path: '/users' }
  ]
})

// Executar workflow
const result = await orchestrator.runWorkflow('feature-development', {
  requirement: 'Criar sistema de autenticação'
})
```

## 📊 Exemplos de Uso

### Gerar API Completa

```bash
cleudocode-core generate api \
  --name "User API" \
  --framework express \
  --endpoints "GET /users, POST /users, GET /users/:id, PUT /users/:id, DELETE /users/:id" \
  --database mongodb \
  --auth jwt \
  --tests \
  --docs
```

**Saída:**
```
✅ API gerada com sucesso!

📁 Files created:
  - src/routes/users.js
  - src/controllers/userController.js
  - src/models/User.js
  - src/middleware/auth.js
  - tests/users.test.js
  - docs/api.md

📦 Dependencies:
  - express
  - mongoose
  - jsonwebtoken
  - bcrypt

🧪 Tests: 12 passing
📊 Code Quality: A (95/100)
```

### Workflow de Bug Fix

```bash
cleudocode-core workflow run bug-fix \
  --bug-description "Usuário não consegue fazer login com email em maiúsculas" \
  --reproduce-steps "1. Acessar /login 2. Digitar EMAIL@TEST.COM 3. Clicar em entrar" \
  --expected-behavior "Login deve funcionar independente de case"
```

### Code Review Automático

```bash
cleudocode-core review src/**/*.js \
  --check-style \
  --check-security \
  --check-performance \
  --output report.md
```

**Relatório:**
```markdown
# Code Review Report

## Summary
- Files reviewed: 15
- Issues found: 23
- Quality Score: B (82/100)

## Critical Issues (2)
- ⚠️ eval() detected in src/utils.js:45
- ⚠️ Hardcoded password in src/config.js:12

## Warnings (5)
- Long lines (>100 chars) in 3 files
- console.log statements in production code

## Suggestions
1. Replace eval() with safer alternatives
2. Use environment variables for credentials
3. Remove console.log statements
```

## 🔧 Configuração

### Arquivo `.cleudocode-core`

```yaml
version: "2.0.0"

settings:
  language: "pt-BR"
  default_agent: "dev"
  verbose: true

llms:
  models:
    - name: "qwen3:4b"
      backend: "ollama"
      hostname: "http://localhost:11434"
      enabled: true
    - name: "gpt-4o"
      backend: "openai"
      enabled: false

agents:
  enabled:
    - "architect"
    - "dev"
    - "reviewer"
    - "tester"
  default: "dev"

quality-gates:
  enabled: true
  checks:
    - lint
    - test
    - security
    - performance
```

## 📈 Performance

| Operação | Tempo Médio |
|----------|-------------|
| Load Config | < 10ms |
| Start Session | < 50ms |
| Generate Function | < 2s |
| Generate API | < 5s |
| Full Workflow | < 30s |
| Code Review (10 files) | < 10s |

## 🧪 Quality Gates

O Cleudocode Core inclui quality gates automáticos:

```bash
# Executar todos os checks
cleudocode-core quality-gates run

# Checks individuais
cleudocode-core lint
cleudocode-core test
cleudocode-core security-scan
cleudocode-core performance-check
```

## 🔗 Links

- [Documentação Completa](https://github.com/cleudocode/cleudocode-core/docs)
- [Arquitetura](ARQUITETURA.md)
- [Exemplos](examples/)
- [Issues](https://github.com/cleudocode/cleudocode-core/issues)
- [NPM](https://www.npmjs.com/package/cleudocode-core)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m 'feat: adiciona minha feature'`
4. Push: `git push origin feature/minha-feature`
5. Pull Request

## 📄 Licença

MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Baseado em:** AIOS + AIOX-Core  
**Versão**: 2.0.0  
**Feito com ❤️ pela Cleudocode Team**
