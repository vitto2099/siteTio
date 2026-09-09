import React from 'react';
import { MapPin, Mail, Facebook, Instagram, ShieldCheck, Scale, Award, FileCheck, Navigation } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function AboutContact() {
  const waUrl = getWhatsAppUrl("Olá Anderson! Vim pelo site e gostaria de agendar uma consultoria imobiliária.");

  const differentials = [
    { icon: Scale, title: "Segurança Jurídica", desc: "Análise minuciosa de matrículas, certidões e histórico do imóvel." },
    { icon: Award, title: "Avaliação Justa", desc: "Precificação alinhada à realidade de mercado de Itaiópolis e região." },
    { icon: FileCheck, title: "Contratos Blindados", desc: "Elaboração de minutas transparentes para total tranquilidade das partes." },
    { icon: ShieldCheck, title: "CRECI Regularizado", desc: "Intermediação oficial com responsabilidade técnica e ética profissional." }
  ];

  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-main)' }} id="sobre">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sobre o Corretor
          </span>
          <h2 style={{ fontSize: '2.4rem', margin: '0.4rem 0', fontWeight: 900, color: 'var(--primary-dark)' }}>
            Experiência & Dedicação Imobiliária
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Mais do que intermediar imóveis, conectamos pessoas a novos começos com ética e transparência.
          </p>
        </div>

        {/* Main About Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          marginBottom: '4rem'
        }}>
          {/* Photo Column with Luxury Framing */}
          <div style={{ 
            backgroundColor: 'var(--primary-dark)', 
            position: 'relative', 
            minHeight: '480px',
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
            {/* Subtle Gradient Shadow for Badge readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7, 21, 39, 0.85) 0%, rgba(7, 21, 39, 0.2) 30%, transparent 60%)',
              pointerEvents: 'none'
            }} />
            
            {/* Verified Floating Badge */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              backgroundColor: 'rgba(7, 21, 39, 0.92)',
              backdropFilter: 'blur(12px)',
              color: '#FFFFFF',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              zIndex: 2
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.875rem' }}>Registro Oficial Homologado</strong>
                <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>CRECI-SC 60173 F • Santa Catarina</span>
              </div>
            </div>
          </div>

          {/* Bio & Contact Column */}
          <div style={{ padding: 'clamp(2rem, 5vw, 3.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--accent-red-subtle)',
              color: 'var(--accent-red)',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-xs)',
              marginBottom: '1rem',
              width: 'fit-content',
              letterSpacing: '0.05em'
            }}>
              CRECI-SC 60173 F
            </div>

            <h3 style={{ fontSize: '2.25rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontWeight: 900 }}>
              Anderson Kunicki
            </h3>

            <p style={{ color: 'var(--text-body)', fontSize: '1.025rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              Atuando com compromisso no mercado imobiliário de <strong>Itaiópolis e todo o Planalto Norte Catarinense</strong>, prestamos assessoria completa para quem deseja comprar, vender, alugar ou avaliar imóveis urbanos e rurais. Garantimos segurança jurídica, suporte no financiamento bancário e atendimento de alto padrão.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Sede de Atendimento</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>{SITE_CONFIG.fullAddress}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>E-mail Direto</strong>
                  <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: 'var(--accent-red)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', backgroundColor: '#FDF2F8', color: '#E1306C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Instagram size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Instagram Oficial</strong>
                  <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', fontWeight: 700, fontSize: '0.95rem' }}>
                    {SITE_CONFIG.instagramHandle || '@kunickianderson'}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', backgroundColor: '#EFF6FF', color: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Facebook size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Facebook Oficial</strong>
                  <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F2', fontWeight: 700, fontSize: '0.95rem' }}>
                    facebook.com/anderson.kunicki.9
                  </a>
                </div>
              </div>
            </div>

            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: 'fit-content', padding: '0.9rem 1.8rem', fontWeight: 800, fontSize: '1rem' }}>
              <WhatsAppIcon size={20} color="#FFFFFF" /> Iniciar Conversa no WhatsApp
            </a>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4.5rem'
        }}>
          {differentials.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '2rem 1.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Icon size={24} />
                </div>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Map Section */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Visite Nosso Escritório
          </span>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary-dark)', margin: '0.3rem 0', fontWeight: 900 }}>
            Localização em Itaiópolis - SC
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Rua Francisco Mielzkovski, 173 - Centro. Fácil acesso para você nos visitar e planejar seu investimento imobiliário.
          </p>
        </div>

        <div style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-subtle)',
          height: '440px',
          width: '100%',
          position: 'relative'
        }}>
          <iframe 
            title="Mapa de Localização do Escritório - Anderson Kunicki Imóveis"
            src="https://maps.google.com/maps?q=Rua%20Francisco%20Mielzkovski,%20173%20Itai%C3%B3polis%20-%20SC&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}
