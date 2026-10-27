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
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(192, 0, 8, 0.16)',
          boxShadow: isScrolled ? '0 6px 22px rgba(11, 15, 20, 0.08)' : '0 1px 4px rgba(11, 15, 20, 0.03)',
          transition: 'box-shadow 0.25s ease'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: isScrolled ? '74px' : '84px',
            transition: 'height 0.22s ease',
            gap: '1.25rem'
          }}
        >
          {/* Identidade Visual Oficial: Símbolo AK + Letreiro Anderson Kunicki */}
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
              minWidth: 0,
              padding: '0.25rem 0'
            }}
            aria-label="Anderson Kunicki — Corretor de Imóveis CRECI-SC 60173 F"
          >
            <img
              src="/logo-emblem.png"
              alt="Símbolo AK — Anderson Kunicki"
              className="header-emblem-img"
              style={{
                height: isScrolled ? '48px' : '56px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
                transition: 'height 0.22s ease'
              }}
            />
            <img
              src="/logo-wordmark.png"
              alt="Anderson Kunicki — Corretor de Imóveis — CRECI-SC 60173 F"
              className="header-wordmark-img"
              style={{
                height: isScrolled ? '42px' : '48px',
                width: 'auto',
                maxWidth: '230px',
                objectFit: 'contain',
                display: 'block',
                transition: 'height 0.22s ease'
              }}
            />
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
                        fontSize: '0.94rem',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? 'var(--brand-red-solid)' : 'var(--text-dark)',
                        padding: '0.4rem 0',
                        borderBottom: isActive ? '2.5px solid var(--brand-red-top)' : '2.5px solid transparent',
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
              className="btn btn-red btn-sm"
              style={{
                padding: '0.55rem 1.05rem',
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

      {/* Gaveta de Navegação Mobile com Logomarca Completa */}
      <aside className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.25rem',
            paddingBottom: '1.15rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ flex: 1, pr: '0.5rem' }}>
            <img
              src="/logo-full.png"
              alt="Anderson Kunicki — Corretor de Imóveis CRECI-SC 60173 F"
              style={{
                height: '86px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            {currentUser && (
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-body)',
                  marginTop: '0.55rem',
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
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  backgroundColor: isActive ? '#FFF5F5' : 'transparent',
                  color: isActive ? 'var(--brand-red-solid)' : 'var(--text-dark)',
                  borderLeft: isActive ? '3px solid var(--brand-red-top)' : '3px solid transparent'
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
            className="btn btn-red"
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
