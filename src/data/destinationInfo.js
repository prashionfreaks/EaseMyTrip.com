// Destination info database
// Keys are lowercase, matched via matchDestinationInfo()

export const DESTINATION_INFO = {
  japan: {
    tagline: 'Where ancient tradition meets futuristic innovation',
    famousFor: ['Cherry Blossoms', 'Mount Fuji', 'Sushi & Ramen', 'Samurai Culture', 'Bullet Trains', 'Anime & Manga', 'Zen Buddhism', 'Vending Machines'],
    attractions: [
      { name: 'Mount Fuji', desc: 'Japan\'s iconic sacred volcano standing 3,776m tall, a UNESCO World Heritage site and symbol of the nation.' },
      { name: 'Fushimi Inari Taisha', desc: 'Thousands of vermilion torii gates winding up a forested mountain in Kyoto — one of Japan\'s most photographed sites.' },
      { name: 'Shibuya Crossing', desc: 'The world\'s busiest pedestrian scramble — up to 2,500 people cross simultaneously every two minutes in Tokyo.' },
      { name: 'Arashiyama Bamboo Grove', desc: 'A magical walk through towering bamboo stalks in Kyoto, especially ethereal at dawn.' },
      { name: 'Senso-ji Temple', desc: 'Tokyo\'s oldest temple, founded in 628 AD. The iconic Thunder Gate (Kaminarimon) leads to a vibrant market street.' },
    ],
    history: [
      'Japan has been continuously inhabited for over 30,000 years, with the Jomon people among its earliest known inhabitants.',
      'The samurai class dominated Japanese politics and society from the 12th century until the Meiji Restoration in 1868.',
      'Japan was the first country in Asia to industrialize rapidly, transforming from feudal society to modern power in just 40 years.',
      'After WWII, Japan rebuilt itself into the world\'s third-largest economy — considered one of history\'s most remarkable recoveries.',
    ],
    bestTime: { period: 'March–May & Oct–Nov', reason: 'Spring brings the legendary cherry blossoms; autumn delivers vivid red and gold foliage across the country.' },
    quickFacts: { language: 'Japanese', currency: 'Japanese Yen (¥)', capital: 'Tokyo', knownAs: 'Land of the Rising Sun', timezone: 'JST (UTC+9)' },
    cuisine: ['Sushi & Sashimi', 'Ramen', 'Tempura', 'Wagyu Beef', 'Takoyaki', 'Matcha Desserts', 'Yakitori'],
    eateries: [
      { name: 'Ichiran Ramen Shibuya', area: 'Shibuya, Tokyo', rating: 4.5, reviews: 18420, type: 'Ramen', price: '¥¥', mustTry: 'Signature Tonkotsu (solo booth)' },
      { name: 'Sushi Dai', area: 'Toyosu Market, Tokyo', rating: 4.7, reviews: 3180, type: 'Sushi', price: '¥¥¥', mustTry: 'Omakase Nigiri Set' },
      { name: 'Gyukatsu Motomura', area: 'Shibuya, Tokyo', rating: 4.6, reviews: 6420, type: 'Beef Cutlet', price: '¥¥', mustTry: 'Gyukatsu Teishoku' },
      { name: 'Afuri Ramen', area: 'Harajuku, Tokyo', rating: 4.5, reviews: 8910, type: 'Yuzu Ramen', price: '¥¥', mustTry: 'Yuzu Shio Ramen' },
    ],
    stays: [
      { name: 'Park Hyatt Tokyo', area: 'Shinjuku', rating: 4.7, reviews: 3120, type: 'Luxury hotel', price: '¥¥¥¥', highlight: 'Lost-in-Translation views, top-floor pool' },
      { name: 'Hotel Gracery Shinjuku', area: 'Shinjuku', rating: 4.4, reviews: 5410, type: 'Mid-range hotel', price: '¥¥', highlight: 'Walk to Robot Restaurant, Godzilla head on roof' },
      { name: 'Khaosan Tokyo Origami', area: 'Asakusa', rating: 4.5, reviews: 1890, type: 'Hostel', price: '¥', highlight: 'Steps from Senso-ji, social common floor' },
      { name: 'Ryokan Sawanoya', area: 'Yanaka, Tokyo', rating: 4.6, reviews: 980, type: 'Traditional ryokan', price: '¥¥', highlight: 'Tatami rooms, family-run since 1949' },
    ],
  },

  bali: {
    tagline: 'Island of the Gods — spirituality, surf, and stunning rice terraces',
    famousFor: ['Hindu Temples', 'Rice Terraces', 'Surfing', 'Spa & Wellness', 'Balinese Dance', 'Tropical Beaches', 'Digital Nomad Hub'],
    attractions: [
      { name: 'Tanah Lot Temple', desc: 'A dramatic sea temple perched on a rocky outcrop, most stunning at sunset when the tide rises around it.' },
      { name: 'Tegallalang Rice Terraces', desc: 'Iconic stepped rice paddies in Ubud, carved into hillsides over centuries using the traditional subak irrigation system.' },
      { name: 'Ubud Monkey Forest', desc: 'A sacred sanctuary housing 700+ long-tailed macaques among ancient temples and giant banyan trees.' },
      { name: 'Kuta & Seminyak Beach', desc: 'World-class surf breaks alongside vibrant beach clubs and resorts along Bali\'s legendary west coast.' },
      { name: 'Mount Batur', desc: 'An active volcano offering pre-dawn hikes to watch sunrise from the caldera rim at 1,717m elevation.' },
    ],
    history: [
      'Bali\'s Hindu culture arrived from Java around the 8th century, creating a unique Balinese Hinduism still practiced today.',
      'Unlike most of Indonesia, Bali resisted Islamic influence during the 15th century, preserving its Hindu-Buddhist heritage.',
      'The Dutch colonized Bali in 1906, but were so struck by its culture they designated it a "living museum" and limited development.',
      'Bali\'s artistic renaissance in the 1930s drew global icons like Walter Spies and Miguel Covarrubias, establishing it as an art destination.',
    ],
    bestTime: { period: 'April–October', reason: 'Dry season with low humidity and sunshine. July–August is peak; April–June and September–October offer the best value.' },
    quickFacts: { language: 'Balinese & Indonesian', currency: 'Indonesian Rupiah (IDR)', capital: 'Denpasar', knownAs: 'Island of the Gods', timezone: 'WITA (UTC+8)' },
    cuisine: ['Nasi Goreng', 'Babi Guling (Suckling Pig)', 'Satay Lilit', 'Lawar', 'Black Rice Pudding', 'Fresh Coconut'],
    eateries: [
      { name: 'Locavore NXT', area: 'Ubud', rating: 4.8, reviews: 2140, type: 'Modern Indonesian Fine Dining', price: '$$$$', mustTry: 'Seasonal Tasting Menu' },
      { name: 'Warung Babi Guling Ibu Oka', area: 'Ubud', rating: 4.4, reviews: 8760, type: 'Balinese', price: '$', mustTry: 'Babi Guling Platter' },
      { name: 'La Brisa', area: 'Canggu', rating: 4.6, reviews: 12300, type: 'Beach Club / Mediterranean', price: '$$$', mustTry: 'Wood-Fired Pizza + Sunset' },
      { name: "Naughty Nuri's Warung", area: 'Ubud', rating: 4.5, reviews: 9450, type: 'BBQ Ribs', price: '$$', mustTry: 'Pork Ribs + Martini' },
    ],
    stays: [
      { name: 'Bisma Eight', area: 'Ubud', rating: 4.7, reviews: 1820, type: 'Boutique resort', price: '$$$', highlight: 'Copper-tub jungle suites, pool with rice-paddy view' },
      { name: 'Como Uma Ubud', area: 'Ubud', rating: 4.7, reviews: 1100, type: 'Luxury wellness retreat', price: '$$$$', highlight: 'Yoga shala, Ayurvedic spa, valley sunsets' },
      { name: 'The Slow', area: 'Canggu', rating: 4.5, reviews: 920, type: 'Surf-and-art lodge', price: '$$$', highlight: 'Walking distance to Batu Bolong beach' },
      { name: 'M Boutique Hostel', area: 'Seminyak', rating: 4.4, reviews: 2400, type: 'Hostel', price: '$', highlight: 'Pool deck, private pods, central Seminyak' },
    ],
  },

  paris: {
    tagline: 'La Ville-Lumière — the world\'s eternal capital of art, fashion, and romance',
    famousFor: ['Eiffel Tower', 'Haute Cuisine', 'Fashion Week', 'Impressionist Art', 'Notre-Dame', 'Champagne', 'Café Culture'],
    attractions: [
      { name: 'Eiffel Tower', desc: 'Built in 1889 for the World\'s Fair, the 330m iron lattice tower now welcomes 7 million visitors a year.' },
      { name: 'The Louvre', desc: 'World\'s largest art museum housing 38,000 works including the Mona Lisa and Venus de Milo across 72,735 sqm.' },
      { name: 'Notre-Dame Cathedral', desc: 'A Gothic masterpiece begun in 1163, currently under restoration after the devastating 2019 fire.' },
      { name: 'Montmartre & Sacré-Cœur', desc: 'Paris\'s bohemian hilltop village where Picasso, Monet, and Van Gogh lived and worked in the Belle Époque era.' },
      { name: 'Palace of Versailles', desc: 'Louis XIV\'s opulent 2,300-room palace with the Hall of Mirrors and 800 hectares of manicured gardens.' },
    ],
    history: [
      'Paris was founded around 250 BC by a Celtic tribe called the Parisii on an island in the Seine — today\'s Île de la Cité.',
      'The French Revolution (1789–1799) began here when citizens stormed the Bastille prison, reshaping the entire modern world.',
      'Baron Haussmann demolished medieval Paris in the 1850s–70s to create the wide boulevards and uniform buildings seen today.',
      'Paris was occupied by Nazi Germany from 1940–44 and liberated on August 25, 1944 in one of WWII\'s most celebrated moments.',
    ],
    bestTime: { period: 'April–June & Sep–Oct', reason: 'Mild weather, blooming chestnut trees, fewer crowds than summer. July–August is peak season with intense heat and tourist density.' },
    quickFacts: { language: 'French', currency: 'Euro (€)', capital: 'Paris', knownAs: 'City of Light', timezone: 'CET (UTC+1)' },
    cuisine: ['Croissants & Pain au Chocolat', 'French Onion Soup', 'Crêpes', 'Steak Frites', 'Macarons', 'Crème Brûlée', 'Escargot'],
    eateries: [
      { name: 'Septime', area: '11th arrondissement', rating: 4.6, reviews: 2890, type: 'Modern French (Michelin)', price: '€€€€', mustTry: 'Tasting Menu with Natural Wines' },
      { name: 'Du Pain et des Idées', area: '10th arrondissement', rating: 4.7, reviews: 4210, type: 'Bakery', price: '€', mustTry: 'Escargot Pistachio-Chocolat' },
      { name: 'Bouillon Pigalle', area: 'Pigalle', rating: 4.4, reviews: 18720, type: 'Classic Bistro', price: '€€', mustTry: 'Bœuf Bourguignon' },
      { name: "L'Ami Jean", area: '7th arrondissement', rating: 4.6, reviews: 2340, type: 'Basque / French', price: '€€€', mustTry: 'Rice Pudding (Riz au Lait)' },
    ],
    stays: [
      { name: 'Hôtel Plaza Athénée', area: '8th arrondissement (Champs-Élysées)', rating: 4.8, reviews: 1540, type: 'Palace hotel', price: '€€€€', highlight: 'Eiffel views, red-awning balconies' },
      { name: 'Hôtel des Grands Boulevards', area: '2nd arrondissement', rating: 4.5, reviews: 2210, type: 'Boutique', price: '€€€', highlight: 'Glass-roof courtyard, walkable to Marais' },
      { name: 'Generator Paris', area: '10th arrondissement (Canal Saint-Martin)', rating: 4.3, reviews: 6480, type: 'Hostel / hybrid', price: '€', highlight: 'Rooftop bar, near Gare du Nord' },
      { name: 'Le Pigalle', area: '9th arrondissement', rating: 4.4, reviews: 1880, type: 'Design hotel', price: '€€', highlight: 'Vinyl-record rooms, neighbourhood-style stay' },
    ],
  },

  london: {
    tagline: 'A city where centuries of history live beside cutting-edge culture',
    famousFor: ['Buckingham Palace', 'West End Theatre', 'The Tube', 'Premier League', 'Afternoon Tea', 'The British Museum', 'Multicultural Food Scene'],
    attractions: [
      { name: 'Tower of London', desc: 'A 1,000-year-old fortress housing the Crown Jewels, where two princes mysteriously disappeared in 1483.' },
      { name: 'Big Ben & Westminster', desc: 'The Gothic clock tower (officially Elizabeth Tower) has chimed on the hour since 1859 beside the Houses of Parliament.' },
      { name: 'The British Museum', desc: 'Home to 8 million works spanning two million years of human history — including the Rosetta Stone and Elgin Marbles.' },
      { name: 'Borough Market', desc: 'London\'s oldest food market, trading since the 12th century, now a global street food paradise under London Bridge.' },
      { name: 'Tate Modern', desc: 'The world\'s most-visited modern art museum, housed in a former power station on the south bank of the Thames.' },
    ],
    history: [
      'London was founded as Londinium by the Romans in 43 AD as a trading port on the Thames, growing to become Britannia\'s capital.',
      'The Great Fire of London in 1666 destroyed 80% of the City, leading to the grand rebuilding including St Paul\'s Cathedral by Christopher Wren.',
      'London served as the heart of the British Empire at its peak in the 19th century — the largest empire in history, covering 24% of the world.',
      'The Blitz (1940–41) saw the Luftwaffe bomb London for 57 consecutive nights, killing over 30,000 Londoners who refused to surrender.',
    ],
    bestTime: { period: 'May–September', reason: 'Longest days and warmest temperatures. Summer brings festivals and outdoor events, though it\'s also peak tourist season.' },
    quickFacts: { language: 'English', currency: 'British Pound (£)', capital: 'London', knownAs: 'The Big Smoke', timezone: 'GMT (UTC+0)' },
    cuisine: ['Fish & Chips', 'Full English Breakfast', 'Chicken Tikka Masala', 'Sunday Roast', 'Scotch Eggs', 'Eton Mess', 'Cornish Pasty'],
    eateries: [
      { name: 'Dishoom Covent Garden', area: 'Covent Garden', rating: 4.7, reviews: 25300, type: 'Bombay Irani Café', price: '££', mustTry: 'Bacon Naan Roll + House Chai' },
      { name: 'The Ledbury', area: 'Notting Hill', rating: 4.6, reviews: 1880, type: '3-Michelin-Star', price: '££££', mustTry: 'Seasonal Tasting Menu' },
      { name: 'Poppies Fish & Chips', area: 'Spitalfields', rating: 4.5, reviews: 9140, type: 'Fish & Chips', price: '££', mustTry: 'Cod & Chips with Mushy Peas' },
      { name: 'Sketch (The Gallery)', area: 'Mayfair', rating: 4.3, reviews: 8200, type: 'Afternoon Tea', price: '£££', mustTry: 'Pink Room Afternoon Tea' },
    ],
    stays: [
      { name: 'The Ned', area: 'Bank / City', rating: 4.6, reviews: 4120, type: 'Members club hotel', price: '£££', highlight: 'Eight restaurants, marble swimming pool' },
      { name: 'CitizenM Tower of London', area: 'Tower Hill', rating: 4.5, reviews: 7300, type: 'Smart hotel', price: '££', highlight: 'Tower & Thames views, tap-to-control rooms' },
      { name: 'The Hoxton, Shoreditch', area: 'Shoreditch', rating: 4.5, reviews: 3210, type: 'Boutique', price: '££', highlight: 'Walkable East London, free hour-of-calls' },
      { name: 'Wombat\'s City Hostel London', area: 'Aldgate', rating: 4.3, reviews: 4900, type: 'Hostel', price: '£', highlight: 'Steps from Tower of London, party basement bar' },
    ],
  },

  dubai: {
    tagline: 'From desert sands to the world\'s most dazzling skyline in just 50 years',
    famousFor: ['Burj Khalifa', 'Palm Jumeirah', 'Gold Souk', 'Desert Safaris', 'Luxury Shopping', 'Largest Mall', 'Zero Income Tax'],
    attractions: [
      { name: 'Burj Khalifa', desc: 'The world\'s tallest building at 828m. The observation deck on floor 148 offers views spanning 95km on a clear day.' },
      { name: 'Palm Jumeirah', desc: 'A man-made palm-shaped island housing luxury hotels, villas, and Atlantis, built from 94 million cubic metres of sand.' },
      { name: 'Dubai Creek & Gold Souk', desc: 'The historic heartbeat of old Dubai — a labyrinthine gold market displaying over 10 tonnes of jewellery daily.' },
      { name: 'Dubai Frame', desc: 'A 150m picture frame straddling old and new Dubai — walk across its glass sky bridge for vertigo-inducing views.' },
      { name: 'Desert Safari', desc: 'Dune bashing, camel rides, falconry, and a traditional Bedouin dinner under a billion stars in the Arabian desert.' },
    ],
    history: [
      'Dubai was a small pearl diving and fishing village for centuries before oil was discovered in 1966, transforming it almost overnight.',
      'The first skyscraper was built in 1979. By 2010, Dubai had more buildings over 200m than any other city on Earth.',
      'Dubai created the first free trade zone in the Middle East in 1985, attracting multinational corporations from around the world.',
      'The UAE was only formed in 1971 when seven Trucial States united under Sheikh Zayed — making it one of the world\'s newest nations.',
    ],
    bestTime: { period: 'November–March', reason: 'Pleasantly warm (25–30°C) with low humidity. Summer months (June–August) reach 45°C+ with extreme humidity.' },
    quickFacts: { language: 'Arabic (English widely spoken)', currency: 'UAE Dirham (AED)', capital: 'Abu Dhabi', knownAs: 'City of Gold', timezone: 'GST (UTC+4)' },
    cuisine: ['Al Harees', 'Shawarma', 'Luqaimat (honey dumplings)', 'Machboos (spiced rice)', 'Camel Milk Ice Cream', 'Fresh Dates'],
    eateries: [
      { name: 'Al Ustad Special Kabab', area: 'Meena Bazaar', rating: 4.6, reviews: 6420, type: 'Persian', price: 'AED', mustTry: 'Special Mixed Kebab Platter' },
      { name: 'Ravi Restaurant', area: 'Satwa', rating: 4.5, reviews: 14200, type: 'Pakistani', price: 'AED', mustTry: 'Chicken Karahi + Fresh Naan' },
      { name: 'Pierchic', area: 'Madinat Jumeirah', rating: 4.5, reviews: 3950, type: 'Seafood on a Pier', price: 'AED AED AED AED', mustTry: 'Lobster Thermidor with Burj Al Arab Views' },
      { name: 'Zuma Dubai', area: 'DIFC', rating: 4.6, reviews: 4720, type: 'Modern Japanese', price: 'AED AED AED AED', mustTry: 'Black Cod Miso' },
    ],
    stays: [
      { name: 'Atlantis The Palm', area: 'Palm Jumeirah', rating: 4.6, reviews: 9420, type: 'Resort', price: 'AED AED AED AED', highlight: 'Aquaventure waterpark, lost-chambers aquarium' },
      { name: 'Rove Downtown', area: 'Downtown Dubai', rating: 4.5, reviews: 8200, type: 'Smart hotel', price: 'AED AED', highlight: 'Walk to Burj Khalifa, value pricing' },
      { name: 'Address Beach Resort', area: 'JBR', rating: 4.6, reviews: 5400, type: 'Beachfront luxury', price: 'AED AED AED AED', highlight: 'Highest infinity pool in the world' },
      { name: 'Form Hotel Al Jaddaf', area: 'Al Jaddaf', rating: 4.4, reviews: 3100, type: 'Design hotel', price: 'AED AED', highlight: 'Metro-connected, modern design' },
    ],
  },

  singapore: {
    tagline: 'A tiny city-state that punches far above its weight in every dimension',
    famousFor: ['Gardens by the Bay', 'Street Food Hawker Culture', 'Changi Airport', 'Marina Bay Sands', 'Zero Corruption', 'Multicultural Harmony'],
    attractions: [
      { name: 'Gardens by the Bay', desc: 'Futuristic Supertree Grove and two climate-controlled domes housing plants from across the world.' },
      { name: 'Marina Bay Sands', desc: 'Three towers topped by a sky park with the world\'s largest rooftop infinity pool 57 storeys above the city.' },
      { name: 'Sentosa Island', desc: 'A resort island with Universal Studios, beaches, and the world\'s most expensive cable car crossing.' },
      { name: 'Hawker Centres', desc: 'UNESCO-listed culinary heritage — open-air food courts where Michelin-quality dishes cost just $3–5 SGD.' },
      { name: 'Little India & Chinatown', desc: 'Living cultural enclaves with temples, markets, and cuisine that showcase Singapore\'s multicultural DNA.' },
    ],
    history: [
      'Singapore was a small fishing village until Sir Stamford Raffles arrived in 1819 and established it as a British trading post.',
      'The Fall of Singapore in 1942 — when Japan captured it from Britain — was called by Churchill "the worst disaster in British military history."',
      'Singapore gained independence in 1965 almost by accident when it was expelled from Malaysia. Lee Kuan Yew wept on television.',
      'In just one generation, Singapore transformed from a third-world country with no natural resources to one of the world\'s wealthiest nations.',
    ],
    bestTime: { period: 'February–April', reason: 'Least rainfall in the year with lower humidity. Singapore is hot year-round (28–34°C), so there\'s no true "bad" time to visit.' },
    quickFacts: { language: 'English, Mandarin, Malay, Tamil', currency: 'Singapore Dollar (SGD)', capital: 'Singapore City', knownAs: 'The Lion City', timezone: 'SST (UTC+8)' },
    cuisine: ['Hainanese Chicken Rice', 'Chilli Crab', 'Laksa', 'Char Kway Teow', 'Kaya Toast & Soft Eggs', 'Bak Kut Teh'],
    stays: [
      { name: 'Marina Bay Sands', area: 'Marina Bay', rating: 4.6, reviews: 41200, type: 'Iconic luxury hotel', price: 'S$S$S$S$', highlight: 'Rooftop infinity pool 57 floors up, casino, ArtScience Museum at the door' },
      { name: 'Raffles Singapore', area: 'City Hall', rating: 4.7, reviews: 4820, type: 'Heritage palace hotel', price: 'S$S$S$S$', highlight: 'Colonial-era suites, Long Bar (home of the Singapore Sling)' },
      { name: 'Naumi Hotel', area: 'Bras Basah', rating: 4.5, reviews: 1980, type: 'Boutique', price: 'S$S$S$', highlight: 'Rooftop pool overlooking the skyline, walkable to Fort Canning' },
      { name: 'lyf Funan', area: 'Civic District', rating: 4.4, reviews: 2240, type: 'Co-living hotel', price: 'S$S$', highlight: 'Smart rooms, communal kitchen, 5 min to Marina Bay on foot' },
    ],
  },

  thailand: {
    tagline: 'Land of Smiles — elephants, temples, street food, and tropical paradise',
    famousFor: ['Floating Markets', 'Elephants', 'Muay Thai', 'Full Moon Party', 'Tuk-tuks', 'Grand Palace', 'Street Food Culture'],
    attractions: [
      { name: 'Grand Palace & Wat Phra Kaew', desc: 'Bangkok\'s dazzling royal complex houses the Emerald Buddha, Thailand\'s most sacred object, in a temple gilded with 2,000kg of gold.' },
      { name: 'Chiang Mai Old City', desc: 'Ancient walled city with 300 Buddhist temples, night bazaars, and ethical elephant sanctuaries in the misty northern hills.' },
      { name: 'Phi Phi Islands', desc: 'Dramatic limestone karsts rising from turquoise water — the filming location of The Beach (2000) starring Leonardo DiCaprio.' },
      { name: 'Ayutthaya Ruins', desc: 'Ancient Siamese capital with towering prangs and headless Buddha statues — a UNESCO World Heritage site 80km from Bangkok.' },
      { name: 'Damnoen Saduak Floating Market', desc: 'Vendors sell tropical fruit and pad thai from wooden boats on a maze of canals southwest of Bangkok.' },
    ],
    history: [
      'Thailand is the only Southeast Asian nation never to have been colonized by a European power — "Thai" literally means "free."',
      'The Kingdom of Sukhothai (1238–1438) is regarded as the cradle of Thai civilization, where the Thai alphabet was created.',
      'Bangkok became the capital in 1782 under Rama I, who modeled it after the old capital Ayutthaya using materials salvaged from its ruins.',
      'Thailand experienced 19 military coups in the 20th century, making it one of the world\'s most coup-prone nations.',
    ],
    bestTime: { period: 'November–February', reason: 'Cool and dry season with temperatures of 25–30°C. March–May is brutally hot; June–October brings monsoon rains.' },
    quickFacts: { language: 'Thai', currency: 'Thai Baht (฿)', capital: 'Bangkok', knownAs: 'Land of Smiles', timezone: 'ICT (UTC+7)' },
    cuisine: ['Pad Thai', 'Tom Yum Soup', 'Green/Red Curry', 'Som Tum (Papaya Salad)', 'Mango Sticky Rice', 'Massaman Curry'],
    eateries: [
      { name: 'Jay Fai', area: 'Old City, Bangkok', rating: 4.4, reviews: 8860, type: 'Michelin Street Food', price: '฿฿฿', mustTry: 'Drunken Noodles & Crab Omelette' },
      { name: 'Thip Samai', area: 'Phra Nakhon, Bangkok', rating: 4.4, reviews: 12300, type: 'Pad Thai Institution', price: '฿', mustTry: 'Pad Thai Haw Kai (egg wrap)' },
      { name: 'Nahm', area: 'Sathorn, Bangkok', rating: 4.5, reviews: 2180, type: 'Thai Fine Dining', price: '฿฿฿฿', mustTry: 'Chef David Thompson Tasting Menu' },
      { name: "Rock's Restaurant", area: 'Chiang Mai', rating: 4.5, reviews: 3420, type: 'Northern Thai', price: '฿฿', mustTry: 'Khao Soi with Braised Chicken' },
    ],
    stays: [
      { name: 'Mandarin Oriental Bangkok', area: 'Riverside, Bangkok', rating: 4.8, reviews: 5210, type: 'Legendary luxury hotel', price: '฿฿฿฿', highlight: 'Chao Phraya river suites, Authors\' Lounge afternoon tea' },
      { name: 'Riva Surya', area: 'Phra Athit, Bangkok', rating: 4.5, reviews: 2860, type: 'Boutique riverside', price: '฿฿฿', highlight: 'Khao San Road in walking distance, infinity pool over the river' },
      { name: 'Pimalai Resort & Spa', area: 'Koh Lanta', rating: 4.7, reviews: 1240, type: 'Beach resort', price: '฿฿฿฿', highlight: 'Two-bay private beach, jungle spa villas' },
      { name: 'Tamarind Village', area: 'Old City, Chiang Mai', rating: 4.6, reviews: 1640, type: 'Heritage Lanna boutique', price: '฿฿฿', highlight: 'Bamboo-grove courtyard, walk to Sunday Walking Street market' },
    ],
  },

  goa: {
    tagline: 'India\'s pocket of paradise — golden beaches, Portuguese churches, and legendary sunsets',
    famousFor: ['Beach Parties', 'Portuguese Heritage', 'Cashew Feni', 'Carnival', 'Spice Plantations', 'Water Sports', 'Susegad Lifestyle'],
    attractions: [
      { name: 'Basilica of Bom Jesus', desc: 'A 16th-century UNESCO World Heritage church housing the incorrupt remains of St. Francis Xavier, displayed every 10 years.' },
      { name: 'Anjuna & Vagator Beach', desc: 'Goa\'s legendary hippy-era beaches with dramatic red cliff sunsets, full moon parties, and vibrant flea markets.' },
      { name: 'Old Goa', desc: 'Once rivalling Lisbon in grandeur, this 16th-century Portuguese capital has more churches per square mile than anywhere in Asia.' },
      { name: 'Dudhsagar Waterfalls', desc: 'A spectacular 310m four-tiered waterfall on the Goa–Karnataka border, accessible by jeep or train through dense jungle.' },
      { name: 'Fontainhas Latin Quarter', desc: 'Panaji\'s preserved 18th-century Portuguese neighbourhood of brightly painted houses, narrow lanes, and baroque chapels.' },
    ],
    history: [
      'Goa was ruled by the Kadamba dynasty (960–1310 AD) and later the Vijayanagara Empire before the Portuguese arrived in 1510.',
      'Afonso de Albuquerque captured Goa from the Bijapur Sultanate in 1510, making it the jewel of the Portuguese Empire for 450 years.',
      'The Inquisition of Goa (1561–1812) was among history\'s most brutal — thousands were tried and executed for "heresy" by the Church.',
      'Goa remained under Portuguese control 14 years after Indian independence, until India\'s military "liberation" operation in December 1961.',
    ],
    bestTime: { period: 'November–February', reason: 'Perfect beach weather at 28–32°C with low humidity. Pre-Christmas and NYE see peak crowds; monsoon (Jun–Sep) is lush but beaches are rough.' },
    quickFacts: { language: 'Konkani, English, Portuguese (heritage)', currency: 'Indian Rupee (₹)', capital: 'Panaji', knownAs: 'Pearl of the Orient', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Fish Curry Rice', 'Prawn Balchão', 'Chicken Xacuti', 'Bebinca (layered dessert)', 'Feni (cashew liquor)', 'Sorpotel'],
    eateries: [
      { name: 'Gunpowder', area: 'Assagao, North Goa', rating: 4.5, reviews: 3420, type: 'South Indian Coastal', price: '₹₹', mustTry: 'Fish Mappas with Appam' },
      { name: 'Vinayak Family Restaurant', area: 'Assagao, North Goa', rating: 4.4, reviews: 2910, type: 'Goan Thali', price: '₹₹', mustTry: 'Pomfret Rava Fry Thali' },
      { name: 'Thalassa', area: 'Vagator', rating: 4.3, reviews: 8720, type: 'Greek with Cliff Views', price: '₹₹₹', mustTry: 'Moussaka + Sunset Seating' },
      { name: "Fisherman's Wharf", area: 'Cavelossim', rating: 4.4, reviews: 6140, type: 'Goan Seafood', price: '₹₹', mustTry: 'Goan Prawn Curry Rice' },
    ],
    stays: [
      { name: 'W Goa', area: 'Vagator, North Goa', rating: 4.5, reviews: 3120, type: 'Beach resort', price: '₹₹₹₹', highlight: 'Cliff-side villas, Sundowner sessions' },
      { name: 'Mojigao', area: 'Assagao, North Goa', rating: 4.7, reviews: 880, type: 'Eco boutique', price: '₹₹₹', highlight: 'Forest cottages, away from Vagator chaos' },
      { name: 'Stone Wood Hotel', area: 'Anjuna, North Goa', rating: 4.4, reviews: 2800, type: 'Mid-range hotel', price: '₹₹', highlight: 'Walk to flea market & Anjuna beach' },
      { name: 'The Hosteller Goa', area: 'Vagator', rating: 4.3, reviews: 5400, type: 'Hostel', price: '₹', highlight: 'Pool, Olive Bar nearby, social vibe' },
    ],
  },

  mumbai: {
    tagline: 'The city that never sleeps — dreams are made and broken here every day',
    famousFor: ['Bollywood', 'Gateway of India', 'Dabbawalas', 'Street Food', 'Financial Capital', 'Slumdog Scenes', 'Marine Drive'],
    attractions: [
      { name: 'Gateway of India', desc: 'Built in 1924 to commemorate King George V\'s visit, this basalt arch on the harbour was the last image British troops saw when they left India in 1948.' },
      { name: 'Marine Drive (Queen\'s Necklace)', desc: 'A 3.6km Art Deco boulevard curving along Back Bay — the sparkling city lights at night form a necklace visible from Malabar Hill.' },
      { name: 'Dharavi', desc: 'Asia\'s largest slum is also one of its most industrious — a billion-dollar economy of recycling, leather and pottery workshops.' },
      { name: 'Elephanta Caves', desc: 'A UNESCO site on an island in Mumbai Harbour — rock-cut temples to Shiva dating from the 5th–8th century, reachable only by ferry.' },
      { name: 'Chhatrapati Shivaji Terminus', desc: 'A jaw-dropping Victorian Gothic railway station (1887) and UNESCO site that handles 3.5 million passengers every day.' },
    ],
    history: [
      'Mumbai was originally seven islands inhabited by the Koli fishing community and was gifted to Britain as part of Catherine of Braganza\'s dowry to Charles II in 1661.',
      'The British East India Company leased the islands from the Crown for just £10 per year in 1668 and began land reclamation that merged them into one landmass.',
      'Mumbai (then Bombay) became the command centre of the Indian independence movement — Mahatma Gandhi launched multiple campaigns from here.',
      'The 2008 Mumbai attacks (26/11) — a 60-hour siege by 10 Pakistani gunmen — killed 166 people and shocked the entire world.',
    ],
    bestTime: { period: 'November–February', reason: 'Cool, dry, and comfortable at 22–32°C. Monsoon (June–September) brings torrential rain that floods streets but makes the city lush and dramatic.' },
    quickFacts: { language: 'Marathi, Hindi, English', currency: 'Indian Rupee (₹)', capital: 'Financial capital of India', knownAs: 'City of Dreams', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Misal Pav', 'Thalipeeth', 'Modak', 'Solkadhi'],
    eateries: [
      { name: 'Britannia & Co.', area: 'Ballard Estate', rating: 4.5, reviews: 7820, type: 'Parsi Café (since 1923)', price: '₹₹', mustTry: 'Berry Pulao + Raspberry Soda' },
      { name: 'Bademiya', area: 'Colaba', rating: 4.3, reviews: 12400, type: 'Late-Night Kebabs', price: '₹', mustTry: 'Chicken Tikka Roll' },
      { name: 'Trishna', area: 'Fort', rating: 4.5, reviews: 4820, type: 'Seafood', price: '₹₹₹', mustTry: 'Hyderabadi Butter Pepper Garlic Crab' },
      { name: 'The Bombay Canteen', area: 'Lower Parel', rating: 4.5, reviews: 5480, type: 'Modern Indian', price: '₹₹₹', mustTry: 'Kejriwal Toast + Eggs Kejriwal' },
    ],
    stays: [
      { name: 'The Taj Mahal Palace', area: 'Colaba', rating: 4.7, reviews: 8420, type: 'Heritage palace hotel', price: '₹₹₹₹', highlight: 'Gateway of India views, restored Heritage Wing rooms' },
      { name: 'The Oberoi Mumbai', area: 'Nariman Point', rating: 4.7, reviews: 3640, type: 'Luxury hotel', price: '₹₹₹₹', highlight: 'Marine Drive views, Ziya tasting menu, 24/7 butler' },
      { name: 'Abode Bombay', area: 'Colaba', rating: 4.6, reviews: 1180, type: 'Boutique B&B', price: '₹₹₹', highlight: 'Restored 1910 building, walking distance to Gateway' },
      { name: 'The Hosteller Mumbai', area: 'Bandra West', rating: 4.4, reviews: 2920, type: 'Hostel', price: '₹', highlight: 'Bandra cafe scene at the door, social rooftop' },
    ],
  },

  hyderabad: {
    tagline: 'Nizams, biryani, and the birthplace of India\'s tech revolution',
    famousFor: ['Biryani', 'Charminar', 'Nizams\' Treasures', 'Pearl Capital', 'Cyberabad IT Hub', 'Irani Chai', 'Golconda Diamonds'],
    attractions: [
      { name: 'Charminar', desc: 'A 56m granite mosque-monument built in 1591 by Quli Qutb Shah, standing at the heart of the old city\'s bustling bazaars.' },
      { name: 'Golconda Fort', desc: 'A 16th-century fortress famous for its acoustic system — a clap at the entrance gate is heard 1km away at the royal pavilion.' },
      { name: 'Salar Jung Museum', desc: 'One of India\'s largest museums, housing the personal collection of Nawab Salar Jung III — 43,000 artifacts from 35 countries.' },
      { name: 'Hussain Sagar Lake', desc: 'A heart-shaped lake built in 1562 featuring the world\'s largest monolithic Buddha statue (18m, 350 tonnes) on a rocky island.' },
      { name: 'Laad Bazaar', desc: 'A 400-year-old bazaar near Charminar crammed with bangles, pearls, embroidered fabric, and the world\'s best Hyderabadi biryani.' },
    ],
    history: [
      'Hyderabad was founded in 1591 by Muhammad Quli Qutb Shah, the 5th ruler of the Qutb Shahi dynasty, on the banks of the Musi River.',
      'The Golconda mines near Hyderabad produced the world\'s most famous diamonds — including the Koh-i-Noor (now in the British Crown), Hope Diamond, and Regent Diamond.',
      'The Nizam of Hyderabad was the world\'s richest man in the 1940s, with a personal fortune estimated at $2 billion (equivalent to $236 billion today).',
      'Hyderabad was controversially absorbed into India in 1948 through "Operation Polo" — a 5-day military action after the Nizam refused to accede.',
    ],
    bestTime: { period: 'October–February', reason: 'Cool and pleasant weather between 15–28°C. Pre-monsoon (March–May) is extremely hot; the monsoon arrives in June.' },
    quickFacts: { language: 'Telugu, Urdu, Hindi', currency: 'Indian Rupee (₹)', capital: 'Capital of Telangana', knownAs: 'City of Pearls', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Hyderabadi Biryani', 'Haleem', 'Mirchi ka Salan', 'Lukhmi', 'Irani Chai', 'Double ka Meetha (bread pudding)', 'Kubani ka Meetha'],
    eateries: [
      { name: 'Paradise Biryani', area: 'Secunderabad', rating: 4.3, reviews: 68400, type: 'Biryani', price: '₹₹', mustTry: 'Hyderabadi Chicken Dum Biryani' },
      { name: 'Shah Ghouse', area: 'Shah Ali Banda', rating: 4.4, reviews: 28600, type: 'Biryani & Haleem', price: '₹', mustTry: 'Haleem (Ramzan Special)' },
      { name: 'Bawarchi', area: 'RTC X Roads', rating: 4.3, reviews: 41200, type: 'Biryani', price: '₹', mustTry: 'Mutton Biryani Jumbo' },
      { name: 'Nimrah Café & Bakery', area: 'Charminar', rating: 4.4, reviews: 9300, type: 'Irani Chai & Bakes', price: '₹', mustTry: 'Osmania Biscuit + Irani Chai' },
    ],
    stays: [
      { name: 'Taj Falaknuma Palace', area: 'Engine Bowli', rating: 4.8, reviews: 4120, type: 'Palace hotel', price: '₹₹₹₹', highlight: 'Nizam-era 101-seat dining table, horse-drawn carriage arrival' },
      { name: 'ITC Kohenur', area: 'HITEC City', rating: 4.6, reviews: 5840, type: 'Luxury hotel', price: '₹₹₹₹', highlight: 'Gachibowli skyline views, Dum Pukht heritage Awadhi cuisine' },
      { name: 'Park Hyatt Hyderabad', area: 'Banjara Hills', rating: 4.6, reviews: 3210, type: 'Luxury hotel', price: '₹₹₹', highlight: 'Banjara Hills shopping, Tellicherry pool, large suites' },
      { name: 'Lemon Tree Premier HITEC City', area: 'HITEC City', rating: 4.5, reviews: 4920, type: 'Mid-range', price: '₹₹', highlight: 'Walking distance to Inorbit Mall, IT-corridor convenience' },
    ],
  },

  udaipur: {
    tagline: 'The Venice of the East — a city of shimmering lakes and fairy-tale palaces',
    famousFor: ['Lake Palace', 'Mewar Royalty', 'City of Lakes', 'James Bond Film Location', 'Havelis', 'Rajput Architecture', 'Romantic Getaway'],
    attractions: [
      { name: 'City Palace', desc: 'A grand 400-year royal complex towering over Lake Pichola — a fusion of Rajput, Mughal, and European architecture spanning 5 generations of Maharanas.' },
      { name: 'Lake Palace', desc: 'A 250-year-old marble palace floating in the middle of Lake Pichola — featured in the James Bond film Octopussy (1983).' },
      { name: 'Monsoon Palace (Sajjangarh)', desc: 'A hilltop ivory palace built in 1884 to watch monsoon clouds roll in — today offers panoramic sunset views over the Aravalli ranges.' },
      { name: 'Jagdish Temple', desc: 'A 17th-century Indo-Aryan temple dedicated to Lord Vishnu, carved from white marble with an ornate 24m spire.' },
      { name: 'Fateh Sagar Lake', desc: 'A serene artificial lake with three islands, a solar observatory, and boat rides framed by the forested Aravalli hills.' },
    ],
    history: [
      'Udaipur was founded in 1559 by Maharana Udai Singh II after the Mughal siege of Chittorgarh, named after himself.',
      'The Mewar dynasty of Udaipur is one of India\'s oldest royal families — continuously ruling for over 1,400 years without submitting to Mughal authority.',
      'Maharana Pratap\'s Battle of Haldighati (1576) against Akbar\'s army became a symbol of Rajput resistance and is still celebrated as a festival.',
      'Unlike other Rajput states, Mewar never gave daughters in marriage to the Mughal emperors — a point of fierce historical pride.',
    ],
    bestTime: { period: 'September–March', reason: 'Post-monsoon (Sep–Nov) reveals lush green hills and full lakes. Winter (Dec–Feb) is cool and ideal for sightseeing.' },
    quickFacts: { language: 'Hindi, Rajasthani', currency: 'Indian Rupee (₹)', capital: 'Former capital of Mewar Kingdom', knownAs: 'City of Lakes / Venice of the East', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Laal Maas', 'Malpua', 'Kachori', 'Ker Sangri'],
    stays: [
      { name: 'Taj Lake Palace', area: 'Lake Pichola', rating: 4.8, reviews: 5240, type: 'Palace hotel on water', price: '₹₹₹₹', highlight: 'Boat-only access, the floating marble palace from Octopussy' },
      { name: 'The Oberoi Udaivilas', area: 'Haridasji Ki Magri', rating: 4.9, reviews: 2840, type: 'Palatial luxury resort', price: '₹₹₹₹', highlight: 'Private pool suites, 30 acres on Lake Pichola, peacocks roaming' },
      { name: 'Jagat Niwas Palace', area: 'Old City', rating: 4.5, reviews: 1820, type: 'Heritage haveli', price: '₹₹₹', highlight: 'Lakefront 17th-century haveli, rooftop dinners over Pichola' },
      { name: 'Zostel Udaipur', area: 'Hanuman Ghat', rating: 4.4, reviews: 3260, type: 'Hostel', price: '₹', highlight: 'Lake-view rooftop, walking distance to City Palace' },
    ],
  },

  kashmir: {
    tagline: 'Heaven on Earth — where Mughal gardens, Dal Lake, and the Himalayas converge',
    famousFor: ['Dal Lake Houseboats', 'Pashmina Shawls', 'Saffron Fields', 'Gulmarg Ski Resort', 'Mughal Gardens', 'Wazwan Cuisine', 'Shikara Rides'],
    attractions: [
      { name: 'Dal Lake', desc: 'A 18 sqkm Himalayan lake with floating gardens, markets on Shikara boats, and hand-carved houseboats that have been home to travellers since the 1800s.' },
      { name: 'Gulmarg', desc: 'A high-altitude meadow at 2,650m — home to one of the world\'s highest cable cars and Asia\'s premier ski destination in winter.' },
      { name: 'Shalimar Bagh', desc: 'Jehangir\'s 17th-century Mughal garden with terraced lawns, fountains, and chinar trees turning crimson in autumn.' },
      { name: 'Pahalgam', desc: 'The starting point of the annual Amarnath Yatra pilgrimage, set in a valley of pine forests, trout streams, and glaciers.' },
      { name: 'Sonamarg', desc: 'The "Meadow of Gold" — a stunning valley at 2,800m carpeted with alpine flowers in spring, surrounded by glaciers.' },
    ],
    history: [
      'Kashmir\'s recorded history stretches back 5,000 years — it was a centre of Hindu and Buddhist learning before the arrival of Islam in the 14th century.',
      'Emperor Jahangir famously declared "If there is a heaven on earth, it is this, it is this, it is this" about Kashmir\'s beauty.',
      'The Dogra kings ruled Kashmir from 1846 after Maharaja Gulab Singh purchased it from the British East India Company for 7.5 million Nanakshahi rupees.',
      'The unresolved partition of 1947 made Kashmir the subject of three Indo-Pakistani wars and remains one of the world\'s most disputed territories.',
    ],
    bestTime: { period: 'April–June & Sep–Nov', reason: 'Spring brings almond blossoms and wildflowers; autumn brings golden chinar trees. Winter (Dec–Feb) is magical but very cold (-10°C in Gulmarg).' },
    quickFacts: { language: 'Kashmiri, Urdu, Hindi', currency: 'Indian Rupee (₹)', capital: 'Srinagar (summer) / Jammu (winter)', knownAs: 'Paradise on Earth', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Wazwan (36-course feast)', 'Rogan Josh', 'Yakhni', 'Gushtaba', 'Kahwa Tea', 'Modur Pulao', 'Sheermal'],
    stays: [
      { name: 'The Lalit Grand Palace', area: 'Gupkar Road, Srinagar', rating: 4.5, reviews: 2840, type: 'Heritage palace hotel', price: '₹₹₹₹', highlight: 'Erstwhile royal residence, 14 acres of chinar gardens' },
      { name: 'Sukoon Houseboat', area: 'Dal Lake, Srinagar', rating: 4.7, reviews: 920, type: 'Luxury houseboat', price: '₹₹₹', highlight: 'Hand-carved walnut interiors, shikara breakfast on the lake' },
      { name: 'The Khyber Himalayan Resort', area: 'Gulmarg', rating: 4.7, reviews: 1640, type: 'Mountain resort', price: '₹₹₹₹', highlight: 'Ski-in ski-out, L\'Occitane spa, views of Apharwat peaks' },
      { name: 'Hotel Hilltop', area: 'Pahalgam', rating: 4.3, reviews: 2120, type: 'Mid-range hotel', price: '₹₹', highlight: 'Lidder valley views, near Amarnath base camp' },
    ],
  },

  kerala: {
    tagline: 'God\'s Own Country — backwaters, spices, and ancient Ayurvedic healing',
    famousFor: ['Backwaters & Houseboats', 'Ayurveda', 'Spice Gardens', 'Kathakali Dance', 'Tea Plantations', 'Snake Boat Races', '100% Literacy'],
    attractions: [
      { name: 'Alleppey Backwaters', desc: 'A 900km network of lagoons, rivers, and canals — explored on hand-carved kettuvallam (rice boat) houseboats in absolute tranquillity.' },
      { name: 'Munnar Tea Estates', desc: 'Rolling hills at 1,600m blanketed in emerald tea gardens, with colonial-era bungalows and the rare Neelakurinji flower (blooms once every 12 years).' },
      { name: 'Periyar Wildlife Sanctuary', desc: 'One of India\'s last wild elephant habitats — boat safaris on Periyar Lake offer extraordinary wildlife sightings.' },
      { name: 'Kovalam & Varkala Beach', desc: 'Kerala\'s most famous beaches — Kovalam for resort living, Varkala for dramatic red cliffs and hippie-spiritual atmosphere.' },
      { name: 'Fort Kochi', desc: 'A quarter-mile square of history — Chinese fishing nets unchanged since 1400 AD, a 16th-century Portuguese church, and India\'s oldest European synagogue.' },
    ],
    history: [
      'Kerala\'s Spice Coast was the most sought-after destination in the ancient world — Romans, Arabs, Chinese, and Europeans all traded here for black pepper and cardamom.',
      'Vasco da Gama landed at Kozhikode (Calicut) in 1498 — the first European to reach India by sea, opening a spice route that changed world history.',
      'Kerala\'s Zamorin (Samoothiri) rulers maintained a cosmopolitan spice empire for 500 years, trading with Arab and Chinese merchants long before Europeans arrived.',
      'Kerala became the first place in the world to democratically elect a communist government in 1957 under E.M.S. Namboodiripad.',
    ],
    bestTime: { period: 'September–March', reason: 'Post-monsoon brings lush greenery without rain. December–January is ideal for backwaters. Avoid June–August (heavy monsoon, though Ayurveda season).' },
    quickFacts: { language: 'Malayalam', currency: 'Indian Rupee (₹)', capital: 'Thiruvananthapuram', knownAs: "God's Own Country", timezone: 'IST (UTC+5:30)' },
    cuisine: ['Kerala Sadya (banana leaf feast)', 'Appam with Stew', 'Kerala Fish Curry', 'Prawn Moilee', 'Puttu & Kadala Curry', 'Payasam'],
    eateries: [
      { name: 'Dhe Puttu', area: 'Kochi', rating: 4.4, reviews: 7850, type: 'Kerala Breakfast', price: '₹₹', mustTry: 'Puttu Varieties with Beef Fry' },
      { name: 'Fort House', area: 'Fort Kochi', rating: 4.4, reviews: 3120, type: 'Waterfront Seafood', price: '₹₹', mustTry: 'Karimeen Pollichathu' },
      { name: 'Kayees Biryani', area: 'Mattancherry, Kochi', rating: 4.5, reviews: 5460, type: 'Biryani (since 1957)', price: '₹', mustTry: 'Mutton Biryani' },
      { name: "Paragon Restaurant", area: 'Kozhikode', rating: 4.5, reviews: 16200, type: 'Malabar', price: '₹₹', mustTry: 'Malabar Fish Biryani' },
    ],
    stays: [
      { name: 'Taj Malabar Resort & Spa', area: 'Willingdon Island, Kochi', rating: 4.6, reviews: 3120, type: 'Luxury harbour resort', price: '₹₹₹₹', highlight: 'Backwater views, Jiva spa, sunset cruise on Vembanad Lake' },
      { name: 'Kumarakom Lake Resort', area: 'Kumarakom', rating: 4.7, reviews: 2840, type: 'Backwater resort', price: '₹₹₹₹', highlight: 'Meandering pool villas, traditional Kettuvallam stays' },
      { name: 'Spice Tree Munnar', area: 'Munnar', rating: 4.6, reviews: 1680, type: 'Hill resort', price: '₹₹₹', highlight: 'Tea-garden cottages at 5,000 ft, infinity pool over the valley' },
      { name: 'Brunton Boatyard', area: 'Fort Kochi', rating: 4.5, reviews: 1980, type: 'Heritage boutique', price: '₹₹₹', highlight: 'Restored shipyard, Chinese fishing-net views from every room' },
    ],
  },

  shimla: {
    tagline: 'The Queen of Hills — where the British Raj built its summer capital',
    famousFor: ['British Colonial Architecture', 'Toy Train', 'Mall Road', 'Apple Orchards', 'Summer Capital of India', 'Snow in Winter', 'Ridge & Christ Church'],
    attractions: [
      { name: 'The Ridge & Mall Road', desc: 'Shimla\'s social heart — a colonial promenade with Victorian architecture, cafes, and panoramic views of the snow-capped Himalayas.' },
      { name: 'Jakhu Temple', desc: 'A temple to Hanuman at 2,455m, reachable by a 2.5km trek through forests filled with mischievous (and aggressive) Rhesus monkeys.' },
      { name: 'Kalka–Shimla Toy Train', desc: 'A UNESCO World Heritage narrow-gauge railway built in 1903 — 96km of track, 102 tunnels, and 864 bridges through stunning Himalayan scenery.' },
      { name: 'Kufri', desc: 'A ski resort 16km from Shimla with slopes, yak rides, and a Himalayan Wildlife Zoo at 2,662m altitude.' },
      { name: 'Viceregal Lodge', desc: 'A Gothic 1888 mansion where the fate of British India was decided — the Simla Accord and Partition discussions took place here.' },
    ],
    history: [
      'Shimla was a small village of Nepalese subjects when British army officers first camped here in 1817 after the Anglo-Nepalese War.',
      'Lord Amherst officially made Shimla the summer capital of British India in 1864 — the entire Government of India relocated here for 6 months each year.',
      'The Simla Conference of 1914 between Britain, China, and Tibet established borders still disputed today (the McMahon Line with China).',
      'After independence in 1947, Shimla hosted the 1972 Shimla Agreement between India and Pakistan following the Bangladesh Liberation War.',
    ],
    bestTime: { period: 'March–June & Oct–Nov', reason: 'Summer (Mar–Jun) is cool and green; autumn is crisp. Winter (Dec–Feb) brings snowfall and skiing but cold temperatures.' },
    quickFacts: { language: 'Hindi, Pahari', currency: 'Indian Rupee (₹)', capital: 'Capital of Himachal Pradesh', knownAs: 'Queen of Hills', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Siddu (steamed bread)', 'Chha Gosht', 'Aktori', 'Babru (black sesame kachori)', 'Madra (chickpea curry)', 'Kaale Chane ka Khatta'],
    stays: [
      { name: 'Wildflower Hall', area: 'Mashobra (12 km from Shimla)', rating: 4.7, reviews: 2940, type: 'Luxury Himalayan retreat', price: '₹₹₹₹', highlight: 'Lord Kitchener\'s former estate, heated pool overlooking the snow line' },
      { name: 'The Oberoi Cecil', area: 'The Mall, Shimla', rating: 4.6, reviews: 1840, type: 'Heritage luxury', price: '₹₹₹₹', highlight: '1884 building, six-storey atrium, walk to Christ Church' },
      { name: 'Clarkes Hotel', area: 'The Mall', rating: 4.4, reviews: 2120, type: 'Heritage mid-range', price: '₹₹₹', highlight: 'Shimla\'s oldest hotel (1898), Mall Road at the door' },
      { name: 'Zostel Shimla', area: 'Mashobra', rating: 4.4, reviews: 1640, type: 'Hostel', price: '₹', highlight: 'Pine forest cabins, valley sunrise from the deck' },
    ],
  },

  manali: {
    tagline: 'Gateway to the Himalayas — adventure, apple blossoms, and ancient cedar forests',
    famousFor: ['Rohtang Pass', 'Adventure Sports', 'Old Manali Cafés', 'Hadimba Temple', 'Solang Valley', 'Honeymoon Destination', 'Apple Orchards'],
    attractions: [
      { name: 'Rohtang Pass', desc: 'A 3,978m high mountain pass with year-round snow, commanding views over the Kullu and Lahaul valleys — open only May–November.' },
      { name: 'Hadimba Devi Temple', desc: 'A 500-year-old cedar wood temple with an unusual 4-tiered pagoda roof, built in a forest clearing with huge boulders as its foundation.' },
      { name: 'Solang Valley', desc: 'A 14km valley famous for skiing in winter and zorbing, paragliding, and horse riding in summer, backed by towering Himalayan peaks.' },
      { name: 'Old Manali', desc: 'A riverside village of apple orchards, budget guesthouses, and cafes beloved by backpackers since the 1970s hippie trail.' },
      { name: 'Vashisht Hot Springs', desc: 'Sulphur springs used for 4,000 years by pilgrims, with two public baths (men and women) beside a temple to sage Vashisht.' },
    ],
    history: [
      'Manali\'s history traces to the sage Manu, from whom the name derives — he is said to have survived the great flood here, making it a site of Hindu creation mythology.',
      'The town was a key resting point on the ancient trade route between Kullu and Leh, used by merchants trading in salt, wool, and spices across the Himalayas.',
      'Manali remained a tiny apple-farming village until the construction of the Rohtang Pass road in the 1960s opened it to the outside world.',
    ],
    bestTime: { period: 'October–June', reason: 'Autumn (Oct–Nov) for clear skies and snow. Winter for skiing. Spring (Mar–June) for apple blossoms and trekking. Monsoon (July–Sep) brings heavy rain and landslides.' },
    quickFacts: { language: 'Hindi, Kulvi, Manali dialect', currency: 'Indian Rupee (₹)', capital: 'Sub-district of Kullu', knownAs: 'Valley of the Gods', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Sidu', 'Trout Fish (locally caught)', 'Bhey (lotus stem)', 'Patande (pancake)', 'Chha Gosht', 'Sepu Vadi'],
    stays: [
      { name: 'The Himalayan', area: 'Hadimba Road', rating: 4.5, reviews: 2840, type: 'Castle-style mountain hotel', price: '₹₹₹₹', highlight: 'Turreted stone facade, view of Hadimba forest, in-room fireplaces' },
      { name: 'Span Resort & Spa', area: 'Kullu-Manali Highway', rating: 4.6, reviews: 1820, type: 'Riverside resort', price: '₹₹₹₹', highlight: 'Beas-river cottages, heated pool, on the way to Solang Valley' },
      { name: 'Apple Country Resort', area: 'Banon Resorts Road', rating: 4.4, reviews: 1640, type: 'Mid-range', price: '₹₹', highlight: 'Apple-orchard cottages, walking distance to Old Manali cafés' },
      { name: 'Zostel Manali', area: 'Old Manali', rating: 4.5, reviews: 4220, type: 'Hostel', price: '₹', highlight: 'Manu temple lane, social rooftop, free walking tours' },
    ],
  },

  wayanad: {
    tagline: 'Kerala\'s emerald highlands — tribal heritage, coffee estates, and misty wildlife',
    famousFor: ['Coffee & Tea Plantations', 'Tribal Culture', 'Edakkal Caves', 'Wildlife Sanctuary', 'Chembra Peak', 'Banasura Sagar Dam', 'Organic Spices'],
    attractions: [
      { name: 'Edakkal Caves', desc: 'Pre-historic cave shelters with 6,000-year-old petroglyphs — among the oldest rock art in India, depicting humans, animals, and symbols.' },
      { name: 'Wayanad Wildlife Sanctuary', desc: 'A 344 sqkm forest contiguous with Nagarhole and Bandipur — one of South India\'s best spots for wild elephants, tigers, and leopards.' },
      { name: 'Chembra Peak', desc: 'Wayanad\'s highest peak at 2,100m, with a permanently water-filled heart-shaped lake halfway up — a rigorous but rewarding 4-hour trek.' },
      { name: 'Banasura Sagar Dam', desc: 'India\'s second largest earthen dam surrounded by mist-covered hills — boat rides on the reservoir reveal a submerged Shiva temple at low water.' },
      { name: 'Soochipara Falls', desc: 'A 200m three-tiered waterfall through dense jungle — the 2km trek through a coffee estate to reach it is half the experience.' },
    ],
    history: [
      'Wayanad has been inhabited by tribal communities like the Kurichiyars and Paniyas for over 5,000 years, as evidenced by the Edakkal cave engravings.',
      'Pazhassi Raja, the "Lion of Kerala," launched India\'s first major tribal resistance against British rule from Wayanad\'s forests in 1793–1805.',
      'The British developed extensive coffee and tea plantations in Wayanad during the 19th century, displacing indigenous tribal communities who still seek land rights today.',
    ],
    bestTime: { period: 'October–May', reason: 'Post-monsoon (Oct–Jan) has clear skies for wildlife and trekking. Monsoon (June–September) turns it vivid green but trekking is risky.' },
    quickFacts: { language: 'Malayalam, Tribal languages', currency: 'Indian Rupee (₹)', capital: 'Kalpetta', knownAs: 'Land of Forests', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Bamboo Biryani', 'Kanji (rice porridge)', 'Tribal Forest Honey', 'Puttu & Kadala', 'Black Pepper Chicken', 'Wild Boar Curry'],
    stays: [
      { name: 'Vythiri Village', area: 'Lakkidi', rating: 4.5, reviews: 2640, type: 'Rainforest resort', price: '₹₹₹₹', highlight: 'Tree-house suites, natural pool fed by a stream' },
      { name: 'Banasura Hill Resort', area: 'Padinjarathara', rating: 4.5, reviews: 1840, type: 'Eco hill resort', price: '₹₹₹', highlight: 'Asia\'s largest mud architecture, view of Banasura dam' },
      { name: 'Wayanad Wild', area: 'Vythiri', rating: 4.6, reviews: 920, type: 'Boutique jungle stay', price: '₹₹₹', highlight: 'CGH Earth property in a wildlife corridor, no TV — just forest sounds' },
      { name: 'Coffee Acres Plantation', area: 'Kalpetta', rating: 4.4, reviews: 740, type: 'Plantation homestay', price: '₹₹', highlight: 'Working coffee estate, bonfire dinners, family-run' },
    ],
  },

  ladakh: {
    tagline: 'The Land of High Passes — where monasteries touch the sky and roads test the soul',
    famousFor: ['Pangong Lake', 'Khardung La Pass', 'Buddhist Monasteries', 'Magnetic Hill', 'Motorbiking', '3 Idiots Filming Location', 'Stargazing'],
    attractions: [
      { name: 'Pangong Tso', desc: 'A surreal 134km-long glacial lake at 4,350m that changes colour from azure to turquoise to silver — one-third lies in India, two-thirds in China.' },
      { name: 'Nubra Valley', desc: 'A high-altitude cold desert with sand dunes, Bactrian (double-humped) camels, and ancient monasteries at 3,048m elevation.' },
      { name: 'Thiksey Monastery', desc: 'A 12-storey monastery complex resembling Potala Palace in Tibet, housing 500 monks and a 15m Maitreya Buddha statue.' },
      { name: 'Khardung La', desc: 'One of the world\'s highest motorable passes at 5,359m — the biker\'s pilgrimage, where thin air, stunning views, and chai shacks collide.' },
      { name: 'Shanti Stupa', desc: 'A gleaming white Buddhist stupa built in 1991 on a 4,267m hilltop overlooking Leh town, offering a 360° panorama of the Stok Kangri range.' },
    ],
    history: [
      'Ladakh was an independent kingdom for over 1,000 years under the Namgyal dynasty, established in 1470 CE and lasting until Dogra conquest in 1842.',
      'The ancient Silk Route passed through Ladakh, connecting China with Central Asia — the ruins of caravanserais (trade rest stops) still dot the landscape.',
      'The 1962 Sino-Indian War transformed Ladakh\'s strategic importance overnight, leading to massive military infrastructure that now makes tourism possible.',
      'Ladakh became India\'s newest Union Territory in August 2019, gaining direct central administration separate from Jammu & Kashmir.',
    ],
    bestTime: { period: 'June–September', reason: 'The only window when mountain passes are open and weather is stable. July–August is warmest but busy. Frozen river Chadar trek runs in January–February.' },
    quickFacts: { language: 'Ladakhi, Hindi, Urdu', currency: 'Indian Rupee (₹)', capital: 'Leh', knownAs: 'Land of High Passes', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Tsampa (roasted barley)', 'Thukpa (noodle soup)', 'Skyu (pasta stew)', 'Chhurpi (yak cheese)', 'Butter Tea (Po Cha)', 'Khambir Bread'],
    stays: [
      { name: 'The Grand Dragon Ladakh', area: 'Old Leh Road', rating: 4.5, reviews: 2640, type: 'Luxury hotel', price: '₹₹₹₹', highlight: 'Oxygen-enriched rooms (a real perk at 3,500m), heated floors' },
      { name: 'Stok Palace Heritage Hotel', area: 'Stok village', rating: 4.7, reviews: 540, type: 'Royal palace stay', price: '₹₹₹₹', highlight: 'Suites inside the residence of Ladakh\'s royal family, 19th-century murals' },
      { name: 'The Zen Ladakh', area: 'Sankar, Leh', rating: 4.4, reviews: 920, type: 'Mid-range hotel', price: '₹₹', highlight: 'Garden courtyard, walking distance to Leh Market and Shanti Stupa trail' },
      { name: 'Zostel Plus Leh', area: 'Changspa', rating: 4.5, reviews: 1840, type: 'Hostel', price: '₹', highlight: 'Pet-friendly, mountain views, walking distance to Shanti Stupa' },
    ],
  },

  meghalaya: {
    tagline: 'The Abode of Clouds — living root bridges, crystal caves, and India\'s wettest place',
    famousFor: ['Living Root Bridges', 'Cherrapunji (Wettest Place)', 'Dawki River', 'Cave Systems', 'Khasi Matrilineal Society', 'Welsh Missionaries', 'Music & Festivals'],
    attractions: [
      { name: 'Living Root Bridges', desc: 'The Khasi and Jaintia tribes weave the aerial roots of rubber trees over decades into natural bridges — some over 50 metres long and 500 years old.' },
      { name: 'Dawki & Umngot River', desc: 'India\'s clearest river — the water is so transparent that boats appear to float in mid-air above the sandy riverbed.' },
      { name: 'Cherrapunji (Sohra)', desc: 'Holds the world record for most rainfall in a single month (9,299mm in July 1861) — surrounded by stunning waterfalls and dramatic valleys.' },
      { name: 'Mawsmai Cave', desc: 'A 150m lit cave system of limestone formations near Cherrapunji, passable without equipment — the surrounding forests contain orchids and carnivorous pitcher plants.' },
      { name: 'Shillong', desc: 'The "Scotland of the East" — a city of colonial architecture, waterfall-dotted hills, vibrant live music, and a thriving café scene.' },
    ],
    history: [
      'Meghalaya is home to one of the world\'s few matrilineal societies — among the Khasi and Garo tribes, property and family name pass through the mother, not the father.',
      'Welsh Presbyterian missionaries arrived in 1841 and had remarkable success converting the Khasi people, who became among India\'s most literate Christian communities.',
      'Meghalaya was created as a separate state from Assam on January 21, 1972, giving the Khasi, Garo, and Jaintia tribal groups their own homeland.',
      'The Khasi people uniquely preserved oral traditions through music — the "living root bridge" engineering tradition was passed down entirely by word of mouth for centuries.',
    ],
    bestTime: { period: 'October–May', reason: 'Dry season brings clear skies and full visibility of waterfalls and rivers. Monsoon (June–September) is dramatic but roads flood and bridges get dangerous.' },
    quickFacts: { language: 'Khasi, Garo, Bengali, English', currency: 'Indian Rupee (₹)', capital: 'Shillong', knownAs: 'Abode of Clouds', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Jadoh (pork rice)', 'Dohneiiong (black sesame pork)', 'Tungtap (fish chutney)', 'Kwai (betel nut)', 'Nakham Bitchi (fish soup)', 'Pukhlein (rice cake)'],
    stays: [
      { name: 'Ri Kynjai Serenity by the Lake', area: 'Umiam Lake, Shillong', rating: 4.6, reviews: 1340, type: 'Lakeside resort', price: '₹₹₹₹', highlight: 'Khasi-themed cottages over Umiam Lake, infinity pool with mist views' },
      { name: 'Polo Orchid Resort', area: 'Cherrapunji', rating: 4.4, reviews: 1620, type: 'Hill resort', price: '₹₹₹', highlight: 'Cliff-edge cottages over Cherrapunji valley, easy access to Nohkalikai Falls' },
      { name: 'Cherrapunjee Holiday Resort', area: 'Laitkynsew', rating: 4.3, reviews: 920, type: 'Eco resort', price: '₹₹', highlight: 'Closest stay to Double Decker Living Root Bridge trail' },
      { name: 'iROOMZ Hotel Centre Point', area: 'Police Bazaar, Shillong', rating: 4.2, reviews: 1840, type: 'City hotel', price: '₹₹', highlight: 'Police Bazaar at the door, walkable to Don Bosco Museum' },
    ],
  },

  ooty: {
    tagline: 'The Queen of Hill Stations — Nilgiri tea, toy trains, and colonial cool',
    famousFor: ['Nilgiri Toy Train', 'Tea Gardens', 'Botanical Gardens', 'Doddabetta Peak', 'Ooty Lake', 'Kodanad Viewpoint', 'Nilgiri Biosphere'],
    attractions: [
      { name: 'Nilgiri Mountain Railway', desc: 'A UNESCO World Heritage toy train since 1899 — the only rack railway in India, climbing steep gradients through 16 tunnels and 250 bridges.' },
      { name: 'Ooty Botanical Gardens', desc: '55 acres of gardens established in 1848 with over 1,000 plant species, a 20-million-year-old fossilized tree trunk, and the famous flower show in May.' },
      { name: 'Doddabetta Peak', desc: 'The highest peak in the Nilgiris at 2,637m — on clear days it offers views extending to Mysore and even distant plains.' },
      { name: 'Avalanche & Emerald Lakes', desc: 'High-altitude shola forest lakes surrounded by grasslands and tea estates, home to rare Nilgiri tahr and gaur (Indian bison).' },
    ],
    history: [
      'Ooty was "discovered" by British administrator John Sullivan in 1819, who built a stone house here and introduced European farming, transforming the Toda tribal pastures.',
      'The Nilgiri Mountain Railway was an engineering marvel of 1899 — it required Swiss rack-and-pinion technology to climb gradients up to 1:12.28.',
      'The Toda people, who had lived in the Nilgiris for thousands of years, saw their sacred grasslands rapidly converted to tea estates under British colonial administration.',
    ],
    bestTime: { period: 'April–June & Sep–Nov', reason: 'Summer (Apr–Jun) is peak season with mild weather and the flower show. Post-monsoon (Sep–Nov) is lush and fog-free. Winter gets cold (3–5°C) with frost.' },
    quickFacts: { language: 'Tamil, Kannada, Malayalam', currency: 'Indian Rupee (₹)', capital: 'District HQ of Nilgiris', knownAs: 'Queen of Hill Stations', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Nilgiri Tea', 'Ooty Varkey (biscuit)', 'Homemade Chocolate', 'Toda Tribal Honey', 'Carrot Halwa', 'Nilgiri-style lamb curry'],
    stays: [
      { name: 'Taj Savoy Hotel', area: 'Sylks Road, Ooty', rating: 4.5, reviews: 2640, type: 'Heritage colonial hotel', price: '₹₹₹₹', highlight: 'Built 1829, oldest hotel in Ooty, 6 acres of cottages and rose gardens' },
      { name: 'The Gateway Hotel Church Road', area: 'Church Road, Ooty', rating: 4.3, reviews: 1840, type: 'Mid-range', price: '₹₹₹', highlight: 'Walking distance to Ooty Lake and Botanical Gardens' },
      { name: 'Sterling Ooty Elk Hill', area: 'Havelock Road', rating: 4.2, reviews: 2120, type: 'Hill resort', price: '₹₹', highlight: 'Pine-tree slopes, family-friendly, cottage rooms' },
      { name: 'Greenwoods Resort', area: 'Coonoor', rating: 4.4, reviews: 940, type: 'Plantation stay', price: '₹₹', highlight: 'Tea-estate views, walking trails through the gardens' },
    ],
  },

  hampi: {
    tagline: 'A lost empire frozen in stone — boulders, ruins, and the ghost of Vijayanagara',
    famousFor: ['Vijayanagara Empire Ruins', 'Giant Boulders', 'Virupaksha Temple', 'Stone Chariot', 'Hippie Island', 'Rock Climbing', 'UNESCO Heritage'],
    attractions: [
      { name: 'Virupaksha Temple', desc: 'A 7th-century living temple with a 50m tower — its reflection on the Tungabhadra River creates a perfect upside-down image still worshipped daily.' },
      { name: 'Vittala Temple & Stone Chariot', desc: 'The crowning achievement of Vijayanagara architecture — a stone chariot (rath) with rotating stone wheels, printed on the Indian 50-rupee note.' },
      { name: 'Hampi Bazaar', desc: 'A 1km-long ancient royal market boulevard lined with the ruins of once-wealthy merchant stalls and pavilions, stretching from the Virupaksha temple.' },
      { name: 'Matanga Hill', desc: 'The highest point in Hampi — legendary as the spot where Hanuman was born. Sunrise from the top over 36 sqkm of ruins and boulders is extraordinary.' },
      { name: 'Hippie Island (Virupapur Gaddi)', desc: 'A river island reached by coracle boat that has been a backpacker haven since the 1980s, with cafes, yoga, and hammocks strung between coconut palms.' },
    ],
    history: [
      'Hampi was the capital of the Vijayanagara Empire (1336–1646), one of the greatest Hindu empires — at its peak, the second-largest city in the world after Beijing with 500,000 people.',
      'The Portuguese chronicler Domingo Paes described Hampi in 1520 as "as large as Rome" with streets full of rubies and diamonds sold by the kilo.',
      'In 1565, a coalition of five Deccan Sultanates defeated Vijayanagara at the Battle of Talikota. For 6 months they looted and demolished the city, leaving it as ruins forever.',
      'Hampi was "rediscovered" by British surveyor Colonel Colin Mackenzie in 1800 and declared a UNESCO World Heritage Site in 1986.',
    ],
    bestTime: { period: 'October–February', reason: 'Cool and pleasant (20–30°C). Summer (Mar–Jun) is brutally hot (40°C+) with burning boulders. Monsoon (Jul–Sep) brings some rain but fewer crowds.' },
    quickFacts: { language: 'Kannada, Hindi, English', currency: 'Indian Rupee (₹)', capital: 'Ancient capital of Vijayanagara Empire', knownAs: 'City of Ruins', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Jolada Rotti (sorghum bread)', 'Obbattu (sweet flatbread)', 'Bisi Bele Bath', 'Banana Leaf Meals', 'Tungabhadra fresh fish', 'Holige'],
    stays: [
      { name: 'Evolve Back Hampi', area: 'Kamalapura', rating: 4.8, reviews: 1840, type: 'Luxury heritage resort', price: '₹₹₹₹', highlight: 'Vijayanagara-inspired architecture, private pool villas' },
      { name: 'Hyatt Place Hampi', area: 'Kaddirampura', rating: 4.5, reviews: 1240, type: 'Mid-range hotel', price: '₹₹₹', highlight: 'Modern comforts close to the ruins, large outdoor pool' },
      { name: 'Hampi\'s Boulders', area: 'Narayanapet', rating: 4.5, reviews: 740, type: 'Eco riverside resort', price: '₹₹₹', highlight: 'Tungabhadra river beachfront, sloth-bear sanctuary nearby' },
      { name: 'Padma Guest House', area: 'Hampi Bazaar', rating: 4.4, reviews: 1320, type: 'Budget guesthouse', price: '₹', highlight: 'Family-run, rooftop with Virupaksha temple gopuram view' },
    ],
  },

  varanasi: {
    tagline: 'The world\'s oldest continuously inhabited city — where life, death, and the Ganges meet',
    famousFor: ['Ganga Aarti', 'Ghats', 'Silk Weaving', 'Kashi Vishwanath Temple', 'Oldest Living City', 'Cremation Ghats', 'Banarasi Culture'],
    attractions: [
      { name: 'Dashashwamedh Ghat', desc: 'The main ghat and epicentre of the spectacular nightly Ganga Aarti ceremony — 300 priests raise fire lamps in synchronized ritual from 7pm every evening.' },
      { name: 'Manikarnika Ghat', desc: 'The eternal cremation ground burning 24/7 for 3,000 years — over 100 bodies are cremated daily as Varanasi is believed to grant moksha (liberation) to those who die here.' },
      { name: 'Kashi Vishwanath Temple', desc: 'The holiest Shiva temple on Earth — one of the 12 Jyotirlingas. The current temple was rebuilt by Ahilya Bai Holkar in 1780 with 800kg of gold on its spires.' },
      { name: 'Sarnath', desc: 'Just 10km away, where the Buddha gave his first sermon after enlightenment in 528 BC — the Dhamek Stupa marks the exact spot.' },
      { name: 'Early Morning Boat Ride', desc: 'A dawn row past 84 ghats is Varanasi\'s defining experience — fog, burning pyres, bathers, and marigold offerings create an otherworldly atmosphere.' },
    ],
    history: [
      'Varanasi is at least 3,000 years old — older than ancient Rome, older than the pyramids were to ancient Greeks. Mark Twain called it "older than history, older than tradition."',
      'The city was a centre of Hindu learning for millennia and attracted scholars like Adi Shankaracharya (8th century) and Kabir (15th century).',
      'Mughal Emperor Aurangzeb destroyed the original Kashi Vishwanath Temple in 1669 and built a mosque (Gyanvapi) on its ruins — still a legal and religious dispute today.',
      'Varanasi\'s Banarasi silk weaving industry, famous for gold-thread saris, dates back at least 600 years and is slowly being threatened by power loom competition.',
    ],
    bestTime: { period: 'October–March', reason: 'Cool and pleasant weather for ghats and temple visits. Summer (Apr–Jun) is extremely hot and humid. Monsoon (Jul–Sep) brings heavy rain and flooding of lower ghats.' },
    quickFacts: { language: 'Hindi, Bhojpuri', currency: 'Indian Rupee (₹)', capital: 'Sacred city of Uttar Pradesh', knownAs: 'Kashi / City of Light / Benares', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Banarasi Paan', 'Kachori Sabzi', 'Thandai (bhang lassi)', 'Malaiyo (winter dessert)', 'Baati Chokha', 'Tamatar Chaat'],
    stays: [
      { name: 'BrijRama Palace', area: 'Darbhanga Ghat', rating: 4.7, reviews: 1840, type: 'Heritage palace on the ghat', price: '₹₹₹₹', highlight: 'Restored 1812 palace, only ghat-front heritage hotel, boat-only entry on busy days' },
      { name: 'Taj Ganges', area: 'Cantonment', rating: 4.5, reviews: 3120, type: 'Luxury hotel', price: '₹₹₹₹', highlight: '40 acres of gardens, peacocks, away from old-city chaos' },
      { name: 'Suryauday Haveli', area: 'Shivala Ghat', rating: 4.5, reviews: 940, type: 'Boutique heritage', price: '₹₹₹', highlight: 'Restored Nepali king\'s residence, unobstructed Ganga view from rooftop' },
      { name: 'Stops Varanasi', area: 'Brahma Ghat', rating: 4.3, reviews: 1240, type: 'Hostel', price: '₹', highlight: 'Old-city alleys, walking distance to Manikarnika and aarti ghats' },
    ],
  },

  ayodhya: {
    tagline: 'The birthplace of Lord Ram — one of the seven sacred cities of Hinduism',
    famousFor: ['Ram Janmabhoomi', 'Ram Mandir', 'Sarayu River Ghats', 'Deepotsav Festival', 'Kanak Bhawan', 'Ancient Temples', '500-year Legal Case'],
    attractions: [
      { name: 'Ram Mandir', desc: 'The grand new temple inaugurated in January 2024 on the birthplace of Lord Ram, ending a 500-year dispute. Its architecture fuses Nagara style with modern engineering.' },
      { name: 'Kanak Bhawan', desc: 'A richly decorated temple gifted by Queen Kaikeyi to Sita and Ram as a wedding gift — the divine couple\'s private palace, now rebuilt in pink sandstone.' },
      { name: 'Sarayu Ghat', desc: 'The sacred river where Ram is believed to have attained samadhi. Evening aarti here mirrors the Ganga Aarti of Varanasi in its spiritual atmosphere.' },
      { name: 'Hanuman Garhi', desc: 'A 10th-century fort-temple to Hanuman at the centre of town — pilgrims climb 76 steps to the summit for panoramic views over the holy city.' },
    ],
    history: [
      'Ayodhya is one of Hinduism\'s seven sacred moksha-giving cities (Sapta Puri), with religious significance stretching back over 9,000 years according to the Ramayana.',
      'The Babri Masjid, built in 1528 by Babur\'s general Mir Baqi on the claimed site of Ram\'s birthplace, stood for 464 years until it was demolished by a mob on December 6, 1992.',
      'The Supreme Court of India settled the Ayodhya dispute in November 2019 after decades of litigation, awarding the disputed land for a Hindu temple.',
      'PM Narendra Modi consecrated the Ram Mandir on January 22, 2024 — the day was declared a national celebration with fireworks across every Indian city.',
    ],
    bestTime: { period: 'October–March', reason: 'Pleasant weather for temple visits. Deepotsav (Diwali) in October–November sees lakhs of lamps lit along Sarayu Ghat, making it one of India\'s most spectacular festivals.' },
    quickFacts: { language: 'Hindi, Awadhi', currency: 'Indian Rupee (₹)', capital: 'Sacred city of Uttar Pradesh', knownAs: 'Birthplace of Lord Ram', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Awadhi Biryani', 'Nihari', 'Sheermal', 'Shahi Tukda', 'Panjeeri Ladoo', 'Ram Ladoo'],
    stays: [
      { name: 'Taj Vivanta Ayodhya', area: 'Faizabad-Ayodhya Road', rating: 4.5, reviews: 920, type: 'Luxury hotel', price: '₹₹₹₹', highlight: 'Newly opened post-Mandir consecration, 10 min to Ram Mandir' },
      { name: 'Ramayana Hotel', area: 'Naya Ghat', rating: 4.3, reviews: 640, type: 'Mid-range temple-themed', price: '₹₹', highlight: 'Walking distance to Sarayu aarti, on-site Ramayana museum' },
      { name: 'Hotel Krinoman', area: 'Civil Lines', rating: 4.2, reviews: 480, type: 'Budget hotel', price: '₹', highlight: 'Family-run, 5 min from Hanuman Garhi' },
      { name: 'The Lalit Mahal', area: 'Naya Ghat', rating: 4.4, reviews: 380, type: 'Boutique hotel', price: '₹₹₹', highlight: 'Sarayu river views, vegetarian-only kitchen, daily aarti shuttle' },
    ],
  },

  mahabaleshwar: {
    tagline: 'Maharashtra\'s misty crown — strawberries, viewpoints, and colonial tranquillity',
    famousFor: ['Strawberry Farms', 'Arthur\'s Seat Viewpoint', 'Misty Weather', 'British Hill Station', 'Panchgani Tablelands', 'Venna Lake', 'Mapro Garden'],
    attractions: [
      { name: 'Arthur\'s Seat', desc: 'The "Queen of Points" — a dramatic cliff overlooking the Konkan coast 1,340m below, from which you can spot the Savitri River, Rajapuri, and on clear days, the Arabian Sea.' },
      { name: 'Venna Lake', desc: 'A serene 28-acre artificial lake in the middle of town — rowboats, horse rides along the shore, and a lakeside strawberry market.' },
      { name: 'Mapro Garden', desc: 'Home of the famous Mapro strawberry products — a garden-café where the strawberry crush and fresh strawberry milkshake are non-negotiable.' },
      { name: 'Panchgani', desc: '18km away, a sister hill station with the spectacular 95-acre Table Land plateau (Asia\'s second largest volcanic plateau) and colonial bungalows.' },
      { name: 'Lingmala Waterfall', desc: 'A two-tiered 600ft waterfall visible from a viewing platform 3km from town — most dramatic during and just after monsoon.' },
    ],
    history: [
      'Mahabaleshwar derives its name from the Mahabali (Mahabaleshwar) temple, one of the five sacred sources of the Krishna River flowing from a cow\'s mouth.',
      'Sir John Malcolm, Governor of Bombay, first visited in 1828 and recognized its potential as a hill station — he declared it the summer capital of Bombay Presidency.',
      'The town has 40 viewpoints named in colonial style — Wilson, Arthur\'s Seat, Kate\'s Point — many named after British officials and their families.',
    ],
    bestTime: { period: 'October–June', reason: 'Pleasant weather year-round except monsoon (June–September) when the town receives 600cm of rain and roads become treacherous.' },
    quickFacts: { language: 'Marathi, Hindi', currency: 'Indian Rupee (₹)', capital: 'District of Satara, Maharashtra', knownAs: 'Strawberry Capital of India', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Fresh Strawberries & Cream', 'Mapro Strawberry Crush', 'Kanda Bhaji', 'Misal Pav', 'Corn on the Cob (roadside)', 'Amrakhand'],
    stays: [
      { name: 'Le Meridien Mahabaleshwar Resort & Spa', area: 'Frederick Road', rating: 4.5, reviews: 1840, type: 'Luxury resort', price: '₹₹₹₹', highlight: 'Heated indoor pool, valley-view villas, full Explore Spa' },
      { name: 'Evershine Resort', area: 'Mahabaleshwar–Panchgani Road', rating: 4.4, reviews: 1240, type: 'Family resort', price: '₹₹₹', highlight: 'Strawberry-themed kids zone, large pool, walkable to Panchgani' },
      { name: 'Brightland Resort & Spa', area: 'Pratapsingh Park Road', rating: 4.3, reviews: 1620, type: 'Mid-range', price: '₹₹', highlight: 'Cottages around a courtyard, 5 min to Mall Road' },
      { name: 'The Lakeview Mahabaleshwar', area: 'Venna Lake', rating: 4.2, reviews: 940, type: 'Lakeside hotel', price: '₹₹', highlight: 'Walking distance to Venna Lake boating' },
    ],
  },

  'south korea': {
    tagline: 'K-pop, Confucian temples, and the most connected country on Earth',
    famousFor: ['K-pop & K-drama', 'Samsung & Hyundai', 'Kimchi', 'Plastic Surgery Tourism', 'Buddhist Temples', 'Fastest Internet', 'DMZ'],
    attractions: [
      { name: 'Gyeongbokgung Palace', desc: 'Seoul\'s grandest Joseon-era palace built in 1395 — the Changing of the Guard ceremony in Joseon costumes happens daily at 10am and 2pm.' },
      { name: 'Bukchon Hanok Village', desc: 'A neighbourhood of 900-year-old traditional Korean hanok houses in central Seoul, lived in by real residents despite being a major tourist attraction.' },
      { name: 'Jeju Island', desc: 'A volcanic island with UNESCO-listed lava tubes, the 1,950m Hallasan volcano, and black sand beaches — South Korea\'s version of Hawaii.' },
      { name: 'DMZ (38th Parallel)', desc: 'The most militarized border on Earth — a 4km-wide strip separating North and South Korea, visible from Joint Security Area observation posts.' },
      { name: 'Seoraksan National Park', desc: 'Dramatic granite peaks, Buddhist temples, and autumnal foliage that draws millions each October to watch the mountains turn red and gold.' },
    ],
    history: [
      'Korea\'s history stretches 5,000 years — the Gojoseon kingdom (2333 BC) is traditionally considered its founding, established by the deity Dangun.',
      'The Joseon dynasty ruled for 518 years (1392–1910), making it one of history\'s longest-ruling monarchies, during which Confucianism and Hangul script were established.',
      'Japan annexed Korea in 1910, ruling for 35 years — a period of forced assimilation and cultural suppression that still shapes Korean-Japanese relations today.',
      'South Korea was one of the world\'s poorest countries in 1953 after the Korean War. Its rise to become a top-15 economy in 70 years is called the "Miracle on the Han River."',
    ],
    bestTime: { period: 'March–May & Sep–Nov', reason: 'Spring brings cherry blossoms; autumn brings vivid foliage. Summer is hot and humid with typhoon risk; winter is very cold (-10°C in Seoul).' },
    quickFacts: { language: 'Korean', currency: 'South Korean Won (₩)', capital: 'Seoul', knownAs: 'Land of the Morning Calm', timezone: 'KST (UTC+9)' },
    cuisine: ['Kimchi', 'Korean BBQ (Samgyeopsal)', 'Bibimbap', 'Tteokbokki', 'Ramyeon', 'Japchae', 'Korean Fried Chicken'],
    stays: [
      { name: 'Four Seasons Hotel Seoul', area: 'Jongno-gu', rating: 4.7, reviews: 4120, type: 'Luxury hotel', price: '₩₩₩₩', highlight: 'Walking distance to Gwanghwamun and Gyeongbokgung Palace' },
      { name: 'L7 Myeongdong by Lotte', area: 'Myeongdong', rating: 4.5, reviews: 5640, type: 'Mid-range design hotel', price: '₩₩₩', highlight: 'Rooftop infinity pool with N Seoul Tower view, K-shopping at the door' },
      { name: 'Nostalgia Hanok Stay', area: 'Bukchon Hanok Village', rating: 4.6, reviews: 820, type: 'Traditional hanok', price: '₩₩₩', highlight: 'Sleep on heated ondol floors in a 100-year-old courtyard home' },
      { name: 'K-Guesthouse Insadong 5', area: 'Insadong', rating: 4.4, reviews: 1640, type: 'Budget guesthouse', price: '₩', highlight: 'Walkable to Changdeokgung, near Insadong tea-house alleys' },
    ],
  },

  vietnam: {
    tagline: 'A thousand years of history, from Hanoi\'s ancient streets to Saigon\'s neon energy',
    famousFor: ['Halong Bay', 'Pho', 'Cu Chi Tunnels', 'Hoi An Lanterns', 'Motorbike Culture', 'War History', 'World\'s Best Coffee'],
    attractions: [
      { name: 'Halong Bay', desc: 'A UNESCO World Heritage site of 1,969 limestone karsts rising from emerald water over 1,500 sqkm — best explored on overnight junks.' },
      { name: 'Hoi An Ancient Town', desc: 'A UNESCO-listed merchant port unchanged since the 15th century, famous for its illuminated lanterns, tailors, and French-Vietnamese fusion cuisine.' },
      { name: 'Cu Chi Tunnels', desc: 'A 250km network of underground tunnels used by Viet Cong fighters during the Vietnam War — visitors can crawl through sections that held kitchens, hospitals, and command rooms.' },
      { name: 'Phong Nha-Ke Bang Caves', desc: 'Home to Son Doong — the world\'s largest cave by volume, big enough to contain a jungle and river inside, discovered only in 2009.' },
      { name: 'Mekong Delta', desc: 'The "Rice Bowl of Vietnam" — a maze of rivers, floating markets, and stilt houses where life revolves entirely around the river from dawn to dusk.' },
    ],
    history: [
      'Vietnam was under Chinese rule for over 1,000 years (111 BC–939 AD), yet preserved its distinct language, culture, and national identity throughout.',
      'The Trưng Sisters (40 AD) are Vietnam\'s greatest national heroes — two women who led a rebellion against Chinese rule and briefly ruled as queens.',
      'France colonized Vietnam in the 1850s–1880s, introducing baguettes, coffee culture, and pho (a French-Vietnamese hybrid of pot-au-feu and rice noodles).',
      'The Vietnam War ended with North Vietnamese victory on April 30, 1975 — "Reunification Day" — after 20 years, 3 million Vietnamese deaths, and 58,000 American casualties.',
    ],
    bestTime: { period: 'Nov–Apr (varies by region)', reason: 'North Vietnam: Oct–Apr (dry and cool). Central: Feb–Jul (least rain). South: Dec–Apr (dry season). The country spans 1,650km so weather varies dramatically.' },
    quickFacts: { language: 'Vietnamese', currency: 'Vietnamese Dong (₫)', capital: 'Hanoi', knownAs: 'Land of the Blue Dragon', timezone: 'ICT (UTC+7)' },
    cuisine: ['Phở (beef noodle soup)', 'Bánh Mì', 'Bún Bò Huế', 'Cao Lầu', 'Gỏi Cuốn (fresh spring rolls)', 'Cà Phê Trứng (egg coffee)'],
    stays: [
      { name: 'Sofitel Legend Metropole Hanoi', area: 'Old Quarter, Hanoi', rating: 4.7, reviews: 5320, type: 'Heritage colonial luxury', price: '$$$$', highlight: 'Built 1901 — hosted Charlie Chaplin and Graham Greene; rumoured wartime bomb shelter under the bar' },
      { name: 'Anantara Hoi An Resort', area: 'Hoi An', rating: 4.6, reviews: 2840, type: 'Riverside resort', price: '$$$', highlight: 'Thu Bon River views, walking distance to Ancient Town lanterns' },
      { name: 'Bhaya Classic Cruise', area: 'Halong Bay', rating: 4.5, reviews: 1320, type: 'Overnight junk boat', price: '$$$', highlight: 'Cabin with private balcony among the limestone karsts' },
      { name: 'The Common Room Project', area: 'Old Quarter, Hanoi', rating: 4.5, reviews: 1840, type: 'Boutique hostel', price: '$', highlight: 'Café-rooftop, walking distance to Hoan Kiem Lake' },
    ],
  },

  switzerland: {
    tagline: 'The roof of Europe — precision watches, alpine meadows, and perfect chocolate',
    famousFor: ['Swiss Alps', 'Matterhorn', 'Luxury Watches', 'Chocolate & Cheese', 'Banking Secrecy', 'Neutrality', 'Glacier Express Train'],
    attractions: [
      { name: 'The Matterhorn', desc: 'The most photographed mountain on Earth — its perfect pyramid shape soaring to 4,478m above Zermatt has appeared on Toblerone packaging since 1908.' },
      { name: 'Jungfrau (Top of Europe)', desc: 'A UNESCO site at 3,454m with a viewing platform, ice palace, and 360° views of the Bernese Oberland — reached by the world\'s highest cog railway (1912).' },
      { name: 'Lake Geneva (Lac Léman)', desc: 'Europe\'s largest Alpine lake — a crescent of turquoise water lined with medieval castles, vineyards, and the palatial hotels of Lausanne and Montreux.' },
      { name: 'Lucerne', desc: 'Switzerland\'s most photogenic city — the wooden Chapel Bridge (1333) over Lake Lucerne is Europe\'s oldest covered bridge, still largely intact.' },
      { name: 'Glacier Express', desc: 'The world\'s slowest express train — 8 hours and 291 bridges between Zermatt and St. Moritz through some of Europe\'s most dramatic mountain scenery.' },
    ],
    history: [
      'Switzerland\'s Old Confederation dates to 1291, making it one of the world\'s oldest democracies — Swiss National Day celebrates the Federal Charter of that year.',
      'Switzerland has maintained armed neutrality since 1815, surviving both World Wars intact — a policy that helped it become the world\'s banking centre.',
      'The Red Cross was founded in Geneva in 1863 by Henri Dunant, horrified by the 40,000 casualties he witnessed at the Battle of Solferino in 1859.',
      'Switzerland has four national languages (German, French, Italian, Romansh) and is the only country with a square national flag (plus the Vatican).',
    ],
    bestTime: { period: 'June–Sep & Dec–Mar', reason: 'Summer for hiking and lake swimming; winter for skiing. Spring and autumn are beautiful but mountain passes may be closed.' },
    quickFacts: { language: 'German, French, Italian, Romansh', currency: 'Swiss Franc (CHF)', capital: 'Bern', knownAs: 'Land of Milk and Honey', timezone: 'CET (UTC+1)' },
    cuisine: ['Fondue', 'Raclette', 'Rösti', 'Zürcher Geschnetzeltes', 'Bircher Muesli', 'Swiss Chocolate', 'Älplermagronen'],
    stays: [
      { name: 'The Omnia', area: 'Zermatt', rating: 4.8, reviews: 940, type: 'Mountain design hotel', price: 'CHF CHF CHF CHF', highlight: 'Carved into a rock above Zermatt, Matterhorn from every window' },
      { name: 'Bürgenstock Hotel', area: 'Lake Lucerne', rating: 4.7, reviews: 1640, type: 'Luxury cliffside resort', price: 'CHF CHF CHF CHF', highlight: 'Cliff-edge infinity pool 500m above Lake Lucerne' },
      { name: 'Hotel Schweizerhof Bern', area: 'Bern Old Town', rating: 4.6, reviews: 1240, type: 'Heritage city hotel', price: 'CHF CHF CHF', highlight: 'Steps from the train station, walkable to Zytglogge clock tower' },
      { name: 'Youth Hostel Interlaken', area: 'Interlaken', rating: 4.4, reviews: 2840, type: 'Hostel', price: 'CHF', highlight: 'Modern hostel between two lakes, perfect base for Jungfrau day trips' },
    ],
  },

  austria: {
    tagline: 'Mozart, Habsburgs, and the café culture that changed the world',
    famousFor: ['Classical Music', 'Schönbrunn Palace', 'Vienna Coffeehouse', 'Arnold Schwarzenegger', 'The Sound of Music', 'Skiing', 'Sachertorte'],
    attractions: [
      { name: 'Schönbrunn Palace', desc: 'The Habsburgs\' 1,441-room summer residence with 40 rooms open to visitors — the yellow Baroque palace and French gardens are Vienna\'s most visited landmark.' },
      { name: 'Vienna State Opera', desc: 'One of the world\'s leading opera houses, built in 1869. Its New Year\'s Concert is broadcast to 90 countries and watched by 50 million people annually.' },
      { name: 'Hallstatt', desc: 'A lakeside village so picture-perfect it was copied exactly in China — 67 historic buildings crammed onto a narrow strip between salt mountain and lake.' },
      { name: 'Salzburg', desc: 'Mozart\'s birthplace and filming location of The Sound of Music — the medieval fortress, Baroque churches, and Getreidegasse cobblestones are just as seen in the film.' },
    ],
    history: [
      'The Habsburg dynasty ruled Austria for 640 years (1278–1918), creating an empire that at its peak encompassed modern-day Austria, Hungary, Czech Republic, Croatia, and more.',
      'Vienna was the cultural capital of Europe in the late 19th century — Freud, Klimt, Mahler, Brahms, and Wittgenstein all lived and worked here simultaneously.',
      'The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914 triggered WWI, ultimately destroying the Habsburg Empire that had lasted 6 centuries.',
      'Adolf Hitler was born in Braunau am Inn, Austria, and was famously rejected twice by the Vienna Academy of Fine Arts before turning to politics.',
    ],
    bestTime: { period: 'April–May & Sep–Oct', reason: 'Mild weather, fewer crowds, and spring blossoms around Schönbrunn. Christmas markets (Nov–Dec) are magical. Summer is busy but lively with outdoor concerts.' },
    quickFacts: { language: 'German', currency: 'Euro (€)', capital: 'Vienna', knownAs: 'Land of Music', timezone: 'CET (UTC+1)' },
    cuisine: ['Wiener Schnitzel', 'Sachertorte', 'Tafelspitz', 'Kaiserschmarrn', 'Apfelstrudel', 'Melange (Viennese coffee)', 'Leberkäse'],
    stays: [
      { name: 'Hotel Sacher Wien', area: 'Innere Stadt, Vienna', rating: 4.7, reviews: 3640, type: 'Heritage palace hotel', price: '€€€€', highlight: 'Home of the original Sachertorte, opposite the State Opera' },
      { name: 'Hotel Imperial', area: 'Kärntner Ring, Vienna', rating: 4.7, reviews: 1840, type: 'Luxury heritage', price: '€€€€', highlight: 'Built 1863 as a Württemberg palace, butler service in every suite' },
      { name: 'Hotel Sacher Salzburg', area: 'Salzburg Old Town', rating: 4.6, reviews: 1240, type: 'Heritage hotel', price: '€€€€', highlight: 'Salzach river-front, view of Hohensalzburg fortress' },
      { name: 'Wombats City Hostel Vienna', area: 'Mariahilf', rating: 4.4, reviews: 4920, type: 'Hostel', price: '€', highlight: 'Modern dorms 5 min from Westbahnhof, in-house café' },
    ],
  },
  azerbaijan: {
    tagline: 'The Land of Fire — where East meets West at the crossroads of ancient civilisations',
    famousFor: ['Eternal Flames', 'Old City Baku', 'Caspian Sea', 'Mud Volcanoes', 'Silk Road Heritage', 'Pomegranates', 'Carpet Weaving'],
    attractions: [
      { name: 'Baku Old City (İçərişəhər)', desc: 'A UNESCO World Heritage walled city with 12th-century ramparts, the Maiden Tower, and the Palace of the Shirvanshahs — the heart of ancient Baku.' },
      { name: 'Yanar Dağ (Burning Mountain)', desc: 'A natural gas fire that has burned continuously on a hillside since ancient times, inspiring the Zoroastrian reverence for Azerbaijan as the "Land of Fire".' },
      { name: 'Flame Towers', desc: 'Baku\'s modern skyline icon — three skyscrapers clad in LEDs that ripple with flame animations visible from across the city at night.' },
      { name: 'Gobustan National Park', desc: 'Over 6,000 rock engravings dating back 40,000 years alongside 400 mud volcanoes — a surreal lunar landscape UNESCO World Heritage site.' },
      { name: 'Sheki Khan\'s Palace', desc: 'An 18th-century summer palace covered floor-to-ceiling in intricate stained glass (şebeke) and frescoes, built without a single nail.' },
    ],
    history: [
      'Azerbaijan sits on one of the world\'s oldest oil fields — oil has been extracted here since the 3rd century BC, and Baku\'s oil boom in the 1870s made it the world\'s oil capital.',
      'The country was the first Muslim-majority democratic republic in the world, founded briefly in 1918 before Soviet annexation in 1920.',
      'Azerbaijan was part of the Silk Road for over a millennium, serving as a bridge between Europe, Persia, Central Asia, and China.',
      'The ancient Zoroastrian fire temples here drew pilgrims across the ancient world — natural gas seeps caused flames to emerge spontaneously from the ground.',
    ],
    bestTime: { period: 'April–June & Sep–November', reason: 'Spring brings wildflowers to the Caucasus mountains; autumn is warm and clear. Summers are hot in Baku but cool in the highlands.' },
    quickFacts: { language: 'Azerbaijani', currency: 'Azerbaijani Manat (₼)', capital: 'Baku', knownAs: 'Land of Fire', timezone: 'AZT (UTC+4)' },
    cuisine: ['Plov (Saffron Rice)', 'Dolma', 'Kebab', 'Dushbara (Dumplings)', 'Pomegranate Dishes', 'Baklava', 'Black Tea with Jam'],
    stays: [
      { name: 'Four Seasons Hotel Baku', area: 'Neftchilar Avenue', rating: 4.7, reviews: 1840, type: 'Luxury hotel', price: '₼₼₼₼', highlight: 'Caspian Sea views, walking distance to Old City' },
      { name: 'Fairmont Baku at Flame Towers', area: 'Mehdi Huseyn Street', rating: 4.6, reviews: 2640, type: 'Iconic luxury hotel', price: '₼₼₼₼', highlight: 'Inside the southern Flame Tower, panoramic city and bay views' },
      { name: 'Sahil Hostel & Hotel', area: 'Old City', rating: 4.5, reviews: 1240, type: 'Boutique mid-range', price: '₼₼', highlight: 'Steps from Maiden Tower, hot Azerbaijani breakfast included' },
      { name: 'Marxal Resort & Spa', area: 'Sheki', rating: 4.6, reviews: 940, type: 'Mountain resort', price: '₼₼₼', highlight: 'Caucasus mountain backdrop, walking distance to Sheki Khan\'s Palace' },
    ],
  },

  australia: {
    tagline: 'The wide brown land — ancient wilderness, world-class cities, and the Great Barrier Reef',
    famousFor: ['Great Barrier Reef', 'Sydney Opera House', 'Uluru', 'Kangaroos & Koalas', 'Outback', 'Surfing', 'Aboriginal Culture', 'Cricket'],
    attractions: [
      { name: 'Great Barrier Reef', desc: 'The world\'s largest coral reef system — 2,300km of living structure visible from space, home to 1,500 species of fish and 4,000 types of mollusc.' },
      { name: 'Sydney Opera House', desc: 'Jørn Utzon\'s 1973 masterpiece — one of the most recognisable buildings on earth, hosting over 1,500 performances a year on Sydney Harbour.' },
      { name: 'Uluru (Ayers Rock)', desc: 'A sacred sandstone monolith rising 348m from the flat desert — changes colour from ochre to deep crimson at sunrise and sunset. Owned by the Anangu people.' },
      { name: 'The Twelve Apostles', desc: 'Dramatic limestone stacks rising from the Southern Ocean along the Great Ocean Road in Victoria — one of Australia\'s most photographed landscapes.' },
      { name: 'Daintree Rainforest', desc: 'The world\'s oldest tropical rainforest at 180 million years old, where ancient ferns meet the Coral Sea in Far North Queensland.' },
    ],
    history: [
      'Aboriginal Australians have lived on the continent for at least 65,000 years — the oldest continuous culture on Earth — with over 500 distinct language groups.',
      'Britain established the first European settlement at Sydney Cove in 1788 as a penal colony, initially transporting 162,000 convicts over 80 years.',
      'The Gold Rush of 1851 transformed Australia from a penal backwater into a prosperous nation, tripling the population in a decade.',
      'Australia federated as a nation on 1 January 1901, becoming one of the first countries in the world to grant women the right to vote (1902).',
    ],
    bestTime: { period: 'Sep–Nov & Mar–May', reason: 'Spring and autumn avoid extreme summer heat in the south and the tropical wet season in the north. Queensland\'s Great Barrier Reef is best June–October.' },
    quickFacts: { language: 'English', currency: 'Australian Dollar (A$)', capital: 'Canberra', knownAs: 'Land Down Under', timezone: 'Multiple (AEST UTC+10 to AWST UTC+8)' },
    cuisine: ['Vegemite on Toast', 'Barramundi', 'Meat Pie', 'Tim Tams', 'Pavlova', 'Lamington', 'Flat White Coffee', 'BBQ Shrimp'],
    stays: [
      { name: 'Park Hyatt Sydney', area: 'The Rocks, Sydney', rating: 4.8, reviews: 2640, type: 'Luxury harbourfront', price: 'A$ A$ A$ A$', highlight: 'Direct view of the Opera House and Harbour Bridge from every room' },
      { name: 'QT Sydney', area: 'Market Street, CBD', rating: 4.6, reviews: 3120, type: 'Boutique design hotel', price: 'A$ A$ A$', highlight: 'Heritage State Theatre building, quirky Australian art throughout' },
      { name: 'Longitude 131°', area: 'Uluru', rating: 4.9, reviews: 480, type: 'Luxury desert tents', price: 'A$ A$ A$ A$', highlight: 'All-inclusive luxury tents with panoramic views of Uluru sunrise' },
      { name: 'YHA Sydney Harbour', area: 'The Rocks', rating: 4.5, reviews: 4820, type: 'Hostel', price: 'A$', highlight: 'Rooftop with iconic Opera House view, on-site Big Dig Archaeology Centre' },
    ],
  },

  egypt: {
    tagline: 'Mother of the World — 5,000 years of civilisation along the eternal Nile',
    famousFor: ['Pyramids of Giza', 'Sphinx', 'Nile River', 'Pharaohs', 'Hieroglyphics', 'Luxor Temples', 'Red Sea Diving', 'Mummies'],
    attractions: [
      { name: 'Great Pyramid of Giza', desc: 'Built around 2560 BC for Pharaoh Khufu — the only surviving wonder of the ancient world, standing 138m tall and constructed from 2.3 million stone blocks.' },
      { name: 'The Sphinx', desc: 'A 73-metre limestone statue with the body of a lion and the face of a pharaoh, carved around 2500 BC and still guarding the Giza plateau after 4,500 years.' },
      { name: 'Valley of the Kings', desc: 'The royal necropolis on Luxor\'s west bank where 63 tombs of New Kingdom pharaohs were carved into the limestone cliffs, including Tutankhamun\'s.' },
      { name: 'Karnak Temple Complex', desc: 'The world\'s largest religious complex — a 2km processional avenue of sphinxes leads to colossal hypostyle halls with 134 massive columns, built over 2,000 years.' },
      { name: 'Abu Simbel', desc: 'Two massive rock temples built by Ramesses II around 1264 BC, relocated in the 1960s in an extraordinary UNESCO engineering project to save them from Lake Nasser.' },
    ],
    history: [
      'Ancient Egyptian civilisation lasted over 3,000 years — longer than the time between the fall of Rome and today — unified under pharaohs from 3100 BC.',
      'The ancient Egyptians invented writing (hieroglyphics around 3200 BC), the 365-day calendar, and made foundational advances in medicine and mathematics.',
      'Cleopatra VII, the last active pharaoh, was not Egyptian by blood — she was Macedonian Greek, the descendant of one of Alexander the Great\'s generals.',
      'Egypt was under Greek, Roman, Arab, Ottoman, and British rule across the centuries before gaining independence in 1952 under Gamal Abdel Nasser.',
    ],
    bestTime: { period: 'October–April', reason: 'Winter months are pleasantly warm (20–25°C) for sightseeing. Summer temperatures can exceed 45°C in Luxor and Aswan. The Red Sea coast is good year-round.' },
    quickFacts: { language: 'Arabic', currency: 'Egyptian Pound (E£)', capital: 'Cairo', knownAs: 'Gift of the Nile', timezone: 'EET (UTC+2)' },
    cuisine: ['Koshari', 'Ful Medames', 'Molokhia', 'Hawawshi', 'Om Ali (Bread Pudding)', 'Baklava', 'Sugarcane Juice', 'Karkade (Hibiscus Tea)'],
    stays: [
      { name: 'Marriott Mena House', area: 'Giza', rating: 4.6, reviews: 8420, type: 'Heritage palace hotel', price: 'E£E£E£E£', highlight: 'Built 1869, the only hotel with the Great Pyramids in the back garden' },
      { name: 'Four Seasons Hotel Cairo at Nile Plaza', area: 'Garden City, Cairo', rating: 4.7, reviews: 5240, type: 'Luxury hotel', price: 'E£E£E£E£', highlight: 'Direct Nile views, walking distance to Egyptian Museum' },
      { name: 'Sofitel Winter Palace', area: 'Luxor', rating: 4.5, reviews: 1840, type: 'Heritage Nile hotel', price: 'E£E£E£', highlight: 'Built 1886, where Agatha Christie wrote Death on the Nile, opposite Luxor Temple' },
      { name: 'Dahab Paradise', area: 'Dahab, Sinai', rating: 4.6, reviews: 740, type: 'Beach hotel', price: 'E£E£', highlight: 'Red Sea snorkelling at the door, walking distance to Blue Hole dive site' },
    ],
  },

  srilanka: {
    tagline: 'The Pearl of the Indian Ocean — ancient temples, misty tea hills, and pristine beaches',
    famousFor: ['Tea Plantations', 'Ancient Ruins', 'Elephants', 'Whale Watching', 'Sigiriya Rock', 'Ayurveda', 'Spice Gardens', 'Surf Beaches'],
    attractions: [
      { name: 'Sigiriya (Lion\'s Rock)', desc: 'A 5th-century rock fortress rising 200m from the jungle — once a royal palace with sky gardens, mirror walls, and stunning frescoes. A UNESCO World Heritage site.' },
      { name: 'Temple of the Sacred Tooth Relic', desc: 'Sri Lanka\'s holiest Buddhist shrine in Kandy, housing a relic of the Buddha\'s tooth. The annual Esala Perahera festival draws hundreds of elephants through the streets.' },
      { name: 'Ella & Nine Arch Bridge', desc: 'A stunning colonial-era stone viaduct in the misty highlands, framed by tea plantations — one of Asia\'s most photographed train journeys passes over it.' },
      { name: 'Yala National Park', desc: 'One of the world\'s best leopard-spotting destinations, also home to elephants, sloth bears, crocodiles, and 200+ bird species in a dramatic landscape of scrub and lagoon.' },
      { name: 'Galle Fort', desc: 'A 16th-century Portuguese and Dutch colonial fortified city on the southern coast — cobblestone streets, Dutch churches, boutique hotels, and sea-facing ramparts.' },
    ],
    history: [
      'Sri Lanka has been continuously inhabited for at least 125,000 years — the ancient Sinhalese kingdom of Anuradhapura ruled from the 4th century BC, rivalling the great empires of Asia.',
      'Buddhism arrived from India in the 3rd century BC, brought by Mahinda, son of Emperor Ashoka — Sri Lanka has been a centre of Theravada Buddhism ever since.',
      'The island was successively colonised by the Portuguese (1505), Dutch (1658), and British (1815), who developed the tea industry that still defines the highlands today.',
      'Sri Lanka gained independence in 1948 and endured a devastating 26-year civil war that ended in 2009, since followed by remarkable recovery and tourism growth.',
    ],
    bestTime: { period: 'Dec–Mar (West & South) / May–Sep (East)', reason: 'Sri Lanka has two monsoon seasons affecting opposite coasts — the west and south are best in winter; the east coast shines in summer.' },
    quickFacts: { language: 'Sinhala & Tamil', currency: 'Sri Lankan Rupee (Rs)', capital: 'Sri Jayawardenepura Kotte', knownAs: 'Pearl of the Indian Ocean', timezone: 'SLST (UTC+5:30)' },
    cuisine: ['Rice & Curry', 'Hoppers (Appa)', 'Kottu Roti', 'String Hoppers', 'Fish Ambul Thiyal', 'Pol Sambol', 'Ceylon Tea', 'King Coconut'],
    stays: [
      { name: 'Cape Weligama', area: 'Weligama, Southern Coast', rating: 4.7, reviews: 1240, type: 'Cliff-top luxury resort', price: 'Rs Rs Rs Rs', highlight: 'Crescent infinity pool over the Indian Ocean, all-villa property' },
      { name: 'Heritance Tea Factory', area: 'Nuwara Eliya', rating: 4.6, reviews: 2840, type: 'Converted tea factory', price: 'Rs Rs Rs Rs', highlight: '1968 tea factory at 6,800 ft, sleep amid working tea estate' },
      { name: 'Galle Fort Hotel', area: 'Galle Fort', rating: 4.5, reviews: 940, type: 'Heritage boutique', price: 'Rs Rs Rs', highlight: 'Restored 17th-century Dutch merchant mansion inside the fort walls' },
      { name: 'Hangover Hostels Hikkaduwa', area: 'Hikkaduwa', rating: 4.5, reviews: 1640, type: 'Beach hostel', price: 'Rs', highlight: 'Beachfront, surf rentals, walking distance to coral sanctuary' },
    ],
  },

  finland: {
    tagline: 'The Land of a Thousand Lakes — Northern Lights, saunas, and the home of Santa Claus',
    famousFor: ['Northern Lights', 'Midnight Sun', 'Saunas', 'Santa Claus Village', 'Reindeer', 'Lakeland', 'Helsinki Design', 'Husky Safaris'],
    attractions: [
      { name: 'Aurora Borealis (Lapland)', desc: 'Finnish Lapland offers some of the world\'s best Northern Lights viewing — on average 200 nights of auroras per year above Rovaniemi and Saariselkä.' },
      { name: 'Santa Claus Village, Rovaniemi', desc: 'The official hometown of Santa Claus, right on the Arctic Circle — husky sledding, reindeer safaris, and glass igloos for sleeping under the stars.' },
      { name: 'Helsinki Market Square & Cathedral', desc: 'The neoclassical white Helsinki Cathedral presides over the harbour market square where locals and visitors browse fresh produce, handicrafts, and Finnish design.' },
      { name: 'Archipelago National Park', desc: 'Over 2,000 islands and islets in the Baltic Sea, accessible by ferry — pristine nature, seal colonies, and traditional fishing villages frozen in time.' },
      { name: 'Nuuksio National Park', desc: 'Ancient forests, clear lakes, and wildlife just 35km from Helsinki — Finland\'s most accessible wilderness, perfect for foraging, swimming, and wildlife spotting.' },
    ],
    history: [
      'Finland was part of Sweden for 600 years (1249–1809), then an autonomous Grand Duchy of Russia until declaring independence on 6 December 1917 — a date still celebrated as Finnish Independence Day.',
      'Finland\'s 1940 Winter War against the Soviet Union — where a tiny nation held off a vastly larger army — became one of history\'s most remarkable military stories.',
      'Finland invented the concept of the modern sauna over 2,000 years ago. There are 3.3 million saunas for a population of 5.5 million people.',
      'Finland consistently ranks first or second in the World Happiness Report, and has the world\'s best education system according to PISA rankings.',
    ],
    bestTime: { period: 'Jun–Aug (Midnight Sun) & Dec–Mar (Northern Lights)', reason: 'Summer offers endless daylight and warm lakes for swimming. Winter (especially February–March) gives the best aurora viewing, snow activities, and Christmas magic.' },
    quickFacts: { language: 'Finnish & Swedish', currency: 'Euro (€)', capital: 'Helsinki', knownAs: 'Land of a Thousand Lakes', timezone: 'EET (UTC+2)' },
    cuisine: ['Salmon Soup', 'Reindeer Stew', 'Karjalanpiirakka (Rye Pasties)', 'Mämmi (Easter Dessert)', 'Leipäjuusto (Bread Cheese)', 'Cloudberry Jam', 'Salmiakki (Salty Liquorice)'],
    stays: [
      { name: 'Kakslauttanen Arctic Resort', area: 'Saariselkä, Lapland', rating: 4.7, reviews: 3640, type: 'Glass igloo resort', price: '€€€€', highlight: 'Sleep under the aurora in heated thermal-glass igloos' },
      { name: 'Hotel Kämp', area: 'Helsinki centre', rating: 4.6, reviews: 1840, type: 'Heritage luxury', price: '€€€€', highlight: 'Built 1887, hosted Finland\'s national poets and Sibelius' },
      { name: 'Arctic TreeHouse Hotel', area: 'Rovaniemi', rating: 4.8, reviews: 1240, type: 'Boutique cabins', price: '€€€€', highlight: 'Hillside cabins facing north, in-room aurora wake-up alarm' },
      { name: 'Hostel Diana Park', area: 'Helsinki centre', rating: 4.4, reviews: 920, type: 'Hostel', price: '€', highlight: 'Walking distance to Senate Square and the harbour' },
    ],
  },

  costarica: {
    tagline: 'Pura Vida — the happiest country on earth, where rainforest meets two oceans',
    famousFor: ['Biodiversity', 'Rainforests', 'Volcanoes', 'Sloths & Toucans', 'Surfing', 'Eco-Tourism', 'Pura Vida Lifestyle', 'Cloud Forests'],
    attractions: [
      { name: 'Arenal Volcano', desc: 'One of the world\'s most active volcanoes — a near-perfect cone rising 1,670m, surrounded by hot springs, zip lines, and cloud forest national park.' },
      { name: 'Manuel Antonio National Park', desc: 'Tiny but mighty — Costa Rica\'s most visited park packs white-sand beaches, squirrel monkeys, sloths, and scarlet macaws into a compact Pacific peninsula.' },
      { name: 'Monteverde Cloud Forest', desc: 'Suspended between the Pacific and Caribbean at 1,500m, this misty forest reserve hosts 2,500 plant species, 400 bird species, and the elusive resplendent quetzal.' },
      { name: 'Tortuguero National Park', desc: 'Accessible only by boat or small plane, this Caribbean jungle channels are home to four sea turtle species that nest on its beaches, including the great leatherback.' },
      { name: 'Corcovado National Park', desc: 'Called "the most biologically intense place on Earth" by National Geographic — 13 ecosystems, jaguars, tapirs, harpy eagles, and all four Costa Rican monkey species.' },
    ],
    history: [
      'Costa Rica was home to indigenous peoples for thousands of years before Columbus landed on his fourth and final voyage in 1502, calling it "Rich Coast" (Costa Rica).',
      'Unlike most of Latin America, Costa Rica abolished its military in 1948 — redirecting defence spending to education and healthcare, making it one of the region\'s most stable democracies.',
      'Costa Rica protects over 25% of its land in national parks and reserves, despite being 0.03% of Earth\'s surface it contains 5% of the world\'s biodiversity.',
      'The country generates over 99% of its electricity from renewable sources — hydroelectric, geothermal, wind, and solar — a global leader in clean energy.',
    ],
    bestTime: { period: 'Dec–April', reason: 'Dry season on the Pacific coast with sunny skies. The Caribbean coast has different patterns — little rain June–July and September–October. Surfers prefer May–November for bigger swells.' },
    quickFacts: { language: 'Spanish', currency: 'Costa Rican Colón (₡)', capital: 'San José', knownAs: 'Rich Coast / Pura Vida Nation', timezone: 'CST (UTC−6)' },
    cuisine: ['Gallo Pinto (Rice & Beans)', 'Casado', 'Ceviche', 'Olla de Carne', 'Tamales', 'Tres Leches Cake', 'Guaro (Sugar Cane Spirit)', 'Fresh Tropical Fruits'],
    stays: [
      { name: 'Nayara Springs', area: 'Arenal Volcano', rating: 4.9, reviews: 1640, type: 'Adults-only luxury resort', price: '$$$$', highlight: 'Private plunge pools fed by hot springs, view of Arenal volcano cone' },
      { name: 'Tabacón Thermal Resort', area: 'La Fortuna', rating: 4.6, reviews: 4820, type: 'Hot-springs resort', price: '$$$$', highlight: 'Volcanic thermal river running through the property' },
      { name: 'Lapa Rios Eco Lodge', area: 'Osa Peninsula', rating: 4.7, reviews: 920, type: 'Eco luxury bungalows', price: '$$$$', highlight: '17 thatched bungalows in a primary rainforest reserve, abundant wildlife from your deck' },
      { name: 'Selina Manuel Antonio', area: 'Manuel Antonio', rating: 4.4, reviews: 1840, type: 'Co-living hostel', price: '$$', highlight: 'Steps to the National Park, surf school and yoga deck' },
    ],
  },

  bhutan: {
    tagline: 'The Last Shangri-La — the world\'s only carbon-negative country measures wealth in happiness',
    famousFor: ['Gross National Happiness', 'Tiger\'s Nest Monastery', 'Dzong Fortresses', 'Pristine Himalayan Nature', 'Archery', 'Buddhist Culture', 'Pristine Environment'],
    attractions: [
      { name: 'Tiger\'s Nest Monastery (Paro Taktsang)', desc: 'Bhutan\'s most iconic landmark — a sacred Buddhist monastery clinging to a sheer cliff 900m above the Paro Valley, reachable only by foot or mule.' },
      { name: 'Punakha Dzong', desc: 'A fortress-monastery at the confluence of two rivers, considered Bhutan\'s most beautiful dzong, with whitewashed walls, golden roofs, and remarkable frescoes.' },
      { name: 'Dochula Pass', desc: 'A 3,100m mountain pass blanketed in prayer flags and 108 memorial chortens, offering panoramic Himalayan views including Bhutan\'s highest peaks on clear days.' },
      { name: 'Haa Valley', desc: 'A remote, pristine valley only opened to tourists in 2002, dotted with ancient lhakhangs (temples) and yak herders against a backdrop of soaring peaks.' },
      { name: 'Bumthang Cultural Valley', desc: 'Bhutan\'s spiritual heartland — a cluster of four valleys containing some of the kingdom\'s oldest temples, including Jambay Lhakhang (7th century AD).' },
    ],
    history: [
      'Bhutan was unified in 1616 by the Tibetan Buddhist master Zhabdrung Ngawang Namgyal, who built the distinctive dzong fortress-monastery system across the country.',
      'Bhutan is one of the few countries in South Asia never colonised by a European power, maintaining its sovereignty by playing British and Tibetan interests against each other.',
      'The country transitioned from an absolute monarchy to a constitutional monarchy in 2008, with the 5th King Jigme Khesar Namgyel Wangchuck voluntarily introducing democracy.',
      'Bhutan introduced the concept of Gross National Happiness (GNH) in 1972, prioritising wellbeing, cultural preservation, and environmental sustainability over GDP.',
    ],
    bestTime: { period: 'March–May & Sep–November', reason: 'Spring brings rhododendrons in bloom and clear mountain views; autumn is crisp and ideal for trekking after the monsoon. Winter is cold but festivals are spectacular.' },
    quickFacts: { language: 'Dzongkha', currency: 'Bhutanese Ngultrum (Nu)', capital: 'Thimphu', knownAs: 'Land of the Thunder Dragon', timezone: 'BTT (UTC+6)' },
    cuisine: ['Ema Datshi (Chilli Cheese)', 'Phaksha Paa (Pork with Chillies)', 'Red Rice', 'Jasha Maru (Spiced Chicken)', 'Hoentay (Dumplings)', 'Ara (Butter Tea)', 'Suja (Butter Tea)'],
    stays: [
      { name: 'Amankora Paro', area: 'Paro Valley', rating: 4.9, reviews: 320, type: 'Luxury Aman lodge', price: 'Nu Nu Nu Nu', highlight: 'Stone-and-pine lodge in a pine grove, traditional bukhari stoves' },
      { name: 'Six Senses Thimphu', area: 'Thimphu Valley', rating: 4.8, reviews: 280, type: 'Luxury wellness lodge', price: 'Nu Nu Nu Nu', highlight: 'Capital views, butler-service villas, wellness-only philosophy' },
      { name: 'Zhiwa Ling Heritage', area: 'Paro', rating: 4.7, reviews: 540, type: 'Bhutanese heritage hotel', price: 'Nu Nu Nu', highlight: 'Hand-carved wooden interiors, on-site temple, prayer wheel courtyard' },
      { name: 'Hotel Druk', area: 'Thimphu centre', rating: 4.4, reviews: 720, type: 'Mid-range hotel', price: 'Nu Nu', highlight: 'Centrally located near Tashichho Dzong, traditional dinners on the rooftop' },
    ],
  },

  puri: {
    tagline: 'Holy seaside city of Lord Jagannath — temple, beach, and the soul of Odisha',
    famousFor: ['Jagannath Temple', 'Rath Yatra', 'Puri Beach', 'Char Dham Pilgrimage', 'Pattachitra Art', 'Konark Sun Temple (nearby)', 'Chilika Lake'],
    attractions: [
      { name: 'Shree Jagannath Temple', desc: 'One of the four Char Dham of Hindu pilgrimage. The 12th-century Kalinga-style temple houses Lord Jagannath, brother Balabhadra, and sister Subhadra. The 65m shikhar dominates the skyline; the kitchen is the largest in the world, feeding 100,000 devotees daily during festivals. Non-Hindus are not permitted inside the inner sanctum.' },
      { name: 'Puri Beach', desc: 'A 5km golden-sand beach along the Bay of Bengal — India\'s first Blue Flag beach. Famous for its dramatic sunrises, the annual Puri Beach Festival, and the giant sand sculptures of artist Sudarsan Pattnaik.' },
      { name: 'Konark Sun Temple', desc: '35km away — a UNESCO World Heritage 13th-century temple shaped like Surya\'s chariot, with 24 ornately-carved stone wheels and seven horses. One of the architectural wonders of India and often paired with a Puri trip.' },
      { name: 'Chilika Lake', desc: 'Asia\'s largest brackish-water lagoon (~1,100 sq km) about 50km south. Spot Irrawaddy dolphins, migratory flamingos, and the island shrine of Kalijai. Boat rides from Satapada or Barkul.' },
      { name: 'Raghurajpur Heritage Crafts Village', desc: 'A short drive inland — every household practices traditional Pattachitra (palm-leaf and cloth painting), stone carving, papier-mâché masks, or Gotipua dance. India\'s first heritage crafts village.' },
      { name: 'Gundicha Temple', desc: 'The "Garden House" temple where Lord Jagannath visits during Rath Yatra. Sits 3km from the main temple — devotees pull the 45-foot chariots along this route every July before millions of pilgrims.' },
    ],
    history: [
      'Puri is one of the four sacred dhams (along with Badrinath, Dwarka, and Rameswaram) — every Hindu is expected to visit at least once in their lifetime.',
      'The Jagannath Temple was built by King Anantavarman Chodaganga of the Eastern Ganga dynasty in the 12th century, replacing earlier shrines on the same site.',
      'The annual Rath Yatra (Chariot Festival), dating back at least 800 years, gave English the word "juggernaut" — describing the unstoppable wooden chariots that crush devotees beneath their wheels.',
      'Puri\'s temple was sacked 18 times by various Muslim invaders between the 14th–18th centuries, with the deities hidden by priests in remote forests each time. They were always restored and ritually reconsecrated.',
      'Puri served as the centre of the Bhakti movement in eastern India through the 15th-century saint Chaitanya Mahaprabhu, whose followers still throng the temple daily.',
    ],
    bestTime: { period: 'October–February', reason: 'Cool, dry coastal weather (20–28°C) ideal for temple visits and the beach. Rath Yatra (June–July) is spectacular but extremely crowded — book accommodation 6+ months ahead. Avoid May–June heat and July–September monsoons.' },
    quickFacts: { language: 'Odia, Hindi, English', currency: 'Indian Rupee (₹)', capital: 'Coastal city of Odisha', knownAs: 'Shree Kshetra / Purushottama Kshetra', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Mahaprasad (temple offering — 56 dishes)', 'Chenna Poda (caramelised cottage cheese cake)', 'Khaja (layered sweet)', 'Dahi Bara Aludum', 'Macha Besara (mustard fish curry)', 'Pakhala Bhata (fermented rice)', 'Rasagola (Odia\'s claim to the original)'],
    eateries: [
      { name: 'Wildgrass Restaurant', area: 'V.I.P. Road, Puri', rating: 4.5, reviews: 4280, type: 'Odia & multi-cuisine garden dining', price: '₹₹', mustTry: 'Macha Besara + Pakhala thali' },
      { name: 'Chung Wah', area: 'Grand Road, Puri', rating: 4.3, reviews: 2810, type: 'Indo-Chinese', price: '₹₹', mustTry: 'Crispy Veg Manchurian' },
      { name: 'Honey Bee Bakery & Pizzeria', area: 'C.T. Road, Puri', rating: 4.4, reviews: 2150, type: 'Cafe & wood-fired pizza', price: '₹₹', mustTry: 'Margherita + tropical smoothie bowl' },
      { name: 'Peace Restaurant', area: 'C.T. Road, Puri', rating: 4.2, reviews: 1840, type: 'Backpacker multi-cuisine', price: '₹', mustTry: 'Israeli platter with hummus' },
    ],
    stays: [
      { name: 'Mayfair Heritage', area: 'C.T. Road, Puri', rating: 4.6, reviews: 1920, type: 'Heritage beach resort', price: '₹₹₹₹', highlight: 'Direct beach access, palm-shaded pool, sea-view rooms' },
      { name: 'Hotel Toshali Sands', area: 'Konark Marine Drive', rating: 4.3, reviews: 1640, type: 'Mid-range resort', price: '₹₹₹', highlight: 'Cottages on the Puri-Konark road, easy day trip to Konark' },
      { name: 'Hotel Holiday Resort', area: 'C.T. Road, Puri', rating: 4.2, reviews: 2870, type: 'Budget hotel', price: '₹₹', highlight: 'Family-run, walking distance to beach and Jagannath Temple' },
      { name: 'Z Hostel Puri', area: 'C.T. Road, Puri', rating: 4.4, reviews: 920, type: 'Hostel', price: '₹', highlight: 'Beachfront dorms, sociable rooftop, sunrise yoga' },
    ],
  },

  bangalore: {
    tagline: 'India\'s Garden City turned Silicon Valley — pubs, parks, and a startup pulse',
    famousFor: ['IT Capital of India', 'Pub Culture', 'Lalbagh Botanical Garden', 'Cubbon Park', 'Vidhana Soudha', 'Filter Coffee', 'Pleasant Year-Round Weather'],
    attractions: [
      { name: 'Lalbagh Botanical Garden', desc: 'A 240-acre 18th-century garden begun by Hyder Ali and finished by Tipu Sultan — over 1,800 species of plants and a famous Glass House modeled on London\'s Crystal Palace.' },
      { name: 'Cubbon Park', desc: 'A 300-acre lung in the heart of the city — home to the State Central Library, the Government Museum, and a Sunday cycling crowd. Vast banyans and pink tabebuia blooms in March.' },
      { name: 'Vidhana Soudha', desc: 'Karnataka\'s state legislature building (1956) — the largest legislative building in India, in neo-Dravidian granite, dramatically floodlit on weekends.' },
      { name: 'Bangalore Palace', desc: 'A Tudor-revival royal residence built in 1878 by the Wadiyar dynasty — modeled on Windsor Castle, with carved wooden interiors, Belgian glass, and surprise rock concerts on the lawns.' },
      { name: 'Commercial Street & MG Road', desc: 'The shopping spine — colonial-era Brigade Road for streetwear, Commercial Street for tailored kurtas and bangles, M.G. Road for the post-pub coffee.' },
      { name: 'Nandi Hills (day trip)', desc: '60 km north — a 1,478m granite hill where pre-dawn sunrises happen above the cloud line, plus Tipu\'s summer fort and a 9th-century Bhoga Nandeeshwara temple at the base.' },
    ],
    history: [
      'Bangalore was founded in 1537 by Kempe Gowda, a chieftain of the Vijayanagara Empire who built a mud-walled fort and gave the city its grid layout.',
      'The British took the city in 1799 after defeating Tipu Sultan at Srirangapatna — they made it the cantonment for the Madras Presidency, building the Mall, churches, and bungalow neighborhoods that still define central Bangalore.',
      'The Indian Institute of Science (1909) and Hindustan Aeronautics (1940) seeded a research-and-engineering culture that, with the founding of Infosys (1981) and Wipro\'s pivot to IT, eventually made Bangalore India\'s tech capital.',
      'The state legislature renamed the city to Bengaluru in 2014 (the Kannada original), though "Bangalore" remains common in everyday speech and signage.',
    ],
    bestTime: { period: 'October–February', reason: 'Cool, pleasant weather (15–28°C) ideal for the parks and outdoor pubs. Summer (Mar–May) is mild but hot (28–34°C) by Indian standards. Monsoon (Jun–Sep) brings reliable rain and beautiful greenery.' },
    quickFacts: { language: 'Kannada, English, Hindi, Tamil', currency: 'Indian Rupee (₹)', capital: 'Capital of Karnataka', knownAs: 'Garden City / Silicon Valley of India', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Bisi Bele Bath', 'Masala Dosa (Vidyarthi Bhavan style)', 'Mysore Pak', 'Filter Coffee', 'Ragi Mudde with Saaru', 'Idli-Vada-Sambar', 'Kori Gassi (Mangalorean coastal)'],
    eateries: [
      { name: 'Vidyarthi Bhavan', area: 'Gandhi Bazaar, Basavanagudi', rating: 4.5, reviews: 18400, type: 'South Indian (since 1943)', price: '₹', mustTry: 'Masala Dosa with extra ghee + filter coffee' },
      { name: 'MTR (Mavalli Tiffin Room)', area: 'Lalbagh Road', rating: 4.4, reviews: 12200, type: 'Iconic South Indian (since 1924)', price: '₹', mustTry: 'Rava Idli + Chandrahara' },
      { name: 'Toit Brewpub', area: 'Indiranagar', rating: 4.4, reviews: 21800, type: 'Microbrewery & gastropub', price: '₹₹₹', mustTry: 'Tintin Toit + wood-fired pizzas' },
      { name: 'Karavalli', area: 'The Gateway Hotel, Residency Road', rating: 4.6, reviews: 2840, type: 'Coastal Karnataka fine dining', price: '₹₹₹₹', mustTry: 'Meen Moilee + Appam' },
    ],
    stays: [
      { name: 'The Leela Palace Bengaluru', area: 'Old Airport Road', rating: 4.7, reviews: 5840, type: 'Palace hotel', price: '₹₹₹₹', highlight: 'Royal-style atrium, Le Cirque dining, garden suites' },
      { name: 'Taj West End', area: 'Race Course Road', rating: 4.7, reviews: 4120, type: 'Heritage hotel (since 1887)', price: '₹₹₹₹', highlight: '20 acres of gardens in central Bangalore, Blue Ginger Vietnamese' },
      { name: 'The Park Bangalore', area: 'M.G. Road', rating: 4.4, reviews: 3640, type: 'Boutique design hotel', price: '₹₹₹', highlight: 'On the M.G. Road metro line, walking distance to Brigade Road and Commercial Street' },
      { name: 'goSTOPS Bengaluru', area: 'Indiranagar', rating: 4.4, reviews: 1820, type: 'Hostel', price: '₹', highlight: 'Indiranagar pub strip at the door, bookable private capsules' },
    ],
  },

  konark: {
    tagline: 'Where the sun-god\'s stone chariot has rolled for 800 years',
    famousFor: ['Sun Temple', 'UNESCO World Heritage Site', 'Stone Chariot Wheels', 'Konark Dance Festival', 'Chandrabhaga Beach'],
    attractions: [
      { name: 'Konark Sun Temple', desc: 'Built around 1250 CE by King Narasimhadeva I, this UNESCO temple is sculpted as a colossal chariot of Surya the Sun-god — pulled by seven horses and rolling on 24 intricately-carved stone wheels (each a working sundial). The original main shikhara collapsed; what remains is the dance hall and the porch (Jagamohan).' },
      { name: 'Konark Archaeological Museum', desc: 'Houses sculptures rescued from the temple complex during 19th-century excavations. Free entry with the temple ticket.' },
      { name: 'Chandrabhaga Beach', desc: '3km from the temple — a serene Blue Flag beach where the morning sun rises over the Bay of Bengal. The annual Magha Saptami festival in February sees thousands of pilgrims taking a holy dip.' },
      { name: 'Konark Dance Festival', desc: 'Held every December against the floodlit temple as backdrop — five evenings of classical Indian dance (Odissi, Bharatanatyam, Kathak, Manipuri).' },
    ],
    history: [
      'The Sun Temple was conceived as the divine chariot of Surya — the chariot wheels can tell time, the seven horses represent days of the week, and the spokes mark the hours.',
      'European sailors used the temple as a navigation landmark and called it the "Black Pagoda" — a counterpart to the white Jagannath Temple of Puri.',
      'The main 70m shikhara collapsed sometime between the 16th–19th centuries — possibly due to a magnetic lodestone in the ceiling that disturbed the iron clamps holding the structure.',
      'The temple was rediscovered and partially restored under British engineers in the late 19th century; the porch was filled with sand to prevent further collapse.',
    ],
    bestTime: { period: 'October–February', reason: 'Pleasant coastal weather. December\'s Konark Dance Festival is a highlight. Sunrise visits to the temple are unforgettable year-round, but summer afternoons can exceed 40°C.' },
    quickFacts: { language: 'Odia, Hindi', currency: 'Indian Rupee (₹)', capital: 'Temple town of Odisha', knownAs: 'Black Pagoda / Surya Kshetra', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Mahaprasad', 'Chenna Poda', 'Khaja', 'Dalma (lentil-vegetable stew)', 'Macha Besara', 'Rasagola'],
    stays: [
      { name: 'Lotus Eco Beach Resort', area: 'Ramachandi Beach', rating: 4.5, reviews: 1240, type: 'Eco beach resort', price: '₹₹₹', highlight: 'Beachside cottages between Konark and Puri, casuarina-shaded' },
      { name: 'Yatrik Niwas (OTDC)', area: 'Konark town', rating: 4.0, reviews: 540, type: 'Government tourist hotel', price: '₹', highlight: 'Walking distance to the Sun Temple, simple but reliable' },
      { name: 'Mayfair Heritage Puri', area: 'C.T. Road, Puri (35 km)', rating: 4.6, reviews: 1920, type: 'Heritage beach resort', price: '₹₹₹₹', highlight: 'Best regional luxury option, easy day trip to Konark' },
      { name: 'Nature Camp Konark Retreat', area: 'Ramachandi', rating: 4.3, reviews: 480, type: 'Tented eco camp', price: '₹₹', highlight: 'Beachfront luxury tents, Olive Ridley turtle nesting season Oct–Mar' },
    ],
  },

  delhi: {
    tagline: 'Seven cities, seven empires, one chaotic capital — where Mughal forts, colonial avenues, and Punjabi street food share the same block.',
    famousFor: ['Red Fort', 'India Gate', 'Old Delhi Street Food', 'Qutub Minar', 'Lutyens\' Delhi', 'Chandni Chowk', 'Political Capital'],
    attractions: [
      { name: 'Red Fort (Lal Qila)', desc: 'Shah Jahan\'s 1648 sandstone fortress and the Mughal seat of power for two centuries — the Indian Prime Minister hoists the national flag from its ramparts every Independence Day.' },
      { name: 'Qutub Minar', desc: 'A 73m sandstone-and-marble victory tower (1193), the world\'s tallest brick minaret, surrounded by the ruins of Delhi\'s first Sultanate and a 4th-century iron pillar that famously refuses to rust.' },
      { name: 'Humayun\'s Tomb', desc: 'The 1572 Mughal garden tomb that prototyped the Taj Mahal — a charbagh layout, double-domed mausoleum, and one of the calmest UNESCO sites in central Delhi.' },
      { name: 'Jama Masjid', desc: 'India\'s largest mosque (1656), capacity 25,000; climb the south minaret for an unmatched rooftop view across Old Delhi\'s tangled lanes.' },
      { name: 'India Gate & Rajpath', desc: 'A 42m WWI memorial arch on the ceremonial axis through Lutyens\' planned imperial capital — the All-India War Memorial with the names of 70,000 Indian soldiers carved into its sandstone.' },
    ],
    history: [
      'Delhi has been continuously inhabited since the 6th century BCE; archaeologists count seven distinct cities built and rebuilt across this Yamuna plain over 2,500 years.',
      'The Delhi Sultanate (1206–1526) made it the seat of the first major Muslim empire in India; the Mughals (1526–1857) elevated it to a global capital with monuments that still define the skyline.',
      'The British shifted India\'s capital here from Calcutta in 1911; Edwin Lutyens designed New Delhi as a planned imperial city of bungalows, hexagonal roundabouts, and one ceremonial axis — completed in 1931.',
      'Partition in 1947 brought 500,000 Punjabi refugees within months; Delhi\'s population doubled, the demographic shifted permanently, and Punjabi-Mughlai cuisine became its defining street food.',
    ],
    bestTime: { period: 'October–March', reason: '15–25°C is perfect for sightseeing. Avoid May–June (45°C+ heatwaves) and the post-Diwali smog peak in November. February and the cherry-blossom-like blooms of February-March are the gold standard.' },
    quickFacts: { language: 'Hindi, Urdu, Punjabi, English', currency: 'Indian Rupee (₹)', capital: 'Capital of India', knownAs: 'Dilli Dilwalon Ki / The City of Djinns', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Butter Chicken', 'Chole Bhature', 'Daulat Ki Chaat (winter only)', 'Paranthe Wali Gali parathas', 'Galouti Kebab', 'Kulfi Falooda', 'Nihari'],
    eateries: [
      { name: 'Karim\'s', area: 'Jama Masjid, Old Delhi', rating: 4.3, reviews: 24600, type: 'Mughlai (since 1913)', price: '₹₹', mustTry: 'Mutton Burra + Tandoori Roti' },
      { name: 'Indian Accent', area: 'The Lodhi, Lodhi Road', rating: 4.7, reviews: 6800, type: 'Modern Indian fine dining', price: '₹₹₹₹', mustTry: 'Blue Cheese Naan + Pulled Kathal Phulka Tacos' },
      { name: 'Bukhara', area: 'ITC Maurya, Diplomatic Enclave', rating: 4.6, reviews: 8200, type: 'North-West Frontier (since 1977)', price: '₹₹₹₹', mustTry: 'Dal Bukhara + Sikandari Raan' },
      { name: 'Saravana Bhavan', area: 'Janpath, Connaught Place', rating: 4.3, reviews: 5400, type: 'South Indian veg', price: '₹', mustTry: 'Mysore Masala Dosa + Filter Coffee' },
    ],
    stays: [
      { name: 'The Imperial New Delhi', area: 'Janpath', rating: 4.7, reviews: 4200, type: 'Heritage colonial hotel (1931)', price: '₹₹₹₹', highlight: 'Original Art Deco bones, 5,000-piece colonial art collection, walking distance to Connaught Place' },
      { name: 'The Oberoi New Delhi', area: 'Dr Zakir Hussain Marg', rating: 4.7, reviews: 2800, type: 'Luxury hotel', price: '₹₹₹₹', highlight: 'Golf course views, Threesixty all-day dining, post-renovation glass-and-marble lobby' },
      { name: 'Haveli Dharampura', area: 'Old Delhi', rating: 4.6, reviews: 1240, type: 'Restored 1887 haveli', price: '₹₹₹', highlight: 'Mughal-era courtyard, kathak performances, Chandni Chowk\'s Paranthe Wali Gali at the door' },
      { name: 'Bloomrooms @ New Delhi Railway Station', area: 'Paharganj', rating: 4.2, reviews: 3800, type: 'Budget design hotel', price: '₹', highlight: 'Backpacker base, walkable to Old Delhi, metro on the doorstep' },
    ],
  },

  jaipur: {
    tagline: 'India\'s Pink City — Rajput palaces, sandstone bazaars, and royal romance under sherbet-tinted walls.',
    famousFor: ['Pink City', 'Hawa Mahal', 'Amber Fort', 'Block-printed Textiles', 'Royal Rajputs', 'Bazaar Shopping', 'City Palace'],
    attractions: [
      { name: 'Amber (Amer) Fort', desc: 'A 16th-century honey-stoned hill fort with the mirror-mosaic Sheesh Mahal — light a single candle inside and the entire chamber glitters like a star field; reached on foot, jeep, or by 4WD.' },
      { name: 'Hawa Mahal', desc: 'The 1799 sandstone façade with 953 latticed windows so royal women could watch street processions unseen — five storeys, just one room deep, the most photographed wall in Rajasthan.' },
      { name: 'City Palace & Chandra Mahal', desc: 'Working royal residence and museum complex; houses the largest pair of silver vessels in the world (Guinness-listed), used by Maharaja Madho Singh II to carry Ganges water to Britain in 1902.' },
      { name: 'Jantar Mantar', desc: 'Maharaja Sawai Jai Singh II\'s 18th-century astronomical observatory; UNESCO; the 27m Samrat Yantra is the world\'s largest stone sundial — accurate to within two seconds.' },
      { name: 'Nahargarh Fort', desc: 'Sunset view over the Pink City from wedge-cut walls; the in-fort Padao Café is famous for its golden-hour chai and the Pink City lights coming on as you sip.' },
    ],
    history: [
      'Founded 1727 by Maharaja Sawai Jai Singh II — India\'s first planned city, laid out by Vidyadhar Bhattacharya on a nine-square Vastu Shastra grid still legible from Google Earth.',
      'Painted pink in 1876 to welcome the Prince of Wales (later Edward VII); the colour was preserved by city ordinance and is still mandated for façades within the walled city.',
      'The Rajput state of Jaipur was one of the first to ally with the Mughals — Raja Man Singh became Akbar\'s general and brought Persian art into the local Hindu tradition, visible in Amber Fort\'s painted ceilings.',
      'Maharaja Sawai Man Singh II (1922–1949) was the last ruling king; his palace is now the Rambagh Palace hotel and his polo team made Jaipur a hub of the sport — annual matches still happen in winter.',
    ],
    bestTime: { period: 'October–March', reason: 'Crisp 10–25°C is perfect for fort-climbing. Diwali (Oct/Nov) lights the Pink City spectacularly; the Jaipur Literature Festival in late January is the world\'s largest free literary event. Avoid April–June: 40–45°C makes the sandstone uninhabitable.' },
    quickFacts: { language: 'Hindi, Marwari, English', currency: 'Indian Rupee (₹)', capital: 'Capital of Rajasthan', knownAs: 'Pink City / Paris of India', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Dal Baati Churma', 'Laal Maans', 'Pyaaz Kachori', 'Ghevar (festival sweet)', 'Rajasthani Thali', 'Ker Sangri', 'Mawa Kachori'],
    eateries: [
      { name: 'Laxmi Misthan Bhandar (LMB)', area: 'Johari Bazaar', rating: 4.4, reviews: 7600, type: 'Rajasthani veg + sweets', price: '₹₹', mustTry: 'Royal Rajasthani Thali + Ghevar' },
      { name: '1135 AD', area: 'Amber Fort, Jaleb Chowk', rating: 4.3, reviews: 3800, type: 'Royal Mughlai dining inside the fort', price: '₹₹₹₹', mustTry: 'Murgh Khada Masala in the Sheesh Mahal-style courtyard' },
      { name: 'Bar Palladio', area: 'Narain Niwas Palace, Kanota Bagh', rating: 4.5, reviews: 1840, type: 'Italian-Rajput pavilion', price: '₹₹₹₹', mustTry: 'Tagliolini al Ragu in the cobalt-tiled garden' },
      { name: 'Rawat Mishtan Bhandar', area: 'Sindhi Camp', rating: 4.5, reviews: 5800, type: 'Pyaaz kachori specialist (since 1957)', price: '₹', mustTry: 'Pyaaz Kachori with sweet curd + green chutney' },
    ],
    stays: [
      { name: 'Rambagh Palace', area: 'Bhawani Singh Road', rating: 4.8, reviews: 3400, type: 'Royal palace hotel (1835)', price: '₹₹₹₹', highlight: 'The maharaja\'s former residence, polo lawn, peacocks, Suvarna Mahal dining hall' },
      { name: 'Samode Haveli', area: 'Gangapole', rating: 4.7, reviews: 1860, type: 'Restored 18th-c. haveli', price: '₹₹₹₹', highlight: 'Frescoed ceilings, courtyard pool, located inside the walled city' },
      { name: 'Hotel Pearl Palace', area: 'Hari Kishan Somani Marg', rating: 4.6, reviews: 4200, type: 'Boutique mid-range', price: '₹₹', highlight: 'Peacock Rooftop Restaurant, family-run, repeatedly ranked Jaipur\'s top mid-range stay' },
      { name: 'Zostel Jaipur', area: 'Bani Park', rating: 4.4, reviews: 2240, type: 'Hostel', price: '₹', highlight: 'Auto rides to Hawa Mahal, social rooftop, walking-tour partnerships' },
    ],
  },

  agra: {
    tagline: 'A city built around the world\'s greatest love story — and a fort that watched it all unfold.',
    famousFor: ['Taj Mahal', 'Mughal Heritage', 'Agra Fort', 'Petha (sweet)', 'Mughlai Cuisine', 'Marble Pietra Dura'],
    attractions: [
      { name: 'Taj Mahal', desc: 'Shah Jahan\'s 1632–1653 white marble mausoleum for Mumtaz Mahal; UNESCO; sunrise visits beat the crowds and catch the marble shifting from pink to gold to white as the sun climbs.' },
      { name: 'Agra Fort', desc: 'Red sandstone Mughal fort and UNESCO site; Shah Jahan was imprisoned here by his son Aurangzeb and reportedly died gazing at the Taj from the Musamman Burj balcony — the view is unchanged.' },
      { name: 'Mehtab Bagh', desc: 'The 16th-century "Moonlight Garden" directly across the Yamuna from the Taj — the perfect dawn or sunset framing, far quieter than the main complex, and the angle most photographers prefer.' },
      { name: 'Itimad-ud-Daulah ("Baby Taj")', desc: 'The 1628 marble tomb that prototyped the Taj Mahal — intricate pietra dura inlay, sublime proportions, and crowds typically in the single digits.' },
      { name: 'Fatehpur Sikri (40 km)', desc: 'Akbar\'s planned capital (1571–1585), abandoned within 14 years for lack of water; UNESCO; Buland Darwaza is the tallest gateway in the world at 54m.' },
    ],
    history: [
      'Agra was founded by Sikandar Lodi in 1504; rose to glory under three Mughal emperors — Akbar, Jahangir, and Shah Jahan — who all chose it as their capital before Delhi reclaimed the role.',
      'The Taj Mahal took 22 years and 20,000 workers to build; legend says Shah Jahan severed the chief architect\'s hands so he could never replicate it (almost certainly apocryphal, but the story endures).',
      'Aurangzeb shifted the Mughal capital to Delhi in 1648; Agra began a long decline that accelerated under Maratha and British rule, until tourism revived it in the late 20th century.',
      'In 1857 the Indian Rebellion saw fierce fighting around Agra; the Fort\'s armoury museum still preserves bullet holes and weapons from the siege of the British residency.',
    ],
    bestTime: { period: 'October–March', reason: 'Pleasant 10–28°C. Best Taj photography is at sunrise or full-moon nights (5 nights/month, advance permits via ASI). Avoid May–June heat (45°C) and August\'s humidity.' },
    quickFacts: { language: 'Hindi, Urdu, English', currency: 'Indian Rupee (₹)', capital: 'Mughal-era capital', knownAs: 'City of the Taj', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Petha (translucent ash-gourd sweet)', 'Bedhai-Jalebi (breakfast)', 'Mughlai Biryani', 'Dalmoth Namkeen', 'Bhalla-Papdi Chaat', 'Galouti Kebab'],
    eateries: [
      { name: 'Pinch of Spice', area: 'Fatehabad Road', rating: 4.3, reviews: 5800, type: 'Modern Indian', price: '₹₹₹', mustTry: 'Murgh Lazeez + Galouti Kebab' },
      { name: 'Esphahan', area: 'The Oberoi Amarvilas', rating: 4.7, reviews: 1240, type: 'Mughlai fine dining', price: '₹₹₹₹', mustTry: 'Slow-cooked Lal Maas + live ghazals, Taj views from the patio' },
      { name: 'Shankara Vegis', area: 'Taj Ganj', rating: 4.2, reviews: 2400, type: 'Backpacker veg café', price: '₹', mustTry: 'Banana Lassi + Masala Dosa' },
      { name: 'Joney\'s Place', area: 'Taj Ganj', rating: 4.0, reviews: 1860, type: 'Tiny rooftop joint (since 1978)', price: '₹', mustTry: 'Special Lassi — Lonely-Planet famous since the 80s' },
    ],
    stays: [
      { name: 'The Oberoi Amarvilas', area: 'Taj East Gate Road', rating: 4.8, reviews: 2640, type: 'Luxury Taj-view hotel', price: '₹₹₹₹', highlight: 'Every room sees the Taj; 600m from East Gate; sunken pool with fountain alleys' },
      { name: 'ITC Mughal', area: 'Taj Ganj', rating: 4.5, reviews: 4800, type: 'Heritage luxury', price: '₹₹₹₹', highlight: 'Mughal-revival architecture, Kaya Kalp spa, golf-cart shuttle to the Taj' },
      { name: 'Hotel Taj Resorts', area: 'Fatehabad Road', rating: 4.3, reviews: 3200, type: 'Mid-range', price: '₹₹', highlight: '10 min from Taj East Gate, rooftop dining with partial Taj view' },
      { name: 'Joey\'s Hostel Agra', area: 'Tota ka Tal', rating: 4.4, reviews: 2840, type: 'Hostel', price: '₹', highlight: 'Walkable to the Taj, terrace with a Taj glimpse, free breakfast' },
    ],
  },

  rishikesh: {
    tagline: 'Where the Ganges meets the Himalayas — and the world comes for yoga, white water, and a quieter mind.',
    famousFor: ['Yoga Capital of the World', 'White-water Rafting', 'The Beatles Ashram', 'Ganga Aarti', 'Lakshman Jhula', 'Adventure Sports', 'Vegetarian-only Town'],
    attractions: [
      { name: 'Triveni Ghat', desc: 'The sacred riverside ghat where the Ganga, Yamuna, and the mythical Saraswati are said to meet; the evening Ganga Aarti at sundown — diya lamps floating on the river — is one of India\'s most hypnotic rituals.' },
      { name: 'Lakshman Jhula & Ram Jhula', desc: 'Twin pedestrian suspension bridges over the Ganges; gateway to the café-and-ashram strip on the east bank — also where every wandering sadhu seems to congregate at golden hour.' },
      { name: 'Beatles Ashram (Chaurasi Kutia)', desc: 'Where the Beatles stayed with Maharishi Mahesh Yogi in 1968 and wrote half of the White Album; long abandoned, then reclaimed by graffiti artists, now a paid heritage walk through psychedelic ruins.' },
      { name: 'Neelkanth Mahadev Temple', desc: '32 km uphill on a jungle road; the spot where Shiva is said to have drunk poison from the Samudra Manthan churning of the cosmic ocean — his throat turned blue, hence "Neel-kanth".' },
      { name: 'Shivpuri Rafting Stretch', desc: 'Class III+ Ganges rapids on a 16km run starting from Shivpuri (40 min from town); peak season Sep–Jun; rafting closes in monsoon when the river runs at lethal volume.' },
    ],
    history: [
      'Mentioned in the Mahabharata as the place where the sage Raibhya Rishi performed austerities — the town\'s name comes from "Rishi-Kesh" (a name of Vishnu meaning lord of the senses).',
      'Adi Shankaracharya is said to have visited in the 8th century to revive Hindu philosophy; multiple ashrams trace their lineage to this period.',
      'Swami Sivananda founded the Divine Life Society here in 1936, kick-starting Rishikesh\'s reputation as a global yoga centre — many of the most-translated yoga texts in the West were written in this ashram.',
      'The Beatles\' 1968 stay with Maharishi Mahesh Yogi fixed Rishikesh in Western consciousness as the world\'s yoga capital — and indirectly seeded the multi-billion-dollar global wellness industry.',
    ],
    bestTime: { period: 'September–November & February–April', reason: 'Sep–Nov: post-monsoon clarity, ideal rafting flows, 18–28°C. Feb–Apr: wildflower season, the International Yoga Festival is in March. Skip June–August monsoon (rafting suspended; landslides on the road from Haridwar).' },
    quickFacts: { language: 'Hindi, English', currency: 'Indian Rupee (₹)', capital: 'Pilgrim town in Uttarakhand', knownAs: 'Yoga Capital of the World', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Pure-veg only town (no meat, no eggs, no alcohol)', 'Sattvic Thali', 'Aloo Poori', 'Banana-Nutella Pancakes (Beatles-cafe staple)', 'Buddha Bowls', 'Filter Coffee', 'Masala Chai by the river'],
    eateries: [
      { name: 'Little Buddha Cafe', area: 'Lakshman Jhula', rating: 4.3, reviews: 4200, type: 'Multi-cuisine treetop café', price: '₹₹', mustTry: 'Banana lassi + falafel wrap on the river-view deck' },
      { name: 'Ramana\'s Garden Cafe', area: 'Tapovan', rating: 4.6, reviews: 1640, type: 'Organic farm-to-table', price: '₹₹', mustTry: 'Buddha bowl + apple-cinnamon pancake (proceeds fund a children\'s home)' },
      { name: 'Sattva Cafe', area: 'Tapovan', rating: 4.4, reviews: 2880, type: 'Yogi-friendly vegan', price: '₹₹', mustTry: 'Sattvic Thali + millet porridge' },
      { name: 'Chotiwala (since 1958)', area: 'Swarg Ashram', rating: 4.0, reviews: 6800, type: 'Iconic pilgrim thali', price: '₹', mustTry: 'Special Thali — the two human "mascots" with chotis still sit at the door' },
    ],
    stays: [
      { name: 'Ananda in the Himalayas', area: 'Narendra Nagar (25 km)', rating: 4.8, reviews: 1840, type: 'Destination wellness resort', price: '₹₹₹₹', highlight: 'Maharaja\'s palace setting, 7-day Ayurveda + yoga programs, repeatedly ranked Asia\'s top spa' },
      { name: 'Atali Ganga', area: 'Shivpuri', rating: 4.7, reviews: 920, type: 'Adventure boutique resort', price: '₹₹₹₹', highlight: 'Riverside camping reimagined; rafting put-in at the doorstep' },
      { name: 'Vasundhara Sthali', area: 'Tapovan', rating: 4.5, reviews: 740, type: 'Mid-range yoga retreat', price: '₹₹', highlight: 'Walking distance to Lakshman Jhula; included morning yoga' },
      { name: 'Live Free Hostel', area: 'Tapovan', rating: 4.3, reviews: 1240, type: 'Hostel', price: '₹', highlight: 'Backpacker hub; organize raft, cliff-jump, and bungee in-house' },
    ],
  },

  darjeeling: {
    tagline: 'Toy trains, mist-soaked tea gardens, and the third-highest mountain in the world for a backdrop.',
    famousFor: ['Darjeeling Tea', 'Toy Train (UNESCO)', 'Tiger Hill Sunrise', 'Kanchenjunga Views', 'Himalayan Mountaineering', 'Tibetan-Refugee Culture', 'Colonial Hill Station'],
    attractions: [
      { name: 'Tiger Hill', desc: 'An 11km drive pre-dawn; sunrise lights up Kanchenjunga (8,586m, world\'s third-highest) in pink-then-gold; on the clearest mornings, Mt Everest is visible 175km away to the west.' },
      { name: 'Darjeeling Himalayan Railway', desc: 'The 1881 narrow-gauge "toy train" — UNESCO; the Joy Ride from Darjeeling to Ghoom (highest railway station in India at 7,407 ft) and back via the Batasia Loop is a 2-hour time machine.' },
      { name: 'Happy Valley Tea Estate', desc: 'An 1854 working tea garden 3km from Mall Road; pluck-and-process tour, factory shop with first-flush single-estate teas at fractions of London auction prices.' },
      { name: 'Padmaja Naidu Himalayan Zoological Park', desc: 'One of the world\'s few high-altitude zoos; red pandas, snow leopards, Tibetan wolves; founded as a captive-breeding centre and one of the most successful red panda programs anywhere.' },
      { name: 'Himalayan Mountaineering Institute', desc: 'Founded by Tenzing Norgay in 1954 after his Everest summit; the museum holds Tenzing\'s climbing gear, the Indian flag he planted on the summit, and Hillary\'s ice axe.' },
    ],
    history: [
      'Until 1835 the area belonged to the kingdom of Sikkim; the British East India Company "leased" it as a sanatorium for soldiers recovering from the Bengal heat.',
      'Robert Fortune\'s 1848 espionage operation — smuggling Chinese tea cuttings and tea-master knowledge into Sikkim — seeded the first plantations; Darjeeling tea now sells at the world\'s highest auction prices.',
      'The Darjeeling Himalayan Railway was built 1879–1881 to connect the hill station to the Bengal plains; 88km, five zig-zags, six loops, and a 7,407 ft summit at Ghoom.',
      'Tenzing Norgay grew up in nearby Toong Soong; after the 1953 Everest summit he founded the Himalayan Mountaineering Institute in Darjeeling and trained generations of Indian climbers.',
    ],
    bestTime: { period: 'April–June & October–November', reason: 'Apr–Jun: clearest mountain views, rhododendrons in bloom, 12–22°C. Oct–Nov: post-monsoon clarity, pleasant. Skip Jul–Sep (monsoon, leech season, the mountain hidden for weeks at a stretch).' },
    quickFacts: { language: 'Nepali, Hindi, English, Bengali', currency: 'Indian Rupee (₹)', capital: 'Hill station in West Bengal', knownAs: 'Queen of the Hills', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Darjeeling Tea (first flush + second flush)', 'Momos (steamed/fried)', 'Thukpa', 'Aloo Dum (Tibetan-style)', 'Sel Roti', 'Churpi (yak cheese)', 'Wai Wai noodle stir-fry'],
    eateries: [
      { name: 'Glenary\'s', area: 'Nehru Road', rating: 4.4, reviews: 5840, type: 'Colonial bakery & restaurant (since 1885)', price: '₹₹', mustTry: 'Iced coffee + Mama\'s Beef Pie on the upper deck' },
      { name: 'Keventer\'s', area: 'Mall Road', rating: 4.3, reviews: 8200, type: 'Iconic breakfast deck (since 1911)', price: '₹₹', mustTry: 'Big Breakfast + hot chocolate, with Kanchenjunga in the morning gap' },
      { name: 'Kunga Restaurant', area: 'Gandhi Road', rating: 4.4, reviews: 3640, type: 'Tibetan home-style', price: '₹', mustTry: 'Pork momos + thukpa with chilli oil' },
      { name: 'Sonam\'s Kitchen', area: 'Dr Zakir Hussain Road', rating: 4.5, reviews: 1840, type: 'Tiny breakfast joint', price: '₹', mustTry: 'French toast with marmalade + masala chai' },
    ],
    stays: [
      { name: 'The Elgin Darjeeling', area: 'H.D. Lama Road', rating: 4.6, reviews: 1240, type: 'Heritage hotel (1887)', price: '₹₹₹₹', highlight: 'Maharaja-of-Cooch-Behar\'s former summer house; afternoon tea on the lawn, garden views' },
      { name: 'Mayfair Darjeeling', area: 'The Mall', rating: 4.5, reviews: 1840, type: 'Heritage luxury', price: '₹₹₹₹', highlight: 'Manor-style on the Mall, Kanchenjunga views, library and conservatory' },
      { name: 'Windamere Hotel', area: 'Observatory Hill', rating: 4.5, reviews: 1140, type: 'Original Raj-era hotel (since 1880s)', price: '₹₹₹', highlight: 'Quirky time-capsule of British Empire decor — fireplaces, hot water bottles in beds, and high tea at 4 sharp' },
      { name: 'Revolver', area: 'Robertson Road', rating: 4.6, reviews: 540, type: 'Beatles-themed boutique stay', price: '₹₹', highlight: '5 rooms (each named for a Beatle), curated craft and vinyl, run by a music historian' },
    ],
  },

  pondicherry: {
    tagline: 'A pocket of France on the Coromandel Coast — French quarter cafés, mustard-yellow villas, and a sea wall for sunset walks.',
    famousFor: ['French Quarter', 'Auroville', 'Sri Aurobindo Ashram', 'Promenade Beach', 'French-Tamil Cuisine', 'Bougainvillea-draped Streets', 'Boutique Hotels'],
    attractions: [
      { name: 'White Town (French Quarter)', desc: 'Mustard-yellow and white villas, bougainvillea trellises, and French street names ("Rue Suffren", "Rue Romain Rolland"); Bharathi Park is the colonial heart, walkable in an afternoon.' },
      { name: 'Auroville', desc: 'An experimental township founded in 1968 by Mirra Alfassa ("The Mother"); the golden Matrimandir is a meditation chamber accessible only via a guided pass booked at the Visitor Centre 24 hours in advance.' },
      { name: 'Promenade Beach', desc: 'A 1.5km traffic-free seafront with the Gandhi statue, the French War Memorial, and the Old Light House; sunrise walks beat the sunset crowds and you\'ll see locals doing yoga at the seawall.' },
      { name: 'Sri Aurobindo Ashram', desc: 'A spiritual community founded in 1926; quiet courtyard, the joint samadhi (shrine) of Sri Aurobindo and The Mother, and the most peaceful five minutes you\'ll have all trip.' },
      { name: 'Paradise Beach (Chunnambar)', desc: '8 km south of town; reach by a 20-minute backwater boat ride from Chunnambar Boathouse; pristine sand spit between river and sea, busy on weekends, near-empty on weekdays.' },
    ],
    history: [
      'The French East India Company arrived in 1674; under François Martin and later Joseph François Dupleix, Pondicherry became the capital of French India and the rival to British Madras.',
      'The British captured and destroyed Pondicherry repeatedly during the Anglo-French wars (1761, 1778, 1793); the town was rebuilt each time, with the present grid laid out in 1769.',
      'Pondicherry remained French until 1954 — seven years after Indian independence — when its citizens voted by referendum to merge with India; older locals still hold dual French citizenship.',
      'The 2004 tsunami struck Pondicherry directly, but the seawall built afterward saved the French quarter; the promenade has since been rebuilt and is now permanently pedestrian-only after dark.',
    ],
    bestTime: { period: 'October–March', reason: 'Cool, dry, 22–30°C. Avoid the cyclone window of Oct–Dec for beach plans (most years are fine, but it\'s the risk window). April–June is humid 28–38°C; the French quarter\'s shaded streets help.' },
    quickFacts: { language: 'Tamil, French, English, Hindi', currency: 'Indian Rupee (₹)', capital: 'Union Territory capital', knownAs: 'The French Riviera of the East', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Crêpes', 'Steak Frites (French quarter)', 'Chettinad Chicken', 'Idiyappam with Kurma', 'Filter Coffee', 'Pondicherry-style Fish Curry', 'Croissants (Baker Street)'],
    eateries: [
      { name: 'Cafe Des Arts', area: 'Rue Suffren, French Quarter', rating: 4.4, reviews: 3840, type: 'French-quarter brunch', price: '₹₹', mustTry: 'Galette + Pondicherry frappuccino in the courtyard' },
      { name: 'Le Dupleix', area: 'Rue de la Caserne', rating: 4.5, reviews: 1240, type: 'Colonial-villa fine dining', price: '₹₹₹₹', mustTry: 'Pondicherry fish curry + chocolate fondant on the courtyard tables' },
      { name: 'Surguru', area: 'Mission Street, Tamil Town', rating: 4.3, reviews: 7240, type: 'Tamil veg classic (since 1976)', price: '₹', mustTry: 'Chettinad masala dosa + mini idli sambar' },
      { name: 'Baker Street', area: 'Bussy Street', rating: 4.5, reviews: 4640, type: 'Patisserie', price: '₹₹', mustTry: 'Almond croissant + Quiche Lorraine' },
    ],
    stays: [
      { name: 'Le Dupleix', area: 'Rue de la Caserne', rating: 4.6, reviews: 920, type: 'Heritage colonial villa', price: '₹₹₹₹', highlight: 'Restored 18th-century mayor\'s house; courtyard pool; in the heart of the French quarter' },
      { name: 'Maison Perumal CGH Earth', area: 'Rangapillai Street, Tamil Quarter', rating: 4.7, reviews: 640, type: 'Heritage Tamil mansion', price: '₹₹₹₹', highlight: '130-year-old Chettiar mansion, Tamil-quarter side, traditional courtyard layout' },
      { name: 'La Villa', area: 'Rue Suffren', rating: 4.6, reviews: 540, type: 'Boutique design hotel', price: '₹₹₹', highlight: 'Minimalist French-Tamil fusion; plunge pool; eight rooms only' },
      { name: 'Auroville Visitor Guest Houses', area: 'Auroville (8 km)', rating: 4.2, reviews: 240, type: 'Community guest houses', price: '₹', highlight: 'Stay inside the township; simple, earnest, and within walking distance of Matrimandir viewpoints' },
    ],
  },

  vrindavan: {
    tagline: 'Krishna\'s eternal playground — where every dawn aarti reaches up to the gopis\' favourite kunj.',
    famousFor: ['Banke Bihari Temple', 'ISKCON Krishna Balaram Mandir', 'Prem Mandir', 'Lathmar Holi at Barsana', 'Mathura Pedas', 'Nidhivan', 'Yamuna Aarti'],
    attractions: [
      { name: 'Banke Bihari Temple', desc: 'The 1864 temple housing the most beloved swayambhu (self-manifested) Krishna idol in India; the curtain closes between brief darshan windows so the deity isn\'t "stared at" continuously — a ritual unique to Vrindavan.' },
      { name: 'ISKCON Krishna Balaram Mandir', desc: 'The Hare Krishna movement\'s flagship temple (1975), founded by Srila Prabhupada on the spot where Krishna and his brother Balaram are said to have played; the 4:30 AM mangala aarti is hypnotic.' },
      { name: 'Prem Mandir', desc: 'A 54-acre marble "Temple of Love" (2012) by Jagadguru Kripalu Maharaj; the entire facade colour-shifts in unison during the evening light-and-music show — surprisingly modern despite the traditional silhouette.' },
      { name: 'Nidhivan', desc: 'A dense kunj (grove) of intertwined tulsi trees where locals say Krishna performs the Raas Lila with the gopis every night; the gates lock at sunset and no one (allegedly) survives staying inside after dark.' },
      { name: 'Govardhan Hill (25 km)', desc: 'The hill Krishna is said to have lifted on his little finger to shelter Vraj from Indra\'s storm; the 21-km parikrama is barefoot for the devout, and Govardhan Puja the day after Diwali draws hundreds of thousands.' },
      { name: 'Mathura Janmabhoomi (12 km)', desc: 'The walled prison cell where Krishna is said to have been born to Devaki; the temple complex sits behind heavy security as one of India\'s most contested sites — pair with riverside Vishram Ghat at sunset.' },
    ],
    history: [
      'Vrindavan and Mathura form the heart of the Braj region — the geography of Krishna\'s childhood as told in the Bhagavata Purana (~10th century CE).',
      'Vrindavan as a living pilgrimage town was effectively rebuilt by 16th-century Gaudiya Vaishnav saints — Roop Goswami, Sanatan Goswami, Jiva Goswami — under the patronage of Akbar; most "ancient" temples date to that revival, not earlier.',
      'Mathura was sacked repeatedly: by Mahmud of Ghazni (1018), Sikandar Lodi (1500), and Aurangzeb (1670 — when the original Krishna temple was demolished and replaced by the Idgah mosque that still stands alongside the modern shrine).',
      'Today Vrindavan houses an estimated 5,000+ widows (largely Bengali) who came to live out their lives in the temple town — the subject of Deepa Mehta\'s 2005 film Water and the focus of ongoing welfare programs.',
    ],
    bestTime: { period: 'October–March (festivals: Holi in March, Janmashtami in Aug/Sep)', reason: 'Cool 10–25°C makes the on-foot temple circuit pleasant. Lathmar Holi at Barsana is the most chaotic and joyful in India — book accommodation 3 months ahead. Avoid May–June (45°C) and August\'s humidity.' },
    quickFacts: { language: 'Hindi, Braj Bhasha, English', currency: 'Indian Rupee (₹)', capital: 'Pilgrim town in Uttar Pradesh', knownAs: 'Krishna\'s Playground / Braj Bhoomi', timezone: 'IST (UTC+5:30)' },
    cuisine: ['Pure-veg town (no meat, no eggs; temple bhog skips onion/garlic)', 'Mathura Peda (signature milk sweet)', 'Brijwasi Lassi with malai', 'Kachori with aloo sabzi', 'Chaat (Mathura is the chaat capital)', 'Raabri', 'Bhog Prasad'],
    eateries: [
      { name: 'Brijwasi Royal', area: 'Loi Bazaar', rating: 4.4, reviews: 5800, type: 'Heritage sweet shop (since 1955)', price: '₹₹', mustTry: 'Mathura Peda + Rabri Falooda' },
      { name: 'MVT Restaurant', area: 'ISKCON Krishna Balaram campus', rating: 4.5, reviews: 3640, type: 'Pure veg multi-cuisine', price: '₹₹', mustTry: 'Govinda Thali + cheesecake (the 80s Iskcon staple)' },
      { name: 'Govinda\'s Restaurant', area: 'ISKCON, Bhaktivedanta Marg', rating: 4.4, reviews: 4240, type: 'Krishna-conscious veg', price: '₹₹', mustTry: 'Spiritual Thali + Halwa' },
      { name: 'Mishrambu', area: 'Banke Bihari Lane', rating: 4.5, reviews: 2800, type: 'Tiny lassi & kachori joint', price: '₹', mustTry: 'Malaiyo (winter only) + Kachori-Sabzi' },
    ],
    stays: [
      { name: 'The Radha Brij Vasundhara', area: 'Chhatikara Road', rating: 4.5, reviews: 1840, type: 'Heritage-style resort', price: '₹₹₹₹', highlight: '5-acre garden grounds, walking distance to Prem Mandir, vegetarian-only kitchen' },
      { name: 'Nidhivan Sarovar Portico', area: 'Mathura Road', rating: 4.4, reviews: 2240, type: 'Mid-range chain hotel', price: '₹₹₹', highlight: 'Pure-veg restaurant, easy auto access to Banke Bihari, free shuttle to ISKCON' },
      { name: 'ISKCON Guesthouse (MVT)', area: 'Krishna Balaram Mandir campus', rating: 4.3, reviews: 1640, type: 'Devotee guesthouse', price: '₹₹', highlight: 'Inside the ISKCON complex; book 2–3 months ahead for Janmashtami; mangala aarti at the door' },
      { name: 'Kridha Residency', area: 'Vrindavan Bypass', rating: 4.2, reviews: 940, type: 'Boutique mid-range', price: '₹₹', highlight: 'Auto access to all temples, included breakfast, well-kept pool' },
    ],
  },

  andaman: {
    tagline: 'India\'s pristine archipelago — coral reefs, white-sand beaches, and a colonial prison where the freedom struggle was forged.',
    famousFor: ['Radhanagar Beach (Havelock)', 'Scuba Diving', 'Cellular Jail', 'Ross Island Ruins', 'Bioluminescent Plankton', 'Indigenous Tribes', 'Limestone Caves'],
    attractions: [
      { name: 'Radhanagar Beach (Havelock / Swaraj Dweep)', desc: '2 km of powder-white sand and turquoise water; consistently ranked among Asia\'s top beaches; sunset is the showstopper, arrive 90 minutes early.' },
      { name: 'Cellular Jail (Port Blair)', desc: 'The colonial-era prison ("Kala Pani") where Veer Savarkar and hundreds of Indian freedom fighters were held in solitary; the evening Light & Sound Show recounts their stories with the original cells as backdrop.' },
      { name: 'Elephant Beach (Havelock)', desc: 'Snorkelling and diving over a healthy fringing reef; reach by 20-minute speedboat from Havelock Jetty or a forest trek; visibility 20–30m in the dry season.' },
      { name: 'Ross Island (Netaji Subhas Chandra Bose Dweep)', desc: 'The former British administrative headquarters, ruined by the 1941 earthquake and Japanese occupation; ghostly tropical-overgrown ruins of churches, ballrooms, and bakeries; ferry from Aberdeen Jetty.' },
      { name: 'Neil Island (Shaheed Dweep)', desc: 'The quieter sister of Havelock; Bharatpur and Laxmanpur beaches, the Natural Bridge rock formation; ideal for slow-pace travellers escaping the dive-school crowds.' },
    ],
    history: [
      'The Andaman archipelago has been home to indigenous tribes — the Great Andamanese, Onge, Jarawa, and the uncontacted Sentinelese — for over 60,000 years; some of the oldest continuous human habitations on Earth.',
      'The British established the Cellular Jail in 1906 to incarcerate political prisoners; over 700 cells, each in solitary, formed the brutal "Kala Pani" punishment that broke many but radicalized many more.',
      'The Japanese occupied the islands 1942–1945; Subhas Chandra Bose\'s Azad Hind government symbolically renamed them Shaheed and Swaraj Dweep in 1943 — names made official by the Indian government in 2018.',
      'The 2004 Indian Ocean tsunami devastated the southern islands and killed thousands; rebuilding has been gradual but tourism on Havelock and Neil has recovered fully, while the Nicobar group remains largely off-limits.',
    ],
    bestTime: { period: 'October–May', reason: 'Calm seas, clear visibility for diving, 24–30°C. Skip June–September (monsoon, rough seas, ferry cancellations). Best dive visibility December–April.' },
    quickFacts: { language: 'Hindi, English, Bengali, Tamil', currency: 'Indian Rupee (₹)', capital: 'Union Territory; capital is Port Blair', knownAs: 'Kala Pani / Emerald Islands', timezone: 'IST (UTC+5:30) — no DST despite being far east' },
    cuisine: ['Fish Tandoori', 'Andamanese Fish Curry (coconut + curry leaves)', 'Crab Masala', 'Rava-fried Barracuda', 'South Indian breakfasts', 'Imported Bengali sweets'],
    eateries: [
      { name: 'Full Moon Cafe', area: 'Govind Nagar, Havelock', rating: 4.5, reviews: 2840, type: 'Beachside seafood', price: '₹₹', mustTry: 'Grilled red snapper + key lime pie at low tide' },
      { name: 'Annapurna Cafeteria', area: 'Beach No 5, Havelock', rating: 4.3, reviews: 4640, type: 'South Indian thali', price: '₹', mustTry: 'Veg thali + filter coffee — the dive-school staple' },
      { name: 'Lighthouse Restaurant', area: 'Marina Park, Port Blair', rating: 4.2, reviews: 3240, type: 'Open-air seafood', price: '₹₹', mustTry: 'Live lobster (selected from the tank) grilled with garlic butter' },
      { name: 'Anju Coco', area: 'Beach No 3, Havelock', rating: 4.4, reviews: 1840, type: 'Multi-cuisine cafe', price: '₹₹', mustTry: 'Tandoori prawns + mocktails on the swing chairs' },
    ],
    stays: [
      { name: 'Taj Exotica Resort & Spa', area: 'Radhanagar Beach Road, Havelock', rating: 4.7, reviews: 1240, type: 'Luxury beach resort', price: '₹₹₹₹', highlight: 'Bel-air villas overlooking Radhanagar; Jiva Spa; private beach access' },
      { name: 'Barefoot at Havelock', area: 'Beach No 7, Havelock', rating: 4.6, reviews: 740, type: 'Eco beach resort', price: '₹₹₹₹', highlight: 'Thatched cottages metres from Radhanagar; no televisions, no air-conditioning in some cottages by design' },
      { name: 'Sea Shell Havelock', area: 'Beach No 5, Havelock', rating: 4.4, reviews: 1640, type: 'Mid-range resort', price: '₹₹₹', highlight: 'Beachfront, walking distance to Govind Nagar dive shops' },
      { name: 'SeaShell Port Blair', area: 'Marine Hill, Port Blair', rating: 4.4, reviews: 2200, type: 'City hotel', price: '₹₹', highlight: 'Best base for the first/last night around the flight; harbour views' },
    ],
  },
};

// Destination key aliases for fuzzy matching
const ALIASES = {
  'tokyo': 'japan', 'kyoto': 'japan', 'osaka': 'japan',
  'france': 'paris',
  'uk': 'london', 'england': 'london',
  'uae': 'dubai',
  'bangkok': 'thailand', 'phuket': 'thailand', 'chiang mai': 'thailand',
  'seoul': 'south korea', 'korea': 'south korea', 'busan': 'south korea',
  'hanoi': 'vietnam', 'ho chi minh': 'vietnam', 'hoi an': 'vietnam',
  'leh': 'ladakh', 'leh ladakh': 'ladakh',
  'shillong': 'meghalaya',
  'bombay': 'mumbai',
  'benares': 'varanasi', 'kashi': 'varanasi', 'banaras': 'varanasi',
  'viennna': 'austria', 'vienna': 'austria',
  'baku': 'azerbaijan',
  'colombo': 'srilanka', 'kandy': 'srilanka', 'galle': 'srilanka', 'ceylon': 'srilanka',
  'helsinki': 'finland', 'lapland': 'finland', 'rovaniemi': 'finland',
  'san jose': 'costarica', 'arenal': 'costarica', 'monteverde': 'costarica', 'costa rica': 'costarica',
  'sydney': 'australia', 'melbourne': 'australia', 'queensland': 'australia', 'brisbane': 'australia',
  'cairo': 'egypt', 'luxor': 'egypt', 'aswan': 'egypt', 'giza': 'egypt',
  'thimphu': 'bhutan', 'paro': 'bhutan',
  'zurich': 'switzerland', 'bern': 'switzerland', 'interlaken': 'switzerland',
  'alleppey': 'kerala', 'munnar': 'kerala', 'kochi': 'kerala', 'thiruvananthapuram': 'kerala',
  'coorg': 'kerala',
  'kovalam': 'kerala', 'thekkady': 'kerala', 'periyar': 'kerala', 'alappuzha': 'kerala',
  'kumarakom': 'kerala', 'wayanad kerala': 'kerala',
  'bengaluru': 'bangalore', 'blr': 'bangalore', 'nandi hills': 'bangalore',
  // Newly-added Indian destinations + sub-region aliases.
  'new delhi': 'delhi', 'old delhi': 'delhi', 'ncr': 'delhi',
  'pink city': 'jaipur',
  'taj mahal': 'agra',
  'pondy': 'pondicherry', 'puducherry': 'pondicherry', 'auroville': 'pondicherry',
  'havelock': 'andaman', 'port blair': 'andaman', 'neil island': 'andaman',
  'swaraj dweep': 'andaman', 'shaheed dweep': 'andaman',
  'kalimpong': 'darjeeling',
  // Kashmir spots — these are the towns within the Kashmir Valley itinerary.
  'srinagar': 'kashmir', 'gulmarg': 'kashmir', 'pahalgam': 'kashmir', 'sonmarg': 'kashmir',
  // Ladakh sub-regions / lakes / valleys.
  'kargil': 'ladakh', 'nubra': 'ladakh', 'pangong': 'ladakh', 'pangong tso': 'ladakh',
  // Meghalaya towns reached from Shillong.
  'cherrapunji': 'meghalaya', 'mawlynnong': 'meghalaya',
  // Himachal hill-station cluster reached from Manali / Dharamshala.
  'mcleod ganj': 'manali', 'mcleodganj': 'manali', 'dharamshala': 'manali',
  'kasol': 'manali', 'kullu': 'manali',
  // Maharashtra hill stations grouped under Mahabaleshwar.
  'panchgani': 'mahabaleshwar',
  // Braj region — Vrindavan covers the whole Krishna pilgrimage circuit.
  'mathura': 'vrindavan', 'barsana': 'vrindavan', 'gokul': 'vrindavan',
  'govardhan': 'vrindavan', 'braj': 'vrindavan', 'brij': 'vrindavan',
};

export function matchDestinationInfo(destination) {
  if (!destination) return null;
  const lower = destination.toLowerCase().trim();

  // Direct match
  if (DESTINATION_INFO[lower]) return DESTINATION_INFO[lower];

  // Alias match
  if (ALIASES[lower]) return DESTINATION_INFO[ALIASES[lower]];

  // Partial match — check if destination contains any key
  for (const key of Object.keys(DESTINATION_INFO)) {
    if (lower.includes(key) || key.includes(lower)) return DESTINATION_INFO[key];
  }

  // Alias partial match
  for (const [alias, key] of Object.entries(ALIASES)) {
    if (lower.includes(alias)) return DESTINATION_INFO[key];
  }

  return null;
}
