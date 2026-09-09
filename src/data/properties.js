// Helper para gerar prefixo imobiliário padrão por categoria / finalidade
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

// Imóveis reais/amostra com códigos setoriais padronizados para Itaiópolis e região
export const INITIAL_PROPERTIES = [
  {
    id: "prop-ca-101",
    code: "CA-101",
    title: "Casa de Alvenaria no Centro com Edícula",
    purpose: "venda",
    type: "casa",
    price: 420000,
    neighborhood: "Centro",
    city: "Itaiópolis",
    state: "SC",
    area: 165,
    landArea: 420,
    bedrooms: 3,
    suites: 1,
    bathrooms: 2,
    garage: 2,
    featured: true,
    status: "ativo",
    description: "Excelente residência em alvenaria localizada em rua tranquila e asfaltada no Centro de Itaiópolis. Possui 3 dormitórios (sendo 1 suíte espaçosa), sala de estar e jantar integradas, cozinha ampla com móveis sob medida, área de serviço separada, edícula com churrasqueira a carvão e garagem coberta para 2 veículos. Terreno todo murado com portão eletrônico e quintal gramado.",
    features: ["Suíte Master", "Churrasqueira", "Edícula", "Portão Eletrônico", "Rua Asfaltada", "Móveis Planejados", "Quintal Amplo", "Próximo a Comércios"],
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-01"
  },
  {
    id: "prop-si-101",
    code: "SI-101",
    title: "Chácara com Área Verde e Nascente em Moema",
    purpose: "venda",
    type: "sitio",
    price: 320000,
    neighborhood: "Moema",
    city: "Itaiópolis",
    state: "SC",
    area: 90,
    landArea: 20000,
    bedrooms: 2,
    suites: 0,
    bathrooms: 1,
    garage: 2,
    featured: true,
    status: "ativo",
    description: "Linda chácara de 20.000 m² (2 hectares) em Moema, interior de Itaiópolis. Propriedade com ótima topografia, nascente de água cristalina, pequeno tanque de peixes, pomar formado com árvores frutíferas e casa rústica de campo aconchegante com fogão a lenha. Ideal para descanso nos finais de semana ou para moradia com contato direto com a natureza.",
    features: ["Nascente de Água", "Tanque de Peixes", "Fogão a Lenha", "Pomar", "Área de Pastagem", "Energia Elétrica", "Fácil Acesso"],
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-03"
  },
  {
    id: "prop-te-101",
    code: "TE-101",
    title: "Terreno Residencial Pronto para Construir no Lucena",
    purpose: "venda",
    type: "terreno",
    price: 115000,
    neighborhood: "Lucena",
    city: "Itaiópolis",
    state: "SC",
    area: 450,
    landArea: 450,
    bedrooms: 0,
    suites: 0,
    bathrooms: 0,
    garage: 0,
    featured: false,
    status: "ativo",
    description: "Excelente lote residencial de 450 m² (15m x 30m) em área residencial consolidada no Bairro Lucena. Topografia plana, acima do nível da rua, pronto para iniciar a construção da sua casa própria ou investimento. Rua com infraestrutura completa de água tratada, energia elétrica e iluminação pública. Escritura pública e documentação 100% regular.",
    features: ["Topografia Plana", "Documentação 100% Regular", "Pronto para Construir", "Água e Energia", "Bairro Residencial Tranquilo"],
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-05"
  },
  {
    id: "prop-ca-102",
    code: "CA-102",
    title: "Residência Moderna com Varanda e Garagem Coberta",
    purpose: "venda",
    type: "casa",
    price: 285000,
    neighborhood: "Vila Nova",
    city: "Itaiópolis",
    state: "SC",
    area: 110,
    landArea: 360,
    bedrooms: 2,
    suites: 0,
    bathrooms: 1,
    garage: 1,
    featured: true,
    status: "ativo",
    description: "Casa aconchegante e bem arejada no Bairro Vila Nova. Composta por 2 quartos confortáveis, sala de estar iluminada, copa e cozinha com acabamento moderno, banheiro social com box de vidro, lavanderia coberta e ampla varanda frontal. Terreno individual com espaço livre para ampliações ou jardim.",
    features: ["Varanda Frontal", "Lavanderia Fechada", "Piso Cerâmico", "Muros Altos", "Espaço para Ampliação", "Aceita Financiamento"],
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-07"
  },
  {
    id: "prop-ap-101",
    code: "AP-101",
    title: "Apartamento Central com 2 Quartos e Sacada com Churrasqueira",
    purpose: "venda",
    type: "apartamento",
    price: 245000,
    neighborhood: "Centro",
    city: "Itaiópolis",
    state: "SC",
    area: 75,
    landArea: 0,
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    garage: 1,
    featured: false,
    status: "ativo",
    description: "Apartamento ensolarado no Centro de Itaiópolis com ótima ventilação e acabamento de qualidade. Possui 2 dormitórios (1 suíte), sala integrada com a cozinha, sacada com churrasqueira individual, banheiro social, área de serviço e 1 vaga de garagem coberta. Prédio seguro com interfone e portão eletrônico.",
    features: ["Sacada com Churrasqueira", "Suíte", "Garagem Coberta", "Portão Eletrônico", "Centro da Cidade", "Aceita Financiamento"],
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-08"
  },
  {
    id: "prop-al-101",
    code: "AL-101",
    title: "Casa Comercial e Residencial para Locação no Centro",
    purpose: "aluguel",
    type: "comercial",
    price: 2200,
    neighborhood: "Centro",
    city: "Itaiópolis",
    state: "SC",
    area: 130,
    landArea: 350,
    bedrooms: 3,
    suites: 0,
    bathrooms: 2,
    garage: 2,
    featured: false,
    status: "ativo",
    description: "Imóvel versátil para locação comercial ou residencial em localização privilegiada no Centro de Itaiópolis, com grande fluxo de pedestres e veículos. Amplo espaço frontal, recepção/salas, 2 banheiros e estacionamento próprio. Ideal para escritórios, clínicas, consultórios ou moradia com comércio integrado.",
    features: ["Ponto Comercial Nobre", "Estacionamento Próprio", "Fácil Acesso", "Rua Asfaltada", "Grande Visibilidade"],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
    ],
    createdAt: "2026-09-09"
  }
];
