import React, { useState } from 'react';
import { MapPin, Maximize2, Bed, Bath, Car, Star, Eye, Play, Camera, Share2, Check } from 'lucide-react';
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
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        transition: 'var(--transition-smooth)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(18, 59, 107, 0.1)';
        e.currentTarget.style.borderColor = 'var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {/* Image & Badges */}
      <div 
        style={{ position: 'relative', height: '250px', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', cursor: 'pointer' }}
        onClick={() => onSelectProperty(property)}
      >
        <img 
          src={coverPhoto} 
          alt={`${property.title} em ${property.neighborhood || 'Itaiópolis'} - SC`} 
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'; }}
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7, 21, 39, 0.8) 0%, rgba(7, 21, 39, 0) 50%, rgba(7, 21, 39, 0.4) 100%)',
          pointerEvents: 'none'
        }} />
        
        {/* Floating Badges Top Left */}
        <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', zIndex: 2 }}>
          <span className={`badge ${property.purpose === 'venda' ? 'badge-venda' : 'badge-aluguel'}`}>
            {property.purpose.toUpperCase()}
          </span>
          {property.featured && (
            <span className="badge badge-featured" style={{ fontWeight: 800 }}>
              <Star size={11} fill="currentColor" /> DESTAQUE
            </span>
          )}
          {property.status === 'vendido' && (
            <span className="badge badge-sold">VENDIDO</span>
          )}
          {property.status === 'reservado' && (
            <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>RESERVADO</span>
          )}
          {property.videoUrl && (
            <span className="badge" style={{ backgroundColor: '#EDE9FE', color: '#6D28D9', border: '1px solid #DDD6FE' }}>
              <Play size={10} fill="currentColor" /> TOUR VÍDEO
            </span>
          )}
        </div>

        {/* Quick Action Top Right: Photo Count & Share */}
        <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', display: 'flex', gap: '0.4rem', zIndex: 2 }}>
          {totalPhotos > 0 && (
            <span style={{
              backgroundColor: 'rgba(7, 21, 39, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Camera size={12} /> {totalPhotos}
            </span>
          )}
          <button
            onClick={handleShare}
            style={{
              backgroundColor: 'rgba(7, 21, 39, 0.75)',
              backdropFilter: 'blur(6px)',
              color: copied ? '#22C55E' : '#FFFFFF',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-xs)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            title={copied ? 'Link copiado!' : 'Copiar link do imóvel'}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
          </button>
        </div>

        {/* Ref Code Tag Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '0.85rem',
          left: '0.85rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: 'var(--primary-dark)',
          padding: '0.2rem 0.55rem',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          boxShadow: 'var(--shadow-xs)'
        }}>
          REF: {refCode}
        </div>

        {/* Price tag overlay bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '0.85rem',
          right: '0.85rem',
          background: 'linear-gradient(135deg, #071527 0%, #0B2240 100%)',
          color: '#FFFFFF',
          padding: '0.4rem 0.9rem',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          border: '1px solid rgba(212, 175, 55, 0.4)'
        }}>
          {formatMoney(property.price)}{property.purpose === 'aluguel' ? <span style={{ fontSize: '0.75rem', fontWeight: 400, opacity: 0.8 }}>/mês</span> : ''}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {property.type}
          </span>
          {property.suites > 0 && (
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-blue)', backgroundColor: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
              {property.suites} {property.suites === 1 ? 'Suíte' : 'Suítes'}
            </span>
          )}
        </div>

        <h3 
          onClick={() => onSelectProperty(property)}
          style={{ 
            fontSize: '1.18rem', 
            fontWeight: 800, 
            color: 'var(--primary-dark)', 
            marginBottom: '0.5rem', 
            lineHeight: 1.35,
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary-blue)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--primary-dark)'; }}
        >
          {property.title}
        </h3>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
          <MapPin size={15} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
          <span>{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city || 'Itaiópolis - SC'}</span>
        </div>

        {/* Features Specs Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 0.5rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.35rem',
          fontSize: '0.85rem',
          color: 'var(--text-body)',
          border: '1px solid var(--border-subtle)'
        }}>
          {property.area > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }} title="Área Total / Construída">
              <Maximize2 size={15} style={{ color: 'var(--primary-blue)' }} /> {property.area} m²
            </div>
          )}
          {property.bedrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }} title="Quartos">
              <Bed size={15} style={{ color: 'var(--primary-blue)' }} /> {property.bedrooms} {property.bedrooms === 1 ? 'Qto' : 'Qtos'}
            </div>
          )}
          {property.bathrooms > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }} title="Banheiros">
              <Bath size={15} style={{ color: 'var(--primary-blue)' }} /> {property.bathrooms} {property.bathrooms === 1 ? 'Ban' : 'Bans'}
            </div>
          )}
          {(property.garages > 0 || property.garage > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }} title="Vagas de Garagem">
              <Car size={15} style={{ color: 'var(--primary-blue)' }} /> {property.garages ?? property.garage} {(property.garages || property.garage) === 1 ? 'Vg' : 'Vgs'}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto' }}>
          <button 
            className="btn btn-outline" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.65rem', fontWeight: 700 }}
            onClick={() => onSelectProperty(property)}
          >
            <Eye size={15} /> Ver Detalhes
          </button>

          <a 
            href={waUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-whatsapp" 
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.65rem', fontWeight: 700 }}
          >
            <WhatsAppIcon size={16} color="#FFFFFF" /> WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
