import React, { useState, useEffect } from 'react';
import { PlusCircle, Menu, X, User } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function Header({ currentTab, setCurrentTab, onOpenAdminModal, currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waUrl = getWhatsAppUrl("Olá Anderson! Gostaria de informações sobre os imóveis disponíveis.");

  const baseNavItems = [
    { id: 'home', label: 'Imóveis', path: '/' },
    { id: 'about', label: 'Sobre e Contato', path: '/sobre' }
  ];

  const navItems = (currentTab === 'admin' || currentUser)
    ? [...baseNavItems, { id: 'admin', label: 'Painel', path: '/admin', isSpecial: true }]
    : baseNavItems;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: isScrolled ? '0 4px 18px rgba(15, 23, 42, 0.04)' : 'none',
          transition: 'box-shadow 0.25s ease'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: isScrolled ? '68px' : '76px',
            transition: 'height 0.22s ease',
            gap: '1.25rem'
          }}
        >
          {/* Marca Tipográfica Editorial */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('home');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              minWidth: 0
            }}
          >
            <img
              src="/favicon.svg"
              alt="Anderson Kunicki"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid var(--border-subtle)'
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap'
                }}
              >
                Anderson <span style={{ color: 'var(--accent-red)' }}>Kunicki</span>
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  marginTop: '0.1rem'
                }}
              >
                Corretor de Imóveis · {SITE_CONFIG.creci}
              </div>
            </div>
          </a>

          {/* Navegação Principal */}
          <nav className="desktop-nav" aria-label="Navegação principal">
            <ul
              style={{
                display: 'flex',
                gap: '2rem',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                alignItems: 'center'
              }}
            >
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentTab(item.id);
                      }}
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--text-dark)' : 'var(--text-body)',
                        padding: '0.35rem 0',
                        borderBottom: isActive ? '2px solid var(--accent-red)' : '2px solid transparent',
                        transition: 'var(--transition)'
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Ações à Direita */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {currentTab === 'admin' && currentUser && (
              <button
                type="button"
                className="btn btn-red btn-sm"
                onClick={onOpenAdminModal}
              >
                <PlusCircle size={15} />
                <span className="header-wa-text">Novo Imóvel</span>
              </button>
            )}

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-navy btn-sm"
              style={{
                padding: '0.5rem 1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <WhatsAppIcon size={15} color="#FFFFFF" />
              <span className="header-wa-text">Atendimento WhatsApp</span>
            </a>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--text-dark)',
                border: '1px solid var(--border-subtle)',
                padding: '0.45rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Abrir menu de navegação"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay Mobile */}
      <div
        className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Gaveta de Navegação Mobile */}
      <aside className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.08rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              Anderson <span style={{ color: 'var(--accent-red)' }}>Kunicki</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Corretor de Imóveis · {SITE_CONFIG.creci}
            </div>
            {currentUser && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-body)',
                  marginTop: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <User size={12} /> Sessão: <strong>{currentUser}</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentTab(item.id);
                  setMobileOpen(false);
                }}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  backgroundColor: isActive ? 'var(--bg-main)' : 'transparent',
                  color: isActive ? 'var(--accent-red)' : 'var(--text-dark)',
                  borderLeft: isActive ? '3px solid var(--accent-red)' : '3px solid transparent'
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-navy"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <WhatsAppIcon size={16} color="#FFFFFF" /> Conversar no WhatsApp
          </a>
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {SITE_CONFIG.phoneFormatted}
          </a>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.35rem' }}>
            {SITE_CONFIG.address} · {SITE_CONFIG.cityState}
          </div>
        </div>
      </aside>
    </>
  );
}
