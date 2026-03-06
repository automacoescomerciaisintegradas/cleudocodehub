---
trigger: always_on
---

# 📜 Cleudocode Hub - Regras Gerais

## ⚠️ Regras Críticas

### 1. Commit Antes de Mudanças Grandes
**Sempre faça commit ANTES de pedir para IAs fazerem mudanças grandes!**

```bash
git add .
git commit -m "feat: descrição das mudanças atuais"
git push
```

### 2. Estrutura de Diretórios
Respeitar a estrutura do projeto:
```
cleudocodehub/
├── .agents/           # Configuração de agentes
├── src/               # Código fonte
├── tests/             # Testes
├── docs/              # Documentação
└── scripts/           # Scripts utilitários
```

### 3. Quality Gates
Sempre rodar antes de commitar:
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 📋 Verificação de Arquivos

### Arquivos Obrigatórios
- [ ] `.gitignore` na raiz
- [ ] `.env.example` com variáveis de ambiente
- [ ] `README.md` com instruções
- [ ] `AGENTS.md` com configuração de agentes

### Conteúdo do .gitignore
Verificar se inclui:
- `.env` e variações
- `node_modules/`
- `venv/`, `.venv/`
- `__pycache__/`, `*.pyc`
- `dist/`, `build/`
- `.DS_Store`, `Thumbs.db`
- `.vscode/`, `.idea/`

## 🎯 Padrões de Código

Ver `.agents/rules/code-style.md` para detalhes completos.

### Resumo
- **Indentação**: 2 espaços (JS/TS), 4 espaços (Python)
- **Aspas**: Simples
- **Semicolons**: Não usar (JS/TS)
- **Line length**: 100 caracteres
- **Commits**: Conventional Commits

## 🔗 Documentos Relacionados

| Documento | Descrição |
|-----------|-----------|
| [Constituição](../constitution.md) | Princípios fundamentais |
| [Code Style](./code-style.md) | Regras de código detalhadas |
| [MADMAX Rules](./madmax-rules.md) | Regras especializadas MADMAX |
| [AGENTS.md](../../AGENTS.md) | Configuração de agentes |
| [.cleudocode-core](../../.cleudocode-core) | Configuração central |

## 🚀 Agentes Disponíveis

| Agente | Descrição | Arquivo |
|--------|-----------|---------|
| **MADMAX** 🚀 | Master Agent for Development & Maximum Automation Xpert | [agents/madmax.md](../agents/madmax.md) |
| Code Review | Especialista em revisão de código | [agents/code-review.md](../agents/code-review.md) |
| Testing | Especialista em testes | [agents/testing.md](../agents/testing.md) |
| Documentation | Especialista em documentação | [agents/documentation.md](../agents/documentation.md) |
| General Purpose | Agente de uso geral | [agents/general-purpose.md](../agents/general-purpose.md) |