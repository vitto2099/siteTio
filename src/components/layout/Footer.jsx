import React, { useState, useRef } from 'react';
import { MapPin, Mail, Facebook, Instagram, ShieldCheck, Github, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { SITE_CONFIG } from '../../config';

const SITE_LAST_UPDATED = '09/09/2026';

export default function Footer({ setCurrentTab }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const footerRef = useRef(null);

  const toggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      // Rola suavemente para baixo para exibir o conteúdo expandido dentro da tela
      setTimeout(() => {
        footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 80);
    } else {
      setIsExpanded(false);
      setTimeout(() => {
        footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 80);
    }
  };

  return (
    <footer ref={footerRef} className="footer-collapsible">
      {/* Barra de controle e resumo (Sempre visível) */}
      <div className="footer-bar-summary">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 600 }}>
              &copy; {new Date().getFullYear()} Anderson Kunicki ({SITE_CONFIG.creci})
            </span>
            <span className="footer-updated-badge">
              <Clock size={12} style={{ color: 'var(--gold-primary)' }} />
              Site atualizado em: {SITE_LAST_UPDATED}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="footer-expand-btn"
              onClick={toggleExpand}
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? 'Recolher rodapé' : 'Expandir rodapé completo'}</span>
              {isExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo completo expansível com sanfona suave */}
      <div 
        style={{
          maxHeight: isExpanded ? '900px' : '0px',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'
        }}
      >
        <div className="container" style={{ padding: '2.5rem 1.5rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
            
            {/* Brand Info */}
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Anderson <span style={{ color: 'var(--accent-red)' }}>Kunicki</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.04em' }}>
                Corretor Imobiliário • {SITE_CONFIG.creci}
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Sua referência em negócios imobiliários transparentes e seguros em Itaiópolis e toda a região norte catarinense.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '2px solid var(--accent-red)', width: 'fit-content', paddingBottom: '0.3rem', fontWeight: 700 }}>
                Navegação
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', padding: 0 }}>
                <li>
                  <button onClick={() => { setCurrentTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#CBD5E1', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
                    Imóveis Disponíveis
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#CBD5E1', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
                    Sobre & Contato
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#CBD5E1', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left', background: 'none', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} /> Política de Privacidade (LGPD)
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact details */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '2px solid var(--accent-red)', width: 'fit-content', paddingBottom: '0.3rem', fontWeight: 700 }}>
                Atendimento Direto
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, fontSize: '0.88rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                  <span>{SITE_CONFIG.fullAddress}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
                  <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{SITE_CONFIG.email}</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Instagram size={15} style={{ color: '#E1306C', flexShrink: 0 }} />
                  <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {SITE_CONFIG.instagramHandle || '@kunickianderson'}
                  </a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Facebook size={15} style={{ color: '#1877F2', flexShrink: 0 }} />
                  <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    facebook.com/anderson.kunicki.9
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: '#64748B'
          }}>
            <div>
              &copy; {new Date().getFullYear()} Anderson Kunicki - Corretor Imobiliário. Todos os direitos reservados.
            </div>
            <div>
              Desenvolvido por <strong style={{ color: '#E2E8F0' }}>Vitor Kunicki</strong>{' '}
              <a 
                href="https://github.com/vitto2099" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: '#93C5FD', 
                  fontWeight: 600, 
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  marginLeft: '0.25rem'
                }}
              >
                <Github size={13} /> @vitto2099
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
