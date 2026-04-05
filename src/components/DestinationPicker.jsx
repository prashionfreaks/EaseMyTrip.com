import { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const DESTINATIONS = [
  { name: 'Goa', region: 'India' },
  { name: 'Mumbai', region: 'India' },
  { name: 'Hyderabad', region: 'India' },
  { name: 'Wayanad', region: 'Kerala, India' },
  { name: 'Kerala', region: 'India' },
  { name: 'Shimla', region: 'Himachal Pradesh, India' },
  { name: 'Manali', region: 'Himachal Pradesh, India' },
  { name: 'Kashmir', region: 'India' },
  { name: 'Ladakh', region: 'India' },
  { name: 'Varanasi', region: 'Uttar Pradesh, India' },
  { name: 'Ayodhya', region: 'Uttar Pradesh, India' },
  { name: 'Udaipur', region: 'Rajasthan, India' },
  { name: 'Ooty', region: 'Tamil Nadu, India' },
  { name: 'Hampi', region: 'Karnataka, India' },
  { name: 'Mahabaleshwar', region: 'Maharashtra, India' },
  { name: 'Meghalaya', region: 'India' },
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
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

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
          background: 'white', borderRadius: 10,
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
                border: 'none', background: 'white',
                cursor: 'pointer', fontSize: 13, color: '#0f172a',
                textAlign: 'left', transition: 'background 0.1s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
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
