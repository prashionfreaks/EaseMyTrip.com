import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

let scriptLoaded = false;
let scriptLoading = false;
const loadCallbacks = [];

function loadGoogleScript() {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) return new Promise(resolve => loadCallbacks.push(resolve));

  scriptLoading = true;
  return new Promise((resolve) => {
    loadCallbacks.push(resolve);
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      loadCallbacks.forEach(cb => cb());
      loadCallbacks.length = 0;
    };
    document.head.appendChild(script);
  });
}

export default function PlacesAutocomplete({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ready, setReady] = useState(false);
  const serviceRef = useRef(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync external value
  useEffect(() => { setQuery(value || ''); }, [value]);

  // Load Google Maps script
  useEffect(() => {
    if (!API_KEY) return;
    loadGoogleScript().then(() => {
      serviceRef.current = new window.google.maps.places.AutocompleteService();
      setReady(true);
    });
  }, []);

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

  const fetchPredictions = useCallback((input) => {
    if (!ready || !serviceRef.current || !input.trim()) {
      setPredictions([]);
      return;
    }
    serviceRef.current.getPlacePredictions(
      { input, types: ['(cities)'] },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results.slice(0, 5));
        } else {
          setPredictions([]);
        }
      }
    );
  }, [ready]);

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setShowDropdown(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(val), 300);
  }

  function selectPlace(prediction) {
    const desc = prediction.description;
    setQuery(desc);
    onChange(desc);
    setPredictions([]);
    setShowDropdown(false);
  }

  // If no API key, fall back to plain input
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
      <input
        className="form-input"
        placeholder={placeholder}
        value={query}
        onChange={handleInput}
        onFocus={() => { if (predictions.length) setShowDropdown(true); }}
      />
      {showDropdown && predictions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          zIndex: 1000, marginTop: 4,
          background: 'white', borderRadius: 10,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {predictions.map((p) => (
            <button
              key={p.place_id}
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
                <div style={{ fontWeight: 600 }}>
                  {p.structured_formatting.main_text}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  {p.structured_formatting.secondary_text}
                </div>
              </div>
            </button>
          ))}
          <div style={{
            padding: '6px 14px', fontSize: 10, color: '#94a3b8',
            borderTop: '1px solid #f1f5f9', textAlign: 'right',
          }}>
            Powered by Google
          </div>
        </div>
      )}
    </div>
  );
}
