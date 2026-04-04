export const sampleTrips = [
  {
    id: '1',
    name: 'Japan Adventure',
    destination: 'Tokyo, Kyoto & Osaka',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop',
    startDate: '2026-05-10',
    endDate: '2026-05-22',
    status: 'planning',
    members: [
      { id: 'u1', name: 'Prachi', avatar: null, color: '#2563eb', role: 'organizer' },
      { id: 'u2', name: 'Arjun', avatar: null, color: '#7c3aed', role: 'member' },
      { id: 'u3', name: 'Maya', avatar: null, color: '#ea580c', role: 'member' },
      { id: 'u4', name: 'Sam', avatar: null, color: '#0891b2', role: 'member' },
    ],
    budget: { total: 12000, spent: 3200, currency: 'USD' },
    polls: [
      {
        id: 'p1',
        question: 'Which cities should we visit?',
        type: 'multi',
        status: 'active',
        deadline: '2026-04-15',
        options: [
          { id: 'o1', text: 'Tokyo', votes: ['u1', 'u2', 'u3', 'u4'] },
          { id: 'o2', text: 'Kyoto', votes: ['u1', 'u3', 'u4'] },
          { id: 'o3', text: 'Osaka', votes: ['u1', 'u2'] },
          { id: 'o4', text: 'Hiroshima', votes: ['u2'] },
          { id: 'o5', text: 'Nara', votes: ['u3', 'u4'] },
        ],
      },
      {
        id: 'p2',
        question: 'Accommodation style preference?',
        type: 'single',
        status: 'active',
        deadline: '2026-04-10',
        options: [
          { id: 'o6', text: 'Hotels (mid-range)', votes: ['u1', 'u4'] },
          { id: 'o7', text: 'Mix of hotels & ryokans', votes: ['u2', 'u3'] },
          { id: 'o8', text: 'Budget hostels', votes: [] },
          { id: 'o9', text: 'Airbnbs', votes: ['u1'] },
        ],
      },
      {
        id: 'p3',
        question: 'Daily budget per person?',
        type: 'single',
        status: 'closed',
        deadline: '2026-04-05',
        options: [
          { id: 'o10', text: '$100-150/day', votes: ['u3'] },
          { id: 'o11', text: '$150-200/day', votes: ['u1', 'u2', 'u4'] },
          { id: 'o12', text: '$200-300/day', votes: [] },
        ],
      },
    ],
    itinerary: [
      {
        id: 'day1',
        date: '2026-05-10',
        location: 'Tokyo',
        items: [
          { id: 'it1', time: '14:00', title: 'Arrive at Narita Airport', type: 'transport', duration: 60, notes: 'Flight JL123', cost: 0 },
          { id: 'it2', time: '16:00', title: 'Check in at Shinjuku Hotel', type: 'accommodation', duration: 30, notes: 'Confirmation #ABC123', cost: 180 },
          { id: 'it3', time: '18:00', title: 'Explore Shinjuku & dinner', type: 'activity', duration: 180, notes: 'Try ramen at Fuunji', cost: 25 },
        ],
      },
      {
        id: 'day2',
        date: '2026-05-11',
        location: 'Tokyo',
        items: [
          { id: 'it4', time: '09:00', title: 'Tsukiji Outer Market', type: 'activity', duration: 120, notes: 'Sushi breakfast!', cost: 30 },
          { id: 'it5', time: '12:00', title: 'TeamLab Borderless', type: 'activity', duration: 180, notes: 'Book tickets in advance', cost: 35 },
          { id: 'it6', time: '17:00', title: 'Shibuya Crossing & Harajuku', type: 'activity', duration: 180, notes: '', cost: 15 },
        ],
      },
      {
        id: 'day3',
        date: '2026-05-12',
        location: 'Tokyo → Kyoto',
        items: [
          { id: 'it7', time: '08:30', title: 'Shinkansen to Kyoto', type: 'transport', duration: 140, notes: 'JR Pass — Nozomi', cost: 0 },
          { id: 'it8', time: '13:00', title: 'Check in Kyoto ryokan', type: 'accommodation', duration: 30, notes: '', cost: 220 },
          { id: 'it9', time: '14:30', title: 'Fushimi Inari Shrine', type: 'activity', duration: 180, notes: 'Thousands of torii gates', cost: 0 },
        ],
      },
    ],
    expenses: [
      { id: 'e1', title: 'Flights (round trip)', amount: 2400, paidBy: 'u1', splitAmong: ['u1', 'u2', 'u3', 'u4'], category: 'transport', date: '2026-03-15' },
      { id: 'e2', title: 'JR Pass (7-day)', amount: 800, paidBy: 'u2', splitAmong: ['u1', 'u2', 'u3', 'u4'], category: 'transport', date: '2026-03-20' },
    ],
    routes: [
      {
        id: 'r1',
        from: 'Tokyo',
        to: 'Kyoto',
        segments: [
          { mode: 'train', name: 'Shinkansen Nozomi', duration: 140, cost: 0, notes: 'Covered by JR Pass' },
        ],
      },
      {
        id: 'r2',
        from: 'Kyoto',
        to: 'Osaka',
        segments: [
          { mode: 'train', name: 'JR Special Rapid', duration: 30, cost: 0, notes: 'Covered by JR Pass' },
        ],
      },
    ],
    activity: [
      { id: 'a1', user: 'u1', action: 'created the trip', timestamp: '2026-03-10T10:00:00Z' },
      { id: 'a2', user: 'u2', action: 'joined the trip', timestamp: '2026-03-10T12:30:00Z' },
      { id: 'a3', user: 'u3', action: 'voted on "Which cities should we visit?"', timestamp: '2026-03-11T09:15:00Z' },
      { id: 'a4', user: 'u1', action: 'added expense: Flights (round trip) — $2,400', timestamp: '2026-03-15T14:00:00Z' },
      { id: 'a5', user: 'u4', action: 'joined the trip', timestamp: '2026-03-16T08:00:00Z' },
      { id: 'a6', user: 'u2', action: 'added expense: JR Pass (7-day) — $800', timestamp: '2026-03-20T11:00:00Z' },
      { id: 'a7', user: 'u3', action: 'added Day 1 itinerary items', timestamp: '2026-03-22T16:00:00Z' },
      { id: 'a8', user: 'u1', action: 'created poll: "Accommodation style preference?"', timestamp: '2026-03-25T10:00:00Z' },
    ],
    contingencies: [
      { id: 'c1', type: 'flight_delay', title: 'Flight delay/cancellation plan', description: 'If our arrival flight is delayed >4hrs, skip Shinjuku dinner and order room service. Contact hotel to hold reservation.', status: 'prepared' },
      { id: 'c2', type: 'weather', title: 'Rainy day alternatives', description: 'Replace outdoor activities with: Tokyo National Museum, Akihabara shopping, or cat cafes.', status: 'prepared' },
      { id: 'c3', type: 'health', title: 'Medical contacts', description: 'Nearest English-speaking hospital: St. Luke\'s International Hospital, Chuo. Travel insurance policy #TI-98765.', status: 'prepared' },
    ],
    messages: [
      { id: 'msg1', userId: 'u2', text: 'Hey everyone! 🎌 Just saw cherry blossom forecasts — we timed this perfectly!', timestamp: '2026-03-25T09:15:00Z' },
      { id: 'msg2', userId: 'u3', text: 'Yes!! I\'m so excited. Prachi have you finalized the hotels yet?', timestamp: '2026-03-25T09:22:00Z' },
      { id: 'msg3', userId: 'u1', text: 'Still comparing a few options! Arjun suggested trying a ryokan in Kyoto which I think is a great idea 🏯', timestamp: '2026-03-25T09:30:00Z' },
      { id: 'msg4', userId: 'u4', text: 'Ryokan sounds amazing! Make sure to book early though, they fill up fast for May.', timestamp: '2026-03-25T10:00:00Z' },
      { id: 'msg5', userId: 'u4', text: 'Also, does everyone have travel insurance sorted?', timestamp: '2026-03-25T10:02:00Z' },
      { id: 'msg6', userId: 'u2', text: 'Just got mine sorted 👍', timestamp: '2026-03-28T14:00:00Z' },
      { id: 'msg7', userId: 'u1', text: 'Good call! I\'ll add a note in contingency plans. @Maya @Sam please sort insurance ASAP', timestamp: '2026-03-28T14:30:00Z' },
      { id: 'msg8', userId: 'u3', text: 'On it! Also — who wants to do a tea ceremony in Kyoto? Found an amazing spot near Nishiki Market 🍵', timestamp: '2026-03-30T08:00:00Z' },
      { id: 'msg9', userId: 'u4', text: '100% in for that!', timestamp: '2026-03-30T08:05:00Z' },
      { id: 'msg10', userId: 'u2', text: 'Same! Can we also fit in a day trip to Nara? The deer park is on my bucket list 🦌', timestamp: '2026-03-30T08:10:00Z' },
      { id: 'msg11', userId: 'u1', text: 'Let me look at the itinerary — I think day 4 could work! Will update the plan.', timestamp: '2026-03-30T09:00:00Z' },
      { id: 'msg12', userId: 'u3', text: 'This trip is going to be absolutely incredible 🙌', timestamp: '2026-03-31T20:00:00Z' },
    ],
  },
  {
    id: '2',
    name: 'Bali Retreat',
    destination: 'Bali, Indonesia',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    startDate: '2026-07-01',
    endDate: '2026-07-10',
    status: 'voting',
    members: [
      { id: 'u1', name: 'Prachi', avatar: null, color: '#2563eb', role: 'organizer' },
      { id: 'u5', name: 'Rohan', avatar: null, color: '#16a34a', role: 'member' },
      { id: 'u6', name: 'Ananya', avatar: null, color: '#d97706', role: 'member' },
    ],
    budget: { total: 6000, spent: 0, currency: 'USD' },
    polls: [
      {
        id: 'p4',
        question: 'Which area of Bali to stay?',
        type: 'single',
        status: 'active',
        deadline: '2026-04-20',
        options: [
          { id: 'o13', text: 'Ubud (culture & rice terraces)', votes: ['u1', 'u6'] },
          { id: 'o14', text: 'Seminyak (beach & nightlife)', votes: ['u5'] },
          { id: 'o15', text: 'Canggu (surf & cafes)', votes: ['u5', 'u6'] },
          { id: 'o16', text: 'Split between two areas', votes: ['u1'] },
        ],
      },
    ],
    itinerary: [],
    expenses: [],
    routes: [],
    activity: [
      { id: 'a9', user: 'u1', action: 'created the trip', timestamp: '2026-03-28T09:00:00Z' },
      { id: 'a10', user: 'u5', action: 'joined the trip', timestamp: '2026-03-28T10:00:00Z' },
      { id: 'a11', user: 'u6', action: 'joined the trip', timestamp: '2026-03-28T14:00:00Z' },
    ],
    contingencies: [],
    messages: [
      { id: 'msg20', userId: 'u1', text: 'Just created the trip! Super excited for Bali 🌴🌊', timestamp: '2026-03-28T09:00:00Z' },
      { id: 'msg21', userId: 'u5', text: 'Can\'t wait! I vote Canggu — surf mornings, great cafes 🏄', timestamp: '2026-03-28T10:30:00Z' },
      { id: 'msg22', userId: 'u6', text: 'I think Ubud is more authentic — rice terraces, yoga, incredible food 🌿', timestamp: '2026-03-28T11:00:00Z' },
      { id: 'msg23', userId: 'u1', text: 'Both sound amazing... maybe we split the trip? A few days in each?', timestamp: '2026-03-28T11:15:00Z' },
      { id: 'msg24', userId: 'u5', text: 'That\'s exactly what I was thinking! Let\'s vote on it', timestamp: '2026-03-29T08:00:00Z' },
      { id: 'msg25', userId: 'u1', text: 'Already added a poll — check the Decisions tab 🗳️', timestamp: '2026-03-29T08:05:00Z' },
      { id: 'msg26', userId: 'u6', text: 'Perfect! Also should we do a cooking class while we\'re there? Balinese food is amazing 🍛', timestamp: '2026-03-31T15:00:00Z' },
    ],
  },
  {
    id: '3',
    name: 'Euro Rail Trip',
    destination: 'Paris → Amsterdam → Berlin',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    status: 'confirmed',
    members: [
      { id: 'u1', name: 'Prachi', avatar: null, color: '#2563eb', role: 'organizer' },
      { id: 'u2', name: 'Arjun', avatar: null, color: '#7c3aed', role: 'member' },
    ],
    budget: { total: 8000, spent: 5200, currency: 'USD' },
    polls: [],
    itinerary: [],
    expenses: [
      { id: 'e3', title: 'Eurail Pass', amount: 600, paidBy: 'u1', splitAmong: ['u1', 'u2'], category: 'transport', date: '2026-04-01' },
      { id: 'e4', title: 'Paris hotel (5 nights)', amount: 1800, paidBy: 'u2', splitAmong: ['u1', 'u2'], category: 'accommodation', date: '2026-04-05' },
      { id: 'e5', title: 'Amsterdam Airbnb (4 nights)', amount: 1200, paidBy: 'u1', splitAmong: ['u1', 'u2'], category: 'accommodation', date: '2026-04-05' },
      { id: 'e6', title: 'Berlin hostel (5 nights)', amount: 400, paidBy: 'u2', splitAmong: ['u1', 'u2'], category: 'accommodation', date: '2026-04-05' },
      { id: 'e7', title: 'Flights', amount: 1200, paidBy: 'u1', splitAmong: ['u1', 'u2'], category: 'transport', date: '2026-03-20' },
    ],
    routes: [
      {
        id: 'r3',
        from: 'Paris',
        to: 'Amsterdam',
        segments: [
          { mode: 'train', name: 'Thalys High-Speed', duration: 195, cost: 0, notes: 'Eurail Pass' },
        ],
      },
      {
        id: 'r4',
        from: 'Amsterdam',
        to: 'Berlin',
        segments: [
          { mode: 'train', name: 'ICE International', duration: 375, cost: 0, notes: 'Eurail Pass' },
        ],
      },
    ],
    activity: [],
    contingencies: [],
    messages: [
      { id: 'msg30', userId: 'u1', text: 'Arjun!! Our Euro Rail trip is confirmed 🚂🇪🇺 I\'m SO hyped!', timestamp: '2026-03-15T10:00:00Z' },
      { id: 'msg31', userId: 'u2', text: 'FINALLY! This is going to be epic. Paris first right?', timestamp: '2026-03-15T10:05:00Z' },
      { id: 'msg32', userId: 'u1', text: 'Yes! Paris → Amsterdam → Berlin. Bought the Eurail passes already 🎉', timestamp: '2026-03-15T10:08:00Z' },
      { id: 'msg33', userId: 'u2', text: 'Amazing. Just booked the Paris hotel — 5 nights near Montmartre! 🗼', timestamp: '2026-03-20T15:00:00Z' },
      { id: 'msg34', userId: 'u1', text: 'Love it! Sorting Amsterdam Airbnb now. What dates are we in Berlin?', timestamp: '2026-03-20T15:30:00Z' },
      { id: 'msg35', userId: 'u2', text: 'Sep 10-15 for Berlin. There\'s a great hostel in Mitte with a rooftop bar 🍺', timestamp: '2026-03-21T09:00:00Z' },
      { id: 'msg36', userId: 'u1', text: 'Done! Added all the accommodations as expenses. We should settle up before we go 💸', timestamp: '2026-03-25T14:00:00Z' },
      { id: 'msg37', userId: 'u2', text: 'Agreed. Also I\'m thinking we should plan a day trip to Bruges from Amsterdam?', timestamp: '2026-03-31T11:00:00Z' },
    ],
  },
];

export const currentUser = {
  id: 'u1',
  name: 'Prachi',
  color: '#2563eb',
};

export function getMemberById(trip, userId) {
  return (trip.members || []).find(m => m.id === userId);
}
