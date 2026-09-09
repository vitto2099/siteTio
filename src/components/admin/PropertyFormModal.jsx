import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Image as ImageIcon, ArrowLeft, ArrowRight, Star, Trash2, Plus, Check, Tag } from 'lucide-react';
import { formatMoney } from '../../utils/formatters';
import { getCategoryPrefix } from '../../data/properties';

const DEFAULT_AMENITIES = [
  'Suíte Master',
  'Churrasqueira Gourmet',
  'Piscina',
  'Quintal Amplo',
  'Portão Eletrônico',
  'Ar Condicionado',
  'Mobiliado',
  'Área de Festas',
  'Aceita Financiamento',
  'Escriturado',
  'Sacada com Vista',
  'Vaga Coberta',
  'Cozinha Sob Medida',
  'Poço Artesiano',
  'Sistema de Alarme',
  'Energia Solar',
  'Pomar / Horta',
  'Asfalto na Frente'
];

const AMENITIES_STORAGE_KEY = 'anderson_kunicki_custom_amenities_v1';

export default function PropertyFormModal({ isOpen, onClose, onSave, editingProperty }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    type: 'casa',
    purpose: 'venda',
    status: 'ativo',
    price: '',
    area: '',
    landArea: '',
    bedrooms: '',
    suites: '',
    bathrooms: '',
    garages: '',
    address: '',
    neighborhood: '',
    city: 'Itaiópolis - SC',
    iptu: '',
    condoFee: '',
    videoUrl: '',
    description: '',
    features: '',
    featured: false
  });

  const [availableAmenities, setAvailableAmenities] = useState(() => {
    try {
      const stored = localStorage.getItem(AMENITIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_AMENITIES;
  });

  const [newAmenityInput, setNewAmenityInput] = useState('');
  const [images, setImages] = useState([]);
  const [customUrl, setCustomUrl] = useState('');

  const saveAmenitiesList = (newList) => {
    setAvailableAmenities(newList);
    localStorage.setItem(AMENITIES_STORAGE_KEY, JSON.stringify(newList));
  };

  const handleCreateNewAmenity = () => {
    const trimmed = newAmenityInput.trim();
    if (!trimmed) return;

    const exists = availableAmenities.some(a => a.toLowerCase() === trimmed.toLowerCase());
    let updatedList = availableAmenities;

    if (!exists) {
      updatedList = [...availableAmenities, trimmed];
      saveAmenitiesList(updatedList);
    }

    const currentFeaturesList = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];
    
    if (!currentFeaturesList.some(f => f.toLowerCase() === trimmed.toLowerCase())) {
      const newFeaturesStr = [...currentFeaturesList, trimmed].join(', ');
      setFormData(prev => ({ ...prev, features: newFeaturesStr }));
    }

    setNewAmenityInput('');
  };

  const handleDeleteAmenityTag = (amenityToDelete) => {
    const updated = availableAmenities.filter(a => a !== amenityToDelete);
    saveAmenitiesList(updated);
  };

  useEffect(() => {
    if (editingProperty) {
      setFormData({
        code: editingProperty.code || editingProperty.id || '',
        title: editingProperty.title || '',
        type: editingProperty.type || 'casa',
        purpose: editingProperty.purpose || 'venda',
        status: editingProperty.status || 'ativo',
        price: editingProperty.price || '',
        area: editingProperty.area || '',
        landArea: editingProperty.landArea || '',
        bedrooms: editingProperty.bedrooms || '',
        suites: editingProperty.suites || '',
        bathrooms: editingProperty.bathrooms || '',
        garages: editingProperty.garages ?? editingProperty.garage ?? '',
        address: editingProperty.address || '',
        neighborhood: editingProperty.neighborhood || '',
        city: editingProperty.city || 'Itaiópolis - SC',
        iptu: editingProperty.iptu || '',
        condoFee: editingProperty.condoFee || '',
        videoUrl: editingProperty.videoUrl || '',
        description: editingProperty.description || '',
        features: editingProperty.features ? editingProperty.features.join(', ') : (editingProperty.tags ? editingProperty.tags.join(', ') : ''),
        featured: !!editingProperty.featured
      });
      const initialImages = editingProperty.images && editingProperty.images.length > 0 
        ? editingProperty.images 
        : (editingProperty.imageUrl ? [editingProperty.imageUrl] : []);
      setImages(initialImages);

      const propFeatures = editingProperty.features || editingProperty.tags;
      if (propFeatures && Array.isArray(propFeatures)) {
        let listChanged = false;
        let newList = [...availableAmenities];
        propFeatures.forEach(feat => {
          if (feat && !newList.some(a => a.toLowerCase() === feat.toLowerCase())) {
            newList.push(feat);
            listChanged = true;
          }
        });
        if (listChanged) {
          saveAmenitiesList(newList);
        }
      }
    } else {
      setFormData({
        code: `${getCategoryPrefix('casa', 'venda')}-${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        type: 'casa',
        purpose: 'venda',
        status: 'ativo',
        price: '',
        area: '',
        landArea: '',
        bedrooms: '',
        suites: '',
        bathrooms: '',
        garages: '',
        address: '',
        neighborhood: '',
        city: 'Itaiópolis - SC',
        iptu: '',
        condoFee: '',
        videoUrl: '',
        description: '',
        features: '',
        featured: false
      });
      setImages([]);
    }
    setCustomUrl('');
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    setImages(prev => [...prev, customUrl.trim()]);
    setCustomUrl('');
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setImages(newImages);
  };

  const setPrimaryImage = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const selected = newImages.splice(index, 1)[0];
    newImages.unshift(selected);
    setImages(newImages);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    const currentList = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];
    
    let updatedList;
    if (currentList.includes(amenity)) {
      updatedList = currentList.filter(item => item !== amenity);
    } else {
      updatedList = [...currentList, amenity];
    }
    setFormData(prev => ({ ...prev, features: updatedList.join(', ') }));
  };

  const isAmenitySelected = (amenity) => {
    if (!formData.features) return false;
    const currentList = formData.features.split(',').map(f => f.trim().toLowerCase());
    return currentList.includes(amenity.toLowerCase());
  };

  const formattedPricePreview = formData.price ? formatMoney(formData.price) : 'R$ 0';

  const handleSubmit = (e) => {
    e.preventDefault();

    const rawFeatures = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const defaultImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
    const finalImages = images.length > 0 ? images : [defaultImg];

    const fallbackPrefix = getCategoryPrefix(formData.type, formData.purpose);
    const fallbackCode = `${fallbackPrefix}-${Date.now().toString().slice(-3)}`;

    const dataToSave = {
      ...formData,
      code: formData.code.trim() || fallbackCode,
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
      features: rawFeatures,
      tags: rawFeatures
    };

    onSave(dataToSave, editingProperty ? editingProperty.id : null);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--primary-dark)',
          color: '#FFFFFF'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {editingProperty ? 'Edição de Imóvel' : 'Novo Anúncio de Imóvel'}
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: '0.2rem 0 0', color: '#FFFFFF', fontWeight: 800 }}>
              {editingProperty ? `Editar: ${editingProperty.code || editingProperty.id}` : 'Cadastrar Imóvel'}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Section 1: Identificação */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--bg-subtle)', paddingBottom: '0.5rem' }}>
              1. Identificação e Título
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Código Ref * <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(ex: CA-101, TE-102)</span>
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: CA-101, TE-102..." 
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)', fontWeight: 700 }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Título Completo do Anúncio *
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Excelente Sobrado Residencial no Centro com Suíte e Área Gourmet" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>

            {/* Type, Purpose, Status & Price */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Tipo de Imóvel *
                </label>
                <select 
                  className="input-field" 
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData(prev => {
                      const currentCode = (prev.code || '').trim();
                      const prefixMatch = currentCode.match(/^(CA|TE|SI|AP|CO|AL|AK)-(\d+)$/i);
                      let newCode = currentCode;
                      if (prefixMatch) {
                        const num = prefixMatch[2];
                        const newPrefix = prev.purpose === 'aluguel' ? 'AL' : getCategoryPrefix(newType, prev.purpose);
                        newCode = `${newPrefix}-${num}`;
                      }
                      return { ...prev, type: newType, code: newCode };
                    });
                  }}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                >
                  <option value="casa">Casa (CA)</option>
                  <option value="terreno">Terreno (TE)</option>
                  <option value="sitio">Sítio / Chácara (SI)</option>
                  <option value="apartamento">Apartamento (AP)</option>
                  <option value="comercial">Comercial (CO)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Finalidade *
                </label>
                <select 
                  className="input-field" 
                  value={formData.purpose}
                  onChange={(e) => {
                    const newPurpose = e.target.value;
                    setFormData(prev => {
                      const currentCode = (prev.code || '').trim();
                      const prefixMatch = currentCode.match(/^(CA|TE|SI|AP|CO|AL|AK)-(\d+)$/i);
                      let newCode = currentCode;
                      if (prefixMatch) {
                        const num = prefixMatch[2];
                        const newPrefix = getCategoryPrefix(prev.type, newPurpose);
                        newCode = `${newPrefix}-${num}`;
                      }
                      return { ...prev, purpose: newPurpose, code: newCode };
                    });
                  }}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel (AL)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Status no Painel *
                </label>
                <select 
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                >
                  <option value="ativo">🟢 Disponível (Ativo)</option>
                  <option value="reservado">🟡 Reservado</option>
                  <option value="vendido">🔴 Vendido / Alugado</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Preço (R$) *
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="450000" 
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
                {formData.price && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 700, marginTop: '0.2rem' }}>
                    {formattedPricePreview}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Dimensões e Cômodos */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--bg-subtle)', paddingBottom: '0.5rem' }}>
              2. Medidas e Distribuição Interna
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Área Const. (m²)
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="180" 
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Terreno (m²)
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="450" 
                  value={formData.landArea}
                  onChange={(e) => setFormData(prev => ({ ...prev, landArea: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Quartos
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="3" 
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Suítes
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="1" 
                  value={formData.suites}
                  onChange={(e) => setFormData(prev => ({ ...prev, suites: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Banheiros
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="2" 
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Vagas Garagem
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="2" 
                  value={formData.garages}
                  onChange={(e) => setFormData(prev => ({ ...prev, garages: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Endereço & Vídeo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', borderBottom: '2px solid var(--bg-subtle)', paddingBottom: '0.5rem' }}>
              3. Localização e Tour Virtual
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Rua / Logradouro
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Rua Francisco Mielzkovski" 
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Bairro
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ex: Centro" 
                  value={formData.neighborhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Cidade / UF
                </label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  IPTU Anual (R$)
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="650" 
                  value={formData.iptu}
                  onChange={(e) => setFormData(prev => ({ ...prev, iptu: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Condomínio Mensal (R$)
                </label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="0" 
                  value={formData.condoFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, condoFee: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
                  Vídeo / Tour Virtual (YouTube/Vimeo)
                </label>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Galeria de Fotos */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
              <ImageIcon size={18} style={{ color: 'var(--accent-red)' }} /> Galeria de Fotos do Imóvel ({images.length} foto(s))
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Faça upload de fotos locais do seu computador ou adicione links de imagens. A primeira foto é automaticamente a Capa Principal.
            </p>

            {/* Upload Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <label className="btn btn-navy btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={15} /> Upload de Fotos Locais
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }}
                />
              </label>

              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
                <input 
                  type="url" 
                  className="input-field" 
                  placeholder="Ou cole o link de uma imagem da internet..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddCustomUrl}>
                  <Plus size={15} /> Adicionar
                </button>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {images.map((imgUrl, idx) => (
                  <div key={idx} style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: idx === 0 ? '2.5px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    <img 
                      src={imgUrl} 
                      alt="" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80'; }}
                    />
                    
                    {idx === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        backgroundColor: 'var(--accent-red)',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}>
                        Capa
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
                      <button 
                        type="button" 
                        onClick={() => moveImage(idx, -1)} 
                        disabled={idx === 0}
                        style={{ color: idx === 0 ? '#CBD5E1' : 'var(--primary-dark)', cursor: idx === 0 ? 'default' : 'pointer', background: 'none', border: 'none' }}
                        title="Mover para esquerda"
                      >
                        <ArrowLeft size={13} />
                      </button>

                      {idx !== 0 && (
                        <button 
                          type="button" 
                          onClick={() => setPrimaryImage(idx)} 
                          style={{ color: 'var(--gold-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                          title="Definir como Foto de Capa"
                        >
                          <Star size={13} />
                        </button>
                      )}

                      <button 
                        type="button" 
                        onClick={() => moveImage(idx, 1)} 
                        disabled={idx === images.length - 1}
                        style={{ color: idx === images.length - 1 ? '#CBD5E1' : 'var(--primary-dark)', cursor: idx === images.length - 1 ? 'default' : 'pointer', background: 'none', border: 'none' }}
                        title="Mover para direita"
                      >
                        <ArrowRight size={13} />
                      </button>

                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)} 
                        style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}
                        title="Remover foto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.25rem 0' }}>
                Nenhuma foto adicionada. Faça upload de fotos ou cole links acima.
              </div>
            )}
          </div>

          {/* Section 5: Diferenciais & Tags */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '2px solid var(--bg-subtle)', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                5. Diferenciais e Comodidades
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Clique nas tags para ativar ou desativar
              </span>
            </div>

            {/* Input to Create New Custom Amenity */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-subtle)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px dashed var(--border-subtle)'
            }}>
              <input
                type="text"
                className="input-field"
                placeholder="Criar nova tag de comodidade (ex: Vista Panorâmica, Aquecimento a Gás...)"
                value={newAmenityInput}
                onChange={(e) => setNewAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateNewAmenity();
                  }
                }}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem', backgroundColor: '#FFFFFF' }}
              />
              <button
                type="button"
                className="btn btn-navy btn-sm"
                onClick={handleCreateNewAmenity}
                style={{ whiteSpace: 'nowrap', fontWeight: 700 }}
              >
                <Plus size={15} /> Adicionar Tag
              </button>
            </div>

            {/* Dynamic Amenity Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
              {availableAmenities.map(amenity => {
                const active = isAmenitySelected(amenity);
                const isCustom = !DEFAULT_AMENITIES.includes(amenity);

                return (
                  <div
                    key={amenity}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: active ? '1px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                      backgroundColor: active ? 'rgba(200, 29, 37, 0.08)' : '#FFFFFF',
                      transition: 'var(--transition)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        color: active ? 'var(--accent-red)' : 'var(--primary-dark)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {active ? <Check size={13} /> : <Tag size={12} style={{ color: 'var(--text-muted)' }} />}
                      <span>{amenity}</span>
                    </button>

                    {isCustom && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAmenityTag(amenity);
                        }}
                        style={{
                          padding: '0.35rem 0.4rem',
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '1px solid rgba(0,0,0,0.05)'
                        }}
                        title={`Remover tag "${amenity}" da lista`}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.3rem', display: 'block' }}>
              Diferenciais em texto (separados por vírgula)
            </label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Cozinha planejada, Sacada gourmet, Portão eletrônico" 
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            />
          </div>

          {/* Section 6: Descrição & Destaque */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', borderBottom: '2px solid var(--bg-subtle)', paddingBottom: '0.5rem' }}>
              6. Descrição Detalhada e Vitrine
            </h4>

            <textarea 
              className="input-field" 
              rows={4} 
              placeholder="Descreva todos os detalhes, pontos fortes, condições de negociação e proximidades deste imóvel..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              style={{ marginBottom: '1.25rem', backgroundColor: 'var(--bg-subtle)' }}
            />

            <div style={{
              backgroundColor: 'var(--gold-subtle)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <input 
                type="checkbox" 
                id="chkFeaturedModal"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-red)' }}
              />
              <label htmlFor="chkFeaturedModal" style={{ fontWeight: 700, color: 'var(--primary-dark)', cursor: 'pointer', fontSize: '0.875rem' }}>
                ⭐ Marcar como Imóvel em Destaque na Vitrine Inicial
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-red" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
              <Save size={18} /> {editingProperty ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
