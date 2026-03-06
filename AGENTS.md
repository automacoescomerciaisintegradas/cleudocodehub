# AGENTS.md - Cleudocode Hub

Este arquivo configura o comportamento esperado de agentes AI no Cleudocode Hub.

## 📜 Constituição

Siga `.agents/constitution.md` como fonte de verdade:

1. **CLI First** - Sempre preferir interface de linha de comando
2. **Agent Authority** - Respeitar a autoridade do agente especializado
3. **Story-Driven** - Desenvolvimento baseado em histórias/requirements
4. **No Invention** - Não inventar features não solicitadas
5. **Quality First** - Qualidade antes de velocidade
6. **Absolute Imports** - Usar imports absolutos sempre que possível

## 🔄 Workflow Obrigatório

### 1. Iniciar por uma Story
- Localizar story em `docs/stories/` ou criar nova
- Ler acceptance criteria cuidadosamente

### 2. Implementação
- Implementar apenas o que os acceptance criteria pedem
- Seguir regras de código em `.agents/rules/code-style.md`
- Commits frequentes e atômicos

### 3. Atualizar Documentação
- Checklist: `[ ]` → `[x]`
- File list com arquivos modificados
- README se necessário

### 4. Quality Gates (ANTES de concluir)
```bash
# JavaScript/TypeScript
npm run lint
npm run typecheck
npm test

# Python
ruff check .
mypy .
pytest

# Build
npm run build
```

## 📁 Estrutura Principal

| Diretório | Descrição |
|-----------|-----------|
| `.agents/` | Configuração de agentes AI |
| `.agents/agents/` | Definições de agentes (personas) |
| `.agents/rules/` | Regras e triggers |
| `.agents/tasks/` | Tarefas e workflows |
| `.agents/templates/` | Templates de código |
| `src/` | Código fonte principal |
| `tests/` | Testes unitários, integração, E2E |
| `docs/` | Documentação e stories |
| `scripts/` | Scripts utilitários |

## 🤖 Agentes Disponíveis

### Atalhos de Ativação

| Agente | Atalho | Descrição |
|--------|--------|-----------|
| Master | `@master` | Orquestrador principal |
| Architect | `@architect` | Arquitetura e design |
| Analyst | `@analyst` | Análise de requisitos |
| Dev | `@dev` | Desenvolvimento |
| DevOps | `@devops` | Infra e CI/CD |
| QA | `@qa` | Qualidade e testes |
| PM | `@pm` | Product Manager |
| PO | `@po` | Product Owner |
| SM | `@sm` | Scrum Master |
| UX | `@ux` | UX Designer |

### Como Ativar

```
@architect - Ativa o agente arquiteto
/dev - Ativa o agente desenvolvedor
@qa --verbose - Ativa QA com verbose
```

### Resposta Esperada

Ao ativar um agente:
1. Confirmar agente ativado
2. Mostrar 3-6 comandos principais
3. Seguir na persona do agente até `*exit`

## 🎯 Comandos do Sistema

### Gerais
- `*help` - Mostrar ajuda
- `*status` - Status atual
- `*exit` - Sair do modo agente
- `*reset` - Resetar contexto

### Desenvolvimento
- `*generate` - Gerar código
- `*review` - Revisar código
- `*test` - Executar testes
- `*build` - Build do projeto

### Documentação
- `*docs` - Gerar documentação
- `*explain` - Explicar código
- `*summarize` - Resumir mudanças

## 📚 Regras de Código

Ver `.agents/rules/code-style.md` para:
- Estilo de código (JS/TS, Python)
- Naming conventions
- Commits (Conventional Commits)
- Quality gates
- Code review checklist
- Segurança

## 🔧 Configuração

Arquivo principal: `.cleudocode-core`

```yaml
settings:
  language: pt-BR
  default_agent: general-purpose
  verbose: false

agents:
  enabled:
    - general-purpose
    - code-review
    - testing
```

## 🚨 Erros Comuns

### ❌ Evitar
- Inventar features não solicitadas
- Ignorar quality gates
- Commits grandes sem descrição
- Hardcoded values (usar .env)
- Console.log em produção

### ✅ Fazer
- Seguir acceptance criteria
- Rodar lint/test antes de commit
- Commits atômicos e descritivos
- Usar variáveis de ambiente
- Logger apropriado

## 📈 Métricas de Qualidade

| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Cobertura de testes | 80% | 90%+ |
| Complexidade ciclomática | < 10 | < 5 |
| Linhas por função | < 50 | < 30 |
| Parâmetros por função | < 4 | < 3 |

## 🔗 Links Úteis

- [Constituição](.agents/constitution.md)
- [Regras de Código](.agents/rules/code-style.md)
- [Configuração Core](.cleudocode-core)
- [Documentação](docs/)

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-06
