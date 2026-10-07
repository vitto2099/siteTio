import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Eye, LogOut, 
  Download, Upload, Link as LinkIcon, KeyRound, 
  ExternalLink, Star, Building, Check, X, Copy
} from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import ChangePasswordModal from './ChangePasswordModal';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80';

const TYPE_LABELS = {
  casa: 'Casa',
  terreno: 'Terreno',
  sitio: 'Sítio / Chácara',
  apartamento: 'Apartamento',
  comercial: 'Comercial'
};

export default function AdminDashboard({ 
  properties = [], 
  onOpenAddModal, 
  onEditProperty, 
  onDeleteProperty, 
  onDuplicateProperty,
  onToggleFeatured, 
  onToggleStatus,
  onBulkDelete,
  onBulkStatusChange,
  onExportBackup,
  onImportBackup,
  onSelectProperty, 
  currentUser, 
  onLogout,
  onUpdatePassword,
  onGoHome,
  onToast
}) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showBackupMenu, setShowBackupMenu] = useState(false);

  // Indicadores da carteira
  const totalCount = properties.length;
  const availableCount = properties.filter(p => (p.status || 'ativo') === 'ativo').length;
  const featuredCount = properties.filter(p => Boolean(p.featured)).length;
  const totalPortfolioValue = properties
    .filter(p => p.purpose === 'venda' && (p.status || 'ativo') !== 'vendido')
    .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  // Filtro simples e direto
  const filteredProperties = properties.filter(p => {
    const propStatus = p.status || 'ativo';
    if (statusFilter !== 'todos' && propStatus !== statusFilter) return false;
    if (typeFilter !== 'todos' && p.type !== typeFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const codeMatch = (p.code || p.id || '').toLowerCase().includes(term);
    const titleMatch = (p.title || '').toLowerCase().includes(term);
    const neighMatch = (p.neighborhood || '').toLowerCase().includes(term);
    const addressMatch = (p.address || '').toLowerCase().includes(term);

    return codeMatch || titleMatch || neighMatch || addressMatch;
  });

  const hasActiveFilters = Boolean(searchTerm.trim()) || statusFilter !== 'todos' || typeFilter !== 'todos';

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setTypeFilter('todos');
  };

  const handleCopyLink = (prop) => {
    const refCode = prop.code || prop.id;
    const link = `${window.location.origin}/?imovel=${encodeURIComponent(refCode)}`;
    navigator.clipboard.writeText(link);
    if (onToast) {
      onToast(`Link do imóvel ${refCode} copiado.`);
    }
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && onImportBackup) {
      onImportBackup(file);
      e.target.value = null;
      setShowBackupMenu(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'vendido') {
      return { backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' };
    }
    if (status === 'reservado') {
      return { backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' };
    }
    return { backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#BBF7D0' };
  };

  return (
    <section style={{ padding: '2.5rem 0 4.5rem', backgroundColor: 'var(--bg-main)', minHeight: '88vh' }} id="admin-panel">
      <div className="container">
        
        {/* Cabeçalho Limpo e Organizado */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: '1.25rem', 
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <p style={{ 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: 'var(--text-muted)', 
              letterSpacing: '0.04em',
              marginBottom: '0.2rem'
            }}>
              Anderson Kunicki · CRECI-SC 60173 F
            </p>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', margin: 0, fontWeight: 800 }}>
              Painel de Imóveis
            </h2>
          </div>

          {/* Ações do Topo */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              className="btn btn-navy" 
              onClick={onOpenAddModal} 
              style={{ fontWeight: 700, padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
            >
              <Plus size={17} /> Cadastrar Imóvel
            </button>

            {onGoHome && (
              <button 
                className="btn btn-outline btn-sm" 
                onClick={onGoHome} 
                title="Abrir site público"
                style={{ padding: '0.55rem 0.85rem' }}
              >
                <ExternalLink size={14} /> Ver Site
              </button>
            )}

            {/* Menu discreto de Backup */}
            <div style={{ position: 'relative' }}>
              <button 
                type="button"
                className="btn btn-outline btn-sm" 
                onClick={() => setShowBackupMenu(prev => !prev)}
                style={{ padding: '0.55rem 0.85rem' }}
              >
                <Download size={14} /> Backup
              </button>

              {showBackupMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 6px)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.4rem',
                  zIndex: 50,
                  minWidth: '185px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onExportBackup) onExportBackup();
                      setShowBackupMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--primary-dark)',
                      borderRadius: 'var(--radius-xs)',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    <Download size={14} /> Exportar JSON
                  </button>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--primary-dark)',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    width: '100%'
                  }}>
                    <Upload size={14} /> Importar JSON
                    <input type="file" accept=".json" onChange={handleImportFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>

            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setIsChangePasswordOpen(true)} 
              title="Alterar senha de acesso"
              style={{ padding: '0.55rem 0.85rem' }}
            >
              <KeyRound size={14} /> Senha
            </button>

            {onLogout && (
              <button 
                className="btn btn-outline btn-sm" 
                onClick={onLogout} 
                title="Sair do painel"
                style={{ padding: '0.55rem 0.85rem', color: '#991B1B', borderColor: '#FECACA' }}
              >
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>
        </div>

        {/* 4 Cartões de Resumo Minimalistas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Total na Carteira
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>
              {totalCount}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Disponíveis
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#166534', lineHeight: 1.1 }}>
              {availableCount}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Em Destaque
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>
              {featuredCount}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem 1.35rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              Valor Geral (Vendas)
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.2 }}>
              {formatMoney(totalPortfolioValue)}
            </div>
          </div>
        </div>

        {/* Barra de Filtro Enxuta */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '0.9rem 1.15rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            flex: '1 1 260px', 
            backgroundColor: 'var(--bg-subtle)', 
            padding: '0.45rem 0.85rem', 
            borderRadius: 'var(--radius-xs)', 
            border: '1px solid var(--border-subtle)' 
          }}>
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Buscar por código (CA-101), título ou bairro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                width: '100%', 
                fontSize: '0.88rem', 
                color: 'var(--text-dark)',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => setSearchTerm('')} 
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select 
              className="input-field" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', backgroundColor: 'var(--bg-subtle)' }}
            >
              <option value="todos">Status: Todos</option>
              <option value="ativo">Disponíveis</option>
              <option value="reservado">Reservados</option>
              <option value="vendido">Vendidos</option>
            </select>

            <select 
              className="input-field" 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', backgroundColor: 'var(--bg-subtle)' }}
            >
              <option value="todos">Tipo: Todos</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
              <option value="sitio">Sítio / Chácara</option>
              <option value="apartamento">Apartamento</option>
              <option value="comercial">Comercial</option>
            </select>

            {hasActiveFilters && (
              <button 
                type="button" 
                className="btn btn-outline btn-sm" 
                onClick={handleClearFilters}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Lista de Imóveis Intuitiva */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border-subtle)', 
          overflowX: 'auto' 
        }}>
          {filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <Building size={40} style={{ color: '#CBD5E1', marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem' }}>
                {hasActiveFilters ? 'Nenhum imóvel encontrado para este filtro' : 'Nenhum imóvel cadastrado'}
              </div>
              <div style={{ fontSize: '0.86rem', marginBottom: '1.25rem' }}>
                {hasActiveFilters 
                  ? 'Altere os termos da busca ou limpe os filtros para ver todos os imóveis.'
                  : 'Clique no botão abaixo para cadastrar o primeiro imóvel na carteira.'}
              </div>
              {hasActiveFilters ? (
                <button className="btn btn-outline btn-sm" onClick={handleClearFilters}>
                  Mostrar Todos os Imóveis
                </button>
              ) : (
                <button className="btn btn-navy btn-sm" onClick={onOpenAddModal}>
                  <Plus size={15} /> Cadastrar Imóvel
                </button>
              )}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem', minWidth: '720px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Imóvel</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Valor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Vitrine</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(prop => {
                  const refCode = prop.code || prop.id;
                  const coverImg = prop.imageUrl || (prop.images && prop.images[0]) || FALLBACK_IMG;
                  const currentStatus = prop.status || 'ativo';
                  const statusStyle = getStatusStyle(currentStatus);
                  const isConfirmingDelete = confirmDeleteId === prop.id;

                  return (
                    <tr 
                      key={prop.id} 
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      {/* Miniatura + Código + Título + Bairro */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img 
                            src={coverImg} 
                            alt={prop.title} 
                            style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-subtle)' }}
                            onError={(e) => { e.target.src = FALLBACK_IMG; }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem', flexWrap: 'wrap' }}>
                              <span style={{ 
                                fontSize: '0.72rem', 
                                fontWeight: 800, 
                                color: 'var(--primary-dark)', 
                                backgroundColor: 'var(--bg-subtle)', 
                                border: '1px solid var(--border-subtle)',
                                padding: '0.1rem 0.45rem', 
                                borderRadius: '4px' 
                              }}>
                                {refCode}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {TYPE_LABELS[prop.type] || prop.type}
                              </span>
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1.25, fontSize: '0.92rem' }}>
                              {prop.title || 'Imóvel sem título'}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              {prop.neighborhood ? `${prop.neighborhood} · ` : ''}{prop.city || 'Itaiópolis - SC'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Finalidade + Valor */}
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: prop.purpose === 'aluguel' ? '#0369A1' : 'var(--text-muted)', marginBottom: '0.1rem' }}>
                          {prop.purpose === 'aluguel' ? 'Aluguel' : 'Venda'}
                        </div>
                        <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
                          {formatMoney(prop.price)}
                        </div>
                      </td>

                      {/* Status em 1 clique */}
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <select
                          value={currentStatus}
                          onChange={(e) => onToggleStatus(prop.id, e.target.value)}
                          style={{
                            padding: '0.32rem 0.6rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: `1px solid ${statusStyle.borderColor}`,
                            cursor: 'pointer',
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color
                          }}
                        >
                          <option value="ativo">Disponível</option>
                          <option value="reservado">Reservado</option>
                          <option value="vendido">Vendido</option>
                        </select>
                      </td>

                      {/* Destaque em 1 clique */}
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <button 
                          type="button"
                          onClick={() => onToggleFeatured(prop.id)}
                          style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            border: prop.featured ? '1px solid #FDE68A' : '1px solid var(--border-subtle)',
                            backgroundColor: prop.featured ? '#FEF3C7' : '#FFFFFF',
                            color: prop.featured ? '#92400E' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                          title="Alternar exibição nos destaques da página inicial"
                        >
                          <Star size={14} fill={prop.featured ? '#D97706' : 'none'} color={prop.featured ? '#D97706' : '#94A3B8'} />
                          <span>{prop.featured ? 'Destaque' : 'Destacar'}</span>
                        </button>
                      </td>

                      {/* Ações diretas */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {isConfirmingDelete ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => {
                                setConfirmDeleteId(null);
                                onDeleteProperty(prop.id, true);
                              }}
                              style={{ 
                                backgroundColor: '#991B1B', 
                                color: '#FFFFFF', 
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              <Check size={13} /> Confirmar?
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setConfirmDeleteId(null)}
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button 
                              type="button"
                              className="btn btn-navy btn-sm" 
                              onClick={() => onEditProperty(prop)} 
                              title="Editar imóvel"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                            >
                              <Edit size={13} /> Editar
                            </button>

                            <button 
                              type="button"
                              className="btn btn-outline btn-sm" 
                              onClick={() => onSelectProperty(prop)} 
                              title="Ver anúncio"
                              style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                            >
                              <Eye size={13} /> Ver
                            </button>

                            <button 
                              type="button"
                              className="btn btn-outline btn-sm" 
                              onClick={() => handleCopyLink(prop)} 
                              title="Copiar link direto deste imóvel"
                              style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                            >
                              <LinkIcon size={13} /> Copiar Link
                            </button>

                            {onDuplicateProperty && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => onDuplicateProperty(prop)}
                                title="Duplicar cadastro deste imóvel"
                                style={{ padding: '0.35rem 0.55rem', fontSize: '0.78rem' }}
                              >
                                <Copy size={13} /> Duplicar
                              </button>
                            )}

                            <button 
                              type="button"
                              className="btn btn-outline btn-sm" 
                              onClick={() => setConfirmDeleteId(prop.id)} 
                              style={{ color: '#991B1B', borderColor: '#FECACA', padding: '0.35rem 0.55rem', fontSize: '0.78rem' }} 
                              title="Excluir imóvel"
                            >
                              <Trash2 size={13} /> Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onUpdatePassword={onUpdatePassword}
      />
    </section>
  );
}
