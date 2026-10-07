# Anderson Kunicki - Corretor Imobiliario (CRECI-SC 60173 F)

Plataforma web imobiliaria desenvolvida em **React 18** e **Vite 5**, projetada especificamente para o escritorio **Anderson Kunicki - Corretor de Imoveis** em Itaiopolis/SC. O sistema combina uma vitrine com **Design Editorial Arquitetonico** e um painel de gestao em tempo real integrado ao **Google Firebase (Firestore & Auth)**.

Para detalhes completos sobre as decisoes de produto, requisitos e diretrizes visuais, consulte o documento [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Diretrizes do Design System Editorial

- **Sobriedade Arquitetonica:** Paleta baseada em tons de pedra quente (`#F8F7F4`), branco puro (`#FFFFFF`), carvao escuro (`#18181B`), azul marinho profundo (`#0F172A`) e carmim sobrio (`#991B1B`).
- **Politica de Zero Emojis:** Toda a comunicacao visual utiliza exclusivamente tipografia estruturada (*Outfit* e *Inter*) e iconografia vetorial linear (*Lucide*), garantindo seriedade institucional.
- **Foco na Fotografia e Conversao:** Interface limpa, livre de poluicao visual, popups intrusivos ou efeitos sonoros automaticos.

---

## As 5 Funcoes Centrais do Sistema

1. **Vitrine Editorial e Busca Unificada:**
   - Barra unica de pesquisa e filtragem instantanea por finalidade (Venda/Aluguel), categoria (Casa, Terreno, Sitio/Rural, Apartamento, Comercial), ordenacao e busca textual por codigo, rua ou bairro.
   - Cards com hierarquia clara destacando fotografia, localizacao, metragem, dormitorios e valor em Reais (R$).

2. **Ficha Tecnica Imersiva sem Ruido Visual:**
   - Modal detalhado com galeria fotografica interativa, quadro completo de especificacoes construtivas (area total, area construida, suites, banheiros, vagas, IPTU/condominio) e suporte a video demonstrativo (YouTube/Vimeo).

3. **Conversao Direta e Contextual via WhatsApp:**
   - Acionamento direto do WhatsApp do corretor preenchendo automaticamente os dados do imovel de interesse (titulo, codigo de referencia e valor).
   - Botao flutuante silencioso e discreto para atendimento rapido.

4. **Dashboard Simplificado do Corretor:**
   - Indicadores objetivos de carteira (Total, Disponiveis, Destaques e VGV).
   - Operacao em 1 clique diretamente na listagem para destacar imovel ou alterar status (Disponivel, Vendido, Reservado).
   - Formulario enxuto com upload e compressao automatica de fotos no navegador, reordenacao de galeria e exportacao/importacao de backups JSON.

5. **Sincronizacao Cloud Firebase e Seguranca Blindada:**
   - Persistencia em tempo real via **Firebase Firestore** com fallback resiliente em cache local (`localStorage`).
   - Autenticacao via **Firebase Auth** ou criptografia **SHA-256** com salt, rate-limiting contra tentativas de forca bruta e encerramento automatico de sessao por inatividade (30 minutos).
   - Pagina dedicada de conformidade com a **LGPD** (Politica de Privacidade).

---

## Estrutura de Diretorios

```text
siteTio/
├── public/
│   ├── .htaccess                     # Regras de roteamento e seguranca Apache (Hostinger)
│   ├── favicon.svg                   # Identidade vetorial oficial
│   ├── manifest.json                 # Manifesto Web App
│   ├── robots.txt                    # Diretrizes de indexacao
│   ├── sitemap.xml                   # Mapa XML para motores de busca
│   └── anderson-kunicki.jpg          # Retrato institucional do corretor
├── src/
│   ├── components/
│   │   ├── admin/                    # Painel Administrativo do Corretor
│   │   │   ├── AdminDashboard.jsx    # Listagem gerencial e acoes em 1 clique
│   │   │   ├── AdminLogin.jsx        # Autenticacao segura com rate-limit
│   │   │   ├── ChangePasswordModal.jsx # Alteracao de credenciais de acesso
│   │   │   └── PropertyFormModal.jsx # Cadastro e edicao simplificada de imoveis
│   │   ├── common/                   # Componentes Base
│   │   │   ├── Toast.jsx             # Notificacoes discretas de sistema
│   │   │   └── WhatsAppIcon.jsx      # Icone vetorial oficial do WhatsApp
│   │   ├── layout/                   # Estrutura da Pagina
│   │   │   ├── Header.jsx            # Cabecalho institucional responsivo
│   │   │   ├── Footer.jsx            # Rodape com dados do CRECI-SC e links uteis
│   │   │   └── WhatsAppWidget.jsx    # Atendimento flutuante silencioso
│   │   ├── property/                 # Dominio da Vitrine Imobiliaria
│   │   │   ├── PropertyCard.jsx      # Card editorial de imovel
│   │   │   ├── PropertyFilters.jsx   # Barra unificada de busca e filtros
│   │   │   └── PropertyModal.jsx     # Ficha tecnica completa e galeria
│   │   └── sections/                 # Secoes Institucionais
│   │       ├── AboutContact.jsx      # Apresentacao do corretor, endereco e mapa
│   │       ├── Hero.jsx              # Abertura editorial e chamada principal
│   │       └── PrivacyPage.jsx       # Politica de Privacidade e LGPD
│   ├── config/
│   │   └── site.config.js            # Parametros institucionais, telefone e endereco
│   ├── data/
│   │   └── properties.js             # Catalogo semente inicial
│   ├── hooks/                        # Hooks de Estado e Sincronizacao
│   │   ├── useAuth.js                # Controle de sessao e seguranca
│   │   ├── useProperties.js          # CRUD em tempo real no Firestore e filtros
│   │   └── useToast.js               # Gerenciamento de feedbacks visuais
│   ├── lib/
│   │   └── firebase.js               # Inicializacao do Firebase Firestore e Auth
│   ├── utils/                        # Utilitarios de Dominio
│   │   ├── formatters.js             # Formatacao monetaria (BRL) e numerica
│   │   ├── imageCompressor.js        # Otimizacao client-side de fotografias
│   │   ├── security.js               # Hashing SHA-256, sanitizacao e validadores
│   │   └── video.js                  # Tratamento seguro de embeds de video
│   ├── App.jsx                       # Orquestracao principal de rotas e modais
│   ├── index.css                     # Tokens e estilos do Design System Editorial
│   └── main.jsx                      # Inicializacao da arvore React
├── .env.example                      # Modelo de variaveis de ambiente do Firebase
├── ARCHITECTURE.md                   # Documentacao de Arquitetura, UX e Requisitos
├── HOSTINGER_DEPLOY.md               # Guia de publicacao em servidor Apache/Hostinger
├── vercel.json                       # Regras de rewrite SPA para deploy na Vercel
├── package.json                      # Dependencias e scripts NPM
└── vite.config.js                    # Configuracao de bundler Vite
```

---

## Como Executar Localmente

### 1. Instalar as dependencias
```bash
npm install
```

### 2. Configurar variaveis de ambiente (Firebase)
Copie o arquivo `.env.example` para `.env.local` e preencha com as credenciais do projeto no Firebase Console:
```bash
cp .env.example .env.local
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Gerar build otimizado de producao
```bash
npm run build
```

### 5. Pre-visualizar o build de producao localmente
```bash
npm run preview
```

---

## Deploy em Producao (Vercel e Hostinger)

### Deploy na Vercel (Recomendado)
O projeto ja inclui o arquivo `vercel.json` configurado para Single Page Application (SPA):
1. Conecte o repositorio na **Vercel** ou execute `npx vercel --prod` na raiz do projeto.
2. Em **Project Settings > Environment Variables**, adicione as variaveis `VITE_FIREBASE_*` definidas em `.env.example`.
3. A Vercel executara automaticamente `npm run build` e publicara o diretorio `dist`.

### Deploy na Hostinger
Para hospedagem compartilhada via Apache, utilize o conteudo gerado na pasta `dist/` apos rodar `npm run build`. O arquivo `public/.htaccess` e copiado automaticamente para garantir roteamento e cache adequados. Consulte [HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md) para o passo a passo completo.
