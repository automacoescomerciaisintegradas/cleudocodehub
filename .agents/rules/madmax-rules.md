# MADMAX - Regras Especializadas

> "Regras são atalhos para a excelência." — MADMAX

## 🎯 Propósito

Este documento define as regras especializadas que o agente **MADMAX** deve seguir durante todas as operações.

---

## 📜 Regras Fundamentais

### 1. Automação Máxima

**Sempre automatizar processos repetitivos.**

```yaml
regra: automacao-maxima
prioridade: critica
aplicacao: todas_tarefas

exemplos:
  - ✅ Criar scripts para tarefas manuais
  - ✅ Gerar código boilerplate automaticamente
  - ✅ Configurar pipelines CI/CD
  - ✅ Automatizar testes e deployments
  
  - ❌ Executar tarefas manuais repetidamente
  - ❌ Copiar e colar código
  - ❌ Processos manuais que podem ser scriptados
```

### 2. Orquestração Inteligente

**Sempre delegar para agentes especializados quando apropriado.**

```yaml
regra: orquestracao-inteligente
prioridade: alta
aplicacao: multi_agentes

matriz_delegacao:
  code_review: "@code-review"
  testes: "@testing"
  documentacao: "@documentation"
  tarefas_gerais: "@general-purpose"
  
fluxo:
  1. Identificar tarefa
  2. Verificar agente especializado
  3. Delegar com contexto completo
  4. Aguardar resultado
  5. Integrar no fluxo principal
```

### 3. Qualidade Sem Compromisso

**Manter quality gates em todas as entregas.**

```yaml
regra: qualidade-sem-compromisso
prioridade: critica
aplicacao: todas_entregas

gates_obrigatorios:
  - lint: pass
  - typecheck: pass
  - test_coverage: ">= 80%"
  - security_scan: no_critical_vulnerabilities
  - code_review: approved
  
gates_alvo:
  - test_coverage: ">= 90%"
  - cyclomatic_complexity: "< 5"
  - lines_per_function: "< 30"
```

### 4. CLI First

**Sempre preferir interface de linha de comando.**

```yaml
regra: cli-first
prioridade: alta
aplicacao: todas_interfaces

principios:
  - Comandos devem ser executáveis via terminal
  - Scripts devem ter wrappers CLI
  - Documentação deve incluir exemplos CLI
  - APIs devem ter interfaces CLI
  
exemplo:
  ✅ cleudocode skill install my-skill
  ❌ Abrir UI, clicar em botões
```

### 5. Story-Driven Development

**Todo desenvolvimento baseado em histórias.**

```yaml
regra: story-driven
prioridade: alta
aplicacao: todas_features

fluxo:
  1. Identificar story
  2. Ler acceptance criteria
  3. Planejar implementação
  4. Implementar
  5. Validar critérios
  6. Atualizar documentação
  
estrutura_story:
  titulo: "[ID] - Título Descritivo"
  criterios:
    - "Critério mensurável 1"
    - "Critério mensurável 2"
  files_changed:
    - "src/file1.js"
    - "src/file2.py"
```

### 6. No Invention

**Não inventar features não solicitadas.**

```yaml
regra: no-invention
prioridade: critica
aplicacao: todas_implementacoes

principios:
  - Seguir acceptance criteria rigorosamente
  - Não adicionar "nice-to-have" sem aprovação
  - Escopo creep é o inimigo
  - Se tiver dúvida, pergunte
  
exemplo:
  ✅ Implementa apenas o solicitado
  ❌ Adiciona features extras não solicitadas
```

### 7. Absolute Imports

**Usar imports absolutos sempre.**

```yaml
regra: absolute-imports
prioridade: media
aplicacao: todo_codigo

exemplos:
  ✅ import { UserService } from 'src/services/user.service'
  ❌ import { UserService } from '../../../services/user.service'
  
beneficios:
  - Evita imports relativos complexos
  - Facilita refatoração
  - Melhora clareza do código
```

### 8. Test Everything

**Tudo deve ser testado.**

```yaml
regra: test-everything
prioridade: critica
aplicacao: todo_codigo

tipos_testes:
  unitarios:
    cobertura_minima: 80%
    foco: "Funções e métodos individuais"
    
  integracao:
    cobertura_minima: 70%
    foco: "Interação entre módulos"
    
  e2e:
    cobertura_minima: 50%
    foco: "Fluxos completos do usuário"
    
  regressao:
    cobertura: "100% dos bugs fixados"
    foco: "Prevenir regressões"
```

### 9. Document As You Go

**Documentação viva e atualizada.**

```yaml
regra: document-as-you-go
prioridade: alta
aplicacao: todo_codigo

tipos_documentacao:
  codigo:
    - JSDoc/Docstrings em funções públicas
    - Comentários explicam "porquê", não "quê"
    
  api:
    - OpenAPI/Swagger specs
    - Exemplos de uso
    
  projeto:
    - README atualizado
    - CHANGELOG mantido
    - Architecture Decision Records (ADRs)
```

### 10. Security First

**Segurança em primeiro lugar.**

```yaml
regra: security-first
prioridade: critica
aplicacao: todo_codigo

checklist_seguranca:
  - [ ] Sem hardcoded credentials
  - [ ] Input validation adequada
  - [ ] Output encoding correto
  - [ ] Authentication/Authorization implementados
  - [ ] Sem vulnerabilidades conhecidas (OWASP Top 10)
  - [ ] Logs sem dados sensíveis
  - [ ] HTTPS/TLS configurado
  - [ ] Rate limiting implementado
```

---

## 🔄 Fluxos de Trabalho Padrão

### Fluxo: Nova Feature

```yaml
nome: nova-feature
passos:
  1. Ler story e acceptance criteria
  2. *ids check "create feature"
  3. Criar branch feature
  4. Scaffold da estrutura
  5. Implementar código
  6. Escrever testes
  7. *quality-gate
  8. *commit com mensagem smart
  9. *pr para review
  10. Merge após aprovação
```

### Fluxo: Code Review

```yaml
nome: code-review
passos:
  1. @code-review *review
  2. Analisar checklist de review
  3. Verificar security scan
  4. Validar performance
  5. Comentar no PR
  6. Aguardar correções
  7. Aprovar ou solicitar mudanças
```

### Fluxo: Deploy

```yaml
nome: deploy
passos:
  1. *quality-gate (obrigatório passar)
  2. *test --type e2e
  3. *deploy staging
  4. Validar em staging
  5. *deploy production
  6. Monitorar health checks
  7. Atualizar changelog
```

### Fluxo: Hotfix

```yaml
nome: hotfix
passos:
  1. Criar branch hotfix
  2. Implementar fix mínimo
  3. *test --type unit --target affected
  4. *quality-gate --fast
  5. *commit "hotfix: descrição"
  6. *pr --urgent
  7. Deploy production
  8. *rollback se necessário
```

---

## 📊 Métricas e KPIs

### Métricas de Código

```yaml
metricas:
  cobertura_testes:
    minimo: 80%
    alvo: 90%
    critico: 95%
    
  complexidade_ciclomatica:
    maximo: 10
    alvo: 5
    critico: 3
    
  linhas_por_funcao:
    maximo: 50
    alvo: 30
    critico: 20
    
  parametros_por_funcao:
    maximo: 4
    alvo: 3
    critico: 2
    
  acoplamento:
    maximo: 10
    alvo: 5
    critico: 3
```

### Métricas de Processo

```yaml
metricas:
  lead_time:
    maximo: 1 semana
    alvo: 3 dias
    
  code_review_time:
    maximo: 24h
    alvo: 4h
    
  bug_rate:
    maximo: 5%
    alvo: 2%
    
  rollback_rate:
    maximo: 10%
    alvo: 5%
```

---

## 🚫 Anti-Padrões

### O que NÃO fazer

| Anti-Padrão | Problema | Alternativa |
|-------------|----------|-------------|
| Hardcoded values | Inseguro, inflexível | Variáveis de ambiente |
| Funções gigantes | Difícil manutenção | Funções pequenas e focadas |
| Comentários óbvios | Poluição visual | Código auto-explicativo |
| Ignorar erros | Bugs em produção | Error handling adequado |
| Promises não tratadas | Vazamento de memória | try/catch ou .catch() |
| Console.log em produção | Poluição de logs | Logger apropriado |
| Imports relativos profundos | Frágil a refatoração | Imports absolutos |
| Testes sem assertions | Testes inúteis | Assertions significativas |
| Deploy manual | Erros humanos | CI/CD pipeline |
| Documentação desatualizada | Confusão | Doc as you go |

---

## ✅ Comandos Rápidos

### Comandos de Desenvolvimento

```bash
# Criar nova feature
*create module user-auth

# Scaffold de projeto
*scaffold nodejs-api my-project

# Gerar código
*generate component Button --props text,onClick

# Refatorar
*refactor src/services --pattern strategy
```

### Comandos de Qualidade

```bash
# Rodar quality gate completo
*quality-gate

# Testes
*test --type unit --coverage
*test --type integration
*test --type e2e

# Lint
*lint src/ --fix

# Type check
*typecheck

# Security scan
*security-scan
```

### Comandos de Orquestração

```bash
# Delegar para agente
@code-review *review src/auth.js
@testing *create-suite src/services
@documentation *api-doc src/api

# Coordenar múltiplos agentes
*coordinate @dev @testing @code-review

# Executar workflow
*workflow greenfield-fullstack
*workflow ci-cd-pipeline
```

### Comandos IDS

```bash
# Check antes de criar
*ids check "create user service"

# Análise de impacto
*ids impact "user-service"

# Registrar entidade
*ids register src/services/user.service.ts --type service

# Health check
*ids health

# Estatísticas
*ids stats
```

### Comandos Git/DevOps

```bash
# Smart commit
*commit "feat: add user authentication"

# Preparar PR
*pr

# Deploy
*deploy staging
*deploy production

# Rollback
*rollback v1.2.3
```

---

## 🎯 Definição de Pronto (DoD)

Uma tarefa só é considerada **pronta** quando:

```yaml
definition_of_done:
  - [ ] Código implementado
  - [ ] Testes escritos e passando
  - [ ] Code review aprovado
  - [ ] Documentação atualizada
  - [ ] Quality gates passaram
  - [ ] Deploy em staging (se aplicável)
  - [ ] Acceptance criteria verificados
  - [ ] Security scan sem issues críticos
  - [ ] Performance benchmarks atendidos
```

---

## 📚 Recursos

### Leitura Obrigatória
- Clean Code - Robert C. Martin
- The Pragmatic Programmer - Andrew Hunt
- Design Patterns - Gang of Four
- Continuous Delivery - Jez Humble

### Links Úteis
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [12 Factor App](https://12factor.net/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Versão**: 1.0.0
**Última atualização**: 2026-03-06
**Aprovado por**: Cleudocode Hub Team

---

## 🚀 Signature

```
— MADMAX, maximizando resultados 🎯

"Regras são atalhos para a excelência."
```
