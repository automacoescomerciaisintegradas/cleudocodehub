#!/bin/bash

# =============================================================================
# Script de Publicação - Cleudocode Core
# =============================================================================
# Uso: ./scripts/publish.sh [beta|stable]
# =============================================================================

set -e

VERSION=$(node -p "require('./package.json').version")
TAG=${1:-stable}

echo "=============================================="
echo "📦 Cleudocode Core - Publicação NPM"
echo "=============================================="
echo ""
echo "Versão: $VERSION"
echo "Tag: $TAG"
echo ""

# Verificar login no NPM
echo "🔐 Verificando login no NPM..."
if ! npm whoami &> /dev/null; then
    echo "❌ Não logado no NPM!"
    echo ""
    echo "Execute: npm login"
    echo ""
    exit 1
fi
echo "✅ Login OK"
echo ""

# Validar pacote
echo "📋 Validando pacote..."
if ! npm pack --dry-run &> /dev/null; then
    echo "❌ Pacote inválido!"
    exit 1
fi
echo "✅ Pacote válido"
echo ""

# Confirmar publicação
echo "⚠️  Atenção:"
echo "   - O pacote será publicado no NPM"
echo "   - Versão: $VERSION"
echo "   - Tag: $TAG"
echo ""
read -p "Continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[YySs]$ ]]; then
    echo "❌ Publicação cancelada"
    exit 0
fi

# Publicar
echo ""
echo "🚀 Publicando..."
if [ "$TAG" = "beta" ]; then
    npm publish --tag beta
else
    npm publish
fi

echo ""
echo "✅ Publicação concluída!"
echo ""
echo "📊 Verificar em:"
echo "   https://www.npmjs.com/package/cleudocode-core"
echo ""
echo "🧪 Testar instalação:"
echo "   npm install -g cleudocode-core"
echo "   npx cleudocode-core@latest init"
echo ""
