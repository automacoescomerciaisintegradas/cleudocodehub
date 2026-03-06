# 🏛️ Cleudocode Hub - Constituição

> "Qualidade não é um ato, é um hábito." — Aristóteles

## 📜 Princípios Fundamentais

Estes princípios são a **fonte de verdade** para todo desenvolvimento no Cleudocode Hub.

### 1. CLI First

**Sempre preferir interface de linha de comando.**

- Interfaces CLI são mais acessíveis e automatizáveis
- Scripts devem ser executáveis via terminal
- APIs devem ter wrappers CLI
- Documentação deve incluir exemplos CLI

```bash
# ✅ Bom
cleudocode skill install my-skill

# ❌ Ruim
# Abrir UI, clicar em botões, etc.
```

### 2. Agent Authority

**Respeitar a autoridade do agente especializado.**

- Cada agente tem expertise específica
- Delegar tarefas ao agente apropriado
- Não ignorar recomendações de especialistas
- Revisões cruzadas são bem-vindas, mas a decisão final é do agente responsável

```
@architect → Decisões de arquitetura
@dev → Implementação de código
@qa → Estratégia de testes
@devops → Infra e deployment
```

### 3. Story-Driven Development

**Desenvolvimento baseado em histórias e requisitos.**

- Toda feature começa com uma story
- Acceptance criteria definem o escopo
- Implementar apenas o necessário
- Atualizar checklist e documentação

```markdown
## Story: [ID] - Título

### Acceptance Criteria
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

### Files Changed
- `src/file1.js`
- `src/file2.py`
```

### 4. No Invention

**Não inventar features não solicitadas.**

- Seguir acceptance criteria rigorosamente
- Não adicionar "nice-to-have" sem aprovação
- Escopo creep é o inimigo
- Se tiver dúvida, pergunte

```python
# ✅ Bom - Implementa apenas o solicitado
def process_data(data: list) -> dict:
    return {"processed": True, "count": len(data)}

# ❌ Ruim - Adiciona features não solicitadas
def process_data(data: list, format: str = "json", compress: bool = True, 
                 encrypt: bool = True, send_email: bool = False) -> dict:
    # ... 200 linhas de código não solicitado
```

### 5. Quality First

**Qualidade antes de velocidade.**

- Code review é obrigatório
- Testes são obrigatórios
- Documentação é obrigatória
- Technical debt deve ser justificado e tracked

```bash
# Quality gates antes de commit
npm run lint && npm run typecheck && npm test
```

### 6. Absolute Imports

**Usar imports absolutos sempre que possível.**

- Evita imports relativos complexos (`../../../`)
- Facilita refatoração
- Melhora clareza do código

```javascript
// ✅ Bom
import { UserService } from 'src/services/user.service'

// ❌ Ruim
import { UserService } from '../../../services/user.service'
```

## 🔄 Workflow Padrão

### 1. Planejamento
```
1. Identificar story
2. Ler acceptance criteria
3. Criar branch feature
4. Planejar implementação
```

### 2. Implementação
```
1. Codificar feature
2. Escrever testes
3. Atualizar docs
4. Commit frequente
```

### 3. Validação
```
1. Rodar quality gates
2. Code review
3. Resolver comentários
4. Merge
```

### 4. Deploy
```
1. CI/CD pipeline
2. Deploy staging
3. Testes E2E
4. Deploy production
```

## 📋 Definition of Done (DoD)

Uma tarefa só é considerada **pronta** quando:

- [ ] Código implementado
- [ ] Testes escritos e passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Quality gates passaram
- [ ] Deploy em staging (se aplicável)
- [ ] Acceptance criteria verificados

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

## ✅ Padrões de Excelência

### Código Limpo

```javascript
// ✅ Função pequena, nome descritivo, single responsibility
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ Função grande, múltiplas responsabilidades
function processOrder(order) {
  // 100 linhas fazendo: validação, cálculo, DB, email, logging...
}
```

### Error Handling

```python
# ✅ Error handling adequado
def fetch_user(user_id: int) -> User:
    try:
        return db.get_user(user_id)
    except UserNotFoundError as e:
        logger.warning(f"User {user_id} not found")
        raise
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        raise ServiceUnavailableError("Database unavailable")

# ❌ Ignorar erros
def fetch_user(user_id: int) -> User:
    return db.get_user(user_id)  # E se falhar?
```

### Testes

```javascript
// ✅ Teste com assertions significativas
describe('UserService', () => {
  it('should return user by id', async () => {
    const user = await UserService.findById(1)
    
    expect(user).toBeDefined()
    expect(user.id).toBe(1)
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })
})

// ❌ Teste sem assertions úteis
describe('UserService', () => {
  it('should work', async () => {
    const user = await UserService.findById(1)
    console.log(user)  // Isso não é um teste
  })
})
```

### Documentação

```javascript
/**
 * Processa pagamento usando gateway configurado
 * 
 * @param {PaymentRequest} request - Dados do pagamento
 * @param {string} gateway - Gateway a usar (stripe|paypal|mercadopago)
 * @returns {Promise<PaymentResult>} Resultado do processamento
 * @throws {PaymentError} Se pagamento falhar
 * @throws {GatewayError} Se gateway estiver indisponível
 * 
 * @example
 * const result = await processPayment({
 *   amount: 100,
 *   currency: 'BRL',
 *   card: '4111111111111111'
 * }, 'stripe')
 */
async function processPayment(request, gateway) {
  // implementação
}
```

## 📊 Métricas de Qualidade

### Código

| Métrica | Mínimo | Alvo | Crítico |
|---------|--------|------|---------|
| Cobertura de testes | 80% | 90% | 95% |
| Complexidade ciclomática | < 10 | < 5 | < 3 |
| Linhas por função | < 50 | < 30 | < 20 |
| Parâmetros por função | < 4 | < 3 | < 2 |
| acoplamento | < 10 | < 5 | < 3 |

### Processo

| Métrica | Mínimo | Alvo |
|---------|--------|------|
| Lead time | < 1 semana | < 3 dias |
| Code review time | < 24h | < 4h |
| Bug rate | < 5% | < 2% |
| Rollback rate | < 10% | < 5% |

## 🎯 Papéis e Responsabilidades

### Tech Lead
- Definir arquitetura
- Revisar código crítico
- Mentoria técnica
- Decisões de longo prazo

### Senior Developer
- Implementar features complexas
- Revisar código
- Guiar juniors
- Melhorar processos

### Developer
- Implementar features
- Escrever testes
- Participar de reviews
- Aprender continuamente

### QA Engineer
- Definir estratégia de testes
- Automatizar testes
- Validar qualidade
- Reportar bugs

### DevOps Engineer
- Manter CI/CD
- Gerenciar infra
- Monitorar sistemas
- Otimizar performance

## 📚 Recursos

### Leitura Obrigatória
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [The Pragmatic Programmer](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
- [Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)

### Links Úteis
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [12 Factor App](https://12factor.net/)

---

**Versão**: 1.0.0  
**Última atualização**: 2026-03-06  
**Aprovado por**: Cleudocode Hub Team
