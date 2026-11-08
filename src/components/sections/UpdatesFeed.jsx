import React, { useState } from 'react';
import {
  Calendar,
  Share2,
  Check,
  Plus,
  Edit,
  Trash2,
  Maximize2,
  ArrowUpRight,
  Newspaper
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import FullscreenGalleryModal from '../property/FullscreenGalleryModal';
import { getWhatsAppUrl, SITE_CONFIG } from '../../config';
import { POST_CATEGORIES, getPostCategoryLabel } from '../../data/posts';

function formatPostDate(dateStr) {
  if (!dateStr) return '';
  try {
    const clean = dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`;
    const date = new Date(clean);
    if (Number.isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateStr;
  }
}

export default function UpdatesFeed({
  posts = [],
  properties = [],
  currentUser = null,
  onOpenNewPost,
  onEditPost,
  onDeletePost,
  onSelectProperty
}) {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const filteredPosts =
    selectedCategory === 'todas'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleCopyShare = (post) => {
    const shareUrl = `${window.location.origin}/atualizacoes`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const findLinkedProperty = (refCode) => {
    if (!refCode) return null;
    const upper = refCode.toUpperCase();
    return properties.find(
      (p) => (p.code && p.code.toUpperCase() === upper) || (p.id && p.id.toUpperCase() === upper)
    );
  };

  return (
    <section style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--bg-main)', minHeight: '82vh' }}>
      <div className="container" style={{ maxWidth: '940px' }}>
        {/* Cabeçalho da Aba Atualizações */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--brand-red-solid)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '0.35rem'
              }}
            >
              Mural Oficial · {SITE_CONFIG.brokerName}
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.65rem, 3.2vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--text-dark)',
                margin: '0 0 0.4rem 0',
                lineHeight: 1.2
              }}
            >
              Atualizações e Novidades
            </h1>
            <p
              style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                margin: 0,
                maxWidth: '600px',
                lineHeight: 1.6
              }}
            >
              Acompanhe novas captações, movimentações do mercado imobiliário, imóveis negociados e comunicados em Itaiópolis e região.
            </p>
          </div>

          {/* Botão exclusivo para o Admin logado */}
          {currentUser && onOpenNewPost && (
            <button
              type="button"
              className="btn btn-red"
              onClick={onOpenNewPost}
              style={{ fontWeight: 700, padding: '0.7rem 1.25rem' }}
            >
              <Plus size={17} />
              <span>Nova Publicação</span>
            </button>
          )}
        </div>

        {/* Filtros por Categoria */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('todas')}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              border:
                selectedCategory === 'todas'
                  ? '1px solid transparent'
                  : '1px solid var(--border-subtle)',
              background:
                selectedCategory === 'todas' ? 'var(--brand-red-gradient)' : '#FFFFFF',
              color: selectedCategory === 'todas' ? '#FFFFFF' : 'var(--text-dark)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Todas ({posts.length})
          </button>

          {POST_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--brand-slate-gradient)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--text-body)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feed de Publicações */}
        {filteredPosts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <Newspaper size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
              Nenhuma publicação encontrada nesta categoria
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Selecione outra categoria acima ou fale diretamente pelo WhatsApp.
            </p>
            {selectedCategory !== 'todas' && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedCategory('todas')}
              >
                Ver todas as publicações
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {filteredPosts.map((post) => {
              const linkedProp = findLinkedProperty(post.propertyRef);
              const isConfirmingDelete = confirmDeleteId === post.id;
              const waMessage = `Olá Anderson! Vi a publicação "${post.title}" na aba de Atualizações do site e gostaria de mais informações.`;

              return (
                <article
                  key={post.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Barra Superior do Card (Autor + Categoria + Controles Admin) */}
                  <div
                    style={{
                      padding: '1.1rem 1.5rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      backgroundColor: '#FCFBF9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src="/logo-emblem.png"
                        alt="AK"
                        style={{
                          height: '38px',
                          width: 'auto',
                          objectFit: 'contain',
                          flexShrink: 0
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '0.92rem',
                            color: 'var(--text-dark)',
                            lineHeight: 1.2
                          }}
                        >
                          {SITE_CONFIG.brokerName}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontSize: '0.76rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.15rem'
                          }}
                        >
                          <Calendar size={12} />
                          <span>{formatPostDate(post.createdAt)}</span>
                          <span>·</span>
                          <span>{SITE_CONFIG.creci}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: 'var(--brand-red-gradient)',
                          color: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.7rem',
                          borderRadius: '999px',
                          letterSpacing: '0.02em'
                        }}
                      >
                        {getPostCategoryLabel(post.category)}
                      </span>

                      {/* Ações exclusivas do Admin */}
                      {currentUser && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => onEditPost && onEditPost(post)}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                          >
                            <Edit size={13} /> Editar
                          </button>

                          {isConfirmingDelete ? (
                            <>
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
                                  padding: '0.3rem 0.6rem',
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
                                style={{ padding: '0.3rem 0.55rem', fontSize: '0.76rem' }}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setConfirmDeleteId(post.id)}
                              style={{
                                color: '#991B1B',
                                borderColor: '#FECACA',
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.76rem'
                              }}
                            >
                              <Trash2 size={13} /> Excluir
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imagem da Publicação (com suporte a proporção vertical ou horizontal sem cortes) */}
                  {post.imageUrl && (
                    <div
                      onClick={() => setFullscreenImage({ url: post.imageUrl, title: post.title })}
                      style={{
                        position: 'relative',
                        maxHeight: '560px',
                        height: '460px',
                        width: '100%',
                        backgroundColor: '#070C18',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                      title="Clique para ampliar a imagem em tela cheia"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${post.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(24px) brightness(0.38)',
                          transform: 'scale(1.15)',
                          pointerEvents: 'none'
                        }}
                      />
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenImage({ url: post.imageUrl, title: post.title });
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '0.85rem',
                          right: '0.85rem',
                          zIndex: 2,
                          backgroundColor: 'rgba(11, 15, 20, 0.82)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.22)',
                          borderRadius: '6px',
                          padding: '0.38rem 0.75rem',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backdropFilter: 'blur(6px)'
                        }}
                      >
                        <Maximize2 size={13} /> Ampliar Imagem
                      </button>
                    </div>
                  )}

                  {/* Conteúdo Editorial */}
                  <div style={{ padding: '1.5rem 1.65rem 1.6rem' }}>
                    <h2
                      style={{
                        fontSize: 'clamp(1.2rem, 2.2vw, 1.45rem)',
                        fontWeight: 800,
                        color: 'var(--text-dark)',
                        marginBottom: '0.85rem',
                        lineHeight: 1.3
                      }}
                    >
                      {post.title}
                    </h2>

                    {post.content && (
                      <p
                        style={{
                          color: 'var(--text-body)',
                          fontSize: '0.96rem',
                          lineHeight: 1.75,
                          whiteSpace: 'pre-line',
                          marginBottom: '1.4rem'
                        }}
                      >
                        {post.content}
                      </p>
                    )}

                    {/* Rodapé de Interação da Publicação */}
                    <div
                      style={{
                        paddingTop: '1.1rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleCopyShare(post)}
                        >
                          {copiedId === post.id ? (
                            <Check size={14} style={{ color: '#15803D' }} />
                          ) : (
                            <Share2 size={14} />
                          )}
                          <span>{copiedId === post.id ? 'Link copiado' : 'Compartilhar'}</span>
                        </button>

                        {linkedProp && onSelectProperty && (
                          <button
                            type="button"
                            className="btn btn-navy btn-sm"
                            onClick={() => onSelectProperty(linkedProp)}
                          >
                            <span>Ver Imóvel ({linkedProp.code || linkedProp.id})</span>
                            <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>

                      <a
                        href={getWhatsAppUrl(waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp btn-sm"
                        style={{ padding: '0.55rem 1rem', fontWeight: 600 }}
                      >
                        <WhatsAppIcon size={15} color="#FFFFFF" />
                        <span>Conversar com Anderson no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {fullscreenImage && (
        <FullscreenGalleryModal
          images={[fullscreenImage.url]}
          initialIndex={0}
          title={fullscreenImage.title}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </section>
  );
}

