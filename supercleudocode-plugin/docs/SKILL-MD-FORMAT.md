# SKILL.md Format Specification

> **Especificação oficial do formato SKILL.md para Cleudocode Hub**
> Baseado em: Skills Marketplace (160,566+ skills)

---

## 📋 Visão Geral

O formato **SKILL.md** é um padrão aberto para definição de habilidades de agentes IA.

### Estrutura Básica

```
skill-name/
└── SKILL.md          # Definição principal da skill
```

---

## 📝 Estrutura do Arquivo SKILL.md

### Template Completo

```markdown
---
name: skill-name-with-hyphens
description: Use when [triggering conditions and symptoms]
version: 1.0.0
author: Author Name
repository: https://github.com/author/repo
category: Primary_Shell
tags:
  - tag1
  - tag2
  - tag3
dependencies:
  - skill-dependency-1
  - skill-dependency-2
triggers:
  - "before coding"
  - "before implementing"
  - "creating feature"
commands:
  - name: "*command-name"
    description: "Description of command"
    usage: "*command-name [args]"
---

# Skill Name

## Overview

Brief description of what this skill does and its core principle.

## When to Use

### ALWAYS Use When:
- Symptom or condition 1
- Symptom or condition 2
- Symptom or condition 3

### When NOT to Use:
- Exception 1
- Exception 2

## Core Pattern

### Before
```code
// Code or situation before skill
```

### After
```code
// Code or situation after applying skill
```

## Implementation

### Step 1: Description
```bash
command to execute
```

### Step 2: Description
```code
// Code example
```

## Quality Comparison

| Quality | Good | Bad |
|---------|------|-----|
| **Trait** | Example | Example |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Error pattern | Solution |

## Related Skills

- [[skill-name-1]] - Description
- [[skill-name-2]] - Description

## Examples

### Example 1: Scenario Name

**Input:**
```
Input description
```

**Output:**
```
Expected output
```

## Verification Checklist

- [ ] Check 1
- [ ] Check 2
- [ ] Check 3

**Can't check all boxes?** Consequence or action to take.

---

**Version**: 1.0.0
**License**: MIT
**Repository**: https://github.com/author/repo
```

---

## 🔧 YAML Frontmatter

### Campos Obrigatórios

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `name` | string | Nome da skill (kebab-case) | `test-driven-development` |
| `description` | string | Quando usar (gatilhos) | `Use when implementing features` |

### Campos Opcionais

| Campo | Tipo | Descrição | Padrão |
|-------|------|-----------|---------|
| `version` | string | Versão da skill | `1.0.0` |
| `author` | string | Autor/criador | `Cleudocode Team` |
| `repository` | string | URL do repositório | - |
| `category` | string | Categoria da skill | - |
| `tags` | array | Tags para busca | - |
| `dependencies` | array | Skills dependentes | - |
| `triggers` | array | Gatilhos de ativação | - |
| `commands` | array | Comandos disponíveis | - |

### Exemplo de Frontmatter

```yaml
---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
version: 1.0.0
author: Cleudocode Team
repository: https://github.com/cleudocode/cleudocodehub.skill
category: Testing
tags:
  - testing
  - tdd
  - quality
dependencies: []
triggers:
  - "before writing code"
  - "implementing feature"
  - "fixing bug"
commands:
  - name: "*test"
    description: "Run tests"
    usage: "*test --coverage"
---
```

---

## 📚 Seções do Corpo

### 1. Overview

**Propósito:** Descrição concisa do que a skill faz.

```markdown
## Overview

**TDD** is the practice of writing tests BEFORE writing implementation code.

**The Iron Law:** `NO CODE BEFORE TEST`
```

### 2. When to Use

**Propósito:** Define quando a skill deve ser ativada.

```markdown
## When to Use

### ALWAYS Use When:
- Implementing new features
- Fixing bugs
- Refactoring existing code

### When NOT to Use:
- Exploratory prototyping
- One-off scripts
```

### 3. Core Pattern

**Propósito:** Mostra o padrão principal da skill.

```markdown
## Core Pattern

### Before
```javascript
// Bad pattern
writeCode()
thenWriteTests()
```

### After
```javascript
// Good pattern
writeFailingTest()
watchItFail()
writeMinimalCode()
watchItPass()
```
```

### 4. Implementation

**Propósito:** Passo a passo de implementação.

```markdown
## Implementation

### Phase 1: RED
Write a failing test first.

```typescript
it('should calculate total', () => {
  expect(calculateTotal([1, 2, 3])).toBe(6)
})
```

### Phase 2: GREEN
Write minimal code to pass.

```typescript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0)
}
```

### Phase 3: REFACTOR
Clean up while keeping tests green.
```
```

### 5. Quality Comparison

**Propósito:** Compara boa vs má aplicação.

```markdown
## Quality Comparison

| Quality | Good | Bad |
|---------|------|-----|
| **Test First** | Write test, watch fail | Write code, then test |
| **Code Amount** | Minimal to pass | Extra features |
| **Refactoring** | After every green | "Later" |
```

### 6. Common Mistakes

**Propósito:** Erros comuns e como corrigir.

```markdown
## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Too simple to test" | Simple code breaks too |
| "I'll test after" | Tests passing prove nothing |
| "Manually tested" | Not reproducible |
```

### 7. Related Skills

**Propósito:** Links para skills relacionadas.

```markdown
## Related Skills

- [[systematic-debugging]] - When tests fail
- [[verification-before-completion]] - Ensure quality
- [[requesting-code-review]] - Before merging
```

### 8. Examples

**Propósito:** Exemplos concretos de uso.

```markdown
## Examples

### Example 1: User Authentication

**Scenario:** Implement login feature

**RED:**
```typescript
it('should authenticate user', async () => {
  const result = await authenticate(credentials)
  expect(result.success).toBe(true)
})
```

**GREEN:**
```typescript
async function authenticate({ email, password }) {
  if (email === 'test@example.com' && password === 'secret') {
    return { success: true }
  }
  return { success: false }
}
```
```

### 9. Verification Checklist

**Propósito:** Checklist de verificação.

```markdown
## Verification Checklist

- [ ] Test written before code
- [ ] Test failed for right reason
- [ ] Implementation makes test pass
- [ ] Code refactored with tests green
- [ ] All tests passing

**Can't check all boxes?** Delete code. Start over.
```

---

## 🏷️ Categorias de Skills

### Categorias Principais

| Categoria | Descrição | Exemplos |
|-----------|-----------|----------|
| `Primary_Shell` | Operações principais | `system-commands`, `file-operations` |
| `Kernel_Logs` | Logs e monitoramento | `logging`, `debugging`, `telemetry` |
| `RAG_Context` | Contexto e memória | `context-management`, `memory` |
| `Knowledge` | Base de conhecimento | `documentation`, `indexing` |
| `Playground` | Testes e experimentos | `prompt-testing`, `model-comparison` |
| `Mission_Control` | Gerenciamento de agentes | `orchestration`, `delegation` |
| `Testing` | Testes e qualidade | `tdd`, `unit-testing`, `e2e` |
| `Development` | Desenvolvimento | `coding`, `refactoring`, `debugging` |
| `Review` | Revisão de código | `code-review`, `security-scan` |
| `Documentation` | Documentação | `api-docs`, `readme-generation` |

---

## 🔍 Descoberta de Skills

### Métodos de Busca

#### 1. Busca por Nome
```bash
marketplace search "test"
```

#### 2. Busca por Categoria
```bash
marketplace --category Testing
```

#### 3. Busca por Tags
```bash
marketplace search "tag:testing tag:tdd"
```

#### 4. Busca Semântica
```bash
marketplace search "how to write tests before code"
```

---

## 📦 Instalação de Skills

### Método 1: Instalação Direta

```bash
# Instalar do marketplace
marketplace install test-driven-development

# Instalar de URL
marketplace install https://github.com/repo/skill-name
```

### Método 2: Instalação Local

```bash
# Copiar para diretório de skills
cp -r skill-name supercleudocode-plugin/skills/

# Ativar skill
marketplace enable skill-name
```

### Método 3: Instalação via Git

```bash
# Clonar skill
git clone https://github.com/repo/skill-name.git
cd skill-name

# Instalar
marketplace install .
```

---

## 🔗 Dependencies

### Declarando Dependências

```yaml
---
name: my-skill
dependencies:
  - test-driven-development
  - systematic-debugging
---
```

### Resolução de Dependências

```
1. Verificar dependencies no frontmatter
2. Checar se estão instaladas
3. Instalar faltantes automaticamente
4. Validar versão compatível
```

---

## 🎯 Triggers

### Tipos de Triggers

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Keyword** | Palavra-chave | `"before coding"` |
| **Context** | Contexto do projeto | `"new feature"` |
| **File** | Tipo de arquivo | `*.test.js` |
| **Command** | Comando executado | `*test` |
| **Event** | Evento do sistema | `git commit` |

### Exemplo de Triggers

```yaml
triggers:
  # Keywords
  - "before coding"
  - "implementing feature"
  
  # Context
  - "new feature"
  - "bug fix"
  
  # Files
  - "*.test.js"
  - "*.spec.ts"
  
  # Commands
  - "*test"
  - "*generate"
```

---

## 📊 Metadata Schema

### Schema Completo

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "description"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$"
    },
    "description": {
      "type": "string",
      "maxLength": 1024
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "author": { "type": "string" },
    "repository": {
      "type": "string",
      "format": "uri"
    },
    "category": { "type": "string" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "dependencies": {
      "type": "array",
      "items": { "type": "string" }
    },
    "triggers": {
      "type": "array",
      "items": { "type": "string" }
    },
    "commands": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "description": { "type": "string" },
          "usage": { "type": "string" }
        }
      }
    }
  }
}
```

---

## ✅ Validação de Skills

### Validação Automática

```bash
# Validar skill
marketplace validate skill-name

# Validar todas
marketplace validate --all
```

### Checklists de Validação

#### Estrutura
- [ ] Arquivo SKILL.md existe
- [ ] Frontmatter YAML válido
- [ ] Nome em kebab-case
- [ ] Descrição presente

#### Conteúdo
- [ ] Overview claro
- [ ] When to Use definido
- [ ] Exemplos de código
- [ ] Verification checklist

#### Qualidade
- [ ] Sem erros de ortografia
- [ ] Código formatado
- [ ] Links funcionais
- [ ] Tags relevantes

---

## 🔄 Versionamento

### Version SemVer

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Bug fixes (backward compatible)
  │     └─────── New features (backward compatible)
  └───────────── Breaking changes
```

### Exemplos

```
1.0.0  → Initial release
1.0.1  → Bug fix
1.1.0  → New feature
2.0.0  → Breaking change
```

---

## 📤 Exportação

### Exportar Skill

```bash
# Exportar para arquivo
marketplace export skill-name

# Exportar para marketplace
marketplace publish skill-name
```

### Formato de Exportação

```json
{
  "skill": { /* skill data */ },
  "format": "SKILL.md",
  "version": "1.0.0",
  "exportedAt": "2026-03-06T19:00:00Z"
}
```

---

## 🎓 Exemplo Completo

```markdown
---
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
version: 1.0.0
author: Cleudocode Team
repository: https://github.com/cleudocode/cleudocodehub.skill
category: Testing
tags:
  - testing
  - tdd
  - quality
  - red-green-refactor
triggers:
  - "before writing code"
  - "implementing feature"
  - "fixing bug"
commands:
  - name: "*test"
    description: "Run tests"
    usage: "*test --coverage"
  - name: "*tdd"
    description: "Start TDD cycle"
    usage: "*tdd"
---

# Test-Driven Development (TDD)

## Overview

**TDD** is the practice of writing tests BEFORE writing implementation code.

**The Iron Law:** `NO CODE BEFORE TEST`

## When to Use

### ALWAYS Use When:
- Implementing new features
- Fixing bugs
- Refactoring existing code
- Adding functionality

### When NOT to Use:
- Exploratory prototyping
- Performance optimization
- One-off scripts

## The Cycle: RED → GREEN → REFACTOR

### Phase 1: RED
Write a failing test.

```typescript
it('should calculate total', () => {
  expect(calculateTotal([1, 2, 3])).toBe(6)
})
```

### Phase 2: GREEN
Write minimal code to pass.

```typescript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0)
}
```

### Phase 3: REFACTOR
Clean up while keeping tests green.

```typescript
function calculateTotal(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0)
}
```

## Quality Comparison

| Quality | Good | Bad |
|---------|------|-----|
| **Test First** | Write test, watch fail | Write code, then test |
| **Code Amount** | Minimal to pass | Extra features |
| **Refactoring** | After every green | "Later" |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Too simple to test" | Simple code breaks too |
| "I'll test after" | Tests passing prove nothing |
| "Manually tested" | Not reproducible |

## Related Skills

- [[systematic-debugging]] - When tests fail
- [[verification-before-completion]] - Ensure quality
- [[requesting-code-review]] - Before merging

## Verification Checklist

- [ ] Test written before code
- [ ] Test failed for right reason
- [ ] Implementation makes test pass
- [ ] Code refactored with tests green
- [ ] All tests passing

**Can't check all boxes?** Delete code. Start over.

---

**Version**: 1.0.0
**License**: MIT
```

---

## 🔗 Referências

- **Skills Marketplace**: https://skillsmp.com
- **Cleudocode Hub**: https://github.com/cleudocode
- **SKILL.md Spec**: v1.0.0

---

**Documento criado por:** Cleudocode Hub Team
**Última atualização:** 2026-03-06
