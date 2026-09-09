import React from 'react';
import { Search, MapPin, Building2, DollarSign, CheckCircle, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../../config';

export default function Hero({ filters, setFilters, onSearch }) {
  const handlePurposeChange = (purpose) => {
    setFilters(prev => ({ ...prev, purpose }));
  };

  return (
    <section style={{
      position: 'relative',
      background: `linear-gradient(rgba(11, 25, 44, 0.78), rgba(11, 25, 44, 0.86)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85') center/cover no-repeat`,
      padding: '4.5rem 0 6rem',
      color: '#FFFFFF'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Badges de Credibilidade Discreta e Responsiva */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '0.4rem 0.65rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          padding: '0.45rem 1.1rem',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: '#E2E8F0',
          marginBottom: '1.5rem',
          maxWidth: '100%'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} style={{ color: '#60A5FA' }} />
            {SITE_CONFIG.brokerName}
          </span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ color: '#F1F5F9', fontWeight: 700 }}>{SITE_CONFIG.creci}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Itaiópolis / SC</span>
        </div>

        {/* Título Principal Humano e Direto */}
        <h1 style={{
          fontSize: 'clamp(1.85rem, 4.5vw, 3.4rem)',
          color: '#FFFFFF',
          marginBottom: '1rem',
          letterSpacing: '-0.025em',
          fontWeight: 800,
          lineHeight: 1.2
        }}>
          Encontre seu próximo imóvel em Itaiópolis e região
        </h1>
        
        <p style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: '#CBD5E1',
          marginBottom: '2.5rem',
          fontWeight: 400,
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 2.5rem'
        }}>
          Casas, terrenos, sítios e chácaras com assessoria jurídica completa, transparência e negociação direta.
        </p>

        {/* Caixa de Busca Integrada e Limpa (Estilo Boutique) */}
        <div className="hero-search-box" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.35)',
          textAlign: 'left',
          color: '#0F172A'
        }}>
          
          {/* Abas Comprar / Alugar */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
            {[
              { id: 'todos', label: 'Todos os Imóveis' },
              { id: 'venda', label: 'Comprar' },
              { id: 'aluguel', label: 'Alugar' }
            ].map(tab => {
              const isActive = filters.purpose === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handlePurposeChange(tab.id)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    backgroundColor: isActive ? '#0B192C' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: '1px solid ' + (isActive ? '#0B192C' : '#E2E8F0'),
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Campos de Filtro em Linha */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem', letterSpacing: '0.03em' }}>
                <MapPin size={13} style={{ color: '#0B192C' }} /> Bairro ou Palavra-chave
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ex: Centro, Lucena, Moema..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem', letterSpacing: '0.03em' }}>
                <Building2 size={13} style={{ color: '#0B192C' }} /> Tipo de Imóvel
              </label>
              <select 
                className="input-field"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', fontSize: '0.9rem', fontWeight: 500 }}
              >
                <option value="todos">Todos os Tipos</option>
                <option value="casa">Casas</option>
                <option value="terreno">Terrenos e Lotes</option>
                <option value="sitio">Sítios e Chácaras</option>
                <option value="apartamento">Apartamentos</option>
                <option value="comercial">Salas Comerciais</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem', letterSpacing: '0.03em' }}>
                <DollarSign size={13} style={{ color: '#0B192C' }} /> Preço Máximo
              </label>
              <select 
                className="input-field"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0', fontSize: '0.9rem', fontWeight: 500 }}
              >
                <option value="Infinity">Qualquer Valor</option>
                <option value="150000">Até R$ 150.000</option>
                <option value="300000">Até R$ 300.000</option>
                <option value="500000">Até R$ 500.000</option>
                <option value="800000">Até R$ 800.000</option>
                <option value="1200000">Até R$ 1.200.000</option>
              </select>
            </div>

            <div>
              <button 
                type="button" 
                onClick={onSearch}
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#0B192C',
                  color: '#FFFFFF',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(11, 25, 44, 0.25)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B192C'}
              >
                <Search size={16} /> Buscar Imóveis
              </button>
            </div>
          </div>
        </div>

        {/* Faixa de diferenciais autênticos logo abaixo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: '#E2E8F0'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            <CheckCircle size={15} style={{ color: '#4ADE80' }} /> Segurança Jurídica e Documental
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            <CheckCircle size={15} style={{ color: '#4ADE80' }} /> Avaliação Justa de Mercado
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            <CheckCircle size={15} style={{ color: '#4ADE80' }} /> Atendimento Direto e Transparente
          </span>
        </div>

      </div>
    </section>
  );
}
