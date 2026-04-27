import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Autocomplete proxies through the `places-autocomplete` Edge Function so the
// Gemini API key never ships to the browser. Disabled in demo mode.
const AUTOCOMPLETE_ENABLED = isSupabaseConfigured;

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
    if (!AUTOCOMPLETE_ENABLED || !input.trim() || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('places-autocomplete', {
        body: { input: input.trim() },
      });
      if (error) throw error;
      const places = Array.isArray(data?.places) ? data.places.slice(0, 5) : [];
      setSuggestions(places);
      setShowDropdown(places.length > 0);
    } catch (err) {
      console.error('[places] autocomplete error:', err);
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

  // Autocomplete disabled (demo mode) — plain input
  if (!AUTOCOMPLETE_ENABLED) {
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
          background: 'var(--bg-input)', borderRadius: 10,
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
