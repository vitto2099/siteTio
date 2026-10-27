import React from 'react';
import { ArrowDown, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function Hero({ onSearch }) {
  const waUrl = getWhatsAppUrl("Olá Anderson! Gostaria de conversar sobre imóveis em Itaiópolis e região.");

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: '#0B0F14',
        backgroundImage: `linear-gradient(110deg, rgba(11, 15, 20, 0.95) 0%, rgba(18, 24, 32, 0.88) 55%, rgba(11, 15, 20, 0.82) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3.75rem 0 3.75rem',
        color: '#FFFFFF',
        borderBottom: '3px solid var(--brand-red-solid)'
      }}
    >
      <div className="container">
        <div className="hero-brand-grid">
          {/* Coluna Esquerda: Mensagem Principal e Chamadas para Ação */}
          <div>
            {/* Assinatura Institucional com Símbolo AK */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.55rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#E2E8F0',
                letterSpacing: '0.03em',
                marginBottom: '1.25rem',
                padding: '0.35rem 0.9rem 0.35rem 0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderLeft: '3px solid var(--brand-red-top)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <span
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src="/logo-icon.png"
                  alt="AK"
                  style={{ height: '18px', width: 'auto', display: 'block' }}
                />
              </span>
              <span>{SITE_CONFIG.brokerName}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{SITE_CONFIG.creci}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={12} style={{ color: '#FF4D4D' }} /> Itaiópolis e Região
              </span>
            </div>

            {/* Título Editorial Sóbrio */}
            <h1
              style={{
                fontSize: 'clamp(1.85rem, 3.6vw, 2.7rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.16,
                letterSpacing: '-0.025em',
                marginBottom: '1rem'
              }}
            >
              Consultoria imobiliária com segurança documental em Itaiópolis e região.
            </h1>

            {/* Subtítulo Enxuto */}
            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.08rem)',
                color: '#CBD5E1',
                fontWeight: 400,
                lineHeight: 1.65,
                marginBottom: '1.85rem',
                maxWidth: '610px'
              }}
            >
              Casas, terrenos urbanos, chácaras e imóveis comerciais avaliados com critério técnico, transparência e atendimento direto do início à escritura.
            </p>

            {/* Ações Diretas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={onSearch}
                className="btn btn-red"
                style={{
                  padding: '0.78rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 700
                }}
              >
                <span>Ver catálogo disponível</span>
                <ArrowDown size={16} />
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.24)',
                  padding: '0.78rem 1.35rem',
                  fontSize: '0.92rem',
                  fontWeight: 600
                }}
              >
                <WhatsAppIcon size={16} color="#FFFFFF" />
                <span>Falar diretamente com o corretor</span>
              </a>
            </div>
          </div>

          {/* Coluna Direita: Painel da Identidade Visual Oficial Anderson Kunicki */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1.85rem 1.65rem 1.5rem',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.42)',
              borderTop: '4px solid var(--brand-red-top)',
              textAlign: 'center',
              color: 'var(--text-dark)',
              maxWidth: '420px',
              width: '100%',
              margin: '0 auto'
            }}
          >
            <img
              src="/logo-full.png"
              alt="Anderson Kunicki — Corretor de Imóveis — CRECI-SC 60173 F"
              style={{
                width: '100%',
                maxWidth: '310px',
                height: 'auto',
                margin: '0 auto 1.15rem',
                display: 'block',
                objectFit: 'contain'
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                paddingTop: '0.95rem',
                borderTop: '1px solid #E5E7EB',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: '#374151'
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '0.28rem 0.6rem',
                  borderRadius: '4px'
                }}
              >
                <ShieldCheck size={13} style={{ color: 'var(--brand-red-solid)' }} />
                Segurança Jurídica
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '0.28rem 0.6rem',
                  borderRadius: '4px'
                }}
              >
                <CheckCircle2 size={13} style={{ color: 'var(--brand-red-solid)' }} />
                Compra, Venda e Locação
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
