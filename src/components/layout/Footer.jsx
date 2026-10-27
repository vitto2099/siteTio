import React from 'react';
import { MapPin, Mail, Phone, Instagram, Facebook, Lock } from 'lucide-react';
import { SITE_CONFIG } from '../../config';

export default function Footer({ setCurrentTab }) {
  const handleNav = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0B0F14',
        color: '#E2E8F0',
        borderTop: '4px solid var(--brand-red-solid)',
        marginTop: 'auto'
      }}
    >
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.25rem' }}>
        {/* Grade de 3 Colunas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Coluna 1: Logomarca Oficial & Apresentação */}
          <div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#FFFFFF',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                borderBottom: '3px solid var(--brand-red-top)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                marginBottom: '1rem'
              }}
            >
              <img
                src="/logo-full.png"
                alt="Anderson Kunicki — Corretor de Imóveis — CRECI-SC 60173 F"
                style={{
                  height: '78px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <p
              style={{
                color: '#94A3B8',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                maxWidth: '340px'
              }}
            >
              Consultoria imobiliária em Itaiópolis e Planalto Norte Catarinense. Compra, venda e locação de imóveis urbanos e rurais com rigor documental.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}
            >
              Navegação
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                padding: 0,
                margin: 0
              }}
            >
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('home');
                  }}
                  style={{ color: '#CBD5E1', fontSize: '0.88rem' }}
                >
                  Catálogo de Imóveis
                </a>
              </li>
              <li>
                <a
                  href="/sobre"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('about');
                  }}
                  style={{ color: '#CBD5E1', fontSize: '0.88rem' }}
                >
                  Sobre e Contato
                </a>
              </li>
              <li>
                <a
                  href="/privacidade"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('privacy');
                  }}
                  style={{ color: '#CBD5E1', fontSize: '0.88rem' }}
                >
                  Política de Privacidade (LGPD)
                </a>
              </li>
              <li style={{ paddingTop: '0.25rem' }}>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('admin');
                  }}
                  style={{
                    color: '#64748B',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Lock size={12} />
                  <span>Acesso do Corretor</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Endereço e Contato em Itaiópolis */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}
            >
              Escritório e Contato
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                padding: 0,
                margin: 0,
                fontSize: '0.88rem',
                color: '#CBD5E1'
              }}
            >
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} style={{ color: '#FF4D4D', flexShrink: 0, marginTop: '3px' }} />
                <span>{SITE_CONFIG.fullAddress}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} style={{ color: '#FF4D4D', flexShrink: 0 }} />
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} style={{ color: 'inherit' }}>
                  {SITE_CONFIG.phoneFormatted}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} style={{ color: '#FF4D4D', flexShrink: 0 }} />
                <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: 'inherit' }}>
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  paddingTop: '0.35rem'
                }}
              >
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Instagram size={14} />
                  <span>{SITE_CONFIG.instagramHandle || '@kunickianderson'}</span>
                </a>
                <a
                  href={SITE_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#94A3B8',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Facebook size={14} />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior de Direitos Autorais */}
        <div
          style={{
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: '#64748B'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.brokerName} · {SITE_CONFIG.creci}. Todos os direitos reservados.
          </div>
          <div>
            Itaiópolis — Santa Catarina
          </div>
        </div>
      </div>
    </footer>
  );
}
