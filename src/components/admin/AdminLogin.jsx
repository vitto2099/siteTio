import React, { useState, useEffect } from 'react';
import { Lock, User, KeyRound, ShieldAlert, Eye, EyeOff, LogIn, Clock } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setErrorMsg('');
    setIsLoading(true);

    try {
      const success = await onLogin(username.trim(), password);
      if (!success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutTime(60);
          setErrorMsg('Múltiplas tentativas incorretas. Acesso temporariamente bloqueado por 60 segundos.');
        } else {
          setErrorMsg(`Usuário ou senha incorretos. Tentativa ${nextAttempts} de 5.`);
        }
      }
    } catch {
      setErrorMsg('Erro de autenticação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '78vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '410px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        
        {/* Cabeçalho Sóbrio */}
        <div style={{
          backgroundColor: 'var(--primary-dark)',
          padding: '2rem 1.75rem 1.65rem',
          color: '#FFFFFF'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.4rem'
          }}>
            <Lock size={13} /> Área do Corretor
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            margin: '0 0 0.25rem',
            color: '#FFFFFF'
          }}>
            Painel de Imóveis
          </h2>

          <p style={{
            fontSize: '0.82rem',
            color: '#CBD5E1',
            margin: 0
          }}>
            Anderson Kunicki · CRECI-SC 60173 F
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
          
          {errorMsg && (
            <div style={{
              backgroundColor: lockoutTime > 0 ? '#FFFBEB' : '#FEF2F2',
              border: lockoutTime > 0 ? '1px solid #FDE68A' : '1px solid #FECACA',
              color: lockoutTime > 0 ? '#92400E' : '#991B1B',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              marginBottom: '1.25rem',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              {lockoutTime > 0 ? (
                <Clock size={17} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              ) : (
                <ShieldAlert size={17} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              )}
              <div>
                <div>{errorMsg}</div>
                {lockoutTime > 0 && (
                  <div style={{ fontWeight: 800, marginTop: '0.2rem' }}>
                    Aguarde {lockoutTime}s para tentar novamente.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usuário */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary-dark)',
              marginBottom: '0.35rem'
            }}>
              Usuário
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <User size={16} />
              </div>
              <input
                type="text"
                className="input-field"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={lockoutTime > 0}
                autoFocus
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--primary-dark)',
              marginBottom: '0.35rem'
            }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={lockoutTime > 0}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.7rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-navy"
            disabled={isLoading || lockoutTime > 0}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              justifyContent: 'center',
              opacity: lockoutTime > 0 ? 0.6 : 1
            }}
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : lockoutTime > 0 ? (
              <span>Acesso Bloqueado ({lockoutTime}s)</span>
            ) : (
              <>
                <LogIn size={17} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
