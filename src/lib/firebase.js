import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'sua-api-key-aqui'
);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.info('Firebase inicializado para o projeto:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('Erro ao inicializar o Firebase. Operando com persistencia local:', error);
  }
} else {
  console.info('Firebase em modo de persistencia local (localStorage).');
}

export async function ensureFirebaseAuth() {
  if (!isFirebaseConfigured || !auth) return false;
  if (auth.currentUser) return true;
  try {
    await signInWithEmailAndPassword(auth, 'andersonkunicki@gmail.com', 'fiorino2026');
    console.info('Firebase Auth autenticado com sucesso.');
    return true;
  } catch (err) {
    console.warn('Falha na autenticacao automatica do Firebase:', err);
    return false;
  }
}

export { app, db, auth };
