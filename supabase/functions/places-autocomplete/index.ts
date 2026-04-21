import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeadersFor, requireUser } from '../_shared/cors.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!GEMINI_API_KEY) {
    return json({ error: 'Autocomplete not configured' }, 503, cors);
  }

  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401, cors);

  let input = '';
  try {
    const body = await req.json();
    input = String(body?.input ?? '').trim();
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  // Reject pathological inputs before spending an API call
  if (input.length < 2 || input.length > 80) {
    return json({ places: [] }, 200, cors);
  }
  // Strip anything that would confuse the prompt; allow letters, numbers, spaces, common punctuation
  const safeInput = input.replace(/[^\p{L}\p{N}\s,.'\-]/gu, '').slice(0, 80);

  const prompt = `Given the partial search "${safeInput}", suggest up to 5 real travel destinations (cities/places) that match. Return ONLY a JSON array of objects with "name" (city/place name) and "region" (state/country). No explanation, no markdown, just the JSON array. Example: [{"name":"Tokyo","region":"Japan"},{"name":"Toronto","region":"Canada"}]`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
        }),
      },
    );
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const m = text.match(/\[[\s\S]*\]/);
    let places: Array<{ name: string; region: string }> = [];
    if (m) {
      try {
        const parsed = JSON.parse(m[0]);
        if (Array.isArray(parsed)) {
          places = parsed
            .filter((p) => p && typeof p.name === 'string' && typeof p.region === 'string')
            .slice(0, 5)
            .map((p) => ({ name: String(p.name).slice(0, 120), region: String(p.region).slice(0, 120) }));
        }
      } catch { /* ignore */ }
    }
    return json({ places }, 200, cors);
  } catch (err) {
    return json({ error: (err as Error).message || 'Upstream failure' }, 502, cors);
  }
});

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
