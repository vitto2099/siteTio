import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, Newspaper, ExternalLink, Building, Search, X } from 'lucide-react';
import { POST_CATEGORIES, getPostCategoryLabel } from '../../data/posts';

export function AdminSectionTabs({
  activeSection,
  setActiveSection,
  propertiesCount = 0,
  postsCount = 0,
  onOpenAddProperty,
  onOpenNewPost
}) {
  const isProps = activeSection === 'imoveis';
  const isPosts = activeSection === 'posts';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}
    >
      {/* Card Seletor 1: Gestão de Imóveis */}
      <div
        onClick={() => setActiveSection('imoveis')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.4rem',
          border: isProps ? '2px solid var(--primary-dark)' : '1px solid var(--border-subtle)',
          boxShadow: isProps ? 'var(--shadow-md)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          transition: 'var(--transition-fast)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isProps ? 'var(--primary-dark)' : 'var(--bg-subtle)',
              color: isProps ? '#FFFFFF' : 'var(--text-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Building size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <strong style={{ fontSize: '1.02rem', color: 'var(--primary-dark)' }}>
                1. Carteira de Imóveis
              </strong>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--primary-dark)',
                  padding: '0.12rem 0.5rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                {propertiesCount}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Casas, terrenos, sítios e apartamentos à venda ou locação
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-navy btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSection('imoveis');
            if (onOpenAddProperty) onOpenAddProperty();
          }}
          style={{ flexShrink: 0, fontWeight: 700 }}
        >
          <Plus size={14} /> Novo Imóvel
        </button>
      </div>

      {/* Card Seletor 2: Gestão de Postagens (Aba Atualizações) */}
      <div
        onClick={() => setActiveSection('posts')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.4rem',
          border: isPosts ? '2px solid var(--brand-red-solid)' : '1px solid var(--border-subtle)',
          boxShadow: isPosts ? 'var(--shadow-md)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          transition: 'var(--transition-fast)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-sm)',
              background: isPosts ? 'var(--brand-red-gradient)' : 'var(--bg-subtle)',
              color: isPosts ? '#FFFFFF' : 'var(--brand-red-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Newspaper size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <strong style={{ fontSize: '1.02rem', color: 'var(--primary-dark)' }}>
                2. Mural de Atualizações (Posts)
              </strong>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: '#FFF5F5',
                  color: 'var(--brand-red-solid)',
                  padding: '0.12rem 0.5rem',
                  borderRadius: '999px',
                  border: '1px solid #FECACA'
                }}
              >
                {postsCount}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Publicações de movimentação, novidades e comunicados
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-red btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSection('posts');
            if (onOpenNewPost) onOpenNewPost();
          }}
          style={{ flexShrink: 0, fontWeight: 700 }}
        >
          <Plus size={14} /> Novo Post
        </button>
      </div>
    </div>
  );
}

export default function AdminPostsSection({
  posts = [],
  onOpenNewPost,
  onEditPost,
  onDeletePost,
  onGoUpdates
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchPost, setSearchPost] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  const filteredPosts = posts.filter((post) => {
    if (categoryFilter !== 'todas' && post.category !== categoryFilter) return false;
    if (!searchPost.trim()) return true;
    const term = searchPost.toLowerCase().trim();
    return (
      (post.title || '').toLowerCase().includes(term) ||
      (post.content || '').toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Cabeçalho da Aba de Posts */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1.15rem 1.35rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
            Gerenciar Postagens da Aba Atualizações
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            As postagens criadas aqui aparecem exclusivamente na aba &ldquo;Atualizações&rdquo; do site, separadas do catálogo de imóveis.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {onGoUpdates && (
            <button type="button" className="btn btn-outline btn-sm" onClick={onGoUpdates}>
              <ExternalLink size={14} /> Abrir Aba Atualizações
            </button>
          )}
          {onOpenNewPost && (
            <button
              type="button"
              className="btn btn-red btn-sm"
              onClick={onOpenNewPost}
              style={{ fontWeight: 700, padding: '0.55rem 1rem' }}
            >
              <Plus size={15} /> Criar Nova Postagem
            </button>
          )}
        </div>
      </div>

      {/* Barra de Busca e Categoria para Posts */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '0.9rem 1.15rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: '1 1 260px',
            backgroundColor: 'var(--bg-subtle)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar postagem por título ou texto..."
            value={searchPost}
            onChange={(e) => setSearchPost(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '0.88rem',
              color: 'var(--text-dark)',
              outline: 'none'
            }}
          />
          {searchPost && (
            <button
              type="button"
              onClick={() => setSearchPost('')}
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          className="input-field"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            fontSize: '0.85rem',
            width: 'auto',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          <option value="todas">Categoria: Todas</option>
          {POST_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tabela de Postagens */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto'
        }}
      >
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
            <Newspaper size={36} style={{ color: '#CBD5E1', marginBottom: '0.6rem' }} />
            <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1rem', marginBottom: '0.25rem' }}>
              Nenhuma postagem encontrada
            </div>
            <div style={{ fontSize: '0.85rem', marginBottom: '1.15rem' }}>
              Publique novidades, fotos de movimentação ou comunicados na aba Atualizações.
            </div>
            {onOpenNewPost && (
              <button type="button" className="btn btn-red btn-sm" onClick={onOpenNewPost}>
                <Plus size={14} /> Criar Nova Postagem
              </button>
            )}
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.875rem',
              minWidth: '640px'
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                <th style={{ padding: '0.75rem 1rem' }}>Publicação</th>
                <th style={{ padding: '0.75rem 1rem' }}>Categoria</th>
                <th style={{ padding: '0.75rem 1rem' }}>Data</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => {
                const isConfirming = confirmDeleteId === post.id;
                return (
                  <tr key={post.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            style={{
                              width: '60px',
                              height: '46px',
                              borderRadius: 'var(--radius-xs)',
                              objectFit: 'cover',
                              border: '1px solid var(--border-subtle)',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '60px',
                              height: '46px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--bg-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                              flexShrink: 0
                            }}
                          >
                            <Newspaper size={18} />
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.92rem' }}>
                            {post.title}
                          </div>
                          {post.content && (
                            <div
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '400px'
                              }}
                            >
                              {post.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          backgroundColor: '#FFF5F5',
                          color: 'var(--brand-red-solid)',
                          border: '1px solid #FECACA'
                        }}
                      >
                        {getPostCategoryLabel(post.category)}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: '0.85rem 1rem',
                        whiteSpace: 'nowrap',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem'
                      }}
                    >
                      {post.createdAt || '-'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isConfirming ? (
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => {
                              setConfirmDeleteId(null);
                              if (onDeletePost) onDeletePost(post.id, true);
                            }}
                            style={{
                              backgroundColor: '#991B1B',
                              color: '#FFFFFF',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.76rem',
                              fontWeight: 700
                            }}
                          >
                            <Check size={13} /> Confirmar?
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setConfirmDeleteId(null)}
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-navy btn-sm"
                            onClick={() => onEditPost && onEditPost(post)}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          >
                            <Edit size={13} /> Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setConfirmDeleteId(post.id)}
                            style={{
                              color: '#991B1B',
                              borderColor: '#FECACA',
                              padding: '0.35rem 0.55rem',
                              fontSize: '0.76rem'
                            }}
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
  );
}
