# Arquitetura de Produto, Requisitos e Design System Editorial

**Projeto:** Plataforma Imobiliaria Anderson Kunicki (CRECI-SC 60173 F - Itaiopolis/SC)  
**Padrao Arquitetural:** Clean Modular React + Serverless Cloud Sync (Firebase Firestore & Auth)  
**Diretriz Estetica:** Design Editorial Arquitetonico (Zero Emojis, Zero Ruido Visual)

---

## 1. Diagnostico de UX e Engenharia do Sistema Anterior

A auditoria tecnica e de experiencia do usuario realizada sobre a versao anterior identificou seis gargalos criticos que comprometiam a percepcao de valor dos imoveis e a agilidade operacional do corretor:

1. **Excesso de Informacao e Poluicao Visual nos Cards e Secoes:**
   - Cards sobrecarregados com multiplos selos simultaneos (status, finalidade, destaque, codigo, preco antigo, tags e botoes concorrentes), dificultando a leitura imediata da fotografia e do valor do imovel.
   - Estetica artificial com sombras excessivas, gradientes chamativos e badges multicoloridos que remetiam a templates genericos gerados por IA.

2. **Duplicacao de Filtros e Secoes de Navegacao:**
   - O usuario encontrava barras de busca sobrepostas entre o componente Hero e a listagem de imoveis, gerando duvida sobre qual controle estava ativo.
   - Secoes redundantes de listagem e chamadas repetidas diluiam o foco do comprador no catalogo principal.

3. **Interrupcao Sonora e Visual no Atendimento (WhatsApp):**
   - O widget flutuante disparava alertas sonoros sintetizados e notificacoes intrusivas sem acao previa do visitante, prejudicando a experiencia de navegacao silenciosa e elegante.

4. **Complexidade Operacional no Painel do Corretor (Formulario de 937 Linhas):**
   - O modal de cadastro e edicao (`PropertyFormModal.jsx`) possuia 937 linhas com controles duplicados, excesso de etapas manuais e sobrecarga cognitiva para operacoes simples do dia a dia (como alterar preco, destacar imovel ou marcar como vendido).

5. **Uso de Emojis na Interface e no Codigo:**
   - Presenca de emojis em rotulos, alertas, filtros e mensagens de sistema, enfraquecendo a autoridade institucional e a sobriedade exigidas no mercado imobiliario de confianca.

6. **Entulho Legado no Repositorio:**
   - A pasta `src/backup_visual_antigo` armazenava componentes obsoletos dentro da arvore de codigo-fonte, aumentando o risco de importacoes acidentais e poluindo a base do projeto (removida definitivamente nesta arquitetura).

---

## 2. Arquitetura em Time (5 Especialidades)

O redesenho e a engenharia do sistema foram estruturados em cinco frentes especializadas com responsabilidades desacopladas:

| Especialidade | Escopo de Responsabilidade | Modulos Principais |
| :--- | :--- | :--- |
| **1. Requisitos e UX Editorial** | Diagnostico de produto, arquitetura de informacao, especificacao das 5 funcoes centrais e definicao do Design System Editorial Arquitetonico sem emojis. | `ARCHITECTURE.md`, `README.md`, Diretrizes Visuais |
| **2. Backend e Firebase Cloud** | Sincronizacao em tempo real via Firestore, autenticacao resiliente, compressao automatica de imagens client-side e protecao contra perda de dados. | `src/lib/firebase.js`, `src/hooks/useProperties.js`, `src/hooks/useAuth.js`, `src/utils/imageCompressor.js` |
| **3. Frontend e Vitrine Editorial** | Construcao da jornada publica com foco na fotografia arquitetonica, busca unificada, ficha tecnica limpa e conversao contextual. | `src/index.css`, `src/components/layout/*`, `src/components/property/*`, `src/components/sections/*` |
| **4. Dashboard do Corretor** | Simplificacao radical do painel administrativo, acoes rapidas em 1 clique na listagem e refatoracao do formulario de imoveis em abas/blocos enxutos. | `src/components/admin/AdminDashboard.jsx`, `src/components/admin/PropertyFormModal.jsx`, `src/components/admin/AdminLogin.jsx` |
| **5. QA, Build e Seguranca** | Auditoria de seguranca (hashing SHA-256, sanitizacao de URLs/inputs, rate-limiting), validacao da regra estrita de zero emojis e garantia de build limpo para producao. | `src/utils/security.js`, `src/utils/formatters.js`, `vercel.json`, Build Vite |

---

## 3. As 5 Funcoes Centrais do Sistema Imobiliario

O sistema foi consolidado em torno de cinco funcoes essenciais de negocio, eliminando recursos superfluos e garantindo maxima conversao para o corretor Anderson Kunicki.

### Funcao 1: Vitrine Editorial e Busca Unificada
- **Objetivo:** Permitir que o comprador encontre o imovel ideal em segundos, com foco visual absoluto nas fotografias e na localizacao em Itaiopolis e regiao.
- **Requisitos Funcionais:**
  - Ponto unico de filtragem combinando finalidade (Todos, Venda, Aluguel), categoria (Casa, Terreno, Rural/Sitio, Apartamento, Comercial), ordenacao e busca textual livre (codigo, bairro, rua ou palavra-chave).
  - Cards editoriais enxutos contendo apenas fotografia em proporcao classica (4:3), badge discreto de finalidade/status, titulo, bairro, tres metricas principais (area, dormitorios, vagas) e valor formatado em Reais (R$).
- **Requisitos Nao-Funcionais:**
  - Filtragem reativa em memoria com latencia zero (< 16ms por interacao).
  - Carregamento otimizado de imagens com `loading="lazy"` e transicao suave.

### Funcao 2: Ficha Tecnica Imersiva sem Ruido Visual
- **Objetivo:** Apresentar todos os detalhes construtivos, documentais e visuais do imovel com clareza de revista de arquitetura.
- **Requisitos Funcionais:**
  - Galeria limpa com imagem principal ampla, navegacao por setas/miniaturas e contador numerico discreto.
  - Quadro tecnico estruturado com area total, area construida, dormitorios, suites, banheiros, vagas, valor de condominio/IPTU e codigo de referencia (ex: `AK-101`).
  - Suporte a video demonstrativo (YouTube/Vimeo) integrado em container responsivo e descricao textual bem diagramada.
- **Requisitos Nao-Funcionais:**
  - Bloqueio de rolagem do fundo (`overflow: hidden`) quando o modal estiver aberto e fechamento imediato via tecla `Escape` ou clique no backdrop.

### Funcao 3: Conversao Direta e Contextual via WhatsApp
- **Objetivo:** Transformar o interesse do visitante em atendimento qualificado no WhatsApp oficial do corretor sem friccao e sem alertas invasivos.
- **Requisitos Funcionais:**
  - Geracao automatica de mensagem contextualizada contendo nome do imovel, codigo de referencia, finalidade e valor atualizado quando acionado a partir de um card ou da ficha tecnica.
  - Botao flutuante discreto e silencioso no canto inferior direito para atendimento geral ou agendamento de visitas.
- **Requisitos Nao-Funcionais:**
  - Proibicao absoluta de efeitos sonoros automaticos (`AudioContext`) ou popups forcados que bloqueiem a leitura no mobile.

### Funcao 4: Dashboard Simplificado do Corretor (Operacao em 1 Clique + Upload Otimizado)
- **Objetivo:** Permitir que o corretor cadastre ou atualize sua carteira de imoveis pelo celular ou computador em menos de 1 minuto.
- **Requisitos Funcionais:**
  - Painel de indicadores objetivos no topo: Total de Imoveis, Disponiveis, Destaque na Vitrine e Valor Geral de Vendas (VGV).
  - Acoes rapidas em 1 clique diretamente na linha do imovel: alternar Destaque, alternar Status (Disponivel / Vendido / Reservado), Editar e Excluir.
  - Formulario de cadastro enxuto organizado em secoes claras (Dados Essenciais, Valores e Medidas, Localizacao, Galeria de Fotos com definicao de capa em 1 clique).
  - Exportacao e importacao de backup JSON em botao unico.
- **Requisitos Nao-Funcionais:**
  - Compressao automatica client-side de fotos enviadas pelo dispositivo (redimensionamento inteligente e conversao JPEG otimizada) para respeitar os limites de documento do Firestore e garantir carregamento instantaneo.

### Funcao 5: Sincronizacao Cloud Firebase e Seguranca Blindada
- **Objetivo:** Garantir que qualquer alteracao feita pelo corretor reflita instantaneamente para todos os clientes, com resiliencia offline e controle de acesso protegido.
- **Requisitos Funcionais:**
  - Sincronizacao em tempo real com a colecao `properties` no Google Cloud Firestore via `onSnapshot`.
  - Contingencia automatica em `localStorage` caso a conexao oscile ou as variaveis de ambiente estejam em modo local.
  - Autenticacao administrativa via Firebase Auth com fallback criptografico SHA-256 + salt, controle de tentativas (rate-limiting contra forca bruta) e expiracao de sessao por inatividade (30 minutos).
- **Requisitos Nao-Funcionais:**
  - Validacao e sanitizacao de entradas e URLs externas, cabecalhos de seguranca configurados e conformidade integral com a LGPD.

---

## 4. Especificacao do Design System Editorial Arquitetonico

O Design System foi concebido para transmitir confianca patrimonial, tradicao local e sofisticacao arquitetonica.

### 4.1. Regras Inegociaveis de Interface
1. **Regra Estrita de Zero Emojis:** Nenhum componente, botao, alerta, placeholder ou comentario de interface pode utilizar emojis. Todal sinalizacao visual utiliza exclusivamente tipografia bem hierarquizada e iconografia vetorial linear (`lucide-react`) com traco fino (`strokeWidth={1.75}`).
2. **Estetica Humana e Atemporal:** Eliminacao de gradientes neon, sombras coloridas, animacoes exageradas (`bounce`/`pulse` continuos) e excesso de pilulas coloridas.
3. **Respiro Editorial:** Uso generoso de espaco em branco (off-white quente), bordas sutis de 1px e alinhamento rigoroso em grid.

### 4.2. Paleta Cromatico-Arquitetonica

| Token Semantico | Cor Hexadecimal | Aplicacao Principal |
| :--- | :--- | :--- |
| **Fundo Editorial (Warm Stone)** | `#F8F7F4` | Background principal da pagina, criando conforto ocular e aspecto de papel arquitetonico. |
| **Superficie Pura (Pure White)** | `#FFFFFF` | Cards de imoveis, modais, barra de filtros e cabecalho. |
| **Borda Arquitetonica (Sandstone)** | `#E6E4DD` | Divisores finos de 1px, contornos de cards e inputs. |
| **Carvao Principal (Charcoal Ink)** | `#18181B` | Titulos, valores monetarios e textos de leitura primaria. |
| **Ardosia Secundaria (Slate Gray)** | `#52525B` | Subtitulos, enderecos, metadados tecnicos e rotulos. |
| **Marinho Institucional (Deep Navy)** | `#0F172A` | Cabecalho institucional, botoes primarios sobrios e rodape. |
| **Carmim / Terracota Sobrio** | `#991B1B` | Destaques pontuais de marca, indicadores de selecao e chamadas principais. |
| **Verde Atendimento (WhatsApp)** | `#15803D` | Exclusivo para acoes diretas de conversao via WhatsApp. |

### 4.3. Tipografia e Hierarquia
- **Titulos e Cabecalhos (`Outfit` / Sans Geometrica Nobre):** Peso 600 a 700, `letter-spacing: -0.02em`, transmitindo precisao construtiva.
- **Corpo de Texto e Dados Tecnicos (`Inter` / Sans Neutra):** Peso 400 a 500, excelente legibilidade em tabelas, precos (`font-variant-numeric: tabular-nums`) e descricoes longas.
- **Codigos e Referencias:** Caixa alta discreta, `letter-spacing: 0.06em`, tamanho `0.75rem`, cor ardosia.
