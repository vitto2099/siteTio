import React from 'react';
import { ShieldCheck, ArrowLeft, Mail } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { SITE_CONFIG, getWhatsAppUrl } from '../../config';

export default function PrivacyPage({ onBackToCatalog }) {
  const waUrl = getWhatsAppUrl(
    'Olá Anderson! Tenho uma dúvida sobre privacidade e tratamento de dados.'
  );

  return (
    <section style={{ padding: '4rem 0 5rem', backgroundColor: 'var(--bg-main)' }} id="privacidade">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Voltar */}
        <div style={{ marginBottom: '1.75rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onBackToCatalog}
          >
            <ArrowLeft size={15} />
            <span>Voltar ao catálogo</span>
          </button>
        </div>

        {/* Documento Editorial */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            padding: 'clamp(1.75rem, 4vw, 3rem)',
            lineHeight: 1.75
          }}
        >
          <div
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: 'var(--accent-red)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.6rem'
              }}
            >
              <ShieldCheck size={15} />
              <span>Conformidade com a LGPD (Lei nº 13.709/2018)</span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                color: 'var(--text-dark)',
                fontWeight: 700,
                marginBottom: '0.4rem'
              }}
            >
              Política de Privacidade e Termos de Uso
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              {SITE_CONFIG.brokerName} · {SITE_CONFIG.creci} · Itaiópolis/SC
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: 'var(--text-body)', fontSize: '0.95rem' }}>
            <p>
              Esta Política de Privacidade descreve como as informações são tratadas no site de{' '}
              <strong style={{ color: 'var(--text-dark)' }}>{SITE_CONFIG.brokerName}</strong> ({SITE_CONFIG.creci}),
              em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
            </p>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                1. Coleta e Minimização de Dados
              </h2>
              <p style={{ marginBottom: '0.5rem' }}>
                Operamos sob o princípio da necessidade e minimização de dados. Não exigimos cadastro prévio para consulta ao catálogo de imóveis. As informações tratadas limitam-se a:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>
                  <strong style={{ color: 'var(--text-dark)' }}>Contato voluntário:</strong> Nome, telefone e mensagem compartilhados voluntariamente pelo usuário ao iniciar atendimento via WhatsApp ou e-mail.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-dark)' }}>Dados técnicos essenciais:</strong> Registros básicos de conexão necessários para o funcionamento seguro da aplicação.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                2. Finalidade do Atendimento
              </h2>
              <p>
                Os dados fornecidos pelo interessado são utilizados exclusivamente para retorno de atendimento imobiliário, agendamento de visitas técnicas, esclarecimento de dúvidas documentais e intermediação de compra, venda ou locação.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                3. Sigilo e Compartilhamento
              </h2>
              <p>
                Não comercializamos nem cedemos dados pessoais a terceiros para fins publicitários. As informações de negociação permanecem restritas ao corretor responsável e, quando aplicável, às partes contratantes e cartórios competentes.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
                4. Direitos do Titular
              </h2>
              <p>
                A qualquer momento, o titular pode solicitar confirmação de tratamento, atualização ou exclusão de seus dados de contato diretamente pelos canais oficiais abaixo.
              </p>
            </div>
          </div>

          {/* Canal de Contato do Encarregado */}
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '1.35rem 1.5rem',
              border: '1px solid var(--border-subtle)',
              marginTop: '2.25rem'
            }}
          >
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: 700, marginBottom: '0.35rem' }}>
              Contato Direto do Responsável
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1rem' }}>
              Para dúvidas sobre privacidade ou solicitações relativas aos seus dados:
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--text-dark)',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                <Mail size={15} />
                <span>{SITE_CONFIG.email}</span>
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#15803D',
                  fontWeight: 600,
                  fontSize: '0.88rem'
                }}
              >
                <WhatsAppIcon size={15} color="#15803D" />
                <span>{SITE_CONFIG.phoneFormatted}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
