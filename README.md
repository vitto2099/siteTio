# Anderson Kunicki - Corretor Imobiliário (CRECI-SC 60173 F)

Plataforma web imobiliária moderna desenvolvida em **React 18** e **Vite 5**, projetada especificamente para o escritório **Anderson Kunicki - Corretor de Imóveis** em Itaiópolis/SC. O sistema une uma vitrine com **Design Editorial Arquitetônico**, experiência mobile fluida com gestos touch e um painel de gestão em tempo real integrado ao **Supabase (PostgreSQL & Realtime)**.

---

## Destaques e Novas Funcionalidades

### 1. Migração Completa para o Supabase (Cloud & Realtime)
- **Persistência Global em Tempo Real:** Banco de dados PostgreSQL gerenciado via Supabase com Row Level Security (RLS) habilitado.
- **Sincronização Instantânea via WebSockets:** Imóveis cadastrados, editados ou excluídos no desktop sincronizam no mesmo segundo no celular de clientes sem necessidade de recarregar a página.
- **Zero Restrições de Domínio:** Funciona perfeitamente em `localhost`, na Vercel e em redes móveis sem bloqueios de autorização de navegador.

### 2. Experiência Mobile Otimizada (Smartphones & Tablets)
- **Navegação por Gestos (Swipe Touch):** Deslize para a esquerda ou direita com o polegar para alternar fotos na ficha técnica e no modo tela cheia.
- **Fundo Ambiente Inteligente (Ambient Backdrop Blur):** Efeito de desfoque suave da própria foto no fundo, preenchendo a tela com elegância e eliminando faixas pretas duras em fotos verticais ou horizontais.
- **Visualizador Ampliado:** Área de fotos no celular com altura proporcional (`clamp(270px, 44vh, 400px)`), garantindo alta visibilidade dos detalhes arquitetônicos.
- **Indicador de Galeria nos Cards:** Selo discreto com ícone de câmera indicando a quantidade de fotos cadastradas no imóvel (ex: `16 fotos`).

### 3. Ficha Técnica Completa e Cadastro Robusto
- **Até 16 Fotos com Recorte Sob Medida:** Modal de corte interativo integrado para enquadrar fotos perfeitamente.
- **Rotas e Localização no Google Maps:** Campo de link do Google Maps para o cliente abrir o trajeto até o imóvel com 1 clique.
- **Especificações Construtivas Detalhadas:** Dimensões do terreno (ex: 12x47m), salas, cozinhas, depósito/edícula, despensa, suítes, banheiros e vagas.
- **Opção de Valor Sob Consulta:** Flexibilidade para ocultar o valor numérico na vitrine pública e exibir "Sob Consulta".

### 4. Segurança e Desempenho
- **Autenticação Criptográfica SHA-256:** Login seguro com proteção contra força bruta (rate-limiting de 5 tentativas) e encerramento automático de sessão por inatividade.
- **Sanitização Anti-XSS Rigorosa:** Todos os campos de texto e URLs passam por filtros de segurança antes de serem gravados.
- **Zero Emojis e Zero Poluição Visual:** Identidade visual sóbria baseada em tipografia editorial (*Outfit* e *Inter*) e ícones vetoriais lineares (*Lucide*).
- **100% de Testes Automatizados Aprovados:** Suítes completas de usabilidade, design editorial, infraestrutura e segurança.

---

## Estrutura de Diretórios

```text
siteTio/
├── public/
│   ├── .htaccess                     # Regras de roteamento e segurança Apache
│   ├── favicon.svg                   # Identidade vetorial oficial
│   ├── manifest.json                 # Manifesto Web App
│   ├── robots.txt                    # Diretrizes de indexação para motores de busca
│   ├── sitemap.xml                   # Mapa XML oficial do site
│   └── anderson-kunicki.jpg          # Retrato institucional do corretor
├── src/
│   ├── components/
│   │   ├── admin/                    # Painel Administrativo do Corretor
│   │   │   ├── AdminDashboard.jsx    # Listagem gerencial, métricas e ações rápidas
│   │   │   ├── AdminLogin.jsx        # Autenticação segura com rate-limit
│   │   │   ├── ChangePasswordModal.jsx # Alteração de senha administrativa
│   │   │   ├── ImageCropperModal.jsx # Recorte interativo sob medida de fotos
│   │   │   └── PropertyFormModal.jsx # Cadastro e edição simplificada de imóveis
│   │   ├── common/                   # Componentes Base
│   │   │   ├── Toast.jsx             # Notificações discretas de sistema
│   │   │   └── WhatsAppIcon.jsx      # Ícone vetorial oficial do WhatsApp
│   │   ├── layout/                   # Estrutura da Página
│   │   │   ├── Header.jsx            # Cabeçalho institucional responsivo
│   │   │   ├── Footer.jsx            # Rodapé com dados do CRECI-SC e links úteis
│   │   │   └── WhatsAppWidget.jsx    # Atendimento flutuante silencioso
│   │   ├── property/                 # Domínio da Vitrine Imobiliária
│   │   │   ├── FullscreenGalleryModal.jsx # Galeria em tela cheia com swipe e zoom
│   │   │   ├── PropertyCard.jsx      # Card editorial de imóvel com contador de fotos
│   │   │   ├── PropertyFilters.jsx   # Barra unificada de busca e filtros
│   │   │   └── PropertyModal.jsx     # Ficha técnica completa com swipe touch e mapa
│   │   └── sections/                 # Seções Institucionais
│   │       ├── AboutContact.jsx      # Apresentação do corretor, endereço e mapa
│   │       ├── Hero.jsx              # Abertura editorial e chamada principal
│   │       └── PrivacyPage.jsx       # Política de Privacidade e LGPD
│   ├── config/
│   │   ├── index.js                  # Ponto central de exportação de configurações
│   │   └── site.config.js            # Parâmetros institucionais, telefone e endereço
│   ├── data/
│   │   └── properties.js             # Catálogo de imóveis e utilitários de categorias
│   ├── hooks/                        # Hooks de Estado e Sincronização
│   │   ├── useAuth.js                # Controle de sessão e segurança SHA-256
│   │   ├── useProperties.js          # Sincronização em tempo real via Supabase
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
├── tests/
│   ├── security.test.mjs             # Testes de criptografia, sanitização e Supabase
│   └── usability.test.mjs            # Testes de design editorial, UX e regras de negócio
├── .env.example                      # Modelo de variáveis de ambiente do Supabase
├── vercel.json                       # Regras de rewrite SPA e headers de segurança HTTP
├── package.json                      # Dependências oficiais e scripts de automação
└── vite.config.js                    # Configuração de bundler Vite e divisão de chunks
```

---

## Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env.local` e preencha com as credenciais do seu projeto Supabase:
```bash
cp .env.example .env.local
```

### 3. Rodar os testes automatizados
```bash
npm test
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Gerar build de produção
```bash
npm run build
```

---

## Deploy em Produção (Vercel)

1. Conecte o repositório na **Vercel** ou execute `npx vercel --prod`.
2. Em **Project Settings > Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. A Vercel executará automaticamente `npm run build` e publicará o site com sincronização em tempo real global.
