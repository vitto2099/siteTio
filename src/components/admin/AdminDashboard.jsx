import React, { useState } from 'react';
import { 
  Building, Star, Tag, Plus, Edit, Trash2, Search, Eye, 
  LogOut, User, Copy, Download, Upload, Link as LinkIcon, CheckSquare, 
  DollarSign, PlusCircle, KeyRound, Home
} from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminDashboard({ 
  properties, 
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
  const [purposeFilter, setPurposeFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Multi-selection state for batch actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Stats calculation
  const total = properties.length;
  const featured = properties.filter(p => p.featured).length;
  const sale = properties.filter(p => p.purpose === 'venda').length;
  const rent = properties.filter(p => p.purpose === 'aluguel').length;

  const totalPortfolioValue = properties
    .filter(p => p.purpose === 'venda' && p.status !== 'vendido')
    .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  // Filter properties
  const filteredProperties = properties.filter(p => {
    if (purposeFilter !== 'todos' && p.purpose !== purposeFilter) return false;
    if (typeFilter !== 'todos' && p.type !== typeFilter) return false;
    if (statusFilter !== 'todos' && (p.status || 'ativo') !== statusFilter) return false;
    
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const codeMatch = (p.code || p.id || '').toLowerCase().includes(term);
    const titleMatch = (p.title || '').toLowerCase().includes(term);
    const neighMatch = (p.neighborhood || '').toLowerCase().includes(term);
    const addressMatch = (p.address || '').toLowerCase().includes(term);
    
    return codeMatch || titleMatch || neighMatch || addressMatch;
  });

  const isAllSelected = filteredProperties.length > 0 && filteredProperties.every(p => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProperties.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCopyLink = (prop) => {
    const refCode = prop.code || prop.id;
    const link = `${window.location.origin}/?imovel=${encodeURIComponent(refCode)}`;
    navigator.clipboard.writeText(link);
    if (onToast) {
      onToast(`Link do imóvel ${refCode} copiado com sucesso!`);
    }
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportBackup(file);
      e.target.value = null;
    }
  };

  return (
    <section style={{ padding: '3.5rem 0 5rem', backgroundColor: 'var(--bg-main)', minHeight: '90vh' }} id="admin-panel">
      <div className="container">
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Painel Restrito • CRECI-SC 60173 F
              </span>
              {currentUser && (
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: 'var(--primary-blue)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <User size={13} style={{ color: 'var(--accent-red)' }} /> Corretor: <strong>{currentUser}</strong>
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--primary-dark)', margin: '0.2rem 0', fontWeight: 800 }}>
              Gestão de Imóveis & Anúncios
            </h2>
          </div>

          {/* Top Actions */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {onGoHome && (
              <button 
                className="btn btn-outline btn-sm" 
                onClick={onGoHome} 
                title="Ver o site público como visitante"
                style={{ backgroundColor: '#FFFFFF', fontWeight: 600 }}
              >
                <Home size={14} /> Página Inicial
              </button>
            )}

            <button className="btn btn-outline btn-sm" onClick={onExportBackup} title="Exportar backup completo em arquivo JSON">
              <Download size={14} /> Exportar Backup
            </button>

            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }} title="Importar arquivo JSON com lista de imóveis">
              <Upload size={14} /> Importar Backup
              <input type="file" accept=".json" onChange={handleImportFileChange} style={{ display: 'none' }} />
            </label>

            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setIsChangePasswordOpen(true)} 
              title="Alterar Senha de Acesso ao Painel"
              style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-light)', backgroundColor: '#EFF6FF' }}
            >
              <KeyRound size={14} /> Alterar Senha
            </button>

            <button className="btn btn-red" onClick={onOpenAddModal} style={{ fontWeight: 700, padding: '0.6rem 1.25rem' }}>
              <Plus size={18} /> Cadastrar Imóvel
            </button>

            {onLogout && (
              <button 
                className="btn btn-outline btn-sm" 
                onClick={onLogout} 
                style={{
                  color: '#DC2626',
                  borderColor: '#FCA5A5',
                  backgroundColor: '#FEF2F2',
                  fontWeight: 700,
                  padding: '0.6rem 0.9rem'
                }} 
                title="Encerrar sessão no painel"
              >
                <LogOut size={15} /> Sair
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.35rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>{total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Cadastrados</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.35rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gold-subtle)', color: '#B48B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>{featured}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Em Destaque</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.35rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-red-subtle)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>{sale} / {rent}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Venda / Aluguel</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.35rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>{formatMoney(totalPortfolioValue)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>VGV Carteira Vendas</div>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          
          {/* Keyword Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '280px', backgroundColor: 'var(--bg-subtle)', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar por código (ex: CA-101, TE-102), título, rua ou bairro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '0.2rem 0', boxShadow: 'none' }}
            />
          </div>

          {/* Select Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <select 
                className="input-field" 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="todos">Todos os Tipos</option>
                <option value="casa">Casas</option>
                <option value="terreno">Terrenos</option>
                <option value="sitio">Sítios / Chácaras</option>
                <option value="apartamento">Apartamentos</option>
                <option value="comercial">Comerciais</option>
              </select>
            </div>

            <div>
              <select 
                className="input-field" 
                value={purposeFilter}
                onChange={(e) => setPurposeFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="todos">Todas Finalidades</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            <div>
              <select 
                className="input-field" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: 'auto', backgroundColor: 'var(--bg-subtle)' }}
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Disponíveis</option>
                <option value="reservado">Reservados</option>
                <option value="vendido">Vendidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Batch Actions Bar */}
        {selectedIds.length > 0 && (
          <div style={{
            backgroundColor: 'var(--primary-dark)',
            color: '#FFFFFF',
            padding: '0.85rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckSquare size={18} style={{ color: 'var(--gold-primary)' }} />
              <span>{selectedIds.length} imóvel(is) selecionado(s)</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF' }}
                onClick={() => onBulkStatusChange(selectedIds, 'vendido')}
              >
                Marcar como Vendido
              </button>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF' }}
                onClick={() => onBulkStatusChange(selectedIds, 'ativo')}
              >
                Marcar como Disponível
              </button>
              <button 
                className="btn btn-sm" 
                style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
              >
                <Trash2 size={14} /> Excluir Selecionados
              </button>
            </div>
          </div>
        )}

        {/* Main Listings Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', overflowX: 'auto', boxShadow: 'var(--shadow-xs)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '0.85rem 1rem', width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    title="Selecionar Todos"
                  />
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>Foto</th>
                <th style={{ padding: '0.85rem 1rem' }}>Código / Título</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tipo & Finalidade</th>
                <th style={{ padding: '0.85rem 1rem' }}>Valor</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Destaque</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '4.5rem 1rem', color: 'var(--text-muted)' }}>
                    <Building size={48} style={{ color: '#CBD5E1', marginBottom: '1rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>Nenhum imóvel cadastrado no momento</div>
                    <div style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Clique no botão abaixo para cadastrar seu primeiro imóvel com fotos e detalhes.</div>
                    <button className="btn btn-red btn-sm" onClick={onOpenAddModal}>
                      <PlusCircle size={16} /> Cadastrar Primeiro Imóvel
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProperties.map(prop => {
                  const isSelected = selectedIds.includes(prop.id);
                  const refCode = prop.code || prop.id;
                  const coverImg = prop.imageUrl || (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80';

                  return (
                    <tr 
                      key={prop.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'rgba(30, 64, 175, 0.03)' : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectOne(prop.id)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </td>

                      {/* Cover Photo */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <img 
                          src={coverImg} 
                          alt={prop.title} 
                          style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'; }}
                        />
                      </td>

                      {/* Code & Title */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', backgroundColor: 'var(--accent-red-subtle)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            {refCode}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginTop: '0.25rem', lineHeight: 1.25 }}>
                          {prop.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {prop.neighborhood ? `${prop.neighborhood} • ` : ''}{prop.city || 'Itaiópolis - SC'}
                        </div>
                      </td>

                      {/* Type & Purpose */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--primary-dark)' }}>
                          {prop.type}
                        </div>
                        <span className={`badge ${prop.purpose === 'venda' ? 'badge-venda' : 'badge-aluguel'}`} style={{ marginTop: '0.25rem' }}>
                          {prop.purpose.toUpperCase()}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                        {formatMoney(prop.price)}
                      </td>

                      {/* Status Toggle Dropdown */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={prop.status || 'ativo'}
                          onChange={(e) => onToggleStatus(prop.id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '12px',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer',
                            backgroundColor: prop.status === 'vendido' ? '#FEE2E2' : (prop.status === 'reservado' ? '#FEF3C7' : '#DCFCE7'),
                            color: prop.status === 'vendido' ? '#991B1B' : (prop.status === 'reservado' ? '#92400E' : '#166534')
                          }}
                        >
                          <option value="ativo">Disponível</option>
                          <option value="reservado">Reservado</option>
                          <option value="vendido">Vendido / Alugado</option>
                        </select>
                      </td>

                      {/* Featured Toggle */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button 
                          onClick={() => onToggleFeatured(prop.id)}
                          style={{ color: prop.featured ? 'var(--gold-primary)' : '#CBD5E1', cursor: 'pointer', background: 'none', border: 'none' }}
                          title="Alternar Destaque na Vitrine Home"
                        >
                          <Star size={22} fill={prop.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => onSelectProperty(prop)} 
                            title="Visualizar em tamanho real"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Eye size={14} />
                          </button>

                          <button 
                            className="btn btn-navy btn-sm" 
                            onClick={() => onEditProperty(prop)} 
                            title="Editar informações do imóvel"
                            style={{ padding: '0.35rem 0.65rem' }}
                          >
                            <Edit size={14} /> Editar
                          </button>

                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => onDuplicateProperty(prop)} 
                            title="Duplicar anúncio"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <Copy size={14} />
                          </button>

                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => handleCopyLink(prop)} 
                            title="Copiar link do imóvel"
                            style={{ padding: '0.35rem 0.5rem' }}
                          >
                            <LinkIcon size={14} />
                          </button>

                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={() => onDeleteProperty(prop.id)} 
                            style={{ color: 'var(--accent-red)', borderColor: '#FCA5A5', padding: '0.35rem 0.5rem' }} 
                            title="Excluir imóvel permanentemente"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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
