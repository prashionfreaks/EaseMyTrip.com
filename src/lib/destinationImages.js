// Curated Unsplash photo IDs for popular destinations
const DESTINATION_IMAGES = {
  'goa':            'photo-1512343879784-a960bf40e7f2',
  'mumbai':         'photo-1570168007204-dfb528c6958f',
  'delhi':          'photo-1587474260584-136574528ed5',
  'jaipur':         'photo-1599661046289-e31897846e41',
  'manali':         'photo-1626621341517-bbf3d9990a23',
  'shimla':         'photo-1597074866923-dc0589150458',
  'kerala':         'photo-1602216056096-3b40cc0c9944',
  'varanasi':       'photo-1561361513-2d000a50f0dc',
  'udaipur':        'photo-1602217310266-85ec5ae3e2a6',
  'agra':           'photo-1564507592333-c60657eea523',
  'pune':           'photo-1572782252655-9c8771e5e05c',
  'hyderabad':      'photo-1626013860614-a8b2f1e7d9d3',
  'bangalore':      'photo-1596176530529-78163a4f7af2',
  'bengaluru':      'photo-1596176530529-78163a4f7af2',
  'chennai':        'photo-1582510003544-4d00b7f74220',
  'kolkata':        'photo-1558431382-27e303142255',
  'kashmir':        'photo-1587474260584-136574528ed5',
  'rishikesh':      'photo-1600021325489-60e29cfab3f2',
  'ladakh':         'photo-1589556264800-08ae9e129a8c',
  'leh':            'photo-1589556264800-08ae9e129a8c',
  'darjeeling':     'photo-1622308644420-1f4cf1574ed3',
  'ooty':           'photo-1620766182604-1b0c1b6b0e1e',
  'pondicherry':    'photo-1582510003544-4d00b7f74220',
  'mahabaleshwar':  'photo-1506905925346-21bda4d32df4',
  'lonavala':       'photo-1506905925346-21bda4d32df4',
  'tokyo':          'photo-1540959733332-eab4deabeeaf',
  'kyoto':          'photo-1493976040374-85c8e12f0c0e',
  'osaka':          'photo-1590559899731-a382839e5549',
  'paris':          'photo-1502602898657-3e91760cbb34',
  'london':         'photo-1513635269975-59663e0ac1ad',
  'new york':       'photo-1496442226666-8d4d0e62e6e9',
  'dubai':          'photo-1512453979798-5ea266f8880c',
  'singapore':      'photo-1525625293386-3f8f99389edd',
  'bangkok':        'photo-1508009603885-50cf7c579365',
  'bali':           'photo-1537996194471-e657df975ab4',
  'rome':           'photo-1552832230-c0197dd311b5',
  'barcelona':      'photo-1583422409516-2895a77efded',
  'amsterdam':      'photo-1534351590666-13e3e96b5017',
  'sydney':         'photo-1506973035872-a4ec16b8e8d9',
  'san francisco':  'photo-1501594907352-04cda38ebc29',
  'los angeles':    'photo-1534190760961-74e8c1c5c3da',
  'maldives':       'photo-1514282401047-d79a71a590e8',
  'switzerland':    'photo-1530122037265-a5f1f91d3b99',
  'venice':         'photo-1523906834658-6e24ef2386f9',
  'istanbul':       'photo-1524231757912-21f4fe3a7200',
  'cairo':          'photo-1572252009286-268acec5ca0a',
  'phuket':         'photo-1589394815804-964ed0be2eb5',
  'vietnam':        'photo-1557750255-c76072a7aee1',
  'sri lanka':      'photo-1586613835341-75e4e1e0618d',
  'nepal':          'photo-1544735716-392fe2489ffa',
  'bhutan':         'photo-1553856622-d1b352e24012',
  'mauritius':      'photo-1518509562904-e7ef99cdcc86',
  'greece':         'photo-1533105079780-92b9be482077',
  'santorini':      'photo-1570077188670-e3a8d69ac5ff',
  'hawaii':         'photo-1507876466758-bc54f384809c',
  'mexico':         'photo-1518638150340-f706e86654de',
  'canada':         'photo-1503614472-8c93d56e92ce',
  'japan':          'photo-1492571350019-22de08371fd3',
  'thailand':       'photo-1506665531195-3566af2b4dfa',
  'australia':      'photo-1523482580672-f109ba8cb9be',
  'new zealand':    'photo-1469854523086-cc02fe5d8800',
  'south africa':   'photo-1580060839134-75a5edca2e99',
  'iceland':        'photo-1520769669658-f07657e5b307',
  'norway':         'photo-1531366936337-7c912a4589a7',
  'portugal':       'photo-1555881400-74d7acaacd8b',
};

// Generic travel fallbacks
const FALLBACK_IMAGES = [
  'photo-1488646953014-85cb44e25828',
  'photo-1507525428034-b723cf961d3e',
  'photo-1476514525535-07fb3b4ae5f1',
  'photo-1530789253388-582c481c54b0',
  'photo-1469474968028-56623f02e42e',
  'photo-1500835556837-99ac94a94552',
  'photo-1504150558240-0b4fd8946624',
  'photo-1501785888041-af3ef285b470',
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export function getDestinationImage(destination) {
  if (!destination) return `https://images.unsplash.com/${FALLBACK_IMAGES[0]}?w=600&h=400&fit=crop`;

  const lower = destination.toLowerCase().trim();

  // Check exact and partial matches
  for (const [key, photoId] of Object.entries(DESTINATION_IMAGES)) {
    if (lower.includes(key) || key.includes(lower)) {
      return `https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop`;
    }
  }

  // Fallback: pick consistently based on destination name
  const idx = hashString(lower) % FALLBACK_IMAGES.length;
  return `https://images.unsplash.com/${FALLBACK_IMAGES[idx]}?w=600&h=400&fit=crop`;
}
