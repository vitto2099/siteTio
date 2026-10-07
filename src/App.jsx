import React, { useState, useEffect, useMemo } from 'react';
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

import { Building } from 'lucide-react';
import WhatsAppIcon from './components/common/WhatsAppIcon';
import { getWhatsAppUrl } from './config';

function getTabFromLocation() {
  const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.replace('#', '').toLowerCase();

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

  const { toastMessage, showToast } = useToast();
  const { currentUser, login, logout, updateUserPassword } = useAuth(showToast);
  const {
    properties,
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

  // Prioriza os imóveis em destaque na ordenação padrão ("Mais relevantes") sem duplicar seções
  const catalogProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (!filters.sortBy || filters.sortBy === 'recente') {
      list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return list;
  }, [filteredProperties, filters.sortBy]);

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
      const refCode = property.code || property.id;
      document.title = `${property.title} (Ref. ${refCode}) | Anderson Kunicki`;
      const url = new URL(window.location.href);
      if (url.searchParams.get('imovel') !== String(refCode)) {
        url.searchParams.set('imovel', refCode);
        window.history.pushState({ tab: currentTab, imovel: refCode }, '', url.toString());
      }
    }
  };

  const handleClosePropertyModal = () => {
    setSelectedPropertyModal(null);
    document.title = 'Anderson Kunicki | Corretor de Imóveis em Itaiópolis - SC (CRECI 60173F)';
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

      const searchParams = new URLSearchParams(window.location.search);
      const imovelParam = searchParams.get('imovel');
      const hashParam = window.location.hash.replace('#imovel-', '').replace('#', '');
      const targetParam =
        imovelParam ||
        (hashParam &&
        hashParam.length >= 3 &&
        !['home', 'sobre', 'contato', 'admin', 'privacidade', 'lgpd', 'termos'].includes(hashParam)
          ? hashParam
          : null);

      if (targetParam && properties.length > 0) {
        const found = properties.find(
          (p) =>
            (p.code && p.code.toLowerCase() === targetParam.toLowerCase()) ||
            (p.id && p.id.toLowerCase() === targetParam.toLowerCase())
        );
        if (found) {
          setSelectedPropertyModal(found);
          document.title = `${found.title} (Ref. ${found.code || found.id}) | Anderson Kunicki`;
        }
      } else {
        setSelectedPropertyModal(null);
        document.title = 'Anderson Kunicki | Corretor de Imóveis em Itaiópolis - SC (CRECI 60173F)';
      }
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-main)'
      }}
    >
      <Toast message={toastMessage} />

      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAdminModal={() => {
          setEditingProperty(null);
          setIsFormModalOpen(true);
        }}
        currentUser={currentUser}
      />

      <main style={{ flex: 1 }}>
        {currentTab === 'home' && (
          <>
            <Hero
              filters={filters}
              setFilters={setFilters}
              onSearch={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Seção Única e Unificada do Catálogo de Imóveis */}
            <section id="catalog-section" style={{ padding: '3rem 0 5rem' }}>
              <div className="container">
                <div
                  style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--accent-red)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}
                    >
                      Acervo Imobiliário
                    </span>
                    <h2
                      style={{
                        fontSize: 'clamp(1.5rem, 2.8vw, 1.9rem)',
                        margin: 0,
                        color: 'var(--text-dark)',
                        fontWeight: 700
                      }}
                    >
                      Imóveis Disponíveis
                    </h2>
                  </div>
                </div>

                <PropertyFilters
                  filters={filters}
                  setFilters={setFilters}
                  totalCount={catalogProperties.length}
                  onReset={resetFilters}
                />

                {catalogProperties.length > 0 ? (
                  <div className="grid-properties">
                    {catalogProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        onSelectProperty={(p) => handleOpenPropertyModal(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '4rem 1.5rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      marginTop: '1rem'
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <Building size={24} />
                    </div>
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        marginBottom: '0.4rem',
                        color: 'var(--text-dark)'
                      }}
                    >
                      Nenhum imóvel encontrado para esta busca
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.92rem',
                        maxWidth: '420px',
                        margin: '0 auto 1.5rem'
                      }}
                    >
                      Experimente remover alguns filtros ou fale diretamente com Anderson Kunicki para consultar novas captações.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}
                    >
                      <button type="button" className="btn btn-outline btn-sm" onClick={resetFilters}>
                        Limpar filtros
                      </button>
                      <a
                        href={getWhatsAppUrl(
                          'Olá Anderson! Gostaria de consultar opções de imóveis em Itaiópolis.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp btn-sm"
                      >
                        <WhatsAppIcon size={15} color="#FFFFFF" />
                        <span>Consultar pelo WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {currentTab === 'about' && <AboutContact />}

        {currentTab === 'privacy' && (
          <PrivacyPage onBackToCatalog={() => setCurrentTab('home')} />
        )}

        {currentTab === 'admin' &&
          (currentUser ? (
            <AdminDashboard
              properties={properties}
              onOpenAddModal={() => {
                setEditingProperty(null);
                setIsFormModalOpen(true);
              }}
              onEditProperty={(prop) => {
                setEditingProperty(prop);
                setIsFormModalOpen(true);
              }}
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
          ))}
      </main>

      {selectedPropertyModal && (
        <PropertyModal
          property={selectedPropertyModal}
          onClose={handleClosePropertyModal}
        />
      )}

      {isFormModalOpen && (
        <PropertyFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingProperty(null);
          }}
          onSave={handleSavePropertyForm}
          editingProperty={editingProperty}
          properties={properties}
        />
      )}

      <WhatsAppWidget />
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}
