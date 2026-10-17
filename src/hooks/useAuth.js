import { useState, useEffect, useCallback } from 'react';
import { hashPassword, sanitizeText } from '../utils/security';

const AUTH_STORAGE_KEY = 'anderson_kunicki_auth_user_v1';
const CUSTOM_PASS_STORAGE_KEY = 'anderson_kunicki_custom_pass_hash_v1';
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutos

export function useAuth(onToast) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const login = useCallback(async (usernameOrEmail, passwordInput) => {
    const cleanUser = sanitizeText(usernameOrEmail || '', 120).trim();
    if (!cleanUser || !passwordInput) {
      if (onToast) onToast('Usuário ou senha inválidos.');
      return false;
    }

    // Validação de Segurança Criptográfica via SHA-256
    const hashedInput = await hashPassword(passwordInput);
    const customHash = localStorage.getItem(CUSTOM_PASS_STORAGE_KEY);

    // Hash SHA-256 autorizado oficial (fiorino2026)
    const defaultHashes = [
      'ecf39b525dc6050fb392ac8a15a1c0bdbac1f766f37d24147bea88d38455a04d'
    ];

    const isValid = customHash
      ? hashedInput === customHash
      : defaultHashes.includes(hashedInput);

    const userMatch = cleanUser.toLowerCase() === 'andersonkunicki' || 
                      cleanUser.toLowerCase() === 'admin' || 
                      cleanUser.includes('@');

    if (isValid && userMatch) {
      const rawLoggedName = cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser;
      const loggedName = sanitizeText(rawLoggedName, 60) || 'andersonkunicki';
      setCurrentUser(loggedName);
      try { sessionStorage.setItem(AUTH_STORAGE_KEY, loggedName); } catch {}
      if (onToast) onToast(`Bem-vindo, ${loggedName}. Sessão iniciada.`);
      return true;
    }

    if (onToast) onToast('Usuário ou senha inválidos.');
    return false;
  }, [onToast]);

  const logout = useCallback(async () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    if (onToast) onToast('Sessão encerrada com sucesso.');
  }, [onToast]);

  // Alterar Senha (Armazenamento Criptográfico Local SHA-256)
  const updateUserPassword = useCallback(async (currentPass, newPass) => {
    const currentHashed = await hashPassword(currentPass);
    const storedCustom = localStorage.getItem(CUSTOM_PASS_STORAGE_KEY);
    const defaultHashes = [
      'ecf39b525dc6050fb392ac8a15a1c0bdbac1f766f37d24147bea88d38455a04d',
      '0a2fb47fa6a7f7d142ce049386d34b46294a282f6e9196b0bd59048a1c97042a',
      '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
    ];
    const validCurrent = storedCustom 
      ? (currentHashed === storedCustom)
      : defaultHashes.includes(currentHashed);

    if (!validCurrent) {
      throw new Error('A senha atual informada está incorreta.');
    }

    const newHashed = await hashPassword(newPass);
    localStorage.setItem(CUSTOM_PASS_STORAGE_KEY, newHashed);
    if (onToast) onToast('Nova senha salva com sucesso.');
    return true;
  }, [onToast]);

  // Timeout de inatividade automática (30 minutos)
  useEffect(() => {
    if (!currentUser) return;

    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        if (onToast) {
          onToast('Sessão encerrada automaticamente por inatividade (30 min).');
        }
      }, INACTIVITY_LIMIT);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [currentUser, logout, onToast]);

  return {
    currentUser,
    isLoadingAuth,
    login,
    logout,
    updateUserPassword,
    isAuthenticated: !!currentUser
  };
}
