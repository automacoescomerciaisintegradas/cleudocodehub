# 🚀 Cleudocode Core

> **AI Orchestration Framework para Desenvolvimento com Agentes AI**

[![npm version](https://img.shields.io/npm/v/cleudocode-core.svg)](https://www.npmjs.com/package/cleudocode-core)
[![npm downloads](https://img.shields.io/npm/dm/cleudocode-core.svg)](https://www.npmjs.com/package/cleudocode-core)
[![license](https://img.shields.io/npm/l/cleudocode-core.svg)](LICENSE)
[![Node.js](https://img.shields.io/node/v/cleudocode-core.svg)](https://nodejs.org/)

Cleudocode Core é um framework de orquestração de agentes AI que integra com seu fluxo de desenvolvimento. Configure uma vez, use em qualquer projeto.

## ✨ Features

- 🎯 **Instalação Rápida** - Um comando para configurar tudo
- 🤖 **Múltiplos Agentes** - Suporte a agentes especializados
- 🔌 **Multi-LLM** - OpenAI, Anthropic, Gemini, Ollama, vLLM, HuggingFace
- 📝 **Regras de Código** - Linting, formatação e padrões automáticos
- 🔄 **Workflows** - Automação de tarefas repetitivas
- 🛠️ **CLI Poderosa** - Comandos intuitivos e fáceis de usar
- 📚 **Documentação** - Geração automática de docs

## 🚀 Instalação

### Via NPX (Recomendado)

Instale e execute com um único comando:

```bash
npx cleudocode-core@latest init
```

### Instalação Global

Para usar em qualquer projeto sem digitar `npx`:

```bash
npm install -g cleudocode-core
```

Depois, use em qualquer lugar:

```bash
cleudocode-core init
```

## 🎯 Início Rápido

### 1. Inicializar no Projeto

```bash
# Navegue até seu projeto
cd meu-projeto

# Inicialize Cleudocode Core
npx cleudocode-core@latest init
```

Isso criará:
- `.cleudocode-core` - Configuração principal
- `AGENTS.md` - Configuração de agentes
- `.env.example` - Variáveis de ambiente exemplo
- `.agents/` - Estrutura de diretórios para agentes

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas chaves
nano .env
```

### 3. Verificar Instalação

```bash
npx cleudocode-core doctor
```

Saída esperada:
```
✓ Node.js: v20.10.0 (mínimo: v18.0.0)
✓ .cleudocode-core: Encontrado
✓ AGENTS.md: Encontrado
ℹ .env: Opcional (copie de .env.example)
ℹ Ollama: Não instalado (opcional para modelos locais)
```

### 4. Primeiro Uso

```bash
# Listar agentes disponíveis
npx cleudocode-core agents --list

# Executar um agente
npx cleudocode-core run general-purpose -t "criar uma API REST"
```

## 📖 Comandos

### Principais Comandos

| Comando | Descrição |
|---------|-----------|
| `init` | Inicializa Cleudocode Core no projeto |
| `install` | Instala globalmente |
| `agents` | Gerencia agentes |
| `run <agente>` | Executa um agente |
| `config` | Mostra/edita configuração |
| `doctor` | Verifica saúde da instalação |
| `update` | Atualiza para última versão |
| `templates` | Lista templates disponíveis |

### Exemplos de Uso

```bash
# Inicializar com template específico
npx cleudocode-core init --template fullstack
npx cleudocode-core init --template frontend
npx cleudocode-core init --template backend
npx cleudocode-core init --template cli

# Listar agentes
npx cleudocode-core agents --list

# Adicionar novo agente
npx cleudocode-core agents --add data-engineer

# Remover agente
npx cleudocode-core agents --remove legacy-agent

# Ver configuração
npx cleudocode-core config

# Ver configuração específica
npx cleudocode-core config settings.language

# Editar configuração
npx cleudocode-core config --edit

# Executar agente com tarefa
npx cleudocode-core run dev -t "criar endpoint de usuário"

# Executar com verbose
npx cleudocode-core run qa -t "testar API" --verbose

# Verificar saúde
npx cleudocode-core doctor

# Atualizar
npx cleudocode-core update
npx cleudocode-core update --global
```

## 🤖 Agentes

### Agentes Padrão

| Agente | Descrição |
|--------|-----------|
| `general-purpose` | Agente de uso geral |
| `code-review` | Revisão de código |
| `testing` | Criação de testes |
| `documentation` | Geração de docs |
| `architect` | Arquitetura de software |
| `dev` | Desenvolvimento |
| `devops` | Infra e CI/CD |
| `qa` | Qualidade e testes |

### Criar Agente Personalizado

```bash
# Criar novo agente
npx cleudocode-core agents --add meu-agente

# Editar o agente
nano .agents/agents/meu-agente.md
```

Exemplo de agente:

```markdown
# MEU-AGENTE

## Descrição
Especialista em criação de APIs GraphQL.

## Comandos
- *help - Mostrar ajuda
- *generate - Gerar schema
- *resolve - Criar resolvers

## Exemplo
```bash
cleudocode-core run meu-agente -t "criar schema de usuário"
```
```

## ⚙️ Configuração

### Arquivo `.cleudocode-core`

```yaml
version: "1.0.0"

settings:
  language: "pt-BR"
  default_agent: "general-purpose"
  verbose: false

llms:
  models:
    - name: "qwen3:4b"
      backend: "ollama"
      hostname: "http://localhost:11434"
      enabled: true
    
    - name: "gpt-4o-mini"
      backend: "openai"
      enabled: false

agents:
  enabled:
    - "general-purpose"
    - "code-review"
    - "testing"
  default: "general-purpose"
  max_workers: 8
  timeout: 300

paths:
  rules: ".agents/rules"
  agents: ".agents/agents"
  tasks: ".agents/tasks"
```

### Variáveis de Ambiente

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
OLLAMA_HOST=http://localhost:11434
```

## 🔌 Backends LLM Suportados

### Ollama (Local - Recomendado)

```yaml
llms:
  models:
    - name: "qwen3:4b"
      backend: "ollama"
      hostname: "http://localhost:11434"
      enabled: true
```

**Instalar Ollama:**
```bash
# Linux/Mac
curl -fsSL https://ollama.com/install.sh | sh

# Baixar modelo
ollama pull qwen3:4b

# Iniciar servidor
ollama serve
```

### OpenAI

```yaml
llms:
  models:
    - name: "gpt-4o-mini"
      backend: "openai"
      enabled: true
```

```bash
# .env
OPENAI_API_KEY=sk-...
```

### Anthropic

```yaml
llms:
  models:
    - name: "claude-3-5-sonnet"
      backend: "anthropic"
      enabled: true
```

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
```

### Google Gemini

```yaml
llms:
  models:
    - name: "gemini-2.0-flash"
      backend: "gemini"
      enabled: true
```

```bash
# .env
GEMINI_API_KEY=...
```

### vLLM (Self-hosted)

```yaml
llms:
  models:
    - name: "meta-llama/Llama-3.1-8B-Instruct"
      backend: "vllm"
      hostname: "http://localhost:8091"
      enabled: true
```

### HuggingFace

```yaml
llms:
  models:
    - name: "meta-llama/Llama-3.1-8B-Instruct"
      backend: "huggingface"
      max_gpu_memory: {0: "48GB"}
      eval_device: "cuda:0"
      enabled: true
```

## 📚 Estrutura de Diretórios

```
projeto/
├── .cleudocode-core       # Configuração principal
├── .env                   # Variáveis de ambiente
├── .env.example           # Exemplo de variáveis
├── AGENTS.md              # Configuração de agentes
│
├── .agents/
│   ├── constitution.md    # Princípios fundamentais
│   ├── agents/            # Definições de agentes
│   ├── rules/             # Regras de código
│   ├── tasks/             # Tarefas e workflows
│   ├── templates/         # Templates de código
│   ├── outputs/           # Saídas geradas
│   ├── logs/              # Logs de execução
│   └── storage/           # Armazenamento (memória)
│
├── src/                   # Código fonte
├── tests/                 # Testes
└── docs/                  # Documentação
```

## 📝 Regras de Código

### JavaScript/TypeScript

```json
// .eslintrc.json
{
  "indent": ["error", 2],
  "quotes": ["error", "single"],
  "semi": ["error", "never"],
  "comma-dangle": ["error", "always-multiline"]
}
```

### Python

```toml
# pyproject.toml
[lint]
select = ["E", "W", "F", "I", "B"]
line-length = 100
```

### Commits (Conventional Commits)

```bash
# Formato
<tipo>(<escopo>): <descrição>

# Tipos
feat: Nova funcionalidade
fix: Correção de bug
perf: Melhoria de performance
refactor: Refatoração
docs: Documentação
chore: Manutenção
test: Testes
```

## 🔧 Integração com IDEs

### Cursor

```bash
# Sincronizar regras
npx cleudocode-core sync --ide cursor
```

### Claude Code

```bash
# Sincronizar regras
npx cleudocode-core sync --ide claude
```

### VS Code

```bash
# Instalar extensão
# Cleudocode Core (em breve)
```

## 🧪 Quality Gates

```bash
# Rodar todos os checks
npm run lint
npm run typecheck
npm test
npm run build
```

### Configurar CI/CD

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

## 🛠️ Troubleshooting

### Erro: Node.js versão incompatível

```bash
# Verificar versão
node --version

# Atualizar Node.js
nvm install 20
nvm use 20
```

### Erro: .cleudocode-core não encontrado

```bash
# Inicializar no projeto
npx cleudocode-core init
```

### Erro: Agente não encontrado

```bash
# Listar agentes disponíveis
npx cleudocode-core agents --list

# Criar agente se necessário
npx cleudocode-core agents --add nome-do-agente
```

### Ollama não conecta

```bash
# Verificar se está rodando
ollama list

# Iniciar servidor
ollama serve

# Verificar porta
curl http://localhost:11434/api/tags
```

## 📊 Métricas de Qualidade

| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Cobertura de testes | 80% | 90%+ |
| Complexidade ciclomática | < 10 | < 5 |
| Linhas por função | < 50 | < 30 |
| Parâmetros por função | < 4 | < 3 |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/minha-feature`)
3. Commit (`git commit -m 'feat: adiciona minha feature'`)
4. Push (`git push origin feature/minha-feature`)
5. Abra um Pull Request

### Desenvolvimento Local

```bash
# Clonar repositório
git clone https://github.com/cleudocode/cleudocode-core.git
cd cleudocode-core

# Instalar dependências
npm install

# Link global para desenvolvimento
npm link

# Usar versão de desenvolvimento
cleudocode-core --version

# Rodar testes
npm test

# Lint
npm run lint

# Formatar
npm run format
```

## 📄 Licença

MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links

- [Documentação Completa](https://github.com/cleudocode/cleudocode-core/docs)
- [Issues](https://github.com/cleudocode/cleudocode-core/issues)
- [NPM](https://www.npmjs.com/package/cleudocode-core)
- [Exemplos](https://github.com/cleudocode/cleudocode-core/tree/main/examples)

## 📫 Contato

- Site: https://cleudocode.com
- Email: contato@cleudocode.com
- Discord: https://discord.gg/cleudocode

---

**Feito com ❤️ pela Cleudocode Team**

[![Star no GitHub](https://img.shields.io/github/stars/cleudocode/cleudocode-core?style=social)](https://github.com/cleudocode/cleudocode-core)
