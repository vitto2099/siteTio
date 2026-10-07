# Relatorio Consolidado de Auditoria: QA, Usabilidade e Seguranca

**Projeto:** Anderson Kunicki — Consultoria Imobiliaria (`siteTio`)  
**Data da Auditoria:** 07/10/2026  
**Responsavel:** Engenharia de QA, Usabilidade e Seguranca (Funcao 5)  
**Runner Utilizado:** Node.js Native Test Runner (`node:test` + `node:assert/strict`)  
**Status Global:** APROVADO (29/29 testes automatizados aprovados — 0 falhas)

---

## 1. Resumo Executivo

Esta auditoria validou integralmente as entregas das Frentes 1, 2, 3 e 4 por meio de duas suites automatizadas independentes:

1. **Suite de Usabilidade e Design Editorial (`tests/usability.test.mjs`)**: 14 assercoes de teste cobrindo higienizacao visual (ausencia total de emojis e codigo legado), conformidade com o Design System Editorial Arquitetonico, reducao de complexidade do painel administrativo e do formulario de cadastro, experiencia nao-intrusiva no atendimento via WhatsApp e precisao dos formatadores e geradores de codigo imobiliario.
2. **Suite de Seguranca e Infraestrutura (`tests/security.test.mjs`)**: 15 assercoes de teste cobrindo criptografia SHA-256, sanitizacao anti-XSS, validacao estrita de URLs, higienizacao de payloads de imoveis, bloqueio contra forca bruta (rate-limiting), blindagem de embeds de video (YouTube/Vimeo), regras de seguranca do Cloud Firestore (`firestore.rules`), cabecalhos HTTP em `vercel.json` e varredura contra vazamento de chaves privadas no codigo-fonte.

Comando de execucao:

```powershell
& "C:\Users\MeioAmbiente\AppData\Roaming\Antigravity\bin\agy-node.cmd" --test tests/usability.test.mjs tests/security.test.mjs
```

Resultado consolidado do runner:
- **Total de Subtestes:** 29
- **Total de Suites/Grupos:** 15
- **Aprovados (Pass):** 29 (100%)
- **Falhas (Fail):** 0
- **Tempo de Execucao:** ~194 ms

---

## 2. Detalhamento da Suite 1: Testes de Usabilidade (`tests/usability.test.mjs`)

| ID | Grupo de Teste | Caso de Teste Verificado | Metrica / Criterio de Aceite | Resultado |
| :--- | :--- | :--- | :--- | :--- |
| **U-1.1** | Teste 1: Higienizacao Visual | Varredura recursiva de emojis em `src/` (`.js`, `.jsx`, `.css`) | Expressao regular Unicode `/\p{Extended_Pictographic}/gu` retornou **0 ocorrencias** nos 28 arquivos de `src/` | **PASS** |
| **U-1.2** | Teste 1: Higienizacao Visual | Remocao de arquivos legados (`src/backup_visual_antigo`) | Diretorio legado inexistente (`fs.existsSync === false`) | **PASS** |
| **U-2.1** | Teste 2: Design System Editorial | Variaveis da paleta sobria em `src/index.css` | Presenca confirmada de `--bg-main: #F7F6F2`, `--bg-subtle: #EFEEE8`, `--primary-dark: #0F172A`, `--primary-navy: #1E293B`, `--accent-red: #8B1E24`, `--border-subtle: #E5E4DF` | **PASS** |
| **U-2.2** | Teste 2: Design System Editorial | Tipografia e responsividade mobile em `src/index.css` | Fontes `'Montserrat'`, `'Lora'` e `'Hind Madurai'` configuradas; media queries para `768px` e `640px` ativas | **PASS** |
| **U-3.1** | Teste 3: Simplicidade do Admin e Formulario | Reducao de complexidade de `PropertyFormModal.jsx` | Reduzido de **937 linhas** para **528 linhas** (< 650 linhas) e organizado em 3 blocos claros (`1. Informacoes Principais`, `2. Localizacao, Medidas e Descricao`, `3. Fotos e Video`) | **PASS** |
| **U-3.2** | Teste 3: Simplicidade do Admin e Formulario | Compressao automatica de fotos via Canvas no upload | Funcao `compressImageFile` redimensiona para max `1280px` e converte via `canvas.toDataURL('image/jpeg', 0.78)` para envio rapido pelo celular | **PASS** |
| **U-3.3** | Teste 3: Simplicidade do Admin e Formulario | Codigo automatico, previa BRL e unificacao de comodidades | Geracao automatica `generateNextCode`, previa em tempo real `formatMoney(formData.price)` e eliminacao do campo duplicado `tagsInput` | **PASS** |
| **U-3.4** | Teste 3: Simplicidade do Admin e Formulario | Simplicidade e acoes diretas em `AdminDashboard.jsx` | Painel enxuto (**617 linhas** < 650 linhas), confirmacao inline de exclusao (`confirmDeleteId` / `Confirmar?`), filtros diretos e troca de status/destaque em 1 clique | **PASS** |
| **U-4.1** | Teste 4: WhatsAppWidget Nao-Intrusivo | Ausencia de som sintetizado e animacao de radar | Removidos `AudioContext`, `webkitAudioContext`, `playNotificationSound` e `radarWave` de `WhatsAppWidget.jsx` | **PASS** |
| **U-4.2** | Teste 4: WhatsAppWidget Nao-Intrusivo | Acessibilidade e perguntas rapidas no widget | Presenca de atributos `aria-label` e atalhos `quickQuestions` para contato imediato | **PASS** |
| **U-5.1** | Teste 5: Formatadores e Dados | Teste funcional de `formatMoney` (`src/utils/formatters.js`) | `420000 -> "R$ 420.000"`, `0 -> "R$ 0"`, entradas invalidas (`null`, `"valor-invalido"`) tratadas com fallback seguro `"R$ 0"` | **PASS** |
| **U-5.2** | Teste 5: Formatadores e Dados | Teste funcional de `formatArea` (`src/utils/formatters.js`) | `165 -> "165 m²"`, `"450" -> "450 m²"`, valores `<= 0` ou invalidos retornam `""` | **PASS** |
| **U-5.3** | Teste 5: Formatadores e Dados | Teste funcional de `formatPhone` (`src/utils/formatters.js`) | `"5547992139207" -> "(47) 99213-9207"`, `"47992139207" -> "(47) 99213-9207"`, `"4736521234" -> "(47) 3652-1234"` | **PASS** |
| **U-5.4** | Teste 5: Formatadores e Dados | Teste funcional de `getCategoryPrefix` e `INITIAL_PROPERTIES` | Prefixos `CA`, `AP`, `TE`, `SI`, `CO`, `AL`, `IM` validados; todos os imoveis iniciais possuem codigo compativel com sua categoria e preco positivo | **PASS** |

---

## 3. Detalhamento da Suite 2: Testes de Seguranca (`tests/security.test.mjs`)

| ID | Grupo de Teste | Caso de Teste Verificado | Metrica / Criterio de Aceite | Resultado |
| :--- | :--- | :--- | :--- | :--- |
| **S-1.1** | Teste 1: Criptografia SHA-256 | Determinismo e formato de `hashPassword` | Gera string hexadecimal de 64 caracteres (`/[a-f0-9]{64}/`) deterministica via Web Crypto API (`crypto.subtle.digest('SHA-256')`) | **PASS** |
| **S-1.2** | Teste 1: Criptografia SHA-256 | Sensibilidade a colisao e verificacao do hash oficial | Senhas com diferenca de caixa geram hashes distintos; hash oficial `ecf39b525dc6050fb392ac8a15a1c0bdbac1f766f37d24147bea88d38455a04d` validado | **PASS** |
| **S-2.1** | Teste 2: Sanitizacao Anti-XSS | Remocao de tags executaveis em `sanitizeText` | Bloqueia e remove `<script>`, `<iframe>`, `<object>`, `<embed>`, `<style>` e tags HTML em geral | **PASS** |
| **S-2.2** | Teste 2: Sanitizacao Anti-XSS | Neutralizacao de eventos inline e protocolos perigosos | Remove `onerror=`, `onload=`, `onclick=`, `javascript:`, `vbscript:`, `data:text/html` e colchetes angulares `< >` | **PASS** |
| **S-2.3** | Teste 2: Sanitizacao Anti-XSS | Truncamento por `maxLength` e tratamento de nulos | Respeita limite customizado de caracteres e converte `null`/`undefined` em `""` | **PASS** |
| **S-3.1** | Teste 3: Validacao de URLs | Permissoes seguras em `isValidSafeUrl` | Aceita `https://`, `http://`, caminhos relativos `/` e imagens `data:image/(jpeg\|jpg\|png\|webp);base64` | **PASS** |
| **S-3.2** | Teste 3: Validacao de URLs | Bloqueio de vetores XSS em `isValidSafeUrl` | Rejeita `javascript:alert(1)`, `vbscript:`, `data:text/html;base64,...`, URLs protocol-relative `//evil.com` e injecao de aspas/atributos | **PASS** |
| **S-4.1** | Teste 4: Higienizacao de Payload | `sanitizePropertyPayload` contra dados corrompidos/maliciosos | Normaliza `type`, `purpose` e `status` contra listas brancas; converte precos/areas negativos em `0`; filtra URLs maliciosas de `images` e `videoUrl`; limpa `features` | **PASS** |
| **S-4.2** | Teste 4: Higienizacao de Payload | Fallback seguro de imagem em `sanitizePropertyPayload` | Quando todas as URLs de imagem enviadas sao invalidas, aplica automaticamente `DEFAULT_FALLBACK_IMAGE` com `https://` | **PASS** |
| **S-5.1** | Teste 5: Protecao Brute-Force | `validateLoginRateLimit` no controle de tentativas de login | Permite tentativas 1 a 4, bloqueia na 5a tentativa falha por 60 segundos (`lockoutDurationMs: 60000`) e libera apos expirar o lockout | **PASS** |
| **S-6.1** | Teste 6: Blindagem de Video | Conversao segura em `getEmbedVideoUrl` (`src/utils/video.js`) | Converte apenas `youtube.com/watch?v=`, `youtu.be/` e `vimeo.com/` validos para URLs HTTPS de embed oficiais | **PASS** |
| **S-6.2** | Teste 6: Blindagem de Video | Bloqueio de dominios falsos e injecao em `getEmbedVideoUrl` | Retorna `null` para `javascript:`, `evil-youtube.com`, path traversal `../../` e tags `<script>` no parametro de video | **PASS** |
| **S-7.1** | Teste 7: Regras e Infraestrutura | Auditoria estatica de `firestore.rules` | Exige `request.auth != null` para `create`, `update` e `delete`; valida `title` (string 1..200) e `price` (`number >= 0`); bloqueia colecoes desconhecidas (`allow read, write: if false`) | **PASS** |
| **S-7.2** | Teste 7: Regras e Infraestrutura | Auditoria estatica de headers HTTP em `vercel.json` | Presenca confirmada de `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy: camera=(), microphone=(), geolocation=()` | **PASS** |
| **S-8.1** | Teste 8: Varredura de Segredos | Scan estatico contra chaves privadas hardcoded em `src/` | Zero ocorrencias de chaves `AIza...`, blocos PEM `BEGIN PRIVATE KEY` ou credenciais `firebase-adminsdk` no codigo-fonte; configuracao lida exclusivamente via `import.meta.env.VITE_*` | **PASS** |

---

## 4. Verificacao de Ausencia de Emojis nos Artefatos de Teste e Relatorio

Tanto os arquivos de codigo em `src/` quanto os arquivos de teste (`tests/usability.test.mjs`, `tests/security.test.mjs`) e este relatorio (`TEST_REPORT.md`) foram auditados contra a expressao regular Unicode `/\p{Extended_Pictographic}/gu`, garantindo conformidade absoluta com a diretriz de zero emojis em todo o repositorio.
