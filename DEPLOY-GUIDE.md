# 🚀 Guia Completo de Deploy

## 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta na Vercel
- ✅ Git instalado
- ✅ Node.js 18+

## 🔧 Passo a Passo

### 1️⃣ **Preparar Repositório GitHub**

\`\`\`bash
# 1. Criar repositório no GitHub
# Nome: adega-online
# Público ou Privado (sua escolha)
# NÃO inicializar com README

# 2. Clonar localmente (se necessário)
git clone https://github.com/SEU_USUARIO/adega-online.git
cd adega-online

# 3. Adicionar arquivos do projeto
# (copiar todos os arquivos do v0)

# 4. Inicializar Git
git init
git add .
git commit -m "🎉 Initial commit - Adega e Tabacaria Andrade"

# 5. Conectar com GitHub
git remote add origin https://github.com/SEU_USUARIO/adega-online.git
git branch -M main
git push -u origin main
\`\`\`

### 2️⃣ **Deploy na Vercel**

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Login**: Com sua conta GitHub
3. **New Project**: Clique no botão
4. **Import**: Selecione \`adega-online\`
5. **Configure**:
   - Framework: Next.js (detectado automaticamente)
   - Build Command: \`npm run build\`
   - Output Directory: \`.next\`
   - Install Command: \`npm install\`
6. **Deploy**: Clique em "Deploy"

### 3️⃣ **Configurações Avançadas**

#### Variáveis de Ambiente (Opcional)
\`\`\`bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
\`\`\`

#### Domínio Customizado
1. Vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 4️⃣ **Verificar Deploy**

✅ **URLs para testar**:
- Loja: \`https://seu-app.vercel.app\`
- Admin: \`https://seu-app.vercel.app/admin\`
- API: \`https://seu-app.vercel.app/api/products\`

## 🔄 Workflow de Desenvolvimento

### Atualizações Automáticas
\`\`\`bash
# 1. Fazer alterações no código
# 2. Testar localmente
npm run dev

# 3. Commit e push
git add .
git commit -m "✨ Nova funcionalidade"
git push

# 4. Deploy automático na Vercel! 🚀
\`\`\`

### Branches Recomendadas
\`\`\`bash
main        # Produção (deploy automático)
develop     # Desenvolvimento
feature/*   # Novas funcionalidades
hotfix/*    # Correções urgentes
\`\`\`

## 📊 Monitoramento

### Vercel Dashboard
- **Analytics**: Métricas de performance
- **Functions**: Logs das APIs
- **Deployments**: Histórico de deploys
- **Settings**: Configurações do projeto

### GitHub Integration
- **Actions**: CI/CD automático
- **Issues**: Controle de bugs
- **Pull Requests**: Code review
- **Releases**: Versionamento

## 🔐 Segurança

### Headers Configurados
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### HTTPS Automático
- SSL/TLS gratuito
- Certificados renovados automaticamente
- Redirecionamento HTTP → HTTPS

## 🚀 Performance

### Otimizações Ativas
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Static Generation
- ✅ CDN Global
- ✅ Gzip/Brotli Compression

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🎯 Próximos Passos

### Integrações Recomendadas
1. **Banco de Dados**: Supabase ou PlanetScale
2. **Autenticação**: NextAuth.js
3. **Pagamentos**: Stripe ou Mercado Pago
4. **Analytics**: Vercel Analytics
5. **Monitoramento**: Sentry

### Funcionalidades Futuras
- WebSockets para tempo real
- Push notifications
- PWA completo
- Sistema de reviews
- Chat integrado

## 🆘 Troubleshooting

### Erros Comuns

**Build Error**:
\`\`\`bash
# Verificar dependências
npm install
npm run build
\`\`\`

**API Error**:
\`\`\`bash
# Verificar rotas API
curl https://seu-app.vercel.app/api/products
\`\`\`

**Deploy Failed**:
- Verificar logs no Vercel Dashboard
- Conferir package.json
- Testar build local

### Suporte
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **GitHub Issues**: Para bugs específicos

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ **Aplicação online** em produção  
✅ **Deploy automático** a cada push  
✅ **APIs funcionando** em tempo real  
✅ **Admin panel** acessível  
✅ **Performance otimizada**  
✅ **Segurança configurada**  
✅ **Monitoramento ativo**  

**🚀 Seu e-commerce estará no ar em menos de 10 minutos!**
\`\`\`
