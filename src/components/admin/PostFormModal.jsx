import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Crop, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { POST_CATEGORIES } from '../../data/posts';
import ImageCropModal from './ImageCropModal';

function compressPostImageFile(file, maxDimension = 1400, quality = 0.84) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostFormModal({
  isOpen,
  onClose,
  onSave,
  editingPost = null,
  properties = []
}) {
  const [formData, setFormData] = useState({
    category: 'movimentacao',
    title: '',
    content: '',
    imageUrl: '',
    propertyRef: '',
    featured: true
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingPost) {
      setFormData({
        category: editingPost.category || 'movimentacao',
        title: editingPost.title || '',
        content: editingPost.content || '',
        imageUrl: editingPost.imageUrl || '',
        propertyRef: editingPost.propertyRef || '',
        featured: editingPost.featured !== undefined ? Boolean(editingPost.featured) : true
      });
    } else {
      setFormData({
        category: 'movimentacao',
        title: '',
        content: '',
        imageUrl: '',
        propertyRef: '',
        featured: true
      });
    }
  }, [editingPost, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressedDataUrl = await compressPostImageFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch {
      alert('Não foi possível processar a imagem selecionada.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor, informe um título para a publicação.');
      return;
    }
    onSave(formData, editingPost ? editingPost.id : null);
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '680px', width: '100%' }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: '#FFFFFF',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--brand-red-solid)',
                  display: 'block'
                }}
              >
                Mural de Atualizações
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                {editingPost ? 'Editar Publicação' : 'Nova Publicação no Mural'}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-dark)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem 2rem' }}>
            {/* 1. Imagem da Postagem */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--primary-dark)',
                  marginBottom: '0.5rem'
                }}
              >
                1. Imagem / Arte da Publicação
              </label>

              {formData.imageUrl ? (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    backgroundColor: '#070C18',
                    height: '280px',
                    marginBottom: '0.75rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${formData.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(20px) brightness(0.4)',
                      transform: 'scale(1.15)'
                    }}
                  />
                  <img
                    src={formData.imageUrl}
                    alt="Pré-visualização da publicação"
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.75rem',
                      right: '0.75rem',
                      zIndex: 2,
                      display: 'flex',
                      gap: '0.45rem'
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setIsCropModalOpen(true)}
                      style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.88)',
                        color: '#FFFFFF',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.78rem'
                      }}
                    >
                      <Crop size={14} /> Ajustar / Recortar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                      style={{
                        backgroundColor: '#991B1B',
                        color: '#FFFFFF',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.78rem'
                      }}
                    >
                      <Trash2 size={14} /> Remover Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem 1.25rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-main)',
                    cursor: 'pointer',
                    marginBottom: '0.75rem'
                  }}
                >
                  <ImageIcon size={32} style={{ color: 'var(--brand-red-solid)', marginBottom: '0.5rem' }} />
                  <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.92rem' }}>
                    {isUploading ? 'Otimizando imagem...' : 'Clique para enviar uma foto do celular ou computador'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Suporta fotos verticais ou horizontais (JPG, PNG, WebP) com compressão automática
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <Upload size={14} /> {formData.imageUrl ? 'Trocar Foto' : 'Escolher Foto do Aparelho'}
                </button>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ou cole o link/caminho de uma imagem (ex: /post-anderson-kunicki.jpg)"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  style={{ flex: 1, minWidth: '220px', fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                />
              </div>
            </div>

            {/* 2. Categoria e Imóvel Vinculado */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.15rem'
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--primary-dark)',
                    marginBottom: '0.35rem'
                  }}
                >
                  Categoria da Publicação
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                >
                  {POST_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--primary-dark)',
                    marginBottom: '0.35rem'
                  }}
                >
                  Vincular Imóvel da Carteira (Opcional)
                </label>
                <select
                  className="input-field"
                  value={formData.propertyRef}
                  onChange={(e) => setFormData((prev) => ({ ...prev, propertyRef: e.target.value }))}
                >
                  <option value="">Nenhum imóvel específico vinculado</option>
                  {properties.map((p) => {
                    const code = p.code || p.id;
                    return (
                      <option key={p.id} value={code}>
                        {code} — {p.title}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* 3. Título */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary-dark)',
                  marginBottom: '0.35rem'
                }}
              >
                Título da Publicação *
              </label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="Ex: Nova Captação de Casa no Centro de Itaiópolis"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* 4. Texto / Conteúdo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--primary-dark)',
                  marginBottom: '0.35rem'
                }}
              >
                Texto / Descrição da Atualização
              </label>
              <textarea
                className="input-field"
                rows={5}
                placeholder="Escreva os detalhes da novidade, bastidores, captação ou comunicado para seus clientes..."
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Rodapé de Ações */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-red" style={{ fontWeight: 700 }}>
                <Check size={16} />
                <span>{editingPost ? 'Salvar Alterações' : 'Publicar no Mural'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {isCropModalOpen && formData.imageUrl && (
        <ImageCropModal
          imageUrl={formData.imageUrl}
          isOpen={isCropModalOpen}
          onClose={() => setIsCropModalOpen(false)}
          onSave={(croppedDataUrl) => {
            setFormData((prev) => ({ ...prev, imageUrl: croppedDataUrl }));
            setIsCropModalOpen(false);
          }}
        />
      )}
    </>
  );
}

