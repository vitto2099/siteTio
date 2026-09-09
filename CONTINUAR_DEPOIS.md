# 📌 Continuar Depois — Anderson Kunicki Imóveis

**Sessão:** 08/09/2026  
**Projeto:** Site imobiliário para Anderson Kunicki (CRECI-SC 60173 F) — Itaiópolis/SC

---

## 🗂️ Onde fica o projeto

**Pasta local:**
```
C:\Users\vck98\OneDrive\Área de Trabalho\SiteTio
```

**Stack:**
- React 18 + Vite 5
- Firebase Firestore + Firebase Auth
- Hospedagem: Hostinger (ainda não publicado)
- Domínio planejado: `andersonkunicki.com.br`

---

## ✅ O que JÁ está pronto (100% desenvolvido)

- Site público: hero, catálogo, filtros, cards, modal de detalhes, galeria, tour virtual
- Painel admin completo: login, CRUD, upload de fotos, batch actions, backup JSON, troca de senha
- WhatsApp widget flutuante + botão por imóvel com texto pré-pronto
- Página Sobre/Contato com Google Maps
- Página de Privacidade (LGPD)
- Deep link por imóvel: `/?imovel=AK-101`
- SEO completo: JSON-LD Schema, Open Graph, geo tags, sitemap, robots.txt
- PWA manifest + .htaccess para Hostinger
- Guia de deploy documentado (`HOSTINGER_DEPLOY.md`)

---

## ⚠️ O que FALTA antes de publicar

### 🔴 Crítico (obrigatório)

1. **Firebase não configurado** — `.env.local` está VAZIO
   - Precisa criar projeto no Firebase Console
   - Preencher as 6 variáveis em `.env.local`
   - Rodar `npm run build` com as credenciais certas

2. **Hashes SHA-256 hardcoded no `useAuth.js`** (linhas 65–68)
   - Tem senhas padrão expostas (`admin`, `adminku`, etc.)
   - Definir senha com o cliente → gerar hash → substituir antes de entregar

3. **Build de produção (`dist/`) desatualizado**
   - Rodar `npm run build` após configurar o Firebase

### 🟡 Importante

4. Catálogo vazio (`INITIAL_PROPERTIES = []`) — cliente vai precisar cadastrar imóveis
5. `banner.jpg` inconsistente no config vs. meta og:image
6. Fotos em Base64 têm limite de 1MB/doc no Firestore — para muitas fotos, migrar para Firebase Storage futuramente

---

## 💬 Conversa sobre preço

- Análise apontou: **R$ 2.800 – R$ 3.800** para corretor autônomo
- Usuário mencionou cobrar **R$ 500** (fora deploy)
- Conclusão: **R$ 500 é muito barato** pelo que foi entregue
- Mínimo recomendado: **R$ 1.200** (e ainda seria abaixo do mercado)
- Referência: agências cobram R$ 5.000–12.000 por algo parecido

---

## 📋 Próximos passos

- [x] Configurar Firebase (criar projeto `anderson-kunicki-site`, credenciais obtidas)
- [x] Preencher `.env.local` com as credenciais reais
- [x] Rodar `npm run build` (build gerado com sucesso com Firebase integrado)
- [x] Ativar Authentication (E-mail/senha) e cadastrar o usuário do corretor (`andersonkunicki@gmail.com`)
- [x] Trocar/gerar hash de senha do admin no `useAuth.js` (atualizado para fiorino2026 e removidas senhas padrão)
- [ ] Ativar Cloud Firestore no Firebase Console e colar as regras do `firestore.rules`
- [ ] Testar no navegador localmente (`npm run dev`)
- [ ] Publicar na Hostinger (`dist/`)
- [ ] Definir valor final com o cliente


