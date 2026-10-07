import React from 'react';
import { ArrowDown, ShieldCheck, MapPin } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function Hero({ onSearch }) {
  const waUrl = getWhatsAppUrl("Olá Anderson! Gostaria de conversar sobre imóveis em Itaiópolis e região.");

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: 'var(--primary-dark)',
        backgroundImage: `linear-gradient(105deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.78) 55%, rgba(15, 23, 42, 0.68) 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '3.75rem 0 3.5rem',
        color: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '720px' }}>
          {/* Assinatura Institucional Sóbria */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: '#CBD5E1',
              letterSpacing: '0.03em',
              marginBottom: '1.15rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <ShieldCheck size={14} style={{ color: '#E2E8F0' }} />
            <span>{SITE_CONFIG.brokerName}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{SITE_CONFIG.creci}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> Itaiópolis e Região
            </span>
          </div>

          {/* Título Editorial Sóbrio */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.6vw, 2.65rem)',
              color: '#FFFFFF',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              marginBottom: '0.9rem'
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
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              maxWidth: '620px'
            }}
          >
            Casas, terrenos urbanos, chácaras e imóveis comerciais avaliados com critério técnico, transparência e atendimento direto do início à escritura.
          </p>

          {/* Ações Diretas e Discretas */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onSearch}
              className="btn"
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-dark)',
                padding: '0.68rem 1.25rem',
                fontWeight: 600
              }}
            >
              <span>Ver catálogo disponível</span>
              <ArrowDown size={15} />
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '0.68rem 1.25rem',
                fontWeight: 500
              }}
            >
              <WhatsAppIcon size={15} color="#FFFFFF" />
              <span>Falar diretamente com o corretor</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
