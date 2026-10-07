import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatMoney, formatArea, formatPhone } from '../src/utils/formatters.js';
import { getCategoryPrefix, INITIAL_PROPERTIES } from '../src/data/properties.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

function getAllSourceFiles(dirPath, extensions = ['.js', '.jsx', '.css']) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Suite 1: Testes de Usabilidade, Design Editorial e Simplicidade', () => {
  describe('Teste 1: Higienizacao Visual (Zero Emojis e Zero Arquivos Legados)', () => {
    it('deve garantir ZERO emojis (/\\p{Extended_Pictographic}/u) em todos os arquivos .js, .jsx e .css de src/', () => {
      const sourceFiles = getAllSourceFiles(SRC_DIR, ['.js', '.jsx', '.css']);
      assert.ok(sourceFiles.length >= 20, `Esperado pelo menos 20 arquivos em src/, encontrado: ${sourceFiles.length}`);

      const emojiRegex = /\p{Extended_Pictographic}/gu;
      const filesWithEmojis = [];

      for (const filePath of sourceFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(emojiRegex);
        if (matches && matches.length > 0) {
          const relativePath = path.relative(PROJECT_ROOT, filePath);
          filesWithEmojis.push({ file: relativePath, count: matches.length });
        }
      }

      assert.deepEqual(
        filesWithEmojis,
        [],
        `Encontrados emojis residuais nos arquivos: ${JSON.stringify(filesWithEmojis)}`
      );
    });

    it('deve garantir que a pasta legada src/backup_visual_antigo foi totalmente removida', () => {
      const legacyBackupDir = path.join(SRC_DIR, 'backup_visual_antigo');
      const exists = fs.existsSync(legacyBackupDir);
      assert.equal(exists, false, 'A pasta legada src/backup_visual_antigo nao deve existir no projeto');
    });
  });

  describe('Teste 2: Design System Editorial Arquitetonico (src/index.css)', () => {
    const cssPath = path.join(SRC_DIR, 'index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    it('deve conter as variaveis de cores da paleta sobria e editorial na :root', () => {
      assert.match(cssContent, /--bg-main:\s*#F7F6F2/i, 'Variavel --bg-main (#F7F6F2) ausente');
      assert.match(cssContent, /--bg-subtle:\s*#EFEEE8/i, 'Variavel --bg-subtle (#EFEEE8) ausente');
      assert.match(cssContent, /--primary-dark:\s*#0F172A/i, 'Variavel --primary-dark (#0F172A) ausente');
      assert.match(cssContent, /--primary-navy:\s*#1E293B/i, 'Variavel --primary-navy (#1E293B) ausente');
      assert.match(cssContent, /--accent-red:\s*#8B1E24/i, 'Variavel --accent-red (#8B1E24) ausente');
      assert.match(cssContent, /--border-subtle:\s*#E5E4DF/i, 'Variavel --border-subtle (#E5E4DF) ausente');
    });

    it('deve definir as familias tipograficas editoriais e regras de responsividade mobile', () => {
      assert.match(cssContent, /--font-heading:\s*'Montserrat'/i);
      assert.match(cssContent, /--font-serif:\s*'Lora'/i);
      assert.match(cssContent, /--font-body:\s*'Hind Madurai'/i);
      assert.match(cssContent, /@media\s*\(max-width:\s*768px\)/i);
      assert.match(cssContent, /@media\s*\(max-width:\s*640px\)/i);
    });
  });

  describe('Teste 3: Usabilidade e Simplicidade do Painel Admin e Formulario de Imoveis', () => {
    const dashboardPath = path.join(SRC_DIR, 'components', 'admin', 'AdminDashboard.jsx');
    const formModalPath = path.join(SRC_DIR, 'components', 'admin', 'PropertyFormModal.jsx');
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    const formModalContent = fs.readFileSync(formModalPath, 'utf8');

    it('deve manter PropertyFormModal.jsx enxuto (abaixo de 650 linhas contra 937 antigas) e dividido em 3 blocos claros', () => {
      const formLines = formModalContent.split(/\r?\n/).length;
      assert.ok(
        formLines < 650,
        `PropertyFormModal.jsx deve ter menos de 650 linhas para manter simplicidade (atual: ${formLines})`
      );
      assert.ok(formModalContent.includes('1. Informações Principais'), 'Bloco 1 ausente no formulario');
      assert.ok(formModalContent.includes('2. Localização, Medidas e Descrição'), 'Bloco 2 ausente no formulario');
      assert.ok(formModalContent.includes('3. Fotos e Vídeo'), 'Bloco 3 ausente no formulario');
    });

    it('deve incluir compressao automatica de imagem via Canvas em PropertyFormModal.jsx para facilitar upload pelo celular', () => {
      assert.ok(formModalContent.includes('compressImageFile'), 'Funcao compressImageFile ausente');
      assert.ok(formModalContent.includes("document.createElement('canvas')"), 'Criacao de canvas para compressao ausente');
      assert.ok(formModalContent.includes("canvas.toDataURL('image/jpeg'"), 'Conversao JPEG via canvas.toDataURL ausente');
    });

    it('deve oferecer geracao automatica de codigo, previa de preco em BRL e unificar comodidades com exclusao em 2 cliques', () => {
      assert.ok(formModalContent.includes('generateNextCode'), 'Geracao automatica de codigo ausente');
      assert.ok(formModalContent.includes('formatMoney(formData.price)'), 'Previa formatada de valor em R$ ausente');
      assert.ok(!formModalContent.includes('tagsInput'), 'Nao deve existir estado duplicado tagsInput separado de comodidades');
      assert.ok(formModalContent.includes('removeAmenityOption'), 'Funcao de remover comodidade da lista ausente');
      assert.ok(formModalContent.includes('handleAmenityDeleteClick'), 'Confirmacao de 2 cliques no botao X de comodidade ausente');
    });

    it('deve manter AdminDashboard.jsx enxuto (abaixo de 650 linhas) com confirmacao inline de exclusao e filtros claros', () => {
      const dashboardLines = dashboardContent.split(/\r?\n/).length;
      assert.ok(
        dashboardLines < 650,
        `AdminDashboard.jsx deve ter menos de 650 linhas (atual: ${dashboardLines})`
      );
      assert.ok(dashboardContent.includes('confirmDeleteId'), 'Estado de confirmacao inline confirmDeleteId ausente');
      assert.ok(dashboardContent.includes('Confirmar?'), 'Botao de confirmacao inline de exclusao ausente');
      assert.ok(dashboardContent.includes('Limpar Filtros'), 'Botao de limpar filtros ausente');
      assert.ok(dashboardContent.includes('onToggleStatus'), 'Alteracao rapida de status em 1 clique ausente');
      assert.ok(dashboardContent.includes('onToggleFeatured'), 'Alteracao rapida de destaque em 1 clique ausente');
    });
  });

  describe('Teste 4: Experiencia Nao-Intrusiva e Acessivel no WhatsAppWidget.jsx', () => {
    const widgetPath = path.join(SRC_DIR, 'components', 'layout', 'WhatsAppWidget.jsx');
    const widgetContent = fs.readFileSync(widgetPath, 'utf8');

    it('nao deve conter sintese de audio intrusiva (AudioContext / playNotificationSound) nem animacao radarWave', () => {
      assert.ok(!widgetContent.includes('AudioContext'), 'AudioContext intrusivo ainda presente no WhatsAppWidget');
      assert.ok(!widgetContent.includes('webkitAudioContext'), 'webkitAudioContext ainda presente no WhatsAppWidget');
      assert.ok(!widgetContent.includes('playNotificationSound'), 'playNotificationSound ainda presente no WhatsAppWidget');
      assert.ok(!widgetContent.includes('radarWave'), 'Animacao radarWave intrusiva ainda presente no WhatsAppWidget');
    });

    it('deve possuir rotulos de acessibilidade (aria-label) e opcoes rapidas de atendimento', () => {
      assert.ok(widgetContent.includes('aria-label='), 'Atributos aria-label ausentes no WhatsAppWidget');
      assert.ok(widgetContent.includes('quickQuestions'), 'Lista de mensagens rapidas ausente no WhatsAppWidget');
    });
  });

  describe('Teste 5: Testes Funcionais de Formatadores e Dados Imobiliarios', () => {
    it('formatMoney deve formatar valores em Real (BRL) sem centavos e tratar entradas invalidas com seguranca', () => {
      const formatted420k = formatMoney(420000).replace(/\s+/g, ' ');
      assert.equal(formatted420k, 'R$ 420.000');

      const formattedZero = formatMoney(0).replace(/\s+/g, ' ');
      assert.equal(formattedZero, 'R$ 0');

      const formattedInvalid = formatMoney('valor-invalido').replace(/\s+/g, ' ');
      assert.equal(formattedInvalid, 'R$ 0');

      const formattedNull = formatMoney(null).replace(/\s+/g, ' ');
      assert.equal(formattedNull, 'R$ 0');
    });

    it('formatArea deve formatar medidas positivas em m² e retornar vazio para zero ou invalidos', () => {
      assert.equal(formatArea(165), '165 m²');
      assert.equal(formatArea('450'), '450 m²');
      assert.equal(formatArea(0), '');
      assert.equal(formatArea(-20), '');
      assert.equal(formatArea(null), '');
      assert.equal(formatArea('abc'), '');
    });

    it('formatPhone deve formatar numeros com DDI 55 (13 digitos), celulares (11 digitos) e fixos (10 digitos)', () => {
      assert.equal(formatPhone('5547992139207'), '(47) 99213-9207');
      assert.equal(formatPhone('47992139207'), '(47) 99213-9207');
      assert.equal(formatPhone('4736521234'), '(47) 3652-1234');
      assert.equal(formatPhone(''), '');
      assert.equal(formatPhone(null), '');
    });

    it('getCategoryPrefix e INITIAL_PROPERTIES devem gerar e manter codigos padronizados por categoria', () => {
      assert.equal(getCategoryPrefix('casa', 'venda'), 'CA');
      assert.equal(getCategoryPrefix('apartamento', 'venda'), 'AP');
      assert.equal(getCategoryPrefix('terreno', 'venda'), 'TE');
      assert.equal(getCategoryPrefix('sitio', 'venda'), 'SI');
      assert.equal(getCategoryPrefix('comercial', 'venda'), 'CO');
      assert.equal(getCategoryPrefix('casa', 'aluguel'), 'AL');
      assert.equal(getCategoryPrefix('comercial', 'aluguel'), 'AL');
      assert.equal(getCategoryPrefix('outro', 'venda'), 'IM');

      assert.ok(Array.isArray(INITIAL_PROPERTIES) && INITIAL_PROPERTIES.length === 1, 'Deve existir exatamente 1 anuncio inicial completo');
      const prop = INITIAL_PROPERTIES[0];
      const expectedPrefix = getCategoryPrefix(prop.type, prop.purpose);
      assert.ok(
        prop.code.startsWith(`${expectedPrefix}-`),
        `Imovel ${prop.id} deveria ter codigo iniciando com ${expectedPrefix}-, mas possui ${prop.code}`
      );
      assert.equal(prop.type, 'casa');
      assert.ok(Number(prop.price) > 0, `Imovel ${prop.code} deve ter preco positivo`);
      assert.ok(typeof prop.title === 'string' && prop.title.length > 10, `Imovel ${prop.code} deve ter titulo valido`);
      assert.ok(Array.isArray(prop.images) && prop.images.length >= 6, 'O anuncio unico deve ter galeria completa com pelo menos 6 fotos da casa');
      assert.ok(Array.isArray(prop.features) && prop.features.length >= 6, 'O anuncio unico deve ter lista completa de comodidades');
    });
  });
});
