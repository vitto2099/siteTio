import React, { useState } from 'react';
import { X, MapPin, Maximize2, Bed, Bath, Car, CheckCircle2, Share2, Check, Video, Home, Layers } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getWhatsAppUrl, SITE_CONFIG } from '../../config';
import { formatMoney } from '../../utils/formatters';
import { getEmbedVideoUrl } from '../../utils/video';

export default function PropertyModal({ property, onClose }) {
  const [selectedImg, setSelectedImg] = useState(property?.imageUrl || (property?.images && property.images[0]));
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const refCode = property.code || property.id;
  const waUrl = getWhatsAppUrl(`Olá Anderson Kunicki! Gostaria de agendar uma visita e tirar dúvidas sobre o imóvel: "${property.title}" (Ref: ${refCode}) - Valor: ${formatMoney(property.price)}.`);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?imovel=${encodeURIComponent(refCode)}`;
    navigator.clipboard.writeText(`${property.title} (Ref: ${refCode}) - ${formatMoney(property.price)}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const allImages = property.images && property.images.length > 0 ? property.images : [property.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'];
  const embedVideoSrc = getEmbedVideoUrl(property.videoUrl);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className={`badge ${property.purpose === 'venda' ? 'badge-venda' : 'badge-aluguel'}`}>
                {property.purpose.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', backgroundColor: 'var(--accent-red-subtle)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                Ref: {refCode}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: 0, fontWeight: 800 }}>
              {property.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline btn-sm"
              title="Copiar dados para compartilhar"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
            >
              {copied ? <Check size={14} style={{ color: '#16A34A' }} /> : <Share2 size={14} />}
              {copied ? 'Copiado!' : 'Compartilhar'}
            </button>

            <button 
              onClick={onClose} 
              style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', cursor: 'pointer' }}
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem' }}>
          {/* Photo Viewer */}
          <div style={{ height: '390px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', position: 'relative', backgroundColor: 'var(--bg-subtle)' }}>
            <img 
              src={selectedImg || allImages[0]} 
              alt={property.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'; }}
            />
          </div>

          {/* Image Thumbnails Strip */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {allImages.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="" 
                  onClick={() => setSelectedImg(img)}
                  style={{
                    width: '80px',
                    height: '60px',
                    borderRadius: 'var(--radius-xs)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: (selectedImg === img || (!selectedImg && idx === 0)) ? '2.5px solid var(--accent-red)' : '1px solid var(--border-subtle)',
                    opacity: (selectedImg === img || (!selectedImg && idx === 0)) ? 1 : 0.75,
                    transition: 'var(--transition)'
                  }}
                />
              ))}
            </div>
          )}

          {/* Price & Address Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} style={{ color: 'var(--accent-red)' }} />
                <span>{property.address ? `${property.address}, ` : ''}{property.neighborhood ? `${property.neighborhood} - ` : ''}{property.city || 'Itaiópolis - SC'}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>
                Tipo: <strong style={{ color: 'var(--primary-dark)', textTransform: 'capitalize' }}>{property.type}</strong> • Código: <strong>{refCode}</strong>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
              {formatMoney(property.price)} {property.purpose === 'aluguel' ? <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mês</span> : ''}
            </div>
          </div>

          {/* Main Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {property.area > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Área Construída</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Maximize2 size={16} style={{ color: 'var(--primary-blue)' }} /> {property.area} m²
                </div>
              </div>
            )}

            {property.landArea > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Área do Terreno</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={16} style={{ color: 'var(--primary-blue)' }} /> {property.landArea} m²
                </div>
              </div>
            )}

            {property.bedrooms > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quartos</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Bed size={16} style={{ color: 'var(--primary-blue)' }} /> {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
                </div>
              </div>
            )}

            {property.suites > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suítes</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Home size={16} style={{ color: 'var(--gold-primary)' }} /> {property.suites} {property.suites === 1 ? 'suíte' : 'suítes'}
                </div>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Banheiros</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Bath size={16} style={{ color: 'var(--primary-blue)' }} /> {property.bathrooms} banh
                </div>
              </div>
            )}

            {(property.garages > 0 || property.garage > 0) && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: 600 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vagas Garagem</div>
                <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Car size={16} style={{ color: 'var(--primary-blue)' }} /> {property.garages ?? property.garage} vg
                </div>
              </div>
            )}
          </div>

          {/* Extra Financial Details */}
          {(property.iptu > 0 || property.condoFee > 0) && (
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {property.iptu > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>IPTU Anual: </span>
                  <strong>{formatMoney(property.iptu)}</strong>
                </div>
              )}
              {property.condoFee > 0 && (
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Condomínio Mensal: </span>
                  <strong>{formatMoney(property.condoFee)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Virtual Tour / Video Section */}
          {property.videoUrl && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                <Video size={18} style={{ color: 'var(--accent-red)' }} /> Tour Virtual em Vídeo
              </h4>
              {embedVideoSrc ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <iframe 
                    src={embedVideoSrc} 
                    title={`Tour Virtual - ${property.title}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a href={property.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <Video size={16} /> Assistir Tour Virtual Externo
                </a>
              )}
            </div>
          )}

          {/* Features Tags */}
          {((property.features && property.features.length > 0) || (property.tags && property.tags.length > 0)) && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.75rem', fontWeight: 700 }}>Diferenciais & Comodidades</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(property.features || property.tags).map((feat, idx) => (
                  <span key={idx} style={{
                    backgroundColor: 'var(--accent-red-subtle)',
                    color: 'var(--accent-red)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <CheckCircle2 size={13} /> {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>Descrição do Imóvel</h4>
              <p style={{ color: 'var(--text-body)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{property.description}</p>
            </div>
          )}

          {/* Broker Contact Box */}
          <div style={{
            backgroundColor: 'var(--primary-dark)',
            color: '#FFFFFF',
            padding: '1.5rem 1.75rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1.15rem', margin: '0 0 0.2rem' }}>{SITE_CONFIG.brokerName}</h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>{SITE_CONFIG.creci} • Atendimento direto via WhatsApp</p>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}>
              <WhatsAppIcon size={19} color="#FFFFFF" /> Agendar Visita pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
