import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppWidget from './components/layout/WhatsAppWidget';
import Toast from './components/common/Toast';

import Hero from './components/sections/Hero';
import AboutContact from './components/sections/AboutContact';
import PrivacyPage from './components/sections/PrivacyPage';

import PropertyCard from './components/property/PropertyCard';
import PropertyFilters from './components/property/PropertyFilters';
import PropertyModal from './components/property/PropertyModal';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import PropertyFormModal from './components/admin/PropertyFormModal';

import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { useProperties } from './hooks/useProperties';

import { Building, PlusCircle } from 'lucide-react';
import WhatsAppIcon from './components/common/WhatsAppIcon';
import { getWhatsAppUrl } from './config';

function getTabFromLocation() {
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace('#', '').toLowerCase();

  // Check pathname first, then fallback to hash for backward compatibility
  const route = path || hash;

  if (route === 'admin') return 'admin';
  if (route === 'sobre' || route === 'contato') return 'about';
  if (route === 'privacidade' || route === 'lgpd' || route === 'termos') return 'privacy';
  return 'home';
}

export default function App() {
  const [currentTab, setCurrentTabState] = useState(() => getTabFromLocation());
  const [selectedPropertyModal, setSelectedPropertyModal] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  // Custom Hooks
  const { toastMessage, showToast } = useToast();
  const { currentUser, login, logout, updateUserPassword } = useAuth(showToast);
  const {
    properties,
    featuredProperties,
    filteredProperties,
    filters,
    setFilters,
    resetFilters,
    saveProperty,
    deleteProperty,
    toggleFeatured,
    duplicateProperty,
    toggleStatus,
    bulkDelete,
    bulkStatusChange,
    exportBackupJSON,
    importBackupJSON
  } = useProperties(showToast);

  // Sync tab with Clean Path (HTML5 History API) & Scroll to Top
  const setCurrentTab = (tabName, replace = false) => {
    setCurrentTabState(tabName);
    const pathMap = {
      home: '/',
      about: '/sobre',
      privacy: '/privacidade',
      admin: '/admin'
    };
    const targetPath = pathMap[tabName] || '/';

    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab: tabName }, '', targetPath);
      } else {
        window.history.pushState({ tab: tabName }, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPropertyModal = (property) => {
    setSelectedPropertyModal(property);
    if (property) {
      const url = new URL(window.location.href);
      url.searchParams.set('imovel', property.code || property.id);
      window.history.replaceState({ tab: currentTab }, '', url.toString());
    }
  };

  const handleClosePropertyModal = () => {
    setSelectedPropertyModal(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('imovel')) {
      url.searchParams.delete('imovel');
      window.history.replaceState({ tab: currentTab }, '', url.toString());
    }
  };

  useEffect(() => {
    const handleNavigation = () => {
      const tab = getTabFromLocation();
      setCurrentTabState(tab);
      
      // Checar se há imóvel especificado no parâmetro da URL
      const searchParams = new URLSearchParams(window.location.search);
      const imovelParam = searchParams.get('imovel');
      const hashParam = window.location.hash.replace('#imovel-', '').replace('#', '');
      const targetParam = imovelParam || (hashParam && hashParam.length >= 3 && !['home', 'sobre', 'contato', 'admin', 'privacidade', 'lgpd', 'termos'].includes(hashParam) ? hashParam : null);

      if (targetParam && properties.length > 0) {
        const found = properties.find(p => 
          (p.code && p.code.toLowerCase() === targetParam.toLowerCase()) || 
          (p.id && p.id.toLowerCase() === targetParam.toLowerCase())
        );
        if (found) {
          setSelectedPropertyModal(found);
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

    // Initial check on load
    handleNavigation();

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, [properties]);

  const handleSavePropertyForm = (formData, editId) => {
    saveProperty(formData, editId);
    setIsFormModalOpen(false);
    setEditingProperty(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      
      {/* Dynamic Floating Toast Alerts */}
      <Toast message={toastMessage} />

      {/* Main Header & Navigation */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenAdminModal={() => { setEditingProperty(null); setIsFormModalOpen(true); }} 
        currentUser={currentUser}
      />

      {/* Dynamic Views */}
      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero 
              filters={filters} 
              setFilters={setFilters} 
              onSearch={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* Featured Properties Section */}
            {featuredProperties.length > 0 && (
              <section style={{ padding: '3.5rem 0 2rem', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="container">
                  <div style={{ marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Oportunidades em Destaque
                    </span>
                    <h2 style={{ fontSize: '1.85rem', margin: '0.2rem 0', color: 'var(--primary-dark)', fontWeight: 800 }}>
                      Seleção de Imóveis
                    </h2>
                  </div>

                  <div className="grid-properties">
                    {featuredProperties.slice(0, 3).map(prop => (
                      <PropertyCard 
                        key={prop.id} 
                        property={prop} 
                        onSelectProperty={(p) => handleOpenPropertyModal(p)} 
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Full Property Catalog Section */}
            <section id="catalog-section" style={{ padding: '3.5rem 0 5rem' }}>
              <div className="container">
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Vitrine de Imóveis
                    </span>
                    <h2 style={{ fontSize: '2rem', margin: '0.2rem 0 0', color: 'var(--primary-dark)', fontWeight: 900 }}>
                      Catálogo Completo
                    </h2>
                  </div>
                </div>

                {/* Filter Controls */}
                <PropertyFilters 
                  filters={filters} 
                  setFilters={setFilters} 
                  totalCount={filteredProperties.length}
                  onReset={resetFilters}
                />

                {/* Properties Grid Display */}
                {filteredProperties.length > 0 ? (
                  <div className="grid-properties">
                    {filteredProperties.map(prop => (
                      <PropertyCard 
                        key={prop.id} 
                        property={prop} 
                        onSelectProperty={(p) => handleOpenPropertyModal(p)} 
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--border-medium)',
                    marginTop: '2rem'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      color: 'var(--text-muted)'
                    }}>
                      <Building size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                      Nenhum imóvel encontrado
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                      Não encontramos nenhum imóvel com os filtros selecionados no momento. Tente limpar os filtros ou fale com nosso corretor.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn btn-navy btn-sm" onClick={resetFilters}>
                        Limpar Todos os Filtros
                      </button>
                      <a 
                        href={getWhatsAppUrl("Olá Anderson! Gostaria de consultar opções de imóveis sob encomenda.")} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-whatsapp btn-sm"
                      >
                        <WhatsAppIcon size={16} color="#FFFFFF" /> Consultar no WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {currentTab === 'about' && (
          <AboutContact />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPage onBackToCatalog={() => setCurrentTab('home')} />
        )}

        {currentTab === 'admin' && (
          currentUser ? (
            <AdminDashboard 
              properties={properties}
              onOpenAddModal={() => { setEditingProperty(null); setIsFormModalOpen(true); }}
              onEditProperty={(prop) => { setEditingProperty(prop); setIsFormModalOpen(true); }}
              onDeleteProperty={deleteProperty}
              onDuplicateProperty={duplicateProperty}
              onToggleFeatured={toggleFeatured}
              onToggleStatus={toggleStatus}
              onBulkDelete={bulkDelete}
              onBulkStatusChange={bulkStatusChange}
              onExportBackup={exportBackupJSON}
              onImportBackup={importBackupJSON}
              onSelectProperty={(p) => handleOpenPropertyModal(p)}
              currentUser={currentUser}
              onLogout={logout}
              onUpdatePassword={updateUserPassword}
              onGoHome={() => setCurrentTab('home')}
              onToast={showToast}
            />
          ) : (
            <AdminLogin onLogin={login} />
          )
        )}
      </main>

      {/* Modals */}
      {selectedPropertyModal && (
        <PropertyModal 
          property={selectedPropertyModal} 
          onClose={handleClosePropertyModal} 
        />
      )}

      {isFormModalOpen && (
        <PropertyFormModal 
          isOpen={isFormModalOpen}
          onClose={() => { setIsFormModalOpen(false); setEditingProperty(null); }}
          onSave={handleSavePropertyForm}
          editingProperty={editingProperty}
        />
      )}

      <WhatsAppWidget />
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}
