import { format, addDays, parseISO } from 'date-fns';

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export function hasAIKey() { return !!ANTHROPIC_KEY; }

export async function generateItinerary(destination, startDate, endDate) {
  const start = parseISO(startDate);
  const numDays = Math.max(1, Math.round((parseISO(endDate) - start) / 86400000) + 1);
  const { key } = matchDestination(destination);
  const currency = INDIAN_DEST_KEYS.has(key) ? 'INR' : 'USD';
  if (ANTHROPIC_KEY) {
    try {
      const days = await generateWithClaude(destination, startDate, endDate, numDays, start);
      return { days, currency };
    }
    catch (err) { console.warn('Claude API failed, using built-in:', err.message); }
  }
  return generateBuiltIn(destination, startDate, numDays, start);
}

async function generateWithClaude(destination, startDate, endDate, numDays, startDateObj) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: `Create a day-by-day travel itinerary for ${destination} from ${startDate} to ${endDate} (${numDays} days). Return ONLY a valid JSON array — no markdown. Structure: [{"date":"YYYY-MM-DD","location":"area","items":[{"time":"09:00","title":"...","type":"activity","duration":120,"notes":"tip","cost":20}]}]. Types: activity|transport|accommodation|food. 4–6 items/day. Realistic USD costs. time is 24h HH:MM. For food type items, include the eatery/restaurant name in the title (e.g. "Lunch at Café XYZ") and add per-person rate in notes (e.g. "~$12 per person · try the signature dish").` }],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const raw = data.content[0].text.trim().replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  const days = JSON.parse(raw);
  return days.map((day, i) => ({
    id: 'day' + (Date.now() + i),
    date: day.date || format(addDays(startDateObj, i), 'yyyy-MM-dd'),
    location: day.location || destination,
    items: (day.items || []).map((item, j) => ({
      id: 'it' + (Date.now() + i * 100 + j),
      time: item.time || '09:00', title: item.title || 'Activity',
      type: item.type || 'activity', duration: Number(item.duration) || 60,
      notes: item.notes || '', cost: Number(item.cost) || 0,
    })),
  }));
}

// ─── Destination templates ────────────────────────────────

const DEST_DATA = {
  japan: {
    days: [
      { location: 'Tokyo', items: [
        { time: '14:00', title: 'Arrive at Narita / Haneda Airport', type: 'transport', duration: 60, notes: 'Take Narita Express to city centre', cost: 35 },
        { time: '16:00', title: 'Check in — Shinjuku Hotel', type: 'accommodation', duration: 30, notes: 'Luggage storage available', cost: 160 },
        { time: '18:30', title: 'Explore Shinjuku & dinner', type: 'food', duration: 150, notes: 'Try ramen at Fuunji or Ichiran', cost: 20 },
      ]},
      { location: 'Tokyo', items: [
        { time: '08:30', title: 'Tsukiji Outer Market breakfast', type: 'food', duration: 90, notes: 'Fresh sushi & tamagoyaki', cost: 25 },
        { time: '11:00', title: 'teamLab Borderless Digital Art Museum', type: 'activity', duration: 180, notes: 'Book tickets online in advance!', cost: 32 },
        { time: '15:30', title: 'Shibuya Crossing & Harajuku', type: 'activity', duration: 150, notes: 'Visit Meiji Shrine too', cost: 0 },
        { time: '19:00', title: 'Yakitori dinner in Shibuya', type: 'food', duration: 90, notes: 'Torikizoku is great value', cost: 22 },
      ]},
      { location: 'Tokyo → Kyoto', items: [
        { time: '07:30', title: 'Shinkansen to Kyoto (Nozomi)', type: 'transport', duration: 140, notes: 'JR Pass covers this — reserve seats', cost: 0 },
        { time: '11:00', title: 'Fushimi Inari Shrine', type: 'activity', duration: 150, notes: 'Go early to beat crowds', cost: 0 },
        { time: '14:00', title: 'Check in — Kyoto Ryokan', type: 'accommodation', duration: 30, notes: 'Traditional Japanese inn', cost: 220 },
        { time: '18:30', title: 'Kaiseki dinner', type: 'food', duration: 90, notes: 'Multi-course Japanese cuisine', cost: 60 },
      ]},
      { location: 'Kyoto', items: [
        { time: '09:00', title: 'Arashiyama Bamboo Grove', type: 'activity', duration: 120, notes: 'Early morning is magical & quieter', cost: 0 },
        { time: '11:30', title: 'Kinkaku-ji (Golden Pavilion)', type: 'activity', duration: 90, notes: 'Book tickets ahead', cost: 5 },
        { time: '14:00', title: 'Nishiki Market food tour', type: 'food', duration: 120, notes: 'Try tofu donuts and matcha soft cream', cost: 30 },
        { time: '17:00', title: 'Philosopher\'s Path stroll', type: 'activity', duration: 90, notes: 'Beautiful canal-side walk', cost: 0 },
      ]},
      { location: 'Osaka', items: [
        { time: '10:00', title: 'Train to Osaka (30 min)', type: 'transport', duration: 35, notes: 'JR or Hankyu line', cost: 5 },
        { time: '11:00', title: 'Osaka Castle Park', type: 'activity', duration: 120, notes: 'Museum inside the castle', cost: 10 },
        { time: '14:00', title: 'Dotonbori street food crawl', type: 'food', duration: 120, notes: 'Takoyaki, okonomiyaki, matcha everything', cost: 35 },
        { time: '19:30', title: 'Kushikatsu dinner', type: 'food', duration: 90, notes: 'Deep-fried skewers — don\'t double-dip!', cost: 30 },
      ]},
    ],
    departure: { time: '09:00', title: 'Transfer to Kansai Airport', type: 'transport', duration: 75, notes: 'Haruka Express to airport', cost: 20 },
  },

  bali: {
    days: [
      { location: 'Seminyak, Bali', items: [
        { time: '13:00', title: 'Arrive at Ngurah Rai Airport', type: 'transport', duration: 30, notes: 'Pre-paid taxi to Seminyak', cost: 10 },
        { time: '14:30', title: 'Check in — Seminyak Beach Villa', type: 'accommodation', duration: 30, notes: 'Most villas include breakfast', cost: 140 },
        { time: '17:00', title: 'Seminyak Beach sunset', type: 'activity', duration: 90, notes: 'Ku De Ta or Potato Head for drinks', cost: 15 },
        { time: '19:30', title: 'Dinner at Mama San', type: 'food', duration: 90, notes: 'Asian-fusion rooftop restaurant', cost: 25 },
      ]},
      { location: 'Ubud', items: [
        { time: '08:00', title: 'Tegallalang Rice Terraces', type: 'activity', duration: 120, notes: 'Sunrise visit is stunning', cost: 5 },
        { time: '11:00', title: 'Sacred Monkey Forest Sanctuary', type: 'activity', duration: 90, notes: 'Watch your belongings!', cost: 8 },
        { time: '13:30', title: 'Traditional Balinese lunch', type: 'food', duration: 90, notes: 'Award-winning farm-to-table', cost: 20 },
        { time: '16:00', title: 'Ubud Royal Palace & Art Market', type: 'activity', duration: 90, notes: 'Watch Kecak fire dance at sunset', cost: 10 },
      ]},
      { location: 'Uluwatu', items: [
        { time: '10:00', title: 'Uluwatu Temple clifftop walk', type: 'activity', duration: 90, notes: 'Dramatic 70m ocean cliffs', cost: 5 },
        { time: '12:00', title: 'Padang Padang Beach', type: 'activity', duration: 150, notes: 'Secluded white sand beach', cost: 3 },
        { time: '18:30', title: 'Kecak Fire Dance at Uluwatu', type: 'activity', duration: 90, notes: 'Must-see sunset performance', cost: 12 },
        { time: '20:30', title: 'Jimbaran Bay BBQ seafood dinner', type: 'food', duration: 90, notes: 'Watch the sunset while eating', cost: 30 },
      ]},
    ],
    departure: { time: '10:00', title: 'Transfer to Ngurah Rai Airport', type: 'transport', duration: 60, notes: 'Allow 2.5h before international departure', cost: 12 },
  },

  paris: {
    days: [
      { location: 'Paris — Eiffel & Rive Gauche', items: [
        { time: '12:00', title: 'Arrive at CDG Airport', type: 'transport', duration: 60, notes: 'RER B to city centre', cost: 15 },
        { time: '14:00', title: 'Check in — Le Marais hotel', type: 'accommodation', duration: 30, notes: '', cost: 180 },
        { time: '15:30', title: 'Eiffel Tower visit', type: 'activity', duration: 150, notes: 'Book summit tickets online', cost: 29 },
        { time: '19:30', title: 'Dinner at a classic French brasserie', type: 'food', duration: 90, notes: 'Try duck confit or steak tartare', cost: 45 },
      ]},
      { location: 'Paris — Louvre & Right Bank', items: [
        { time: '09:00', title: 'Croissant breakfast at a local boulangerie', type: 'food', duration: 45, notes: '', cost: 8 },
        { time: '10:00', title: 'Louvre Museum', type: 'activity', duration: 210, notes: 'Pre-book timed entry tickets', cost: 22 },
        { time: '14:00', title: 'Tuileries Garden & Champs-Élysées', type: 'activity', duration: 90, notes: '', cost: 0 },
        { time: '16:00', title: 'Arc de Triomphe — climb for views', type: 'activity', duration: 60, notes: '', cost: 13 },
        { time: '18:30', title: 'Montmartre & Sacré-Cœur at sunset', type: 'activity', duration: 120, notes: 'Artist quarter, great views', cost: 0 },
      ]},
      { location: 'Versailles day trip', items: [
        { time: '08:30', title: 'Train to Palace of Versailles', type: 'transport', duration: 40, notes: 'RER C from Paris', cost: 8 },
        { time: '09:30', title: 'Palace of Versailles + Hall of Mirrors', type: 'activity', duration: 210, notes: 'Audio guide recommended', cost: 21 },
        { time: '15:00', title: 'Le Marais district & Place des Vosges', type: 'activity', duration: 150, notes: '', cost: 0 },
        { time: '19:30', title: 'Seine River dinner cruise', type: 'food', duration: 120, notes: 'Stunning evening light', cost: 65 },
      ]},
    ],
    departure: { time: '08:00', title: 'Transfer to Charles de Gaulle Airport', type: 'transport', duration: 60, notes: 'RER B — allow 90 min before flight', cost: 15 },
  },

  london: {
    days: [
      { location: 'London — Central', items: [
        { time: '11:00', title: 'Arrive at Heathrow Airport', type: 'transport', duration: 60, notes: 'Heathrow Express to Paddington — 15 min', cost: 32 },
        { time: '13:00', title: 'Check in — Covent Garden hotel', type: 'accommodation', duration: 30, notes: '', cost: 200 },
        { time: '14:30', title: 'Tower of London & Tower Bridge', type: 'activity', duration: 180, notes: 'Crown Jewels — book ahead', cost: 35 },
        { time: '19:00', title: 'Dinner in Borough Market area', type: 'food', duration: 90, notes: 'Great street food & pubs', cost: 30 },
      ]},
      { location: 'London — Westminster', items: [
        { time: '09:00', title: 'Westminster Abbey & Parliament', type: 'activity', duration: 120, notes: '', cost: 27 },
        { time: '11:30', title: 'Buckingham Palace & St James\'s Park', type: 'activity', duration: 90, notes: 'Changing of Guard at 11am', cost: 0 },
        { time: '14:00', title: 'Tate Modern & Millennium Bridge', type: 'activity', duration: 150, notes: 'Free entry to permanent collection', cost: 0 },
        { time: '19:30', title: 'West End show', type: 'activity', duration: 150, notes: 'TKTS booth for same-day discounts', cost: 70 },
      ]},
    ],
    departure: { time: '07:00', title: 'Heathrow Express to airport', type: 'transport', duration: 25, notes: 'Allow 3h before international flight', cost: 32 },
  },

  dubai: {
    days: [
      { location: 'Dubai — Downtown', items: [
        { time: '13:00', title: 'Arrive at Dubai International Airport', type: 'transport', duration: 45, notes: 'Metro Red Line to city', cost: 3 },
        { time: '15:00', title: 'Check in — Downtown Dubai hotel', type: 'accommodation', duration: 30, notes: '', cost: 250 },
        { time: '17:00', title: 'Dubai Mall & Dubai Fountain show', type: 'activity', duration: 180, notes: 'Fountain shows every 30 min after sunset', cost: 0 },
        { time: '21:00', title: 'Burj Khalifa — At the Top', type: 'activity', duration: 90, notes: 'Pre-book Level 148!', cost: 85 },
      ]},
      { location: 'Dubai — Desert & Old City', items: [
        { time: '09:00', title: 'Al Fahidi Historic District & Dubai Museum', type: 'activity', duration: 120, notes: 'Old wind-tower architecture', cost: 1 },
        { time: '11:30', title: 'Gold Souk & Spice Souk', type: 'activity', duration: 90, notes: 'Bargaining expected!', cost: 0 },
        { time: '15:00', title: 'Desert Safari & dune bashing', type: 'activity', duration: 240, notes: 'Book full package with BBQ dinner', cost: 80 },
        { time: '20:00', title: 'BBQ dinner under the stars in the desert', type: 'food', duration: 90, notes: 'Included in safari packages', cost: 0 },
      ]},
    ],
    departure: { time: '09:00', title: 'Transfer to Dubai International Airport', type: 'transport', duration: 40, notes: 'Metro is easiest', cost: 3 },
  },

  singapore: {
    days: [
      { location: 'Singapore — Marina Bay', items: [
        { time: '14:00', title: 'Arrive at Changi Airport', type: 'transport', duration: 45, notes: 'MRT East-West line', cost: 2 },
        { time: '16:00', title: 'Check in — Marina Bay hotel', type: 'accommodation', duration: 30, notes: '', cost: 220 },
        { time: '18:00', title: 'Gardens by the Bay & Supertree Grove', type: 'activity', duration: 120, notes: 'Light show at 7:45pm & 8:45pm — free!', cost: 0 },
        { time: '20:30', title: 'Hawker centre dinner at Lau Pa Sat', type: 'food', duration: 90, notes: 'Try chilli crab, laksa & chicken rice', cost: 15 },
      ]},
      { location: 'Singapore — Cultural', items: [
        { time: '09:00', title: 'Maxwell Food Centre breakfast', type: 'food', duration: 60, notes: 'Tian Tian chicken rice is legendary', cost: 8 },
        { time: '10:30', title: 'Chinatown Heritage Centre', type: 'activity', duration: 90, notes: '', cost: 12 },
        { time: '13:00', title: 'Little India & Sri Veeramakaliamman Temple', type: 'activity', duration: 90, notes: '', cost: 0 },
        { time: '15:00', title: 'Marina Bay Sands SkyPark', type: 'activity', duration: 90, notes: '', cost: 26 },
        { time: '19:00', title: 'Night Safari at Singapore Zoo', type: 'activity', duration: 180, notes: 'Unique tram safari after dark', cost: 55 },
      ]},
    ],
    departure: { time: '09:00', title: 'MRT to Changi Airport', type: 'transport', duration: 40, notes: 'Allow 2.5h before flight', cost: 2 },
  },

  thailand: {
    days: [
      { location: 'Bangkok', items: [
        { time: '13:00', title: 'Arrive at Suvarnabhumi Airport', type: 'transport', duration: 60, notes: 'Airport Rail Link to city', cost: 4 },
        { time: '15:30', title: 'Check in — Sukhumvit hotel', type: 'accommodation', duration: 30, notes: '', cost: 80 },
        { time: '17:00', title: 'Wat Pho Temple & Reclining Buddha', type: 'activity', duration: 90, notes: 'Most impressive temple in Bangkok', cost: 5 },
        { time: '19:30', title: 'Street food on Yaowarat (Chinatown)', type: 'food', duration: 120, notes: 'Best street food scene in Asia', cost: 15 },
      ]},
      { location: 'Bangkok', items: [
        { time: '08:30', title: 'Grand Palace & Wat Phra Kaew', type: 'activity', duration: 180, notes: 'Dress modestly — no bare shoulders/knees', cost: 10 },
        { time: '14:30', title: 'Chao Phraya River boat tour', type: 'activity', duration: 90, notes: 'Hop-on hop-off orange flag boat', cost: 2 },
        { time: '17:00', title: 'Wat Arun at sunset', type: 'activity', duration: 90, notes: 'Climb the temple for river views', cost: 3 },
        { time: '20:00', title: 'Rooftop bar — Sky Bar at Lebua', type: 'food', duration: 90, notes: 'Stunning views', cost: 30 },
      ]},
      { location: 'Chiang Mai', items: [
        { time: '09:00', title: 'Fly Bangkok → Chiang Mai (1hr)', type: 'transport', duration: 60, notes: 'Cheap domestic flights', cost: 40 },
        { time: '12:00', title: 'Doi Suthep temple & hilltop views', type: 'activity', duration: 150, notes: '306 steps to the top!', cost: 5 },
        { time: '16:00', title: 'Elephant Nature Park half-day visit', type: 'activity', duration: 240, notes: 'Ethical elephant sanctuary — book ahead', cost: 80 },
        { time: '20:00', title: 'Night Bazaar — khao soi dinner', type: 'food', duration: 90, notes: 'Chiang Mai\'s signature dish', cost: 12 },
      ]},
    ],
    departure: { time: '09:00', title: 'Transfer to airport', type: 'transport', duration: 45, notes: 'Allow 2.5h before flight', cost: 15 },
  },

  // ─── New destinations ───────────────────────────────────

  switzerland: {
    days: [
      { location: 'Zurich', items: [
        { time: '12:00', title: 'Arrive at Zurich Airport', type: 'transport', duration: 30, notes: 'Direct train to city centre — 10 min', cost: 6 },
        { time: '13:30', title: 'Check in — Zurich Old Town hotel', type: 'accommodation', duration: 30, notes: '', cost: 250 },
        { time: '15:00', title: 'Old Town (Altstadt) & Grossmünster Church', type: 'activity', duration: 120, notes: 'Walk along the Limmat river', cost: 0 },
        { time: '18:00', title: 'Dinner at a Swiss fondue restaurant', type: 'food', duration: 90, notes: 'Try cheese fondue & rösti', cost: 50 },
      ]},
      { location: 'Interlaken', items: [
        { time: '09:00', title: 'Train to Interlaken (2h)', type: 'transport', duration: 120, notes: 'Scenic Swiss Pass train journey', cost: 0 },
        { time: '11:30', title: 'Check in — Interlaken guesthouse', type: 'accommodation', duration: 30, notes: 'Views of Eiger, Mönch & Jungfrau', cost: 160 },
        { time: '13:00', title: 'Jungfraujoch — Top of Europe', type: 'activity', duration: 300, notes: 'Book in advance — highest railway station in Europe at 3,454m', cost: 140 },
        { time: '20:00', title: 'Dinner with mountain views', type: 'food', duration: 90, notes: 'Try raclette', cost: 45 },
      ]},
      { location: 'Grindelwald & Lucerne', items: [
        { time: '09:00', title: 'Grindelwald First cliff walk', type: 'activity', duration: 180, notes: 'Glass platform over the Eiger', cost: 35 },
        { time: '14:00', title: 'Train to Lucerne', type: 'transport', duration: 90, notes: 'Scenic mountain route', cost: 0 },
        { time: '16:00', title: 'Chapel Bridge & Lake Lucerne boat ride', type: 'activity', duration: 120, notes: 'Most photographed bridge in Switzerland', cost: 20 },
        { time: '19:30', title: 'Lakeside dinner in Lucerne', type: 'food', duration: 90, notes: '', cost: 55 },
      ]},
      { location: 'Zermatt', items: [
        { time: '09:00', title: 'Train to Zermatt (car-free village)', type: 'transport', duration: 150, notes: 'No cars allowed — electric taxis only', cost: 0 },
        { time: '12:30', title: 'Matterhorn Glacier Paradise cable car', type: 'activity', duration: 180, notes: 'Highest point accessible by cable car in Alps', cost: 100 },
        { time: '17:00', title: 'Gornergrat Railway — panoramic views', type: 'activity', duration: 120, notes: 'Views of 29 peaks including the Matterhorn', cost: 50 },
        { time: '20:00', title: 'Traditional Swiss dinner in Zermatt', type: 'food', duration: 90, notes: 'Try beef fondue', cost: 65 },
      ]},
    ],
    departure: { time: '09:00', title: 'Train to Zurich Airport', type: 'transport', duration: 120, notes: 'Swiss Pass covers this', cost: 0 },
  },

  austria: {
    days: [
      { location: 'Vienna', items: [
        { time: '11:00', title: 'Arrive at Vienna International Airport', type: 'transport', duration: 40, notes: 'CAT train to city centre — 16 min', cost: 13 },
        { time: '13:00', title: 'Check in — Vienna city hotel', type: 'accommodation', duration: 30, notes: 'Near the Ringstrasse', cost: 180 },
        { time: '14:30', title: 'Schönbrunn Palace & Gardens', type: 'activity', duration: 180, notes: 'Imperial Habsburg summer palace — book ahead', cost: 30 },
        { time: '19:00', title: 'Dinner at a Viennese Beisl', type: 'food', duration: 90, notes: 'Try Wiener Schnitzel & Apfelstrudel', cost: 35 },
      ]},
      { location: 'Vienna', items: [
        { time: '09:00', title: 'Kunsthistorisches Museum (Art History Museum)', type: 'activity', duration: 180, notes: 'One of the world\'s greatest art museums', cost: 21 },
        { time: '13:00', title: 'Naschmarkt food market lunch', type: 'food', duration: 90, notes: 'Vienna\'s best outdoor market', cost: 20 },
        { time: '15:30', title: 'Belvedere Palace & Klimt\'s "The Kiss"', type: 'activity', duration: 150, notes: 'Stunning baroque palace and gardens', cost: 22 },
        { time: '20:00', title: 'Classical concert at the Musikverein', type: 'activity', duration: 120, notes: 'Vienna Philharmonic home — book ahead', cost: 60 },
      ]},
      { location: 'Salzburg', items: [
        { time: '09:00', title: 'Train to Salzburg (2.5h)', type: 'transport', duration: 150, notes: 'Scenic Austrian countryside', cost: 30 },
        { time: '12:00', title: 'Getreidegasse — Mozart\'s birthplace', type: 'activity', duration: 90, notes: 'Mozart was born at No. 9', cost: 15 },
        { time: '14:00', title: 'Hohensalzburg Fortress', type: 'activity', duration: 120, notes: 'One of the largest medieval castles in Europe', cost: 16 },
        { time: '17:00', title: 'Mirabell Palace & Gardens', type: 'activity', duration: 60, notes: 'Sound of Music filming location', cost: 0 },
        { time: '19:30', title: 'Dinner — try Salzburger Nockerl', type: 'food', duration: 90, notes: 'Traditional sweet soufflé dessert', cost: 35 },
      ]},
      { location: 'Hallstatt', items: [
        { time: '09:00', title: 'Bus & ferry to Hallstatt', type: 'transport', duration: 90, notes: 'One of the world\'s most scenic villages', cost: 15 },
        { time: '11:00', title: 'Hallstatt village walk & lake views', type: 'activity', duration: 120, notes: 'UNESCO World Heritage site', cost: 0 },
        { time: '13:30', title: 'Hallstatt Skywalk viewpoint', type: 'activity', duration: 90, notes: '360° panoramic views over the lake', cost: 10 },
        { time: '16:00', title: 'Salt Mine tour (Salzwelten)', type: 'activity', duration: 120, notes: 'World\'s oldest salt mine', cost: 35 },
      ]},
    ],
    departure: { time: '08:00', title: 'Train to Vienna Airport', type: 'transport', duration: 60, notes: 'Allow 2h before flight', cost: 13 },
  },

  shimla: {
    days: [
      { location: 'Shimla', items: [
        { time: '10:00', title: 'Arrive at Shimla (bus/train from Chandigarh)', type: 'transport', duration: 60, notes: 'Toy train from Kalka is scenic — 5 hrs', cost: 3 },
        { time: '12:00', title: 'Check in — Mall Road hotel', type: 'accommodation', duration: 30, notes: 'Great views of the Himalayas', cost: 30 },
        { time: '14:00', title: 'The Mall Road stroll & Scandal Point', type: 'activity', duration: 120, notes: 'Heart of Shimla — no vehicles allowed', cost: 0 },
        { time: '17:00', title: 'Christ Church & Ridge Maidan', type: 'activity', duration: 60, notes: 'Second oldest church in North India', cost: 0 },
        { time: '19:30', title: 'Dinner at a local Himachali dhaba', type: 'food', duration: 90, notes: 'Try Siddu, Dham, and Chana Madra', cost: 5 },
      ]},
      { location: 'Shimla — Jakhu & Kufri', items: [
        { time: '07:00', title: 'Jakhu Temple sunrise trek', type: 'activity', duration: 120, notes: 'Highest peak in Shimla — 2,455m. Watch for monkeys!', cost: 0 },
        { time: '10:00', title: 'Kufri Hill & Himalayan Nature Park', type: 'activity', duration: 180, notes: 'Yak rides and mountain views', cost: 5 },
        { time: '14:00', title: 'Lunch — try apple jam & Himachali thali', type: 'food', duration: 60, notes: 'Shimla is famous for its apples', cost: 4 },
        { time: '16:00', title: 'Shimla Heritage Walk — Viceregal Lodge', type: 'activity', duration: 120, notes: 'Former summer capital of British India', cost: 2 },
      ]},
    ],
    departure: { time: '08:00', title: 'Bus/toy train back to Chandigarh/Delhi', type: 'transport', duration: 60, notes: 'Book advance seats', cost: 3 },
  },

  manali: {
    days: [
      { location: 'Manali', items: [
        { time: '08:00', title: 'Arrive in Manali (overnight bus from Delhi)', type: 'transport', duration: 60, notes: 'Volvo buses run overnight from Delhi', cost: 8 },
        { time: '10:00', title: 'Check in — Old Manali guesthouse', type: 'accommodation', duration: 30, notes: 'Old Manali is quieter and more scenic', cost: 15 },
        { time: '12:00', title: 'Hadimba Devi Temple & cedar forest', type: 'activity', duration: 90, notes: '1553 AD wooden temple — stunning architecture', cost: 0 },
        { time: '15:00', title: 'Old Manali café & Manu Temple', type: 'activity', duration: 90, notes: 'Great cafés with mountain views', cost: 0 },
        { time: '19:00', title: 'Dinner — try Trout fish and Siddu', type: 'food', duration: 90, notes: 'Johnson\'s Café is a classic', cost: 8 },
      ]},
      { location: 'Solang Valley & Rohtang', items: [
        { time: '07:00', title: 'Rohtang Pass excursion (permit required)', type: 'activity', duration: 360, notes: 'Book online permit in advance — 3,978m altitude', cost: 5 },
        { time: '15:00', title: 'Solang Valley — snow activities & zipline', type: 'activity', duration: 180, notes: 'Paragliding, zorbing, horse riding available', cost: 10 },
        { time: '19:30', title: 'Bonfire dinner at a camp', type: 'food', duration: 120, notes: 'Many campsites offer evening bonfire setups', cost: 10 },
      ]},
      { location: 'Manali — River & Waterfalls', items: [
        { time: '09:00', title: 'Beas River rafting', type: 'activity', duration: 180, notes: 'Grade II-III rapids — safe for beginners', cost: 12 },
        { time: '13:00', title: 'Vashisht hot springs & temple', type: 'activity', duration: 90, notes: 'Natural sulphur hot spring baths', cost: 0 },
        { time: '15:30', title: 'Jogini Waterfall trek', type: 'activity', duration: 120, notes: '2-hr easy trek through apple orchards', cost: 0 },
        { time: '19:00', title: 'Dinner on a riverside restaurant', type: 'food', duration: 90, notes: '', cost: 7 },
      ]},
    ],
    departure: { time: '18:00', title: 'Overnight Volvo bus to Delhi', type: 'transport', duration: 60, notes: 'Book in advance during peak season', cost: 8 },
  },

  wayanad: {
    days: [
      { location: 'Wayanad, Kerala', items: [
        { time: '10:00', title: 'Arrive at Calicut Airport + drive to Wayanad', type: 'transport', duration: 120, notes: '2.5 hr scenic drive through the Ghats', cost: 20 },
        { time: '13:00', title: 'Check in — jungle resort / treehouse', type: 'accommodation', duration: 30, notes: 'Many eco-resorts with treehouse stays', cost: 35 },
        { time: '15:00', title: 'Edakkal Caves prehistoric rock engravings', type: 'activity', duration: 150, notes: 'Stone Age carvings — 1.5 km trek', cost: 4 },
        { time: '19:00', title: 'Dinner — Kerala Sadhya thali', type: 'food', duration: 90, notes: 'Try Puttu, Kadala curry, Appam & Stew', cost: 5 },
      ]},
      { location: 'Wayanad — Wildlife & Nature', items: [
        { time: '06:00', title: 'Wayanad Wildlife Sanctuary jeep safari', type: 'activity', duration: 180, notes: 'Spot elephants, deer, tigers — early morning best', cost: 15 },
        { time: '10:30', title: 'Soochipara Waterfall trek', type: 'activity', duration: 180, notes: '200m high, 3-tier waterfall — swimming allowed', cost: 3 },
        { time: '15:00', title: 'Banasura Sagar Dam — boat ride', type: 'activity', duration: 120, notes: 'Largest earthen dam in India, beautiful islands', cost: 5 },
        { time: '19:00', title: 'Tribal cultural show & bonfire dinner', type: 'food', duration: 120, notes: 'Many resorts host Adivasi cultural programs', cost: 12 },
      ]},
      { location: 'Chembra Peak & Tea Estates', items: [
        { time: '06:30', title: 'Chembra Peak trek (heart-shaped lake)', type: 'activity', duration: 300, notes: 'Permit required from Forest Dept — 2,100m peak', cost: 5 },
        { time: '14:00', title: 'Kalpetta tea & spice plantation tour', type: 'activity', duration: 120, notes: 'See how cardamom, pepper & coffee are grown', cost: 5 },
        { time: '17:00', title: 'Pookode Lake boat ride', type: 'activity', duration: 60, notes: 'Natural freshwater lake in the forest', cost: 3 },
        { time: '20:00', title: 'Dinner at resort — grilled forest mushrooms & rice', type: 'food', duration: 60, notes: 'Many jungle resorts serve foraged forest produce', cost: 6 },
      ]},
      { location: 'Wayanad — Tribal Heritage & Waterfalls', items: [
        { time: '08:00', title: 'Thirunelli Temple — ancient Vishnu temple', type: 'activity', duration: 120, notes: 'Sacred temple in the forest; 13th century; Papanashini River', cost: 0 },
        { time: '11:00', title: 'Kuruva Island — river delta eco trail', type: 'activity', duration: 180, notes: 'Uninhabited island; cross on bamboo rafts; rare orchids', cost: 4 },
        { time: '15:00', title: 'Meenmutty Waterfall trek', type: 'activity', duration: 150, notes: 'Second largest waterfall in Kerala — 3 km forest trek', cost: 2 },
        { time: '19:30', title: 'Adivasi (tribal) village visit & dinner', type: 'food', duration: 120, notes: 'Many tours include an authentic tribal community experience', cost: 8 },
      ]},
      { location: 'Wayanad — Coffee Trails & Village Life', items: [
        { time: '07:00', title: 'Early morning bird watching in the forest', type: 'activity', duration: 120, notes: 'Over 300 bird species recorded in Wayanad', cost: 0 },
        { time: '09:30', title: 'Coffee & pepper estate cycling tour', type: 'activity', duration: 150, notes: 'Kalpetta and Mananthavady have great cycling trails', cost: 6 },
        { time: '13:00', title: 'Lunch — local Kerala meals at a homestay', type: 'food', duration: 60, notes: 'Authentic home-cooked meals — fish, avial, rice', cost: 4 },
        { time: '15:00', title: 'Phantom Rock & Karapuzha Dam viewpoint', type: 'activity', duration: 90, notes: 'Iconic rock formation with panoramic valley views', cost: 0 },
        { time: '18:00', title: 'Sunset at Lakkidi View Point — Valley of Clouds', type: 'activity', duration: 60, notes: 'Highest point on the Kozhikode–Kalpetta highway', cost: 0 },
        { time: '20:00', title: 'Farewell dinner — Kerala beef fry & appam', type: 'food', duration: 90, notes: 'Traditional Wayanad feast to end the trip', cost: 7 },
      ]},
    ],
    departure: { time: '08:00', title: 'Drive to Calicut / Kozhikode Airport', type: 'transport', duration: 150, notes: '', cost: 20 },
  },

  kashmir: {
    days: [
      { location: 'Srinagar', items: [
        { time: '11:00', title: 'Arrive at Sheikh ul-Alam Airport, Srinagar', type: 'transport', duration: 30, notes: 'Pre-paid taxi to Dal Lake', cost: 5 },
        { time: '13:00', title: 'Check in — Dal Lake Houseboat', type: 'accommodation', duration: 30, notes: 'Stay on a traditional Kashmiri houseboat', cost: 40 },
        { time: '15:00', title: 'Shikara ride on Dal Lake at sunset', type: 'activity', duration: 120, notes: 'The most iconic experience in Kashmir', cost: 8 },
        { time: '19:00', title: 'Wazwan dinner on the houseboat', type: 'food', duration: 90, notes: 'Try Rogan Josh, Dum Aloo, Gushtaba', cost: 10 },
      ]},
      { location: 'Srinagar — Gardens & Old City', items: [
        { time: '08:00', title: 'Nishat Bagh & Shalimar Bagh Mughal Gardens', type: 'activity', duration: 180, notes: 'Tiered Mughal gardens on Dal Lake shore', cost: 2 },
        { time: '12:00', title: 'Hazratbal Shrine', type: 'activity', duration: 60, notes: 'White marble mosque on Dal Lake', cost: 0 },
        { time: '14:00', title: 'Lal Chowk & Kashmiri handicraft shopping', type: 'activity', duration: 120, notes: 'Buy Pashmina shawls, paper mache, walnut wood', cost: 0 },
        { time: '17:00', title: 'Shankaracharya Temple hilltop visit', type: 'activity', duration: 90, notes: 'Panoramic view of Srinagar & the Himalayas', cost: 0 },
      ]},
      { location: 'Gulmarg', items: [
        { time: '08:00', title: 'Drive to Gulmarg (56 km)', type: 'transport', duration: 90, notes: 'Scenic mountain road', cost: 10 },
        { time: '10:00', title: 'Gulmarg Gondola — Phase 1 & 2', type: 'activity', duration: 240, notes: 'One of the world\'s highest cable cars at 3,979m', cost: 25 },
        { time: '15:00', title: 'Skiing / snowboarding or meadow walk', type: 'activity', duration: 150, notes: 'Best ski resort in India (Nov–Mar)', cost: 20 },
        { time: '19:30', title: 'Kashmiri Kahwa & dinner', type: 'food', duration: 90, notes: 'Try saffron-infused Kahwa tea', cost: 8 },
      ]},
      { location: 'Pahalgam', items: [
        { time: '08:00', title: 'Drive to Pahalgam (95 km)', type: 'transport', duration: 150, notes: 'Scenic Lidder River valley route', cost: 12 },
        { time: '11:00', title: 'Betaab Valley & Aru Valley nature walk', type: 'activity', duration: 180, notes: 'Bollywood film shooting locations', cost: 3 },
        { time: '14:30', title: 'Lidder River trout fishing / horse ride', type: 'activity', duration: 120, notes: 'Horse rides to Baisaran meadows', cost: 8 },
        { time: '17:30', title: 'Baisaran (Mini Switzerland of India)', type: 'activity', duration: 90, notes: 'Green meadows surrounded by pine forests', cost: 3 },
      ]},
    ],
    departure: { time: '08:00', title: 'Drive to Srinagar Airport', type: 'transport', duration: 60, notes: 'Allow extra time for security checks', cost: 5 },
  },

  kerala: {
    days: [
      { location: 'Kochi (Cochin)', items: [
        { time: '11:00', title: 'Arrive at Cochin International Airport', type: 'transport', duration: 30, notes: '', cost: 5 },
        { time: '13:00', title: 'Check in — Fort Kochi heritage hotel', type: 'accommodation', duration: 30, notes: 'Stay in the historic colonial quarter', cost: 40 },
        { time: '15:00', title: 'Chinese Fishing Nets & Fort Kochi walk', type: 'activity', duration: 120, notes: 'Iconic 14th-century fishing nets at sunset', cost: 0 },
        { time: '18:00', title: 'Kathakali classical dance performance', type: 'activity', duration: 90, notes: 'Book at Kerala Kathakali Centre', cost: 8 },
        { time: '20:00', title: 'Kerala seafood dinner', type: 'food', duration: 90, notes: 'Try Karimeen (pearl spot fish) fry & prawn curry', cost: 10 },
      ]},
      { location: 'Alleppey (Alappuzha) Backwaters', items: [
        { time: '08:00', title: 'Drive to Alleppey (84 km)', type: 'transport', duration: 120, notes: '', cost: 8 },
        { time: '11:00', title: 'Check in — Kerala houseboat (kettuvallam)', type: 'accommodation', duration: 30, notes: 'Overnight houseboat cruise is the highlight!', cost: 70 },
        { time: '12:00', title: 'Backwater cruise through villages & paddy fields', type: 'activity', duration: 300, notes: 'Watch village life along the canals', cost: 0 },
        { time: '19:00', title: 'Dinner on the houseboat — fresh Kerala fish curry', type: 'food', duration: 90, notes: 'Cooked fresh on board', cost: 0 },
      ]},
      { location: 'Munnar', items: [
        { time: '08:00', title: 'Drive to Munnar (135 km)', type: 'transport', duration: 210, notes: 'Scenic Western Ghats mountain road', cost: 12 },
        { time: '12:00', title: 'Tea Museum & Kanan Devan tea estate tour', type: 'activity', duration: 150, notes: 'See how tea is processed', cost: 5 },
        { time: '15:30', title: 'Eravikulam National Park & Nilgiri Tahr', type: 'activity', duration: 120, notes: 'See the endangered Nilgiri Tahr mountain goat', cost: 8 },
        { time: '18:30', title: 'Top Station — valley views at sunset', type: 'activity', duration: 60, notes: 'Highest point in Munnar at 1,700m', cost: 0 },
      ]},
      { location: 'Thekkady (Periyar)', items: [
        { time: '09:00', title: 'Periyar Wildlife Sanctuary boat ride', type: 'activity', duration: 180, notes: 'Spot elephants, bison, otters on the lake', cost: 10 },
        { time: '14:00', title: 'Spice plantation tour — cardamom, pepper, clove', type: 'activity', duration: 120, notes: 'Kerala is the "Spice Garden of India"', cost: 6 },
        { time: '17:00', title: 'Kalaripayattu martial arts show', type: 'activity', duration: 90, notes: 'World\'s oldest martial art — from Kerala', cost: 8 },
      ]},
    ],
    departure: { time: '08:00', title: 'Drive to Cochin Airport', type: 'transport', duration: 180, notes: '', cost: 12 },
  },

  ooty: {
    days: [
      { location: 'Ooty (Udhagamandalam)', items: [
        { time: '10:00', title: 'Arrive in Ooty — Nilgiri Mountain Railway', type: 'transport', duration: 60, notes: 'Toy train from Mettupalayam — UNESCO Heritage', cost: 4 },
        { time: '12:00', title: 'Check in — heritage bungalow / hotel', type: 'accommodation', duration: 30, notes: '', cost: 25 },
        { time: '14:00', title: 'Ooty Botanical Gardens', type: 'activity', duration: 120, notes: '55 acres, over 650 plant species — 1848 AD', cost: 1 },
        { time: '17:00', title: 'Ooty Lake boating at sunset', type: 'activity', duration: 90, notes: 'Lovely artificial lake surrounded by eucalyptus', cost: 3 },
        { time: '19:30', title: 'Dinner — try Varkey, Ooty Varkey & local biryani', type: 'food', duration: 90, notes: '', cost: 5 },
      ]},
      { location: 'Ooty — Peaks & Tea', items: [
        { time: '07:00', title: 'Doddabetta Peak — highest point in Nilgiris', type: 'activity', duration: 120, notes: '2,637m — Telescope House at the top', cost: 2 },
        { time: '10:00', title: 'Tea factory visit & tasting', type: 'activity', duration: 120, notes: 'Ooty tea is famous worldwide', cost: 3 },
        { time: '13:00', title: 'Emerald Lake & Upper Bhavani lake views', type: 'activity', duration: 120, notes: 'Serene shola forest lakes', cost: 2 },
        { time: '16:00', title: 'Tibetan Monastery & market', type: 'activity', duration: 90, notes: 'Buy Tibetan handicrafts and thangkas', cost: 0 },
      ]},
      { location: 'Coonoor & Kodanad', items: [
        { time: '09:00', title: 'Sim\'s Park, Coonoor', type: 'activity', duration: 120, notes: 'Beautiful botanical garden on a hillside', cost: 1 },
        { time: '12:00', title: 'Lamb\'s Rock & Law\'s Falls viewpoints', type: 'activity', duration: 90, notes: 'Spectacular valley views', cost: 0 },
        { time: '14:30', title: 'Kodanad Elephant Training Centre', type: 'activity', duration: 120, notes: 'See elephants being trained', cost: 3 },
        { time: '17:00', title: 'Droog Fort heritage trek', type: 'activity', duration: 90, notes: '17th century fort with Hyder Ali history', cost: 1 },
      ]},
    ],
    departure: { time: '07:00', title: 'Bus / taxi to Coimbatore Airport', type: 'transport', duration: 120, notes: '2.5 hr drive through Nilgiri hills', cost: 8 },
  },

  hampi: {
    days: [
      { location: 'Hampi, Karnataka', items: [
        { time: '07:00', title: 'Arrive in Hampi (overnight train from Bangalore)', type: 'transport', duration: 60, notes: 'Hospet is the nearest railhead — 13 km to Hampi', cost: 5 },
        { time: '09:00', title: 'Check in — Hampi guesthouse / river view stay', type: 'accommodation', duration: 30, notes: 'Stay near the Virupaksha Temple', cost: 15 },
        { time: '10:00', title: 'Virupaksha Temple — living 7th century temple', type: 'activity', duration: 120, notes: 'One of the oldest functioning temples in India', cost: 1 },
        { time: '13:00', title: 'Hampi Bazaar & Nandi statue', type: 'activity', duration: 90, notes: 'Ancient 15th century marketplace', cost: 0 },
        { time: '17:00', title: 'Hemakuta Hill sunset — temple cluster', type: 'activity', duration: 90, notes: 'Best sunset views over Hampi ruins', cost: 0 },
        { time: '19:30', title: 'Dinner at a rooftop café with ruins view', type: 'food', duration: 90, notes: 'Many restaurants overlook the Virupaksha Temple', cost: 5 },
      ]},
      { location: 'Hampi — Royal Enclosure & Vittala', items: [
        { time: '08:00', title: 'Vittala Temple & Stone Chariot', type: 'activity', duration: 150, notes: 'UNESCO — most exquisite temple in Hampi. Musical pillars!', cost: 10 },
        { time: '11:30', title: 'Elephant Stables & Zenana Enclosure', type: 'activity', duration: 90, notes: 'Indo-Islamic architecture — once housed royal elephants', cost: 10 },
        { time: '14:00', title: 'Royal Enclosure & Queen\'s Bath', type: 'activity', duration: 120, notes: 'Elaborate bathing tank for the royal family', cost: 10 },
        { time: '17:00', title: 'Tungabhadra River coracle ride', type: 'activity', duration: 60, notes: 'Round basket boat — very unique!', cost: 3 },
        { time: '19:00', title: 'Sunset at Matanga Hill', type: 'activity', duration: 90, notes: 'Best panoramic view of entire Hampi', cost: 0 },
      ]},
    ],
    departure: { time: '07:00', title: 'Bus / taxi to Hospet station for train', type: 'transport', duration: 60, notes: '', cost: 3 },
  },

  ayodhya: {
    days: [
      { location: 'Ayodhya, UP', items: [
        { time: '10:00', title: 'Arrive at Ayodhya Railway Station', type: 'transport', duration: 30, notes: 'Well connected from Lucknow, Delhi, Varanasi', cost: 3 },
        { time: '11:00', title: 'Check in — dharamshala or hotel', type: 'accommodation', duration: 30, notes: '', cost: 10 },
        { time: '13:00', title: 'Ram Mandir — the new grand temple', type: 'activity', duration: 180, notes: 'Pran Pratishtha 2024 — magnificent new temple', cost: 0 },
        { time: '17:00', title: 'Saryu River Aarti at Ghat', type: 'activity', duration: 90, notes: 'Evening aarti is especially beautiful', cost: 0 },
        { time: '19:30', title: 'Dinner — try Ayodhya ki sweets & laddoos', type: 'food', duration: 60, notes: '', cost: 4 },
      ]},
      { location: 'Ayodhya — Temples & Ghats', items: [
        { time: '06:00', title: 'Saryu River sunrise boat ride', type: 'activity', duration: 90, notes: 'Peaceful morning on the holy river', cost: 3 },
        { time: '08:30', title: 'Hanuman Garhi Temple', type: 'activity', duration: 90, notes: '76 steps to the hilltop temple', cost: 0 },
        { time: '11:00', title: 'Kanak Bhawan Temple', type: 'activity', duration: 60, notes: 'Gifted to Sita by Kaikeyi — gold-crowned idols', cost: 0 },
        { time: '13:00', title: 'Treta Ka Thakur Temple', type: 'activity', duration: 60, notes: 'Site where Ram performed Ashwamedh Yajna', cost: 0 },
        { time: '15:00', title: 'Ramkot & Ram ki Paidi Ghats', type: 'activity', duration: 120, notes: 'Holy ghats with 4 lakh lamps lit on Deepotsav', cost: 0 },
        { time: '18:30', title: 'Deepotsav light show (if visiting around Diwali)', type: 'activity', duration: 90, notes: 'World record setting lamp festival', cost: 0 },
      ]},
    ],
    departure: { time: '08:00', title: 'Train to Varanasi / Lucknow', type: 'transport', duration: 60, notes: '', cost: 4 },
  },

  varanasi: {
    days: [
      { location: 'Varanasi (Kashi), UP', items: [
        { time: '10:00', title: 'Arrive at Varanasi Junction / Lal Bahadur Airport', type: 'transport', duration: 40, notes: '', cost: 4 },
        { time: '12:00', title: 'Check in — guesthouse near the Ghats', type: 'accommodation', duration: 30, notes: 'Staying near Assi Ghat is most authentic', cost: 15 },
        { time: '14:00', title: 'Boat ride on the Ganges — view all 84 Ghats', type: 'activity', duration: 150, notes: 'Most ancient living city on Earth', cost: 5 },
        { time: '18:30', title: 'Ganga Aarti at Dashashwamedh Ghat', type: 'activity', duration: 90, notes: 'Most spectacular ritual in India — arrive early!', cost: 0 },
        { time: '20:30', title: 'Dinner — try Baati Chokha & Thandai', type: 'food', duration: 90, notes: 'Famous Kachori-sabzi breakfast is amazing', cost: 4 },
      ]},
      { location: 'Varanasi — Temples & Sarnath', items: [
        { time: '05:00', title: 'Pre-dawn Ganges sunrise boat ride', type: 'activity', duration: 120, notes: 'Most spiritual experience — morning rituals on the ghats', cost: 5 },
        { time: '08:00', title: 'Kashi Vishwanath Temple (Jyotirlinga)', type: 'activity', duration: 90, notes: 'One of the 12 Jyotirlingas — new corridor opened 2022', cost: 0 },
        { time: '10:30', title: 'Sarnath — where Buddha gave first sermon', type: 'activity', duration: 180, notes: '10 km from Varanasi — Dhamek Stupa is magnificent', cost: 3 },
        { time: '14:30', title: 'Banaras Hindu University & Vishwanath Temple', type: 'activity', duration: 90, notes: 'Beautiful campus and temple inside', cost: 0 },
        { time: '17:00', title: 'Manikarnika Ghat — the eternal burning ghat', type: 'activity', duration: 60, notes: 'Most sacred cremation ghat — observe respectfully', cost: 0 },
        { time: '19:30', title: 'Lassi at Blue Lassi shop & chaat dinner', type: 'food', duration: 90, notes: 'Blue Lassi is a 100-year-old institution', cost: 4 },
      ]},
    ],
    departure: { time: '07:00', title: 'Transfer to Varanasi Airport / Railway Station', type: 'transport', duration: 60, notes: '', cost: 4 },
  },

  mahabaleshwar: {
    days: [
      { location: 'Mahabaleshwar, Maharashtra', items: [
        { time: '10:00', title: 'Arrive at Mahabaleshwar — check in to resort', type: 'accommodation', duration: 45, notes: 'Book a resort with valley views for best experience', cost: 40 },
        { time: '12:00', title: 'Venna Lake — boating & horse riding', type: 'activity', duration: 120, notes: 'Iconic lake in the heart of Mahabaleshwar', cost: 8 },
        { time: '14:30', title: 'Lunch — try fresh corn and strawberry cream', type: 'food', duration: 60, notes: 'Mahabaleshwar is famous for strawberries', cost: 6 },
        { time: '16:00', title: 'Arthur\'s Seat — the Queen of all Points', type: 'activity', duration: 90, notes: 'Panoramic view of the Savitri Valley and Koyna valley', cost: 0 },
        { time: '19:00', title: 'Sunset at Wilson Point (Sunrise Point)', type: 'activity', duration: 60, notes: 'Best spot to watch sunset over the Sahyadri ranges', cost: 0 },
        { time: '20:30', title: 'Dinner at a local restaurant', type: 'food', duration: 90, notes: 'Try Maharashtrian thali and fresh strawberry desserts', cost: 8 },
      ]},
      { location: 'Mahabaleshwar — Viewpoints & Temples', items: [
        { time: '07:00', title: 'Sunrise at Bombay Point (Kate\'s Point)', type: 'activity', duration: 60, notes: 'Most popular sunrise viewpoint in Mahabaleshwar', cost: 0 },
        { time: '09:00', title: 'Mahabaleshwar Temple — ancient Shiva temple', type: 'activity', duration: 60, notes: '13th-century temple with the sacred Krishnabai spring', cost: 0 },
        { time: '10:30', title: 'Strawberry farm visit & picking', type: 'activity', duration: 90, notes: 'Best season: Nov–Mar. Buy fresh strawberries & jam', cost: 5 },
        { time: '13:00', title: 'Lunch — local dhaba on NH48', type: 'food', duration: 60, notes: 'Vada pav and missal pav are must-tries', cost: 4 },
        { time: '14:30', title: 'Elephant\'s Head Point & Needle Hole Point', type: 'activity', duration: 90, notes: 'Unique rock formations with valley views', cost: 0 },
        { time: '17:00', title: 'Mapro Garden — strawberry factory & garden', type: 'activity', duration: 90, notes: 'Famous for strawberry products; great for kids', cost: 3 },
        { time: '20:00', title: 'Shopping on Main Bazaar — jams & honey', type: 'activity', duration: 60, notes: 'Pick up local honey, strawberry products, chikki', cost: 10 },
      ]},
    ],
    departure: { time: '09:00', title: 'Drive back to Pune / Mumbai', type: 'transport', duration: 180, notes: 'Mahabaleshwar is ~120 km from Pune', cost: 8 },
  },

  udaipur: {
    days: [
      { location: 'Udaipur, Rajasthan', items: [
        { time: '10:00', title: 'Arrive & check in — lakeside hotel', type: 'accommodation', duration: 45, notes: 'Stay near Pichola Lake for best views', cost: 35 },
        { time: '12:00', title: 'City Palace — grandest palace in Rajasthan', type: 'activity', duration: 150, notes: 'Museum inside covers 400 years of Mewar history', cost: 8 },
        { time: '15:30', title: 'Boat ride on Lake Pichola to Jag Mandir', type: 'activity', duration: 90, notes: 'Best views of the Lake Palace and City Palace', cost: 7 },
        { time: '18:00', title: 'Sunset at Ambrai Ghat', type: 'activity', duration: 60, notes: 'Iconic sunset spot facing City Palace', cost: 0 },
        { time: '19:30', title: 'Dinner at rooftop restaurant over the lake', type: 'food', duration: 90, notes: 'Ambrai or Upre restaurant — book in advance', cost: 15 },
      ]},
      { location: 'Udaipur — Temples & Bazaars', items: [
        { time: '08:00', title: 'Jagdish Temple — largest in Udaipur', type: 'activity', duration: 60, notes: '17th-century temple dedicated to Lord Vishnu', cost: 0 },
        { time: '09:30', title: 'Saheliyon Ki Bari — Garden of Maidens', type: 'activity', duration: 60, notes: 'Beautiful garden with fountains and lotus pools', cost: 1 },
        { time: '11:00', title: 'Fateh Sagar Lake & Nehru Park boat ride', type: 'activity', duration: 90, notes: 'Second major lake — serene and less crowded', cost: 3 },
        { time: '13:00', title: 'Lunch — Dal Baati Churma at a local dhaba', type: 'food', duration: 60, notes: 'Traditional Rajasthani meal — must try!', cost: 5 },
        { time: '15:00', title: 'Hathi Pol Bazaar — local crafts & silver jewellery', type: 'activity', duration: 90, notes: 'Best place for miniature paintings and tie-dye fabric', cost: 10 },
        { time: '17:30', title: 'Monsoon Palace (Sajjangarh) for panoramic views', type: 'activity', duration: 90, notes: 'On a hilltop — spectacular views of lakes at sunset', cost: 3 },
      ]},
    ],
    departure: { time: '08:00', title: 'Transfer to Udaipur Airport / Railway Station', type: 'transport', duration: 45, notes: '', cost: 5 },
  },

  southkorea: {
    days: [
      { location: 'Seoul, South Korea', items: [
        { time: '11:00', title: 'Arrive at Incheon International Airport', type: 'transport', duration: 60, notes: 'Take AREX express train to Seoul station (~43 min)', cost: 9 },
        { time: '13:00', title: 'Check in to hotel in Myeongdong', type: 'accommodation', duration: 30, notes: 'Central location for shopping and sightseeing', cost: 80 },
        { time: '15:00', title: 'Gyeongbokgung Palace & National Folk Museum', type: 'activity', duration: 150, notes: 'Try hanbok rental at the palace entrance', cost: 3 },
        { time: '18:00', title: 'Bukchon Hanok Village walk', type: 'activity', duration: 90, notes: 'Traditional Korean village — best in early morning or evening', cost: 0 },
        { time: '20:00', title: 'Myeongdong night market — Korean street food', type: 'food', duration: 90, notes: 'Try tteokbokki, tornado potato, and hotteok', cost: 12 },
      ]},
      { location: 'Seoul — K-culture & Han River', items: [
        { time: '09:00', title: 'N Seoul Tower & Namsan Park', type: 'activity', duration: 120, notes: 'Great city views; take the cable car up', cost: 11 },
        { time: '12:00', title: 'Lunch in Insadong — traditional Korean set meal', type: 'food', duration: 60, notes: 'Try bibimbap or sundubu jjigae', cost: 10 },
        { time: '14:00', title: 'Hongdae — K-pop culture, street art & shopping', type: 'activity', duration: 120, notes: 'Vibrant youth district with live busking', cost: 0 },
        { time: '17:00', title: 'Han River Picnic at Yeouido Park', type: 'activity', duration: 90, notes: 'Rent a bike along the river; convenience store picnic', cost: 5 },
        { time: '19:30', title: 'Korean BBQ dinner — samgyeopsal & galbi', type: 'food', duration: 120, notes: 'Mapo-gu area has great BBQ options', cost: 18 },
      ]},
      { location: 'Busan Day Trip', items: [
        { time: '07:30', title: 'KTX train Seoul → Busan', type: 'transport', duration: 170, notes: 'Book in advance — 2h 45min by KTX bullet train', cost: 45 },
        { time: '11:00', title: 'Haeundae Beach walk', type: 'activity', duration: 90, notes: 'Most famous beach in South Korea', cost: 0 },
        { time: '13:00', title: 'Jagalchi Fish Market — fresh seafood lunch', type: 'food', duration: 90, notes: 'Largest seafood market in Korea — eat upstairs', cost: 15 },
        { time: '15:00', title: 'Gamcheon Culture Village', type: 'activity', duration: 120, notes: 'Colourful hillside village with art installations', cost: 2 },
        { time: '18:00', title: 'KTX back to Seoul', type: 'transport', duration: 170, notes: '', cost: 45 },
      ]},
    ],
    departure: { time: '08:00', title: 'Transfer to Incheon Airport', type: 'transport', duration: 75, notes: 'Allow 3 hours before international departure', cost: 9 },
  },

  vietnam: {
    days: [
      { location: 'Hanoi, Vietnam', items: [
        { time: '11:00', title: 'Arrive at Noi Bai International Airport', type: 'transport', duration: 45, notes: 'Grab taxi or bus 86 to Old Quarter (~45 min)', cost: 6 },
        { time: '13:00', title: 'Check in — boutique hotel in Old Quarter', type: 'accommodation', duration: 30, notes: 'Old Quarter is the best base in Hanoi', cost: 30 },
        { time: '14:00', title: 'Hoan Kiem Lake & Ngoc Son Temple', type: 'activity', duration: 90, notes: 'Heart of Hanoi — peaceful lakeside walk', cost: 1 },
        { time: '16:00', title: 'Old Quarter walking tour — 36 ancient streets', type: 'activity', duration: 90, notes: 'Each street traditionally sold one type of good', cost: 0 },
        { time: '18:30', title: 'Bia Hoi corner (Ta Hien St) — street beer & food', type: 'food', duration: 90, notes: 'Freshest & cheapest beer in the world ($0.30)', cost: 4 },
        { time: '20:30', title: 'Bun Cha dinner (Obama\'s dish)', type: 'food', duration: 60, notes: 'Bun Cha Huong Lien — made famous by Anthony Bourdain', cost: 3 },
      ]},
      { location: 'Ha Long Bay / Ninh Binh', items: [
        { time: '08:00', title: 'Drive to Ha Long Bay or Ninh Binh', type: 'transport', duration: 180, notes: 'Ha Long: 3.5h; Ninh Binh: 2h from Hanoi', cost: 10 },
        { time: '12:00', title: 'Boat cruise — limestone karsts & floating villages', type: 'activity', duration: 240, notes: 'Ha Long Bay is a UNESCO World Heritage Site', cost: 50 },
        { time: '18:00', title: 'Sunset on the bay deck', type: 'activity', duration: 60, notes: 'Most magical moment of the trip', cost: 0 },
        { time: '20:00', title: 'Seafood dinner on the cruise boat', type: 'food', duration: 90, notes: 'Fresh squid, prawns and crab', cost: 15 },
      ]},
      { location: 'Hoi An, Central Vietnam', items: [
        { time: '08:00', title: 'Fly Hanoi → Da Nang', type: 'transport', duration: 80, notes: 'VietJet or Bamboo Air — book in advance', cost: 25 },
        { time: '11:00', title: 'Hoi An Ancient Town UNESCO walk', type: 'activity', duration: 150, notes: 'Japanese Covered Bridge, merchant houses — magical!', cost: 5 },
        { time: '14:30', title: 'Tailored clothing at Hoi An market', type: 'activity', duration: 120, notes: 'Custom ao dai or suit made in 24 hours', cost: 30 },
        { time: '17:00', title: 'Lantern release on Thu Bon River', type: 'activity', duration: 60, notes: 'Full moon festival nights are spectacular', cost: 2 },
        { time: '19:00', title: 'Cao Lau & White Rose dumplings dinner', type: 'food', duration: 90, notes: 'Dishes unique to Hoi An — don\'t miss them', cost: 6 },
      ]},
    ],
    departure: { time: '07:00', title: 'Transfer to Da Nang / Hanoi Airport', type: 'transport', duration: 60, notes: '', cost: 7 },
  },

  goa: {
    days: [
      { location: 'North Goa', items: [
        { time: '11:00', title: 'Arrive at Goa Airport (Manohar International)', type: 'transport', duration: 45, notes: 'Book a pre-paid taxi to your resort', cost: 8 },
        { time: '13:00', title: 'Check in — beachside resort in Calangute/Baga', type: 'accommodation', duration: 30, notes: 'North Goa for nightlife; South Goa for peace', cost: 40 },
        { time: '15:00', title: 'Baga Beach — swimming & water sports', type: 'activity', duration: 150, notes: 'Try parasailing, banana boat, jet ski', cost: 20 },
        { time: '19:00', title: 'Sundowner at Tito\'s or Café Mambo beach club', type: 'food', duration: 90, notes: 'Classic Goa beach party scene starts here', cost: 12 },
        { time: '21:00', title: 'Dinner — fresh seafood at beach shack', type: 'food', duration: 90, notes: 'Try Goan fish curry, prawn balchão and feni', cost: 10 },
      ]},
      { location: 'North Goa — Old Goa & Forts', items: [
        { time: '09:00', title: 'Old Goa — Basilica of Bom Jesus (UNESCO)', type: 'activity', duration: 90, notes: 'St. Francis Xavier\'s tomb is here — most sacred in Goa', cost: 0 },
        { time: '11:00', title: 'Se Cathedral — largest church in Asia', type: 'activity', duration: 60, notes: 'Portuguese colonial architecture at its finest', cost: 0 },
        { time: '13:00', title: 'Lunch at a local Goan restaurant', type: 'food', duration: 60, notes: 'Try chicken cafreal, sorpotel and bebinca dessert', cost: 8 },
        { time: '15:00', title: 'Chapora Fort — from Dil Chahta Hai fame', type: 'activity', duration: 90, notes: 'Stunning views of Vagator Beach from the top', cost: 0 },
        { time: '17:30', title: 'Anjuna Flea Market (Wed only) or Arpora Night Market', type: 'activity', duration: 120, notes: 'Best place for hippie fashion, crafts and spices', cost: 10 },
        { time: '20:30', title: 'Casino or club night (18+)', type: 'activity', duration: 180, notes: 'Casino Pride or Deltin Royale are floating casinos', cost: 25 },
      ]},
      { location: 'South Goa — Beaches & Spice Farms', items: [
        { time: '09:00', title: 'Palolem Beach — crescent shaped paradise', type: 'activity', duration: 150, notes: 'Most beautiful beach in Goa — calm waters, great for swim', cost: 0 },
        { time: '12:30', title: 'Seafood lunch at a Palolem beach shack', type: 'food', duration: 60, notes: 'Lobster thermidor and tiger prawns are amazing here', cost: 15 },
        { time: '14:30', title: 'Tropical Spice Plantation tour', type: 'activity', duration: 120, notes: 'See cardamom, vanilla, pepper growing; elephant encounter', cost: 12 },
        { time: '17:30', title: 'Dudhsagar Waterfalls viewpoint', type: 'activity', duration: 90, notes: '4-tier waterfall on Karnataka border — spectacular in monsoon', cost: 5 },
        { time: '20:00', title: 'Farewell Goan dinner with feni cocktails', type: 'food', duration: 90, notes: 'Cashew feni is the iconic local spirit of Goa', cost: 10 },
      ]},
    ],
    departure: { time: '08:00', title: 'Transfer to Goa Airport', type: 'transport', duration: 60, notes: '', cost: 8 },
  },

  hyderabad: {
    days: [
      { location: 'Hyderabad, Telangana', items: [
        { time: '10:00', title: 'Arrive — check in to hotel in Banjara Hills', type: 'accommodation', duration: 45, notes: 'Banjara Hills or Jubilee Hills for upscale stay', cost: 35 },
        { time: '12:00', title: 'Charminar — iconic 16th-century monument', type: 'activity', duration: 90, notes: 'Most recognisable landmark of Hyderabad', cost: 2 },
        { time: '14:00', title: 'Laad Bazaar — bangle shopping around Charminar', type: 'activity', duration: 60, notes: 'Famous for glass bangles, pearls and attar', cost: 10 },
        { time: '15:30', title: 'Mecca Masjid — one of India\'s oldest & largest mosques', type: 'activity', duration: 45, notes: 'Built using bricks from Mecca — dress modestly', cost: 0 },
        { time: '18:00', title: 'Biryani dinner at Paradise or Bawarchi', type: 'food', duration: 90, notes: 'Hyderabadi dum biryani is world-famous — worth the wait', cost: 8 },
      ]},
      { location: 'Hyderabad — Golconda & Hi-Tech City', items: [
        { time: '08:30', title: 'Golconda Fort — acoustic marvel', type: 'activity', duration: 150, notes: 'Clap at the entrance gate to hear echo at the top', cost: 3 },
        { time: '11:30', title: 'Qutb Shahi Tombs — Persian architecture', type: 'activity', duration: 90, notes: 'Restored necropolis near Golconda Fort', cost: 2 },
        { time: '13:30', title: 'Lunch — Irani chai & Osmania biscuits', type: 'food', duration: 60, notes: 'Try Nimrah Café near Charminar for authentic Irani chai', cost: 3 },
        { time: '15:30', title: 'Salar Jung Museum — world\'s largest one-man collection', type: 'activity', duration: 120, notes: 'Over 43,000 artifacts; famous for the Veiled Rebecca statue', cost: 2 },
        { time: '18:30', title: 'HITEC City skyline walk & dinner', type: 'food', duration: 90, notes: 'Modern Hyderabad — great rooftop restaurants in Gachibowli', cost: 12 },
        { time: '21:00', title: 'Haleem dinner (seasonal) at Shah Ghouse', type: 'food', duration: 60, notes: 'GI-tagged Hyderabadi Haleem — best during Ramadan', cost: 5 },
      ]},
    ],
    departure: { time: '08:00', title: 'Transfer to Rajiv Gandhi International Airport', type: 'transport', duration: 60, notes: '', cost: 6 },
  },

  mumbai: {
    days: [
      { location: 'Mumbai, Maharashtra', items: [
        { time: '11:00', title: 'Arrive at Chhatrapati Shivaji Maharaj Airport', type: 'transport', duration: 45, notes: 'Take Metro Line 1 or pre-paid taxi to hotel', cost: 5 },
        { time: '13:00', title: 'Check in — hotel in Colaba or Bandra', type: 'accommodation', duration: 30, notes: 'Colaba for heritage; Bandra for trendy vibe', cost: 50 },
        { time: '14:30', title: 'Gateway of India & Colaba Causeway', type: 'activity', duration: 90, notes: 'Iconic arch — take the ferry to Elephanta Caves from here', cost: 0 },
        { time: '17:00', title: 'Marine Drive (Queen\'s Necklace) sunset walk', type: 'activity', duration: 90, notes: '3.6 km coastal promenade — most romantic in Mumbai', cost: 0 },
        { time: '19:30', title: 'Dinner at Leopold Café — Colaba institution since 1871', type: 'food', duration: 90, notes: 'Featured in Shantaram novel; great vibe and food', cost: 12 },
      ]},
      { location: 'Mumbai — Heritage & Street Food', items: [
        { time: '08:00', title: 'Elephanta Caves — UNESCO rock-cut temples', type: 'activity', duration: 240, notes: 'Ferry from Gateway of India takes 1 hour each way', cost: 10 },
        { time: '13:30', title: 'Vada Pav at Ashok Vada Pav, Dadar', type: 'food', duration: 30, notes: 'Mumbai\'s soul food — best on the street', cost: 1 },
        { time: '14:30', title: 'CST (Chhatrapati Shivaji Terminus) — UNESCO station', type: 'activity', duration: 60, notes: 'Victorian Gothic architecture — most photographed station', cost: 0 },
        { time: '16:00', title: 'Crawford Market & Dharavi walk', type: 'activity', duration: 120, notes: 'Asia\'s largest slum — book a responsible tour', cost: 12 },
        { time: '19:00', title: 'Bandra — Carter Road promenade & dinner', type: 'food', duration: 120, notes: 'Hipster cafés, sea view — try The Bagel Shop or Bastian', cost: 15 },
      ]},
      { location: 'Mumbai — Bollywood & Beaches', items: [
        { time: '09:00', title: 'Film City studio tour (Goregaon)', type: 'activity', duration: 180, notes: 'Bollywood sets, shooting locations — book in advance', cost: 10 },
        { time: '13:00', title: 'Juhu Beach & street food', type: 'food', duration: 90, notes: 'Pani puri, bhel puri, sev puri on the beach', cost: 4 },
        { time: '15:30', title: 'Versova or Madh Island — offbeat beach', type: 'activity', duration: 90, notes: 'Less crowded; great for the golden hour photos', cost: 0 },
        { time: '18:30', title: 'Worli Sea Face — Bandra-Worli Sea Link at dusk', type: 'activity', duration: 60, notes: '2-km cable-stayed bridge — iconic Mumbai skyline view', cost: 0 },
        { time: '20:30', title: 'Seafood dinner at Mahesh Lunch Home', type: 'food', duration: 90, notes: 'Iconic seafood restaurant — try Bombil fry and butter garlic crab', cost: 18 },
      ]},
    ],
    departure: { time: '07:00', title: 'Transfer to Chhatrapati Shivaji Maharaj Airport', type: 'transport', duration: 60, notes: 'Allow 3 hours for international flights', cost: 5 },
  },

  ladakh: {
    days: [
      { location: 'Leh, Ladakh', items: [
        { time: '10:00', title: 'Arrive at Kushok Bakula Rimpochee Airport, Leh', type: 'transport', duration: 30, notes: 'REST the entire first day — altitude acclimatisation is mandatory', cost: 0 },
        { time: '11:00', title: 'Check in & complete rest (3500m altitude)', type: 'accommodation', duration: 60, notes: 'Do NOT exert yourself on day 1 — risk of AMS', cost: 30 },
        { time: '14:00', title: 'Leh Market & Leh Palace (light walk only)', type: 'activity', duration: 90, notes: 'Easy stroll only — no climbing on day 1', cost: 1 },
        { time: '17:00', title: 'Shanti Stupa sunset viewpoint', type: 'activity', duration: 60, notes: 'White-domed stupa with panoramic Leh valley views', cost: 0 },
        { time: '19:00', title: 'Dinner — Tibetan thukpa and momos', type: 'food', duration: 90, notes: 'Try Tibetan Kitchen or Lehchen restaurant', cost: 5 },
      ]},
      { location: 'Leh — Monasteries', items: [
        { time: '08:00', title: 'Thiksey Monastery — mini Potala Palace', type: 'activity', duration: 90, notes: 'Morning puja at 6am is magical; 12-storey monastery', cost: 2 },
        { time: '10:30', title: 'Hemis Monastery — largest in Ladakh', type: 'activity', duration: 90, notes: 'Famous Hemis Festival held in June/July', cost: 2 },
        { time: '13:00', title: 'Lunch at Kargil highway dhaba', type: 'food', duration: 60, notes: 'Simple daal-rice with incredible mountain views', cost: 3 },
        { time: '15:00', title: 'Shey Palace & Druk Padma Karpo School', type: 'activity', duration: 90, notes: 'School from 3 Idiots film! Palace has giant Buddha statue', cost: 1 },
        { time: '18:00', title: 'Indus-Zanskar river confluence at Nimmu', type: 'activity', duration: 60, notes: 'Two rivers of different colours meeting — stunning sight', cost: 0 },
      ]},
      { location: 'Nubra Valley via Khardung La', items: [
        { time: '07:00', title: 'Drive over Khardung La (5359m) — world\'s high motorable pass', type: 'transport', duration: 180, notes: 'Carry oxygen; do not stop too long at the top', cost: 5 },
        { time: '11:00', title: 'Nubra Valley — Diskit Monastery & Giant Buddha', type: 'activity', duration: 120, notes: 'Serene valley between two mountain ranges', cost: 2 },
        { time: '14:00', title: 'Hunder sand dunes — double-humped Bactrian camels', type: 'activity', duration: 90, notes: 'Unique cold desert; camel ride across the dunes', cost: 8 },
        { time: '17:30', title: 'Camp stay in Nubra Valley', type: 'accommodation', duration: 60, notes: 'Luxury tents available — stargazing is spectacular', cost: 35 },
        { time: '20:00', title: 'Bonfire dinner under the Milky Way', type: 'food', duration: 90, notes: 'Zero light pollution — best stargazing in India', cost: 0 },
      ]},
      { location: 'Pangong Tso Lake', items: [
        { time: '07:00', title: 'Drive to Pangong Lake via Chang La (5360m)', type: 'transport', duration: 240, notes: 'One of the highest mountain passes in the world', cost: 5 },
        { time: '12:00', title: 'Pangong Tso — the colour-changing lake', type: 'activity', duration: 180, notes: 'Lake changes from blue to green to red — magical!', cost: 0 },
        { time: '16:00', title: '3 Idiots ending scene spot — Pangong shore', type: 'activity', duration: 60, notes: 'The iconic red scooter scene was shot here', cost: 0 },
        { time: '18:30', title: 'Camp at Pangong lakeshore', type: 'accommodation', duration: 60, notes: 'Sunrise over the lake is breathtaking', cost: 30 },
        { time: '21:00', title: 'Dinner in camp', type: 'food', duration: 60, notes: '', cost: 0 },
      ]},
    ],
    departure: { time: '07:00', title: 'Drive back to Leh Airport', type: 'transport', duration: 240, notes: 'Allow extra time — mountain roads can be unpredictable', cost: 10 },
  },

  meghalaya: {
    days: [
      { location: 'Shillong, Meghalaya', items: [
        { time: '11:00', title: 'Arrive at Shillong Airport / Guwahati + road transfer', type: 'transport', duration: 120, notes: 'Guwahati to Shillong is ~100km (~2.5 hrs)', cost: 10 },
        { time: '14:00', title: 'Check in — hotel in Police Bazaar area', type: 'accommodation', duration: 30, notes: 'Central location for all sightseeing', cost: 25 },
        { time: '15:30', title: 'Shillong Peak — highest point with panoramic view', type: 'activity', duration: 90, notes: 'Air Force restricted area; check permissions', cost: 2 },
        { time: '18:00', title: 'Ward\'s Lake & Don Bosco Museum', type: 'activity', duration: 90, notes: 'Largest museum in Northeast India — 7 floors of tribal culture', cost: 3 },
        { time: '20:00', title: 'Dinner — Jadoh (Khasi red rice & pork) & Tungtap chutney', type: 'food', duration: 90, notes: 'Try local Khasi cuisine — rich and smoky', cost: 6 },
      ]},
      { location: 'Cherrapunji (Sohra) — Wettest Place on Earth', items: [
        { time: '07:00', title: 'Drive to Cherrapunji (55 km from Shillong)', type: 'transport', duration: 90, notes: 'Road passes through stunning cloud-covered hills', cost: 8 },
        { time: '09:30', title: 'Nohkalikai Falls — tallest plunge waterfall in India', type: 'activity', duration: 90, notes: '340m drop — most dramatic waterfall in Northeast', cost: 2 },
        { time: '12:00', title: 'Eco Park viewpoint — Bangladesh plains visible', type: 'activity', duration: 60, notes: 'On clear days you can see Bangladesh below the clouds', cost: 2 },
        { time: '14:00', title: 'Lunch — bamboo-cooked pork at local home', type: 'food', duration: 60, notes: 'Homestay lunches are the most authentic', cost: 5 },
        { time: '15:30', title: 'Mawsmai Cave — limestone cave system', type: 'activity', duration: 60, notes: 'Walk through narrow, lit limestone passages', cost: 2 },
        { time: '17:30', title: 'Seven Sisters Falls viewpoint (seasonal)', type: 'activity', duration: 60, notes: 'Best in monsoon (June–September)', cost: 0 },
      ]},
      { location: 'Double Decker Living Root Bridge', items: [
        { time: '07:00', title: 'Drive to Riwai village / Nongriat trek start', type: 'transport', duration: 120, notes: 'Trek starts at Tyrna village — 3500 steps down and up', cost: 5 },
        { time: '09:30', title: 'Trek to Double Decker Living Root Bridge', type: 'activity', duration: 180, notes: 'UNESCO aspirant — 500-year-old bridge grown from tree roots', cost: 0 },
        { time: '13:00', title: 'Swim in the crystal clear blue pool near root bridge', type: 'activity', duration: 60, notes: 'Most pristine natural pool you will ever see', cost: 0 },
        { time: '15:30', title: 'Trek back up — 3500 steps return', type: 'activity', duration: 150, notes: 'Bring good shoes and plenty of water', cost: 0 },
        { time: '19:00', title: 'Mawlynnong — Asia\'s cleanest village', type: 'activity', duration: 90, notes: 'Spotless village with living root bridges and sky walk', cost: 2 },
      ]},
    ],
    departure: { time: '08:00', title: 'Drive to Guwahati Airport', type: 'transport', duration: 150, notes: 'Allow extra time — mountain roads', cost: 10 },
  },
};

const INDIAN_DEST_KEYS = new Set([
  'shimla', 'manali', 'wayanad', 'kashmir', 'kerala', 'ooty',
  'hampi', 'ayodhya', 'varanasi', 'mahabaleshwar', 'udaipur',
  'goa', 'hyderabad', 'mumbai', 'ladakh', 'meghalaya',
]);

const DEST_ALIASES = {
  japan: 'japan', tokyo: 'japan', kyoto: 'japan', osaka: 'japan',
  bali: 'bali', ubud: 'bali', seminyak: 'bali',
  paris: 'paris', france: 'paris',
  london: 'london', england: 'london', uk: 'london',
  dubai: 'dubai', uae: 'dubai',
  singapore: 'singapore',
  thailand: 'thailand', bangkok: 'thailand', phuket: 'thailand', 'chiang mai': 'thailand',
  switzerland: 'switzerland', zurich: 'switzerland', interlaken: 'switzerland', zermatt: 'switzerland',
  austria: 'austria', vienna: 'austria', salzburg: 'austria', hallstatt: 'austria',
  shimla: 'shimla', himachal: 'shimla',
  manali: 'manali',
  wayanad: 'wayanad',
  kashmir: 'kashmir', srinagar: 'kashmir', gulmarg: 'kashmir', pahalgam: 'kashmir',
  kerala: 'kerala', kochi: 'kerala', alleppey: 'kerala', munnar: 'kerala', cochin: 'kerala',
  ooty: 'ooty', udhagamandalam: 'ooty', coonoor: 'ooty',
  hampi: 'hampi',
  ayodhya: 'ayodhya',
  varanasi: 'varanasi', kashi: 'varanasi', benares: 'varanasi',
  mahabaleshwar: 'mahabaleshwar', mahabaleswar: 'mahabaleshwar', panchgani: 'mahabaleshwar',
  udaipur: 'udaipur', 'lake city': 'udaipur',
  'south korea': 'southkorea', korea: 'southkorea', seoul: 'southkorea', busan: 'southkorea',
  vietnam: 'vietnam', hanoi: 'vietnam', 'ho chi minh': 'vietnam', saigon: 'vietnam', 'hoi an': 'vietnam',
  goa: 'goa', panaji: 'goa', panjim: 'goa',
  hyderabad: 'hyderabad', hyd: 'hyderabad', cyberabad: 'hyderabad',
  mumbai: 'mumbai', bombay: 'mumbai',
  ladakh: 'ladakh', leh: 'ladakh', 'leh ladakh': 'ladakh',
  meghalaya: 'meghalaya', shillong: 'meghalaya', cherrapunji: 'meghalaya',
};

export function getDestinationCurrency(destination) {
  if (!destination) return 'USD';
  const lower = destination.toLowerCase();
  for (const [key, val] of Object.entries(DEST_ALIASES)) {
    if (lower.includes(key) && INDIAN_DEST_KEYS.has(val)) return 'INR';
  }
  return 'USD';
}

function matchDestination(destination) {
  const lower = destination.toLowerCase();
  for (const [key, val] of Object.entries(DEST_ALIASES)) {
    if (lower.includes(key)) return { template: DEST_DATA[val], key: val };
  }
  return { template: null, key: null };
}

function makeGenericDay(destination, dayNum) {
  const location = destination.split(',')[0].trim();
  return dayNum === 0
    ? { location, items: [
        { time: '12:00', title: `Arrive in ${location}`, type: 'transport', duration: 60, notes: 'Check in and freshen up', cost: 0 },
        { time: '14:00', title: 'Check in to accommodation', type: 'accommodation', duration: 30, notes: '', cost: 50 },
        { time: '16:00', title: `Explore ${location} neighbourhood`, type: 'activity', duration: 120, notes: 'Get your bearings, find local spots', cost: 0 },
        { time: '19:00', title: 'Welcome dinner at a local restaurant', type: 'food', duration: 90, notes: 'Ask for a local speciality', cost: 15 },
      ]}
    : { location, items: [
        { time: '09:00', title: 'Morning sightseeing — top landmark', type: 'activity', duration: 150, notes: 'Buy tickets in advance if possible', cost: 10 },
        { time: '12:30', title: 'Lunch at a local eatery', type: 'food', duration: 60, notes: 'Try a regional speciality', cost: 10 },
        { time: '14:30', title: 'Afternoon exploration — museum or market', type: 'activity', duration: 150, notes: '', cost: 8 },
        { time: '18:00', title: 'Sunset viewpoint or evening walk', type: 'activity', duration: 90, notes: '', cost: 0 },
        { time: '20:00', title: 'Dinner and evening stroll', type: 'food', duration: 90, notes: '', cost: 15 },
      ]};
}

function generateBuiltIn(destination, startDate, numDays, startDateObj) {
  const { template, key } = matchDestination(destination);
  const isIndian = INDIAN_DEST_KEYS.has(key);
  const currency = isIndian ? 'INR' : 'USD';
  const toLocal = cost => isIndian ? Math.round(cost * 83 / 50) * 50 : cost;

  const days = Array.from({ length: numDays }, (_, i) => {
    const date = format(addDays(startDateObj, i), 'yyyy-MM-dd');
    const isLast = i === numDays - 1;
    let location, items;
    if (template) {
      const tpl = template.days[Math.min(i, template.days.length - 1)];
      location = tpl.location;
      items = isLast && template.departure
        ? [...tpl.items.slice(0, 2), template.departure]
        : [...tpl.items];
    } else {
      const g = makeGenericDay(destination, i);
      location = g.location;
      items = isLast
        ? [...g.items.slice(0, 2), { time: '14:00', title: 'Transfer to airport / departure', type: 'transport', duration: 60, notes: 'Allow extra time', cost: 15 }]
        : g.items;
    }
    return {
      id: 'day' + (Date.now() + i),
      date,
      location,
      items: items.map((item, j) => ({
        id: 'it' + (Date.now() + i * 100 + j),
        time: item.time, title: item.title, type: item.type,
        duration: item.duration, notes: item.notes || '', cost: toLocal(item.cost),
      })),
    };
  });
  return { days, currency };
}
