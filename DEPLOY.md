# 🚀 Guia de Deploy - Adega Online

## 📋 Pré-requisitos

- Conta no GitHub
- Conta na Vercel
- Git instalado localmente

## 🔧 Configuração do GitHub

### 1. Criar Repositório
\`\`\`bash
# No GitHub, criar novo repositório: adega-online
# Não inicializar com README (já temos um)
\`\`\`

### 2. Configurar Git Local
\`\`\`bash
# Inicializar repositório local
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "🎉 Initial commit - Adega e Tabacaria Andrade"

# Conectar com GitHub
git remote add origin https://github.com/SEU_USUARIO/adega-online.git

# Push inicial
git push -u origin main
\`\`\`

## 🌐 Deploy na Vercel

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione o repositório `adega-online`

### 2. Configurações de Deploy
\`\`\`bash
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
\`\`\`

### 3. Variáveis de Ambiente
\`\`\`bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
\`\`\`

### 4. Deploy Automático
- ✅ Cada push para `main` = deploy automático
- ✅ Preview para branches de feature
- ✅ SSL automático
- ✅ CDN global

## 🔄 Atualizações em Tempo Real

### Workflow de Desenvolvimento
\`\`\`bash
# 1. Fazer alterações localmente
# 2. Testar com npm run dev
# 3. Commit e push
git add .
git commit -m "✨ Nova funcionalidade"
git push

# 4. Deploy automático na Vercel!
\`\`\`

### Branches Recomendadas
\`\`\`bash
main        # Produção
develop     # Desenvolvimento
feature/*   # Novas funcionalidades
hotfix/*    # Correções urgentes
\`\`\`

## 📊 Monitoramento

### Vercel Analytics
- Métricas de performance
- Logs de build
- Monitoramento de erros
- Estatísticas de uso

### GitHub Actions (Opcional)
\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
\`\`\`

## 🔐 Segurança

### Headers de Segurança
\`\`\`javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
\`\`\`

## 🎯 Próximos Passos

### Banco de Dados Real
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- MongoDB Atlas

### Autenticação
- NextAuth.js
- Clerk
- Auth0

### Pagamentos
- Stripe
- Mercado Pago
- PayPal

### Notificações
- WhatsApp Business API
- Email (Resend/SendGrid)
- Push Notifications

## 📱 PWA (Progressive Web App)

### Configuração
\`\`\`javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA(nextConfig)
\`\`\`

## 🚀 Performance

### Otimizações Implementadas
- ✅ Image Optimization (Next.js)
- ✅ Code Splitting automático
- ✅ Static Generation
- ✅ CDN da Vercel
- ✅ Compressão Gzip/Brotli

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

---

**🎉 Seu projeto estará online em minutos!**
