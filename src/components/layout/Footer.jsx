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
        backgroundColor: 'var(--primary-dark)',
        color: '#E2E8F0',
        borderTop: '1px solid #1E293B',
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
          {/* Coluna 1: Marca & CRECI */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '0.25rem'
              }}
            >
              Anderson <span style={{ color: '#D9777F' }}>Kunicki</span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#94A3B8',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.9rem'
              }}
            >
              Corretor de Imóveis · {SITE_CONFIG.creci}
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
                fontWeight: 600,
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
                fontWeight: 600,
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
                <MapPin size={15} style={{ color: '#94A3B8', flexShrink: 0, marginTop: '3px' }} />
                <span>{SITE_CONFIG.fullAddress}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} style={{ color: 'inherit' }}>
                  {SITE_CONFIG.phoneFormatted}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
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
