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

// IDs de mockups antigos que devem ser ignorados/removidos automaticamente
export const LEGACY_MOCKUP_IDS = [
  'prop-si-101',
  'prop-te-101',
  'prop-ca-102',
  'prop-ap-101',
  'prop-al-101'
];

// Anuncio unico, completo e realista de demonstracao para a vitrine
export const INITIAL_PROPERTIES = [
  {
    id: 'prop-ca-101',
    code: 'CA-101',
    title: 'Residência de Alvenaria com Suíte e Espaço Gourmet no Centro',
    purpose: 'venda',
    type: 'casa',
    price: 580000,
    address: 'Rua Nereu Ramos, 412',
    neighborhood: 'Centro',
    city: 'Itaiópolis',
    state: 'SC',
    area: 192,
    landArea: 480,
    bedrooms: 3,
    suites: 1,
    bathrooms: 3,
    garage: 2,
    garages: 2,
    iptu: 740,
    condoFee: 0,
    featured: true,
    status: 'ativo',
    description:
      'Residência térrea em alvenaria de alto padrão construtivo, situada em rua residencial pavimentada e tranquila no Centro de Itaiópolis, a poucos minutos de comércios, escolas e serviços.\n\nO projeto privilegia iluminação natural, ventilação cruzada e integração dos ambientes sociais. Conta com sala de estar e jantar com pé-direito ampliado, cozinha planejada integrada ao espaço gourmet com churrasqueira a carvão, 3 dormitórios amplos (sendo 1 suíte master com espaço para closet), banheiro social, lavabo de apoio, lavanderia reservada e garagem coberta lado a lado para 2 veículos.\n\nO terreno de 480 m² é totalmente murado, com portão eletrônico, calçamento externo drenante e jardim frontal e nos fundos com espaço livre. Imóvel com escritura pública individual, averbação em dia e documentação 100% regular para financiamento bancário.',
    features: [
      'Suíte Master',
      'Churrasqueira Gourmet',
      'Cozinha Sob Medida',
      'Pé-Direito Alto',
      'Porcelanato Retificado',
      'Vaga Coberta para 2 Carros',
      'Portão Eletrônico',
      'Quintal Amplo e Murado',
      'Escriturado',
      'Aceita Financiamento'
    ],
    tags: [
      'Suíte Master',
      'Churrasqueira Gourmet',
      'Cozinha Sob Medida',
      'Pé-Direito Alto',
      'Porcelanato Retificado',
      'Vaga Coberta para 2 Carros',
      'Portão Eletrônico',
      'Quintal Amplo e Murado',
      'Escriturado',
      'Aceita Financiamento'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85'
    ],
    createdAt: '2026-10-07'
  }
];
