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
