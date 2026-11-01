import { describe, it, expect } from 'vitest';
import { proxy } from './proxy';
import { NextRequest } from 'next/server';

function createMockRequest(pathname: string, sessionCookie?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const req = new NextRequest(url);
  if (sessionCookie) {
    req.cookies.set('better-auth.session_token', sessionCookie);
  }
  return req;
}

describe('Server-Side Proxy Route Guard (src/proxy.ts)', () => {
  it('harus me-redirect tamu anonim yang mengakses /dashboard ke /login', () => {
    const req = createMockRequest('/dashboard');
    const res = proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/login?redirect=%2Fdashboard');
  });

  it('harus me-redirect tamu anonim yang mengakses sub-halaman simulasi ke /login', () => {
    const req = createMockRequest('/simulations/result/9012');
    const res = proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/login?redirect=%2Fsimulations%2Fresult%2F9012');
  });

  it('harus me-redirect tamu anonim yang mengakses /admin ke /login', () => {
    const req = createMockRequest('/admin/dashboard');
    const res = proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/login?redirect=%2Fadmin%2Fdashboard');
  });

  it('harus me-redirect tamu anonim yang mengakses /onboarding ke /login', () => {
    const req = createMockRequest('/onboarding');
    const res = proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/login?redirect=%2Fonboarding');
  });

  it('harus meloloskan pengguna dengan better-auth.session_token pada rute terproteksi', () => {
    const req = createMockRequest('/dashboard', 'valid-session-token');
    const res = proxy(req);
    // NextResponse.next() returns a 200 response without redirect headers
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('harus meloloskan rute publik (seperti /login atau /) bagi siapa pun', () => {
    const req = createMockRequest('/login');
    const res = proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});

