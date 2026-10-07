import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon, Trash2, Plus, Check } from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import { getCategoryPrefix } from '../../data/properties';

const DEFAULT_AMENITIES = [
  'Suíte Master', 'Churrasqueira', 'Piscina', 'Quintal Amplo', 'Portão Eletrônico',
  'Ar Condicionado', 'Mobiliado', 'Área de Festas', 'Aceita Financiamento',
  'Escriturado', 'Sacada com Vista', 'Garagem Coberta', 'Móveis Planejados',
  'Poço Artesiano', 'Energia Solar', 'Pomar / Horta', 'Rua Asfaltada'
];

const AMENITIES_STORAGE_KEY = 'anderson_kunicki_custom_amenities_v1';
const PROPERTIES_STORAGE_KEY = 'anderson_kunicki_react_properties_v2';
const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

const EMPTY_FORM_STATE = {
  code: '', title: '', type: 'casa', purpose: 'venda', status: 'ativo',
  price: '', area: '', landArea: '', bedrooms: '', suites: '', bathrooms: '', garages: '',
  address: '', neighborhood: '', city: 'Itaiópolis - SC', iptu: '', condoFee: '',
  videoUrl: '', description: '', featured: false
};

function generateNextCode(type, purpose, propertiesList = []) {
  const prefix = getCategoryPrefix(type, purpose);
  let list = Array.isArray(propertiesList) && propertiesList.length > 0 ? propertiesList : [];

  if (list.length === 0) {
    try {
      const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch {
      // Ignorar falha de leitura local
    }
  }

  const regex = new RegExp(`^${prefix}-(\\d+)$`, 'i');
  let maxNum = 100;
  list.forEach(item => {
    const codeStr = String(item.code || item.id || '').trim();
    const match = codeStr.match(regex);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });

  return `${prefix}-${maxNum + 1}`;
}

function compressImageFile(file, maxDimension = 1280, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler imagem'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => resolve(event.target.result);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
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
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PropertyFormModal({ isOpen, onClose, onSave, editingProperty, properties = [] }) {
  const [formData, setFormData] = useState(EMPTY_FORM_STATE);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [availableAmenities, setAvailableAmenities] = useState(() => {
    try {
      const stored = localStorage.getItem(AMENITIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback para lista padrão
    }
    return DEFAULT_AMENITIES;
  });

  const [newAmenityInput, setNewAmenityInput] = useState('');
  const [confirmDeleteAmenity, setConfirmDeleteAmenity] = useState(null);
  const [images, setImages] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const saveAmenitiesList = (newList) => {
    setAvailableAmenities(newList);
    try { localStorage.setItem(AMENITIES_STORAGE_KEY, JSON.stringify(newList)); } catch {}
  };

  const removeAmenityOption = (amenityToRemove) => {
    const updatedList = availableAmenities.filter(a => a.toLowerCase() !== amenityToRemove.toLowerCase());
    saveAmenitiesList(updatedList);
    setSelectedAmenities(prev => prev.filter(a => a.toLowerCase() !== amenityToRemove.toLowerCase()));
    setConfirmDeleteAmenity(null);
  };

  const handleAmenityDeleteClick = (e, amenity) => {
    e.stopPropagation();
    if (confirmDeleteAmenity === amenity) {
      removeAmenityOption(amenity);
    } else {
      setConfirmDeleteAmenity(amenity);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setConfirmDeleteAmenity(null);

    if (editingProperty) {
      const existingFeatures = Array.isArray(editingProperty.features)
        ? editingProperty.features
        : Array.isArray(editingProperty.tags) ? editingProperty.tags : [];

      setFormData({
        code: editingProperty.code || editingProperty.id || '', title: editingProperty.title || '',
        type: editingProperty.type || 'casa', purpose: editingProperty.purpose || 'venda',
        status: editingProperty.status || 'ativo', price: editingProperty.price ?? '',
        area: editingProperty.area ?? '', landArea: editingProperty.landArea ?? '',
        bedrooms: editingProperty.bedrooms ?? '', suites: editingProperty.suites ?? '',
        bathrooms: editingProperty.bathrooms ?? '', garages: editingProperty.garages ?? editingProperty.garage ?? '',
        address: editingProperty.address || '', neighborhood: editingProperty.neighborhood || '',
        city: editingProperty.city || 'Itaiópolis - SC', iptu: editingProperty.iptu ?? '',
        condoFee: editingProperty.condoFee ?? '', videoUrl: editingProperty.videoUrl || '',
        description: editingProperty.description || '', featured: Boolean(editingProperty.featured)
      });
      setSelectedAmenities(existingFeatures);
      const initialImages = Array.isArray(editingProperty.images) && editingProperty.images.length > 0
        ? editingProperty.images : (editingProperty.imageUrl ? [editingProperty.imageUrl] : []);
      setImages(initialImages);
      if (existingFeatures.length > 0) {
        let updated = [...availableAmenities];
        let changed = false;
        existingFeatures.forEach(feat => {
          if (feat && !updated.some(a => a.toLowerCase() === feat.toLowerCase())) { updated.push(feat); changed = true; }
        });
        if (changed) saveAmenitiesList(updated);
      }
    } else {
      setFormData({ ...EMPTY_FORM_STATE, code: generateNextCode('casa', 'venda', properties) });
      setSelectedAmenities([]);
      setImages([]);
    }
    setCustomUrl('');
    setNewAmenityInput('');
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setFormData(prev => {
      const currentCode = (prev.code || '').trim();
      const isStandardCode = /^(CA|TE|SI|AP|CO|AL|AK|IM)-\d+$/i.test(currentCode);
      const nextCode = (!editingProperty || isStandardCode) ? generateNextCode(newType, prev.purpose, properties) : currentCode;
      return { ...prev, type: newType, code: nextCode };
    });
  };

  const handlePurposeChange = (newPurpose) => {
    setFormData(prev => {
      const currentCode = (prev.code || '').trim();
      const isStandardCode = /^(CA|TE|SI|AP|CO|AL|AK|IM)-\d+$/i.test(currentCode);
      const nextCode = (!editingProperty || isStandardCode) ? generateNextCode(prev.type, newPurpose, properties) : currentCode;
      return { ...prev, purpose: newPurpose, code: nextCode };
    });
  };

  const toggleAmenity = (amenity) => {
    setConfirmDeleteAmenity(null);
    setSelectedAmenities(prev => {
      const exists = prev.some(item => item.toLowerCase() === amenity.toLowerCase());
      return exists ? prev.filter(item => item.toLowerCase() !== amenity.toLowerCase()) : [...prev, amenity];
    });
  };

  const handleAddCustomAmenity = () => {
    const trimmed = newAmenityInput.trim();
    if (!trimmed) return;
    if (!availableAmenities.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      saveAmenitiesList([...availableAmenities, trimmed]);
    }
    if (!selectedAmenities.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedAmenities(prev => [...prev, trimmed]);
    }
    setNewAmenityInput('');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsCompressing(true);
    try {
      const compressedList = await Promise.all(
        files.map(file => compressImageFile(file, 1280, 0.78))
      );
      setImages(prev => [...prev, ...compressedList]);
    } catch (err) {
      console.error('Erro ao comprimir imagens:', err);
    } finally {
      setIsCompressing(false);
      e.target.value = null;
    }
  };

  const handleAddCustomUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    setImages(prev => [...prev, trimmed]);
    setCustomUrl('');
  };

  const setPrimaryImage = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalImages = images.length > 0 ? images : [DEFAULT_FALLBACK_IMAGE];
    const fallbackCode = generateNextCode(formData.type, formData.purpose, properties);

    const dataToSave = {
      ...formData,
      code: (formData.code || '').trim().toUpperCase() || fallbackCode,
      price: parseFloat(formData.price) || 0,
      area: parseFloat(formData.area) || 0,
      landArea: parseFloat(formData.landArea) || 0,
      bedrooms: parseInt(formData.bedrooms, 10) || 0,
      suites: parseInt(formData.suites, 10) || 0,
      bathrooms: parseInt(formData.bathrooms, 10) || 0,
      garages: parseInt(formData.garages, 10) || 0,
      garage: parseInt(formData.garages, 10) || 0,
      iptu: parseFloat(formData.iptu) || 0,
      condoFee: parseFloat(formData.condoFee) || 0,
      imageUrl: finalImages[0],
      images: finalImages,
      features: selectedAmenities,
      tags: selectedAmenities
    };

    onSave(dataToSave, editingProperty ? editingProperty.id : null);
  };

  const labelStyle = {
    fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)',
    marginBottom: '0.3rem', display: 'block'
  };

  const blockBoxStyle = {
    backgroundColor: '#FFFFFF', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.25rem'
  };

  const blockTitleStyle = {
    fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-dark)',
    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem',
    paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)'
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}
      >
        {/* Cabeçalho do Modal */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.15rem 1.5rem', borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--primary-dark)', color: '#FFFFFF'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {editingProperty ? 'Editar Cadastro' : 'Novo Cadastro'}
            </span>
            <h3 style={{ fontSize: '1.25rem', margin: '0.15rem 0 0', color: '#FFFFFF', fontWeight: 800 }}>
              {editingProperty ? `Imóvel ${editingProperty.code || editingProperty.id}` : 'Cadastrar Imóvel'}
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ color: '#CBD5E1', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Formulário em 3 Blocos Claros */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* BLOCO 1 — INFORMAÇÕES PRINCIPAIS */}
          <div style={blockBoxStyle}>
            <h4 style={blockTitleStyle}>1. Informações Principais</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <div>
                <label style={labelStyle}>Tipo de Imóvel *</label>
                <select className="input-field" value={formData.type} onChange={(e) => handleTypeChange(e.target.value)} required>
                  <option value="casa">Casa</option>
                  <option value="terreno">Terreno</option>
                  <option value="sitio">Sítio / Chácara</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Finalidade *</label>
                <select className="input-field" value={formData.purpose} onChange={(e) => handlePurposeChange(e.target.value)} required>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Status *</label>
                <select className="input-field" value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))} required>
                  <option value="ativo">Disponível</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Código *</label>
                <input 
                  type="text" className="input-field" placeholder="CA-101" value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required style={{ fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <div>
                <label style={labelStyle}>Título do Anúncio *</label>
                <input 
                  type="text" className="input-field" placeholder="Ex: Casa de Alvenaria no Centro com 3 Quartos" 
                  value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required
                />
              </div>

              <div>
                <label style={labelStyle}>Valor em R$ *</label>
                <input 
                  type="number" className="input-field" placeholder="420000" 
                  value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} required
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.2rem' }}>
                  Prévia: <span style={{ color: 'var(--primary-dark)' }}>{formData.price ? formatMoney(formData.price) : 'R$ 0'}</span>
                </div>
              </div>
            </div>

            <label 
              htmlFor="chkFeaturedProperty" 
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.9rem',
                backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)', cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: 700, color: 'var(--primary-dark)'
              }}
            >
              <input 
                type="checkbox" id="chkFeaturedProperty" checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary-dark)' }}
              />
              <span>Destacar este imóvel na página inicial</span>
            </label>
          </div>

          {/* BLOCO 2 — LOCALIZAÇÃO, MEDIDAS E DESCRIÇÃO */}
          <div style={blockBoxStyle}>
            <h4 style={blockTitleStyle}>2. Localização, Medidas e Descrição</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '0.9rem' }}>
              <div>
                <label style={labelStyle}>Bairro</label>
                <input type="text" className="input-field" placeholder="Ex: Centro" value={formData.neighborhood} onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Endereço / Rua</label>
                <input type="text" className="input-field" placeholder="Ex: Rua Principal, nº 120" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Cidade</label>
                <input type="text" className="input-field" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              <div><label style={labelStyle}>Área Const. (m²)</label><input type="number" className="input-field" placeholder="160" value={formData.area} onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))} /></div>
              <div><label style={labelStyle}>Terreno (m²)</label><input type="number" className="input-field" placeholder="450" value={formData.landArea} onChange={(e) => setFormData(prev => ({ ...prev, landArea: e.target.value }))} /></div>
              <div><label style={labelStyle}>Quartos</label><input type="number" className="input-field" placeholder="3" value={formData.bedrooms} onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))} /></div>
              <div><label style={labelStyle}>Suítes</label><input type="number" className="input-field" placeholder="1" value={formData.suites} onChange={(e) => setFormData(prev => ({ ...prev, suites: e.target.value }))} /></div>
              <div><label style={labelStyle}>Banheiros</label><input type="number" className="input-field" placeholder="2" value={formData.bathrooms} onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))} /></div>
              <div><label style={labelStyle}>Vagas</label><input type="number" className="input-field" placeholder="2" value={formData.garages} onChange={(e) => setFormData(prev => ({ ...prev, garages: e.target.value }))} /></div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Descrição do Imóvel</label>
              <textarea 
                className="input-field" rows={3} 
                placeholder="Descreva os principais pontos do imóvel, acabamentos, localização e condições de negociação..."
                value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            {/* Comodidades em Chips Simples de 1 Clique + Exclusão em 2 Cliques no X */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  Comodidades <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>(clique para marcar · clique 2x no × para excluir da lista)</span>
                </label>
                <button
                  type="button"
                  onClick={() => { saveAmenitiesList(DEFAULT_AMENITIES); setConfirmDeleteAmenity(null); }}
                  style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Restaurar lista padrão
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {availableAmenities.map(amenity => {
                  const active = selectedAmenities.some(item => item.toLowerCase() === amenity.toLowerCase());
                  const isConfirming = confirmDeleteAmenity === amenity;
                  return (
                    <div
                      key={amenity}
                      style={{
                        display: 'inline-flex', alignItems: 'center', borderRadius: '20px', overflow: 'hidden',
                        border: isConfirming ? '1px solid #DC2626' : (active ? '1px solid var(--primary-dark)' : '1px solid var(--border-subtle)'),
                        backgroundColor: active ? 'var(--primary-dark)' : 'var(--bg-subtle)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        onDoubleClick={() => removeAmenityOption(amenity)}
                        title="Clique para selecionar ou dê duplo clique para remover da lista"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.32rem 0.45rem 0.32rem 0.7rem', fontSize: '0.78rem',
                          fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none',
                          color: active ? '#FFFFFF' : 'var(--text-body)'
                        }}
                      >
                        {active && <Check size={12} />}
                        <span>{amenity}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleAmenityDeleteClick(e, amenity)}
                        title={isConfirming ? 'Clique novamente para excluir esta comodidade da lista' : 'Excluir comodidade (clique 2x)'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          padding: isConfirming ? '0.28rem 0.5rem' : '0.32rem 0.48rem',
                          fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                          backgroundColor: isConfirming ? '#DC2626' : 'transparent',
                          color: isConfirming ? '#FFFFFF' : (active ? 'rgba(255,255,255,0.65)' : '#94A3B8'),
                          borderLeft: isConfirming ? 'none' : '1px solid rgba(148,163,184,0.2)'
                        }}
                      >
                        {isConfirming ? 'Excluir?' : <X size={11} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '420px' }}>
                <input
                  type="text" className="input-field" placeholder="Outra comodidade (ex: Fogão a Lenha)"
                  value={newAmenityInput} onChange={(e) => setNewAmenityInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddCustomAmenity}>
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO 3 — FOTOS E VÍDEO */}
          <div style={{ ...blockBoxStyle, marginBottom: '1rem' }}>
            <h4 style={blockTitleStyle}>3. Fotos e Vídeo ({images.length} foto{images.length === 1 ? '' : 's'})</h4>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="btn btn-navy btn-sm" style={{ cursor: 'pointer', padding: '0.5rem 0.95rem' }}>
                <Upload size={15} /> {isCompressing ? 'Comprimindo fotos...' : 'Enviar Fotos do Celular / PC'}
                <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={isCompressing} style={{ display: 'none' }} />
              </label>

              <div style={{ display: 'flex', gap: '0.45rem', flex: '1 1 240px' }}>
                <input 
                  type="url" className="input-field" placeholder="Ou cole o link (URL) de uma foto..."
                  value={customUrl} onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomUrl(); } }}
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.84rem' }}
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddCustomUrl}>
                  <Plus size={14} /> Adicionar URL
                </button>
              </div>
            </div>

            {images.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                {images.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      position: 'relative', borderRadius: 'var(--radius-xs)', overflow: 'hidden',
                      border: idx === 0 ? '2px solid var(--primary-dark)' : '1px solid var(--border-subtle)',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <img 
                      src={imgUrl} alt={`Foto ${idx + 1}`} 
                      style={{ width: '100%', height: '92px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                    />
                    {idx === 0 && (
                      <span style={{
                        position: 'absolute', top: '5px', left: '5px', backgroundColor: 'var(--primary-dark)',
                        color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem',
                        borderRadius: '4px', textTransform: 'uppercase'
                      }}>
                        Capa
                      </span>
                    )}
                    <div style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.35rem 0.45rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' 
                    }}>
                      {idx === 0 ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Foto Principal</span>
                      ) : (
                        <button 
                          type="button" onClick={() => setPrimaryImage(idx)} 
                          style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-dark)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Definir Capa
                        </button>
                      )}
                      <button 
                        type="button" onClick={() => removeImage(idx)} 
                        style={{ color: '#991B1B', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Remover foto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.1rem', 
                backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-xs)', marginBottom: '1rem'
              }}>
                <ImageIcon size={20} style={{ marginBottom: '0.25rem', opacity: 0.6 }} />
                <div>Nenhuma foto adicionada ainda. As fotos enviadas são otimizadas automaticamente.</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>Vídeo YouTube / Vimeo (opcional)</label>
                <input type="url" className="input-field" placeholder="https://www.youtube.com/watch?v=..." value={formData.videoUrl} onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>IPTU Anual (R$)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.iptu} onChange={(e) => setFormData(prev => ({ ...prev, iptu: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Condomínio (R$)</label>
                <input type="number" className="input-field" placeholder="0" value={formData.condoFee} onChange={(e) => setFormData(prev => ({ ...prev, condoFee: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', paddingTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-navy" disabled={isCompressing} style={{ fontWeight: 700 }}>
              <Save size={16} /> {editingProperty ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
