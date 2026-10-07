/**
 * Utilitarios de formatacao de moeda, numeros e strings
 */

export const formatMoney = (value) => {
  const num = Number(value);
  const safeValue = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(safeValue);
};

export const formatArea = (area) => {
  const num = Number(area);
  return Number.isFinite(num) && num > 0 ? `${num} m²` : '';
};

export const formatPhone = (phoneRaw) => {
  if (!phoneRaw) return '';
  const str = String(phoneRaw);
  const cleaned = str.replace(/\D/g, '');
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return str;
};
