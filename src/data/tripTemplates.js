// Curated multi-day, multi-stop trip templates. Surfaced in the create-trip
// modal as a "Quick start" affordance. Each template pre-fills the
// destination, suggested duration, and per-day itinerary stubs (location +
// theme). Items stay empty so the user can fill manually or via AI Suggest
// Itinerary afterwards. Templates are not destinations themselves — the
// `destination` string is what gets stored on the trip.
//
// Templates additionally carry a journey shape used by the Routes page when
// the trip carries `templateId`:
//   - `gateway`     : the lookup-friendly city name used to compute home →
//                     gateway transport options (matches INDIAN_ROUTES keys)
//   - `gatewayLabel`: friendlier display name shown in the timeline
//   - `stops`       : anchor base locations (where the traveller actually
//                     stays overnight); side-trip darshans live in subtitles
//   - `legs`        : `stops.length - 1` entries with mode-specific transit
//                     data (`road` / `rail` / `air`). Only modes that are
//                     practically available are populated — UI hides the
//                     rest. Cost ranges are INR (the only currency these
//                     templates target today).

export const TRIP_TEMPLATES = [
  {
    id: 'char-dham',
    name: 'Char Dham Yatra',
    subtitle: 'Uttarakhand · 4 sacred Himalayan shrines',
    destination: 'Char Dham Yatra (Uttarakhand)',
    durationDays: 10,
    seasonHint: 'Best May–October — shrines close through winter',
    gateway: 'Haridwar',
    gatewayLabel: 'Haridwar / Rishikesh',
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
    stops: [
      { name: 'Haridwar / Rishikesh', subtitle: 'Gateway · arrival & rest before the climb' },
      { name: 'Barkot',               subtitle: 'Yamunotri base · ~50 km drive + 6 km trek for darshan' },
      { name: 'Uttarkashi',           subtitle: 'Gangotri base · ~100 km drive each way for darshan' },
      { name: 'Sitapur / Sonprayag',  subtitle: 'Kedarnath base · 16 km trek from Gaurikund or helicopter from Phata' },
      { name: 'Joshimath',            subtitle: 'Badrinath base · ~45 km drive each way for darshan' },
      { name: 'Haridwar / Rishikesh', subtitle: 'Return' },
    ],
    // All inter-shrine legs are road-only — no rail or commercial air reaches
    // these mountain valleys. Helicopter exists for Kedarnath/Badrinath
    // darshans (side trips), not as inter-base transport, so it's noted in
    // the relevant stop subtitle rather than as a leg mode.
    legs: [
      { road: { hours: 7,   km: 205, costRange: [3500, 5500], note: 'Steep mountain roads · book a SUV / Innova for the group' } },
      { road: { hours: 3.5, km: 95,  costRange: [1500, 2500], note: 'Yamuna valley · scenic drive · pack motion-sickness meds' } },
      { road: { hours: 10,  km: 280, costRange: [4500, 6500], note: 'Long drive via Tehri · start before sunrise · break at Rudraprayag' } },
      { road: { hours: 5,   km: 190, costRange: [2500, 4000], note: 'Steep climbs near Joshimath · drive carefully past landslide-prone stretches' } },
      { road: { hours: 10,  km: 290, costRange: [4500, 6500], note: 'Long return via Karnaprayag · single long day or overnight at Devprayag' } },
    ],
  },
];

export function findTemplate(id) {
  return TRIP_TEMPLATES.find(t => t.id === id) || null;
}
