import { createHmac, timingSafeEqual } from 'crypto';

export interface TokenUsuarioPayload {
  id_usuario: number;
  nombre: string;
  rol: string;
  exp: number;
}

function getSecret(): string {
  return process.env.JWT_SECRET || 'cambia_este_secreto_en_produccion';
}

function base64UrlEncode(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): string {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString('utf8');
}

function firmar(data: string): string {
  return base64UrlEncode(createHmac('sha256', getSecret()).update(data).digest());
}

export function generarTokenUsuario(payload: Omit<TokenUsuarioPayload, 'exp'>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    }),
  );
  const signature = firmar(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verificarTokenUsuario(token: string): TokenUsuarioPayload {
  const partes = token.split('.');
  if (partes.length !== 3) {
    throw new Error('Token inválido');
  }

  const [header, body, signature] = partes;
  const firmaEsperada = firmar(`${header}.${body}`);
  const firmaRecibidaBuffer = Buffer.from(signature);
  const firmaEsperadaBuffer = Buffer.from(firmaEsperada);

  if (
    firmaRecibidaBuffer.length !== firmaEsperadaBuffer.length ||
    !timingSafeEqual(firmaRecibidaBuffer, firmaEsperadaBuffer)
  ) {
    throw new Error('Firma inválida');
  }

  const payload = JSON.parse(base64UrlDecode(body)) as TokenUsuarioPayload;
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expirado');
  }

  return payload;
}
