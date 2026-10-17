# Anderson Kunicki - Corretor Imobiliário (CRECI-SC 60173 F)

Plataforma web imobiliária desenvolvida em **React 18** e **Vite 5**, projetada especificamente para o escritório **Anderson Kunicki - Corretor de Imóveis** em Itaiópolis/SC. O sistema combina uma vitrine com **Design Editorial Arquitetônico** e um painel de gestão em tempo real integrado ao **Supabase (PostgreSQL & Realtime)**.

Para detalhes completos sobre as decisões de produto, requisitos e diretrizes visuais, consulte o documento [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Diretrizes do Design System Editorial

- **Sobriedade Arquitetônica:** Paleta baseada em tons de pedra quente (`#F8F7F4`), branco puro (`#FFFFFF`), carvão escuro (`#18181B`), azul marinho profundo (`#0F172A`) e carmim sóbrio (`#991B1B`).
- **Política de Zero Emojis:** Toda a comunicação visual utiliza exclusivamente tipografia estruturada (*Outfit* e *Inter*) e iconografia vetorial linear (*Lucide*), garantindo seriedade institucional.
- **Foco na Fotografia e Conversão:** Interface limpa, livre de poluição visual, popups intrusivos ou efeitos sonoros automáticos.

---

## As 5 Funções Centrais do Sistema

1. **Vitrine Editorial e Busca Unificada:**
   - Barra única de pesquisa e filtragem instantânea por finalidade (Venda/Aluguel), categoria (Casa, Terreno, Sítio/Rural, Apartamento, Comercial), ordenação e busca textual por código, rua ou bairro.
   - Cards com hierarquia clara destacando fotografia, localização, metragem, dormitórios e valor em Reais (R$).

2. **Ficha Técnica Imersiva sem Ruído Visual:**
   - Modal detalhado com galeria fotográfica interativa (até 16 fotos com corte inteligente), quadro completo de especificações construtivas (área total, área construída, dimensões do terreno, suítes, banheiros, vagas, salas, cozinhas, depósito, despensa) e suporte a vídeo demonstrativo (YouTube/Vimeo) e Google Maps.

3. **Conversão Direta e Contextual via WhatsApp:**
   - Acionamento direto do WhatsApp do corretor preenchendo automaticamente os dados do imóvel de interesse (título, código de referência e valor).
   - Botão flutuante silencioso e discreto para atendimento rápido.

4. **Dashboard Simplificado do Corretor:**
   - Indicadores objetivos de carteira (Total, Disponíveis, Destaques e VGV).
   - Operação em 1 clique diretamente na listagem para destacar imóvel ou alterar status (Disponível, Vendido, Reservado).
   - Formulário enxuto com upload de fotos, recorte interativo, reordenação de galeria e exportação/importação de backups JSON.

5. **Sincronização Cloud Supabase e Segurança Blindada:**
   - Persistência em tempo real via **Supabase PostgreSQL & Realtime** com fallback resiliente em cache local (`localStorage`).
   - Autenticação criptográfica **SHA-256** com salt, rate-limiting contra tentativas de força bruta e encerramento automático de sessão por inatividade (30 minutos).
   - Página dedicada de conformidade com a **LGPD** (Política de Privacidade).

---

## Estrutura de Diretórios

```text
siteTio/
├── public/
│   ├── .htaccess                     # Regras de roteamento e segurança Apache (Hostinger)
│   ├── favicon.svg                   # Identidade vetorial oficial
│   ├── manifest.json                 # Manifesto Web App
│   ├── robots.txt                    # Diretrizes de indexação
│   ├── sitemap.xml                   # Mapa XML para motores de busca
│   └── anderson-kunicki.jpg          # Retrato institucional do corretor
├── src/
│   ├── components/
│   │   ├── admin/                    # Painel Administrativo do Corretor
│   │   │   ├── AdminDashboard.jsx    # Listagem gerencial e ações em 1 clique
│   │   │   ├── AdminLogin.jsx        # Autenticação segura com rate-limit
│   │   │   ├── ChangePasswordModal.jsx # Alteração de credenciais de acesso
│   │   │   ├── ImageCropperModal.jsx # Recorte sob medida de fotos
│   │   │   └── PropertyFormModal.jsx # Cadastro e edição simplificada de imóveis
│   │   ├── common/                   # Componentes Base
│   │   │   ├── Toast.jsx             # Notificações discretas de sistema
│   │   │   └── WhatsAppIcon.jsx      # Ícone vetorial oficial do WhatsApp
│   │   ├── layout/                   # Estrutura da Página
│   │   │   ├── Header.jsx            # Cabeçalho institucional responsivo
│   │   │   ├── Footer.jsx            # Rodapé com dados do CRECI-SC e links úteis
│   │   │   └── WhatsAppWidget.jsx    # Atendimento flutuante silencioso
│   │   ├── property/                 # Domínio da Vitrine Imobiliária
│   │   │   ├── PropertyCard.jsx      # Card editorial de imóvel
│   │   │   ├── PropertyFilters.jsx   # Barra unificada de busca e filtros
│   │   │   └── PropertyModal.jsx     # Ficha técnica completa e galeria
│   │   └── sections/                 # Seções Institucionais
│   │       ├── AboutContact.jsx      # Apresentação do corretor, endereço e mapa
│   │       ├── Hero.jsx              # Abertura editorial e chamada principal
│   │       └── PrivacyPage.jsx       # Política de Privacidade e LGPD
│   ├── config/
│   │   └── site.config.js            # Parâmetros institucionais, telefone e endereço
│   ├── data/
│   │   └── properties.js             # Catálogo semente inicial
│   ├── hooks/                        # Hooks de Estado e Sincronização
│   │   ├── useAuth.js                # Controle de sessão e segurança
│   │   ├── useProperties.js          # CRUD em tempo real no Supabase e filtros
│   │   └── useToast.js               # Gerenciamento de feedbacks visuais
│   ├── lib/
│   │   └── supabase.js               # Inicialização do cliente Supabase e Realtime
│   ├── utils/                        # Utilitários de Domínio
│   │   ├── formatters.js             # Formatação monetária (BRL) e numérica
│   │   ├── imageCompressor.js        # Otimização client-side de fotografias
│   │   ├── security.js               # Hashing SHA-256, sanitização e validadores
│   │   └── video.js                  # Tratamento seguro de embeds de vídeo
│   ├── App.jsx                       # Orquestração principal de rotas e modais
│   ├── index.css                     # Tokens e estilos do Design System Editorial
│   └── main.jsx                      # Inicialização da árvore React
├── .env.example                      # Modelo de variáveis de ambiente do Supabase
├── ARCHITECTURE.md                   # Documentação de Arquitetura, UX e Requisitos
├── HOSTINGER_DEPLOY.md               # Guia de publicação em servidor Apache/Hostinger
├── vercel.json                       # Regras de rewrite SPA e security headers
├── package.json                      # Dependências e scripts NPM
└── vite.config.js                    # Configuração de bundler Vite
```

---

## Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente (Supabase)
Copie o arquivo `.env.example` para `.env.local` e preencha com as credenciais do seu projeto Supabase:
```bash
cp .env.example .env.local
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Gerar build otimizado de produção
```bash
npm run build
```

---

## Deploy em Produção (Vercel e Hostinger)

### Deploy na Vercel (Recomendado)
1. Conecte o repositório na **Vercel** ou execute `npx vercel --prod` na raiz do projeto.
2. Em **Project Settings > Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. A Vercel executará automaticamente `npm run build` e publicará o site com sincronização em tempo real global.
