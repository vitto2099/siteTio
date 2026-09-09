import React, { useState } from 'react';
import { MapPin, Maximize2, Bed, Bath, Car, Star, Eye, Camera, Share2, Check } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getWhatsAppUrl } from '../../config';
import { formatMoney } from '../../utils/formatters';

export default function PropertyCard({ property, onSelectProperty }) {
  const [copied, setCopied] = useState(false);
  const refCode = property.code || property.id;
  const waUrl = getWhatsAppUrl(`Olá Anderson! Tenho interesse no imóvel "${property.title}" (Ref: ${refCode}) no valor de ${formatMoney(property.price)}.`);

  const coverPhoto = property.imageUrl || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  const totalPhotos = property.images && property.images.length > 0 ? property.images.length : (property.imageUrl ? 1 : 0);

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?imovel=${encodeURIComponent(refCode)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="property-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Imagem com Proporção Limpa 16:10 */}
      <div 
        style={{ position: 'relative', height: '240px', overflow: 'hidden', backgroundColor: '#F1F5F9', cursor: 'pointer' }}
        onClick={() => onSelectProperty(property)}
      >
        <img 
          src={coverPhoto} 
          alt={`${property.title} em ${property.neighborhood || 'Itaiópolis'} - SC`} 
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'; }}
        />

        {/* Gradiente sutil para contraste dos selos */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        {/* Selos Limpos Topo Esquerdo */}
        <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', zIndex: 2 }}>
          <span style={{
            backgroundColor: property.purpose === 'venda' ? '#0B192C' : '#0369A1',
            color: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
            letterSpacing: '0.04em'
          }}>
            {property.purpose === 'venda' ? 'VENDA' : 'LOCAÇÃO'}
          </span>
          {property.featured && (
            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Star size={11} fill="currentColor" /> DESTAQUE
            </span>
          )}
        </div>

        {/* Ações Topo Direito: Contador e Compartilhar */}
        <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', display: 'flex', gap: '0.4rem', zIndex: 2 }}>
          {totalPhotos > 0 && (
            <span style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#FFFFFF',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Camera size={12} /> {totalPhotos}
            </span>
          )}
          <button
            onClick={handleShare}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: copied ? '#4ADE80' : '#FFFFFF',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title={copied ? 'Link copiado!' : 'Copiar link do imóvel'}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
          </button>
        </div>

        {/* Código de Referência */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.85rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#0F172A',
          padding: '0.2rem 0.55rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.04em'
        }}>
          REF: {refCode}
        </div>
      </div>

      {/* Conteúdo do Card Estilo Portal Imobiliário */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* Preço em Destaque Principal */}
        <div style={{ fontSize: '1.38rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {formatMoney(property.price)}
          {property.purpose === 'aluguel' && <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}> /mês</span>}
        </div>

        {/* Título do Imóvel */}
        <h3 
          onClick={() => onSelectProperty(property)}
          style={{ 
            fontSize: '1.05rem', 
            fontWeight: 700, 
            color: '#1E293B', 
            marginBottom: '0.45rem', 
            lineHeight: 1.35,
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0B192C'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#1E293B'; }}
        >
          {property.title}
        </h3>

        {/* Localização */}
        <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
          <MapPin size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
          <span>{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city || 'Itaiópolis'} - SC</span>
        </div>

        {/* Informações Técnicas Clássicas */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 0.5rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          color: '#334155',
          border: '1px solid #E2E8F0'
        }}>
          {property.area > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }} title="Área">
              <Maximize2 size={14} style={{ color: '#64748B' }} /> {property.area} m²
            </div>
          )}
          {property.bedrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }} title="Quartos">
              <Bed size={14} style={{ color: '#64748B' }} /> {property.bedrooms} {property.bedrooms === 1 ? 'qto' : 'qtos'}
            </div>
          )}
          {property.bathrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }} title="Banheiros">
              <Bath size={14} style={{ color: '#64748B' }} /> {property.bathrooms} ban
            </div>
          )}
          {(property.garages > 0 || property.garage > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }} title="Vagas">
              <Car size={14} style={{ color: '#64748B' }} /> {property.garages ?? property.garage} vg
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
          <button 
            className="btn btn-outline" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem', fontWeight: 700, borderRadius: '8px', borderColor: '#CBD5E1' }}
            onClick={() => onSelectProperty(property)}
          >
            <Eye size={14} /> Detalhes
          </button>

          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem', fontWeight: 700, borderRadius: '8px' }}
          >
            <WhatsAppIcon size={15} color="#FFFFFF" /> WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
