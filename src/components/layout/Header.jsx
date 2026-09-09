import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Facebook, Instagram, Shield, PlusCircle, Menu, X, User, Home } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function Header({ currentTab, setCurrentTab, onOpenAdminModal, currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled(prev => {
            if (!prev && currentY > 50) return true;
            if (prev && currentY < 15) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waUrl = getWhatsAppUrl("Olá Anderson! Gostaria de informações sobre os imóveis disponíveis.");

  // For ordinary public visitors, only show public sections.
  // Show Admin link only if admin is logged in or already viewing the /admin route.
  const baseNavItems = [
    { id: 'home', label: 'Página Inicial', path: '/', icon: Home },
    { id: 'about', label: 'Sobre & Contato', path: '/sobre' }
  ];

  const navItems = (currentTab === 'admin' || currentUser)
    ? [...baseNavItems, { id: 'admin', label: currentUser ? `Painel Admin` : 'Painel Admin', path: '/admin', isSpecial: true }]
    : baseNavItems;

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: isScrolled ? '0 4px 20px rgba(7, 21, 39, 0.08)' : 'var(--shadow-xs)',
        transition: 'box-shadow 0.25s ease'
      }}>
        {/* Top bar info (se esconde suavemente ao rolar sem quebras) */}
        <div className={`header-top-bar ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 1, minWidth: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                <MapPin size={12} style={{ color: 'var(--accent-red)' }} /> {SITE_CONFIG.address} - {SITE_CONFIG.cityState}
              </span>
              <span className="header-top-bar-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                <Mail size={12} style={{ color: 'var(--accent-red)' }} /> {SITE_CONFIG.email}
              </span>
            </div>
            <div className="header-top-bar-secondary" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
              <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#F9A8D4', textDecoration: 'none' }}>
                <Instagram size={12} /> {SITE_CONFIG.instagramHandle || '@kunickianderson'}
              </a>
              <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#93C5FD', textDecoration: 'none' }}>
                <Facebook size={12} /> /anderson.kunicki.9
              </a>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{SITE_CONFIG.creci}</span>
            </div>
          </div>
        </div>

        {/* Main navigation bar (3 colunas: Marca à esquerda, Menu centralizado, Ações à direita) */}
        <div className="container header-main-nav" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: isScrolled ? '0.55rem 1.5rem' : '0.85rem 1.5rem', 
          gap: '1rem' 
        }}>
          {/* Coluna Esquerda: Logo & Marca */}
          <div className="header-col-left">
            <a href="/" onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img 
                src="/favicon.svg" 
                alt="Anderson Kunicki Corretor Imobiliário" 
                style={{ 
                  height: isScrolled ? '38px' : '42px', 
                  width: isScrolled ? '38px' : '42px', 
                  borderRadius: '10px', 
                  objectFit: 'cover',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(7, 21, 39, 0.15)',
                  transition: 'height 0.2s ease, width 0.2s ease'
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div className="header-brand-title" style={{ fontSize: isScrolled ? '1.15rem' : '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap', transition: 'font-size 0.2s ease' }}>
                  Anderson <span style={{ color: 'var(--accent-red)' }}>Kunicki</span>
                </div>
                <div className="header-brand-creci" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  Corretor Imobiliário • {SITE_CONFIG.creci}
                </div>
              </div>
            </a>
          </div>

          {/* Coluna Central: Menu de Navegação Centralizado */}
          <nav className="desktop-nav header-col-center">
            <ul style={{ display: 'flex', gap: '1.75rem', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              {navItems.map(item => {
                const isActive = currentTab === item.id;
                return (
                  <li key={item.id} style={{ margin: 0, padding: 0 }}>
                    <a 
                      href={item.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentTab(item.id);
                      }}
                      style={{ 
                        fontWeight: item.isSpecial ? 700 : (isActive ? 700 : 500), 
                        color: isActive 
                          ? 'var(--accent-red)' 
                          : (item.isSpecial ? 'var(--primary-blue)' : 'var(--text-body)'), 
                        fontSize: '0.95rem', 
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: item.isSpecial && isActive ? 'var(--accent-red-subtle)' : 'transparent',
                        padding: item.isSpecial ? '0.4rem 0.85rem' : '0.4rem 0.2rem',
                        borderRadius: 'var(--radius-sm)',
                        borderBottom: !item.isSpecial && isActive ? '2px solid var(--accent-red)' : '2px solid transparent',
                        transition: 'var(--transition)'
                      }}
                    >
                      {item.icon && <item.icon size={15} />}
                      {item.isSpecial && <Shield size={15} />}
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Coluna Direita: Botões de Ação */}
          <div className="header-col-right">
            {currentTab === 'admin' && currentUser && (
              <button className="btn btn-red btn-sm" onClick={onOpenAdminModal} style={{ fontWeight: 700 }}>
                <PlusCircle size={15} /> <span className="header-wa-text">Novo Imóvel</span>
              </button>
            )}

            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm header-wa-btn" style={{ fontWeight: 700 }}>
              <WhatsAppIcon size={16} color="#FFFFFF" /> <span className="header-wa-text">WhatsApp</span>
            </a>

            {/* Mobile Menu Hamburger Button */}
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--primary-dark)',
                border: '1px solid var(--border-subtle)',
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Abrir Menu Mobile"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer Navigation Sidebar */}
      <aside className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              Anderson <span style={{ color: 'var(--accent-red)' }}>Kunicki</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{SITE_CONFIG.creci}</div>
            {currentUser && (
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 700, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={12} /> Conectado: <strong>{currentUser}</strong>
              </div>
            )}
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ border: 0, backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  backgroundColor: isActive ? 'var(--accent-red)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--primary-dark)',
                  transition: 'var(--transition)'
                }}
              >
                {item.icon && <item.icon size={18} />}
                {item.isSpecial && <Shield size={18} />}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Rodapé do Menu Mobile com Contato Direto */}
        <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ justifyContent: 'center', fontWeight: 700, padding: '0.7rem' }}
          >
            <WhatsAppIcon size={17} color="#FFFFFF" /> Falar no WhatsApp
          </a>

          <a 
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="btn btn-outline btn-sm"
            style={{ justifyContent: 'center', fontWeight: 600, padding: '0.65rem', borderColor: '#CBD5E1' }}
          >
            Ligar: {SITE_CONFIG.phoneFormatted}
          </a>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem', lineHeight: 1.4 }}>
            <div>{SITE_CONFIG.address}</div>
            <div style={{ fontWeight: 700, marginTop: '0.2rem', color: 'var(--primary-dark)' }}>{SITE_CONFIG.creci}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
