import React, { useState } from 'react';
import {
  X,
  MapPin,
  Share2,
  Check,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getWhatsAppUrl, SITE_CONFIG } from '../../config';
import { formatMoney } from '../../utils/formatters';
import { getEmbedVideoUrl } from '../../utils/video';

function getQuickMessages(property) {
  const type = (property?.type || '').toLowerCase();
  if (type === 'terreno') {
    return [
      'Gostaria de agendar uma visita ao terreno',
      'Tenho interesse em saber sobre escritura e documentação',
      'Gostaria de avaliar uma proposta à vista'
    ];
  }
  if (type === 'sitio') {
    return [
      'Gostaria de agendar uma visita à propriedade',
      'Quero informações sobre recursos hídricos e acesso',
      'Gostaria de saber se analisa permuta ou proposta'
    ];
  }
  return [
    'Gostaria de agendar uma visita presencial ao imóvel',
    'Este imóvel aceita financiamento bancário?',
    'Gostaria de conversar sobre condições de negociação'
  ];
}

export default function PropertyModal({ property, onClose }) {
  const allImages =
    property?.images && property.images.length > 0
      ? property.images
      : [
          property?.imageUrl ||
            'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const refCode = property.code || property.id;
  const currentImg = allImages[activeIndex] || allImages[0];
  const embedVideoSrc = getEmbedVideoUrl(property.videoUrl);
  const quickMessages = getQuickMessages(property);

  const waUrl = getWhatsAppUrl(
    `Olá Anderson! Gostaria de agendar uma visita ou tirar dúvidas sobre o imóvel "${property.title}" (Ref. ${refCode}) — ${formatMoney(property.price)}.`
  );

  const handleQuickMessage = (msg) => {
    const text = `Olá Anderson! Sobre o imóvel "${property.title}" (Ref. ${refCode}): ${msg}.`;
    window.open(getWhatsAppUrl(text), '_blank');
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/?imovel=${encodeURIComponent(refCode)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const specs = [];
  if (property.area > 0) {
    specs.push({ label: 'Área Construída', value: `${property.area} m²` });
  }
  if (property.landArea > 0) {
    specs.push({ label: 'Área do Terreno', value: `${property.landArea} m²` });
  }
  if (property.bedrooms > 0) {
    specs.push({
      label: 'Dormitórios',
      value: `${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}`
    });
  }
  if (property.suites > 0) {
    specs.push({
      label: 'Suítes',
      value: `${property.suites} ${property.suites === 1 ? 'suíte' : 'suítes'}`
    });
  }
  if (property.bathrooms > 0) {
    specs.push({
      label: 'Banheiros',
      value: `${property.bathrooms} ${property.bathrooms === 1 ? 'banheiro' : 'banheiros'}`
    });
  }
  const garages = property.garages ?? property.garage;
  if (garages > 0) {
    specs.push({
      label: 'Vagas',
      value: `${garages} ${garages === 1 ? 'vaga' : 'vagas'}`
    });
  }
  if (property.iptu > 0) {
    specs.push({ label: 'IPTU Anual', value: formatMoney(property.iptu) });
  }
  if (property.condoFee > 0) {
    specs.push({ label: 'Condomínio', value: formatMoney(property.condoFee) });
  }

  const amenitiesRaw = property.features || property.tags || [];
  const amenities = Array.isArray(amenitiesRaw)
    ? amenitiesRaw
    : typeof amenitiesRaw === 'string'
    ? amenitiesRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        {/* Cabeçalho da Ficha Técnica */}
        <div
          className="modal-header-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
            gap: '1rem'
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.35rem',
                flexWrap: 'wrap'
              }}
            >
              <span className={`badge ${property.purpose === 'aluguel' ? 'badge-aluguel' : 'badge-venda'}`}>
                {property.purpose === 'aluguel' ? 'Locação' : 'Venda'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                Ref. {refCode}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <MapPin size={13} />
                {property.neighborhood ? `${property.neighborhood}, ` : ''}
                {property.city || 'Itaiópolis - SC'}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
                color: 'var(--text-dark)',
                fontWeight: 700,
                lineHeight: 1.25,
                margin: 0
              }}
            >
              {property.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{ textAlign: 'right', marginRight: '0.25rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  whiteSpace: 'nowrap'
                }}
              >
                {formatMoney(property.price)}
                {property.purpose === 'aluguel' && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                    {' '}/mês
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={ onClose }
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
              aria-label="Fechar ficha técnica"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Corpo da Ficha Técnica */}
        <div className="modal-body-container" style={{ padding: '1.5rem 1.75rem 2rem' }}>
          {/* Galeria Principal */}
          <div
            className="modal-photo-viewer"
            style={{
              height: '420px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              position: 'relative',
              backgroundColor: 'var(--bg-subtle)'
            }}
          >
            <img
              src={currentImg}
              alt={`${property.title} - Foto ${activeIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Foto anterior"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: 'var(--text-dark)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Próxima foto"
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: 'var(--text-dark)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '0.85rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.78)',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px'
                  }}
                >
                  {activeIndex + 1} / {allImages.length}
                </span>
              </>
            )}
          </div>

          {/* Miniaturas Clicáveis */}
          {allImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.75rem',
                overflowX: 'auto',
                paddingBottom: '0.35rem'
              }}
            >
              {allImages.map((img, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: '78px',
                      height: '56px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: isSelected
                        ? '2px solid var(--primary-dark)'
                        : '1px solid var(--border-subtle)',
                      opacity: isSelected ? 1 : 0.65,
                      flexShrink: 0,
                      padding: 0,
                      transition: 'var(--transition-fast)'
                    }}
                    aria-label={`Ver miniatura ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Grade Minimalista de Dados Técnicos */}
          {specs.length > 0 && (
            <div
              className="modal-specs-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '0.75rem',
                padding: '1.15rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.75rem'
              }}
            >
              {specs.map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.15rem'
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Descrição do Imóvel */}
          {property.description && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '0.6rem'
                }}
              >
                Sobre o imóvel
              </h3>
              <p
                style={{
                  color: 'var(--text-body)',
                  lineHeight: 1.75,
                  whiteSpace: 'pre-line',
                  fontSize: '0.95rem'
                }}
              >
                {property.description}
              </p>
            </div>
          )}

          {/* Lista Limpa de Comodidades */}
          {amenities.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '0.65rem'
                }}
              >
                Características e comodidades
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {amenities.map((feat, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-dark)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.82rem',
                      fontWeight: 500
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vídeo Embutido (se houver) */}
          {property.videoUrl && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3
                style={{
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Video size={17} style={{ color: 'var(--accent-red)' }} />
                <span>Apresentação em vídeo</span>
              </h3>
              {embedVideoSrc ? (
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <iframe
                    src={embedVideoSrc}
                    title={`Vídeo - ${property.title}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={property.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <Video size={15} /> Assistir vídeo do imóvel
                </a>
              )}
            </div>
          )}

          {/* Bloco Único e Direto de Contato com Anderson Kunicki */}
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.15rem'
              }}
            >
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {SITE_CONFIG.brokerName}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Corretor de Imóveis · {SITE_CONFIG.creci} · Atendimento direto
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn btn-outline"
                  style={{ padding: '0.68rem 1rem', fontSize: '0.85rem' }}
                >
                  {copied ? <Check size={15} style={{ color: '#15803D' }} /> : <Share2 size={15} />}
                  <span>{copied ? 'Link copiado' : 'Copiar link'}</span>
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ padding: '0.68rem 1.25rem', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  <WhatsAppIcon size={16} color="#FFFFFF" />
                  <span>Agendar visita ou tirar dúvidas no WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 3 Opções Rápidas de Mensagem */}
            <div
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Ou envie uma pergunta direta com 1 clique:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {quickMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickMessage(msg)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--text-body)',
                      textAlign: 'left',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-dark)';
                      e.currentTarget.style.color = 'var(--text-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--text-body)';
                    }}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
