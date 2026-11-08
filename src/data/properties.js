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

// Catalogo inicial com postagem oficial de movimentacao e captacao do corretor
export const INITIAL_PROPERTIES = [
  {
    id: 'prop-ca-201',
    code: 'CA-201',
    title: 'Captação e Consultoria Imobiliária — Casas, Terrenos e Sítios em Itaiópolis e Região',
    purpose: 'venda',
    type: 'casa',
    price: 0,
    hidePrice: true,
    address: 'Rua Francisco Mielzkovski, 173 - Centro',
    neighborhood: 'Centro e Região',
    city: 'Itaiópolis',
    state: 'SC',
    area: 0,
    landArea: 0,
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    garage: 0,
    garages: 0,
    iptu: 0,
    condoFee: 0,
    featured: true,
    status: 'ativo',
    imageFit: 'contain',
    description:
      'Nosso portal imobiliário está em plena movimentação com novas captações de casas residenciais, terrenos urbanos, chácaras e sítios em Itaiópolis e no Planalto Norte Catarinense.\n\nSe você procura o imóvel ideal para morar ou investir com 100% de segurança jurídica, ou deseja anunciar e vender seu imóvel com avaliação justa de mercado e divulgação profissional, entre em contato direto pelo WhatsApp (47) 99213-9207.\n\nAtendimento personalizado por Anderson Kunicki — Corretor de Imóveis credenciado (CRECI-SC 60173 F), com assessoria completa desde a visita até a aprovação de financiamento bancário e escritura.',
    features: [
      'Novas Captações na Região',
      'Avaliação Mercadológica Justa',
      'Segurança Jurídica 100%',
      'Assessoria em Financiamento',
      'Compra, Venda e Avaliação',
      'CRECI-SC 60173 F'
    ],
    tags: [
      'Novas Captações na Região',
      'Avaliação Mercadológica Justa',
      'Segurança Jurídica 100%',
      'Assessoria em Financiamento',
      'Compra, Venda e Avaliação',
      'CRECI-SC 60173 F'
    ],
    imageUrl: '/post-anderson-kunicki.jpg',
    images: ['/post-anderson-kunicki.jpg'],
    createdAt: '2026-11-08'
  }
];
