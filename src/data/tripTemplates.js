// Curated multi-day, multi-stop trip templates. Surfaced in the create-trip
// modal as a "Quick start" affordance. Each template pre-fills the
// destination, suggested duration, and per-day itinerary stubs (location +
// theme). Items stay empty so the user can fill manually or via AI Suggest
// Itinerary afterwards. Templates are not destinations themselves — the
// `destination` string is what gets stored on the trip.

export const TRIP_TEMPLATES = [
  {
    id: 'char-dham',
    name: 'Char Dham Yatra',
    subtitle: 'Uttarakhand · 4 sacred Himalayan shrines',
    destination: 'Char Dham Yatra (Uttarakhand)',
    durationDays: 10,
    seasonHint: 'Best May–October — shrines close through winter',
    days: [
      { location: 'Haridwar / Rishikesh',                    theme: 'Arrival & overnight at gateway' },
      { location: 'Haridwar → Barkot',                       theme: 'Drive to Yamunotri base · ~7h' },
      { location: 'Yamunotri (via Janki Chatti)',            theme: 'Darshan · 6 km trek each way' },
      { location: 'Barkot → Uttarkashi',                     theme: 'Drive to Gangotri base · ~3.5h' },
      { location: 'Gangotri',                                theme: 'Darshan · return Uttarkashi' },
      { location: 'Uttarkashi → Sitapur (Kedarnath base)',   theme: 'Long drive via Tehri · ~10h' },
      { location: 'Kedarnath',                               theme: '16 km trek from Gaurikund · or helicopter' },
      { location: 'Sitapur → Joshimath',                     theme: 'Drive to Badrinath base · ~5h' },
      { location: 'Badrinath',                               theme: 'Final dham · darshan & Mana village' },
      { location: 'Joshimath → Haridwar',                    theme: 'Return drive · ~10h' },
    ],
  },
];

export function findTemplate(id) {
  return TRIP_TEMPLATES.find(t => t.id === id) || null;
}
