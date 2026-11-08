export const POST_CATEGORIES = [
  { value: 'movimentacao', label: 'Movimentação e Bastidores' },
  { value: 'captacao', label: 'Nova Captação' },
  { value: 'vendido', label: 'Imóvel Negociado' },
  { value: 'mercado', label: 'Dica de Mercado' },
  { value: 'comunicado', label: 'Comunicado Oficial' }
];

export function getPostCategoryLabel(categoryValue) {
  const found = POST_CATEGORIES.find((c) => c.value === categoryValue);
  return found ? found.label : 'Atualização';
}

export const INITIAL_POSTS = [
  {
    id: 'post-ak-001',
    entityType: 'post',
    category: 'movimentacao',
    title: 'Portal em Movimento — Novas Captações e Consultoria Imobiliária em Itaiópolis e Região',
    content:
      'Nosso portal imobiliário está em plena movimentação com novas captações de casas residenciais, terrenos urbanos, chácaras e sítios em Itaiópolis e no Planalto Norte Catarinense.\n\nSe você procura o imóvel ideal para morar ou investir com 100% de segurança jurídica, ou deseja anunciar e vender seu imóvel com avaliação justa de mercado e divulgação profissional, entre em contato direto pelo WhatsApp (47) 99213-9207.\n\nAtendimento personalizado por Anderson Kunicki — Corretor de Imóveis credenciado (CRECI-SC 60173 F), com assessoria completa desde a visita até a aprovação de financiamento bancário e escritura.',
    imageUrl: '/post-anderson-kunicki.jpg',
    propertyRef: '',
    featured: true,
    createdAt: '2026-11-08',
    updatedAt: '2026-11-08T18:00:00.000Z'
  }
];

