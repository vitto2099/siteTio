import React from 'react';
import { Search, RotateCcw, ArrowUpDown, Building2, DollarSign } from 'lucide-react';

export default function PropertyFilters({ filters, setFilters, totalCount, onReset }) {
  const purposes = [
    { id: 'todos', label: 'Todos' },
    { id: 'venda', label: 'Comprar' },
    { id: 'aluguel', label: 'Alugar' }
  ];

  const hasActiveFilters =
    Boolean(filters.keyword) ||
    filters.purpose !== 'todos' ||
    filters.type !== 'todos' ||
    filters.maxPrice !== 'Infinity' ||
    (filters.sortBy && filters.sortBy !== 'recente');

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}
    >
      {/* Linha Superior: Finalidade + Contagem e Limpar Filtros */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          paddingBottom: '1rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        {/* Seletor Rápido de Finalidade */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-main)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            gap: '0.25rem'
          }}
          role="tablist"
          aria-label="Finalidade do imóvel"
        >
          {purposes.map((item) => {
            const isActive = filters.purpose === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilters((prev) => ({ ...prev, purpose: item.id }))}
                style={{
                  padding: '0.42rem 1rem',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? 'var(--primary-dark)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-body)',
                  transition: 'var(--transition-fast)'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Contagem de Imóveis e Botão Limpar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            <strong style={{ color: 'var(--text-dark)', fontWeight: 700 }}>{totalCount}</strong>{' '}
            {totalCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.7rem',
                color: 'var(--accent-red)',
                borderColor: 'var(--border-medium)'
              }}
            >
              <RotateCcw size={13} />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Linha Inferior: Busca por Bairro/Código, Tipo, Preço Máximo e Ordenação */}
      <div className="filters-bar-grid">
        {/* Busca por palavra-chave */}
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Buscar por bairro, rua, título ou código (ex: CA-101)..."
            value={filters.keyword}
            onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            aria-label="Buscar por bairro, rua, título ou código"
            style={{
              paddingLeft: '2.35rem',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.88rem'
            }}
          />
        </div>

        {/* Seletor de Tipo */}
        <div style={{ position: 'relative' }}>
          <Building2
            size={15}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <select
            className="input-field"
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
            aria-label="Tipo de imóvel"
            style={{
              paddingLeft: '2.35rem',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <option value="todos">Todos os tipos</option>
            <option value="casa">Casas</option>
            <option value="terreno">Terrenos</option>
            <option value="sitio">Sítios e Chácaras</option>
            <option value="apartamento">Apartamentos</option>
            <option value="comercial">Comercial</option>
          </select>
        </div>

        {/* Seletor de Preço Máximo */}
        <div style={{ position: 'relative' }}>
          <DollarSign
            size={15}
            style={{
              position: 'absolute',
              left: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <select
            className="input-field"
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            aria-label="Preço máximo"
            style={{
              paddingLeft: '2.2rem',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <option value="Infinity">Qualquer valor</option>
            <option value="150000">Até R$ 150.000</option>
            <option value="300000">Até R$ 300.000</option>
            <option value="500000">Até R$ 500.000</option>
            <option value="800000">Até R$ 800.000</option>
            <option value="1200000">Até R$ 1.200.000</option>
            <option value="2000000">Até R$ 2.000.000</option>
          </select>
        </div>

        {/* Ordenação */}
        <div style={{ position: 'relative' }}>
          <ArrowUpDown
            size={15}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <select
            className="input-field"
            value={filters.sortBy || 'recente'}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
            aria-label="Ordenar imóveis"
            style={{
              paddingLeft: '2.35rem',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.88rem',
              fontWeight: 500
            }}
          >
            <option value="recente">Mais relevantes</option>
            <option value="preco-asc">Menor valor</option>
            <option value="preco-desc">Maior valor</option>
          </select>
        </div>
      </div>
    </div>
  );
}
