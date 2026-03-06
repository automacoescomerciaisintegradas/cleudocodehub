# 📦 Guia de Publicação - Cleudocode Core no NPM

## 📋 Pré-requisitos

1. **Conta no NPM**
   - Crie em: https://www.npmjs.com/signup
   - Verifique seu email

2. **Node.js instalado**
   ```bash
   node --version  # Deve ser >= 18.0.0
   npm --version   # Deve ser >= 9.0.0
   ```

3. **Git configurado**
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```

## 🚀 Publicação Passo a Passo

### 1. Login no NPM

```bash
npm login
```

Digite seu:
- Username
- Password
- Email

### 2. Verificar package.json

Certifique-se de que o `package.json` está correto:

```json
{
  "name": "cleudocode-core",
  "version": "1.0.0",
  "description": "Cleudocode Core - AI Orchestration Framework",
  "author": "Cleudocode Team",
  "license": "MIT",
  "bin": {
    "cleudocode": "./bin/cleudocode.js",
    "cleudocode-core": "./bin/cleudocode.js"
  },
  "files": [
    "bin/",
    "src/",
    "templates/"
  ]
}
```

### 3. Testar Localmente

```bash
# Link local para testes
npm link

# Testar comandos
cleudocode-core --version
cleudocode-core --help
cleudocode-core doctor
```

### 4. Validar Pacote

```bash
# Verificar se há erros
npm publish --dry-run

# Verificar conteúdo do pacote
npm pack
tar -xzf cleudocode-core-1.0.0.tgz
ls package/
```

### 5. Publicar

```bash
# Publicar versão
npm publish

# Publicar com tag específica
npm publish --tag beta
npm publish --tag latest
```

### 6. Verificar Publicação

```bash
# Ver no NPM
npm view cleudocode-core

# Ver versões
npm view cleudocode-core versions

# Instalar e testar
npm install -g cleudocode-core
cleudocode-core --version
```

## 📝 Versionamento Semântico

Siga o [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─ Bug fixes (compatível)
  │     └─ Novas features (compatível)
  └─ Breaking changes
```

### Comandos de Versionamento

```bash
# Patch (1.0.0 -> 1.0.1)
npm version patch

# Minor (1.0.0 -> 1.1.0)
npm version minor

# Major (1.0.0 -> 2.0.0)
npm version major

# Versão específica
npm version 1.2.3
```

### Exemplo de Workflow

```bash
# 1. Fazer mudanças no código
git add .
git commit -m "feat: adiciona novo comando"

# 2. Atualizar versão
npm version minor

# 3. Publicar
npm publish

# 4. Tag e push
git push origin main
git push origin --tags
```

## 🏷️ Tags

### Tipos de Tag

```bash
# Tag padrão (stable)
npm publish                    # → latest

# Beta
npm publish --tag beta         # → beta

# Canary/Next
npm publish --tag next         # → next

# Legacy
npm publish --tag legacy       # → legacy
```

### Usando Tags

```bash
# Instalar versão específica
npm install cleudocode-core@1.0.0

# Instalar tag
npm install cleudocode-core@beta
npm install cleudocode-core@latest

# Usar com npx
npx cleudocode-core@beta init
npx cleudocode-core@1.0.0 init
```

## 🔧 Troubleshooting

### Erro: E403 Forbidden

```bash
# Verificar se está logado
npm whoami

# Se necessário, login novamente
npm login

# Verificar permissões
npm owner ls cleudocode-core
```

### Erro: E404 Not Found

```bash
# Verificar nome do pacote
npm view cleudocode-core

# Se não existe, o nome está disponível
# Se existe, escolha outro nome
```

### Erro: EACCES Permission Denied

```bash
# Não use sudo!
# Corrija permissões do npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Erro: Already Exists

```bash
# Versão já publicada
# Incremente a versão
npm version patch
npm publish
```

## 📊 Estatísticas e Métricas

```bash
# Ver downloads
npm show cleudocode-core downloads

# Ver dependências
npm show cleudocode-core dependencies

# Ver maintainers
npm owner ls cleudocode-core
```

## 🤝 Adicionar Colaboradores

```bash
# Adicionar owner
npm owner add usuario cleudocode-core

# Remover owner
npm owner remove usuario cleudocode-core

# Listar owners
npm owner ls cleudocode-core
```

## 📦 Scoped Packages (Opcional)

Se o nome `cleudocode-core` já existe:

```json
{
  "name": "@cleudocode/core",
  "version": "1.0.0"
}
```

```bash
# Publicar scoped package (pode ser privado)
npm publish --access public

# Instalar
npm install @cleudocode/core
```

## ✅ Checklist de Publicação

- [ ] `package.json` atualizado
- [ ] `README.md` completo
- [ ] `LICENSE` incluído
- [ ] `.npmignore` configurado (ou `files` no package.json)
- [ ] Tests passando
- [ ] Lint sem erros
- [ ] Login no NPM feito
- [ ] Versão incrementada
- [ ] Pacote publicado
- [ ] Tag git criada
- [ ] Git push feito

## 🔗 Links Úteis

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [NPM Publish](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [NPM Login](https://docs.npmjs.com/cli/v10/commands/npm-login)

---

**Última atualização**: 2026-03-06
