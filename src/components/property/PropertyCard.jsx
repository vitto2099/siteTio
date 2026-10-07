import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatMoney } from '../../utils/formatters';

export default function PropertyCard({ property, onSelectProperty }) {
  const refCode = property.code || property.id;
  const coverPhoto =
    property.imageUrl ||
    (property.images && property.images[0]) ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const specs = [];
  const mainArea = property.area || property.landArea;
  if (mainArea > 0) {
    specs.push(`${mainArea} m²`);
  }
  if (property.bedrooms > 0) {
    specs.push(`${property.bedrooms} ${property.bedrooms === 1 ? 'quarto' : 'quartos'}`);
  }
  if (property.bathrooms > 0) {
    specs.push(`${property.bathrooms} ${property.bathrooms === 1 ? 'banheiro' : 'banheiros'}`);
  }
  const garageCount = property.garages ?? property.garage;
  if (garageCount > 0) {
    specs.push(`${garageCount} ${garageCount === 1 ? 'vaga' : 'vagas'}`);
  }
  if (specs.length === 0) {
    const typeLabel =
      property.type === 'terreno'
        ? 'Terreno urbano'
        : property.type === 'sitio'
        ? 'Propriedade rural'
        : property.type === 'comercial'
        ? 'Imóvel comercial'
        : 'Imóvel residencial';
    specs.push(typeLabel);
  }

  const cityClean = (property.city || 'Itaiópolis/SC').replace(' - ', '/');
  const locationText = property.neighborhood
    ? `${property.neighborhood} · ${cityClean}`
    : cityClean;

  return (
    <article
      className="property-card"
      onClick={() => onSelectProperty(property)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      }}
    >
      {/* Imagem em Proporção 16:10 */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-subtle)'
        }}
      >
        <img
          src={coverPhoto}
          alt={`${property.title} — ${locationText}`}
          className="property-card-img"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Badges Discretos no Canto Superior Esquerdo */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
            zIndex: 2
          }}
        >
          <span
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.24rem 0.65rem',
              borderRadius: 'var(--radius-xs)',
              letterSpacing: '0.02em'
            }}
          >
            {property.purpose === 'aluguel' ? 'Locação' : 'Venda'}
          </span>

          {property.featured && (
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                color: 'var(--accent-red)',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.24rem 0.65rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid rgba(139, 30, 36, 0.2)'
              }}
            >
              Destaque
            </span>
          )}
        </div>

        {/* Código de Referência Discreto */}
        <span
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            color: 'var(--text-dark)',
            padding: '0.18rem 0.55rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.02em'
          }}
        >
          Ref. {refCode}
        </span>
      </div>

      {/* Corpo Editorial do Card */}
      <div
        style={{
          padding: '1.25rem 1.35rem 1.3rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        {/* Localização */}
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginBottom: '0.3rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {locationText}
        </div>

        {/* Título do Imóvel */}
        <h3
          style={{
            fontSize: '1.06rem',
            fontWeight: 700,
            color: 'var(--text-dark)',
            lineHeight: 1.35,
            marginBottom: '0.65rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em'
          }}
        >
          {property.title}
        </h3>

        {/* Linha Horizontal Limpa de Especificações */}
        <div
          style={{
            fontSize: '0.84rem',
            color: 'var(--text-body)',
            fontWeight: 500,
            marginBottom: '1.15rem',
            lineHeight: 1.4
          }}
        >
          {specs.join(' · ')}
        </div>

        {/* Rodapé: Preço à Esquerda e Ver Detalhes à Direita */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.95rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.22rem',
                fontWeight: 700,
                color: 'var(--text-dark)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              {formatMoney(property.price)}
              {property.purpose === 'aluguel' && (
                <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  {' '}/mês
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProperty(property);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--primary-dark)',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = 'var(--primary-dark)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-main)';
              e.currentTarget.style.color = 'var(--text-dark)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <span>Ver detalhes</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
