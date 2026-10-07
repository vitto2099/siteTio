import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

export default function ChangePasswordModal({ isOpen, onClose, onUpdatePassword }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPass) {
      setError('Informe a senha atual.');
      return;
    }

    if (newPass.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPass !== confirmPass) {
      setError('A confirmação da nova senha não confere.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await onUpdatePassword(currentPass, newPass);
      if (success) {
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Erro ao alterar a senha. Verifique a senha atual.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '420px', padding: 0, overflow: 'hidden' }}>
        
        {/* Cabeçalho Sóbrio */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.15rem 1.5rem', 
          backgroundColor: 'var(--primary-dark)',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={18} style={{ color: '#94A3B8' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, margin: 0 }}>
                Alterar Senha
              </h3>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '0.7rem 0.9rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem' }}>
              Senha Atual
            </label>
            <input 
              type={showPass ? 'text' : 'password'} 
              className="input-field"
              placeholder="Digite a senha atual"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem' }}>
              Nova Senha (mínimo 6 caracteres)
            </label>
            <input 
              type={showPass ? 'text' : 'password'} 
              className="input-field"
              placeholder="Digite a nova senha"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem' }}>
              Confirmar Nova Senha
            </label>
            <input 
              type={showPass ? 'text' : 'password'} 
              className="input-field"
              placeholder="Repita a nova senha"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: 0
              }}
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPass ? 'Ocultar senhas' : 'Mostrar senhas'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem' }}>
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={onClose} 
              style={{ flex: 1 }}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-navy" 
              style={{ flex: 1.4, fontWeight: 700 }}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Senha'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
