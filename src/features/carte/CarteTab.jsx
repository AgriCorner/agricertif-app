import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { G, Ic } from '../../ui/kit';
import { useAuth } from '../auth/useAuth';
import { fetchFarmsByInsee, fetchStatuts } from '../../lib/api';
import COMMUNES from '../../data/communes-10-51.json';

/* Familles NAF pour le filtre (le 51 est dominé par la vigne) */
const NAF_FAMILLES = [
  { id: 'cultures', label: 'Cultures', match: n => ['01.11Z','01.13Z','01.16Z','01.19Z','01.24Z','01.25Z','01.30Z'].includes(n) },
  { id: 'vigne',    label: 'Vigne',    match: n => n === '01.21Z' },
  { id: 'elevage',  label: 'Élevage',  match: n => n.startsWith('01.4') || n === '01.50Z' },
  { id: 'eta',      label: 'ETA / Services', match: n => n.startsWith('01.6') },
];

const STATUT_COLORS = { client: G.primary, prospect: G.orange };
const NON_QUALIFIE = '#8A9086';

const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const RAYON_VOISINES_KM = 7;
function haversineKm(a, b) {
  const rad = x => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng/2)**2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/* La sélection survit aux allers-retours vers la fiche (l'onglet est démonté) */
let lastSearch = { commune: null, voisines: false };

export default function CarteTab({ onOpenFiche }) {
  const { demo } = useAuth();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [commune, setCommune] = useState(lastSearch.commune);
  const [voisines, setVoisines] = useState(lastSearch.voisines);
  const [familles, setFamilles] = useState(() => new Set(NAF_FAMILLES.map(f => f.id)));
  const [farms, setFarms] = useState([]);
  const [statuts, setStatuts] = useState({});
  const [selFarm, setSelFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const movingRef = useRef(false);
  const [mapIdleTick, setMapIdleTick] = useState(0);

  /* Init carte */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [48.65, 4.2], zoom: 8,
      zoomControl: false, attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);
    mapRef.current = map;
    if (lastSearch.commune) map.setView([lastSearch.commune.lat, lastSearch.commune.lng], 13);
    /* les marqueurs ne doivent pas être posés pendant une animation flyTo
       (origine de pixels périmée) — on note l'état et on redessine à l'arrêt */
    map.on('movestart zoomstart', () => { movingRef.current = true; });
    map.on('moveend zoomend', () => { movingRef.current = false; setMapIdleTick(t => t + 1); });
    /* le conteneur peut être mesuré trop tôt (animation d'entrée d'écran, clavier mobile) */
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);
    const t = setTimeout(() => map.invalidateSize(), 350);
    return () => { clearTimeout(t); ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  /* Statuts des fiches (colorent les marqueurs) — rafraîchis à chaque montage */
  useEffect(() => {
    if (demo) return;
    fetchStatuts().then(setStatuts).catch(() => {});
  }, [demo]);

  /* Autocomplétion communes */
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const q = norm(query);
    setSuggestions(COMMUNES.filter(c => norm(c.nom).includes(q)).slice(0, 8));
  }, [query]);

  /* Chargement des exploitations de la commune (+ voisines) */
  useEffect(() => {
    lastSearch = { commune, voisines };
    if (!commune || demo) { setFarms([]); return; }
    const codes = voisines
      ? COMMUNES.filter(c => haversineKm(c, commune) <= RAYON_VOISINES_KM).map(c => c.code)
      : [commune.code];
    setLoading(true);
    setError(null);
    fetchFarmsByInsee(codes)
      .then(setFarms)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [commune, voisines, demo]);

  const visibleFarms = useMemo(() => {
    const active = NAF_FAMILLES.filter(f => familles.has(f.id));
    return farms.filter(f => active.some(fam => fam.match(f.naf)));
  }, [farms, familles]);

  /* Marqueurs — redessinés quand les données changent ou que la carte s'immobilise */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || movingRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const seen = new Map(); // "lat,lng" → nb de marqueurs déjà posés là
    visibleFarms.forEach(f => {
      if (f.lat == null || f.lng == null) return;
      const key = `${f.lat},${f.lng}`;
      const n = seen.get(key) ?? 0;
      seen.set(key, n + 1);
      /* spirale déterministe pour séparer les adresses identiques (lieu-dit du village) */
      const lat = f.lat + (n ? Math.sin(n * 2.4) * 0.0004 * (1 + n * 0.25) : 0);
      const lng = f.lng + (n ? Math.cos(n * 2.4) * 0.0006 * (1 + n * 0.25) : 0);
      const color = STATUT_COLORS[statuts[f.siret]] ?? NON_QUALIFIE;
      const m = L.circleMarker([lat, lng], {
        radius: 8, fillColor: color, fillOpacity: 0.9, color: 'white', weight: 1.5,
      }).addTo(map);
      m.on('click', () => setSelFarm(f));
      markersRef.current.push(m);
    });
  }, [visibleFarms, statuts, mapIdleTick]);

  const pickCommune = (c) => {
    setCommune(c);
    setQuery('');
    setSuggestions([]);
    setSelFarm(null);
    mapRef.current?.flyTo([c.lat, c.lng], 13, { duration: 0.7 });
  };

  const chipStyle = active => ({
    flexShrink: 0, padding: '6px 11px', borderRadius: 99, cursor: 'pointer',
    border: `1.5px solid ${active ? G.primary : '#D5D9D2'}`,
    background: active ? '#EBF4E1' : 'white',
    fontSize: 11, fontWeight: 700, color: active ? G.primary : '#9AA096',
  });

  const selStatut = selFarm ? (statuts[selFarm.siret] ?? null) : null;

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Recherche + filtres flottants */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, padding: 'max(calc(env(safe-area-inset-top, 0px) + 10px), 14px) 12px 0' }}>
        <div style={{ background: 'white', borderRadius: 13, boxShadow: '0 2px 12px rgba(0,0,0,0.14)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 13px' }}>
            <Ic n="search" s={17} c={G.muted} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={commune ? commune.nom : 'Rechercher une commune…'}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, color: '#111', background: 'none' }}
            />
            {commune && !query && (
              <button onClick={() => { setCommune(null); setSelFarm(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: G.muted, padding: 0 }}>✕</button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div style={{ borderTop: '1px solid #F0F0EC', maxHeight: 260, overflowY: 'auto' }}>
              {suggestions.map(c => (
                <button key={c.code} onClick={() => pickCommune(c)} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 8, padding: '11px 13px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <Ic n="pin" s={14} c={G.light} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{c.nom}</span>
                  <span style={{ fontSize: 11, color: G.muted, marginLeft: 'auto' }}>{c.cp}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <button onClick={() => setVoisines(v => !v)} style={chipStyle(voisines)}>+ voisines ({RAYON_VOISINES_KM} km)</button>
          {NAF_FAMILLES.map(f => (
            <button
              key={f.id}
              onClick={() => setFamilles(prev => {
                const next = new Set(prev);
                next.has(f.id) ? next.delete(f.id) : next.add(f.id);
                return next;
              })}
              style={chipStyle(familles.has(f.id))}
            >{f.label}</button>
          ))}
        </div>
      </div>

      {/* Bandeau mode démo / erreur / compteur */}
      {demo && (
        <div style={{ position: 'absolute', bottom: 14, left: 12, right: 12, zIndex: 1000, background: '#FBF0E7', borderRadius: 11, padding: '10px 14px', fontSize: 12, fontWeight: 700, color: G.orange, boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
          Supabase non configuré — mode démo, aucune exploitation chargée.
        </div>
      )}
      {!demo && error && (
        <div style={{ position: 'absolute', bottom: 14, left: 12, right: 12, zIndex: 1000, background: '#FDECEA', borderRadius: 11, padding: '10px 14px', fontSize: 12, fontWeight: 700, color: G.red, boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
          Erreur de chargement : {error}
        </div>
      )}
      {!demo && !error && commune && !selFarm && (
        <div style={{ position: 'absolute', bottom: 14, left: 12, zIndex: 1000, background: 'white', borderRadius: 11, padding: '9px 13px', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#222' }}>
            {loading ? 'Chargement…' : `${visibleFarms.length} exploitation${visibleFarms.length > 1 ? 's' : ''}`}
          </div>
          {!loading && (
            <div style={{ display: 'flex', gap: 9, marginTop: 5 }}>
              {[[NON_QUALIFIE, 'À qualifier'], [G.orange, 'Prospect'], [G.primary, 'Client']].map(([c, l]) => (
                <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: G.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: c }} />{l}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom sheet exploitation */}
      {selFarm && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 1001, background: 'white', borderRadius: 15, padding: '15px 16px', boxShadow: '0 4px 22px rgba(0,0,0,0.22)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>{selFarm.nom}</div>
              <div style={{ fontSize: 12, color: G.muted, marginTop: 3 }}>{selFarm.adresse}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 5 }}>{selFarm.naf_label}</div>
            </div>
            <button onClick={() => setSelFarm(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 17, color: G.muted, padding: 0, flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: selStatut ? STATUT_COLORS[selStatut] : NON_QUALIFIE, background: selStatut === 'client' ? '#EBF4E1' : selStatut === 'prospect' ? '#FBF0E7' : '#F0F1EF' }}>
              {selStatut === 'client' ? 'Client' : selStatut === 'prospect' ? 'Prospect' : 'À qualifier'}
            </span>
            <span style={{ fontSize: 11, color: G.muted, fontFamily: 'monospace' }}>{selFarm.siret}</span>
          </div>
          <button onClick={() => onOpenFiche(selFarm.siret)} style={{ width: '100%', marginTop: 12, padding: '12px 0', borderRadius: 11, border: 'none', background: G.primary, color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
            Ouvrir la fiche
          </button>
        </div>
      )}
    </div>
  );
}
