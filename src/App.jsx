import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// IOSDevice frame removed — full-screen native app
import { EQUIPMENT_CATEGORIES, detectRegion } from './data/equipmentData';
import { getInspectionSections } from './data/inspectionData';

/* ── COULEURS ── */
const G = {
  primary: '#4C7F05', dark: '#104410', light: '#6BA32E',
  cream: '#F5F2EA', muted: '#5C6B4E', border: '#DDE9D4',
  red: '#C0392B', orange: '#D4681A', gold: '#B8860B',
  white: '#fff', bg: '#F7F5EF',
};

/* ── ICÔNES SVG ── */
const Ic = ({ n, s = 20, c = 'currentColor', style = {} }) => {
  const paths = {
    home:    <><path d="M3 10L12 3l9 7v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10z" stroke={c} strokeWidth="1.7" fill="none"/><path d="M9 21V13h6v8" stroke={c} strokeWidth="1.7" fill="none"/></>,
    plus:    <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round"/>,
    truck:   <><rect x="1" y="3" width="15" height="13" rx="2" stroke={c} strokeWidth="1.7" fill="none"/><path d="M16 8h4l3 3v5h-7V8z" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="5.5" cy="18.5" r="2.5" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="18.5" cy="18.5" r="2.5" stroke={c} strokeWidth="1.7" fill="none"/></>,
    user:    <><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.7" fill="none"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/></>,
    chevL:   <path d="M15 18l-6-6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    chevR:   <path d="M9 18l6-6-6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    chevD:   <path d="M6 9l6 6 6-6" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    check:   <path d="M5 12l5 5L20 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    clock:   <><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" fill="none"/><path d="M12 7v5l3 3" stroke={c} strokeWidth="1.7" strokeLinecap="round" fill="none"/></>,
    camera:  <><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="13" r="4" stroke={c} strokeWidth="1.7" fill="none"/></>,
    target:  <><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="12" r="5" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="12" r="1" fill={c}/></>,
    leaf:    <path d="M12 2C6 2 3 8 3 13c0 3.5 2 6.5 5.5 7.5V22h1v-2h1v2h1v-1.5C15 19.5 21 16 21 11 21 5 17 2 12 2z" stroke={c} strokeWidth="1.7" fill="none"/>,
    star:    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" stroke={c} strokeWidth="1.6" fill="none"/>,
    info:    <><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.7" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="12" cy="8" r="0.5" fill={c} stroke={c} strokeWidth="1.5"/></>,
    engine:  <><rect x="3" y="7" width="18" height="10" rx="2" stroke={c} strokeWidth="1.7" fill="none"/><path d="M7 7V5M17 7V5M3 12h2M19 12h2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
    wheel:   <><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.7" fill="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></>,
    drop:    <path d="M12 2c0 0-8 8-8 13a8 8 0 0016 0C20 10 12 2 12 2z" stroke={c} strokeWidth="1.7" fill="none"/>,
    paint:   <><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke={c} strokeWidth="1.6" fill="none"/><path d="M8 12h8M8 8h8M8 16h5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
    bench:   <><path d="M4 6h16v2H4zM4 16h16v2H4z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M6 8v8M18 8v8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
    seat:    <><path d="M4 16h16M6 16V8a4 4 0 018 0v8" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/><path d="M10 8h4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
    publish: <><path d="M12 2L2 7l10 5 10-5-10-5z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/></>,
    edit:    <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={c} strokeWidth="1.7" fill="none"/></>,
    phone:   <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={c} strokeWidth="1.7" fill="none"/></>,
    mail:    <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={c} strokeWidth="1.7" fill="none"/><polyline points="22,6 12,13 2,6" stroke={c} strokeWidth="1.7" fill="none"/></>,
    pin:     <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="10" r="3" stroke={c} strokeWidth="1.7" fill="none"/></>,
    /* Equipment category icons — agricultural silhouettes */
    tractor: <><circle cx="7" cy="17" r="4.5" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="18.5" cy="18" r="2.5" stroke={c} strokeWidth="1.7" fill="none"/><path d="M11.5 17V11.5h2.5l4 5V17" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/><rect x="7" y="7" width="4.5" height="4.5" rx="1" stroke={c} strokeWidth="1.5" fill="none"/><line x1="9.5" y1="7" x2="9.5" y2="5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
    wheat:   <><line x1="12" y1="22" x2="12" y2="9" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><path d="M12 9c-1-3-5-4-5-7 0 3 4 5 5 7z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M12 9c1-3 5-4 5-7 0 3-4 5-5 7z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M12 14c-1-2-4-2-4-4 0 2 3 3 4 4z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M12 14c1-2 4-2 4-4 0 2-3 3-4 4z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M12 19c-1-2-3-2-3-4 0 2 2 3 3 4z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/><path d="M12 19c1-2 3-2 3-4 0 2-2 3-3 4z" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round"/></>,
    harrow:  <><rect x="2" y="4" width="20" height="4" rx="1" stroke={c} strokeWidth="1.6" fill="none"/><path d="M5 8v7l2 4M9 8v8l2 3M13 8v8l2 3M17 8v7l2 4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="21" x2="22" y2="21" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></>,
    seeder:  <><rect x="2" y="3" width="20" height="5" rx="1" stroke={c} strokeWidth="1.6" fill="none"/><path d="M6 8v5M10 8v4M14 8v5M18 8v4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><circle cx="6" cy="15" r="1.5" fill={c}/><circle cx="10" cy="14" r="1.5" fill={c}/><circle cx="14" cy="15" r="1.5" fill={c}/><circle cx="18" cy="14" r="1.5" fill={c}/><line x1="2" y1="19" x2="22" y2="19" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></>,
    bale:    <><circle cx="12" cy="14" r="7" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="12" cy="14" r="4" stroke={c} strokeWidth="1.2" fill="none"/><circle cx="12" cy="14" r="1.5" stroke={c} strokeWidth="1.2" fill="none"/><line x1="5" y1="14" x2="19" y2="14" stroke={c} strokeWidth="1" strokeLinecap="round"/><path d="M9 5l6 2" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
    sprayBoom: <><rect x="7" y="5" width="10" height="7" rx="1.5" stroke={c} strokeWidth="1.6" fill="none"/><line x1="12" y1="12" x2="12" y2="15" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="15" x2="22" y2="15" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="5" cy="18" r="1.5" stroke={c} strokeWidth="1.4" fill="none"/><circle cx="9" cy="19" r="1.5" stroke={c} strokeWidth="1.4" fill="none"/><circle cx="15" cy="19" r="1.5" stroke={c} strokeWidth="1.4" fill="none"/><circle cx="19" cy="18" r="1.5" stroke={c} strokeWidth="1.4" fill="none"/></>,
    telehandler: <><rect x="2" y="13" width="11" height="7" rx="1" stroke={c} strokeWidth="1.7" fill="none"/><path d="M13 17h4" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><path d="M8 13V8h3l6-5 3 3-7 7H8" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 6l3 3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><circle cx="5" cy="21" r="1.5" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="10" cy="21" r="1.5" stroke={c} strokeWidth="1.5" fill="none"/></>,
    dump:    <><path d="M2 16h14v4H2z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M16 18h6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="6" cy="21" r="1.5" stroke={c} strokeWidth="1.5" fill="none"/><circle cx="12" cy="21" r="1.5" stroke={c} strokeWidth="1.5" fill="none"/><path d="M4 16V11l3-6h10l3 5v6" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    /* Inspection section icons */
    blade:   <><path d="M12 22V2M4 17l8-15 8 15" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    filter:  <><polyline points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    fan:     <><circle cx="12" cy="12" r="2.5" stroke={c} strokeWidth="1.7" fill="none"/><path d="M12 9.5C12 6 10 3 8 3s-3 2-2 4.5C7 10 9.5 11 12 9.5z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M14.5 11C18 11 21 9 21 7s-2-3-4.5-2C14 6 13 8.5 14.5 11z" stroke={c} strokeWidth="1.5" fill="none"/><path d="M9.5 13C6 13 3 15 3 17s2 3 4.5 2C10 18 11 15.5 9.5 13z" stroke={c} strokeWidth="1.5" fill="none"/></>,
    roll:    <><ellipse cx="12" cy="12" rx="9" ry="5" stroke={c} strokeWidth="1.7" fill="none"/><line x1="3" y1="12" x2="3" y2="17" stroke={c} strokeWidth="1.7"/><line x1="21" y1="12" x2="21" y2="17" stroke={c} strokeWidth="1.7"/><ellipse cx="12" cy="17" rx="9" ry="5" stroke={c} strokeWidth="1.7" fill="none"/></>,
    spray:   <><path d="M3 7h5v12H3z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M8 11h4" stroke={c} strokeWidth="1.7" strokeLinecap="round"/><circle cx="16" cy="8" r="1.2" fill={c}/><circle cx="19" cy="11" r="1.2" fill={c}/><circle cx="16" cy="14" r="1.2" fill={c}/><circle cx="13" cy="7" r="1.2" fill={c}/><circle cx="13" cy="15" r="1.2" fill={c}/></>,
    lift:    <><path d="M4 21V9l6-6h10v18H4z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/><path d="M10 3v6H4" stroke={c} strokeWidth="1.7" fill="none"/><rect x="7" y="14" width="6" height="7" stroke={c} strokeWidth="1.5" fill="none"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" style={style}>{paths[n] || null}</svg>;
};

/* ── ÉTATS ── */
const ETATS = [
  { v: 'Neuf',     c: G.dark,    bg: '#E6F0DC' },
  { v: 'Très bon', c: G.primary, bg: '#EBF4E1' },
  { v: 'Bon',      c: G.light,   bg: '#EFF6E6' },
  { v: 'Moyen',    c: G.orange,  bg: '#FBF0E7' },
  { v: 'HS',       c: G.red,     bg: '#FDECEA' },
];
function EtatRow({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'nowrap', overflowX: 'auto' }}>
      {ETATS.map(e => {
        const active = current === e.v;
        return (
          <button key={e.v} onClick={() => onChange(e.v)} style={{ flexShrink: 0, padding: '5px 9px', borderRadius: 8, border: `1.5px solid ${active ? e.c : '#DDD'}`, background: active ? e.bg : 'white', cursor: 'pointer' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: active ? e.c : '#BBB' }}>{e.v}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── EN-TÊTE AVEC RETOUR ── */
function BackHeader({ title, sub, onBack, pct }) {
  return (
    <div style={{ background: G.dark, flexShrink: 0, paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 12px), 16px)' }}>
      <div style={{ padding: '8px 20px 0' }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', color: 'rgba(255,255,255,0.7)' }}>
          <Ic n="chevL" s={18} c="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Retour</span>
        </button>
      </div>
      <div style={{ padding: '0 20px 14px' }}>
        {sub && <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 2 }}>{sub}</div>}
        <div style={{ fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>{title}</div>
        {pct !== undefined && (
          <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 99 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: G.light, borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── PICKER FLÈCHES (année, heures…) ── */
function ArrowPicker({ value, onChange, min = 0, max = 9999, label, placeholder, required }) {
  const timerRef = useRef(null);
  const clamp = n => Math.max(min, Math.min(max, n));

  const adjust = useCallback((dir) => {
    onChange(v => String(clamp((parseInt(v) || (dir > 0 ? min - 1 : max + 1)) + dir)));
  }, [min, max]);

  const startHold = (dir) => {
    adjust(dir);
    let delay = 350;
    const tick = () => {
      adjust(dir);
      delay = Math.max(40, delay * 0.75);
      timerRef.current = setTimeout(tick, delay);
    };
    timerRef.current = setTimeout(tick, delay);
  };
  const stopHold = () => clearTimeout(timerRef.current);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const btn = (dir) => ({
    onMouseDown: () => startHold(dir),
    onMouseUp: stopHold,
    onMouseLeave: stopHold,
    onTouchStart: e => { e.preventDefault(); startHold(dir); },
    onTouchEnd: stopHold,
    style: { padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', color: G.primary, fontSize: 18, fontWeight: 700, userSelect: 'none', flexShrink: 0 },
  });

  return (
    <div>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>{label}{required && ' *'}</label>}
      <div style={{ display: 'flex', border: `1.5px solid ${G.border}`, borderRadius: 10, background: 'white', overflow: 'hidden' }}>
        <button {...btn(-1)}>−</button>
        <input
          type="number" value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, border: 'none', textAlign: 'center', fontSize: 14, outline: 'none', padding: '10px 0', color: '#1A1A1A', background: 'transparent', minWidth: 0 }}
        />
        <button {...btn(1)}>+</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   CLIENT (Étape 0 / 4)
══════════════════════════════════ */
function ClientScreen({ onBack, onNext }) {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [addrQ,     setAddrQ]     = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selAddr,   setSelAddr]   = useState(null);
  const [region,    setRegion]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const debounceRef = useRef(null);

  const searchAddr = useCallback((q) => {
    clearTimeout(debounceRef.current);
    if (q.length < 3) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=fr&limit=6&q=${encodeURIComponent(q)}`,
          { headers: { 'Accept-Language': 'fr' } }
        );
        const data = await res.json();
        setSuggestions(data);
      } catch { setSuggestions([]); }
      setLoading(false);
    }, 420);
  }, []);

  const pickAddr = (item) => {
    const a = item.address || {};
    const houseNum = a.house_number || '';
    const road = a.road || a.pedestrian || a.path || item.display_name.split(',')[0] || '';
    const postcode = a.postcode || '';
    // Prefer commune/village over arrondissement city for accurate region detection
    const commune = a.village || a.hamlet || a.town || a.city || a.municipality || '';
    const streetPart = [houseNum, road].filter(Boolean).join(' ');
    // Avoid "Saint-Flavy, Saint-Flavy" when road === commune (commune-level result)
    const showCommune = commune && commune.toLowerCase() !== road.toLowerCase();
    const display = [streetPart, showCommune ? commune : ''].filter(Boolean).join(', ') || item.display_name.split(',')[0];
    setAddrQ(display);
    setSelAddr(item);
    setSuggestions([]);
    setRegion(detectRegion(commune, postcode));
  };

  const canGo = firstName.trim() && lastName.trim() && (email.trim() || phone.trim());
  const inp = { width: '100%', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 13, outline: 'none', background: 'white', color: '#1A1A1A' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
      <BackHeader title="Identification client" sub="Étape 0 / 4" onBack={onBack} pct={0} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 90px' }} onClick={() => setSuggestions([])}>
        <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 12 }}>Coordonnées</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Prénom *</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Nom *</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" style={inp} />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic n="mail" s={12} c={G.muted} />Email</span>
          </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean.dupont@gaec.fr" style={inp} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic n="phone" s={12} c={G.muted} />Téléphone</span>
          </label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" style={inp} />
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 12 }}>Adresse</div>

        <div style={{ position: 'relative', marginBottom: 4 }} onClick={e => e.stopPropagation()}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Ic n="pin" s={12} c={G.muted} />Adresse</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              value={addrQ}
              onChange={e => { setAddrQ(e.target.value); setSelAddr(null); setRegion(null); searchAddr(e.target.value); }}
              onFocus={() => !selAddr && addrQ.length >= 3 && searchAddr(addrQ)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              placeholder="Ex : 3 rue des Moissons, Troyes…"
              style={{ ...inp, paddingRight: loading ? 36 : 13 }}
            />
            {loading && (
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, borderRadius: 7, border: `2px solid ${G.border}`, borderTopColor: G.primary, animation: 'spin 0.7s linear infinite' }} />
            )}
          </div>

          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: `1.5px solid ${G.border}`, borderRadius: 12, zIndex: 50, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', marginTop: 4, overflow: 'hidden' }}>
              {suggestions.map((s, i) => {
                const parts = s.display_name.split(', ');
                const main  = parts.slice(0, 2).join(', ');
                const sub2  = parts.slice(2, 4).join(', ');
                return (
                  <div key={i} onMouseDown={() => pickAddr(s)}
                    style={{ padding: '10px 14px', borderBottom: i < suggestions.length - 1 ? `1px solid ${G.border}` : 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Ic n="pin" s={14} c={G.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{main}</div>
                      {sub2 && <div style={{ fontSize: 11, color: G.muted, marginTop: 1 }}>{sub2}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Région détectée */}
        {region && (
          <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 12, background: `${region.color}18`, border: `1.5px solid ${region.color}55`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: region.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{region.label}</div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 1 }}>{region.typeSol}</div>
            </div>
          </div>
        )}
        {selAddr && !region && (
          <div style={{ marginTop: 8, fontSize: 11, color: G.muted, fontStyle: 'italic' }}>Zone hors Aube — aucune région agronomique détectée</div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${G.border}`, padding: '12px 20px 16px' }}>
        <button
          onClick={() => onNext({ firstName, lastName, email, phone, address: addrQ, region })}
          disabled={!canGo}
          style={{ width: '100%', padding: '15px', background: canGo ? G.primary : '#DDD', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: canGo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Continuer <Ic n="chevR" s={16} c="white" />
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════
   IDENTIFICATION (Étape 1 / 4)
══════════════════════════════════ */
function IdScreen({ dbs, onBack, onNext }) {
  const [category,     setCategory]     = useState(null);
  const [subcatId,     setSubcatId]     = useState('');
  const [brandQ,       setBrandQ]       = useState('');
  const [brandOpen,    setBrandOpen]    = useState(false);
  const [brand,        setBrand]        = useState('');
  const [modelQ,       setModelQ]       = useState('');
  const [modelOpen,    setModelOpen]    = useState(false);
  const [selModel,     setSelModel]     = useState(null);
  const [year,         setYear]         = useState('');
  const [hours,        setHours]        = useState('');
  const [serial,       setSerial]       = useState('');
  const [tech, setTech] = useState({
    puissance:'', cylindres:'', cylindree:'', couple:'', boite:'',
    pneusAV:'', pneusAR:'', poids:'', relevage:'', pompe:'',
    largeurCoupe:'', nbSecoueurs:'', volTremie:'', surfSecouage:'',
    chargeMax:'', hauteurMax:'', porteeMax:'',
  });
  const setT = (k, v) => setTech(t => ({ ...t, [k]: v }));

  /* ── Base de données active selon catégorie ── */
  const catDb = useMemo(() => {
    if (!category) return {};
    if (category.id === 'tracteur') return dbs.tracteur;
    if (category.id === 'recolte' && subcatId === 'moissonneuse') return dbs.moissonneuse;
    if (category.id === 'telescopique') return dbs.telescopique;
    return {};
  }, [category, subcatId, dbs]);

  const hasDb = useMemo(() => Object.keys(catDb).length > 0, [catDb]);

  /* ── Suggestions marque : toutes les marques dès le focus, filtrées si on tape ── */
  const brandSuggestions = useMemo(() => {
    if (!category) return [];
    const allBrands = hasDb ? Object.keys(catDb).sort() : [...category.brands].sort();
    if (!brandQ) return allBrands;
    const q = brandQ.toLowerCase();
    return allBrands.filter(b => b.toLowerCase().includes(q));
  }, [category, brandQ, catDb, hasDb]);

  /* ── Suggestions modèle : tri smart (commence par > contient), sans limite ── */
  const modelSuggestions = useMemo(() => {
    if (!hasDb || !brand || !catDb[brand]) return [];
    const q = modelQ.toLowerCase().trim();
    const all = catDb[brand];
    if (!q) return all; // tout afficher si rien tapé
    const starts = all.filter(m => m.modele?.toLowerCase().startsWith(q));
    const contains = all.filter(m => !m.modele?.toLowerCase().startsWith(q) && m.modele?.toLowerCase().includes(q));
    return [...starts, ...contains];
  }, [catDb, brand, modelQ, hasDb]);

  const pickBrand = (b) => {
    setBrand(b); setBrandQ(b); setBrandOpen(false);
    setModelQ(''); setSelModel(null);
  };
  const pickModel = (m) => {
    setSelModel(m); setModelQ(m.modele); setModelOpen(false);
    setTech(t => ({
      ...t,
      puissance:    m.puissance     || '',
      cylindres:    m.cylindres     || '',
      cylindree:    m.cylindree     || '',
      couple:       m.couple        || '',
      boite:        m.boiteVitesses || '',
      pneusAV:      m.pneusAV       || '',
      pneusAR:      m.pneusAR       || '',
      poids:        m.poidsVide     ? (m.poidsVide.toString().includes('t') ? m.poidsVide : m.poidsVide + ' t') : '',
      relevage:     m.effortRelevage|| '',
      pompe:        m.debitPompe    || '',
      largeurCoupe: m.largeurCoupe  || '',
      nbSecoueurs:  m.nbSecoueurs   || '',
      volTremie:    m.volTremie     || '',
      surfSecouage: m.surfSecouage  || '',
      chargeMax:    m.chargeMax     || '',
      hauteurMax:   m.hauteurMax    || '',
      porteeMax:    m.porteeMax     || '',
    }));
    if (m.annee && !year) setYear(String(m.annee));
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    setSubcatId(cat.subcategories.length === 1 ? cat.subcategories[0].id : '');
    setBrand(''); setBrandQ(''); setModelQ(''); setSelModel(null);
  };

  /* Auto-confirme la marque si le texte tapé correspond exactement (insensible à la casse) */
  useEffect(() => {
    if (!brandQ || brand) return;
    const match = brandSuggestions.find(b => b.toLowerCase() === brandQ.toLowerCase());
    if (match) { setBrand(match); setBrandQ(match); setBrandOpen(false); }
  }, [brandQ, brand, brandSuggestions]);

  /* ── Champs techniques selon catégorie ── */
  const techFields = useMemo(() => {
    if (category?.id === 'tracteur') return [
      ['puissance', 'Puissance', 'ch'],    ['cylindres', 'Cylindres', 'cyl.'],
      ['cylindree', 'Cylindrée', 'cm³'],   ['couple', 'Couple', 'N.m'],
      ['boite', 'Transmission', ''],        ['pneusAV', 'Pneus AV', ''],
      ['pneusAR', 'Pneus AR', ''],          ['poids', 'Poids', 't'],
      ['relevage', 'Relevage', 't'],        ['pompe', 'Pompe hyd.', 'l/min'],
    ];
    if (category?.id === 'recolte' && subcatId === 'moissonneuse') return [
      ['puissance', 'Puissance', 'ch'],    ['cylindres', 'Cylindres', 'cyl.'],
      ['cylindree', 'Cylindrée', 'cm³'],   ['largeurCoupe', 'Larg. coupe', 'm'],
      ['nbSecoueurs', 'Secoueurs', ''],    ['volTremie', 'Trémie', 'L'],
      ['surfSecouage', 'Surface sec.', 'm²'],
    ];
    if (category?.id === 'telescopique') return [
      ['puissance', 'Puissance', 'ch'],    ['cylindres', 'Cylindres', 'cyl.'],
      ['chargeMax', 'Charge max', 't'],    ['hauteurMax', 'Hauteur max', 'm'],
      ['porteeMax', 'Portée max', 'm'],    ['poids', 'Poids', 't'],
    ];
    return [];
  }, [category, subcatId]);

  const showTech = techFields.length > 0;
  const canGo = category && subcatId && brand && modelQ && year && hours;
  const inp = { width: '100%', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 13, outline: 'none', background: 'white', color: '#1A1A1A' };

  /* ── Sélection de catégorie ── */
  if (!category) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
        <BackHeader title="Type de matériel" sub="Étape 1 / 4" onBack={onBack} pct={25} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
          <div style={{ fontSize: 13, color: G.muted, marginBottom: 14 }}>Choisissez une catégorie :</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {EQUIPMENT_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => selectCategory(cat)}
                style={{ padding: '16px 12px', background: 'white', border: `1.5px solid ${G.border}`, borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', transition: 'border-color 0.15s' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EBF4E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ic n={cat.icon} s={22} c={G.primary} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Formulaire identification ── */
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
      <div style={{ background: G.dark, flexShrink: 0, paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 12px), 16px)' }}>
        <div style={{ padding: '8px 20px 0' }}>
          <button onClick={() => setCategory(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0', color: 'rgba(255,255,255,0.7)' }}>
            <Ic n="chevL" s={18} c="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Catégories</span>
          </button>
        </div>
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 2 }}>Étape 1 / 4</div>
          <div style={{ fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>{category.label}</div>
          <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 99 }}>
            <div style={{ width: '25%', height: '100%', background: G.light, borderRadius: 99 }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 90px' }} onClick={() => { setBrandOpen(false); setModelOpen(false); }}>

        {/* Sous-catégorie */}
        {category.subcategories.length > 1 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 8 }}>Sous-catégorie *</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {category.subcategories.map(s => (
                <button key={s.id} onClick={() => setSubcatId(s.id)}
                  style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${subcatId === s.id ? G.primary : G.border}`, background: subcatId === s.id ? '#EBF4E1' : 'white', color: subcatId === s.id ? G.primary : '#555', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>Identification</div>

        {/* Marque */}
        <div style={{ marginBottom: 11, position: 'relative' }} onClick={e => e.stopPropagation()}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Marque *</label>
          <input
            value={brandQ}
            onChange={e => { setBrandQ(e.target.value); setBrand(''); setBrandOpen(true); }}
            onFocus={() => { setBrandOpen(true); }}
            placeholder="Choisir une marque…"
            style={inp}
          />
          {brandOpen && brandSuggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: `1.5px solid ${G.border}`, borderRadius: 12, maxHeight: 240, overflowY: 'auto', zIndex: 50, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', marginTop: 4 }}>
              {brandSuggestions.map((b, i) => (
                <div key={b} onMouseDown={() => pickBrand(b)}
                  style={{ padding: '10px 14px', borderBottom: i < brandSuggestions.length - 1 ? `1px solid ${G.border}` : 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                  {b}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modèle */}
        <div style={{ marginBottom: 11, position: 'relative' }} onClick={e => e.stopPropagation()}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
            Modèle *
            {hasDb && brand && catDb[brand] && <span style={{ color: G.muted, fontWeight: 400 }}> ({catDb[brand].length} modèles)</span>}
          </label>
          <input
            value={modelQ}
            onChange={e => { setModelQ(e.target.value); setModelOpen(true); setSelModel(null); }}
            onFocus={() => setModelOpen(true)}
            placeholder={hasDb && brand && catDb[brand] ? 'Rechercher dans la base…' : 'Ex : T7.270, 6R 250, 7250…'}
            style={inp}
          />
          {modelOpen && modelSuggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: `1.5px solid ${G.border}`, borderRadius: 12, maxHeight: 260, overflowY: 'auto', zIndex: 50, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', marginTop: 4 }}>
              {modelSuggestions.map((m, i) => (
                <div key={i} onMouseDown={() => pickModel(m)}
                  style={{ padding: '10px 14px', borderBottom: i < modelSuggestions.length - 1 ? `1px solid ${G.border}` : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{m.modele}</div>
                    {m.annee && <div style={{ fontSize: 11, color: G.muted }}>{m.annee}{m.puissance && ` · ${m.puissance}`}</div>}
                  </div>
                  {m.puissance && <div style={{ fontSize: 11, fontWeight: 700, color: G.primary, flexShrink: 0 }}>{m.puissance}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Année */}
        <div style={{ marginBottom: 11 }}>
          <ArrowPicker value={year} onChange={setYear} min={1950} max={2026} label="Année" placeholder="2018" required />
        </div>
        {/* Heures */}
        <div style={{ marginBottom: 11 }}>
          <ArrowPicker value={hours} onChange={setHours} min={0} max={99999} label="Heures (h)" placeholder="6 500" required />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>N° de série</label>
          <input value={serial} onChange={e => setSerial(e.target.value)} placeholder="Ex : JD6530P2008XXXX" style={inp} />
        </div>

        {/* Caractéristiques techniques */}
        {showTech && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>Caractéristiques</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 18 }}>
              {techFields.map(([k, l, u]) => (
                <div key={k}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{l}{u && <span style={{ fontWeight: 400, color: G.muted }}> ({u})</span>}</label>
                  <input value={tech[k]} onChange={e => setT(k, e.target.value)} placeholder="—" style={{ ...inp, fontSize: 12, padding: '8px 11px' }} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${G.border}`, padding: '12px 20px 16px' }}>
        <button
          onClick={() => onNext({ categoryId: category.id, subcategoryId: subcatId, categoryLabel: category.label, brand, model: selModel || { modele: modelQ }, modelQ, tech, year, hours, serial })}
          disabled={!canGo}
          style={{ width: '100%', padding: '15px', background: canGo ? G.primary : '#DDD', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: canGo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Démarrer l'inspection <Ic n="chevR" s={16} c="white" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   INSPECTION (Étape 2 / 4)
══════════════════════════════════ */
function InspectionScreen({ machineInfo, onBack, onNext }) {
  const sections = useMemo(() => getInspectionSections(machineInfo?.subcategoryId), [machineInfo]);
  const [secIdx, setSecIdx] = useState(0);
  const [etats,  setEtats]  = useState({});
  const [checks, setChecks] = useState({});
  const [pneus,  setPneus]  = useState(() => {
    const av = machineInfo?.tech?.pneusAV || '';
    const ar = machineInfo?.tech?.pneusAR || '';
    return { pneu_avd: { dim: av, usure: '' }, pneu_avg: { dim: av, usure: '' }, pneu_ard: { dim: ar, usure: '' }, pneu_arg: { dim: ar, usure: '' } };
  });
  const [notes, setNotes] = useState({});

  const sec  = sections[secIdx];
  const setE = (id, v) => setEtats(e => ({ ...e, [id]: v }));
  const setC = (id, v) => setChecks(c => ({ ...c, [id]: v }));
  const setP = (id, k, v) => setPneus(p => ({ ...p, [id]: { ...(p[id] || {}), [k]: v } }));

  const secDone = s => s.items.every(it => {
    if (it.type === 'etat')    return !!etats[it.id];
    if (it.type === 'check')   return checks[it.id] !== undefined;
    if (it.type === 'exhaust') return checks[it.id] !== undefined;
    if (it.type === 'pneu')    return !!pneus[it.id]?.pct;
    return true;
  });
  const doneCnt  = sections.filter(secDone).length;
  const allDone  = doneCnt === sections.length;

  const inp = { padding: '8px 11px', borderRadius: 8, border: `1.5px solid ${G.border}`, fontSize: 12, outline: 'none', background: 'white', color: '#1A1A1A', width: '100%' };
  const ArrowSVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 10 7'%3E%3Cpath d='M1 1l4 4.5L9 1' stroke='%234C7F05' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden', position: 'relative' }}>
      <BackHeader title="Inspection" sub={`Étape 2 / 4 — ${machineInfo?.brand} ${machineInfo?.modelQ || ''}`} onBack={onBack} pct={50} />

      {/* Onglets sections */}
      <div style={{ background: G.dark, paddingBottom: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px' }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => setSecIdx(i)}
              style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${i === secIdx ? G.light : secDone(s) ? 'rgba(107,163,46,0.45)' : 'rgba(255,255,255,0.1)'}`, background: i === secIdx ? G.primary : secDone(s) ? 'rgba(107,163,46,0.1)' : 'transparent', color: i === secIdx ? 'white' : secDone(s) ? G.light : 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Ic n={s.icon || 'info'} s={12} c={i === secIdx ? 'white' : secDone(s) ? G.light : 'rgba(255,255,255,0.4)'} />
              {s.label}
              {secDone(s) && <Ic n="check" s={10} c={G.light} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 90px' }}>
        {/* Guide */}
        {sec.guide && sec.guide.length > 0 && (
          <div style={{ background: 'white', border: `1px solid ${G.border}`, borderRadius: 13, padding: '13px 15px', marginBottom: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EBF4E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic n={sec.icon || 'info'} s={14} c={G.primary} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.dark }}>Guide — {sec.label}</div>
            </div>
            {sec.guide.map(g => (
              <div key={g.title} style={{ marginBottom: 7, paddingLeft: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: G.primary, marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{g.title} </span>
                    <span style={{ fontSize: 12, color: G.muted, lineHeight: 1.5 }}>{g.txt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items */}
        {sec.items.map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: 12, padding: '13px 14px', marginBottom: 9, boxShadow: '0 1px 5px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>{item.label}</div>
            {item.type === 'etat' && <EtatRow current={etats[item.id]} onChange={v => setE(item.id, v)} />}
            {item.type === 'check' && (
              <div style={{ display: 'flex', gap: 8 }}>
                {['OK', 'Non conforme'].map(v => (
                  <button key={v} onClick={() => setC(item.id, v)}
                    style={{ padding: '5px 14px', borderRadius: 8, border: `1.5px solid ${checks[item.id] === v ? (v === 'OK' ? G.primary : G.red) : '#DDD'}`, background: checks[item.id] === v ? (v === 'OK' ? '#EBF4E1' : '#FDECEA') : 'white', color: checks[item.id] === v ? (v === 'OK' ? G.primary : G.red) : '#AAA', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    {v === 'OK' ? 'Conforme' : 'Non conforme'}
                  </button>
                ))}
              </div>
            )}
            {item.type === 'exhaust' && (() => {
              const COLORS = [
                { v: 'transparent', label: 'Incolore',    dot: 'rgba(200,200,200,0.5)', border: '#CCC', ok: true  },
                { v: 'blanc',       label: 'Blanc',       dot: '#E8E8E8',               border: '#999', ok: false },
                { v: 'bleu',        label: 'Bleu',        dot: '#5B8FE0',               border: '#3A6BC4', ok: false },
                { v: 'noir',        label: 'Noir',        dot: '#1A1A1A',               border: '#555', ok: false },
              ];
              const cur = checks[item.id];
              return (
                <div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
                    {COLORS.map(c => {
                      const active = cur === c.v;
                      return (
                        <button key={c.v} onClick={() => setC(item.id, c.v)} style={{
                          display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px',
                          borderRadius: 10, border: `1.5px solid ${active ? c.border : '#DDD'}`,
                          background: active ? (c.ok ? '#EBF4E1' : '#FDF4EC') : 'white',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <div style={{ width: 14, height: 14, borderRadius: 7, background: c.dot, border: `1px solid ${c.border}`, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: active ? (c.ok ? G.primary : G.orange) : '#888' }}>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {cur && (
                    <div style={{ padding: '7px 10px', borderRadius: 8, background: COLORS.find(c=>c.v===cur)?.ok ? '#EBF4E1' : '#FDF4EC', fontSize: 11, fontWeight: 600, color: COLORS.find(c=>c.v===cur)?.ok ? G.primary : G.orange }}>
                      {cur === 'transparent' && '✓ Normal — Combustion saine'}
                      {cur === 'blanc' && '⚠ Liquide de refroidissement ou vapeur d\'eau — Vérifier joint de culasse'}
                      {cur === 'bleu' && '⚠ Huile brûlée — Usure segments ou turbo à surveiller'}
                      {cur === 'noir' && '⚠ Richesse excessive — Filtre à air, injecteurs ou turbo à contrôler'}
                    </div>
                  )}
                </div>
              );
            })()}
            {item.type === 'pneu' && (() => {
              const pctVal = parseInt(pneus[item.id]?.pct ?? '');
              const usureLabel = isNaN(pctVal) ? null
                : pctVal >= 80 ? { l: 'Très bon état', c: G.primary, bg: '#EBF4E1' }
                : pctVal >= 50 ? { l: 'Bon état',      c: G.light,   bg: '#EFF6E6' }
                : pctVal >= 20 ? { l: 'Moyen',         c: G.orange,  bg: '#FBF0E7' }
                :                { l: 'Hors service',  c: G.red,     bg: '#FDECEA' };
              return (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: G.muted, marginBottom: 4 }}>Dimension</div>
                    <input value={pneus[item.id]?.dim || ''} onChange={e => setP(item.id, 'dim', e.target.value)} placeholder="540/65R38" style={inp} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 11, color: G.muted }}>Usure des crampons</div>
                      {usureLabel && (
                        <div style={{ padding: '2px 9px', borderRadius: 20, background: usureLabel.bg, fontSize: 10, fontWeight: 700, color: usureLabel.c }}>
                          {pctVal}% — {usureLabel.l}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2 }}>
                      {[0,10,20,30,40,50,60,70,80,90,100].map(pct => {
                        const active = pneus[item.id]?.pct === String(pct);
                        const col = pct >= 80 ? G.primary : pct >= 50 ? G.light : pct >= 20 ? G.orange : G.red;
                        return (
                          <button key={pct} onClick={() => setP(item.id, 'pct', String(pct))}
                            style={{ flexShrink: 0, width: 36, padding: '6px 0', borderRadius: 8,
                                     border: `1.5px solid ${active ? col : '#DDD'}`,
                                     background: active ? col : 'white',
                                     color: active ? 'white' : '#AAA',
                                     fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                            {pct}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
            <input value={notes[item.id] || ''} onChange={e => setNotes(n => ({ ...n, [item.id]: e.target.value }))} placeholder="Observation…" style={{ ...inp, marginTop: 9, fontSize: 11, color: G.muted, background: '#FAFAFA' }} />
          </div>
        ))}

        {/* Commentaires — visible sur la dernière section uniquement */}
        {secIdx === sections.length - 1 && (
          <div style={{ background: 'white', borderRadius: 12, padding: '14px', marginBottom: 9, boxShadow: '0 1px 5px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>Commentaires</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: '#FDF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 15v-5m0-4h.01" stroke={G.orange} strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: G.orange }}>Commentaire interne</div>
                <div style={{ fontSize: 10, color: G.muted, marginLeft: 2 }}>— non visible sur l'annonce</div>
              </div>
              <textarea
                value={notes['__commentaire_interne'] || ''}
                onChange={e => setNotes(n => ({ ...n, __commentaire_interne: e.target.value }))}
                placeholder="Notes privées pour l'inspecteur (état général, contexte, négociation…)"
                rows={3}
                style={{ ...inp, width: '100%', resize: 'none', fontSize: 12, lineHeight: 1.5, boxSizing: 'border-box', background: '#FFFBF6', borderColor: '#F0D8BB' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: '#EBF4E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ic n="publish" s={11} c={G.primary} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: G.primary }}>Commentaire annonce</div>
                <div style={{ fontSize: 10, color: G.muted, marginLeft: 2 }}>— visible par les acheteurs</div>
              </div>
              <textarea
                value={notes['__commentaire_public'] || ''}
                onChange={e => setNotes(n => ({ ...n, __commentaire_public: e.target.value }))}
                placeholder="Au terme de cette inspection, le matériel se présente dans un état…"
                rows={4}
                style={{ ...inp, width: '100%', resize: 'none', fontSize: 12, lineHeight: 1.5, boxSizing: 'border-box', background: '#F9FCF6', borderColor: '#C8E0AA' }}
              />
            </div>
          </div>
        )}

        {/* Navigation entre sections */}
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          {secIdx > 0 && (
            <button onClick={() => setSecIdx(i => i - 1)} style={{ flex: 1, padding: '12px', background: 'white', border: `1.5px solid ${G.border}`, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: G.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Ic n="chevL" s={14} c={G.dark} />{sections[secIdx - 1].label}
            </button>
          )}
          {secIdx < sections.length - 1 && (
            <button onClick={() => setSecIdx(i => i + 1)} style={{ flex: 2, padding: '12px', background: G.primary, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {sections[secIdx + 1].label}<Ic n="chevR" s={14} c="white" />
            </button>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${G.border}`, padding: '12px 20px 16px' }}>
        <button
          onClick={() => allDone && onNext({ etats, checks, pneus, notes })}
          style={{ width: '100%', padding: '14px', background: allDone ? G.primary : '#DDD', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: allDone ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '-0.2px' }}>
          {allDone
            ? <><Ic n="camera" s={17} c="white" />Lancer la visite 360°</>
            : `Visite 360° — ${doneCnt} / ${sections.length} sections`}
          {allDone && <Ic n="chevR" s={16} c="white" />}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   VISITE 360° (Étape 3 / 4)
══════════════════════════════════ */
const VISITE_SPOTS = [
  { id: 'face_av',    label: 'Face avant',          media: 'photo', landscape: false,
    instruction: 'Placez-vous face au matériel. Cadrez la calandre entière.',
    checks: ["Calandre et grille d'aération", 'Phares avant', 'Lest frontal (si présent)'] },
  { id: 'cote_g',     label: 'Côté gauche',         media: 'video', landscape: true,
    instruction: 'Longez le côté gauche en tournant doucement. Filmez flanc + roues.',
    checks: ['Carrosserie complète', 'Roues AV + AR gauche', 'Marchepied'] },
  { id: 'arriere',    label: 'Arrière',              media: 'photo', landscape: false,
    instruction: "Centrez l'attelage 3 points dans le cadre.",
    checks: ['Attelage 3 points', 'Prise de force', 'Feux arrière'] },
  { id: 'cote_d',     label: 'Côté droit',          media: 'video', landscape: true,
    instruction: 'Longez le côté droit. Incluez l\'échappement et le capot moteur.',
    checks: ['Tôlerie droite', "Sortie d'échappement", 'Capot et charnières'] },
  { id: 'moteur',     label: 'Compartiment moteur', media: 'photo', landscape: false,
    instruction: 'Ouvrez le capot. Filmez en plongée légère depuis l\'avant.',
    checks: ["Filtres air/huile", 'Courroies et durites', 'Absence de fuite'] },
  { id: 'cabine_int', label: 'Cabine',              media: 'video', landscape: true,
    instruction: 'Depuis le siège, filmez le tableau de bord en balayant de gauche à droite.',
    checks: ['Tableau de bord', 'Joystick et accoudoir', 'Plancher et revêtement'] },
  { id: 'pneu_av',    label: 'Pneu avant',          media: 'photo', landscape: false,
    instruction: 'Rapprochez-vous du pneu AV droit. Centrez les crampons.',
    checks: ['Profondeur crampons', 'Flanc (coupures)', 'Dimension lisible'] },
  { id: 'pneu_ar',    label: 'Pneu arrière',        media: 'photo', landscape: false,
    instruction: 'Même procédé pour le pneu AR droit.',
    checks: ['Crampons porteurs', 'Flanc intact', 'Marque / dimension'] },
];

function VisiteScreen({ machineInfo, onBack, onNext }) {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const [camOn,     setCamOn]     = useState(false);
  const [gyro,      setGyro]      = useState({ beta: 0, gamma: 0 });
  const [captured,  setCaptured]  = useState({});
  const [current,   setCurrent]   = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [tutoSeen,  setTutoSeen]  = useState(false);
  const [recording, setRecording] = useState(false);

  const stable = Math.abs(gyro.beta) < 7 && Math.abs(gyro.gamma) < 7;
  const bx = Math.max(-22, Math.min(22, gyro.gamma * 2.2));
  const by = Math.max(-22, Math.min(22, gyro.beta  * 2.2));

  const hs      = VISITE_SPOTS[current];
  const isVideo = hs.media === 'video';
  const done    = Object.keys(captured).length;
  const allDone = done === VISITE_SPOTS.length;

  useEffect(() => {
    const h = e => setGyro({ beta: e.beta || 0, gamma: e.gamma || 0 });
    window.addEventListener('deviceorientation', h, true);
    return () => window.removeEventListener('deviceorientation', h);
  }, []);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({
      video: { facingMode: 'environment', frameRate: { ideal: 60, min: 30 }, width: { ideal: 1920 }, height: { ideal: 1080 } }
    }).then(s => {
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setCamOn(true);
    }).catch(() => {});
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  const doCapture = () => {
    if (isVideo) {
      if (!recording) {
        setRecording(true);
        setTimeout(() => {
          setRecording(false);
          setCaptured(c => ({ ...c, [hs.id]: true }));
          if (current < VISITE_SPOTS.length - 1) setTimeout(() => setCurrent(i => i + 1), 320);
        }, 3000);
        return;
      }
    }
    setCapturing(true);
    setTimeout(() => {
      setCaptured(c => ({ ...c, [hs.id]: true }));
      setCapturing(false);
      if (current < VISITE_SPOTS.length - 1) setTimeout(() => setCurrent(i => i + 1), 320);
    }, 500);
  };

  /* ── Tuto 60 FPS (iPhone) ── */
  if (!tutoSeen) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0D0D0D', overflow: 'hidden' }}>
      <div style={{ background: G.dark, paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 12px), 16px)', padding: '0 20px 16px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
          <Ic n="chevL" s={16} c="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Retour</span>
        </button>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>Visite virtuelle</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>Étape 3 / 4 — {machineInfo?.brand} {machineInfo?.modelQ}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Tuto 60 FPS */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(76,127,5,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(76,127,5,0.3)' }}>
              <span style={{ fontSize: 16 }}>🎬</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>Activer 60 FPS sur iPhone</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Pour une visite fluide et professionnelle</div>
            </div>
          </div>
          {[
            { n: '1', txt: 'Ouvrir l\'appli Caméra native iPhone' },
            { n: '2', txt: 'En haut à gauche, appuyer sur l\'indicateur FPS (ex : 30) pour basculer en 60 ips' },
            { n: '3', txt: 'Le chiffre passe à 60 — c\'est immédiat, sans passer par les Réglages' },
            { n: '4', txt: 'Revenir ici et lancer la capture pour une visite ultra-fluide' },
          ].map(({ n, txt }) => (
            <div key={n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: G.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>{n}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, paddingTop: 3 }}>{txt}</div>
            </div>
          ))}
        </div>
        {/* Ce qu'on va capturer */}
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>
          {VISITE_SPOTS.length} positions à documenter
        </div>
        {VISITE_SPOTS.map((h, i) => (
          <div key={h.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '11px 14px', marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: h.media === 'video' ? 'rgba(220,40,40,0.2)' : 'rgba(76,127,5,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>{h.media === 'video' ? '🎥' : '📸'}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{h.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
                {h.media === 'video' ? 'Vidéo' : 'Photo'} · {h.landscape ? '🔄 Horizontal' : 'Vertical'}
              </div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{i + 1}</span>
            </div>
          </div>
        ))}
        <button onClick={() => setTutoSeen(true)}
          style={{ width: '100%', marginTop: 8, padding: '15px', background: G.primary, border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 6px 20px rgba(76,127,5,0.35)` }}>
          <Ic n="camera" s={17} c="white" /> C'est parti
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0A0A0A', overflow: 'hidden' }}>

      {/* ── Viewfinder ── */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {camOn
          ? <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline muted autoPlay />
          : <div style={{ width: '100%', height: '100%', background: `url(/jd6530-side.png) center/cover`, position: 'absolute', inset: 0 }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />

        {/* Grille tiers */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.25 }}>
          <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="0.7" />
          <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="0.7" />
          <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="0.7" />
          <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="0.7" />
        </svg>

        {/* Croix centre */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line x1="50%" y1="47%" x2="50%" y2="53%" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          <line x1="47%" y1="50%" x2="53%" y2="50%" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        </svg>

        {/* Header overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 12px), 16px)', padding: '0 14px 10px', background: 'linear-gradient(rgba(0,0,0,0.6),transparent)' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: 20, padding: '6px 12px', color: 'rgba(255,255,255,0.85)', cursor: 'pointer' }}>
            <Ic n="chevL" s={14} c="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Quitter</span>
          </button>
          {/* Badge media type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isVideo ? 'rgba(190,30,30,0.75)' : 'rgba(16,68,16,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '5px 10px', border: `1px solid ${isVideo ? 'rgba(255,80,80,0.3)' : 'rgba(107,163,46,0.3)'}` }}>
            {isVideo
              ? <><div className="rec-blink" style={{ width: 5, height: 5, borderRadius: 3, background: '#FF5555' }} /><span style={{ fontSize: 10, fontWeight: 700, color: '#FFBBBB' }}>VIDÉO — 60 FPS</span></>
              : <><span style={{ fontSize: 10 }}>📸</span><span style={{ fontSize: 10, fontWeight: 700, color: G.light }}>PHOTO</span></>}
          </div>
          {/* Orientation hint */}
          {hs.landscape && (
            <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '5px 10px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>🔄 Horizontal</span>
            </div>
          )}
        </div>

        {/* Niveau bulle */}
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(0,0,0,0.5)', border: `2px solid ${stable ? G.primary : 'rgba(255,255,255,0.15)'}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
            <div style={{ position: 'absolute', width: 1, height: '78%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', height: 1, width: '78%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: stable ? G.primary : 'rgba(255,255,255,0.4)', position: 'absolute', transform: `translate(${bx * 0.38}px,${by * 0.38}px)`, transition: 'transform 0.08s', boxShadow: stable ? `0 0 8px ${G.primary}` : 'none' }} />
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, color: stable ? G.light : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{stable ? 'Stable' : 'Stabiliser'}</div>
        </div>

        {/* Barre progression bas */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.7))', padding: '20px 14px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{done} / {VISITE_SPOTS.length} positions</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: G.light }}>{Math.round(done / VISITE_SPOTS.length * 100)}%</span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }}>
            <div style={{ width: `${done / VISITE_SPOTS.length * 100}%`, height: '100%', background: G.primary, borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* ── Panel bas — compact ── */}
      <div style={{ background: '#141414', padding: '10px 14px 12px', flexShrink: 0 }}>
        {/* Info spot actuel */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: G.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: 'white' }}>{current + 1}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{hs.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hs.instruction}</div>
          </div>
          {hs.landscape && (
            <div style={{ fontSize: 18, flexShrink: 0 }}>🔄</div>
          )}
        </div>

        {/* Miniatures spots */}
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', marginBottom: 10 }}>
          {VISITE_SPOTS.map((h, i) => (
            <button key={h.id} onClick={() => setCurrent(i)} style={{
              flexShrink: 0, width: 40, padding: '5px 0', borderRadius: 9,
              background: i === current ? 'rgba(76,127,5,0.28)' : captured[h.id] ? 'rgba(76,127,5,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${i === current ? G.primary : captured[h.id] ? 'rgba(76,127,5,0.4)' : 'transparent'}`,
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{ fontSize: 12 }}>{h.media === 'video' ? '🎥' : '📸'}</span>
              {captured[h.id]
                ? <Ic n="check" s={10} c={G.light} />
                : <div style={{ width: 5, height: 5, borderRadius: 3, background: i === current ? G.primary : 'rgba(255,255,255,0.2)' }} />}
            </button>
          ))}
        </div>

        {/* Bouton capture */}
        {allDone ? (
          <button onClick={() => onNext(captured)} style={{ width: '100%', padding: '14px', background: G.primary, border: 'none', borderRadius: 13, color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 16px rgba(76,127,5,0.3)` }}>
            <Ic n="check" s={16} c="white" /> Générer l'annonce
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={doCapture} disabled={capturing || recording}
              style={{ flex: 1, padding: '14px', borderRadius: 13, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
                background: recording ? '#CC2222' : capturing ? G.muted : isVideo ? '#CC2222' : G.primary,
                boxShadow: recording ? '0 4px 16px rgba(204,34,34,0.4)' : `0 4px 16px rgba(76,127,5,0.25)` }}>
              {recording
                ? <><div className="rec-blink" style={{ width: 8, height: 8, borderRadius: 4, background: 'white' }} />Enregistrement…</>
                : isVideo
                  ? <><span>🎥</span> Filmer</>
                  : <><span>📸</span> Capturer</>}
            </button>
            {done > 0 && !recording && (
              <button onClick={() => onNext(captured)} style={{ padding: '14px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 13, color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Passer →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   ANNONCE (Étape 4 / 4)
══════════════════════════════════ */
function AnnonceScreen({ machineInfo, clientInfo, inspection, visite, onBack, onHome }) {
  const [published, setPublished] = useState(false);
  const m = machineInfo?.model || {};
  const t = machineInfo?.tech  || {};

  const etatVals = Object.values(inspection?.etats || {});
  const scoreMap = { Neuf: 100, 'Très bon': 90, Bon: 75, Moyen: 45, HS: 10 };
  const score    = etatVals.length ? Math.round(etatVals.reduce((a, v) => a + (scoreMap[v] || 60), 0) / etatVals.length) : 85;
  const bCount   = etatVals.filter(v => v === 'Neuf' || v === 'Très bon').length;
  const avCount  = etatVals.filter(v => v === 'Bon'  || v === 'Moyen').length;
  const hsCount  = etatVals.filter(v => v === 'HS').length;

  const pw    = parseInt((t.puissance || m.puissance || '120').toString().replace(/[^\d]/g, '')) || 120;
  const age   = 2026 - parseInt(machineInfo?.year || 2020);
  const drop  = Math.min(0.75, age <= 0 ? 0 : 0.15 + (age - 1) * 0.08);
  const price = Math.round(pw * 650 * (1 - drop) * (score / 100) / 500) * 500;
  const visteCount = Object.keys(visite || {}).length;
  const clientName = clientInfo ? `${clientInfo.firstName} ${clientInfo.lastName}` : '—';

  const features = [
    score >= 80 && { icon: 'check',   txt: 'Rapport d\'inspection AgriCertif complet',                     c: G.primary },
    visteCount > 0 && { icon: 'camera', txt: `Visite virtuelle 360° — ${visteCount} positions documentées`, c: G.primary },
    t.boite     && { icon: 'engine', txt: t.boite.substring(0, 45),                                         c: G.muted   },
    t.relevage  && { icon: 'leaf',   txt: `Relevage : ${t.relevage}`,                                       c: G.muted   },
    t.pompe     && { icon: 'drop',   txt: `Pompe hydraulique : ${t.pompe}`,                                  c: G.muted   },
    t.pneusAR   && { icon: 'wheel',  txt: `Pneus arrière : ${t.pneusAR}`,                                   c: G.muted   },
  ].filter(Boolean);

  if (published) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: G.dark, padding: 32, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: 'rgba(76,127,5,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Ic n="check" s={40} c={G.light} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.4px', marginBottom: 8 }}>Annonce publiée</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>Votre annonce est maintenant visible sur AgriCorner.</div>
      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 28px', marginBottom: 32 }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: G.light }}>{score}<span style={{ fontSize: 16 }}>/100</span></div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Score AgriCertif</div>
      </div>
      <button onClick={onHome} style={{ padding: '14px 36px', background: G.primary, border: 'none', borderRadius: 14, color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
        Retour à l'accueil
      </button>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
      <BackHeader title="Votre annonce" sub="Étape 4 / 4" onBack={onBack} pct={100} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        <div style={{ margin: '14px', background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }}>

          {/* Photo hero */}
          <div style={{ position: 'relative', height: 195 }}>
            <img src="/tractor-jd6530.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,68,16,0.88)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>Score AgriCertif</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{score}<span style={{ fontSize: 13, fontWeight: 600 }}>/100</span></div>
            </div>
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '6px 10px' }}>
              <img src="/logo-agricertif.svg" alt="" style={{ height: 18, display: 'block' }} />
            </div>
            <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>{machineInfo?.brand} {m.modele || machineInfo?.modelQ || '—'}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{machineInfo?.year} · {parseInt(machineInfo?.hours || 0).toLocaleString('fr-FR')} h{t.puissance ? ` · ${t.puissance}` : ''}</div>
            </div>
          </div>

          {/* Client + prix */}
          <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${G.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 33, fontWeight: 900, color: G.dark, letterSpacing: '-1px' }}>{price.toLocaleString('fr-FR')} €</div>
                <div style={{ fontSize: 12, color: G.muted }}>prix estimé</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{clientName}</div>
                {clientInfo?.region && (
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 1, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: clientInfo.region.color, flexShrink: 0 }} />
                    {clientInfo.region.label}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${G.border}` }}>
            {[['—', 'Vues 7j'], ['—', 'Contacts'], ['—', 'Offres']].map(([v, l], i) => (
              <div key={l} style={{ padding: '11px 6px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${G.border}` : 'none' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: G.dark }}>{v}</div>
                <div style={{ fontSize: 10, color: G.muted, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Points forts */}
          {features.length > 0 && (
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Points forts</div>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: f.c === G.muted ? G.bg : '#EBF4E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ic n={f.icon} s={12} c={f.c === G.muted ? G.muted : G.primary} />
                  </div>
                  <div style={{ fontSize: 13, color: '#333', lineHeight: 1.45, paddingTop: 2 }}>{f.txt}</div>
                </div>
              ))}
            </div>
          )}

          {/* Rapport d'inspection */}
          <div style={{ margin: '0 18px 16px', background: G.bg, borderRadius: 12, padding: '13px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Rapport d'inspection</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[{ l: 'Bon / Très bon', v: bCount, c: G.primary, bg: '#EBF4E1' }, { l: 'À surveiller', v: avCount, c: G.gold, bg: '#FDF8ED' }, { l: 'Hors service', v: hsCount, c: G.red, bg: '#FDECEA' }].map(({ l, v, c, bg }) => (
                <div key={l} style={{ background: bg, borderRadius: 9, padding: '9px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: c }}>{v}</div>
                  <div style={{ fontSize: 9, color: c, fontWeight: 700, lineHeight: 1.3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fiche technique */}
          {(t.cylindres || t.couple || t.pneusAV) && (
            <div style={{ margin: '0 18px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Fiche technique</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['Puissance', t.puissance], ['Cylindres', t.cylindres], ['Couple', t.couple], ['Pneus AV', t.pneusAV], ['Pneus AR', t.pneusAR], ['Poids', t.poids]].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l} style={{ background: G.bg, borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: G.muted, fontWeight: 600 }}>{l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.dark, marginTop: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visite 360° */}
          {visteCount > 0 && (
            <div style={{ margin: '0 18px 18px', background: `linear-gradient(135deg,${G.dark} 0%,${G.primary} 100%)`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ic n="camera" s={20} c="white" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '-0.2px' }}>Visite virtuelle 360° incluse</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>{visteCount} positions documentées</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: `1px solid ${G.border}`, padding: '12px 20px 16px', display: 'flex', gap: 10 }}>
        <button style={{ flex: 1, padding: '13px', background: G.bg, border: `1.5px solid ${G.border}`, borderRadius: 13, color: G.dark, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Ic n="edit" s={14} c={G.dark} /> Modifier
        </button>
        <button onClick={() => setPublished(true)} style={{ flex: 2, padding: '13px', background: G.primary, border: 'none', borderRadius: 13, color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 16px rgba(76,127,5,0.28)` }}>
          <Ic n="publish" s={15} c="white" /> Publier sur AgriCorner
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   LISTING PREMIUM — JD 6530
══════════════════════════════════ */
function ListingScreen({ onBack }) {
  const [imgIdx,   setImgIdx]   = useState(0);
  const [showTour, setShowTour] = useState(false);
  const touchX = useRef(null);

  const images = [
    '/jd6530-side.png',
    '/jd6530-front.png',
    '/jd6530-img3.png',
    '/jd6530-img4.png',
    '/jd6530-img5.png',
    '/jd6530-img6.png',
    '/jd6530-img7.png',
  ];

  const prev = () => setImgIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx(i => (i + 1) % images.length);

  const specs = [
    ['Puissance',     '120 ch (+ 20 ch PDF)'],
    ['Moteur',        'PowerTech Plus Tier 3'],
    ['Cylindres',     '6 · 6 788 cm³'],
    ['Couple max',    '504 N.m à 1 700 tr/min'],
    ['Alimentation',  'Turbo géométrie variable'],
    ['Transmission',  'PowrQuad Plus 24/24'],
    ['Direction',     'Hydrostatique. R 5,10 m'],
    ['Pneus AV',      '16.9 R24'],
    ['Pneus AR',      '18.4 R38'],
    ['Relevage',      '6,62 t. Cat. III N'],
    ['Pompe hyd.',    '110 l/min. 200 bar'],
    ['Poids',         '5 080 kg. PTAC 9 500 kg'],
    ['Réservoir',     '250 L. Vidange 500 h'],
    ['Empattement',   '2,65 m. Larg. 2,31 m'],
    ['PTO arrière',   '540 / 540E / 1 000 tr/min'],
    ['Électrique',    'Alternat. 115 A. 154 Ah'],
  ];

  const inspSections = [
    { id: 'moteur', label: 'Moteur & alimentation', icon: 'engine', items: [
      { ok: 'ok',   label: 'Démarrage à froid',         txt: 'Démarrage immédiat sans aide. Montée en T° régulière, aucun plat de courbe.' },
      { ok: 'ok',   label: 'Gaz d\'échappement',         txt: 'Fumées incolores à chaud dans toutes les conditions. Aucune fumée bleue ou noire.' },
      { ok: 'ok',   label: 'Acoustique moteur',          txt: 'Aucun cognement, sifflement ou vibration anormale à froid, à chaud et en charge.' },
      { ok: 'ok',   label: 'Niveau et pression d\'huile',txt: 'Indicateur en zone verte. Huile propre. Vidange effectuée à 6 200 h, soit 332 h avant cette inspection.' },
      { ok: 'ok',   label: 'Climatisation cabine',       txt: 'Refroidissement efficace. Filtre à pollen remplacé lors de cette inspection. Consigne atteinte en 3 min.' },
    ]},
    { id: 'transmission', label: 'Transmission & mobilité', icon: 'wheel', items: [
      { ok: 'ok',   label: 'Boîte PowrQuad Plus',        txt: 'Passages sous charge fluides sur les 4 plages. 24 rapports AV et 24 AR confirmés à tous régimes.' },
      { ok: 'ok',   label: '4 roues motrices',           txt: 'Engagement et désengagement 4RM instantanés sans choc. Différentiel de pont avant sans jeu.' },
      { ok: 'ok',   label: 'Embrayage',                  txt: 'Course nominale, patinage nul à pleine charge. Longévité assurée.', metric: '<35 %', metricLabel: 'Usure estimée', metricOk: true },
      { ok: 'ok',   label: 'Inverseur PowerReverser',    txt: 'Réponse immédiate en manœuvre. Aucun à-coup ni choc à l\'inversion, en charge ou hors charge.' },
    ]},
    { id: 'hydraulique', label: 'Hydraulique & attelage', icon: 'drop', items: [
      { ok: 'ok',   label: 'Circuit haute pression',     txt: 'Aucune fuite sur flexibles et raccords. Pression 200 bar confirmée.' },
      { ok: 'ok',   label: 'Distributeurs électrohyd.',  txt: '4 distributeurs opérationnels. Débit 110 l/min vérifié. Commandes ergonomiques fonctionnelles.' },
      { ok: 'warn', label: 'Relevage arrière',           txt: 'Opérationnel au quotidien. Valve de régulation à contrôler.', metric: '95 %', metricLabel: 'Course atteinte', metricOk: false },
      { ok: 'ok',   label: 'Attelage 3 points Cat. III', txt: 'Crochets de stabilisation sans jeu. Capacité 6,62 t confirmée en charge statique.' },
    ]},
    { id: 'cabine', label: 'Cabine & électronique', icon: 'seat', items: [
      { ok: 'ok',   label: 'Instrumentation et compteur',txt: 'Tableau de bord sans défaut actif. Compteur certifié lors de l\'inspection.', metric: '6 532 h', metricLabel: 'Certifié', metricOk: true },
      { ok: 'ok',   label: 'Éclairage intégral',         txt: 'Tous feux AV/AR, rampe de travail et gyrophare opérationnels. LED de travail intactes.' },
      { ok: 'ok',   label: 'Pré-câblage GPS et ISOBUS',  txt: 'Connecteur ISO 11783 opérationnel. Compatible StarFire 3000, 6000 et terminaux ISOBUS.' },
      { ok: 'warn', label: 'Autoradio',                  txt: 'Module radio hors service. Accessoire non essentiel à l\'exploitation. Remplacement estimé à moins de 150 €.' },
    ]},
    { id: 'chassis', label: 'Châssis & carrosserie', icon: 'paint', items: [
      { ok: 'ok',   label: 'Châssis et longerons',       txt: 'Aucune fissure, déformation ni soudure de réparation. Intégrité structurelle confirmée.' },
      { ok: 'ok',   label: 'Capot et carénages',         txt: 'Plastiques sans fissure majeure. Cohérence des teintes conservée.', metric: '85 %', metricLabel: 'Peinture origine', metricOk: true },
      { ok: 'ok',   label: 'Corrosion',                  txt: 'Quelques points de surface sur tablier moteur uniquement. Aucune rouille structurelle détectée.' },
    ]},
    { id: 'freinage', label: 'Freinage & prise de force', icon: 'bench', items: [
      { ok: 'ok',   label: 'Frein de service',           txt: 'Freinage équilibré AV/AR. Distance d\'arrêt conforme norme R76. Pression de circuit stable.' },
      { ok: 'ok',   label: 'Frein de stationnement',     txt: 'Maintien en pente 30 % confirmé. Câble et mécanisme en bon état, sans jeu excessif.' },
      { ok: 'ok',   label: 'PTO 540 / 540E / 1 000',    txt: 'Les 3 régimes opérationnels et bien distincts. Arbre et accouplement sans usure détectée.' },
    ]},
    { id: 'pneus', label: 'Pneumatiques & jantes', icon: 'wheel', items: [
      { ok: 'ok', label: 'Pneus AV · 16.9 R24', txt: 'Aucune bosse, coupure ni décollement. Pression 2,2 bar conforme constructeur. Jantes sans voile.', metric: '65 %', metricLabel: 'Usure', metricOk: true, wear: 65 },
      { ok: 'ok', label: 'Pneus AR · 18.4 R38', txt: 'Profil chevron 8 mm. Jantes sans voile ni impact. Pression 1,8 bar conforme constructeur.', metric: '70 %', metricLabel: 'Usure', metricOk: true, wear: 70 },
    ]},
  ];
  const totalItems = inspSections.reduce((a, s) => a + s.items.length, 0);
  const warnItems  = inspSections.reduce((a, s) => a + s.items.filter(it => it.ok === 'warn').length, 0);
  const okItems    = totalItems - warnItems;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>

      {/* ── GALERIE HERO ── */}
      <div style={{ position: 'relative', height: 300, flexShrink: 0, background: '#111',
                    userSelect: 'none' }}
           onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
           onTouchEnd={e => {
             const dx = e.changedTouches[0].clientX - (touchX.current || 0);
             if (dx > 40) prev(); else if (dx < -40) next();
             touchX.current = null;
           }}>
        <img src={images[imgIdx]} alt=""
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.1) 45%,transparent 100%)' }} />

        {/* Back */}
        <button onClick={onBack} style={{ position: 'absolute', top: 'max(calc(env(safe-area-inset-top, 0px) + 14px), 16px)', left: 14,
          width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.48)',
          backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ic n="chevL" s={18} c="white" />
        </button>

        {/* Score badge — glassmorphism, légèrement plus haut */}
        <div style={{ position: 'absolute', top: 'max(calc(env(safe-area-inset-top, 0px) + 10px), 14px)', right: 14,
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
          borderRadius: 14, padding: '7px 13px',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 1.2 }}>Score</div>
          <div style={{ fontSize: 25, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', lineHeight: 1 }}>
            87<span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>/100</span>
          </div>
        </div>

        {/* Arrows */}
        {imgIdx > 0 && (
          <button onClick={prev} style={{ position: 'absolute', top: '50%', left: 12,
            transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 15,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="chevL" s={16} c="white" />
          </button>
        )}
        {imgIdx < images.length - 1 && (
          <button onClick={next} style={{ position: 'absolute', top: '50%', right: 12,
            transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 15,
            background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ic n="chevR" s={16} c="white" />
          </button>
        )}

        {/* Bloc bas : dots + titre + marketing */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 14px' }}>

          {/* Dots + compteur */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 5, marginBottom: 10, position: 'relative' }}>
            {images.map((_, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{
                width: i === imgIdx ? 20 : 5, height: 5, borderRadius: 3,
                background: i === imgIdx ? 'white' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', transition: 'width 0.3s ease',
              }} />
            ))}
            <div style={{ position: 'absolute', right: 0, fontSize: 10, fontWeight: 700,
                          color: 'rgba(255,255,255,0.6)',
                          background: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: '2px 7px' }}>
              {imgIdx + 1} / {images.length}
            </div>
          </div>

          {/* Titre */}
          <div style={{ fontSize: 22, fontWeight: 900, color: 'white',
                        letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 6 }}>
            John Deere 6530 Premium
          </div>

          {/* Tags specs compactes */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {['2008', '6 532 h', '4RM', 'PowrQuad Plus'].map(tag => (
              <div key={tag} style={{ padding: '2px 8px',
                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)',
                borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)',
                fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{tag}</div>
            ))}
          </div>

          {/* Accroche marketing */}
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5,
                        fontStyle: 'italic', letterSpacing: '0.1px' }}>
            Moteur certifié sain · Transmission irréprochable · Prêt à travailler
          </div>
        </div>
      </div>

      {/* ── SCROLL BODY ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>

        {/* Prix + réf */}
        <div style={{ background: 'white', padding: '14px 18px 12px',
                      borderBottom: `1px solid ${G.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, color: G.dark, letterSpacing: '-1px' }}>
                49 000 €
              </div>
              <div style={{ fontSize: 11, color: G.muted, marginTop: 1 }}>
                Réf. AgriAffaires #46642660 · Inspecté le 18/02/2026
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ padding: '5px 12px', background: '#EBF4E1', borderRadius: 20,
                            fontSize: 11, fontWeight: 800, color: G.primary }}>
                ✓ Rapport complet
              </div>
            </div>
          </div>
        </div>

        {/* ── VISITE 360° ── */}
        {!showTour ? (
          <div style={{ margin: '14px 14px 0',
                        background: `linear-gradient(135deg,${G.dark} 0%,#2A6B2A 100%)`,
                        borderRadius: 16, overflow: 'hidden', position: 'relative',
                        boxShadow: '0 6px 24px rgba(16,68,16,0.25)' }}>
            <img src="/jd6530-side.png" alt=""
                 style={{ width: '100%', height: 110, objectFit: 'cover', opacity: 0.25, display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex',
                          alignItems: 'center', gap: 16, padding: '0 20px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16,
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5"/>
                  <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'white', letterSpacing: '-0.2px' }}>
                  Visite virtuelle 360°
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                  Explorez chaque détail du tracteur
                </div>
              </div>
              <button onClick={() => setShowTour(true)}
                      style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.18)',
                               border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 12,
                               color: 'white', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                               backdropFilter: 'blur(6px)', flexShrink: 0 }}>
                Lancer →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ margin: '14px 14px 0', borderRadius: 16, overflow: 'hidden',
                        position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }}>
            <button onClick={() => setShowTour(false)}
                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 10,
                             width: 30, height: 30, borderRadius: 15,
                             background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                             border: 'none', cursor: 'pointer', color: 'white', fontSize: 14,
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             fontWeight: 700 }}>×</button>
            <iframe
              src="https://pacome-hazouard.github.io/6530p-agritour-360-agricorner/"
              style={{ width: '100%', height: 240, border: 'none', display: 'block' }}
              allow="fullscreen; xr-spatial-tracking"
              title="Visite 360° John Deere 6530 Premium"
            />
          </div>
        )}

        {/* ── RAPPORT D'INSPECTION ── */}
        <div style={{ margin: '14px 14px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G.muted,
                        textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>
            Rapport d'inspection
          </div>

          {/* Synthèse score */}
          <div style={{ background: 'white', borderRadius: 16, padding: '16px',
                        marginBottom: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                        display: 'flex', gap: 14, alignItems: 'center' }}>
            {/* Cercle score */}
            <div style={{ flexShrink: 0, width: 68, height: 68, borderRadius: 34,
                          background: 'conic-gradient(#4C7F05 0% 87%, #E8EEE0 87% 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 26, background: 'white',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: G.dark, lineHeight: 1 }}>87</div>
                <div style={{ fontSize: 8, color: G.muted, fontWeight: 600, letterSpacing: 0.5 }}>/100</div>
              </div>
            </div>
            {/* Stats */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div style={{ background: '#EBF4E1', borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: G.primary }}>{okItems}</div>
                <div style={{ fontSize: 9, color: G.primary, fontWeight: 700, lineHeight: 1.2 }}>Conformes</div>
              </div>
              <div style={{ background: '#FDF4EC', borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: G.orange }}>{warnItems}</div>
                <div style={{ fontSize: 9, color: G.orange, fontWeight: 700, lineHeight: 1.2 }}>À surveiller</div>
              </div>
              <div style={{ background: G.bg, borderRadius: 10, padding: '8px 10px', gridColumn: '1 / -1',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 10, color: G.muted, fontWeight: 600 }}>{totalItems} points contrôlés</div>
                <div style={{ fontSize: 10, color: G.primary, fontWeight: 700 }}>0 hors service</div>
              </div>
            </div>
          </div>

          {/* Sections détaillées */}
          {inspSections.map(sec => (
            <div key={sec.id} style={{ marginBottom: 10 }}>
              {/* En-tête section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, paddingLeft: 2 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: '#EBF4E1',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ic n={sec.icon} s={13} c={G.primary} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: G.dark, letterSpacing: '-0.1px' }}>{sec.label}</div>
                <div style={{ marginLeft: 'auto', fontSize: 10, color: G.muted, fontWeight: 600 }}>
                  {sec.items.filter(it => it.ok === 'ok').length}/{sec.items.length}
                </div>
              </div>
              {/* Items */}
              <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden',
                            boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                {sec.items.map((it, i) => (
                  <div key={it.label} style={{
                    padding: '12px 14px',
                    borderBottom: i < sec.items.length - 1 ? `1px solid ${G.border}` : 'none',
                  }}>
                    {/* Ligne principale */}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 9, flexShrink: 0, marginTop: 1,
                        background: it.ok === 'ok' ? '#EBF4E1' : '#FDF4EC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {it.ok === 'ok'
                          ? <Ic n="check" s={13} c={G.primary} />
                          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M12 8v5M12 16h.01" stroke={G.orange} strokeWidth="2.2" strokeLinecap="round"/>
                              <path d="M10.3 3.3L2.7 17A2 2 0 004.4 20h15.2a2 2 0 001.7-3L13.7 3.3a2 2 0 00-3.4 0z" stroke={G.orange} strokeWidth="1.7" fill="none"/>
                            </svg>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{it.label}</div>
                          {/* Badge métrique */}
                          {it.metric && (
                            <div style={{ flexShrink: 0, textAlign: 'right' }}>
                              <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1,
                                color: it.metricOk !== false ? G.primary : G.orange }}>
                                {it.metric}
                              </div>
                              <div style={{ fontSize: 8, fontWeight: 600, color: G.muted, marginTop: 1 }}>
                                {it.metricLabel}
                              </div>
                            </div>
                          )}
                          {it.ok === 'warn' && !it.metric && (
                            <div style={{ padding: '2px 8px', borderRadius: 20, background: '#FDF4EC',
                                          fontSize: 9, fontWeight: 700, color: G.orange, flexShrink: 0 }}>
                              Vigilance
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 10.5, color: G.muted, lineHeight: 1.5, marginTop: 3 }}>{it.txt}</div>
                        {/* Barre d'usure pour pneus */}
                        {it.wear !== undefined && (
                          <div style={{ marginTop: 7 }}>
                            <div style={{ height: 5, borderRadius: 3, background: '#E8F0DE', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${it.wear}%`, borderRadius: 3,
                                background: it.wear <= 30 ? G.red : it.wear <= 60 ? G.orange : G.primary,
                                transition: 'width 0.4s ease' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                              <div style={{ fontSize: 9, color: G.muted, fontWeight: 600 }}>Neuf</div>
                              <div style={{ fontSize: 9, color: it.wear <= 30 ? G.red : it.wear <= 60 ? G.orange : G.primary, fontWeight: 700 }}>
                                {it.wear} % usé
                              </div>
                              <div style={{ fontSize: 9, color: G.muted, fontWeight: 600 }}>HS</div>
                            </div>
                          </div>
                        )}
                        {/* Badge vigilance à côté de la barre si warn+metric */}
                        {it.ok === 'warn' && it.metric && (
                          <div style={{ marginTop: 5, display: 'inline-flex', padding: '2px 8px',
                            borderRadius: 20, background: '#FDF4EC', fontSize: 9, fontWeight: 700, color: G.orange }}>
                            Point de vigilance
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Commentaire expert */}
          <div style={{ background: `linear-gradient(135deg,${G.dark} 0%,#1A6030 100%)`,
                        borderRadius: 14, padding: '14px 16px', marginBottom: 10,
                        boxShadow: '0 4px 16px rgba(16,68,16,0.18)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
                          textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              Commentaire de l'inspecteur
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Tracteur polyvalent en très bon état général pour son âge et ses heures.
              Le moteur PowerTech Plus est particulièrement sain. Démarrage vif, silence mécanique excellent.
              La boîte PowrQuad et les organes de transmission ne présentent aucune usure préoccupante.
              Le relevage arrière est le seul point de vigilance. Il reste pleinement opérationnel au quotidien.
              Je recommande ce tracteur sans réserve pour une utilisation grandes cultures ou polyculture-élevage."
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/pacome.jpg" alt="" style={{ width: 28, height: 28, borderRadius: 9,
                objectFit: 'cover', border: '1.5px solid rgba(107,163,46,0.5)' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>Pacôme HAZOUARD</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)' }}>18 février 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FICHE TECHNIQUE ── */}
        <div style={{ margin: '14px 14px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: G.muted,
                        textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 10 }}>
            Fiche technique
          </div>
          <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden',
                        boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {specs.map(([l, v], i) => (
              <div key={l} style={{
                padding: '10px 16px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 12,
                borderBottom: i < specs.length - 1 ? `1px solid ${G.border}` : 'none',
              }}>
                <div style={{ fontSize: 11, color: G.muted, fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: G.dark, textAlign: 'right' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── INSPECTOR CARD ── */}
        <div style={{ margin: '14px 14px 0',
                      background: `linear-gradient(135deg,${G.dark} 0%,#1A5C1A 100%)`,
                      borderRadius: 16, padding: '16px', boxShadow: '0 4px 20px rgba(16,68,16,0.22)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
                        textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 12 }}>
            Votre inspecteur
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <img src="/pacome.jpg" alt="Pacôme HAZOUARD"
                 style={{ width: 58, height: 58, borderRadius: 16, objectFit: 'cover',
                           border: '2px solid rgba(107,163,46,0.5)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.2px' }}>
                Pacôme HAZOUARD
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                Commercial chez AgriCorner
              </div>
              <div style={{ fontSize: 11, color: G.light, marginTop: 3, fontWeight: 600 }}>
                Aube (10)
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { icon: 'phone', label: '07 62 10 41 8' },
              { icon: 'mail',  label: 'pacome.hazouard@agricorner.com' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 12px',
                display: 'flex', gap: 8, alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Ic n={icon} s={14} c={G.light} />
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 600,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avertissement */}
        <div style={{ margin: '12px 14px 0', padding: '11px 14px',
                      background: 'white', borderRadius: 12, border: `1px solid ${G.border}` }}>
          <div style={{ fontSize: 10, color: G.muted, lineHeight: 1.55 }}>
            Ce rapport reflète l'état du véhicule à la date d'inspection (18/02/2026). Il ne constitue pas une garantie ni un engagement contractuel. L'inspecteur décline toute responsabilité pour des évolutions postérieures à cette date.
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════
   ACCUEIL
══════════════════════════════════ */
function HomeScreen({ onNewInspection, onOpenListing }) {
  const [tab, setTab] = useState('home');
  const recents = [
    { m: 'John Deere 6530 Premium', ann: '2008', h: '6 532 h', s: 'Publié', score: 87, listing: true },
  ];
  const parc = [
    { m: 'John Deere 6530 Premium', ann: 2008, h: '6 532 h', cert: true },
  ];
  const scoreColor = s => s >= 80 ? G.primary : s >= 60 ? G.gold : G.red;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
      <div style={{ background: G.dark, paddingTop: 'max(calc(env(safe-area-inset-top, 0px) + 18px), 24px)', padding: '0 20px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 2 }}>Bonjour,</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>Pacôme HAZOUARD</div>
          </div>
          <img src="/logo-agricertif.svg" alt="AgriCertif" style={{ height: 26, filter: 'brightness(0) invert(1)', opacity: 0.65 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[['1', 'Inspections'], ['1', 'Inspectés'], ['0', 'En cours']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 68 }}>
        {tab === 'home' && (
          <div style={{ padding: '18px 20px' }}>
            <button onClick={onNewInspection} style={{ width: '100%', padding: '16px 20px', background: G.primary, border: 'none', borderRadius: 16, color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 6px 24px rgba(76,127,5,0.32)`, marginBottom: 22 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ic n="plus" s={16} c="white" />
              </div>
              Nouvelle inspection
            </button>
            <div style={{ fontSize: 11, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 12 }}>Récents</div>
            {recents.map(r => (
              <div key={r.m} onClick={() => r.listing && onOpenListing()} style={{ background: 'white', borderRadius: 14, padding: '13px 15px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: r.listing ? 'pointer' : 'default' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src="/jd6530-side.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.m}</div>
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 1 }}>{r.ann} · {r.h}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: scoreColor(r.score) }}>{r.score}<span style={{ fontSize: 10 }}>/100</span></div>
                  <div style={{ fontSize: 10, color: r.s === 'Publié' ? G.primary : G.gold, fontWeight: 600 }}>{r.s}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'parc' && (
          <div style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', marginBottom: 16 }}>Mon parc</div>
            {parc.map(p => (
              <div key={p.m} onClick={() => onOpenListing()} style={{ background: 'white', borderRadius: 14, padding: '14px 15px', marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, overflow: 'hidden', flexShrink: 0 }}>
                    <img src="/jd6530-side.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{p.m}</div>
                    <div style={{ fontSize: 12, color: G.muted }}>{p.ann} · {p.h}</div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 20, background: p.cert ? '#EBF4E1' : '#FDF8ED', color: p.cert ? G.primary : G.gold, fontSize: 11, fontWeight: 700 }}>
                    {p.cert ? 'Inspecté' : 'En cours'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'profil' && (
          <div style={{ padding: '18px 20px' }}>
            {/* Hero profil */}
            <div style={{ background: `linear-gradient(135deg,${G.dark} 0%,#1A5C1A 100%)`,
                          borderRadius: 18, padding: '20px 18px 18px', marginBottom: 16,
                          boxShadow: '0 6px 24px rgba(16,68,16,0.22)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                <img src="/pacome.jpg" alt="Pacôme HAZOUARD"
                     style={{ width: 64, height: 64, borderRadius: 18, objectFit: 'cover',
                               border: '2.5px solid rgba(107,163,46,0.5)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
                    Pacôme HAZOUARD
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    Commercial chez AgriCorner
                  </div>
                  <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
                                background: 'rgba(107,163,46,0.25)', borderRadius: 20, padding: '3px 10px',
                                border: '1px solid rgba(107,163,46,0.3)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: G.light }} />
                    <span style={{ fontSize: 10, color: G.light, fontWeight: 700 }}>Inspecteur agréé</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { icon: 'pin',   v: 'Aube (10)' },
                  { icon: 'phone', v: '07 62 10 41 8' },
                ].map(({ icon, v }) => (
                  <div key={v} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10,
                                        padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center',
                                        border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Ic n={icon} s={13} c={G.light} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {[
              ['Société',     'AgriCorner'],
              ['Département', 'Aube (10)'],
              ['Téléphone',   '07 62 10 41 8'],
              ['Email',       'pacome.hazouard@agricorner.com'],
            ].map(([l, v]) => (
              <div key={l} style={{ background: 'white', borderRadius: 13, padding: '13px 16px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: G.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</div>
                </div>
                <Ic n="chevR" s={16} c={G.border} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: 'white', borderTop: `1px solid ${G.border}`, display: 'flex', alignItems: 'center', paddingBottom: 6 }}>
        {[
          { id: 'home',   label: 'Accueil',   icon: 'home' },
          { id: 'new',    label: 'Inspecter', icon: 'plus', special: true },
          { id: 'parc',   label: 'Mon parc',  icon: 'truck' },
          { id: 'profil', label: 'Profil',    icon: 'user' },
        ].map(t => (
          <button key={t.id} onClick={() => t.special ? onNewInspection() : setTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>
            {t.special ? (
              <div style={{ width: 44, height: 44, borderRadius: 22, background: G.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -20, boxShadow: `0 4px 14px rgba(76,127,5,0.4)` }}>
                <Ic n="plus" s={20} c="white" />
              </div>
            ) : (
              <>
                <Ic n={t.icon} s={20} c={tab === t.id ? G.primary : '#C0C0C0'} />
                <span style={{ fontSize: 10, fontWeight: 600, color: tab === t.id ? G.primary : '#C0C0C0' }}>{t.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Scale hook ── */

/* ══════════════════════════════════
   APP ROOT
══════════════════════════════════ */
export default function App() {
  const [screen,     setScreen]     = useState('home');
  const [dbs,        setDbs]        = useState({ tracteur: {}, moissonneuse: {}, telescopique: {} });
  const [clientInfo, setClientInfo] = useState(null);
  const [mInfo,      setMInfo]      = useState(null);
  const [inspData,   setInspData]   = useState(null);
  const [visData,    setVisData]    = useState(null);
  const [prevScreen, setPrevScreen] = useState('home');
  const goListing = () => { setPrevScreen(screen); setScreen('listing'); };

  useEffect(() => {
    fetch('/tracteurs-db.json').then(r=>r.json()).then(d=>setDbs(p=>({...p,tracteur:d}))).catch(()=>{});
    fetch('/moissonneuses-db.json').then(r=>r.json()).then(d=>setDbs(p=>({...p,moissonneuse:d}))).catch(()=>{});
    fetch('/telescopiques-db.json').then(r=>r.json()).then(d=>setDbs(p=>({...p,telescopique:d}))).catch(()=>{});
  }, []);

  const go = s => setScreen(s);

  return (
    <div className="screen-enter" key={screen} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative' }}>
      {screen === 'listing'    && <ListingScreen    onBack={() => setScreen(prevScreen)} />}
      {screen === 'home'       && <HomeScreen       onNewInspection={() => go('client')} onOpenListing={goListing} />}
      {screen === 'client'     && <ClientScreen     onBack={() => go('home')}       onNext={d => { setClientInfo(d); go('id'); }} />}
      {screen === 'id'         && <IdScreen         dbs={dbs}                        onBack={() => go('client')} onNext={d => { setMInfo(d); go('inspection'); }} />}
      {screen === 'inspection' && <InspectionScreen machineInfo={mInfo}              onBack={() => go('id')}     onNext={d => { setInspData(d); go('visite'); }} />}
      {screen === 'visite'     && <VisiteScreen     machineInfo={mInfo}              onBack={() => go('inspection')} onNext={d => { setVisData(d); go('annonce'); }} />}
      {screen === 'annonce'    && <AnnonceScreen    machineInfo={mInfo} clientInfo={clientInfo} inspection={inspData} visite={visData} onBack={() => go('visite')} onHome={() => go('home')} />}
    </div>
  );
}
