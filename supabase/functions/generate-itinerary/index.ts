import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeadersFor, requireUser } from '../_shared/cors.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

// Currency-appropriate cost anchors. Without these, the model anchors
// on the structure example's `cost` and produces USD-scale numbers
// (e.g. "20" for an activity in Puri) even when the prompt asks for
// INR. The sample is the value the structure example shows; the ranges
// list orients per-category typical mid-range traveler spend.
const COST_GUIDE: Record<string, { sample: number; ranges: string; perPersonHint: string }> = {
  INR: { sample: 1500, ranges: 'snack 100-300, meal 400-1500/person, activity 500-3000, accommodation 2000-8000/night, intercity transport 500-10000', perPersonHint: '~₹500' },
  USD: { sample: 20,   ranges: 'snack 3-8, meal 10-40/person, activity 15-60, accommodation 80-250/night, intercity transport 20-200',                  perPersonHint: '~$12' },
  EUR: { sample: 25,   ranges: 'snack 3-8, meal 12-40/person, activity 15-50, accommodation 90-220/night, intercity transport 25-200',                 perPersonHint: '~€12' },
  GBP: { sample: 22,   ranges: 'snack 3-7, meal 12-35/person, activity 15-50, accommodation 90-220/night, intercity transport 25-180',                 perPersonHint: '~£10' },
  JPY: { sample: 2500, ranges: 'snack 300-800, meal 1200-4000/person, activity 1500-6000, accommodation 8000-25000/night, intercity transport 3000-20000', perPersonHint: '~¥1500' },
  SGD: { sample: 30,   ranges: 'snack 4-10, meal 15-50/person, activity 20-70, accommodation 140-300/night, intercity transport 30-200',               perPersonHint: '~S$12' },
  AED: { sample: 100,  ranges: 'snack 15-40, meal 50-180/person, activity 80-300, accommodation 400-1200/night, intercity transport 100-600',          perPersonHint: '~AED 50' },
};
const guideFor = (currency: string) => COST_GUIDE[currency.toUpperCase()] ?? COST_GUIDE.USD;

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
  // Curated eateries from destinationInfo.js — formatted "Name (Neighborhood)".
  // Same sanitizer (allows letters / numbers / spaces / common punctuation
  // including parentheses) and a 6-entry cap to keep the prompt small.
  const rawMustEat = Array.isArray(body?.mustEat) ? body.mustEat : [];
  const mustEat = rawMustEat.map(sanitizeName).filter(Boolean).slice(0, 6);

  // Confirmed stay (hotel/homestay) — when present on the first day, we
  // tell the model to start from the accommodation rather than scripting
  // an airport-arrival sequence the traveller has already completed.
  const stayName = sanitizeName(body?.stay?.name);
  const stayArea = sanitizeName(body?.stay?.area);
  const stay = stayName ? { name: stayName, area: stayArea } : null;

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
    // When the traveller has a confirmed stay, Day 1 starts from the hotel
    // — skip airport-arrival and hotel-transfer items entirely. Without a
    // confirmed stay we keep the original behaviour (arrival sequence on
    // Day 1) so the itinerary still bootstraps for first-time planners.
    const arrivalNote = isFirstDay
      ? (stay
          ? ` This is the FIRST day of the trip and the traveller is already settled at "${stay.name}"${stayArea ? ` in ${stay.area}` : ''}. Start the day's plan from the accommodation — do NOT include airport arrival, train station arrival, or hotel-transfer items. Assume the traveller is ready to begin sightseeing or activities directly.`
          : ' This is the FIRST day of the trip — start with arrival/transport and check-in items.')
      : '';
    const departureNote = isLastDay ? ' This is the LAST day of the trip — include a departure/transport item near the end.' : '';
    const guide = guideFor(currency);
    const dayMustsLine = dayMusts.length
      ? ` These iconic ${safeDest} spots are pre-assigned to this day and MUST appear as items — use the proper name in the title for each: ${dayMusts.join(', ')}. Plan around them; total items 4-6 (scale up to 6 if needed to fit all of them).`
      : '';
    // When the trip's destination has curated eateries in destinationInfo.js,
    // the client forwards them in `mustEat`. Tell the model to PREFER those
    // for the day's food slots (1-2 per day typically) instead of inventing
    // its own. When the list is empty, fall back to the previous generic
    // "use real eatery names" rule.
    const foodRule = mustEat.length
      ? `For food items, prefer these well-loved local spots — use the exact name in the title (e.g. "Lunch at ${mustEat[0]}"): ${mustEat.join('; ')}. Add a per-person rate in notes (e.g. "${guide.perPersonHint} per person · try the signature dish").`
      : `For food items include the eatery / restaurant name in the title (e.g. "Lunch at Café XYZ") and add a per-person rate in notes (e.g. "${guide.perPersonHint} per person · try the signature dish").`;
    prompt = `For day ${date} in ${safeLoc}${safeTheme ? ` (theme: ${safeTheme})` : ''} of a trip to ${safeDest}, plan 4-6 timed items.${arrivalNote}${departureNote}${dayMustsLine} Return ONLY a JSON array — no markdown, no commentary. Structure: [{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":${guide.sample}}]. Types: activity|transport|accommodation|food. time is 24h HH:MM. Realistic ${currency} costs (numeric, no currency symbol) — typical ranges: ${guide.ranges}. Use these scales, not USD-equivalent numbers. ${foodRule}`;
    maxTokens = 1024;
  } else {
    // Legacy 'full' mode — single-shot fallback. Now respects body.currency
    // (clients always pass it; defaults to USD if missing) so an INR trip
    // falling back from the staged path doesn't get dollar amounts.
    const startDate = String(body?.startDate ?? '').slice(0, 10);
    const endDate = String(body?.endDate ?? '').slice(0, 10);
    const numDays = Math.max(1, Math.min(30, Number(body?.numDays) || 0));
    const fullCurrency = String(body?.currency ?? 'USD').toUpperCase().slice(0, 3);
    if (!dateRe.test(startDate) || !dateRe.test(endDate) || !numDays) {
      return json({ error: 'Invalid parameters' }, 400, cors);
    }
    const fullGuide = guideFor(fullCurrency);
    const fullFoodRule = mustEat.length
      ? `For food items, prefer these well-loved local spots — use the exact name in the title (e.g. "Lunch at ${mustEat[0]}"): ${mustEat.join('; ')}. Add per-person rate in notes (e.g. "${fullGuide.perPersonHint} per person · try the signature dish").`
      : `For food type items, include the eatery/restaurant name in the title (e.g. "Lunch at Café XYZ") and add per-person rate in notes (e.g. "${fullGuide.perPersonHint} per person · try the signature dish").`;
    prompt = `Create a day-by-day travel itinerary for ${safeDest} from ${startDate} to ${endDate} (${numDays} days). Return ONLY a valid JSON array — no markdown. Structure: [{"date":"YYYY-MM-DD","location":"area","items":[{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":${fullGuide.sample}}]}]. Types: activity|transport|accommodation|food. 4–6 items/day. Realistic ${fullCurrency} costs (numeric, no currency symbol) — typical ranges: ${fullGuide.ranges}. time is 24h HH:MM. ${fullFoodRule}`;
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
