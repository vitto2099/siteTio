import React from 'react';
import { Search, ShieldCheck, Star, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export default function Hero({ filters, setFilters, onSearch }) {
  return (
    <section style={{
      position: 'relative',
      background: 'linear-gradient(145deg, #050E1A 0%, #071527 50%, #0B2240 100%)',
      padding: '5rem 0 7rem',
      color: '#FFFFFF',
      overflow: 'hidden'
    }}>
      {/* Decorative Luxury Background Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(18, 59, 107, 0.45) 0%, rgba(7, 21, 39, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(200, 29, 37, 0.22) 0%, rgba(7, 21, 39, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      {/* Decorative Subtle Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '960px' }}>
        
        {/* Floating Trust Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          padding: '0.45rem 1.35rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.75rem',
          color: '#F8FAFC',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          animation: 'fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <ShieldCheck size={15} style={{ color: 'var(--gold-primary)' }} />
          <span>Consultoria Imobiliária em Itaiópolis e Região</span>
          <span style={{ backgroundColor: 'var(--gold-primary)', color: '#071527', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
            CRECI-SC 60173 F
          </span>
        </div>

        {/* Main H1 Title */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
          color: '#FFFFFF',
          marginBottom: '1.25rem',
          letterSpacing: '-0.035em',
          fontWeight: 900,
          lineHeight: 1.15
        }}>
          Compre, Venda ou Alugue seu Imóvel com <br />
          <span style={{
            background: 'linear-gradient(135deg, #FFFFFF 30%, #93C5FD 70%, #60A5FA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Total Segurança Jurídica
          </span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: '#CBD5E1',
          marginBottom: '2.5rem',
          fontWeight: 400,
          lineHeight: 1.6,
          maxWidth: '720px',
          margin: '0 auto 2.5rem'
        }}>
          Casas, terrenos, sítios e apartamentos selecionados. Avaliação mercadológica precisa e assessoria completa em financiamentos bancários.
        </p>

        {/* Trust Badges Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem',
          fontSize: '0.875rem',
          color: '#E2E8F0'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> Análise Completa de Documentação
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> Correspondente Caixa Econômica
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} style={{ color: '#22C55E' }} /> Negociação Direta e Transparente
          </span>
        </div>

        {/* Luxury Search Floating Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.4)',
          textAlign: 'left',
          color: 'var(--text-dark)'
        }}>
          
          {/* Quick Purpose Selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            {[
              { id: 'todos', label: 'Todos os Imóveis' },
              { id: 'venda', label: 'Comprar' },
              { id: 'aluguel', label: 'Alugar' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, purpose: tab.id }))}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-xs)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: filters.purpose === tab.id ? 'var(--primary-dark)' : 'transparent',
                  color: filters.purpose === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                  transition: 'var(--transition)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-navy)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.04em' }}>
                Localização ou Palavra
              </label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ex: Centro, Lucena, Suíte..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-subtle)', fontWeight: 500 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-navy)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.04em' }}>
                Tipo de Imóvel
              </label>
              <select 
                className="input-field"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
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
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-navy)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', letterSpacing: '0.04em' }}>
                Faixa de Preço
              </label>
              <select 
                className="input-field"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
              >
                <option value="Infinity">Qualquer Valor</option>
                <option value="200000">Até R$ 200.000</option>
                <option value="400000">Até R$ 400.000</option>
                <option value="600000">Até R$ 600.000</option>
                <option value="1000000">Até R$ 1.000.000</option>
                <option value="2000000">Até R$ 2.000.000</option>
              </select>
            </div>

            <div>
              <button 
                className="btn btn-red" 
                onClick={onSearch}
                style={{ width: '100%', height: '48px', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.02em' }}
              >
                <Search size={20} /> Buscar Imóveis
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
