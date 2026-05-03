import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeadersFor, requireUser } from '../_shared/cors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

// Three modes:
//   skeleton — quick day-level outline (date + neighborhood + theme), small
//              token budget. Used to render the day cards immediately.
//   fill     — flesh out a single day with 4-6 timed items. Run in parallel
//              client-side after the skeleton lands.
//   full     — legacy single-shot full itinerary, kept for backward compat.
//
// Splitting the work this way keeps perceived latency low: the user sees the
// skeleton in ~3-5s and per-day items stream in as their parallel fills
// resolve, instead of staring at a spinner for 20-30s.
serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!ANTHROPIC_API_KEY) {
    return json({ error: 'Itinerary AI not configured' }, 503, cors);
  }

  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401, cors);

  let body: Record<string, unknown> = {};
  try { body = await req.json() as Record<string, unknown>; }
  catch { return json({ error: 'Invalid JSON' }, 400, cors); }

  // Warmup ping — client fires this on Itinerary page mount to thaw the
  // Deno isolate before the user clicks Suggest. Skip the Anthropic call
  // entirely; the cold-start cost was already paid getting here.
  if (body?.mode === 'warmup') return json({ ok: true }, 200, cors);

  const rawMode = String(body?.mode ?? 'full');
  const mode: 'skeleton' | 'fill' | 'full' =
    rawMode === 'skeleton' || rawMode === 'fill' ? rawMode : 'full';

  const destination = String(body?.destination ?? '').trim().slice(0, 120);
  if (!destination) return json({ error: 'Invalid destination' }, 400, cors);
  const safeDest = destination.replace(/[^\p{L}\p{N}\s,.'\-]/gu, '').slice(0, 120);

  // Top must-see attractions for the trip (pulled from destinationInfo.js
  // on the client). The skeleton stage receives the full list and assigns
  // each spot to a specific day; the fill stage receives only the chosen
  // day's pre-assigned subset (`dayMusts`) and includes them as required.
  // Splitting the responsibility this way is the only reliable way to get
  // every iconic spot into a 7+ day trip — without the up-front assignment,
  // each independent fill decides "doesn't fit my theme" and the list
  // quietly evaporates.
  const sanitizeName = (s: unknown) =>
    String(s ?? '').replace(/[^\p{L}\p{N}\s,.'\-&()]/gu, '').trim().slice(0, 80);
  const rawMustSee = Array.isArray(body?.mustSee) ? body.mustSee : [];
  const mustSee = rawMustSee.map(sanitizeName).filter(Boolean).slice(0, 8);
  const rawDayMusts = Array.isArray(body?.dayMusts) ? body.dayMusts : [];
  const dayMusts = rawDayMusts.map(sanitizeName).filter(Boolean).slice(0, 4);

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  let prompt = '';
  let maxTokens = 4096;

  if (mode === 'skeleton') {
    const startDate = String(body?.startDate ?? '').slice(0, 10);
    const endDate = String(body?.endDate ?? '').slice(0, 10);
    const numDays = Math.max(1, Math.min(30, Number(body?.numDays) || 0));
    if (!dateRe.test(startDate) || !dateRe.test(endDate) || !numDays) {
      return json({ error: 'Invalid parameters' }, 400, cors);
    }
    const mustAssignmentLine = mustSee.length
      ? ` ASSIGN every one of these iconic ${safeDest} attractions to exactly one day in the "musts" array, choosing the day whose location/theme best matches each spot — distribute them so no single day gets more than 2: ${mustSee.join(', ')}. Each name must appear in exactly one day's "musts"; do NOT skip any. Days that don't naturally fit any iconic spot should have an empty "musts": [].`
      : ' Use empty "musts": [] for every day.';
    prompt = `Create a high-level day-by-day skeleton for a trip to ${safeDest} from ${startDate} to ${endDate} (${numDays} days). For each day pick the specific neighborhood / town / zone the traveller will be based in or focus on, plus a brief 2-4 word theme describing the day's focus (e.g. "Arrival & Old Town", "Day trip to X", "Beach & seafood"). Vary the locations across the trip so consecutive days don't repeat. Order chronologically.${mustAssignmentLine} Return ONLY a valid JSON array — no markdown, no commentary. Structure: [{"date":"YYYY-MM-DD","location":"specific area","theme":"2-4 word theme","musts":["..."]}]`;
    maxTokens = 1536;
  } else if (mode === 'fill') {
    const date = String(body?.date ?? '').slice(0, 10);
    const location = String(body?.location ?? '').trim().slice(0, 120);
    const theme = String(body?.theme ?? '').trim().slice(0, 120);
    const currency = String(body?.currency ?? 'USD').toUpperCase().slice(0, 3);
    const isFirstDay = Boolean(body?.isFirstDay);
    const isLastDay = Boolean(body?.isLastDay);
    if (!dateRe.test(date) || !location) {
      return json({ error: 'Invalid parameters' }, 400, cors);
    }
    const safeLoc = location.replace(/[^\p{L}\p{N}\s,.'\-]/gu, '').slice(0, 120);
    const safeTheme = theme.replace(/[^\p{L}\p{N}\s,.'\-]/gu, '').slice(0, 120);
    const arrivalNote = isFirstDay ? ' This is the FIRST day of the trip — start with arrival/transport and check-in items.' : '';
    const departureNote = isLastDay ? ' This is the LAST day of the trip — include a departure/transport item near the end.' : '';
    const symbol = currency === 'INR' ? '₹500' : '$12';
    const dayMustsLine = dayMusts.length
      ? ` These iconic ${safeDest} spots are pre-assigned to this day and MUST appear as items — use the proper name in the title for each: ${dayMusts.join(', ')}. Plan around them; total items 4-6 (scale up to 6 if needed to fit all of them).`
      : '';
    prompt = `For day ${date} in ${safeLoc}${safeTheme ? ` (theme: ${safeTheme})` : ''} of a trip to ${safeDest}, plan 4-6 timed items.${arrivalNote}${departureNote}${dayMustsLine} Return ONLY a JSON array — no markdown, no commentary. Structure: [{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":20}]. Types: activity|transport|accommodation|food. time is 24h HH:MM. Realistic ${currency} costs (numeric, no currency symbol). For food items include the eatery / restaurant name in the title (e.g. "Lunch at Café XYZ") and add a per-person rate in notes (e.g. "~${symbol} per person · try the signature dish").`;
    maxTokens = 1024;
  } else {
    // Legacy 'full' mode — keep prompt identical to original so existing
    // callers don't see any behavior change.
    const startDate = String(body?.startDate ?? '').slice(0, 10);
    const endDate = String(body?.endDate ?? '').slice(0, 10);
    const numDays = Math.max(1, Math.min(30, Number(body?.numDays) || 0));
    if (!dateRe.test(startDate) || !dateRe.test(endDate) || !numDays) {
      return json({ error: 'Invalid parameters' }, 400, cors);
    }
    prompt = `Create a day-by-day travel itinerary for ${safeDest} from ${startDate} to ${endDate} (${numDays} days). Return ONLY a valid JSON array — no markdown. Structure: [{"date":"YYYY-MM-DD","location":"area","items":[{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":20}]}]. Types: activity|transport|accommodation|food. 4–6 items/day. Realistic USD costs. time is 24h HH:MM. For food type items, include the eatery/restaurant name in the title (e.g. "Lunch at Café XYZ") and add per-person rate in notes (e.g. "~$12 per person · try the signature dish").`;
    maxTokens = 4096;
  }

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
        max_tokens: maxTokens,
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
    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch {
      return json({ error: 'Invalid model output' }, 502, cors);
    }
    if (!Array.isArray(parsed)) {
      return json({ error: 'Invalid model output' }, 502, cors);
    }
    if (mode === 'skeleton') return json({ skeleton: parsed }, 200, cors);
    if (mode === 'fill')     return json({ items: parsed }, 200, cors);
    return json({ days: parsed }, 200, cors);
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
