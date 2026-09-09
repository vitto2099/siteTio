import React from 'react';
import { MapPin, Mail, Facebook, Instagram, ShieldCheck, CheckCircle2, Phone, Clock } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function AboutContact() {
  const waUrl = getWhatsAppUrl("Olá Anderson! Vim pelo site e gostaria de agendar uma consultoria imobiliária.");

  const services = [
    { title: "Segurança Jurídica", desc: "Análise minuciosa de matrículas, certidões negativas e histórico do imóvel para uma compra 100% segura." },
    { title: "Avaliação Justa de Mercado", desc: "Precificação precisa alinhada à realidade de compra e venda em Itaiópolis e cidades vizinhas." },
    { title: "Apoio em Financiamentos", desc: "Orientação e assessoria completa nos processos de crédito habitacional (Caixa Econômica, BB e bancos privados)." },
    { title: "Atendimento Personalizado", desc: "Negociação direta com o corretor responsável, com transparência e ética do início à entrega das chaves." }
  ];

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#F8FAFC' }} id="sobre">
      <div className="container">
        
        {/* Cabeçalho da Seção */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0B192C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sobre o Profissional
          </span>
          <h2 style={{ fontSize: '2.25rem', margin: '0.5rem 0', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Anderson Kunicki Corretor Imobiliário
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Compromisso, ética e conhecimento prático do mercado imobiliário de Itaiópolis e Planalto Norte Catarinense.
          </p>
        </div>

        {/* Card Principal de Apresentação */}
        <div className="about-main-card" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          marginBottom: '3.5rem'
        }}>
          {/* Coluna da Foto do Anderson */}
          <div style={{ 
            backgroundColor: '#0F172A', 
            position: 'relative', 
            minHeight: 'clamp(280px, 45vh, 440px)',
            overflow: 'hidden'
          }}>
            <img 
              src="/anderson-kunicki.jpg" 
              alt="Anderson Kunicki Corretor Imobiliário CRECI-SC 60173 F" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'center 15%',
                display: 'block'
              }}
              onError={(e) => { e.target.src = '/banner.jpg'; }}
            />
            
            {/* Selo do CRECI no pé da foto */}
            <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              right: '1.25rem',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              padding: '0.75rem 1.15rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 2
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#1E293B',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Corretor Credenciado</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{SITE_CONFIG.creci} • Santa Catarina</div>
              </div>
            </div>
          </div>

          {/* Coluna do Conteúdo / Biografia */}
          <div className="about-bio-column" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Atendimento Dedicado
            </span>
            <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.65rem)', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', lineHeight: 1.25 }}>
              Segurança e tranquilidade para o seu patrimônio
            </h3>
            
            <p style={{ color: '#475569', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Atuando no mercado imobiliário de Itaiópolis e região, Anderson Kunicki oferece assessoria completa na compra, venda e locação de casas, terrenos urbanos e propriedades rurais.
            </p>

            <p style={{ color: '#475569', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Cada negociação é conduzida com atenção rigorosa à documentação, histórico cartorário e viabilidade financeira, assegurando que você faça o melhor negócio com total clareza e respaldo técnico.
            </p>

            {/* Ações de Contato Direto */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a 
                href={waUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp" 
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                <WhatsAppIcon size={18} color="#FFFFFF" /> Falar no WhatsApp
              </a>

              <a 
                href={`tel:${SITE_CONFIG.phoneRaw}`} 
                className="btn btn-outline" 
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem', borderRadius: '10px', borderColor: '#CBD5E1' }}
              >
                <Phone size={16} /> {SITE_CONFIG.phoneFormatted}
              </a>
            </div>
          </div>
        </div>

        {/* Grade de 4 Pilares Profissionais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {services.map((item, idx) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: '#16A34A', flexShrink: 0 }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  {item.title}
                </h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Localização do Escritório e Informações Práticas */}
        <div className="about-office-card" style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B192C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Endereço do Escritório
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.4rem 0 1rem' }}>
              Venha tomar um café conosco
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: '#0B192C', flexShrink: 0, marginTop: '2px' }} />
                <span>{SITE_CONFIG.fullAddress}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: '#0B192C', flexShrink: 0 }} />
                <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: '#0B192C', fontWeight: 600 }}>{SITE_CONFIG.email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: '#0B192C', flexShrink: 0 }} />
                <span>Segunda a Sexta: 08:30 às 18:00 • Sábados: 08:30 às 12:00</span>
              </div>
            </div>
          </div>

          {/* Mapa do Google Maps */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '220px', border: '1px solid #E2E8F0' }}>
            <iframe
              title="Localização do Escritório Anderson Kunicki em Itaiópolis"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://maps.google.com/maps?q=Rua+Francisco+Mielzkovski,+173+-+Centro,+Itai%C3%B3polis+-+SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
