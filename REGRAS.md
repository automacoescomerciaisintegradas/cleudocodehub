# 📚 Cleudocode Hub - Resumo de Regras e Configurações

> Guia rápido de referência para desenvolvimento no Cleudocode Hub.

## 🚀 Início Rápido

### 1. Configuração Inicial
```bash
# Clonar repositório
git clone <repo>
cd cleudocodehub

# Copiar variáveis de ambiente
cp .env.example .env

# Instalar dependências
npm install

# Verificar configuração
cat .cleudocode-core
```

### 2. Quality Gates
```bash
# JavaScript/TypeScript
npm run lint
npm run typecheck
npm test
npm run build

# Python
ruff check .
mypy .
pytest
```

## 📁 Estrutura de Arquivos

```
cleudocodehub/
├── .cleudocode-core        # Configuração central (YAML)
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── .eslintrc.json          # Configuração ESLint
├── .prettierrc             # Configuração Prettier
├── AGENTS.md               # Configuração de agentes AI
├── pyproject.toml          # Configuração Python (Ruff)
├── mypy.ini                # Configuração MyPy
│
├── .agents/
│   ├── constitution.md     # Princípios fundamentais
│   ├── rules/
│   │   ├── rules.md        # Regras gerais
│   │   └── code-style.md   # Regras de código detalhadas
│   ├── agents/             # Definições de agentes
│   ├── tasks/              # Tarefas e workflows
│   └── templates/          # Templates de código
│
├── src/                    # Código fonte
├── tests/                  # Testes
├── docs/                   # Documentação
└── scripts/                # Scripts utilitários
```

## 📝 Regras de Código

### JavaScript/TypeScript
| Configuração | Valor |
|--------------|-------|
| Indentação | 2 espaços |
| Aspas | Simples (`'`) |
| Semicolons | Não |
| Line length | 100 |
| Trailing comma | ES5 (objetos/arrays) |

### Python
| Configuração | Valor |
|--------------|-------|
| Indentação | 4 espaços |
| Aspas | Simples (`'`) |
| Line length | 100 |
| Type hints | Obrigatório (funções públicas) |

### Naming
| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos | kebab-case | `my-file.js` |
| Funções | camelCase | `myFunction` |
| Classes | PascalCase | `MyClass` |
| Constantes | UPPER_SNAKE_CASE | `MAX_SIZE` |

## 🔄 Commits

### Padrão: Conventional Commits
```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

### Tipos Principais
| Tipo | Descrição |
|------|-----------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `perf` | Melhoria de performance |
| `refactor` | Refatoração |
| `docs` | Documentação |
| `chore` | Manutenção |
| `test` | Testes |

### Exemplos
```bash
# Bom
git commit -m "feat(agent): adicionar suporte a múltiplos LLMs"
git commit -m "fix(core): corrigir race condition no scheduler"
git commit -m "docs(readme): atualizar instruções de instalação"

# Ruim
git commit -m "atualização"
git commit -m "arrumei o bug"
```

## 🎯 Workflow Obrigatório

### 1. Antes de Codificar
```bash
git status
git pull origin main
git checkout -b feature/nome-da-feature
```

### 2. Durante Desenvolvimento
- Commits frequentes e atômicos
- Seguir regras de código
- Escrever testes

### 3. Antes de Commit
```bash
# Quality gates
npm run lint && npm run typecheck && npm test

# Verificar mudanças
git status
git diff
```

### 4. Antes de Push
```bash
# Atualizar branch
git pull origin main

# Rodar testes novamente
npm test

# Push
git push origin feature/nome-da-feature
```

## 🤖 Agentes AI

### Atalhos
| Agente | Atalho | Descrição |
|--------|--------|-----------|
| Master | `@master` | Orquestrador |
| Architect | `@architect` | Arquitetura |
| Dev | `@dev` | Desenvolvimento |
| DevOps | `@devops` | Infra/CI/CD |
| QA | `@qa` | Qualidade |

### Como Usar
```
@architect - Ativa agente arquiteto
/dev --verbose - Ativa dev com verbose
@qa - Ativa agente de qualidade
```

## 📊 Métricas de Qualidade

| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Cobertura de testes | 80% | 90%+ |
| Complexidade | < 10 | < 5 |
| Linhas/função | < 50 | < 30 |
| Parâmetros/função | < 4 | < 3 |

## ⚠️ Erros Comuns

### ❌ Evitar
- Hardcoded values → Usar `.env`
- Console.log em produção → Usar logger
- Promises não tratadas → try/catch
- Imports relativos profundos → Imports absolutos
- Funções grandes → Funções < 50 linhas
- Comentários óbvios → Código auto-explicativo

### ✅ Fazer
- Variáveis de ambiente
- Logger apropriado
- Error handling
- Imports absolutos
- Funções pequenas
- JSDoc/Docstrings

## 🔧 Comandos Úteis

### Git
```bash
git status                    # Status atual
git log --oneline -10         # Histórico
git checkout -b feature/nome  # Criar branch
git rebase -i HEAD~3          # Rebase interativo
```

### Quality
```bash
npm run lint                  # Lint
npm run typecheck             # Type check
npm test                      # Testes
npm run build                 # Build
```

### Python
```bash
ruff check .                  # Lint
mypy .                        # Type check
pytest -v --cov               # Testes
python -m build               # Build
```

## 📚 Documentos Completos

| Documento | Descrição |
|-----------|-----------|
| [Constituição](.agents/constitution.md) | Princípios fundamentais |
| [Code Style](.agents/rules/code-style.md) | Regras de código detalhadas |
| [AGENTS.md](AGENTS.md) | Configuração de agentes |
| [.cleudocode-core](.cleudocode-core) | Configuração central |

## 🔗 Links Externos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [12 Factor App](https://12factor.net/)

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-06
