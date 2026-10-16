/**
 * Cloud API - Conexão Direta e Infalível com o Firebase Firestore
 * Utiliza a API REST oficial do Google Cloud com autenticação direta via token,
 * eliminando problemas de 'unauthorized-domain' e restrições de navegadores.
 */

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/properties`;

let cachedToken = null;
let tokenExpiresAt = 0;

// Obtém token de autenticação administrativa do corretor
export async function getAdminAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  try {
    const res = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'andersonkunicki@gmail.com',
        password: 'fiorino2026',
        returnSecureToken: true
      })
    });

    if (!res.ok) {
      console.warn('Erro ao obter token do Firebase Auth REST:', res.status);
      return null;
    }

    const data = await res.json();
    cachedToken = data.idToken;
    const expiresInSec = parseInt(data.expiresIn, 10) || 3600;
    tokenExpiresAt = now + (expiresInSec * 1000);
    return cachedToken;
  } catch (err) {
    console.error('Falha de conexão com Firebase Auth:', err);
    return null;
  }
}

// Converte valores JavaScript em campos compatíveis com Firestore REST
export function jsValueToFirestore(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    if (Number.isInteger(val)) return { integerValue: String(val) };
    return { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map(jsValueToFirestore)
      }
    };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = jsValueToFirestore(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

// Converte documento do Firestore REST em objeto JavaScript limpo
export function firestoreDocToJs(doc) {
  if (!doc || !doc.fields) return null;
  const obj = {};
  for (const [k, v] of Object.entries(doc.fields)) {
    obj[k] = firestoreValueToJs(v);
  }
  return obj;
}

function firestoreValueToJs(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return Boolean(val.booleanValue);
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(firestoreValueToJs);
  if ('mapValue' in val) {
    const res = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) res[k] = firestoreValueToJs(v);
    return res;
  }
  return null;
}

// Salva imóvel na nuvem
export async function cloudSaveProperty(id, propertyData) {
  const token = await getAdminAuthToken();
  if (!token) throw new Error('Não foi possível autenticar na nuvem');

  const fields = {};
  for (const [key, value] of Object.entries(propertyData)) {
    fields[key] = jsValueToFirestore(value);
  }

  const res = await fetch(`${FIRESTORE_BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ fields })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Erro HTTP ${res.status}`);
  }

  return true;
}

// Exclui imóvel da nuvem
export async function cloudDeleteProperty(id) {
  const token = await getAdminAuthToken();
  if (!token) throw new Error('Não foi possível autenticar na nuvem');

  const res = await fetch(`${FIRESTORE_BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 404) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Erro HTTP ${res.status}`);
  }

  return true;
}

// Busca todos os imóveis públicos da nuvem
export async function cloudFetchProperties() {
  try {
    const res = await fetch(FIRESTORE_BASE_URL);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];
    return data.documents.map(firestoreDocToJs).filter(Boolean);
  } catch (err) {
    console.warn('Erro ao buscar imóveis via REST:', err);
    return [];
  }
}
