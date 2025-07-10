import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Configurações de Rate Limiting
 * - Janela de tempo: 1 minuto
 * - Máximo de requisições: 5 por IP
 */
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 5; // 5 requisições por IP por janela
const ipHits: Record<string, { count: number; last: number }> = {};

/**
 * Valida formato do e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} true se válido
 */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitiza input removendo caracteres perigosos
 * @param {string} input - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
function sanitize(input: string) {
  return input.replace(/[<>"'`]/g, '');
}

async function saveToNewsletter(email: string) {
  await prisma.newsletter.upsert({
    where: { email },
    update: { active: true },
    create: { email }
  });
}

/**
 * Endpoint POST /api/newsletter
 * 
 * Processa inscrições na newsletter com:
 * - Validação de e-mail
 * - Proteção contra spam (honeypot)
 * - Rate limiting por IP
 * - Sanitização de inputs
 * 
 * @param {NextRequest} req - Requisição HTTP
 * @returns {NextResponse} Resposta HTTP
 */
export async function POST(req: NextRequest) {
  // Extrai e sanitiza dados da requisição
  const data = await req.json();
  const email = sanitize((data.email || '').toString().trim());
  const honeypot = (data.honeypot || '').toString();
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

  // Verifica honeypot (proteção contra spam)
  if (honeypot) {
    return NextResponse.json({ error: 'Spam detectado.' }, { status: 400 });
  }

  // Implementa rate limiting
  const now = Date.now();
  if (!ipHits[ip]) ipHits[ip] = { count: 0, last: now };
  if (now - ipHits[ip].last > RATE_LIMIT_WINDOW) {
    ipHits[ip] = { count: 1, last: now };
  } else {
    ipHits[ip].count++;
    if (ipHits[ip].count > RATE_LIMIT_MAX) {
      return NextResponse.json({ error: 'Muitas tentativas, tente novamente mais tarde.' }, { status: 429 });
    }
  }

  // Valida e-mail
  if (!email || !isValidEmail(email) || email.length > 100) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
  }

  await saveToNewsletter(email);

  return NextResponse.json({ success: true });
} 
