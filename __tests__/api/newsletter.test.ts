import { NextRequest } from 'next/server';
import { POST } from '@/app/api/newsletter/route';

describe('Newsletter API', () => {
  const createRequest = (data: any) => {
    return new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  it('aceita e-mail válido', async () => {
    const req = createRequest({ email: 'teste@exemplo.com' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('rejeita e-mail inválido', async () => {
    const req = createRequest({ email: 'email-invalido' });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('E-mail inválido.');
  });

  it('detecta spam através do honeypot', async () => {
    const req = createRequest({ 
      email: 'teste@exemplo.com',
      honeypot: 'spam'
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Spam detectado.');
  });

  it('aplica rate limiting', async () => {
    const req = createRequest({ email: 'teste@exemplo.com' });
    
    // Simula múltiplas requisições do mesmo IP
    for (let i = 0; i < 6; i++) {
      const response = await POST(req);
      if (i === 5) {
        const data = await response.json();
        expect(response.status).toBe(429);
        expect(data.error).toBe('Muitas tentativas, tente novamente mais tarde.');
      }
    }
  });

  it('sanitiza input malicioso', async () => {
    const req = createRequest({ 
      email: 'teste@exemplo.com<script>alert("xss")</script>'
    });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
}); 