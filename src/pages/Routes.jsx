import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import {
  Route, Train, Plane, Bus, Car, Ship, ArrowRight,
  Clock, Plus, MapPin, Zap, Wallet, Ruler, Trash2, Navigation, ExternalLink,
} from 'lucide-react';
import { getTripCurrencySymbol, getTripCurrencyCode } from '../lib/itinerary';

const INDIAN_ROUTES = {
  'goa|mumbai':             { dist: 600,  flight: [75, 4200, 'IndiGo / Air India · 1h 15m'], train: [480, 650, 'Konkan Kanya Express · 8h'], bus: [600, 400, 'Paulo Travels AC Sleeper · 10h'], car: [540, 2200, 'NH66 coastal highway · ~9h'] },
  'delhi|mumbai':           { dist: 1400, flight: [120, 5500, 'IndiGo / Vistara · 2h'], train: [960, 1400, 'Rajdhani Express · 16h'], bus: [1440, 900, 'Volvo AC · 24h'], car: [1320, 5000, 'NH48 · ~22h'] },
  'delhi|goa':              { dist: 1900, flight: [150, 6000, 'IndiGo / Air India · 2h 30m'], train: [1920, 1200, 'Goa Express · 32h'], bus: [2100, 1000, 'Private AC Sleeper · 35h'], car: [1980, 6500, 'NH48 + NH66 · ~33h'] },
  'bangalore|goa':          { dist: 560,  flight: [65, 4500, 'IndiGo / SpiceJet · 1h 5m'], train: [720, 500, 'Poorna Express · 12h'], bus: [660, 600, 'KSRTC / Paulo Travels · 11h'], car: [600, 2800, 'NH748 · ~10h'] },
  'goa|hyderabad':          { dist: 670,  flight: [80, 4800, 'Air India / IndiGo · 1h 20m'], train: [1020, 700, 'Amaravati Express · 17h'], bus: [960, 650, 'Orange Travels AC · 16h'], car: [900, 3200, 'NH65 + NH748 · 15h'] },
  'mumbai|pune':            { dist: 150,  flight: [45, 5000, 'Flight not advisable — too short'], train: [210, 300, 'Deccan Queen / Shatabdi · 3h 30m'], bus: [240, 250, 'Shivneri AC · 4h'], car: [180, 700, 'Expressway · 3h'] },
  'agra|delhi':             { dist: 230,  flight: [45, 6000, 'Flight not advisable — too short'], train: [120, 300, 'Gatimaan Express · 1h 40m (fastest)'], bus: [240, 200, 'UP Roadways · 4h'], car: [210, 800, 'Yamuna Expressway · 3h 30m'] },
  'delhi|jaipur':           { dist: 280,  flight: [55, 5500, 'Flight not advisable — too short'], train: [270, 400, 'Shatabdi Express · 4h 30m'], bus: [300, 350, 'RSRTC Volvo · 5h'], car: [270, 1000, 'NH48 · 4h 30m'] },
  'hyderabad|mumbai':       { dist: 710,  flight: [90, 4800, 'IndiGo / Air India · 1h 30m'], train: [780, 900, 'Hussainsagar Express · 13h'], bus: [840, 700, 'Orange Travels · 14h'], car: [810, 3000, 'NH65 · 13h 30m'] },
  'bangalore|hyderabad':    { dist: 570,  flight: [75, 4200, 'IndiGo / Vistara · 1h 15m'], train: [660, 600, 'Rajdhani / Shatabdi · 11h'], bus: [540, 550, 'VRL Travels Volvo · 9h'], car: [600, 2400, 'NH44 · 10h'] },
  'delhi|shimla':           { dist: 340,  flight: [60, 6500, 'Alliance Air · 1h (seasonal)'], train: [420, 350, 'Kalka Shatabdi + Toy Train · 7h'], bus: [480, 400, 'HRTC Volvo · 8h'], car: [420, 1800, 'NH5 · 7h'] },
  'delhi|manali':           { dist: 570,  flight: [70, 8000, 'Bhuntar Airport + taxi · 1h + 2h'], train: [900, 500, 'Train to Chandigarh + bus · 15h'], bus: [780, 600, 'Volvo AC Sleeper · 13h'], car: [780, 3000, 'NH3 via Kullu · 13h'] },
  'mahabaleshwar|mumbai':   { dist: 260,  flight: [0, 0, 'No direct flight'], train: [210, 300, 'Train to Pune + cab · 3h 30m'], bus: [240, 350, 'MSRTC Shivshahi · 4h'], car: [180, 900, 'Expressway + Ghats · 3h'] },
  'mahabaleshwar|pune':     { dist: 120,  flight: [0, 0, 'No direct flight'], train: [0, 0, 'No direct train'], bus: [180, 150, 'MSRTC / Private buses · 3h'], car: [150, 400, 'NH48 + Panchgani Rd · 2h 30m'] },
  'mumbai|udaipur':         { dist: 780,  flight: [90, 5000, 'IndiGo · 1h 30m'], train: [720, 700, 'Bandra Terminus Express · 12h'], bus: [960, 800, 'Private Volvo · 16h'], car: [840, 3500, 'NH48 + NH27 · 14h'] },
  'delhi|varanasi':         { dist: 820,  flight: [90, 5000, 'IndiGo / Vistara · 1h 30m'], train: [660, 700, 'Vande Bharat Express · 8h (fastest)'], bus: [780, 500, 'UP Roadways AC · 13h'], car: [720, 2800, 'NH19 · 12h'] },
  'delhi|wayanad':          { dist: 2600, flight: [210, 7500, 'Delhi → Calicut (IndiGo / Air India · 3h) + 2.5h drive to Wayanad'], train: [2400, 1500, 'Kerala Express to Kozhikode · 40h + cab to Wayanad'], bus: [2640, 1200, 'Delhi → Bangalore KSRTC + bus to Wayanad · 44h'], car: [2400, 9500, 'NH44 via Bangalore · ~40h (2-day drive)'] },
  'bangalore|wayanad':      { dist: 280,  flight: [60, 5000, 'Fly to Calicut (1h) + 2.5h drive'], train: [600, 450, 'Train to Kozhikode · 10h + cab 2.5h'], bus: [360, 600, 'KSRTC Volvo to Sultan Bathery · 6h'], car: [330, 1500, 'NH275 via Mysore · 5h 30m'] },
  'delhi|kerala':           { dist: 2600, flight: [195, 7000, 'IndiGo / Air India to Kochi · 3h 15m'], train: [2400, 1500, 'Kerala Express · 40h'], bus: [2640, 1200, 'Multi-stop private buses · 44h'], car: [2400, 9500, 'NH44 via Bangalore · ~40h'] },
  'delhi|calicut':          { dist: 2550, flight: [180, 7000, 'IndiGo / Air India · 3h direct'], train: [2280, 1400, 'Mangala Express / Kerala Express · 38h'], bus: [2520, 1100, 'Private AC sleeper · 42h'], car: [2340, 9000, 'NH44 + NH66 · ~39h'] },
  'mumbai|wayanad':         { dist: 1100, flight: [150, 5500, 'Mumbai → Calicut (IndiGo · 1h 40m) + 2.5h drive'], train: [1200, 900, 'Netravati Express to Kozhikode · 20h + cab'], bus: [1080, 700, 'Private AC sleeper to Kozhikode · 18h + cab'], car: [1020, 4500, 'NH66 coastal route · 17h'] },
  // Vrindavan corridor — air route is via Delhi (or Agra Kheria for limited
  // service); trains stop at Mathura Junction (~30min drive to Vrindavan).
  'agra|vrindavan':         { dist: 75,   flight: [0, 0, 'Flight not advisable — too short'], train: [60, 50, 'Agra → Mathura passenger train · ~1h + 30min drive'], bus: [90, 100, 'Agra → Mathura UP Roadways · ~1h 30m'], car: [90, 400, 'NH19 via Mathura · ~1h 30m'] },
  'delhi|vrindavan':        { dist: 150,  flight: [0, 0, 'Flight not advisable — too short'], train: [180, 350, 'Delhi → Mathura Junction Shatabdi · ~2h + 30min drive'], bus: [240, 250, 'Delhi → Mathura UP Roadways AC · ~4h + auto'], car: [180, 800, 'Yamuna Expressway via Mathura · ~3h'] },
  'mumbai|vrindavan':       { dist: 1180, flight: [390, 6500, 'Mumbai → Delhi (~2h) + 3.5h drive · or limited Agra Kheria flights'], train: [1200, 1100, 'Bandra Terminus → Mathura Junction · ~20h + drive'], bus: [1320, 1200, 'Mumbai → Mathura private AC sleeper · ~22h'], car: [1140, 5500, 'NH48 + NH3 via Indore · ~19h, two-day drive'] },
  'pune|vrindavan':         { dist: 1320, flight: [420, 7000, 'Pune → Delhi (~2.5h) + 3.5h drive'], train: [1380, 1200, 'Pune → Mathura via Bhopal change · ~23h'], bus: [1740, 1500, 'Pune → Mathura private buses with change · ~29h'], car: [1320, 6500, 'NH160 + NH48 via Bhopal · ~22h, two-day drive'] },
  'bangalore|vrindavan':    { dist: 2050, flight: [390, 6500, 'Bangalore → Delhi (~3h) + 3.5h drive'], train: [2280, 1700, 'Karnataka SK Express to Mathura · ~38h'], bus: [2520, 2000, 'Multi-stop private buses · ~42h'], car: [1980, 9500, 'NH44 via Hyderabad + Nagpur · ~33h'] },

  // ── Delhi corridor (cross-India arrivals — agra|delhi & delhi|jaipur exist above) ──
  'bangalore|delhi':        { dist: 2150, flight: [165, 5500, 'IndiGo / Vistara · 2h 45m'], train: [2160, 2000, 'Karnataka SK Express · ~36h'], bus: [2400, 2200, 'Multi-stop private buses · ~40h'], car: [2100, 9500, 'NH44 via Hyderabad + Nagpur · ~35h, two-day drive'] },
  'chennai|delhi':          { dist: 2200, flight: [165, 5500, 'IndiGo / Air India · 2h 45m'], train: [2040, 1800, 'Tamil Nadu Express · ~34h'], bus: [2520, 2300, 'Multi-stop private · ~42h'], car: [2160, 10000, 'NH44 · ~36h, two-day drive'] },
  'delhi|hyderabad':        { dist: 1500, flight: [120, 5000, 'IndiGo / Vistara · 2h'], train: [1500, 1500, 'Telangana / AP Express · ~25h'], bus: [1800, 1700, 'Private Volvo · ~30h'], car: [1500, 7500, 'NH44 · ~25h'] },
  'delhi|kolkata':          { dist: 1500, flight: [135, 4800, 'IndiGo / Vistara · 2h 15m'], train: [1020, 1500, 'Rajdhani Express · ~17h (fastest)'], bus: [1500, 1500, 'Multi-stop private · ~25h'], car: [1620, 7500, 'NH19 / Grand Trunk Road · ~27h'] },
  'delhi|mumbai':           { dist: 1400, flight: [135, 5500, 'IndiGo / Vistara · 2h 15m'], train: [960, 1500, 'Rajdhani Express · ~16h (fastest)'], bus: [1500, 1500, 'Private AC sleeper · ~25h'], car: [1380, 7500, 'NH48 · ~23h'] },
  'delhi|pune':             { dist: 1430, flight: [150, 5500, 'IndiGo / Vistara · 2h 30m'], train: [1080, 1500, 'Jhelum Express · ~18h'], bus: [1620, 1500, 'Private AC sleeper · ~27h'], car: [1410, 7500, 'NH48 · ~23h 30m'] },

  // ── Jaipur corridor ──
  'bangalore|jaipur':       { dist: 2130, flight: [180, 6000, 'IndiGo / Vistara · 3h'], train: [2100, 1900, 'Yeshwantpur–Jaipur Express · ~35h'], bus: [2400, 2300, 'Multi-stop private · ~40h'], car: [2040, 9000, 'NH44 + NH52 · ~34h, two-day'] },
  'chennai|jaipur':         { dist: 2150, flight: [180, 6500, 'IndiGo · 3h'], train: [2100, 1800, 'Chennai–Jaipur Express · ~35h'], bus: [2520, 2300, 'Multi-stop private · ~42h'], car: [2100, 10000, 'NH44 + NH52 · ~35h'] },
  'hyderabad|jaipur':       { dist: 1500, flight: [135, 5000, 'IndiGo / Vistara · 2h 15m'], train: [1620, 1500, 'Hyderabad–Jaipur SF · ~27h'], bus: [1800, 1700, 'Private Volvo · ~30h'], car: [1500, 7000, 'NH44 + NH52 · ~25h'] },
  'jaipur|kolkata':         { dist: 1700, flight: [165, 5500, 'IndiGo · 2h 45m'], train: [1620, 1700, 'Howrah–Jaipur Express · ~27h'], bus: [2040, 2000, 'Multi-stop private · ~34h'], car: [1740, 8000, 'NH48 + NH19 · ~29h'] },
  'jaipur|mumbai':          { dist: 1150, flight: [105, 4500, 'IndiGo · 1h 45m'], train: [1020, 1100, 'Jaipur–Mumbai SF · ~17h'], bus: [1320, 1300, 'Private Volvo · ~22h'], car: [1080, 5000, 'NH48 · ~18h'] },
  'jaipur|pune':            { dist: 1180, flight: [120, 5000, 'IndiGo · 2h'], train: [1200, 1200, 'Pune–Jaipur Express · ~20h'], bus: [1380, 1500, 'Private AC sleeper · ~23h'], car: [1140, 5500, 'NH48 · ~19h'] },

  // ── Agra corridor (agra|delhi and agra|vrindavan exist above) ──
  'agra|bangalore':         { dist: 1960, flight: [180, 7000, 'Bangalore → Delhi (3h) + 3.5h drive · or limited Agra Kheria flights'], train: [2280, 1700, 'Karnataka SK Express to Tundla/Agra · ~38h'], bus: [2520, 2000, 'Multi-stop private · ~42h'], car: [1980, 9000, 'NH44 · ~33h, two-day'] },
  'agra|chennai':           { dist: 2050, flight: [195, 7500, 'Chennai → Delhi (3h) + 3.5h drive'], train: [2280, 1800, 'Tamil Nadu Express to Agra Cantt · ~38h'], bus: [2580, 2200, 'Multi-stop private · ~43h'], car: [2040, 9500, 'NH44 · ~34h, two-day'] },
  'agra|hyderabad':         { dist: 1320, flight: [150, 6000, 'Hyderabad → Delhi (2h) + 3.5h drive'], train: [1500, 1300, 'Hyderabad–Tundla Express · ~25h'], bus: [1800, 1500, 'Private Volvo · ~30h'], car: [1380, 6500, 'NH44 · ~23h'] },
  'agra|kolkata':           { dist: 1300, flight: [165, 5500, 'Kolkata → Delhi (2h) + 3.5h drive'], train: [1320, 1300, 'Howrah–Agra connections · ~22h'], bus: [1680, 1500, 'Multi-stop private · ~28h'], car: [1500, 7000, 'NH19 + Yamuna Expressway · ~25h'] },
  'agra|mumbai':            { dist: 1230, flight: [195, 6000, 'Mumbai → Delhi (~2h) + 3.5h drive · or limited Agra Kheria flights'], train: [1380, 1300, 'Punjab Mail to Agra Cantt · ~23h'], bus: [1380, 1500, 'Private Volvo · ~23h'], car: [1200, 5500, 'NH48 + Yamuna Expressway · ~20h'] },
  'agra|pune':              { dist: 1280, flight: [240, 7000, 'Pune → Delhi (2.5h) + 3.5h drive'], train: [1440, 1300, 'Pune–Agra connections · ~24h'], bus: [1620, 1700, 'Multi-stop private · ~27h'], car: [1320, 6500, 'NH48 + Yamuna Expressway · ~22h'] },

  // ── Rishikesh / Haridwar gateway corridor ──
  'bangalore|rishikesh':    { dist: 2350, flight: [225, 6500, 'Bangalore → Delhi (3h) + 5h drive · or Bangalore → Dehradun via Delhi'], train: [2520, 2000, 'Yeshwantpur to Haridwar · ~42h'], bus: [2700, 2400, 'Multi-stop private · ~45h'], car: [2280, 10000, 'NH44 + NH334 · ~38h, two-day'] },
  'chennai|rishikesh':      { dist: 2400, flight: [225, 7000, 'Chennai → Delhi (3h) + 5h drive'], train: [2520, 2000, 'Tamil Nadu Express + Haridwar passenger · ~42h'], bus: [2700, 2400, 'Multi-stop private · ~45h'], car: [2340, 10500, 'NH44 + NH334 · ~39h, two-day'] },
  'delhi|rishikesh':        { dist: 250,  flight: [0, 0, 'Flight not advisable — too short'], train: [360, 400, 'Yog Nagari Vande Bharat · ~6h · or Haridwar Shatabdi 4.5h + drive'], bus: [420, 400, 'UP/HRTC AC bus to Haridwar/Rishikesh · ~7h'], car: [300, 1500, 'NH334 via Meerut · ~5h'] },
  'hyderabad|rishikesh':    { dist: 1750, flight: [180, 6000, 'Hyderabad → Delhi (2h) + 5h drive'], train: [1860, 1700, 'Hyderabad to Haridwar via Delhi · ~31h'], bus: [2160, 2200, 'Multi-stop private · ~36h'], car: [1740, 8500, 'NH44 + NH334 · ~29h'] },
  'kolkata|rishikesh':      { dist: 1500, flight: [195, 6000, 'Kolkata → Delhi (2h) + 5h drive · or Kolkata → Dehradun via Delhi'], train: [1620, 1500, 'Doon Express · ~27h'], bus: [1980, 2000, 'Multi-stop private · ~33h'], car: [1740, 8000, 'NH19 + NH334 · ~29h'] },
  'mumbai|rishikesh':       { dist: 1640, flight: [180, 5500, 'Mumbai → Delhi (~2h) + 5h drive · or Mumbai → Dehradun via Delhi'], train: [1620, 1500, 'Bandra Terminus to Haridwar · ~27h'], bus: [1980, 2000, 'Multi-stop private · ~33h'], car: [1620, 8000, 'NH48 + NH334 · ~27h'] },
  'pune|rishikesh':         { dist: 1700, flight: [240, 7000, 'Pune → Delhi (2.5h) + 5h drive'], train: [1740, 1500, 'Pune–Haridwar via Delhi · ~29h'], bus: [2160, 2200, 'Multi-stop private · ~36h'], car: [1680, 8000, 'NH48 + NH334 · ~28h'] },

  // ── Darjeeling / Bagdogra / NJP corridor ──
  'bangalore|darjeeling':   { dist: 2300, flight: [195, 7000, 'Bangalore → Bagdogra (3h direct) + 3h drive'], train: [2280, 1700, 'Yeshwantpur to NJP · ~38h'], bus: [2700, 2400, 'Multi-stop private · ~45h'], car: [2280, 10500, 'NH44 + NH27 · ~38h, two-day'] },
  'chennai|darjeeling':     { dist: 2050, flight: [165, 6500, 'Chennai → Bagdogra (~2h 45m via Kolkata) + 3h drive'], train: [2160, 1700, 'Tamil Nadu Express + transfer to NJP · ~36h'], bus: [2580, 2300, 'Multi-stop · ~43h'], car: [2160, 10000, 'NH16 · ~36h'] },
  'darjeeling|delhi':       { dist: 1500, flight: [195, 6500, 'Delhi → Bagdogra (2h 30m direct) + 3h drive'], train: [1320, 1300, 'Padatik Express to NJP · ~22h'], bus: [1980, 2000, 'Multi-stop private · ~33h'], car: [1620, 7500, 'NH19 + NH27 · ~27h'] },
  'darjeeling|hyderabad':   { dist: 1800, flight: [180, 6000, 'Hyderabad → Bagdogra (~2h direct) + 3h drive'], train: [1980, 1700, 'Hyderabad–Howrah + transfer to NJP · ~33h'], bus: [2280, 2200, 'Multi-stop · ~38h'], car: [1860, 8500, 'NH16 · ~31h'] },
  'darjeeling|kolkata':     { dist: 600,  flight: [120, 4000, 'Kolkata → Bagdogra (~1h direct) + 3h drive'], train: [600, 700, 'Darjeeling Mail / Kanchanjunga Exp to NJP · ~10h'], bus: [780, 1000, 'Volvo to NJP/Siliguri · ~13h'], car: [720, 3500, 'NH27 · ~12h'] },
  'darjeeling|mumbai':      { dist: 2000, flight: [165, 6000, 'Mumbai → Bagdogra (~2h 45m via Kolkata) + 3h drive'], train: [2100, 1700, 'Bandra Terminus to NJP · ~35h'], bus: [2520, 2300, 'Multi-stop · ~42h'], car: [2100, 9500, 'NH27 + NH19 · ~35h'] },
  'darjeeling|pune':        { dist: 2000, flight: [195, 6500, 'Pune → Bagdogra via Delhi/Kolkata + 3h drive'], train: [2160, 1700, 'Pune to NJP via Howrah · ~36h'], bus: [2580, 2400, 'Multi-stop · ~43h'], car: [2100, 9500, 'NH27 + NH19 · ~35h'] },

  // ── Pondicherry corridor (Chennai is the gateway) ──
  'bangalore|pondicherry':  { dist: 320,  flight: [60, 3500, 'Flight not advisable — too short. Tiny ATR flights via Pondicherry airport are limited.'], train: [420, 350, 'Yeshwantpur to Pondicherry · ~7h (limited)'], bus: [420, 600, 'KSRTC Volvo direct · ~7h'], car: [360, 1700, 'NH44 + NH77 · ~6h'] },
  'chennai|pondicherry':    { dist: 165,  flight: [0, 0, 'Flight not advisable — too short'], train: [240, 200, 'Chennai Egmore to Villupuram + bus · ~4h'], bus: [180, 200, 'PRTC / Private Volvo · ~3h'], car: [180, 800, 'East Coast Road · ~3h scenic drive'] },
  'delhi|pondicherry':      { dist: 2000, flight: [195, 6500, 'Delhi → Chennai (3h direct) + 3h drive'], train: [2160, 1800, 'Tamil Nadu Express to Chennai + bus · ~36h'], bus: [2580, 2300, 'Multi-stop private · ~43h'], car: [2100, 9500, 'NH44 + ECR · ~35h'] },
  'hyderabad|pondicherry':  { dist: 600,  flight: [120, 4500, 'Hyderabad → Chennai (1h) + 3h drive'], train: [780, 700, 'Hyderabad–Chennai + bus · ~13h'], bus: [840, 1000, 'Hyderabad–Pondicherry private · ~14h'], car: [780, 4000, 'NH44 + NH16 · ~13h'] },
  'kolkata|pondicherry':    { dist: 1700, flight: [180, 6000, 'Kolkata → Chennai (2h) + 3h drive'], train: [1500, 1500, 'Coromandel Express to Chennai + bus · ~25h'], bus: [2040, 2000, 'Multi-stop · ~34h'], car: [1740, 8000, 'NH16 + ECR · ~29h'] },
  'mumbai|pondicherry':     { dist: 1330, flight: [165, 5000, 'Mumbai → Chennai (2h) + 3h drive'], train: [1380, 1300, 'Mumbai–Chennai + bus · ~23h'], bus: [1620, 1700, 'Multi-stop · ~27h'], car: [1380, 6500, 'NH48 + NH44 · ~23h'] },
  'pondicherry|pune':       { dist: 1280, flight: [225, 5500, 'Pune → Chennai (1h 30m) + 3h drive'], train: [1380, 1300, 'Pune–Chennai + bus · ~23h'], bus: [1620, 1700, 'Multi-stop · ~27h'], car: [1320, 6500, 'NH48 + NH44 · ~22h'] },

  // ── Andaman corridor (flight only — no road or ferry from mainland for tourism) ──
  'andaman|bangalore':      { dist: 1670, flight: [195, 6500, 'Bangalore → Port Blair direct · 3h 15m'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], car: [0, 0, 'No road to Andaman'] },
  'andaman|chennai':        { dist: 1300, flight: [135, 5500, 'Chennai → Port Blair direct · 2h 15m (cheapest gateway)'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], ferry: [4320, 5000, 'MV Swaraj Dweep cargo passenger ship · ~3 days · check Directorate of Shipping for limited schedules'] },
  'andaman|delhi':          { dist: 2500, flight: [300, 7500, 'Delhi → Port Blair via Chennai/Kolkata · ~5h with stop'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], car: [0, 0, 'No road to Andaman'] },
  'andaman|hyderabad':      { dist: 1900, flight: [180, 6500, 'Hyderabad → Port Blair via Chennai · ~3h with stop'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], car: [0, 0, 'No road to Andaman'] },
  'andaman|kolkata':        { dist: 1300, flight: [135, 5500, 'Kolkata → Port Blair direct · 2h 15m'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], ferry: [3600, 4500, 'MV Nicobar cargo passenger ship · ~3 days · limited schedules'] },
  'andaman|mumbai':         { dist: 1900, flight: [195, 6500, 'Mumbai → Port Blair via Chennai/Bangalore · ~4h with stop'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], car: [0, 0, 'No road to Andaman'] },
  'andaman|pune':           { dist: 1900, flight: [240, 7000, 'Pune → Port Blair via Mumbai/Chennai · ~5h with stop'], train: [0, 0, 'No rail to Andaman'], bus: [0, 0, 'No road to Andaman'], car: [0, 0, 'No road to Andaman'] },
};

const MODE_CONFIG = {
  flight: { icon: Plane,  color: '#8b5cf6', bg: '#f5f3ff', label: 'Flight'     },
  train:  { icon: Train,  color: '#0ea5e9', bg: '#e0f2fe', label: 'Train'      },
  bus:    { icon: Bus,    color: '#10b981', bg: '#d1fae5', label: 'Bus'        },
  car:    { icon: Car,    color: '#f97316', bg: '#ffedd5', label: 'Self Drive' },
  ferry:  { icon: Ship,   color: '#0891b2', bg: '#cffafe', label: 'Ferry'      },
};

function citySlug(city) {
  return city.toLowerCase().trim().replace(/\s+/g, '-');
}

const BOOKING_PLATFORMS = {
  flight: [
    { name: 'MakeMyTrip',  buildUrl: (f, t) => `https://www.makemytrip.com/flights/${citySlug(f)}-${citySlug(t)}-cheap-flights.html` },
    { name: 'Cleartrip',   buildUrl: (f, t) => `https://www.cleartrip.com/flights/${citySlug(f)}-to-${citySlug(t)}` },
  ],
  train: [
    { name: 'IRCTC',       buildUrl: () => 'https://www.irctc.co.in/nget/train-search' },
    { name: 'ConfirmTkt',  buildUrl: (f, t) => `https://www.confirmtkt.com/trains/${citySlug(f)}-to-${citySlug(t)}` },
  ],
  bus: [
    { name: 'RedBus',      buildUrl: (f, t) => `https://www.redbus.in/bus-tickets/${citySlug(f)}-to-${citySlug(t)}` },
    { name: 'AbhiBus',     buildUrl: (f, t) => `https://www.abhibus.com/bus-tickets/${citySlug(f)}-to-${citySlug(t)}` },
  ],
  car: [
    { name: 'Savaari',     buildUrl: (f, t) => `https://www.savaari.com/cab/${citySlug(f)}-to-${citySlug(t)}` },
    { name: 'Zoomcar',     buildUrl: () => 'https://www.zoomcar.com/' },
  ],
  ferry: [
    { name: 'DirectFerries', buildUrl: () => 'https://www.directferries.com/' },
    { name: 'Search routes', buildUrl: (f, t) => `https://www.google.com/search?q=${encodeURIComponent(`ferry ${f} to ${t}`)}` },
  ],
};

// Cities without their own commercial airport (or with very limited service)
// mapped to the nearest practical airport plus drive time. Lookup is
// case-insensitive on the normalized city name.
const NEAREST_AIRPORT = {
  wayanad:             { airport: 'Calicut (Kozhikode)',          drive: '~2.5h drive' },
  mahabaleshwar:       { airport: 'Pune',                          drive: '~3h drive' },
  manali:              { airport: 'Bhuntar (Kullu)',               drive: '~1h drive · or Chandigarh ~7h' },
  shimla:              { airport: 'Chandigarh',                    drive: '~4h drive · Shimla airport has limited service' },
  coorg:               { airport: 'Mangalore',                     drive: '~3h drive · or Bangalore ~5h' },
  munnar:              { airport: 'Cochin (Kochi)',                drive: '~4h drive' },
  alleppey:            { airport: 'Cochin (Kochi)',                drive: '~1.5h drive' },
  thekkady:            { airport: 'Madurai or Cochin',             drive: '~4h / ~5h drive' },
  mussoorie:           { airport: 'Dehradun (Jolly Grant)',        drive: '~1.5h drive' },
  nainital:            { airport: 'Pantnagar',                     drive: '~1.5h drive · or Delhi ~7h' },
  rishikesh:           { airport: 'Dehradun (Jolly Grant)',        drive: '~30 min drive' },
  haridwar:            { airport: 'Dehradun (Jolly Grant)',        drive: '~1h drive' },
  pushkar:             { airport: 'Jaipur',                        drive: '~2.5h drive' },
  'mount abu':         { airport: 'Udaipur',                       drive: '~3h drive · or Ahmedabad ~4.5h' },
  spiti:               { airport: 'Bhuntar (Kullu)',               drive: '~8h mountain drive' },
  'spiti valley':      { airport: 'Bhuntar (Kullu)',               drive: '~8h mountain drive' },
  kasol:               { airport: 'Bhuntar (Kullu)',               drive: '~1.5h drive' },
  dharamshala:         { airport: 'Gaggal (Kangra)',               drive: '~45 min drive' },
  'mcleod ganj':       { airport: 'Gaggal (Kangra)',               drive: '~1.5h drive' },
  'ajanta & ellora':   { airport: 'Aurangabad',                    drive: '~30 min – 2h drive' },
  ajanta:              { airport: 'Aurangabad',                    drive: '~2h drive' },
  ellora:              { airport: 'Aurangabad',                    drive: '~30 min drive' },
  khajuraho:           { airport: 'Khajuraho',                     drive: 'small airport · seasonal flights from Delhi/Varanasi' },
  hampi:               { airport: 'Hubli',                         drive: '~3h drive · or Bangalore ~6h' },
  konark:              { airport: 'Bhubaneswar',                   drive: '~1.5h drive' },
  puri:                { airport: 'Bhubaneswar',                   drive: '~1h drive' },
  'bodh gaya':         { airport: 'Gaya',                          drive: '~30 min drive · or Patna ~2.5h' },
  bodhgaya:            { airport: 'Gaya',                          drive: '~30 min drive · or Patna ~2.5h' },
  'jim corbett':       { airport: 'Pantnagar',                     drive: '~1.5h drive · or Delhi ~5h' },
  corbett:             { airport: 'Pantnagar',                     drive: '~1.5h drive · or Delhi ~5h' },
  kaziranga:           { airport: 'Jorhat',                        drive: '~1.5h drive · or Guwahati ~4h' },
  tawang:              { airport: 'Tezpur',                        drive: '~10h mountain drive · or Guwahati ~12h' },
  cherrapunji:         { airport: 'Shillong (Umroi)',              drive: '~2h drive · or Guwahati ~3.5h' },
  mahabalipuram:       { airport: 'Chennai',                       drive: '~1.5h drive' },
  kanyakumari:         { airport: 'Trivandrum',                    drive: '~2h drive' },
  pondicherry:         { airport: 'Pondicherry',                   drive: 'small airport · most fly into Chennai (~3h drive)' },
  puducherry:          { airport: 'Pondicherry',                   drive: 'small airport · most fly into Chennai (~3h drive)' },
  mysore:              { airport: 'Mysore',                        drive: 'limited airport · or Bangalore ~3.5h drive' },
  'statue of unity':   { airport: 'Vadodara',                      drive: '~2h drive · or Surat ~2.5h' },
  'rann of kutch':     { airport: 'Bhuj',                          drive: '~1h drive · or Ahmedabad ~5h' },
  kutch:               { airport: 'Bhuj',                          drive: '~1h drive' },
  gir:                 { airport: 'Rajkot',                        drive: '~3h drive' },
  'gir national park': { airport: 'Rajkot',                        drive: '~3h drive' },
  jaisalmer:           { airport: 'Jaisalmer',                     drive: 'small airport · or Jodhpur ~5h drive' },
  ladakh:              { airport: 'Leh',                           drive: 'flights from Delhi only' },
  leh:                 { airport: 'Leh',                           drive: 'flights from Delhi only' },
  kashmir:             { airport: 'Srinagar',                      drive: 'flights from Delhi/Mumbai' },
  meghalaya:           { airport: 'Shillong (Umroi)',              drive: 'limited · most fly into Guwahati (~3h drive)' },
  shillong:            { airport: 'Shillong (Umroi)',              drive: 'limited · most fly into Guwahati (~3h drive)' },
  ayodhya:             { airport: 'Ayodhya (Maryada Purushottam)', drive: 'small airport · or Lucknow ~3h drive' },
  'andaman islands':   { airport: 'Port Blair',                    drive: 'flights from Chennai/Kolkata/Delhi' },
  andaman:             { airport: 'Port Blair',                    drive: 'flights from Chennai/Kolkata/Delhi' },
  // Braj region (Mathura, Vrindavan and surrounds) — no commercial airport;
  // closest is Agra Kheria with limited schedules, Delhi IGI for full service.
  vrindavan:           { airport: 'Agra (Kheria)',                 drive: '~1.5h drive · or Delhi (IGI) ~3.5h' },
  mathura:             { airport: 'Agra (Kheria)',                 drive: '~1h drive · or Delhi (IGI) ~3h' },
  // Eastern Himalayas — Bagdogra (IXB) is the gateway airport for Darjeeling and Sikkim.
  darjeeling:          { airport: 'Bagdogra (IXB)',                drive: '~3h drive' },
  kalimpong:           { airport: 'Bagdogra (IXB)',                drive: '~3h drive' },
  gangtok:             { airport: 'Bagdogra (IXB)',                drive: '~4.5h drive · or Pakyong ~30 min (limited service)' },
  pelling:             { airport: 'Bagdogra (IXB)',                drive: '~5h drive' },
  sikkim:              { airport: 'Bagdogra (IXB)',                drive: '~3-5h drive depending on destination' },
};

function nearestAirportFor(city) {
  if (!city) return null;
  const k = city.toLowerCase().trim();
  return NEAREST_AIRPORT[k] || null;
}

// Same idea as NEAREST_AIRPORT but for trains. Listed only for cities
// that don't have their own railway station — or whose station has very
// limited service so a nearby junction is the practical choice.
const NEAREST_STATION = {
  wayanad:             { station: 'Kozhikode (Calicut)',     drive: '~2.5h drive' },
  mahabaleshwar:       { station: 'Wathar',                  drive: '~45 min drive · or Pune ~3h' },
  manali:              { station: 'Joginder Nagar',          drive: '~5h on the narrow gauge · or Chandigarh ~8h drive' },
  shimla:              { station: 'Kalka',                   drive: 'change to UNESCO Toy Train · ~6h total · or Chandigarh ~4h drive' },
  coorg:               { station: 'Mysore',                  drive: '~3h drive · or Mangalore ~4h' },
  munnar:              { station: 'Aluva (Ernakulam)',       drive: '~4h drive' },
  thekkady:            { station: 'Kottayam',                drive: '~4h drive' },
  mussoorie:           { station: 'Dehradun',                drive: '~1h drive' },
  nainital:            { station: 'Kathgodam',               drive: '~1h drive' },
  pushkar:             { station: 'Ajmer',                   drive: '~30 min drive' },
  'mount abu':         { station: 'Abu Road',                drive: '~45 min drive' },
  spiti:               { station: 'Joginder Nagar',          drive: '~10h+ mountain drive' },
  'spiti valley':      { station: 'Joginder Nagar',          drive: '~10h+ mountain drive' },
  kasol:               { station: 'Joginder Nagar',          drive: '~4h drive · or Chandigarh ~8h' },
  dharamshala:         { station: 'Pathankot (Chakki Bank)', drive: '~3.5h drive' },
  'mcleod ganj':       { station: 'Pathankot (Chakki Bank)', drive: '~4h drive' },
  ajanta:              { station: 'Jalgaon',                 drive: '~1h drive · or Aurangabad ~2h' },
  ellora:              { station: 'Aurangabad',              drive: '~45 min drive' },
  'ajanta & ellora':   { station: 'Aurangabad / Jalgaon',    drive: '~45 min – 2h drive' },
  hampi:               { station: 'Hosapete (Hospet)',       drive: '~30 min drive' },
  konark:              { station: 'Puri',                    drive: '~1h drive · or Bhubaneswar ~1.5h' },
  'bodh gaya':         { station: 'Gaya',                    drive: '~30 min drive' },
  bodhgaya:            { station: 'Gaya',                    drive: '~30 min drive' },
  'jim corbett':       { station: 'Ramnagar',                drive: 'small terminus · or Kathgodam ~3h drive' },
  corbett:             { station: 'Ramnagar',                drive: 'small terminus · or Kathgodam ~3h drive' },
  kaziranga:           { station: 'Furkating or Guwahati',   drive: '~2h / ~4h drive' },
  cherrapunji:         { station: 'Guwahati',                drive: '~3.5h drive · no rail in Meghalaya' },
  meghalaya:           { station: 'Guwahati',                drive: '~3-4h drive · no rail in Meghalaya' },
  shillong:            { station: 'Guwahati',                drive: '~3.5h drive · no rail in Meghalaya' },
  tawang:              { station: 'Rangapara North',         drive: '~10h mountain drive' },
  mahabalipuram:       { station: 'Chengalpattu',            drive: '~30 min drive · or Chennai ~1.5h' },
  pondicherry:         { station: 'Pondicherry',             drive: 'small station · most route via Chennai (~3h drive)' },
  puducherry:          { station: 'Pondicherry',             drive: 'small station · most route via Chennai (~3h drive)' },
  'statue of unity':   { station: 'Kevadia',                 drive: 'limited service · or Vadodara ~2h drive' },
  'rann of kutch':     { station: 'Bhuj',                    drive: '~1h drive' },
  kutch:               { station: 'Bhuj',                    drive: '~1h drive' },
  gir:                 { station: 'Veraval',                 drive: '~1.5h drive · or Junagadh ~2h' },
  'gir national park': { station: 'Veraval',                 drive: '~1.5h drive · or Junagadh ~2h' },
  kashmir:             { station: 'Jammu Tawi',              drive: '~7h drive to Srinagar · rail extension to Banihal' },
  // Braj region — Mathura Junction is the main rail hub; the Vrindavan terminus is narrow-gauge.
  vrindavan:           { station: 'Mathura Junction',        drive: '~30 min drive · Vrindavan terminus has very limited service' },
  // Rishikesh has a small terminus (Yog Nagari Rishikesh) — most major trains stop at Haridwar Junction.
  rishikesh:           { station: 'Haridwar Junction',       drive: '~30 min drive · Rishikesh terminus has very limited service' },
  // Eastern Himalayas — New Jalpaiguri (NJP) is the major rail hub for Darjeeling and Sikkim.
  darjeeling:          { station: 'New Jalpaiguri (NJP)',    drive: '~3h drive · Darjeeling toy train terminus is UNESCO but very limited service' },
  kalimpong:           { station: 'New Jalpaiguri (NJP)',    drive: '~2.5h drive' },
  gangtok:             { station: 'New Jalpaiguri (NJP)',    drive: '~4h drive · no rail in Sikkim itself' },
  pelling:             { station: 'New Jalpaiguri (NJP)',    drive: '~5h drive · no rail in Sikkim itself' },
  sikkim:              { station: 'New Jalpaiguri (NJP)',    drive: '~3-5h drive · no rail in Sikkim itself' },
};

function nearestStationFor(city) {
  if (!city) return null;
  const k = city.toLowerCase().trim();
  return NEAREST_STATION[k] || null;
}

function getRouteKey(a, b) {
  return [a, b].map(s => s.toLowerCase().trim()).sort().join('|');
}

function getRouteDistance(from, to) {
  const data = INDIAN_ROUTES[getRouteKey(from, to)];
  return data?.dist ?? null;
}

// ── Region-based flight estimator ──────────────────────────────
// We don't hallucinate a single price — instead we publish a public range
// derived from typical economy fares (Skyscanner / Google Flights medians)
// and tag every result `estimated: true`. The user is told to verify before
// booking. Numbers are deliberately conservative to avoid optimism bias.
const REGION_KEYWORDS = {
  india:   ['mumbai', 'pune', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 'goa', 'kerala', 'kochi', 'jaipur', 'agra', 'shimla', 'manali', 'wayanad', 'ladakh', 'leh', 'meghalaya', 'shillong', 'varanasi', 'mahabaleshwar', 'udaipur', 'ahmedabad', 'lucknow', 'ooty', 'hampi', 'mangalore', 'ayodhya', 'amritsar', 'jaisalmer', 'jodhpur', 'pushkar', 'mount abu', 'rishikesh', 'haridwar', 'nainital', 'mussoorie', 'jim corbett', 'corbett', 'dharamshala', 'mcleod ganj', 'mcleodganj', 'spiti', 'kasol', 'mathura', 'vrindavan', 'lonavala', 'ajanta', 'ellora', 'mysore', 'coorg', 'kodagu', 'gokarna', 'chikmagalur', 'munnar', 'alleppey', 'alappuzha', 'thekkady', 'mahabalipuram', 'madurai', 'kanyakumari', 'pondicherry', 'puducherry', 'tirupati', 'visakhapatnam', 'vizag', 'darjeeling', 'gangtok', 'sikkim', 'kaziranga', 'tawang', 'cherrapunji', 'bodh gaya', 'bodhgaya', 'puri', 'konark', 'bhubaneswar', 'khajuraho', 'bhopal', 'rann of kutch', 'kutch', 'gir', 'statue of unity', 'andaman', 'port blair'],
  seasia:  ['bangkok', 'phuket', 'chiang mai', 'singapore', 'bali', 'jakarta', 'kuala lumpur', 'penang', 'hanoi', 'ho chi minh', 'vietnam', 'thailand', 'indonesia', 'malaysia', 'myanmar', 'manila', 'cambodia', 'siem reap'],
  eastasia:['tokyo', 'osaka', 'kyoto', 'japan', 'seoul', 'busan', 'south korea', 'beijing', 'shanghai', 'hong kong', 'taipei', 'taiwan'],
  middleeast: ['dubai', 'uae', 'abu dhabi', 'doha', 'qatar', 'bahrain', 'muscat', 'oman', 'riyadh', 'jeddah', 'tehran', 'baku', 'azerbaijan', 'istanbul', 'turkey'],
  europe:  ['paris', 'london', 'rome', 'amsterdam', 'berlin', 'madrid', 'barcelona', 'vienna', 'zurich', 'switzerland', 'austria', 'france', 'germany', 'spain', 'portugal', 'italy', 'lisbon', 'prague', 'budapest', 'helsinki', 'finland', 'oslo', 'stockholm', 'copenhagen', 'moscow', 'reykjavik', 'iceland', 'dublin', 'edinburgh', 'uk', 'england'],
  africa:  ['cairo', 'egypt', 'nairobi', 'kenya', 'johannesburg', 'cape town', 'south africa', 'morocco', 'marrakech', 'tunisia', 'tanzania', 'zanzibar'],
  americas:['new york', 'nyc', 'los angeles', 'la', 'san francisco', 'chicago', 'miami', 'toronto', 'vancouver', 'montreal', 'mexico', 'cancun', 'costa rica', 'san jose', 'panama', 'rio', 'sao paulo', 'buenos aires', 'lima', 'cusco', 'havana', 'cuba'],
  oceania: ['sydney', 'melbourne', 'brisbane', 'perth', 'auckland', 'wellington', 'queenstown', 'fiji', 'australia', 'new zealand'],
  srilanka:['colombo', 'kandy', 'galle', 'srilanka', 'sri lanka', 'ceylon'],
  bhutan:  ['thimphu', 'paro', 'bhutan'],
  nepal:   ['kathmandu', 'pokhara', 'nepal'],
  maldives:['maldives', 'male'],
};

function regionOf(city) {
  if (!city) return null;
  const lower = city.toLowerCase();
  for (const [region, keys] of Object.entries(REGION_KEYWORDS)) {
    if (keys.some(k => lower.includes(k))) return region;
  }
  return null;
}

// Range tables — [minHours, maxHours, minINR, maxINR]. Values reflect
// typical economy round-trip-aware one-way fares from major hubs.
const FLIGHT_RANGES = {
  // From → To (region pairs). Lookup is symmetric.
  'india|india':       [1, 3,    4500,   9500,  'Domestic — IndiGo / Air India / Vistara'],
  'india|seasia':      [4, 7,   18000,  38000,  'IndiGo / Thai / Singapore Airlines · 4–7 h'],
  'india|eastasia':    [6, 10,  35000,  65000,  'Air India / ANA / Korean Air · 6–10 h'],
  'india|middleeast':  [3, 5,   14000,  30000,  'IndiGo / Emirates / Qatar · 3–5 h'],
  'india|europe':      [8, 12,  48000,  90000,  'Lufthansa / British Airways / Air India · 8–12 h, often via DXB / DOH'],
  'india|africa':      [8, 13,  40000,  85000,  'Ethiopian / Kenya Airways / EgyptAir · 8–13 h with stop'],
  'india|americas':    [18, 28, 70000, 145000,  'Air India / United / Lufthansa · 18–28 h with 1–2 stops'],
  'india|oceania':     [11, 16, 55000, 105000,  'Singapore Airlines / Qantas · 11–16 h with stop'],
  'india|srilanka':    [1, 4,    9000,  22000,  'SriLankan / IndiGo · 1–4 h'],
  'india|bhutan':      [2, 4,   18000,  32000,  'Druk Air / Bhutan Airlines · 2–4 h, restricted runways'],
  'india|nepal':       [1, 3,   12000,  26000,  'IndiGo / Buddha Air · 1–3 h'],
  'india|maldives':    [3, 6,   22000,  45000,  'IndiGo / Maldivian · 3–6 h'],
  // Cross-region (non-India origin) — generic fallback values
  'seasia|seasia':     [2, 5,   12000,  30000,  'AirAsia / Thai / Singapore Air · regional · 2–5 h'],
  'europe|europe':     [1, 4,    8000,  28000,  'Ryanair / EasyJet · intra-Europe · 1–4 h'],
  'americas|americas': [3, 8,   28000,  75000,  'Domestic Americas · 3–8 h'],
};

function rangeKeyFor(fromCity, toCity) {
  const a = regionOf(fromCity);
  const b = regionOf(toCity);
  if (!a || !b) return null;
  // Prefer "india|other" form if either side is India, else "a|b" sorted.
  if (a === 'india' && b !== 'india') return `india|${b}`;
  if (b === 'india' && a !== 'india') return `india|${a}`;
  if (a === b) return `${a}|${a}`;
  return [a, b].sort().join('|');
}

// Ground transport ranges by region pair. Each mode is optional and is
// included only where it's realistic for the pair. Same shape as
// FLIGHT_RANGES — [minHours, maxHours, minINR, maxINR, note].
const GROUND_RANGES = {
  'india|india': {
    train: [6, 36,  400,  2200,  'Indian Railways · Sleeper to AC1 class · book on IRCTC'],
    bus:   [8, 40,  500,  2400,  'State / private AC sleeper buses · check RedBus / AbhiBus'],
    car:   [6, 40,  2500, 12000, 'Drive via NH highways · split fuel + tolls across the group'],
  },
  'europe|europe': {
    train: [2, 16,  3500, 25000, 'High-speed rail (Eurostar / TGV / ICE) · book early for cheap fares'],
    bus:   [4, 28,  1500, 9000,  'FlixBus / Eurolines · budget overnight option'],
    car:   [3, 20,  8000, 35000, 'European motorway network · tolls + vignettes vary'],
  },
  'seasia|seasia': {
    bus:   [4, 30,  1000, 5000,  'Cross-border / sleeper buses · widely available, slow but cheap'],
  },
  'eastasia|eastasia': {
    train: [2, 8,   6000, 22000, 'Shinkansen / KTX / China Rail · intra-country, fast and frequent'],
    bus:   [4, 16,  2500, 10000, 'Highway / overnight buses'],
  },
  'americas|americas': {
    bus:   [6, 40,  2500, 15000, 'Greyhound / FlixBus · long-distance routes'],
    car:   [4, 40,  6000, 35000, 'Drive on the interstate / highway system'],
  },
  'india|nepal': {
    bus:   [14, 30, 1500, 3500,  'Cross-border buses to Kathmandu via Sunauli or Birgunj'],
    car:   [14, 30, 6000, 15000, 'Drive to the border · visa-free for Indian nationals'],
  },
  'india|bhutan': {
    bus:   [10, 18, 1500, 3500,  'Bus to Phuentsholing border, then onwards (Bhutan permits required)'],
    car:   [10, 18, 5000, 12000, 'Drive to Phuentsholing border (Bhutan permits required)'],
  },
};

// Ferry ranges by region pair (where sea crossings are realistic).
const FERRY_RANGES = {
  'india|srilanka':  [12, 14, 7500, 12000, 'Nagapattinam–Kankesanthurai ferry · limited sailings (relaunched 2023)'],
  'seasia|seasia':   [1,  12, 800,  4500,  'Inter-island speedboats / ferries (Bali ↔ Lombok, Phuket ↔ Phi Phi etc.)'],
  'oceania|oceania': [3,  30, 5000, 25000, 'Inter-island ferries (NZ Cook Strait, Aus ↔ Tasmania)'],
  'europe|europe':   [1,  24, 3000, 18000, 'Channel ferries, Greek islands, Norwegian fjords etc.'],
};

function buildEstimateOption(mode, range, isINR) {
  const [hMin, hMax, costMin, costMax, note] = range;
  const midDuration = Math.round(((hMin + hMax) / 2) * 60);
  const midCostINR  = Math.round((costMin + costMax) / 2);
  return {
    mode,
    duration: midDuration,
    cost: isINR ? midCostINR : Math.round(midCostINR / 83),
    costRange: [isINR ? costMin : Math.round(costMin / 83), isINR ? costMax : Math.round(costMax / 83)],
    hourRange: [hMin, hMax],
    note,
    estimated: true,
  };
}

function generateOptions(from, to, isINR) {
  const key = getRouteKey(from, to);
  const data = INDIAN_ROUTES[key];

  if (data) {
    // Curated route — emit every mode the entry actually defines.
    const MODES = ['flight', 'train', 'bus', 'car', 'ferry'];
    return MODES
      .filter(mode => data[mode])
      .map(mode => {
        const [duration, cost, note] = data[mode];
        return { mode, duration, cost: isINR ? cost : Math.round(cost / 83), note, unavailable: duration === 0 };
      });
  }

  // No curated entry — stitch together region-based estimates for every
  // mode that's realistic on this pair (flight + ground + ferry).
  const pair = rangeKeyFor(from, to);
  const results = [];

  const flightRange = pair ? FLIGHT_RANGES[pair] : null;
  if (flightRange) {
    const opt = buildEstimateOption('flight', flightRange, isINR);
    opt.note = `Approx. range — ${flightRange[4]}. Verify on Skyscanner / Google Flights before booking.`;
    results.push(opt);
  }

  const ground = pair ? GROUND_RANGES[pair] : null;
  if (ground) {
    for (const mode of ['train', 'bus', 'car']) {
      if (ground[mode]) results.push(buildEstimateOption(mode, ground[mode], isINR));
    }
  }

  const ferry = pair ? FERRY_RANGES[pair] : null;
  if (ferry) results.push(buildEstimateOption('ferry', ferry, isINR));

  if (results.length === 0) {
    // Last resort — region unknown (very obscure city). Honest about it.
    return [{
      mode: 'flight',
      duration: 0,
      cost: 0,
      note: 'Couldn\'t identify the region from those city names. Search the route on Skyscanner or Google Flights for live fares.',
      placeholder: true,
    }];
  }

  return results;
}

export default function Routes() {
  const { activeTrip, updateTrip } = useTrips();
  const [showAdd, setShowAdd] = useState(false);
  const [newRoute, setNewRoute] = useState({ from: '', roundTrip: false });
  const [loadingOptions, setLoadingOptions] = useState(null);

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Route Planner</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Route className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to plan routes.</p>
          </div>
        </div>
      </>
    );
  }

  const { routes } = activeTrip;
  // Routes-cost generator only knows two units (INR and "non-INR ≈ USD"),
  // so we need a yes/no flag here even though the rest of the app handles
  // arbitrary currencies. getTripCurrencyCode honors the destination
  // heuristic so an Indian trip saved with the legacy USD default still
  // resolves to INR here.
  const isINR = getTripCurrencyCode(activeTrip) === 'INR';
  const sym = getTripCurrencySymbol(activeTrip);

  function fmtDuration(mins) {
    if (!mins) return '—';
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
  }

  function handleAdd() {
    const from = newRoute.from.trim();
    const to = activeTrip?.destination?.trim() || '';
    if (!from || !to) return;
    const routeId = 'r' + Date.now();
    // Destination is fixed by the trip; only the user's starting city is
    // collected. Round-trip implicitly returns to where they started.
    const newEntry = {
      id: routeId,
      from,
      to,
      returnTo: newRoute.roundTrip ? from : '',
    };
    updateTrip(activeTrip.id, trip => ({ ...trip, routes: [...trip.routes, newEntry] }));
    setNewRoute({ from: '', roundTrip: false });
    setShowAdd(false);
    setLoadingOptions(routeId);
    setTimeout(() => setLoadingOptions(null), 1800);
  }

  function handleDelete(routeId) {
    updateTrip(activeTrip.id, trip => ({ ...trip, routes: (trip.routes || []).filter(r => r.id !== routeId) }));
  }

  // Journey strip is only meaningful for a single route — multiple starting
  // points are independent journeys to the same destination, not a connected
  // timeline. Concatenating them produces a misleading "Mumbai → Goa → Delhi"
  // chain when really both Mumbai and Delhi are separate starts to Goa.
  const allStops = [];
  if (routes.length === 1) {
    const r = routes[0];
    if (r.from) allStops.push(r.from);
    if (r.to && !allStops.includes(r.to)) allStops.push(r.to);
    if (r.returnTo && r.returnTo !== r.from && !allStops.includes(r.returnTo)) allStops.push(r.returnTo);
  }

  return (
    <>
      <style>{`
        @keyframes routePulse {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .route-card { animation: slideUp 0.25s ease; }
        .mode-card {
          position: relative;
          border-radius: 10px;
          padding: 10px 12px;
          border: 1.5px solid var(--border-light);
          background: var(--bg-secondary);
          transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
          overflow: hidden;
        }
        .mode-card:hover {
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .delete-btn {
          opacity: 0;
          transition: opacity 0.15s;
        }
        .route-card:hover .delete-btn { opacity: 1; }
        @media (hover: none), (pointer: coarse) {
          .delete-btn { opacity: 1; }
        }
        .transport-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
        }
      `}</style>

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Getting to {activeTrip.destination}</h1>
          <p>{routes.length === 0
            ? 'Tell us where you\'re starting from and we\'ll suggest the best way to reach the trip.'
            : `${routes.length} starting point${routes.length !== 1 ? 's' : ''} for the group`}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Starting City
        </button>
      </div>

      <div className="page-body">

        {/* Journey map strip */}
        {allStops.length > 0 && (
          <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--brand) 0%, var(--purple) 100%)',
              padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Navigation size={13} style={{ color: 'rgba(255,255,255,0.85)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Journey Overview
              </span>
            </div>
            <div className="card-body" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
                {allStops.map((stop, i) => (
                  <div key={stop} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: i === 0
                          ? 'linear-gradient(135deg, var(--brand), var(--brand-dark))'
                          : i === allStops.length - 1
                            ? 'linear-gradient(135deg, var(--success), #34d399)'
                            : 'var(--bg-tertiary)',
                        border: `2px solid ${i === 0 ? 'var(--brand)' : i === allStops.length - 1 ? 'var(--success)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: (i === 0 || i === allStops.length - 1) ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
                      }}>
                        <MapPin size={16} style={{ color: (i === 0 || i === allStops.length - 1) ? 'white' : 'var(--text-tertiary)' }} />
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700, marginTop: 6, textAlign: 'center', maxWidth: 72,
                        color: i === 0 ? 'var(--brand)' : i === allStops.length - 1 ? 'var(--success)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                      }}>
                        {stop}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        {i === 0 ? 'Start' : i === allStops.length - 1 ? 'End' : `Stop ${i}`}
                      </span>
                    </div>
                    {i < allStops.length - 1 && (() => {
                      const segDist = getRouteDistance(stop, allStops[i + 1]);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 4px', marginBottom: 28, gap: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 24, height: 1.5, background: 'var(--border)' }} />
                            <ArrowRight size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <div style={{ width: 24, height: 1.5, background: 'var(--border)' }} />
                          </div>
                          {segDist && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
                              background: 'var(--bg-accent)', borderRadius: 99,
                              padding: '1px 7px', whiteSpace: 'nowrap',
                              display: 'flex', alignItems: 'center', gap: 3,
                            }}>
                              <Ruler size={8} /> {segDist.toLocaleString()} km
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Route cards */}
        {routes.length === 0 ? (
          <div className="empty-state" style={{ flexDirection: 'column' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-light), var(--purple-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Route size={32} style={{ color: 'var(--brand)' }} />
            </div>
            <h3>How are you getting to {activeTrip.destination}?</h3>
            <p style={{ maxWidth: 320, textAlign: 'center' }}>
              Add the city you're flying out of and we'll suggest the best routes — flights, plus trains, buses, ferries or drive options where they apply.
            </p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add starting city
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {routes.map(route => {
              const isLoading = loadingOptions === route.id;
              const hasReturn = route.returnTo && route.returnTo !== route.to;

              const opts = (route.from && route.to) ? generateOptions(route.from, route.to, isINR) : [];
              const available = opts.filter(o => !o.unavailable);
              const cheapest = available.length ? available.reduce((a, b) => a.cost < b.cost ? a : b) : null;
              const fastest  = available.length ? available.reduce((a, b) => a.duration < b.duration ? a : b) : null;
              const distance = (route.from && route.to) ? getRouteDistance(route.from, route.to) : null;

              const retOpts = hasReturn ? generateOptions(route.to, route.returnTo, isINR) : [];
              const retAvailable = retOpts.filter(o => !o.unavailable);
              const retCheapest = retAvailable.length ? retAvailable.reduce((a, b) => a.cost < b.cost ? a : b) : null;
              const retFastest  = retAvailable.length ? retAvailable.reduce((a, b) => a.duration < b.duration ? a : b) : null;
              const retDistance = hasReturn ? getRouteDistance(route.to, route.returnTo) : null;

              return (
                <div key={route.id} className="card route-card" style={{ overflow: 'hidden' }}>

                  {/* Gradient header */}
                  <div className="route-card-header" style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <div className="route-card-pills" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
                      {/* From pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                        padding: '6px 12px',
                      }}>
                        <MapPin size={13} style={{ color: '#fbbf24' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.from}</span>
                      </div>

                      {/* Arrow */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                        <Plane size={14} style={{ color: 'rgba(255,255,255,0.5)', transform: 'rotate(0deg)' }} />
                        <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                      </div>

                      {/* To pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                        padding: '6px 12px',
                      }}>
                        <MapPin size={13} style={{ color: '#34d399' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.to}</span>
                      </div>

                      {route.returnTo && route.returnTo !== route.to && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                          </div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                            padding: '6px 12px',
                          }}>
                            <MapPin size={13} style={{ color: '#f97316' }} />
                            <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.returnTo}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(route.id)}
                        style={{
                          background: 'rgba(239,68,68,0.2)', border: 'none', cursor: 'pointer',
                          borderRadius: 8, padding: '6px 8px', color: '#f87171',
                          display: 'flex', alignItems: 'center',
                        }}
                        title="Remove route"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Best picks summary bar — only when we have real numbers,
                      not for unknown long-haul routes (placeholder mode). */}
                  {!isLoading && cheapest && fastest && !available[0]?.placeholder && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 0,
                      borderBottom: '1px solid var(--border-light)',
                      background: 'var(--bg-tertiary)',
                    }}>
                      <div style={{ flex: '1 1 200px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderRight: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#06b6d4', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                          ⚡ FASTEST
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {MODE_CONFIG[fastest.mode]?.label} · {fmtDuration(fastest.duration)}
                        </span>
                      </div>
                      <div style={{ flex: '1 1 200px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#10b981', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                          💰 CHEAPEST
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {MODE_CONFIG[cheapest.mode]?.label} · {sym}{cheapest.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Outbound leg label */}
                  {hasReturn && !isLoading && (
                    <div style={{
                      padding: '10px 20px 0', display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <MapPin size={13} style={{ color: '#fbbf24' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {route.from} → {route.to}
                      </span>
                      {distance && (
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                          · {distance.toLocaleString()} km
                        </span>
                      )}
                    </div>
                  )}

                  {/* Transport options */}
                  <div style={{ padding: '10px 14px 14px' }}>
                    {isLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 14 }}>
                          {['flight', 'train', 'bus', 'car', 'ferry'].map((m, i) => {
                            const cfg = MODE_CONFIG[m];
                            const Icon = cfg.icon;
                            return (
                              <div key={m} style={{
                                width: 52, height: 52, borderRadius: 14,
                                background: cfg.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: `routePulse 1.4s ease-in-out ${i * 0.22}s infinite`,
                              }}>
                                <Icon size={22} style={{ color: cfg.color }} />
                              </div>
                            );
                          })}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          Finding best travel options…
                        </p>
                      </div>
                    ) : available.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>
                        No travel options found for this route.
                      </p>
                    ) : (
                      <>
                        <div className="transport-grid">
                          {available.map(opt => (
                            <ModeCard
                              key={opt.mode}
                              opt={opt}
                              isCheapest={cheapest?.mode === opt.mode}
                              isFastest={fastest?.mode === opt.mode}
                              hasReturn={hasReturn}
                              sym={sym}
                              fromCity={route.from}
                              toCity={route.to}
                            />
                          ))}
                        </div>

                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                          * Estimated fares · Prices vary by season, class & availability. Check IRCTC / airline apps for live rates.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Return leg */}
                  {hasReturn && !isLoading && (
                    <>
                      <div style={{ borderTop: '1px solid var(--border-light)', margin: '0 20px' }} />

                      {/* Return leg label */}
                      <div style={{
                        padding: '12px 20px 0', display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <MapPin size={13} style={{ color: '#f97316' }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {route.to} → {route.returnTo} (Return)
                        </span>
                        {retDistance && (
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                            · {retDistance.toLocaleString()} km
                          </span>
                        )}
                      </div>

                      {/* Return best picks */}
                      {retCheapest && retFastest && (
                        <div style={{
                          display: 'flex', flexWrap: 'wrap', gap: 0, margin: '10px 20px 0',
                          borderRadius: 'var(--radius-md)', overflow: 'hidden',
                          border: '1px solid var(--border-light)', background: 'var(--bg-tertiary)',
                        }}>
                          <div style={{ flex: '1 1 200px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderRight: '1px solid var(--border-light)' }}>
                            <span style={{ fontSize: 9, fontWeight: 800, background: '#06b6d4', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                              ⚡ FASTEST
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {MODE_CONFIG[retFastest.mode]?.label} · {fmtDuration(retFastest.duration)}
                            </span>
                          </div>
                          <div style={{ flex: '1 1 200px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 9, fontWeight: 800, background: '#10b981', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                              💰 CHEAPEST
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {MODE_CONFIG[retCheapest.mode]?.label} · {sym}{retCheapest.cost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Return transport options */}
                      <div style={{ padding: '8px 14px 14px' }}>
                        {retAvailable.length === 0 ? (
                          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>
                            No travel options found for this return route.
                          </p>
                        ) : (
                          <div className="transport-grid">
                            {retAvailable.map(opt => (
                              <ModeCard
                                key={opt.mode}
                                opt={opt}
                                isCheapest={retCheapest?.mode === opt.mode}
                                isFastest={retFastest?.mode === opt.mode}
                                hasReturn
                                sym={sym}
                                fromCity={route.to}
                                toCity={route.returnTo}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom hint */}
        <p style={{
          textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)',
          marginTop: 24, padding: '0 20px', lineHeight: 1.6,
        }}>
          Each member can add their own starting city — we'll show ground and ferry options when the route is feasible, otherwise just flights.
        </p>
      </div>

      {/* Add starting city modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plane size={18} style={{ color: 'var(--brand)' }} /> Add starting city
              </h2>
              <button className="btn-ghost" onClick={() => setShowAdd(false)} style={{ padding: 4 }}>
                <span style={{ fontSize: 18 }}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                We'll suggest the best ways to reach <strong>{activeTrip.destination}</strong>.
              </p>

              {/* Visual preview */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center',
                padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                background: 'linear-gradient(135deg, var(--bg-tertiary), var(--brand-light))',
                border: '1px solid var(--border-light)',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 14 }}>{newRoute.from || 'Your city'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <Plane size={14} style={{ color: 'var(--text-tertiary)' }} />
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: 14 }}>{activeTrip.destination}</span>
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }} />
                  Where are you starting from?
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. Mumbai"
                  autoFocus
                  value={newRoute.from}
                  onChange={e => setNewRoute(p => ({ ...p, from: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter' && newRoute.from.trim()) handleAdd(); }}
                />
              </div>

              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 8,
                border: '1px solid var(--border-light)', background: 'var(--bg-tertiary)',
                cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)',
              }}>
                <input
                  type="checkbox"
                  checked={newRoute.roundTrip}
                  onChange={e => setNewRoute(p => ({ ...p, roundTrip: e.target.checked }))}
                  style={{ accentColor: 'var(--brand)' }}
                />
                Show return options too (round trip)
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={!newRoute.from.trim()}
              >
                <Plane size={14} /> Suggest routes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ─── Compact ModeCard ───────────────────────────────────────────────── */
function ModeCard({ opt, isCheapest, isFastest, hasReturn, sym, fromCity, toCity }) {
  const cfg = MODE_CONFIG[opt.mode] || MODE_CONFIG.car;
  const Icon = cfg.icon;
  const isHighlighted = isCheapest || isFastest;
  const platforms = BOOKING_PLATFORMS[opt.mode] || [];

  // For flights, surface the nearest commercial airport when the city itself
  // doesn't have one (Wayanad → Calicut, Mahabaleshwar → Pune, etc.) so the
  // user knows where they'll actually be landing. Same idea for train mode
  // with the nearest practical railway station / junction.
  const fromHub = opt.mode === 'flight' ? nearestAirportFor(fromCity)
                : opt.mode === 'train'  ? nearestStationFor(fromCity)
                : null;
  const toHub   = opt.mode === 'flight' ? nearestAirportFor(toCity)
                : opt.mode === 'train'  ? nearestStationFor(toCity)
                : null;
  const hubLabel = opt.mode === 'flight' ? { from: 'fly via', to: 'fly into', name: 'airport' }
                 : opt.mode === 'train'  ? { from: 'board at', to: 'arrive at', name: 'station' }
                 : null;

  return (
    <div className="mode-card" style={{
      borderColor: isHighlighted ? cfg.color + '50' : 'var(--border-light)',
      background: isHighlighted ? cfg.bg : 'var(--bg-secondary)',
    }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: cfg.color, opacity: isHighlighted ? 1 : 0.3,
      }} />

      {/* Header row: icon + label + badges + price (all on one line) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8,
          background: cfg.color + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={14} style={{ color: cfg.color }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 13, color: cfg.color }}>{cfg.label}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
          {isFastest && (
            <span title="Fastest" style={{
              fontSize: 9, fontWeight: 800, background: '#06b6d4', color: 'white',
              padding: '1px 6px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 2,
            }}><Zap size={8} /></span>
          )}
          {isCheapest && (
            <span title="Cheapest" style={{
              fontSize: 9, fontWeight: 800, background: '#10b981', color: 'white',
              padding: '1px 6px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 2,
            }}><Wallet size={8} /></span>
          )}
        </div>
      </div>

      {/* Price + duration on a single tight line */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        {opt.placeholder ? (
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Check live fares
          </span>
        ) : opt.estimated && opt.costRange ? (
          <>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {sym}{opt.costRange[0].toLocaleString()}–{opt.costRange[1].toLocaleString()}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: 99 }}>
              estimate
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {sym}{opt.cost.toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>/ person</span>
          </>
        )}
        {!opt.placeholder && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
            background: 'rgba(0,0,0,0.04)', borderRadius: 5, padding: '2px 6px',
          }}>
            <Clock size={10} />
            {opt.estimated && opt.hourRange
              ? `${opt.hourRange[0]}–${opt.hourRange[1]} h`
              : (function() {
                  const h = Math.floor(opt.duration / 60);
                  const m = opt.duration % 60;
                  return h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`;
                })()}
          </span>
        )}
      </div>

      {/* Note (kept short, 2 lines max) */}
      {opt.note && (
        <p style={{
          fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden', marginBottom: (fromHub || toHub || platforms.length) ? 6 : 0,
        }}>
          {opt.note}
        </p>
      )}

      {/* Nearest hub hints — surface the nearest commercial airport (flight)
          or railway station (train) when the city itself doesn't have one. */}
      {hubLabel && (fromHub || toHub) && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 2,
          padding: '6px 8px', marginBottom: platforms.length ? 6 : 0,
          background: cfg.color + '0d', borderRadius: 6,
          borderLeft: `2px solid ${cfg.color}60`,
        }}>
          {fromHub && (
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              <span style={{ fontWeight: 700, color: cfg.color }}>From {fromCity}:</span>{' '}
              {hubLabel.from} {fromHub[hubLabel.name]} · <span style={{ color: 'var(--text-tertiary)' }}>{fromHub.drive}</span>
            </div>
          )}
          {toHub && (
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              <span style={{ fontWeight: 700, color: cfg.color }}>To {toCity}:</span>{' '}
              {hubLabel.to} {toHub[hubLabel.name]} · <span style={{ color: 'var(--text-tertiary)' }}>{toHub.drive}</span>
            </div>
          )}
        </div>
      )}

      {/* Booking links */}
      {platforms.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {platforms.map(p => (
            <a
              key={p.name}
              href={p.buildUrl(fromCity, toCity)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: 10, fontWeight: 700,
                padding: '3px 8px', borderRadius: 6,
                background: cfg.color + '15',
                color: cfg.color,
                border: `1px solid ${cfg.color}30`,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 3,
              }}
            >
              <ExternalLink size={9} /> {p.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
