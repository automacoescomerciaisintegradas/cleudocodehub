# ✅ Checklist de Publicação - Cleudocode Core v1.0.0

## 📋 Pré-Publicação

### Verificações de Código
- [x] Node.js >= 18.0.0 instalado (v25.6.1 ✓)
- [x] NPM >= 9.0.0 instalado (v11.11.0 ✓)
- [x] package.json configurado corretamente
- [x] .npmignore configurado
- [x] README.md completo
- [x] LICENSE incluído (MIT)
- [x] CLI funcionando (--version, --help, doctor)

### Validações
- [x] `npm pack --dry-run` - Pacote válido
- [x] `npm link` - Link local funcionando
- [x] `cleudocode-core --version` - 1.0.0
- [x] `cleudocode-core --help` - Help completo
- [x] `cleudocode-core doctor` - Saúde OK

### Verificação de Nome
- [x] Nome `cleudocode-core` disponível no NPM

## 📦 Publicação

### Passo 1: Login no NPM
```bash
npm login
```
- [ ] Username: _______
- [ ] Password: _______
- [ ] Email: _______

### Passo 2: Publicar
```bash
# Publicar versão stable
npm publish

# OU publicar como beta (teste)
npm publish --tag beta
```
- [ ] Pacote publicado

### Passo 3: Verificar
```bash
npm view cleudocode-core
npm view cleudocode-core versions
```
- [ ] Pacote visível no NPM
- [ ] Versão correta (1.0.0)

### Passo 4: Testar Instalação
```bash
# Instalar globalmente
npm install -g cleudocode-core

# Testar
cleudocode-core --version
cleudocode-core --help

# OU usar com npx
npx cleudocode-core@latest init
```
- [ ] Instalação funciona
- [ ] CLI funciona após instalação

## 🏷️ Pós-Publicação

### Git
```bash
# Criar tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push da tag
git push origin --tags

# Push do código
git push origin main
```
- [ ] Tag criada
- [ ] Tags pushadas
- [ ] Código pushado

### Documentação
- [ ] README.md atualizado com link do NPM
- [ ] CHANGELOG.md criado/atualizado
- [ ] GitHub Release criado

### Divulgação
- [ ] Anúncio no Discord/Comunidade
- [ ] Tweet/Post nas redes
- [ ] Email para lista de interessados

## 📊 URLs Importantes

- **NPM Package**: https://www.npmjs.com/package/cleudocode-core
- **GitHub Repo**: https://github.com/cleudocode/cleudocode-core
- **Issues**: https://github.com/cleudocode/cleudocode-core/issues

## 🔧 Comandos Úteis

```bash
# Ver estatísticas
npm show cleudocode-core downloads
npm show cleudocode-core dependencies

# Adicionar colaborador
npm owner add usuario cleudocode-core

# Publicar atualização (patch)
npm version patch
npm publish

# Publicar beta
npm version prerelease --preid=beta
npm publish --tag beta
```

---

**Data da Publicação**: ____/____/________  
**Responsável**: ______________________  
**Versão**: 1.0.0
