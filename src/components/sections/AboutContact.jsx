import React from 'react';
import {
  MapPin,
  Mail,
  ShieldCheck,
  Phone,
  Clock,
  Navigation,
  Compass
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function AboutContact() {
  const waUrl = getWhatsAppUrl(
    'Olá Anderson! Vim pelo site e gostaria de agendar uma consultoria imobiliária.'
  );

  const pillars = [
    {
      title: 'Rigor Documental e Jurídico',
      desc: 'Análise prévia de matrículas, certidões e histórico registral para garantir negociações seguras e sem imprevistos.'
    },
    {
      title: 'Avaliação Técnica de Mercado',
      desc: 'Precificação fundamentada na realidade de liquidez de Itaiópolis e do Planalto Norte Catarinense.'
    },
    {
      title: 'Assessoria em Financiamentos',
      desc: 'Acompanhamento completo em processos de crédito imobiliário junto à Caixa, Banco do Brasil e instituições privadas.'
    },
    {
      title: 'Atendimento Direto',
      desc: 'Trato direto com o corretor responsável em todas as etapas, da visita técnica à assinatura da escritura.'
    }
  ];

  return (
    <section style={{ padding: '4rem 0 5rem', backgroundColor: 'var(--bg-main)' }} id="sobre">
      <div className="container">
        {/* Cabeçalho Editorial */}
        <div style={{ maxWidth: '680px', marginBottom: '2.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--brand-red-solid)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '0.4rem'
            }}
          >
            Sobre e Contato
          </span>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
              fontWeight: 800,
              color: 'var(--text-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '0.65rem'
            }}
          >
            Anderson Kunicki · Corretor de Imóveis
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '1rem', lineHeight: 1.65 }}>
            Atuação ética, transparente e próxima da realidade urbana e rural de Itaiópolis e região.
          </p>
        </div>

        {/* Bloco Principal: Retrato + Biografia com Identidade Visual Oficial */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            marginBottom: '2.75rem'
          }}
        >
          {/* Coluna da Foto */}
          <div
            style={{
              backgroundColor: '#0B0F14',
              position: 'relative',
              minHeight: 'clamp(320px, 44vh, 460px)',
              overflow: 'hidden'
            }}
          >
            <img
              src="/anderson-kunicki.jpg"
              alt="Anderson Kunicki — Corretor de Imóveis CRECI-SC 60173 F"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/banner.jpg';
              }}
            />

            {/* Assinatura CRECI com Emblema AK Oficial */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'rgba(11, 15, 20, 0.94)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderLeft: '4px solid var(--brand-red-top)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '0.3rem 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <img
                  src="/logo-icon.png"
                  alt="Símbolo AK"
                  style={{ height: '30px', width: 'auto', display: 'block' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Corretor Credenciado</span>
                  <ShieldCheck size={15} style={{ color: '#FF4D4D' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                  {SITE_CONFIG.creci} · Santa Catarina
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Biográfica com Logomarca Oficial */}
          <div
            style={{
              padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: '1.35rem' }}>
              <img
                src="/logo-full.png"
                alt="Anderson Kunicki — Corretor de Imóveis — CRECI-SC 60173 F"
                style={{
                  height: '115px',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.25rem, 2.4vw, 1.55rem)',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: '1rem',
                lineHeight: 1.28
              }}
            >
              Segurança patrimonial em cada etapa da negociação
            </h2>

            <p
              style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '0.95rem'
              }}
            >
              Com foco em Itaiópolis e municípios vizinhos, Anderson Kunicki presta consultoria completa na compra, venda e locação de residências, lotes urbanos, áreas comerciais e propriedades rurais.
            </p>

            <p
              style={{
                color: 'var(--text-body)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '1.65rem'
              }}
            >
              Cada imóvel passa por verificação criteriosa de documentação, divisas e viabilidade financeira, proporcionando tranquilidade tanto para quem vende quanto para quem adquire ou aluga.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red"
              >
                <WhatsAppIcon size={17} color="#FFFFFF" />
                <span>Conversar pelo WhatsApp</span>
              </a>

              <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="btn btn-outline">
                <Phone size={15} />
                <span>{SITE_CONFIG.phoneFormatted}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Grade dos 4 Pilares de Trabalho */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '1.25rem',
            marginBottom: '2.75rem'
          }}
        >
          {pillars.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '1.4rem',
                border: '1px solid var(--border-subtle)',
                borderTop: '3px solid var(--brand-red-solid)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--brand-red-solid)',
                  marginBottom: '0.4rem',
                  letterSpacing: '0.04em'
                }}
              >
                0{idx + 1}
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.45rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Escritório e Mapa */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: 'clamp(1.5rem, 3vw, 2.25rem)',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--brand-red-solid)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Atendimento Presencial
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0.35rem 0 1rem' }}>
              Escritório em Itaiópolis
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.92rem',
                color: 'var(--text-body)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                <MapPin size={17} style={{ color: 'var(--brand-red-solid)', flexShrink: 0, marginTop: '2px' }} />
                <span>{SITE_CONFIG.fullAddress}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Mail size={17} style={{ color: 'var(--brand-red-solid)', flexShrink: 0 }} />
                <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: 'var(--text-dark)', fontWeight: 600 }}>
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Clock size={17} style={{ color: 'var(--brand-red-solid)', flexShrink: 0 }} />
                <span>Segunda a Sexta: 08:30 às 18:00 · Sábados: 08:30 às 12:00</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.35rem' }}>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-26.332491,-49.906809"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Navigation size={14} />
                <span>Rota no Google Maps</span>
              </a>

              <a
                href="https://waze.com/ul?ll=-26.332491,-49.906809&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <Compass size={14} />
                <span>Abrir no Waze</span>
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              height: '260px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <iframe
              title="Localização do Escritório Anderson Kunicki em Itaiópolis"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src="https://maps.google.com/maps?q=-26.332491,-49.906809+(Anderson+Kunicki+Corretor+Imobiliario)&t=&z=17&ie=UTF8&iwloc=&output=embed"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
