import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (customText) => {
    const textToSend =
      customText ||
      message.trim() ||
      'Olá Anderson! Vim através do site e gostaria de atendimento.';
    window.open(getWhatsAppUrl(textToSend), '_blank');
    setOpen(false);
    setMessage('');
  };

  const quickQuestions = [
    'Gostaria de agendar uma visita a um imóvel',
    'Quero avaliar meu imóvel para venda ou locação',
    'Procuro opções de casas ou terrenos em Itaiópolis'
  ];

  return (
    <div
      className="wa-widget-container"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}
    >
      {/* Popover Discreto e Editorial */}
      {open && (
        <div
          className="wa-widget-popover animate-fade-in"
          style={{
            width: '320px',
            maxWidth: 'calc(100vw - 2rem)',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '0.75rem'
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              backgroundColor: 'var(--primary-dark)',
              color: '#FFFFFF',
              padding: '1rem 1.15rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', lineHeight: 1.2 }}>
                {SITE_CONFIG.brokerName}
              </strong>
              <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>
                {SITE_CONFIG.creci} · WhatsApp Direto
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                color: '#CBD5E1',
                padding: '0.2rem',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              aria-label="Fechar janela de atendimento"
            >
              <X size={17} />
            </button>
          </div>

          {/* Corpo */}
          <div style={{ padding: '1rem 1.15rem', backgroundColor: 'var(--bg-main)' }}>
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--text-body)',
                lineHeight: 1.5,
                marginBottom: '0.85rem'
              }}
            >
              Selecione um assunto abaixo ou escreva sua mensagem para iniciar a conversa no WhatsApp:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(q)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-dark)',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    textAlign: 'left',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Formulário de Mensagem */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(message);
            }}
            style={{
              padding: '0.75rem 0.9rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.45rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="Escreva sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                fontSize: '0.84rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--bg-main)'
              }}
            />
            <button
              type="submit"
              className="btn btn-whatsapp"
              style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-xs)' }}
              aria-label="Enviar mensagem no WhatsApp"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante Discreto (Sem badge falso, sem som e sem radar) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#15803D',
          color: '#FFFFFF',
          boxShadow: '0 6px 20px rgba(15, 23, 42, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        aria-label={open ? 'Fechar contato do WhatsApp' : 'Atendimento pelo WhatsApp'}
        title="Atendimento pelo WhatsApp"
      >
        {open ? <X size={22} color="#FFFFFF" /> : <WhatsAppIcon size={25} color="#FFFFFF" />}
      </button>
    </div>
  );
}
