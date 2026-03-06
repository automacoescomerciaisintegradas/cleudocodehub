# 🚀 Guia Rápido - SuperCleudocode Plugin

## Instalação e Configuração

### 1. Instalar o Plugin

```bash
# Navegue até o diretório do cleudocodehub.skill
cd /root/cleudocode/cleudocodehub.skill

# Instale o plugin
cleudocode-core plugin install supercleudocode-plugin
```

### 2. Verificar Instalação

```bash
# Listar plugins instalados
cleudocode-core plugin list

# Listar Super-Skills disponíveis
cleudocode-core super-skill --list
```

### 3. Verificar Configuração

O arquivo `.cleudocode-core` já deve conter a seção `supercleudocode:`.

```bash
# Ver configuração
cleudocode-core config supercleudocode
```

---

## Comandos Disponíveis

### `*super-skill` - Gerenciar Skills

```bash
# Listar todas as skills
cleudocode-core super-skill --list

# Ver documentação de uma skill
cleudocode-core super-skill brainstorming
cleudocode-core super-skill test-driven-development

# Ver status das skills ativas
cleudocode-core super-skill --status
```

### `*super-plan` - Criar Plano

```bash
# Criar novo plano
cleudocode-core super-plan "adicionar autenticação de usuário"

# Criar plano a partir de design existente
cleudocode-core super-plan "implementar notifications" --from-design docs/design.md

# Criar com prioridade
cleudocode-core super-plan "fix critical bug" --priority critical
```

### `*super-execute` - Executar Plano

```bash
# Executar plano atual
cleudocode-core super-execute

# Executar plano específico
cleudocode-core super-execute --plan 2026-03-06--auth-plan.md

# Executar tarefas específicas
cleudocode-core super-execute --from-task 1 --to-task 5

# Executar em paralelo com subagentes
cleudocode-core super-execute --parallel --agents 3
```

### `*super-review` - Code Review

```bash
# Solicitar review
cleudocode-core super-review

# Review de diretório específico
cleudocode-core super-review --target src/auth/

# Review focado em segurança
cleudocode-core super-review --security

# Review de pull request
cleudocode-core super-review --pr 42
```

### `*super-test` - Executar Testes

```bash
# Executar todos os testes
cleudocode-core super-test

# Apenas testes unitários
cleudocode-core super-test --type unit

# Com cobertura
cleudocode-core super-test --coverage

# Modo watch
cleudocode-core super-test --watch src/
```

### `*super-debug` - Debug Sistemático

```bash
# Iniciar debug
cleudocode-core super-debug "dashboard hangs on refresh"

# Com arquivo de log
cleudocode-core super-debug --log error.log

# Com passos de reprodução
cleudocode-core super-debug --repro "1. Login 2. Dashboard 3. Refresh"
```

### `*super-deploy` - Deploy

```bash
# Deploy para staging
cleudocode-core super-deploy staging

# Deploy para produção com verificação
cleudocode-core super-deploy production --verify

# Simular deploy
cleudocode-core super-deploy production --dry-run

# Rollback
cleudocode-core super-deploy production --rollback v1.2.3
```

### `*super-init` - Inicializar Projeto

```bash
# Inicializar novo projeto
cleudocode-core super-init my-app

# Com template
cleudocode-core super-init my-api --template nodejs-api

# Sem instalar dependências
cleudocode-core super-init my-project --skip-install
```

---

## Super-Skills Disponíveis

### Skills Principais

| Skill | Quando Usar |
|-------|-------------|
| **brainstorming** | Antes de QUALQUER trabalho criativo |
| **test-driven-development** | Ao implementar features ou bugfixes |
| **systematic-debugging** | Ao investigar bugs ou erros |
| **writing-plans** | Após aprovação do design |
| **executing-plans** | Para executar planos aprovados |

### Skills de Colaboração

| Skill | Quando Usar |
|-------|-------------|
| **requesting-code-review** | Antes de merge/PR |
| **receiving-code-review** | Ao receber feedback |
| **using-git-worktrees** | Para desenvolvimento paralelo |
| **finishing-a-development-branch** | Ao completar uma branch |
| **subagent-driven-development** | Para iteração rápida |
| **dispatching-parallel-agents** | Para trabalho concorrente |

### Skills Meta

| Skill | Quando Usar |
|-------|-------------|
| **using-supercleudocode** | Introdução ao sistema |
| **writing-super-skills** | Para criar novas skills |
| **verification-before-completion** | Antes de declarar algo como pronto |

---

## Workflow Completo

### Nova Feature

```bash
# 1. Brainstorm do design
@brainstorming

# 2. Criar branch isolado
git worktree add feature/my-feature

# 3. Escrever plano
*super-plan "adicionar página de perfil de usuário"

# 4. Executar plano
*super-execute

# 5. Rodar testes
*super-test --coverage

# 6. Solicitar review
*super-review --security

# 7. Merge e cleanup
*finish-branch
```

### Bug Fix

```bash
# 1. Debug sistemático
@systematic-debugging

# 2. Brainstorm da solução
@brainstorming

# 3. Criar branch de fix
git worktree add fix/bug-123

# 4. Escrever teste falhando
@test-driven-development

# 5. Corrigir e verificar
*verification-before-completion

# 6. Review e merge
*super-review
*finish-branch
```

---

## Integração com MADMAX

O MADMAX orquestra todo o workflow:

```bash
# MADMAX como orquestrador
@madmax *orchestrate new-feature

# MADMAX delegando
@madmax *delegate @brainstorming "design auth system"
@madmax *delegate @testing "criar suite de testes"
@madmax *delegate @code-review "revisar PR #42"

# MADMAX coordenando
@madmax *coordinate @dev @testing @code-review
```

---

## Configuração

### Editar `.cleudocode-core`

```yaml
supercleudocode:
  enabled: true
  
  auto_trigger:
    enabled: true
    skills:
      - brainstorming
      - test-driven-development
      - systematic-debugging
  
  quality_gates:
    test_coverage_min: 80
    lint_required: true
    typecheck_required: true
```

---

## Troubleshooting

### Comando não encontrado

```bash
# Verificar plugin instalado
cleudocode-core plugin list

# Reinstalar se necessário
cleudocode-core plugin uninstall supercleudocode-plugin
cleudocode-core plugin install supercleudocode-plugin
```

### Skill não ativa

```bash
# Verificar skills ativas
cleudocode-core super-skill --status

# Ativar manualmente
cleudocode-core super-skill --activate brainstorming
```

### Erro na execução

```bash
# Verificar configuração
cleudocode-core config supercleudocode

# Verificar logs
cat .agents/logs/cleudocode.log
```

---

## Próximos Passos

1. **Listar skills**: `cleudocode-core super-skill --list`
2. **Ler documentação**: `supercleudocode-plugin/README.md`
3. **Quick start**: `supercleudocode-plugin/QUICKSTART.md`
4. **Primeiro uso**: `cleudocode-core super-plan "minha primeira feature"`

---

**Versão**: 1.0.0
**Última atualização**: 2026-03-06
