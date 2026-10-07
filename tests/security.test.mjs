import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  hashPassword,
  sanitizeText,
  isValidSafeUrl,
  sanitizePropertyPayload,
  validateLoginRateLimit
} from '../src/utils/security.js';
import { getEmbedVideoUrl } from '../src/utils/video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

function getAllSourceFiles(dirPath, extensions = ['.js', '.jsx']) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Suite 2: Testes de Seguranca, Anti-XSS, Autenticacao e Infraestrutura', () => {
  describe('Teste 1: Criptografia SHA-256 (hashPassword)', () => {
    it('deve gerar hash SHA-256 de 64 caracteres hexadecimais de forma deterministica', async () => {
      const hash1 = await hashPassword('senhaSegura123');
      const hash2 = await hashPassword('senhaSegura123');

      assert.equal(hash1.length, 64);
      assert.match(hash1, /^[a-f0-9]{64}$/);
      assert.equal(hash1, hash2);
    });

    it('deve produzir hashes completamente distintos para senhas ligeiramente diferentes e validar o hash oficial', async () => {
      const hashA = await hashPassword('fiorino2026');
      const hashB = await hashPassword('Fiorino2026');
      const hashEmpty = await hashPassword('');

      assert.notEqual(hashA, hashB);
      assert.notEqual(hashA, hashEmpty);
      assert.equal(
        hashA,
        'ecf39b525dc6050fb392ac8a15a1c0bdbac1f766f37d24147bea88d38455a04d',
        'Hash SHA-256 oficial deve corresponder exatamente ao esperado'
      );
    });
  });

  describe('Teste 2: Sanitizacao Anti-XSS (sanitizeText)', () => {
    it('deve remover blocos <script>, <iframe>, <object>, <embed>, <style> e tags HTML em geral', () => {
      const malicious = 'Casa no Centro <script>alert("xss")</script><iframe src="https://evil.com"></iframe><b>Linda</b>';
      const clean = sanitizeText(malicious);

      assert.ok(!clean.includes('<script'));
      assert.ok(!clean.includes('alert("xss")'));
      assert.ok(!clean.includes('<iframe'));
      assert.ok(!clean.includes('<b>'));
      assert.equal(clean, 'Casa no Centro Linda');
    });

    it('deve neutralizar atributos de eventos inline (onerror=, onload=, onclick=) e protocolos javascript:/vbscript:/data:text/html', () => {
      const payload = '<img src=x onerror="fetch(\'https://evil.com\')" onload=alert(1)> javascript:alert(2) vbscript:msgbox(1) data:text/html;base64,PHNjcmlwdD4=';
      const clean = sanitizeText(payload);

      assert.ok(!/onerror\s*=/i.test(clean));
      assert.ok(!/onload\s*=/i.test(clean));
      assert.ok(!/javascript\s*:/i.test(clean));
      assert.ok(!/vbscript\s*:/i.test(clean));
      assert.ok(!/data\s*:\s*text\/html/i.test(clean));
      assert.ok(!/[<>]/.test(clean));
    });

    it('deve respeitar o limite maxLength e tratar null/undefined com seguranca', () => {
      const longString = 'A'.repeat(500);
      const truncated = sanitizeText(longString, 120);
      assert.equal(truncated.length, 120);
      assert.equal(sanitizeText(null), '');
      assert.equal(sanitizeText(undefined), '');
    });
  });

  describe('Teste 3: Validacao de URLs Seguras (isValidSafeUrl)', () => {
    it('deve permitir URLs https://, http://, caminhos relativos / e data:image/*;base64 validos', () => {
      assert.equal(isValidSafeUrl('https://images.unsplash.com/photo-123?w=800'), true);
      assert.equal(isValidSafeUrl('http://localhost:5173/banner.jpg'), true);
      assert.equal(isValidSafeUrl('/banner.jpg'), true);
      assert.equal(isValidSafeUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD=='), true);
      assert.equal(isValidSafeUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA'), true);
      assert.equal(isValidSafeUrl('data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAv'), true);
    });

    it('deve bloquear javascript:, vbscript:, data:text/html, protocol-relative //evil.com e injecao de atributos', () => {
      assert.equal(isValidSafeUrl('javascript:alert(document.cookie)'), false);
      assert.equal(isValidSafeUrl('JAVASCRIPT:alert(1)'), false);
      assert.equal(isValidSafeUrl('vbscript:msgbox("xss")'), false);
      assert.equal(isValidSafeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), false);
      assert.equal(isValidSafeUrl('//evil.com/malware.js'), false);
      assert.equal(isValidSafeUrl('https://example.com/"onmouseover="alert(1)'), false);
      assert.equal(isValidSafeUrl(''), false);
      assert.equal(isValidSafeUrl(null), false);
    });
  });

  describe('Teste 4: Higienizacao Completa de Payload Imobiliario (sanitizePropertyPayload)', () => {
    it('deve higienizar campos de texto, forcar tipos/status validos, impedir valores negativos e filtrar URLs maliciosas', () => {
      const dirtyPayload = {
        code: 'ca-999<script>alert(1)</script>',
        title: 'Terreno Amplo <img src=x onerror=alert(1)>',
        type: 'castelo_invalido',
        purpose: 'permuta_invalida',
        status: 'hackeado',
        price: -450000,
        area: -120,
        landArea: '600',
        bedrooms: -3,
        suites: '2',
        bathrooms: 'abc',
        garages: 4,
        neighborhood: 'Centro <b>Historico</b>',
        city: 'Itaiópolis',
        videoUrl: 'javascript:alert(1)',
        images: [
          'javascript:alert("xss")',
          'data:text/html,<script>alert(1)</script>',
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914'
        ],
        features: ['Piscina <script>evil()</script>', '', '   ', 'Churrasqueira']
      };

      const sanitized = sanitizePropertyPayload(dirtyPayload);

      assert.equal(sanitized.code, 'CA-999');
      assert.equal(sanitized.title, 'Terreno Amplo');
      assert.equal(sanitized.type, 'casa');
      assert.equal(sanitized.purpose, 'venda');
      assert.equal(sanitized.status, 'ativo');
      assert.equal(sanitized.price, 0);
      assert.equal(sanitized.area, 0);
      assert.equal(sanitized.landArea, 600);
      assert.equal(sanitized.bedrooms, 0);
      assert.equal(sanitized.suites, 2);
      assert.equal(sanitized.bathrooms, 0);
      assert.equal(sanitized.garage, 4);
      assert.equal(sanitized.garages, 4);
      assert.equal(sanitized.neighborhood, 'Centro Historico');
      assert.equal(sanitized.videoUrl, '');
      assert.deepEqual(sanitized.images, ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914']);
      assert.deepEqual(sanitized.features, ['Piscina', 'Churrasqueira']);
    });

    it('deve aplicar imagem fallback segura caso todas as imagens fornecidas sejam invalidas', () => {
      const payloadSemImagemValida = {
        title: 'Casa Teste',
        imageUrl: 'javascript:evil()',
        images: ['vbscript:evil()', '//evil.com/x.jpg']
      };

      const sanitized = sanitizePropertyPayload(payloadSemImagemValida);
      assert.equal(sanitized.images.length, 1);
      assert.ok(sanitized.images[0].startsWith('https://images.unsplash.com/'));
      assert.equal(sanitized.imageUrl, sanitized.images[0]);
    });
  });

  describe('Teste 5: Rate-Limiting contra Brute-Force no Login (validateLoginRateLimit)', () => {
    it('deve permitir tentativas 1 a 4, bloquear na 5a tentativa por 60s e liberar apos expiracao do lockout', () => {
      const now = 1700000000000;

      // Tentativa inicial (0 falhas previas)
      const check0 = validateLoginRateLimit(0, 0, now);
      assert.equal(check0.allowed, true);
      assert.equal(check0.remainingAttempts, 5);

      // Apos 4 falhas previas (ainda permite a 5a tentativa)
      const check4 = validateLoginRateLimit(4, 0, now);
      assert.equal(check4.allowed, true);
      assert.equal(check4.remainingAttempts, 1);

      // Atingiu 5 falhas: aciona bloqueio de 60 segundos
      const check5 = validateLoginRateLimit(5, 0, now);
      assert.equal(check5.allowed, false);
      assert.equal(check5.shouldLockout, true);
      assert.equal(check5.lockoutDurationMs, 60000);
      assert.equal(check5.remainingSeconds, 60);

      // Durante vigencia do lockout (faltando 25 segundos)
      const lockoutUntil = now + 60000;
      const duringLockout = validateLoginRateLimit(5, lockoutUntil, now + 35000);
      assert.equal(duringLockout.allowed, false);
      assert.equal(duringLockout.remainingSeconds, 25);

      // Apos expirar o lockout e zerar contador
      const afterExpiry = validateLoginRateLimit(0, lockoutUntil, now + 61000);
      assert.equal(afterExpiry.allowed, true);
      assert.equal(afterExpiry.remainingAttempts, 5);
    });
  });

  describe('Teste 6: Blindagem de Embed de Video (getEmbedVideoUrl)', () => {
    it('deve converter apenas URLs legítimas do YouTube e Vimeo para URLs de embed HTTPS seguras', () => {
      assert.equal(
        getEmbedVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      );
      assert.equal(
        getEmbedVideoUrl('https://youtu.be/dQw4w9WgXcQ'),
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      );
      assert.equal(
        getEmbedVideoUrl('https://vimeo.com/123456789'),
        'https://player.vimeo.com/video/123456789'
      );
      assert.equal(
        getEmbedVideoUrl('https://player.vimeo.com/video/987654321'),
        'https://player.vimeo.com/video/987654321'
      );
    });

    it('deve rejeitar javascript:, dominios nao autorizados e tentativas de injecao no ID do video', () => {
      assert.equal(getEmbedVideoUrl('javascript:alert(1)'), null);
      assert.equal(getEmbedVideoUrl('https://evil-youtube.com/watch?v=dQw4w9WgXcQ'), null);
      assert.equal(getEmbedVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ"><script>alert(1)</script>'), null);
      assert.equal(getEmbedVideoUrl('https://www.youtube.com/watch?v=../../etc/passwd'), null);
      assert.equal(getEmbedVideoUrl('data:text/html,<script>alert(1)</script>'), null);
      assert.equal(getEmbedVideoUrl(''), null);
      assert.equal(getEmbedVideoUrl(null), null);
    });
  });

  describe('Teste 7: Auditoria Estatica de Regras do Firestore (firestore.rules) e Headers HTTP (vercel.json)', () => {
    it('firestore.rules deve exigir request.auth != null para escrita/exclusao, validar dados e bloquear demais colecoes', () => {
      const rulesPath = path.join(PROJECT_ROOT, 'firestore.rules');
      assert.ok(fs.existsSync(rulesPath), 'Arquivo firestore.rules deve existir na raiz do projeto');

      const rulesContent = fs.readFileSync(rulesPath, 'utf8');
      assert.match(rulesContent, /allow\s+create,\s*update:\s*if\s+request\.auth\s*!=\s*null/, 'Escrita deve exigir request.auth != null');
      assert.match(rulesContent, /request\.resource\.data\.title\s+is\s+string/, 'Deve validar tipo string para title');
      assert.match(rulesContent, /request\.resource\.data\.price\s+is\s+number/, 'Deve validar tipo number para price');
      assert.match(rulesContent, /request\.resource\.data\.price\s*>=\s*0/, 'Deve impedir preco negativo nas rules');
      assert.match(rulesContent, /allow\s+delete:\s*if\s+request\.auth\s*!=\s*null/, 'Exclusao deve exigir request.auth != null');
      assert.match(rulesContent, /allow\s+read,\s*write:\s*if\s+false/, 'Deve existir bloqueio padrao para demais colecoes');
    });

    it('vercel.json deve configurar headers de seguranca HTTP contra sniffing, clickjacking e vazamento de referrer', () => {
      const vercelPath = path.join(PROJECT_ROOT, 'vercel.json');
      assert.ok(fs.existsSync(vercelPath), 'Arquivo vercel.json deve existir na raiz do projeto');

      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      assert.ok(Array.isArray(vercelConfig.headers) && vercelConfig.headers.length > 0, 'Configuracao de headers ausente em vercel.json');

      const headerItems = vercelConfig.headers[0].headers || [];
      const headerMap = Object.fromEntries(headerItems.map((h) => [h.key, h.value]));

      assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
      assert.equal(headerMap['X-Frame-Options'], 'DENY');
      assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
      assert.ok(headerMap['Permissions-Policy']?.includes('camera=()'), 'Permissions-Policy deve restringir camera/microfone/geolocalizacao');
    });
  });

  describe('Teste 8: Varredura de Segredos e Chaves Privadas em src/', () => {
    it('deve garantir que nenhuma chave privada ou API key real do Google/Firebase foi hardcoded em src/', () => {
      const files = getAllSourceFiles(SRC_DIR, ['.js', '.jsx']);
      const secretPatterns = [
        { name: 'Google/Firebase API Key (AIza...)', regex: /AIza[0-9A-Za-z_-]{35}/ },
        { name: 'Private Key PEM Block', regex: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
        { name: 'Firebase Service Account client_email', regex: /firebase-adminsdk-[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com/i }
      ];

      const leaks = [];
      for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const pattern of secretPatterns) {
          if (pattern.regex.test(content)) {
            leaks.push({ file: path.relative(PROJECT_ROOT, filePath), pattern: pattern.name });
          }
        }
      }

      assert.deepEqual(leaks, [], `Detectados segredos hardcoded no codigo-fonte: ${JSON.stringify(leaks)}`);
    });
  });
});
