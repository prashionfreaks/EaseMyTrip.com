import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function PlacesAutocomplete({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchSuggestions(input) {
    if (!API_KEY || !input.trim() || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const prompt = `Given the partial search "${input}", suggest up to 5 real travel destinations (cities/places) that match. Return ONLY a JSON array of objects with "name" (city/place name) and "region" (state/country). No explanation, no markdown, just the JSON array. Example: [{"name":"Tokyo","region":"Japan"},{"name":"Toronto","region":"Canada"}]`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
          }),
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Extract JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const places = JSON.parse(jsonMatch[0]);
        setSuggestions(places.slice(0, 5));
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('[places] Gemini error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  }

  function selectPlace(place) {
    const full = `${place.name}, ${place.region}`;
    setQuery(full);
    onChange(full);
    setSuggestions([]);
    setShowDropdown(false);
  }

  // No API key — plain input
  if (!API_KEY) {
    return (
      <input
        className="form-input"
        placeholder={placeholder}
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
      />
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          className="form-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
        />
        {loading && (
          <Loader2 size={14} style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            color: '#94a3b8', animation: 'spin 1s linear infinite',
          }} />
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          zIndex: 1000, marginTop: 4,
          background: 'white', borderRadius: 10,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {suggestions.map((p, i) => (
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
