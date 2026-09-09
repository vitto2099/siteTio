import React from 'react';
import { RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function PropertyFilters({ filters, setFilters, totalCount, onReset }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      padding: '1.5rem 1.75rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      marginBottom: '2.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
        
        {/* Purpose Luxury Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'todos', label: 'Todos os Imóveis' },
            { id: 'venda', label: 'À Venda' },
            { id: 'aluguel', label: 'Para Alugar' }
          ].map(pill => {
            const isActive = filters.purpose === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilters(prev => ({ ...prev, purpose: pill.id }))}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  backgroundColor: isActive ? 'var(--primary-dark)' : 'var(--bg-subtle)',
                  color: isActive ? '#FFFFFF' : 'var(--text-body)',
                  border: '1px solid ' + (isActive ? 'var(--primary-dark)' : 'var(--border-subtle)'),
                  boxShadow: isActive ? '0 4px 12px rgba(7, 21, 39, 0.2)' : 'none',
                  transition: 'var(--transition)'
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Counter & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-blue)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 800
          }}>
            {totalCount} {totalCount === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
          </div>
          
          <button 
            onClick={onReset} 
            className="btn btn-outline btn-sm"
            title="Limpar todos os filtros de busca"
            style={{ fontWeight: 700 }}
          >
            <RotateCcw size={13} /> Limpar Filtros
          </button>
        </div>
      </div>

      {/* Extended Filters row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block', letterSpacing: '0.04em' }}>
            Tipo de Imóvel
          </label>
          <select 
            className="input-field" 
            style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
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
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block', letterSpacing: '0.04em' }}>
            Dormitórios
          </label>
          <select 
            className="input-field" 
            style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
            value={filters.bedrooms}
            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
          >
            <option value="todos">Qualquer quantidade</option>
            <option value="1">1+ Quartos</option>
            <option value="2">2+ Quartos</option>
            <option value="3">3+ Quartos</option>
            <option value="4">4+ Quartos</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block', letterSpacing: '0.04em' }}>
            Preço Máximo
          </label>
          <select 
            className="input-field" 
            style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          >
            <option value="Infinity">Sem limite de preço</option>
            <option value="200000">Até R$ 200.000</option>
            <option value="400000">Até R$ 400.000</option>
            <option value="600000">Até R$ 600.000</option>
            <option value="1000000">Até R$ 1.000.000</option>
            <option value="2000000">Até R$ 2.000.000</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block', letterSpacing: '0.04em' }}>
            Palavra-chave
          </label>
          <input 
            type="text"
            className="input-field"
            placeholder="Ex: Suíte, Piscina, Centro..."
            style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', fontWeight: 500 }}
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block', letterSpacing: '0.04em' }}>
            Ordenar por
          </label>
          <select
            className="input-field"
            style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem', backgroundColor: 'var(--bg-subtle)', fontWeight: 600 }}
            value={filters.sortBy || 'recente'}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="recente">Mais recentes</option>
            <option value="preco-asc">Menor preço primeiro</option>
            <option value="preco-desc">Maior preço primeiro</option>
          </select>
        </div>
      </div>
    </div>
  );
}
