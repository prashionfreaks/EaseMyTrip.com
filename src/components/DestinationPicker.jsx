import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const DESTINATIONS = [
  // ── India ─────────────────────────────────────────────
  // North
  { name: 'Delhi', region: 'India' },
  { name: 'Agra', region: 'Uttar Pradesh, India' },
  { name: 'Lucknow', region: 'Uttar Pradesh, India' },
  { name: 'Mathura', region: 'Uttar Pradesh, India' },
  { name: 'Vrindavan', region: 'Uttar Pradesh, India' },
  { name: 'Varanasi', region: 'Uttar Pradesh, India' },
  { name: 'Ayodhya', region: 'Uttar Pradesh, India' },
  { name: 'Jaipur', region: 'Rajasthan, India' },
  { name: 'Udaipur', region: 'Rajasthan, India' },
  { name: 'Jaisalmer', region: 'Rajasthan, India' },
  { name: 'Jodhpur', region: 'Rajasthan, India' },
  { name: 'Pushkar', region: 'Rajasthan, India' },
  { name: 'Mount Abu', region: 'Rajasthan, India' },
  { name: 'Shimla', region: 'Himachal Pradesh, India' },
  { name: 'Manali', region: 'Himachal Pradesh, India' },
  { name: 'Dharamshala', region: 'Himachal Pradesh, India' },
  { name: 'McLeod Ganj', region: 'Himachal Pradesh, India' },
  { name: 'Spiti Valley', region: 'Himachal Pradesh, India' },
  { name: 'Kasol', region: 'Himachal Pradesh, India' },
  { name: 'Rishikesh', region: 'Uttarakhand, India' },
  { name: 'Haridwar', region: 'Uttarakhand, India' },
  { name: 'Nainital', region: 'Uttarakhand, India' },
  { name: 'Mussoorie', region: 'Uttarakhand, India' },
  { name: 'Jim Corbett', region: 'Uttarakhand, India' },
  { name: 'Kashmir', region: 'India' },
  { name: 'Ladakh', region: 'India' },
  { name: 'Amritsar', region: 'Punjab, India' },

  // Central
  { name: 'Khajuraho', region: 'Madhya Pradesh, India' },
  { name: 'Bhopal', region: 'Madhya Pradesh, India' },

  // West
  { name: 'Mumbai', region: 'Maharashtra, India' },
  { name: 'Pune', region: 'Maharashtra, India' },
  { name: 'Mahabaleshwar', region: 'Maharashtra, India' },
  { name: 'Lonavala', region: 'Maharashtra, India' },
  { name: 'Ajanta & Ellora', region: 'Maharashtra, India' },
  { name: 'Goa', region: 'India' },
  { name: 'Ahmedabad', region: 'Gujarat, India' },
  { name: 'Rann of Kutch', region: 'Gujarat, India' },
  { name: 'Gir National Park', region: 'Gujarat, India' },
  { name: 'Statue of Unity', region: 'Gujarat, India' },

  // South
  { name: 'Hyderabad', region: 'Telangana, India' },
  { name: 'Bangalore', region: 'Karnataka, India' },
  { name: 'Mysore', region: 'Karnataka, India' },
  { name: 'Coorg', region: 'Karnataka, India' },
  { name: 'Hampi', region: 'Karnataka, India' },
  { name: 'Gokarna', region: 'Karnataka, India' },
  { name: 'Chikmagalur', region: 'Karnataka, India' },
  { name: 'Kerala', region: 'India' },
  { name: 'Munnar', region: 'Kerala, India' },
  { name: 'Alleppey', region: 'Kerala, India' },
  { name: 'Kochi', region: 'Kerala, India' },
  { name: 'Thekkady', region: 'Kerala, India' },
  { name: 'Wayanad', region: 'Kerala, India' },
  { name: 'Ooty', region: 'Tamil Nadu, India' },
  { name: 'Mahabalipuram', region: 'Tamil Nadu, India' },
  { name: 'Madurai', region: 'Tamil Nadu, India' },
  { name: 'Kanyakumari', region: 'Tamil Nadu, India' },
  { name: 'Pondicherry', region: 'India' },
  { name: 'Tirupati', region: 'Andhra Pradesh, India' },
  { name: 'Visakhapatnam', region: 'Andhra Pradesh, India' },

  // East & Northeast
  { name: 'Kolkata', region: 'West Bengal, India' },
  { name: 'Darjeeling', region: 'West Bengal, India' },
  { name: 'Gangtok', region: 'Sikkim, India' },
  { name: 'Kaziranga', region: 'Assam, India' },
  { name: 'Tawang', region: 'Arunachal Pradesh, India' },
  { name: 'Meghalaya', region: 'India' },
  { name: 'Shillong', region: 'Meghalaya, India' },
  { name: 'Cherrapunji', region: 'Meghalaya, India' },
  { name: 'Bodh Gaya', region: 'Bihar, India' },
  { name: 'Puri', region: 'Odisha, India' },
  { name: 'Konark', region: 'Odisha, India' },
  { name: 'Bhubaneswar', region: 'Odisha, India' },

  // Islands
  { name: 'Andaman Islands', region: 'India' },

  // ── International ─────────────────────────────────────
  { name: 'Japan', region: 'East Asia' },
  { name: 'Bali', region: 'Indonesia' },
  { name: 'Paris', region: 'France' },
  { name: 'London', region: 'United Kingdom' },
  { name: 'Dubai', region: 'UAE' },
  { name: 'Singapore', region: 'Southeast Asia' },
  { name: 'Thailand', region: 'Southeast Asia' },
  { name: 'Switzerland', region: 'Europe' },
  { name: 'Austria', region: 'Europe' },
  { name: 'South Korea', region: 'East Asia' },
  { name: 'Vietnam', region: 'Southeast Asia' },
];

export default function DestinationPicker({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [lastExternalValue, setLastExternalValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Sync incoming `value` prop into local query without an effect — React
  // bails out and re-renders immediately when state changes during render,
  // so this is the official "don't use an effect to mirror props" pattern.
  if (value !== lastExternalValue) {
    setLastExternalValue(value);
    setQuery(value || '');
  }

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = query.trim().length > 0
    ? DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.region.toLowerCase().includes(query.toLowerCase())
      )
    : DESTINATIONS;

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setShowDropdown(true);
  }

  function selectPlace(place) {
    setQuery(place.name);
    onChange(place.name);
    setShowDropdown(false);
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        className="form-input"
        placeholder="Search destination..."
        value={query}
        onChange={handleInput}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          zIndex: 1000, marginTop: 4,
          background: 'var(--bg-input)', borderRadius: 10,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          maxHeight: 220, overflowY: 'auto',
        }}>
          {filtered.map((p, i) => (
            <button
              key={i}
              onClick={() => selectPlace(p)}
              style={{
                width: '100%', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: 'none', background: 'var(--bg-input)',
                cursor: 'pointer', fontSize: 13, color: '#0f172a',
                textAlign: 'left', transition: 'background 0.1s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--maroon-light)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-input)'; }}
            >
              <MapPin size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.region}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
