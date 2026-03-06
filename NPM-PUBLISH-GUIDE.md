# 🚀 Publicação no NPM - Guia Rápido

## ✅ Status Atual

- [x] Pacote configurado (`package.json`)
- [x] `.npmignore` configurado
- [x] README.md completo
- [x] LICENSE incluído
- [x] CLI testada e funcionando
- [x] Pacote validado (`npm pack --dry-run` OK)
- [x] Nome `cleudocode-core` disponível no NPM
- [ ] **Login no NPM** ← Próximo passo
- [ ] **Publicar** ← Após login

## 🔐 Passo 1: Login no NPM

Execute o comando:

```bash
npm login
```

Você precisará de:
- **Username**: Seu usuário no NPM
- **Password**: Sua senha
- **Email**: Email verificado

### Se não tem conta no NPM

1. Acesse: https://www.npmjs.com/signup
2. Crie sua conta
3. Verifique o email
4. Volte e execute `npm login`

## 📦 Passo 2: Publicar

Após o login, execute:

```bash
# Publicar versão stable (1.0.0)
npm publish

# OU publicar como beta para testes
npm publish --tag beta
```

## ✅ Passo 3: Verificar

```bash
# Ver no NPM
npm view cleudocode-core

# Ver versões
npm view cleudocode-core versions

# Acessar no browser
# https://www.npmjs.com/package/cleudocode-core
```

## 🧪 Passo 4: Testar Instalação

```bash
# Instalar globalmente
npm install -g cleudocode-core

# Testar comandos
cleudocode-core --version
cleudocode-core --help
cleudocode-core doctor

# OU usar com npx (recomendado)
npx cleudocode-core@latest init
```

## 🏷️ Passo 5: Git (Opcional)

```bash
# Criar tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push da tag
git push origin --tags

# Push do código
git push origin main
```

## 📊 Comandos Úteis

```bash
# Ver downloads
npm show cleudocode-core downloads

# Ver dependências
npm show cleudocode-core dependencies

# Ver owners
npm owner ls cleudocode-core

# Adicionar colaborador
npm owner add usuario cleudocode-core
```

## ⚠️ Troubleshooting

### Erro: E403 Forbidden
```bash
# Verificar login
npm whoami

# Se necessário, login novamente
npm login
```

### Erro: Already Exists
```bash
# Versão já publicada, incremente
npm version patch  # 1.0.0 -> 1.0.1
npm publish
```

### Erro: EACCES
```bash
# Não use sudo!
# Corrija permissões do npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 🎯 Resumo dos Comandos

```bash
# 1. Login
npm login

# 2. Publicar
npm publish

# 3. Verificar
npm view cleudocode-core

# 4. Testar
npm install -g cleudocode-core
cleudocode-core --version
```

---

**Próxima ação**: Execute `npm login` e depois `npm publish`
