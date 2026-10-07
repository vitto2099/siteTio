/**
 * Utilitarios de seguranca, higienizacao contra XSS, validacao de URLs e controle de tentativas
 */

const VALID_TYPES = ['casa', 'terreno', 'sitio', 'apartamento', 'comercial'];
const VALID_PURPOSES = ['venda', 'aluguel'];
const VALID_STATUSES = ['ativo', 'reservado', 'vendido'];
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80';

export const hashPassword = async (plainText) => {
  const text = String(plainText ?? '');
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const sanitizeText = (input, maxLength = 2000) => {
  if (input === null || input === undefined) return '';
  let str = String(input);

  // Remove blocos completos de tags executaveis/embutiveis
  str = str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  str = str.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '');
  str = str.replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '');
  str = str.replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '');
  str = str.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');

  // Remove quaisquer tags HTML remanescentes
  str = str.replace(/<[^>]*>/g, '');

  // Remove atributos de eventos inline (onerror=, onload=, onclick=, etc.)
  str = str.replace(/\bon\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');
  str = str.replace(/\bon\w+\s*=/gi, '');

  // Remove protocolos perigosos em texto
  str = str.replace(/javascript\s*:/gi, '');
  str = str.replace(/vbscript\s*:/gi, '');
  str = str.replace(/data\s*:\s*text\/html/gi, '');

  // Remove caracteres de controle ou colchetes angulares soltos
  str = str.replace(/[<>]/g, '');

  const limit = Number.isFinite(Number(maxLength)) && Number(maxLength) > 0 ? Number(maxLength) : 2000;
  return str.trim().slice(0, limit);
};

export const isValidSafeUrl = (url) => {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    /[<>"'`]/.test(trimmed)
  ) {
    return false;
  }

  if (/^data:image\/(jpeg|jpg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(trimmed)) {
    return true;
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  if (lower.startsWith('https://') || lower.startsWith('http://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
  }

  return false;
};

export const sanitizePropertyPayload = (raw = {}) => {
  const source = raw && typeof raw === 'object' ? raw : {};

  const code = sanitizeText(source.code ?? '', 30).toUpperCase();
  const title = sanitizeText(source.title ?? '', 160);

  const rawType = String(source.type ?? '').toLowerCase().trim();
  const type = VALID_TYPES.includes(rawType) ? rawType : 'casa';

  const rawPurpose = String(source.purpose ?? '').toLowerCase().trim();
  const purpose = VALID_PURPOSES.includes(rawPurpose) ? rawPurpose : 'venda';

  const rawStatus = String(source.status ?? '').toLowerCase().trim();
  const status = VALID_STATUSES.includes(rawStatus) ? rawStatus : 'ativo';

  const toNonNegativeNumber = (val) => {
    const num = Number(val);
    return Number.isFinite(num) ? Math.max(0, num) : 0;
  };

  const toNonNegativeInt = (val) => {
    const parsed = parseInt(val, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  };

  const price = toNonNegativeNumber(source.price);
  const area = toNonNegativeNumber(source.area);
  const landArea = toNonNegativeNumber(source.landArea);
  const iptu = toNonNegativeNumber(source.iptu);
  const condoFee = toNonNegativeNumber(source.condoFee);

  const bedrooms = toNonNegativeInt(source.bedrooms);
  const suites = toNonNegativeInt(source.suites);
  const bathrooms = toNonNegativeInt(source.bathrooms);

  const rawGarageVal = source.garage !== undefined ? source.garage : source.garages;
  const rawGaragesVal = source.garages !== undefined ? source.garages : source.garage;
  const garage = toNonNegativeInt(rawGarageVal);
  const garages = toNonNegativeInt(rawGaragesVal);

  const address = sanitizeText(source.address ?? '', 240);
  const neighborhood = sanitizeText(source.neighborhood ?? '', 120);
  const city = sanitizeText(source.city ?? '', 120);
  const state = sanitizeText(source.state ?? 'SC', 10) || 'SC';
  const description = sanitizeText(source.description ?? '', 4000);

  const videoUrl = isValidSafeUrl(source.videoUrl) ? source.videoUrl.trim() : '';

  const rawImages = Array.isArray(source.images) ? source.images : [];
  const validImages = rawImages
    .filter((img) => isValidSafeUrl(img))
    .map((img) => img.trim());

  if (validImages.length === 0 && isValidSafeUrl(source.imageUrl)) {
    validImages.push(source.imageUrl.trim());
  }

  const images = validImages.length > 0 ? validImages : [DEFAULT_FALLBACK_IMAGE];
  const imageUrl = isValidSafeUrl(source.imageUrl) ? source.imageUrl.trim() : images[0];

  const sanitizeStringList = (list) => {
    if (!Array.isArray(list)) return [];
    return list
      .map((item) => sanitizeText(item, 60))
      .filter((item) => item.length > 0);
  };

  const features = sanitizeStringList(source.features);
  const tags = sanitizeStringList(source.tags);
  const featured = Boolean(source.featured);

  return {
    code,
    title,
    type,
    purpose,
    status,
    price,
    area,
    landArea,
    iptu,
    condoFee,
    bedrooms,
    suites,
    bathrooms,
    garage,
    garages,
    address,
    neighborhood,
    city,
    state,
    description,
    videoUrl,
    images,
    imageUrl,
    features,
    tags,
    featured
  };
};

export const validateLoginRateLimit = (failedAttempts = 0, lockoutUntilMs = 0, nowMs = Date.now()) => {
  const attempts = Math.max(0, Number(failedAttempts) || 0);
  const lockoutUntil = Number(lockoutUntilMs) || 0;
  const now = Number(nowMs) || Date.now();

  if (lockoutUntil > now) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil((lockoutUntil - now) / 1000)
    };
  }

  if (attempts >= 5) {
    return {
      allowed: false,
      shouldLockout: true,
      lockoutDurationMs: 60000,
      remainingSeconds: 60
    };
  }

  return {
    allowed: true,
    remainingAttempts: 5 - attempts
  };
};
