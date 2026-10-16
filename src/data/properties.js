// Helper para gerar prefixo imobiliario padrao por categoria / finalidade
export function getCategoryPrefix(type = 'casa', purpose = 'venda') {
  if (purpose === 'aluguel') return 'AL';
  switch (type) {
    case 'casa': return 'CA';
    case 'apartamento': return 'AP';
    case 'terreno': return 'TE';
    case 'sitio': return 'SI';
    case 'comercial': return 'CO';
    default: return 'IM';
  }
}

// IDs de mockups e demonstracoes antigas descartadas
export const LEGACY_MOCKUP_IDS = [
  'prop-ca-101',
  'prop-si-101',
  'prop-te-101',
  'prop-ca-102',
  'prop-ap-101',
  'prop-al-101'
];

// Catalogo inicial limpo — apenas imoveis reais cadastrados pelo corretor
export const INITIAL_PROPERTIES = [];
