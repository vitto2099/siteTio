export const SITE_CONFIG = {
  brokerName: "Anderson Kunicki",
  creci: "CRECI-SC 60173 F",
  phoneRaw: "5547992139207",
  phoneFormatted: "(47) 99213-9207",
  phoneDisplay: "(47) 99213-9207",
  email: "andersonkunicki@gmail.com",
  address: "Rua Francisco Mielzkovski, 173 - Centro",
  fullAddress: "Rua Francisco Mielzkovski, 173 - Itaiópolis - SC, 89340-000, Brasil",
  cityState: "Itaiópolis - SC",
  facebookUrl: "https://www.facebook.com/anderson.kunicki.9",
  instagramUrl: "https://www.instagram.com/kunickianderson/",
  instagramHandle: "@kunickianderson",
  defaultOgImage: "/logo-completa-original.jpg",
  logos: {
    full: "/logo-full.png",
    wordmark: "/logo-wordmark.png",
    emblem: "/logo-emblem.png",
    icon: "/logo-icon.png"
  }
};

export const getWhatsAppUrl = (customText) => {
  const defaultText = "Olá Anderson! Vim através do site e gostaria de informações sobre os imóveis disponíveis em Itaiópolis e região.";
  const text = encodeURIComponent(customText || defaultText);
  return `https://api.whatsapp.com/send?phone=${SITE_CONFIG.phoneRaw}&text=${text}`;
};
