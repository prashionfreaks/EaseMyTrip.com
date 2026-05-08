// Restrict CORS to known production + local-dev origins.
// Requests from any other origin are denied the ACAO header and the browser
// will refuse to read the response.

const ALLOWED_ORIGINS = new Set([
  'https://letswander.space',
  'https://www.letswander.space',
  'http://localhost:5173',
  'http://localhost:4173',
]);

export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://letswander.space';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// Minimal HTML escape for interpolating untrusted input into HTML strings.
export function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Verify the caller's Supabase JWT. Returns the user id or null.
//
// The whole body is wrapped in try/catch — any failure (network blip, the
// auth service returning 200 with an empty body, JSON parse error) collapses
// to "no user," which the caller turns into a 401. Without this catch, an
// empty-body response from /auth/v1/user crashed the handler with a
// SyntaxError that escaped to a 500.
export async function requireUser(req: Request): Promise<{ userId: string } | null> {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!token) return null;

    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !anon) return null;

    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anon, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    // Read as text first so an empty body becomes an empty string (not a
    // throw). Only attempt JSON.parse when there's actually content.
    const text = await res.text();
    if (!text) return null;
    const data = JSON.parse(text);
    return data?.id ? { userId: data.id } : null;
  } catch {
    return null;
  }
}
