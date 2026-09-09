import React from 'react';
import { RotateCcw, ArrowUpDown } from 'lucide-react';

export default function PropertyFilters({ filters, setFilters, totalCount, onReset }) {
  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'casa', label: 'Casas' },
    { id: 'terreno', label: 'Terrenos' },
    { id: 'sitio', label: 'Sítios & Chácaras' },
    { id: 'apartamento', label: 'Apartamentos' }
  ];

  const hasActiveFilters = filters.keyword || filters.purpose !== 'todos' || filters.type !== 'todos' || filters.maxPrice !== 'Infinity';

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '1.25rem 1.5rem',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Category Pills Rápidas */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map(cat => {
          const isActive = filters.type === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, type: cat.id }))}
              style={{
                padding: '0.4rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: isActive ? '#0B192C' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#334155',
                border: '1px solid ' + (isActive ? '#0B192C' : '#E2E8F0'),
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Contador e Ordenação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          fontSize: '0.85rem',
          color: '#64748B',
          fontWeight: 600
        }}>
          <strong style={{ color: '#0F172A' }}>{totalCount}</strong> {totalCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </div>

        {/* Ordenar por */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ArrowUpDown size={13} style={{ color: '#64748B' }} />
          <select 
            className="input-field"
            value={filters.sortBy || 'recente'}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.82rem',
              borderRadius: '6px',
              backgroundColor: '#F8FAFC',
              borderColor: '#E2E8F0',
              fontWeight: 600,
              color: '#334155'
            }}
          >
            <option value="recente">Mais Recentes</option>
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-preco">Maior Preço</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={onReset} 
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', fontWeight: 600, color: '#64748B' }}
            title="Limpar filtros"
          >
            <RotateCcw size={12} /> Limpar
          </button>
        )}
      </div>
    </div>
  );
}
