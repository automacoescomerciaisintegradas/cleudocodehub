---
trigger: always_on
---

# 📜 Cleudocode Hub - Regras de Código

## 🎯 Princípios Fundamentais

1. **CLI First** - Sempre preferir interface de linha de comando
2. **Agent Authority** - Respeitar a autoridade do agente especializado
3. **Story-Driven** - Desenvolvimento baseado em histórias/requirements
4. **No Invention** - Não inventar features não solicitadas
5. **Quality First** - Qualidade antes de velocidade
6. **Absolute Imports** - Usar imports absolutos sempre que possível

## 📝 Estilo de Código

### JavaScript/TypeScript
- **Indentação**: 2 espaços
- **Aspas**: Simples ('')
- **Semicolons**: Não usar
- **Line length**: Máximo 100 caracteres
- **Trailing commas**: Usar em objetos/arrays (es5)

### Python
- **Indentação**: 4 espaços
- **Aspas**: Simples ('') ou duplas ("") consistentemente
- **Line length**: Máximo 100 caracteres
- **Type hints**: Sempre usar em funções públicas

### Naming Conventions
- **Arquivos**: `kebab-case` (ex: `my-file.js`)
- **Funções/Métodos**: `camelCase` (ex: `myFunction`)
- **Classes**: `PascalCase` (ex: `MyClass`)
- **Constantes**: `UPPER_SNAKE_CASE` (ex: `MAX_SIZE`)
- **Componentes React**: `PascalCase` (ex: `MyComponent`)

## 🔄 Commits

### Padrão: Conventional Commits

```
<tipo>(<escopo>): <descrição curta>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `perf`: Melhoria de performance
- `revert`: Reversão de commit
- `docs`: Mudança em documentação
- `chore`: Tarefas de manutenção
- `refactor`: Refatoração de código
- `test`: Adição/modificação de testes
- `ci`: Mudanças em CI/CD
- `style`: Formatação/código visual

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

## 🚀 Workflow Obrigatório

### 1. Antes de Codificar
```bash
# Verificar status atual
git status
git pull origin main
```

### 2. Durante Desenvolvimento
- Criar branch feature: `git checkout -b feature/nome-da-feature`
- Commits frequentes e atômicos
- Rodar quality gates localmente

### 3. Quality Gates (ANTES do Commit)
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

### 4. Antes de Push
```bash
# Atualizar branch
git pull origin main

# Rodar todos os testes
npm test

# Commit final
git commit -m "feat: descrição completa"

# Push
git push origin feature/nome-da-feature
```

## 📁 Estrutura de Projeto

### Cleudocode Hub
```
cleudocodehub/
├── .agents/
│   ├── agents/          # Definições de agentes
│   ├── rules/           # Regras e triggers
│   ├── tasks/           # Tarefas e workflows
│   ├── templates/       # Templates de código
│   ├── outputs/         # Saídas geradas
│   ├── logs/            # Logs de execução
│   └── storage/         # Armazenamento (memória)
├── .cleudocode-core     # Configuração central
├── src/                 # Código fonte
├── tests/               # Testes
├── docs/                # Documentação
└── scripts/             # Scripts utilitários
```

## 🔒 Segurança

### NUNCA commitar
- [ ] Chaves de API (.env, credenciais)
- [ ] Arquivos de configuração local
- [ ] Logs com dados sensíveis
- [ ] Binários compilados

### Verificar antes de commitar
```bash
# Verificar se há secrets
git diff --cached | grep -i "api_key\|token\|secret\|password"

# Verificar arquivos grandes
git diff --cached --numstat | awk '$1 > 1000 || $2 > 1000'
```

## 🧪 Testes

### Requisitos Mínimos
- Cobertura mínima: 80%
- Testes unitários para funções críticas
- Testes de integração para APIs
- Testes E2E para fluxos principais

### Estrutura de Testes
```
tests/
├── unit/
│   ├── agents/
│   ├── core/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── workflows/
```

## 📚 Documentação

### Todo código deve ter
- [ ] JSDoc/Docstring em funções públicas
- [ ] Exemplos de uso
- [ ] Descrição de parâmetros e retorno
- [ ] Exceções possíveis

### Exemplo JavaScript
```javascript
/**
 * Processa uma tarefa usando o agente especificado
 * @param {string} task - Descrição da tarefa
 * @param {string} agent - Nome do agente
 * @returns {Promise<Object>} Resultado do processamento
 * @throws {AgentError} Se o agente não estiver disponível
 */
async function processTask(task, agent) {
  // implementação
}
```

### Exemplo Python
```python
def process_task(task: str, agent: str) -> dict:
    """
    Processa uma tarefa usando o agente especificado.
    
    Args:
        task: Descrição da tarefa
        agent: Nome do agente
    
    Returns:
        Resultado do processamento
    
    Raises:
        AgentError: Se o agente não estiver disponível
    """
    # implementação
```

## 🎯 Code Review Checklist

### Antes de solicitar review
- [ ] Código segue estilo do projeto
- [ ] Tests adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Sem console.log/debug deixado
- [ ] Commits com mensagens claras
- [ ] Branch atualizada com main

### Durante review
- [ ] Responder todos os comentários
- [ ] Explicar decisões complexas
- [ ] Aceitar sugestões de melhoria
- [ ] Manter tom profissional e construtivo

## ⚡ Comandos Úteis

### Git
```bash
# Ver status
git status

# Ver histórico
git log --oneline -10

# Criar branch
git checkout -b feature/nome

# Rebase interativo
git rebase -i HEAD~3

# Squash commits
git merge --squash feature/nome
```

### Quality
```bash
# Lint
npm run lint
ruff check .

# Type check
npm run typecheck
mypy .

# Test
npm test
pytest -v --cov

# Build
npm run build
python -m build
```

## 🚨 Erros Comuns a Evitar

1. **Hardcoded values** - Usar variáveis de ambiente
2. **Console.log em produção** - Usar logger apropriado
3. **Promises não tratadas** - Sempre usar try/catch ou .catch()
4. **Imports relativos profundos** - Usar imports absolutos
5. **Funções grandes** - Manter funções com < 50 linhas
6. **Comentários óbvios** - Comentar o "porquê", não o "quê"

## 📈 Métricas de Qualidade

| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Cobertura de testes | 80% | 90%+ |
| Complexidade ciclomática | < 10 | < 5 |
| Linhas por função | < 50 | < 30 |
| Parâmetros por função | < 4 | < 3 |
| Tempo de build | < 2min | < 30s |

## 🔄 Integração Contínua

### Pipeline Mínimo
```yaml
stages:
  - lint
  - typecheck
  - test
  - build
  - deploy
```

### Gatilhos
- Push em feature branches: lint + test
- Pull Request: lint + typecheck + test + build
- Merge em main: pipeline completo + deploy

---

**Última atualização**: 2026-03-06
**Versão**: 1.0.0
