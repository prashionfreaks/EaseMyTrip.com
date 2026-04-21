import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeadersFor, requireUser } from '../_shared/cors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!ANTHROPIC_API_KEY) {
    return json({ error: 'Itinerary AI not configured' }, 503, cors);
  }

  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401, cors);

  let destination = '';
  let startDate = '';
  let endDate = '';
  let numDays = 0;
  try {
    const body = await req.json();
    destination = String(body?.destination ?? '').trim().slice(0, 120);
    startDate = String(body?.startDate ?? '').slice(0, 10);
    endDate = String(body?.endDate ?? '').slice(0, 10);
    numDays = Math.max(1, Math.min(30, Number(body?.numDays) || 0));
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (!destination || !dateRe.test(startDate) || !dateRe.test(endDate) || !numDays) {
    return json({ error: 'Invalid parameters' }, 400, cors);
  }

  const safeDest = destination.replace(/[^\p{L}\p{N}\s,.'\-]/gu, '').slice(0, 120);

  const prompt = `Create a day-by-day travel itinerary for ${safeDest} from ${startDate} to ${endDate} (${numDays} days). Return ONLY a valid JSON array — no markdown. Structure: [{"date":"YYYY-MM-DD","location":"area","items":[{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":20}]}]. Types: activity|transport|accommodation|food. 4–6 items/day. Realistic USD costs. time is 24h HH:MM. For food type items, include the eatery/restaurant name in the title (e.g. "Lunch at Café XYZ") and add per-person rate in notes (e.g. "~$12 per person · try the signature dish").`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      return json({ error: `Upstream HTTP ${res.status}` }, 502, cors);
    }
    const data = await res.json();
    const raw = String(data?.content?.[0]?.text ?? '')
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    let days: unknown;
    try { days = JSON.parse(raw); } catch {
      return json({ error: 'Invalid model output' }, 502, cors);
    }
    if (!Array.isArray(days)) {
      return json({ error: 'Invalid model output' }, 502, cors);
    }
    return json({ days }, 200, cors);
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
