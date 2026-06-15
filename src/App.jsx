import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// IOSDevice frame removed — full-screen native app
import { EQUIPMENT_CATEGORIES, detectRegion } from './data/equipmentData';
import { getInspectionSections } from './data/inspectionData';

/* ── BASE URL (GitHub Pages /agricertif-app/ en prod, / en dev) ── */
const BASE = import.meta.env.BASE_URL;

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
    tractor: <>
      {/* Grande roue AR + moyeu */}
      <circle cx="6" cy="17.5" r="5.5" stroke={c} strokeWidth="2" fill="none"/>
      <circle cx="6" cy="17.5" r="2"   stroke={c} strokeWidth="2" fill="none"/>
      {/* Corps : cabine (dos + toit + pare-brise) + capot + pilier avant — path unique sans doublon */}
      <path d="M9 17 L9 4 L16 4 L16 11 L21 11 L21 17"
            stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Châssis bas entre les deux roues */}
      <line x1="11.5" y1="17" x2="18.5" y2="17" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      {/* Vitre cabine — rectangle intérieur, décalé des bords */}
      <rect x="10" y="5" width="3.8" height="3.8" rx="0.5"
            stroke={c} strokeWidth="1.4" fill="none"/>
      {/* Tuyau d'échappement : sort du capot et crochète vers la droite */}
      <path d="M17 11 L17 6 Q17 4.5 19 4.5"
            stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Petite roue AV + moyeu */}
      <circle cx="19.5" cy="19.5" r="2.5" stroke={c} strokeWidth="2" fill="none"/>
      <circle cx="19.5" cy="19.5" r="1"   stroke={c} strokeWidth="2" fill="none"/>
    </>,
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
    tag:     <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke={c} strokeWidth="1.7" fill="none" strokeLinejoin="round"/><circle cx="7" cy="7" r="1.5" fill={c}/></>,
    search:  <><circle cx="11" cy="11" r="8" stroke={c} strokeWidth="1.8" fill="none"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    building:<><rect x="3" y="3" width="18" height="18" rx="1.5" stroke={c} strokeWidth="1.7" fill="none"/><path d="M9 21V12h6v9" stroke={c} strokeWidth="1.5" fill="none"/><rect x="7" y="5" width="3" height="3" stroke={c} strokeWidth="1.3" fill="none"/><rect x="14" y="5" width="3" height="3" stroke={c} strokeWidth="1.3" fill="none"/></>,
    chart:   <><line x1="18" y1="20" x2="18" y2="10" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke={c} strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="20" x2="22" y2="20" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></>,
    id:      <><rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="1.7" fill="none"/><circle cx="8" cy="12" r="2.5" stroke={c} strokeWidth="1.4" fill="none"/><path d="M13 9h5M13 12h5M13 15h3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></>,
    map:     <><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" stroke={c} strokeWidth="1.6" fill="none" strokeLinejoin="round"/><line x1="8" y1="2" x2="8" y2="18" stroke={c} strokeWidth="1.4" strokeLinecap="round"/><line x1="16" y1="6" x2="16" y2="22" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></>,
    euro:    <><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" fill="none"/><path d="M15 8.5a4 4 0 100 7M8 11h7M8 13h7" stroke={c} strokeWidth="1.6" strokeLinecap="round" fill="none"/></>,
    trending:<><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 23,6 23,12" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
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
            <img src={`${BASE}tractor-jd6530.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.1) 55%,transparent 100%)' }} />
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,68,16,0.88)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase' }}>Score AgriCertif</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>{score}<span style={{ fontSize: 13, fontWeight: 600 }}>/100</span></div>
            </div>
            <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 10, padding: '6px 10px' }}>
              <img src={`${BASE}logo-agricertif.svg`} alt="" style={{ height: 18, display: 'block' }} />
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
                <div style={{ fontSize: 12, color: G.muted }}>prix recommandé</div>
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

          {/* ── AIDE TARIFICATION — INTERNE COMMERCIAL ── */}
          <div style={{ margin: '0', borderBottom: `1px solid ${G.border}`,
                        background: 'linear-gradient(135deg,#F0F7E8 0%,#FEF9F0 100%)' }}>
            <div style={{ padding: '12px 18px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: G.gold }} />
              <div style={{ fontSize: 9, fontWeight: 800, color: G.gold, textTransform: 'uppercase', letterSpacing: 1.6 }}>
                Aide à la tarification — usage interne
              </div>
            </div>
            <div style={{ padding: '10px 18px 14px' }}>
              {/* Fourchette */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div style={{ background: '#FBF0E7', borderRadius: 12, padding: '10px 12px', border: '1px solid #F5D9B8' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: G.orange, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>↓ Tranche basse</div>
                  <div style={{ fontSize: 19, fontWeight: 900, color: '#8B4A0A' }}>{Math.round(price * 0.82 / 500) * 500 < price ? (Math.round(price * 0.82 / 500) * 500).toLocaleString('fr-FR') : (price - 5000).toLocaleString('fr-FR')} €</div>
                  <div style={{ fontSize: 9, color: G.muted, marginTop: 2 }}>Score ≤ 65 · état moyen</div>
                </div>
                <div style={{ background: '#EBF4E1', borderRadius: 12, padding: '10px 12px', border: '1px solid #C8E6A0' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: G.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>↑ Tranche haute</div>
                  <div style={{ fontSize: 19, fontWeight: 900, color: G.dark }}>{Math.round(price * 1.08 / 500) * 500 > price ? (Math.round(price * 1.08 / 500) * 500).toLocaleString('fr-FR') : (price + 4000).toLocaleString('fr-FR')} €</div>
                  <div style={{ fontSize: 9, color: G.muted, marginTop: 2 }}>Score ≥ 85 · état excellent</div>
                </div>
              </div>
              {/* Curseur */}
              <div style={{ height: 6, background: '#E5E7EB', borderRadius: 99, position: 'relative', marginBottom: 6 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,#FBF0E7,#EBF4E1)', borderRadius: 99 }} />
                <div style={{ position: 'absolute', left: `${Math.min(90, Math.max(10, (score - 55) / 45 * 100))}%`,
                              top: -4, width: 14, height: 14, borderRadius: 7,
                              background: G.dark, border: '2.5px solid white',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)', transform: 'translateX(-50%)' }} />
              </div>
              <div style={{ fontSize: 10, color: G.muted, textAlign: 'center', marginBottom: 8 }}>
                Score {score}/100 → prix recommandé <strong style={{ color: G.dark }}>{price.toLocaleString('fr-FR')} €</strong>
              </div>
              {/* Conseil */}
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '8px 12px',
                            border: `1px solid ${G.border}`, fontSize: 10, color: G.muted, lineHeight: 1.55 }}>
                💡 {score >= 80
                  ? `Matériel en excellent état (${score}/100). Vous pouvez vous positionner en tranche haute sans perdre en attractivité.`
                  : score >= 65
                  ? `Bon état général (${score}/100). Prix de milieu de fourchette recommandé pour une vente rapide.`
                  : `État correct mais à surveiller (${score}/100). Tranche basse conseillée pour maximiser les contacts.`
                }
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
   DONNÉES DÉMO
══════════════════════════════════ */
const COMPANIES = [
  {
    id: 'scea-grande-rue',
    nom: 'SCEA LA GRANDE RUE',
    siret: '42097881900027',
    adresse: '9 ROUTE DE PRUNAY',
    cp: '10350',
    ville: 'ST FLAVY',
    activite: '0111Z — Culture céréales, légumineuses, oléagineux',
    catJuridique: 'Société civile d\'exploitation agricole',
    salaries: '0 salarié',
    contacts: 0,
    plaques: ['DS134ST', 'GZ969SL', 'FM459QP'],
  },
  {
    id: 'earl-plateau',
    nom: 'EARL DU PLATEAU',
    siret: '38450120100024',
    adresse: '14 RUE DES CHAMPS',
    cp: '10160',
    ville: 'LUSIGNY-SUR-BARSE',
    activite: '0111Z — Culture céréales',
    catJuridique: 'Exploitation agricole à responsabilité limitée',
    salaries: '2 salariés',
    contacts: 1,
    plaques: ['AB123CD', 'EF456GH', 'IJ789KL', 'MN012OP', 'QR345ST'],
  },
  {
    id: 'gaec-3-chenes',
    nom: 'GAEC DES 3 CHÊNES',
    siret: '51234567800012',
    adresse: '7 CHEMIN DU MOULIN',
    cp: '10000',
    ville: 'TROYES',
    activite: '0111Z — Culture céréales',
    catJuridique: 'Groupement agricole d\'exploitation en commun',
    salaries: '3 salariés',
    contacts: 2,
    plaques: ['UV678WX', 'YZ901AB', 'CD234EF', 'GH567IJ', 'KL890MN', 'OP123QR', 'ST456UV', 'WX789YZ'],
  },
];

const VEHICLES = {
  'DS134ST': {
    plaque: 'DS134ST', marque: 'JOHN DEERE', modele: '6150R',
    categorie: 'tracteur', dateCG: '18/06/2025', dateMEC: '25/06/2015',
    poidsKg: 11300, no: 'O', financement: 'ACH', vin: '1L06150RVFP828135',
    societeId: 'scea-grande-rue', couleur: 'Vert / Noir',
    specs: {
      moteur: [
        ['Puissance nominale', '150 ch / 110 kW'],
        ['Puissance (Surpuissance Active)', '170 ch / 125 kW'],
        ['Couple max', '702 Nm à 1 600 tr/min'],
        ['Cylindres / Cylindrée', '6 cyl. / 6,8 L'],
        ['Type moteur', 'PowerTech PVX 4V-CR'],
        ['Post-traitement', 'DOC + DPF (sans additif urée)'],
      ],
      transmission: [
        ['Transmissions dispo.', 'PowrQuad Plus / AutoPowr / DirectDrive'],
        ['Rapports std', '20 AV / 20 AR'],
        ['Plage de vitesse', '2,5 – 40 km/h'],
        ['Suspension pont AV', 'TLS triple bras (100 mm)'],
      ],
      hydraulique: [
        ['Débit nominal', '114 l/min (option 155 l/min)'],
        ['Distributeurs max', '4 + 3'],
        ['Attelage AR catégorie', 'Cat. III'],
        ['Capacité levage AR', '8 100 kg'],
      ],
      dimensions: [
        ['Longueur de transport', '4,93 m'],
        ['Largeur de transport', '2,49 m'],
        ['Hauteur de transport', '2,95 m'],
        ['Poids technique', '6 195 kg'],
        ['Poids CG (avec chargeur)', '11 300 kg'],
        ['Vitesse max', '40 km/h'],
        ['Pneus AR', '520/85R38'],
        ['Pneus AV', '480/70R28'],
      ],
      equipements: [
        ['Cabine ComfortView', '✓'], ['Climatisation', '✓'],
        ['ISOBUS', '✓'], ['Hydraulique avant', '✗'],
        ['Prise de force avant', '✗'], ['Freinage pneumatique', '✗'],
      ],
    },
    marche: {
      prixCatalogue: 102997, heuresMoyennes: 600,
      valeursLectura: [
        { annee: 2014, achat: 43500, vente: 47900 },
        { annee: 2013, achat: 41900, vente: 46100 },
        { annee: 2012, achat: 40300, vente: 44300 },
      ],
      transactionsConcess: [
        { annee: 2020, hm: 4200, prixNeuf: 98000, prixAnnonce: 52000, prixVendu: 49500 },
        { annee: 2019, hm: 5800, prixNeuf: 95000, prixAnnonce: 45000, prixVendu: 42000 },
        { annee: 2018, hm: 7200, prixNeuf: 92000, prixAnnonce: 39000, prixVendu: 37500 },
      ],
    },
  },
  'GZ969SL': {
    plaque: 'GZ969SL', marque: 'HORSCH', modele: 'PRONTO 6 AS',
    categorie: 'semoir', dateCG: '16/10/2024', dateMEC: '16/10/2024',
    poidsKg: 13000, no: 'N', financement: 'ACH', vin: 'WH31007ZZRSZA2452',
    societeId: 'scea-grande-rue', couleur: 'Blanc / Jaune',
    specs: {
      travail: [
        ['Largeur de travail', '6,00 m'],
        ['Interrang', '15 cm'],
        ['Nbre d\'éléments semeurs', '40 TurboDisc'],
        ['Profondeur de semis', 'Réglage hydraulique continu'],
        ['Vitesse de travail', '10 – 20 km/h'],
        ['Puissance requise', '130–185 kW (180–250 ch)'],
      ],
      tremie: [
        ['Capacité simple cuve', '3 500 L'],
        ['Capacité double cuve', '5 000 L (répartition 40:60)'],
        ['Microgranulateur', '250 L'],
        ['Hauteur de remplissage', '2,70 m (simple) / 2,95 m (double)'],
      ],
      dimensions: [
        ['Largeur de transport', '2,95 m'],
        ['Hauteur de transport', '4,00 m'],
        ['Longueur (éléments semeurs)', '9,50 m'],
        ['Longueur avec traceurs', '10,50 m'],
        ['Poids CG', '13 000 kg'],
        ['Pneus transport', '800/45–26.5/12 TR'],
      ],
      connexion: [
        ['ISOBUS', '✓'], ['HorschConnect Telematics', '✓ (option)'],
        ['Terminal eosT10', '✓ (option)'], ['Attelage rampe', 'Cat. II/III'],
      ],
    },
    marche: {
      prixCatalogue: 87000, heuresMoyennes: null,
      valeursLectura: [],
      transactionsConcess: [
        { annee: 2022, hm: null, prixNeuf: 82000, prixAnnonce: 55000, prixVendu: 52000 },
        { annee: 2021, hm: null, prixNeuf: 78000, prixAnnonce: 49000, prixVendu: 46500 },
      ],
    },
  },
  'FM459QP': {
    plaque: 'FM459QP', marque: 'LEMKEN', modele: 'RUBIN 9',
    categorie: 'dechaumeur', dateCG: '26/12/2019', dateMEC: '22/12/2019',
    poidsKg: 5900, no: 'O', financement: 'ACH', vin: 'R9SF393983',
    societeId: 'scea-grande-rue', couleur: 'Bleu / Gris',
    specs: {
      travail: [
        ['Largeur de travail', '300 – 600 cm'],
        ['Profondeur min / max', '2 cm / 12 cm'],
        ['Distance entre points de gravité', '125 cm'],
        ['Vitesse de travail', '10 – 16 km/h'],
        ['Puissance requise', '110–191 kW (150–260 ch)'],
      ],
      dimensions: [
        ['Longueur', '285 cm'],
        ['Largeur de transport', '300 cm'],
        ['Hauteur max', '186 cm'],
        ['Poids CG', '5 900 kg'],
      ],
    },
    marche: {
      prixCatalogue: 38000, heuresMoyennes: null,
      valeursLectura: [],
      transactionsConcess: [
        { annee: 2021, hm: null, prixNeuf: 35000, prixAnnonce: 22000, prixVendu: 20500 },
      ],
    },
  },
  'AB123CD': { plaque: 'AB123CD', marque: 'FENDT', modele: '724 VARIO', categorie: 'tracteur', dateMEC: '15/03/2019', poidsKg: 9200, no: 'O', financement: 'ACH', societeId: 'earl-plateau', specs: {}, marche: { prixCatalogue: 0, valeursLectura: [], transactionsConcess: [] } },
  'EF456GH': { plaque: 'EF456GH', marque: 'JOHN DEERE', modele: 'W650', categorie: 'moissonneuse', dateMEC: '12/07/2017', poidsKg: 14800, no: 'O', financement: 'ACH', societeId: 'earl-plateau', specs: {}, marche: { prixCatalogue: 0, valeursLectura: [], transactionsConcess: [] } },
  'IJ789KL': { plaque: 'IJ789KL', marque: 'AMAZONE', modele: 'CATROS 6001', categorie: 'dechaumeur', dateMEC: '05/09/2020', poidsKg: 4100, no: 'N', financement: 'ACH', societeId: 'earl-plateau', specs: {}, marche: { prixCatalogue: 0, valeursLectura: [], transactionsConcess: [] } },
  'MN012OP': { plaque: 'MN012OP', marque: 'FENDT', modele: '516 VARIO', categorie: 'tracteur', dateMEC: '28/02/2022', poidsKg: 7800, no: 'N', financement: 'ACH', societeId: 'earl-plateau', specs: {}, marche: { prixCatalogue: 0, valeursLectura: [], transactionsConcess: [] } },
  'QR345ST': { plaque: 'QR345ST', marque: 'KUHN', modele: 'FB 3130', categorie: 'presse', dateMEC: '14/10/2018', poidsKg: 3400, no: 'O', financement: 'ACH', societeId: 'earl-plateau', specs: {}, marche: { prixCatalogue: 0, valeursLectura: [], transactionsConcess: [] } },
};

const PROSPECTION_DATA = {
  departement: 'Aube (10)',
  surface: '328 000 ha céréales',
  totalMachines: 4280,
  segmentCible: '150–250 ch', partSegment: 62,
  topMarques: {
    tracteur:     [{ m:'John Deere',p:35},{m:'Fendt',p:25},{m:'New Holland',p:18},{m:'Case IH',p:12},{m:'Autres',p:10}],
    moissonneuse: [{ m:'John Deere',p:42},{m:'CLAAS',p:30},{m:'New Holland',p:20},{m:'Autres',p:8}],
    semoir:       [{ m:'Horsch',p:28},{m:'Väderstad',p:22},{m:'Kuhn',p:20},{m:'Amazone',p:18},{m:'Autres',p:12}],
  },
  opportunites: [
    { type:'tracteur',    count:187, desc:'Tracteurs JD + Fendt > 5 ans (150–250 ch)' },
    { type:'moissonneuse',count:43,  desc:'Moissonneuses > 7 ans à renouveler' },
    { type:'semoir',      count:92,  desc:'Semoirs pneumatiques ancienne génération' },
  ],
  prospects: [
    { id:'earl-plateau',    nom:'EARL DU PLATEAU',    ville:'LUSIGNY-SUR-BARSE',  parc:5, cible:'Tracteur 200 ch',      contacted:false },
    { id:'gaec-3-chenes',   nom:'GAEC DES 3 CHÊNES',  ville:'TROYES',             parc:8, cible:'Semoir 6 m',          contacted:false },
    { id:'scea-grande-rue', nom:'SCEA LA GRANDE RUE', ville:'ST FLAVY',           parc:3, cible:'Renouvellement tract.',contacted:true  },
    { id:null, nom:'SAS AGRI DU LAC',                  ville:'BRIENNE-LE-CHÂTEAU', parc:10,cible:'Moissonneuse',        contacted:false },
    { id:null, nom:'GAEC DE LA PLAINE',                ville:'BAR-SUR-AUBE',       parc:6, cible:'Tracteur 150 ch',     contacted:false },
  ],
};

const CAT_META = {
  tracteur:     { label:'Tracteur',     color:'#4C7F05', bg:'#EBF4E1', icon:'tractor'  },
  moissonneuse: { label:'Moissonneuse', color:'#D4681A', bg:'#FBF0E7', icon:'wheat'    },
  semoir:       { label:'Semoir',       color:'#1A7FC4', bg:'#E3F2FD', icon:'seeder'   },
  dechaumeur:   { label:'Déchaumeur',   color:'#7B5EA7', bg:'#F0EAF8', icon:'harrow'   },
  presse:       { label:'Presse',       color:'#B8860B', bg:'#FEF9E7', icon:'bale'     },
  autre:        { label:'Autre',        color:'#5C6B4E', bg:'#F0F2EE', icon:'truck'    },
};
/* ══════════════════════════════════
   FICHE VÉHICULE
══════════════════════════════════ */
function VehicleScreen({ plaque, onBack, onLaunchInspection }) {
  const v = VEHICLES[plaque];
  const company = v ? COMPANIES.find(c => c.id === v.societeId) : null;
  const [vtab, setVtab] = useState('infos');

  if (!v) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:G.bg }}>
      <BackHeader title="Matériel introuvable" onBack={onBack} />
      <div style={{ padding:24, textAlign:'center', color:G.muted }}>Plaque <b>{plaque}</b> non trouvée.</div>
    </div>
  );

  const cat = CAT_META[v.categorie] || CAT_META.autre;
  const annee = v.dateMEC ? parseInt(v.dateMEC.slice(-4)) : null;
  const age = annee ? new Date().getFullYear() - annee : null;

  const SECTION_LABELS = { moteur:'Moteur', transmission:'Transmission', hydraulique:'Hydraulique', dimensions:'Dimensions & Poids', equipements:'Équipements de série', travail:'Travail', tremie:'Trémie', connexion:'Connectivité' };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:G.bg, overflow:'hidden' }}>
      {/* ── Header ── */}
      <div style={{ background:G.dark, flexShrink:0, paddingTop:'max(calc(env(safe-area-inset-top,0px)+10px),14px)' }}>
        <div style={{ padding:'8px 20px 0' }}>
          <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.65)' }}>
            <Ic n="chevL" s={17} c="rgba(255,255,255,0.65)" />
            <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)' }}>Retour</span>
          </button>
        </div>
        <div style={{ padding:'6px 20px 14px', display:'flex', alignItems:'flex-start', gap:14 }}>
          <div style={{ background:'white', borderRadius:8, padding:'4px 10px', border:'2px solid rgba(255,255,255,0.2)', flexShrink:0 }}>
            <div style={{ fontSize:9, fontWeight:800, color:'#888', letterSpacing:1.5, textTransform:'uppercase' }}>Immat.</div>
            <div style={{ fontSize:18, fontWeight:900, color:'#111', letterSpacing:1, fontFamily:'monospace' }}>{v.plaque}</div>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:cat.bg, borderRadius:20, padding:'2px 8px', marginBottom:4 }}>
              <Ic n={cat.icon} s={11} c={cat.color} />
              <span style={{ fontSize:10, fontWeight:700, color:cat.color, textTransform:'uppercase', letterSpacing:0.8 }}>{cat.label}</span>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:'white' }}>{v.marque}</div>
            <div style={{ fontSize:19, fontWeight:900, color:'white', letterSpacing:'-0.4px' }}>{v.modele}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
            <div style={{ background:v.no==='N'?'#22C55E':'#F59E0B', color:'white', borderRadius:6, padding:'2px 7px', fontSize:10, fontWeight:800 }}>{v.no==='N'?'NEUF':'OCCASION'}</div>
            {age !== null && <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{age} ans</div>}
          </div>
        </div>
        <div style={{ display:'flex', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          {[['infos','Infos'],['tech','Fiche tech.'],['marche','Marché']].map(([k,l]) => (
            <button key={k} onClick={()=>setVtab(k)} style={{ flex:1, background:'none', border:'none', cursor:'pointer', padding:'10px 0', fontSize:12, fontWeight:700, color:vtab===k?'white':'rgba(255,255,255,0.4)', borderBottom:vtab===k?`2px solid ${G.light}`:'2px solid transparent' }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', paddingBottom:84 }}>

        {/* INFOS */}
        {vtab==='infos' && <>
          {company && (
            <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Propriétaire</div>
              <div style={{ fontSize:14, fontWeight:800, color:'#111' }}>{company.nom}</div>
              <div style={{ fontSize:12, color:G.muted, marginTop:2 }}>{company.adresse}, {company.cp} {company.ville}</div>
              <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>SIRET : {company.siret}</div>
              <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{company.activite}</div>
            </div>
          )}
          <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Carte grise</div>
            {[
              ['Date carte grise', v.dateCG || '—'],
              ['1ère mise en circulation', v.dateMEC || '—'],
              ['Neuf / Occasion', v.no==='N'?'Neuf':'Occasion'],
              ['Financement', v.financement==='ACH'?'Achat':v.financement],
              ['Poids (CG)', `${v.poidsKg?.toLocaleString('fr')} kg`],
              ['Couleur', v.couleur || '—'],
              ['N° VIN', v.vin || '—'],
            ].map(([l,val]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #F3F3F3', gap:8 }}>
                <span style={{ fontSize:12, color:G.muted, fontWeight:500 }}>{l}</span>
                <span style={{ fontSize:12, fontWeight:700, color:'#111', textAlign:'right', wordBreak:'break-all', maxWidth:'55%' }}>{val}</span>
              </div>
            ))}
          </div>
        </>}

        {/* FICHE TECH */}
        {vtab==='tech' && <>
          {Object.entries(v.specs).length === 0
            ? <div style={{ textAlign:'center', color:G.muted, padding:40, fontSize:13 }}>Fiche technique non disponible</div>
            : Object.entries(v.specs).map(([section, rows]) => (
              <div key={section} style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{SECTION_LABELS[section] || section}</div>
                {rows.map(([l,val]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #F3F3F3', gap:8 }}>
                    <span style={{ fontSize:12, color:G.muted, fontWeight:500, flex:1 }}>{l}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:val==='✓'?G.primary:val==='✗'?G.red:'#111', textAlign:'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            ))
          }
        </>}

        {/* MARCHÉ */}
        {vtab==='marche' && <>
          {v.marche?.prixCatalogue > 0 && (
            <div style={{ background:`linear-gradient(135deg, ${G.dark} 0%, ${G.primary} 100%)`, borderRadius:13, padding:'14px 16px', marginBottom:10 }}>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:1 }}>Prix catalogue neuf</div>
              <div style={{ fontSize:24, fontWeight:900, color:'white', marginTop:2 }}>{v.marche.prixCatalogue.toLocaleString('fr')} €</div>
              {v.marche.heuresMoyennes && <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:2 }}>~{v.marche.heuresMoyennes} h/an estimées</div>}
            </div>
          )}
          {v.marche?.transactionsConcess?.length > 0 && (
            <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Ventes concession — même modèle</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, marginBottom:6 }}>
                {['Année','H.M.','Annoncé','Vendu'].map(h=><div key={h} style={{ fontSize:9, fontWeight:700, color:G.muted, textTransform:'uppercase', textAlign:'center' }}>{h}</div>)}
              </div>
              {v.marche.transactionsConcess.map((t,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, padding:'6px 0', borderTop:'1px solid #F3F3F3' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#111', textAlign:'center' }}>{t.annee}</div>
                  <div style={{ fontSize:12, color:G.muted, textAlign:'center' }}>{t.hm?`${t.hm.toLocaleString('fr')} h`:'—'}</div>
                  <div style={{ fontSize:11, color:G.muted, textAlign:'center' }}>{(t.prixAnnonce/1000).toFixed(0)}k €</div>
                  <div style={{ fontSize:11, fontWeight:700, color:G.primary, textAlign:'center' }}>{(t.prixVendu/1000).toFixed(0)}k €</div>
                </div>
              ))}
            </div>
          )}
          {v.marche?.valeursLectura?.length > 0 && (
            <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Valeurs résiduelles estimées</div>
              <div style={{ fontSize:10, color:G.muted, marginBottom:10 }}>Source : Lectura Valuation</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, marginBottom:6 }}>
                {['Année','Achat','Vente'].map(h=><div key={h} style={{ fontSize:9, fontWeight:700, color:G.muted, textTransform:'uppercase', textAlign:'center' }}>{h}</div>)}
              </div>
              {v.marche.valeursLectura.map((r,i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4, padding:'6px 0', borderTop:'1px solid #F3F3F3' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'#111', textAlign:'center' }}>{r.annee}</div>
                  <div style={{ fontSize:11, color:G.orange, fontWeight:600, textAlign:'center' }}>{r.achat.toLocaleString('fr')} €</div>
                  <div style={{ fontSize:11, color:G.primary, fontWeight:700, textAlign:'center' }}>{r.vente.toLocaleString('fr')} €</div>
                </div>
              ))}
            </div>
          )}
          {!v.marche?.prixCatalogue && !v.marche?.transactionsConcess?.length && !v.marche?.valeursLectura?.length && (
            <div style={{ textAlign:'center', color:G.muted, padding:40, fontSize:13 }}>Données marché non disponibles</div>
          )}
        </>}
      </div>

      {/* CTA */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 16px', paddingBottom:'max(12px,env(safe-area-inset-bottom,0px))', background:'white', borderTop:`1px solid ${G.border}` }}>
        <button onClick={()=>onLaunchInspection(v)} style={{ width:'100%', padding:'14px 0', borderRadius:13, background:`linear-gradient(135deg, ${G.primary}, ${G.dark})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 4px 16px rgba(76,127,5,0.35)' }}>
          <Ic n="check" s={18} c="white" />
          <span style={{ fontSize:15, fontWeight:800, color:'white' }}>Lancer l'inspection</span>
          <Ic n="chevR" s={16} c="rgba(255,255,255,0.7)" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   FICHE SOCIÉTÉ
══════════════════════════════════ */
function CompanyScreen({ companyId, onBack, onOpenVehicle }) {
  const company = COMPANIES.find(c => c.id === companyId);
  const vehicles = company ? (company.plaques || []).map(p=>VEHICLES[p]).filter(Boolean) : [];

  if (!company) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:G.bg }}>
      <BackHeader title="Société introuvable" onBack={onBack} />
    </div>
  );

  const catBreakdown = vehicles.reduce((acc,veh)=>{ const k=veh.categorie||'autre'; acc[k]=(acc[k]||0)+1; return acc; }, {});

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:G.bg, overflow:'hidden' }}>
      <div style={{ background:G.dark, flexShrink:0, paddingTop:'max(calc(env(safe-area-inset-top,0px)+10px),14px)' }}>
        <div style={{ padding:'8px 20px 0' }}>
          <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.65)' }}>
            <Ic n="chevL" s={17} c="rgba(255,255,255,0.65)" />
            <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)' }}>Retour</span>
          </button>
        </div>
        <div style={{ padding:'6px 20px 16px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:2 }}>Fiche société</div>
          <div style={{ fontSize:20, fontWeight:900, color:'white' }}>{company.nom}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:3 }}>{company.adresse} — {company.cp} {company.ville}</div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px', display:'flex', gap:5, alignItems:'center' }}>
              <Ic n="tractor" s={12} c="rgba(255,255,255,0.6)" />
              <span style={{ fontSize:11, fontWeight:700, color:'white' }}>{vehicles.length} matériel{vehicles.length>1?'s':''}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 10px', display:'flex', gap:5, alignItems:'center' }}>
              <Ic n="user" s={12} c="rgba(255,255,255,0.6)" />
              <span style={{ fontSize:11, fontWeight:700, color:'white' }}>{company.contacts} contact{company.contacts>1?'s':''}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px' }}>
        <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Informations</div>
          {[
            ['SIRET', company.siret],
            ['Activité', company.activite],
            ['Catégorie juridique', company.catJuridique],
            ['Effectif', company.salaries],
          ].map(([l,val])=>(
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'6px 0', borderBottom:'1px solid #F3F3F3', gap:8 }}>
              <span style={{ fontSize:11, color:G.muted, fontWeight:500, flexShrink:0 }}>{l}</span>
              <span style={{ fontSize:11, fontWeight:600, color:'#111', textAlign:'right', flex:1 }}>{val}</span>
            </div>
          ))}
        </div>

        {Object.keys(catBreakdown).length > 0 && (
          <div style={{ background:'white', borderRadius:13, padding:'13px 16px', marginBottom:10, boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Répartition du parc</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {Object.entries(catBreakdown).map(([cat,cnt])=>{
                const meta=CAT_META[cat]||CAT_META.autre;
                return (
                  <div key={cat} style={{ display:'flex', alignItems:'center', gap:6, background:meta.bg, borderRadius:20, padding:'5px 10px' }}>
                    <Ic n={meta.icon} s={13} c={meta.color} />
                    <span style={{ fontSize:12, fontWeight:700, color:meta.color }}>{cnt} {meta.label}{cnt>1?'s':''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8, marginTop:4 }}>Matériels ({vehicles.length})</div>
        {vehicles.map(veh=>{
          const meta=CAT_META[veh.categorie]||CAT_META.autre;
          const annee=veh.dateMEC?parseInt(veh.dateMEC.slice(-4)):null;
          const age=annee?new Date().getFullYear()-annee:null;
          return (
            <button key={veh.plaque} onClick={()=>onOpenVehicle(veh.plaque)} style={{ width:'100%', background:'white', border:`1.5px solid ${G.border}`, borderRadius:13, padding:'12px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Ic n={meta.icon} s={20} c={meta.color} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>{veh.marque} {veh.modele}</span>
                  <span style={{ fontSize:10, background:veh.no==='N'?'#22C55E':'#F59E0B', color:'white', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>{veh.no==='N'?'N':'O'}</span>
                </div>
                <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{veh.plaque} · {annee||'—'}{age?` (${age} ans)`:''}</div>
              </div>
              <Ic n="chevR" s={16} c={G.border} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   ÉCRAN RECHERCHE (Home)
══════════════════════════════════ */

/* ══════════════════════════════════
   ZONES GÉOGRAPHIQUES
══════════════════════════════════ */
const ZONES = [
  {
    id: 'all', label: 'Tout le dpt', short: 'Tout',
    communes: [],
  },
  {
    id: 'champagne-crayeuse', label: 'Champagne Crayeuse', short: 'Ch. Crayeuse',
    desc: 'Grandes cultures — plateau calcaire',
    communes: ['ST FLAVY','TROYES','LUSIGNY-SUR-BARSE','ARCIS-SUR-AUBE','MÉRY-SUR-SEINE','SAINT-HILAIRE-SOUS-ROMILLY','VILLIERS-HERBISSE','HERBISSE','TORCY-LE-GRAND'],
    parc: 1820, surface: '148 000 ha',
  },
  {
    id: 'brie-champenoise', label: 'Brie Champenoise', short: 'Brie',
    desc: 'Polyculture — limons argileux',
    communes: ['VILLENAUXE-LA-GRANDE','NOGENT-SUR-SEINE','ROMILLY-SUR-SEINE','MAILLY-LE-CAMP','PRUNAY-BELLEVILLE'],
    parc: 610, surface: '52 000 ha',
  },
  {
    id: 'der-brienne', label: 'Der-Brienne', short: 'Der',
    desc: 'Grandes cultures — plaine argileuse',
    communes: ['BRIENNE-LE-CHÂTEAU','MONTIER-EN-DER','MARGERIE-HANCOURT','HAMPIGNY','UNIENVILLE'],
    parc: 540, surface: '44 000 ha',
  },
  {
    id: 'bar-sequanais', label: 'Bar-Séquanais', short: 'Bar-Séquanais',
    desc: 'Vignes + grandes cultures — Côte des Bar',
    communes: ['BAR-SUR-AUBE','BAR-SUR-SEINE','ESSOYES','GYÉET-SUR-AUJON','BLIGNY'],
    parc: 490, surface: '38 000 ha',
  },
  {
    id: 'pays-othe', label: "Pays d'Othe", short: "Othe",
    desc: 'Bocage — polyélevage, forêt',
    communes: ["ERVy-LE-CHÂTEL","AIX-EN-OTHE","CHAOURCE","RIGNY-LE-FERRON","MARAYE-EN-OTHE"],
    parc: 320, surface: '24 000 ha',
  },
  {
    id: 'sezannais', label: 'Sézannais', short: 'Sézannais',
    desc: 'Grandes cultures — plaine',
    communes: ['SÉZANNE','VINDEY','ALLEMANT','BARBONNE-FAYEL'],
    parc: 280, surface: '22 000 ha',
  },
  {
    id: 'perthois', label: 'Perthois', short: 'Perthois',
    desc: 'Grandes cultures — Marne',
    communes: ['SAINT-DIZIER','JOINVILLE','WASSY','PERTHES'],
    parc: 220, surface: '19 000 ha',
  },
];

/* Matériel étendu pour la prospection */
const ALL_MATERIEL = [
  ...Object.values(VEHICLES),
  { plaque:'TK112AB', marque:'FENDT', modele:'724 VARIO', categorie:'tracteur', dateMEC:'10/04/2018', poidsKg:8400, no:'O', societeId:'gaec-3-chenes', zoneId:'champagne-crayeuse', puissance:240 },
  { plaque:'RZ234CD', marque:'CLAAS', modele:'LEXION 750', categorie:'moissonneuse', dateMEC:'15/07/2016', poidsKg:18200, no:'O', societeId:'gaec-3-chenes', zoneId:'champagne-crayeuse', puissance:null },
  { plaque:'WM567EF', marque:'VÄDERSTAD', modele:'TEMPO L 16', categorie:'semoir', dateMEC:'02/03/2021', poidsKg:5600, no:'N', societeId:'gaec-3-chenes', zoneId:'champagne-crayeuse', puissance:null },
  { plaque:'BN890GH', marque:'FENDT', modele:'516 VARIO', categorie:'tracteur', dateMEC:'20/11/2021', poidsKg:7200, no:'N', societeId:null, zoneId:'brie-champenoise', puissance:165 },
  { plaque:'XP123IJ', marque:'JOHN DEERE', modele:'S780', categorie:'moissonneuse', dateMEC:'08/06/2019', poidsKg:19400, no:'O', societeId:null, zoneId:'der-brienne', puissance:null },
  { plaque:'LM456KL', marque:'CASE IH', modele:'OPTUM 300', categorie:'tracteur', dateMEC:'15/03/2020', poidsKg:9100, no:'O', societeId:null, zoneId:'der-brienne', puissance:300 },
  { plaque:'QF789MN', marque:'KUHN', modele:'METRIS 3000', categorie:'semoir', dateMEC:'22/08/2020', poidsKg:3800, no:'O', societeId:null, zoneId:'bar-sequanais', puissance:null },
  { plaque:'HG012OP', marque:'NEW HOLLAND', modele:'T7.270', categorie:'tracteur', dateMEC:'14/01/2017', poidsKg:8600, no:'O', societeId:null, zoneId:'pays-othe', puissance:270 },
  { plaque:'ZC345QR', marque:'AMAZONE', modele:'CITAN 15001-C', categorie:'semoir', dateMEC:'30/09/2022', poidsKg:2200, no:'N', societeId:null, zoneId:'sezannais', puissance:null },
  { plaque:'VT678ST', marque:'JOHN DEERE', modele:'6175R', categorie:'tracteur', dateMEC:'05/05/2019', poidsKg:8900, no:'O', societeId:null, zoneId:'champagne-crayeuse', puissance:175 },
  { plaque:'NE901UV', marque:'CLAAS', modele:'TUCANO 570', categorie:'moissonneuse', dateMEC:'20/06/2018', poidsKg:14800, no:'O', societeId:null, zoneId:'brie-champenoise', puissance:null },
  { plaque:'PR234WX', marque:'HORSCH', modele:'JOKER 8 CT', categorie:'dechaumeur', dateMEC:'12/10/2021', poidsKg:6100, no:'N', societeId:null, zoneId:'der-brienne', puissance:null },
  { plaque:'DK567YZ', marque:'FENDT', modele:'933 VARIO', categorie:'tracteur', dateMEC:'28/08/2017', poidsKg:11200, no:'O', societeId:null, zoneId:'champagne-crayeuse', puissance:333 },
  { plaque:'SB890AB', marque:'KUHN', modele:'SB 1290 D', categorie:'presse', dateMEC:'15/05/2020', poidsKg:5800, no:'O', societeId:null, zoneId:'pays-othe', puissance:null },
  { plaque:'GH123CD', marque:'NEW HOLLAND', modele:'CR10.90', categorie:'moissonneuse', dateMEC:'01/07/2022', poidsKg:22000, no:'N', societeId:null, zoneId:'sezannais', puissance:null },
];

/* Helper: age depuis dateMEC */
function getAge(dateMEC) {
  if (!dateMEC) return null;
  const yr = parseInt(dateMEC.slice(-4));
  return isNaN(yr) ? null : new Date().getFullYear() - yr;
}

/* ══════════════════════════════════
   TAB — INSPECTION (RECHERCHE)
══════════════════════════════════ */
function InspectionTab({ onOpenVehicle, onOpenCompany, onNewInspection }) {
  const [mode,  setMode]  = useState('modele');
  const [query, setQuery] = useState('');

  const allVehicles = useMemo(() => Object.values(VEHICLES), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (mode === 'plaque') {
      if (!q) return allVehicles; // show all when empty
      return allVehicles.filter(v => v.plaque.toLowerCase().includes(q));
    }
    if (mode === 'modele') {
      if (!q) return allVehicles;
      return allVehicles.filter(v =>
        v.marque.toLowerCase().includes(q) ||
        v.modele.toLowerCase().includes(q) ||
        v.categorie.toLowerCase().includes(q)
      );
    }
    if (mode === 'societe') {
      return null; // special: render companies
    }
    return [];
  }, [mode, query, allVehicles]);

  const companyResults = useMemo(() => {
    if (mode !== 'societe') return [];
    const q = query.trim().toLowerCase();
    if (!q) return COMPANIES;
    return COMPANIES.filter(c =>
      c.nom.toLowerCase().includes(q) ||
      c.ville.toLowerCase().includes(q) ||
      c.siret.includes(q)
    );
  }, [mode, query]);

  const PLACEHOLDERS = {
    plaque:  'Ex : DS134ST',
    modele:  'Ex : John Deere, Fendt, 6150R…',
    societe: 'Ex : SCEA, EARL, nom…',
  };

  const grouped = useMemo(() => {
    if (mode === 'societe' || !results) return null;
    return results.reduce((acc, v) => {
      const k = v.categorie || 'autre';
      if (!acc[k]) acc[k] = [];
      acc[k].push(v);
      return acc;
    }, {});
  }, [results, mode]);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:G.bg }}>
      {/* ── Header fixe ── */}
      <div style={{ background:G.dark, flexShrink:0, paddingTop:'max(calc(env(safe-area-inset-top,0px)+10px),14px)', paddingBottom:14 }}>
        <div style={{ padding:'0 16px 12px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:2, textTransform:'uppercase' }}>AgriCertif</div>
            <div style={{ fontSize:22, fontWeight:900, color:'white', lineHeight:1.1, marginTop:1 }}>Inspection</div>
          </div>
          <button onClick={onNewInspection} style={{ display:'flex', alignItems:'center', gap:5, background:G.light, border:'none', borderRadius:20, padding:'7px 13px', cursor:'pointer' }}>
            <Ic n="plus" s={14} c="white" />
            <span style={{ fontSize:12, fontWeight:800, color:'white' }}>Nouvelle</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div style={{ margin:'0 16px', background:'white', borderRadius:12, display:'flex', alignItems:'center', gap:8, padding:'0 12px', boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
          <Ic n="search" s={16} c={G.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={PLACEHOLDERS[mode]}
            style={{ flex:1, border:'none', outline:'none', fontSize:15, fontWeight:500, padding:'13px 0', color:'#111', background:'transparent', fontFamily:'system-ui,-apple-system,sans-serif' }}
          />
          {query !== '' && (
            <button onClick={()=>setQuery('')} style={{ background:'#E8E8E8', border:'none', borderRadius:10, width:20, height:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontSize:11, color:'#666', lineHeight:1 }}>✕</span>
            </button>
          )}
        </div>

        {/* Modes */}
        <div style={{ display:'flex', gap:6, padding:'10px 16px 0' }}>
          {[['plaque','Plaque','id'],['modele','Modèle','tractor'],['societe','Société','building']].map(([k,l,ic]) => (
            <button key={k} onClick={()=>{ setMode(k); setQuery(''); }} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 11px', borderRadius:20, border:'none', cursor:'pointer', background: mode===k ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)', transition:'background 0.15s' }}>
              <Ic n={ic} s={11} c={mode===k ? 'white' : 'rgba(255,255,255,0.45)'} />
              <span style={{ fontSize:11, fontWeight:700, color: mode===k ? 'white' : 'rgba(255,255,255,0.45)' }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Résultats ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px 16px' }}>

        {/* Mode SOCIÉTÉ */}
        {mode === 'societe' && (
          <>
            {companyResults.length === 0
              ? <div style={{ textAlign:'center', color:G.muted, padding:40, fontSize:14 }}>Aucune société trouvée</div>
              : companyResults.map(co => {
                  const vCount = (co.plaques || []).length;
                  const cats = (co.plaques || []).map(p => VEHICLES[p]?.categorie).filter(Boolean);
                  const uniqCats = [...new Set(cats)];
                  return (
                    <button key={co.id} onClick={()=>onOpenCompany(co.id)} style={{ width:'100%', background:'white', border:'none', borderRadius:14, padding:'13px 14px', marginBottom:8, display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left', boxShadow:'0 1px 5px rgba(0,0,0,0.06)' }}>
                      <div style={{ width:42, height:42, borderRadius:11, background:G.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1.5px solid ${G.border}` }}>
                        <Ic n="building" s={20} c={G.muted} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:800, color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{co.nom}</div>
                        <div style={{ fontSize:11, color:G.muted, marginTop:1 }}>{co.ville} · {co.cp}</div>
                        <div style={{ display:'flex', gap:4, marginTop:5, flexWrap:'wrap' }}>
                          {uniqCats.map(cat => {
                            const m = CAT_META[cat] || CAT_META.autre;
                            return <span key={cat} style={{ fontSize:10, fontWeight:700, color:m.color, background:m.bg, borderRadius:6, padding:'1px 6px' }}>{m.label}</span>;
                          })}
                          <span style={{ fontSize:10, fontWeight:600, color:G.muted }}>{vCount} matériel{vCount>1?'s':''}</span>
                        </div>
                      </div>
                      <Ic n="chevR" s={16} c={G.border} />
                    </button>
                  );
                })
            }
          </>
        )}

        {/* Mode PLAQUE ou MODÈLE — résultats groupés par catégorie */}
        {mode !== 'societe' && grouped && Object.keys(CAT_META).map(catKey => {
          const items = grouped[catKey];
          if (!items || items.length === 0) return null;
          const meta = CAT_META[catKey];
          return (
            <div key={catKey} style={{ marginBottom:16 }}>
              {/* Section header */}
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6, padding:'0 2px' }}>
                <Ic n={meta.icon} s={13} c={meta.color} />
                <span style={{ fontSize:11, fontWeight:700, color:meta.color, textTransform:'uppercase', letterSpacing:0.8 }}>{meta.label}s</span>
                <span style={{ fontSize:11, color:G.muted, fontWeight:500 }}>({items.length})</span>
              </div>
              {items.map(veh => {
                const age = getAge(veh.dateMEC);
                const co = COMPANIES.find(c => c.id === veh.societeId);
                return (
                  <button key={veh.plaque} onClick={()=>onOpenVehicle(veh.plaque)} style={{ width:'100%', background:'white', border:'none', borderRadius:14, padding:'12px 13px', marginBottom:7, display:'flex', alignItems:'center', gap:11, cursor:'pointer', textAlign:'left', boxShadow:'0 1px 5px rgba(0,0,0,0.06)' }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Ic n={meta.icon} s={20} c={meta.color} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                        <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>{veh.marque} {veh.modele}</span>
                        <span style={{ fontSize:9, fontWeight:800, background:veh.no==='N'?'#22C55E':'#F59E0B', color:'white', borderRadius:4, padding:'1px 5px' }}>{veh.no==='N'?'NEUF':'OCC.'}</span>
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <span style={{ fontSize:11, color:'#444', fontWeight:600, fontFamily:'ui-monospace,monospace', letterSpacing:0.5 }}>{veh.plaque}</span>
                        {age !== null && <span style={{ fontSize:11, color:G.muted }}>{age} ans</span>}
                        {co && <span style={{ fontSize:11, color:G.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:110 }}>{co.nom}</span>}
                      </div>
                    </div>
                    <Ic n="chevR" s={15} c="#DDD" />
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Aucun résultat */}
        {mode !== 'societe' && grouped && Object.values(grouped).every(v => !v?.length) && query && (
          <div style={{ textAlign:'center', color:G.muted, padding:40, fontSize:14 }}>Aucun résultat pour « {query} »</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   TAB — PROSPECTION
══════════════════════════════════ */
function ProspectionTab({ onOpenVehicle, onOpenCompany }) {
  const [zone,     setZone]     = useState('all');
  const [catFilter,setCatFilter] = useState('all');
  const [marFilter,setMarFilter] = useState('');
  const [ageFilter,setAgeFilter] = useState('all');
  const [puiFilter,setPuiFilter] = useState('all');
  const [showFilters,setShowFilters] = useState(false);
  const [section,  setSection]  = useState('materiel'); // materiel | opportunites | prospects

  const TOP_MARQUES = [
    { m:'John Deere', cats:['tracteur','moissonneuse'], p:35 },
    { m:'Fendt',      cats:['tracteur'], p:25 },
    { m:'CLAAS',      cats:['moissonneuse'], p:22 },
    { m:'Horsch',     cats:['semoir','dechaumeur'], p:18 },
    { m:'New Holland',cats:['tracteur','moissonneuse'], p:15 },
    { m:'Case IH',    cats:['tracteur'], p:12 },
    { m:'Amazone',    cats:['semoir','dechaumeur'], p:11 },
    { m:'Väderstad',  cats:['semoir'], p:9 },
    { m:'Kuhn',       cats:['semoir','presse'], p:9 },
    { m:'Lemken',     cats:['dechaumeur'], p:8 },
  ];

  const currentZone = ZONES.find(z => z.id === zone) || ZONES[0];

  const filteredMateriel = useMemo(() => {
    return ALL_MATERIEL.filter(v => {
      if (zone !== 'all' && v.zoneId !== zone) return false;
      if (catFilter !== 'all' && v.categorie !== catFilter) return false;
      if (marFilter) {
        const q = marFilter.toLowerCase();
        if (!v.marque.toLowerCase().includes(q) && !v.modele.toLowerCase().includes(q)) return false;
      }
      if (ageFilter !== 'all') {
        const age = getAge(v.dateMEC);
        if (age === null) return false;
        if (ageFilter === 'lt5'  && age >= 5)  return false;
        if (ageFilter === '5-10' && (age < 5 || age > 10)) return false;
        if (ageFilter === 'gt10' && age <= 10) return false;
      }
      if (puiFilter !== 'all' && v.categorie === 'tracteur') {
        const p = v.puissance || 0;
        if (puiFilter === 'lt150' && p >= 150) return false;
        if (puiFilter === '150-250' && (p < 150 || p > 250)) return false;
        if (puiFilter === 'gt250' && p <= 250) return false;
      }
      return true;
    });
  }, [zone, catFilter, marFilter, ageFilter, puiFilter]);

  const activeFilterCount = [catFilter!=='all',marFilter!=='',ageFilter!=='all',puiFilter!=='all'].filter(Boolean).length;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:G.bg }}>
      {/* ── Header ── */}
      <div style={{ background:G.dark, flexShrink:0, paddingTop:'max(calc(env(safe-area-inset-top,0px)+10px),14px)', paddingBottom:0 }}>
        <div style={{ padding:'0 16px 12px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:2, textTransform:'uppercase' }}>AgriCertif</div>
            <div style={{ fontSize:22, fontWeight:900, color:'white', lineHeight:1.1, marginTop:1 }}>Prospection</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:20, fontWeight:900, color:'white' }}>4 280</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>machines Aube</div>
          </div>
        </div>

        {/* Zones — scroll horizontal */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', padding:'0 16px 12px', scrollbarWidth:'none' }}>
          {ZONES.map(z => (
            <button key={z.id} onClick={()=>setZone(z.id)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:20, border:'none', cursor:'pointer', background: zone===z.id ? 'white' : 'rgba(255,255,255,0.12)', transition:'background 0.15s' }}>
              <span style={{ fontSize:11, fontWeight:700, color: zone===z.id ? G.dark : 'rgba(255,255,255,0.6)', whiteSpace:'nowrap' }}>{z.short || z.label}</span>
            </button>
          ))}
        </div>

        {/* Section tabs */}
        <div style={{ display:'flex', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          {[['materiel','Matériel'],['opportunites','Opportunités'],['prospects','Prospects']].map(([k,l]) => (
            <button key={k} onClick={()=>setSection(k)} style={{ flex:1, background:'none', border:'none', cursor:'pointer', padding:'9px 0', fontSize:11, fontWeight:700, color:section===k?'white':'rgba(255,255,255,0.35)', borderBottom:section===k?`2px solid ${G.light}`:'2px solid transparent' }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'0' }}>

        {/* ── MATÉRIEL — recherche avancée ── */}
        {section === 'materiel' && (
          <div style={{ padding:'12px 14px 16px' }}>
            {/* Zone info */}
            {zone !== 'all' && currentZone.desc && (
              <div style={{ background:G.primary, borderRadius:12, padding:'10px 14px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:'white' }}>{currentZone.label}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:1 }}>{currentZone.desc}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:16, fontWeight:900, color:'white' }}>{currentZone.parc?.toLocaleString('fr')}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>machines</div>
                </div>
              </div>
            )}

            {/* Filtres */}
            <div style={{ background:'white', borderRadius:12, marginBottom:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <button onClick={()=>setShowFilters(!showFilters)} style={{ width:'100%', background:'none', border:'none', cursor:'pointer', padding:'12px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Ic n="filter" s={15} c={activeFilterCount>0?G.primary:G.muted} />
                  <span style={{ fontSize:13, fontWeight:700, color:activeFilterCount>0?G.primary:'#111' }}>Filtres</span>
                  {activeFilterCount > 0 && <span style={{ fontSize:11, fontWeight:800, background:G.primary, color:'white', borderRadius:10, padding:'1px 7px' }}>{activeFilterCount}</span>}
                </div>
                <Ic n={showFilters?'chevD':'chevR'} s={16} c={G.muted} />
              </button>

              {showFilters && (
                <div style={{ borderTop:`1px solid ${G.border}`, padding:'12px 14px 14px', display:'flex', flexDirection:'column', gap:12 }}>
                  {/* Catégorie */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:6, textTransform:'uppercase', letterSpacing:0.8 }}>Catégorie</div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {[['all','Toutes'],['tracteur','Tracteur'],['moissonneuse','Moiss.'],['semoir','Semoir'],['dechaumeur','Déchaumeur'],['presse','Presse']].map(([k,l]) => (
                        <button key={k} onClick={()=>setCatFilter(k)} style={{ padding:'5px 10px', borderRadius:20, border:`1.5px solid ${catFilter===k?G.primary:G.border}`, background:catFilter===k?G.primary:'white', cursor:'pointer' }}>
                          <span style={{ fontSize:11, fontWeight:700, color:catFilter===k?'white':G.muted }}>{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marque / modèle */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:6, textTransform:'uppercase', letterSpacing:0.8 }}>Marque / Modèle</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, background:G.bg, borderRadius:10, padding:'8px 12px' }}>
                      <Ic n="search" s={14} c={G.muted} />
                      <input value={marFilter} onChange={e=>setMarFilter(e.target.value)} placeholder="Ex : John Deere, Fendt…" style={{ flex:1, border:'none', outline:'none', fontSize:13, background:'transparent', color:'#111', fontFamily:'system-ui,sans-serif' }} />
                    </div>
                  </div>

                  {/* Âge */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:6, textTransform:'uppercase', letterSpacing:0.8 }}>Âge du matériel</div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[['all','Tous'],['lt5','< 5 ans'],['5-10','5–10 ans'],['gt10','> 10 ans']].map(([k,l]) => (
                        <button key={k} onClick={()=>setAgeFilter(k)} style={{ flex:1, padding:'6px 4px', borderRadius:10, border:`1.5px solid ${ageFilter===k?G.primary:G.border}`, background:ageFilter===k?G.primary:'white', cursor:'pointer' }}>
                          <span style={{ fontSize:10, fontWeight:700, color:ageFilter===k?'white':G.muted }}>{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Puissance (tracteurs) */}
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:G.muted, marginBottom:6, textTransform:'uppercase', letterSpacing:0.8 }}>Puissance (tracteurs)</div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[['all','Toutes'],['lt150','< 150 ch'],['150-250','150–250 ch'],['gt250','> 250 ch']].map(([k,l]) => (
                        <button key={k} onClick={()=>setPuiFilter(k)} style={{ flex:1, padding:'6px 4px', borderRadius:10, border:`1.5px solid ${puiFilter===k?G.primary:G.border}`, background:puiFilter===k?G.primary:'white', cursor:'pointer' }}>
                          <span style={{ fontSize:10, fontWeight:700, color:puiFilter===k?'white':G.muted }}>{l}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button onClick={()=>{setCatFilter('all');setMarFilter('');setAgeFilter('all');setPuiFilter('all');}} style={{ padding:'8px', borderRadius:10, background:G.bg, border:`1px solid ${G.border}`, cursor:'pointer', fontSize:12, fontWeight:700, color:G.red }}>Réinitialiser les filtres</button>
                  )}
                </div>
              )}
            </div>

            {/* Communes de la zone */}
            {zone !== 'all' && currentZone.communes?.length > 0 && (
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Communes dans la zone</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {currentZone.communes.map(c => (
                    <span key={c} style={{ fontSize:11, fontWeight:600, color:G.dark, background:G.border, borderRadius:6, padding:'3px 8px' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Compteur résultats */}
            <div style={{ fontSize:12, fontWeight:700, color:G.muted, marginBottom:8 }}>
              {filteredMateriel.length} matériel{filteredMateriel.length>1?'s':''} trouvé{filteredMateriel.length>1?'s':''}
            </div>

            {/* Liste matériel */}
            {filteredMateriel.map((veh, i) => {
              const meta = CAT_META[veh.categorie] || CAT_META.autre;
              const age = getAge(veh.dateMEC);
              const zone = ZONES.find(z => z.id === veh.zoneId);
              const co = veh.societeId ? COMPANIES.find(c => c.id === veh.societeId) : null;
              const hasDetail = !!VEHICLES[veh.plaque];
              return (
                <button key={veh.plaque || i} onClick={()=>hasDetail&&onOpenVehicle(veh.plaque)} style={{ width:'100%', background:'white', border:'none', borderRadius:14, padding:'11px 13px', marginBottom:7, display:'flex', alignItems:'center', gap:10, cursor:hasDetail?'pointer':'default', textAlign:'left', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Ic n={meta.icon} s={19} c={meta.color} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>{veh.marque} {veh.modele}</span>
                      <span style={{ fontSize:9, fontWeight:800, background:veh.no==='N'?'#22C55E':'#F59E0B', color:'white', borderRadius:4, padding:'1px 5px' }}>{veh.no==='N'?'N':'O'}</span>
                    </div>
                    <div style={{ fontSize:11, color:G.muted, display:'flex', gap:6 }}>
                      <span style={{ fontFamily:'ui-monospace,monospace', fontSize:10, letterSpacing:0.4, color:'#555' }}>{veh.plaque}</span>
                      {age !== null && <span>{age} ans</span>}
                      {veh.puissance ? <span>{veh.puissance} ch</span> : null}
                      {zone && <span style={{ color:G.primary, fontWeight:600 }}>{zone.short||zone.label}</span>}
                    </div>
                    {co && <div style={{ fontSize:10, color:G.muted, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{co.nom}</div>}
                  </div>
                  {hasDetail && <Ic n="chevR" s={14} c="#DDD" />}
                </button>
              );
            })}
            {filteredMateriel.length === 0 && (
              <div style={{ textAlign:'center', color:G.muted, padding:40, fontSize:14 }}>Aucun matériel ne correspond à ces critères</div>
            )}
          </div>
        )}

        {/* ── OPPORTUNITÉS ── */}
        {section === 'opportunites' && (
          <div style={{ padding:'12px 14px 16px' }}>
            {/* Stats zone */}
            <div style={{ background:`linear-gradient(135deg, ${G.dark}, ${G.primary})`, borderRadius:14, padding:'14px 16px', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:800, color:'white' }}>{zone==='all'?'Aube (10)':currentZone.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginBottom:10 }}>{zone==='all'?'328 000 ha céréales':currentZone.surface||''}</div>
              <div style={{ display:'flex', gap:12 }}>
                <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'white' }}>{zone==='all'?'4 280':(currentZone.parc?.toLocaleString('fr')||'—')}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>machines immat.</div>
                </div>
                <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'white' }}>62%</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>segment 150–250 ch</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Opportunités détectées</div>
            {[
              { type:'tracteur',    count:187, desc:'Tracteurs JD + Fendt > 5 ans (150–250 ch)', detail:'Renouvellement potentiel — âge moyen 7,2 ans' },
              { type:'moissonneuse',count:43,  desc:'Moissonneuses > 7 ans', detail:'Parc vieillissant — arrêts techniques fréquents' },
              { type:'semoir',      count:92,  desc:'Semoirs pneumatiques ancienne génération', detail:'Migration vers semis direct / strip-till' },
              { type:'dechaumeur',  count:64,  desc:'Déchaumeurs > 8 ans', detail:'Normes agroéco — renouvellement accéléré' },
            ].map((op, i) => {
              const meta = CAT_META[op.type] || CAT_META.autre;
              return (
                <div key={i} style={{ background:'white', borderRadius:13, padding:'13px 14px', marginBottom:8, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:11 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:meta.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Ic n={meta.icon} s={19} c={meta.color} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'#111', marginBottom:2 }}>{op.desc}</div>
                      <div style={{ fontSize:11, color:G.muted }}>{op.detail}</div>
                    </div>
                    <div style={{ background:meta.bg, borderRadius:9, padding:'5px 8px', textAlign:'center', flexShrink:0 }}>
                      <div style={{ fontSize:17, fontWeight:900, color:meta.color }}>{op.count}</div>
                      <div style={{ fontSize:8, fontWeight:700, color:meta.color, textTransform:'uppercase' }}>mach.</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Top marques */}
            <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8, marginTop:14 }}>Présence marques — Aube</div>
            <div style={{ background:'white', borderRadius:13, padding:'13px 14px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              {TOP_MARQUES.map((m, i) => (
                <div key={i} style={{ marginBottom: i < TOP_MARQUES.length-1 ? 9 : 0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                    <div>
                      <span style={{ fontSize:12, fontWeight:700, color:'#111' }}>{m.m}</span>
                      <span style={{ fontSize:10, color:G.muted, marginLeft:6 }}>{m.cats.map(c=>CAT_META[c]?.label).join(', ')}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:800, color:G.primary }}>{m.p}%</span>
                  </div>
                  <div style={{ height:5, background:'#F0F0F0', borderRadius:99 }}>
                    <div style={{ height:'100%', width:`${m.p}%`, background:i===0?G.primary:i<3?G.light:G.border, borderRadius:99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROSPECTS ── */}
        {section === 'prospects' && (
          <div style={{ padding:'12px 14px 16px' }}>
            <div style={{ fontSize:10, fontWeight:700, color:G.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Prospects identifiés</div>
            {PROSPECTION_DATA.prospects.map((p, i) => (
              <button key={i} onClick={()=>p.id&&onOpenCompany(p.id)} style={{ width:'100%', background:'white', border:'none', borderRadius:13, padding:'12px 14px', marginBottom:7, display:'flex', alignItems:'center', gap:11, cursor:p.id?'pointer':'default', textAlign:'left', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:p.contacted?'#E8F5E9':'#FEF9E7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Ic n="building" s={18} c={p.contacted?G.primary:G.gold} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:'#111' }}>{p.nom}</span>
                    {p.contacted && <span style={{ fontSize:9, background:G.primary, color:'white', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>CONTACTÉ</span>}
                  </div>
                  <div style={{ fontSize:11, color:G.muted }}>{p.ville} · {p.parc} matériel{p.parc>1?'s':''}</div>
                  <div style={{ fontSize:11, color:G.dark, fontWeight:600, marginTop:2 }}>{p.cible}</div>
                </div>
                {p.id && <Ic n="chevR" s={15} c="#DDD" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   TAB — PROFIL
══════════════════════════════════ */
function ProfilTab() {
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 24px', background:G.bg }}>
      <div style={{ background:`linear-gradient(135deg, ${G.dark}, ${G.primary})`, borderRadius:16, padding:'20px 18px', marginBottom:16, display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:52, height:52, borderRadius:26, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Ic n="user" s={26} c="rgba(255,255,255,0.8)" />
        </div>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:'white' }}>Pacôme HAZOUARD</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:2 }}>Commercial agricole · AgriCorner</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(255,255,255,0.1)', borderRadius:6, padding:'3px 8px', marginTop:6 }}>
            <Ic n="pin" s={11} c={G.light} />
            <span style={{ fontSize:10, fontWeight:600, color:G.light }}>Aube (10)</span>
          </div>
        </div>
      </div>
      {[['Société','AgriCorner'],['Département','Aube (10)'],['Téléphone','07 62 10 41 8'],['Email','pacome.hazouard@agricorner.com']].map(([l,v]) => (
        <div key={l} style={{ background:'white', borderRadius:12, padding:'12px 14px', marginBottom:8, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize:10, color:G.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, marginBottom:2 }}>{l}</div>
          <div style={{ fontSize:13, fontWeight:600, color:'#111' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════
   HOME (conteneur bottom-nav)
══════════════════════════════════ */
function HomeScreen({ onOpenVehicle, onOpenCompany, onNewInspection }) {
  const [tab, setTab] = useState('inspection');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab==='inspection'  && <InspectionTab  onOpenVehicle={onOpenVehicle} onOpenCompany={onOpenCompany} onNewInspection={onNewInspection} />}
        {tab==='prospection' && <ProspectionTab onOpenVehicle={onOpenVehicle} onOpenCompany={onOpenCompany} />}
        {tab==='profil'      && <ProfilTab />}
      </div>
      {/* ── Bottom nav ── */}
      <nav style={{ display:'flex', background:'white', borderTop:'1px solid #EBEBEB', flexShrink:0, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
        {[
          { k:'inspection',  l:'Inspection',  ic:'check'    },
          { k:'prospection', l:'Prospection', ic:'trending' },
          { k:'profil',      l:'Profil',      ic:'user'     },
        ].map(({k,l,ic}) => (
          <button key={k} onClick={()=>setTab(k)} style={{ flex:1, border:'none', background:'none', padding:'10px 0 8px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <Ic n={ic} s={22} c={tab===k ? G.primary : '#C4C8C4'} />
            <span style={{ fontSize:10, fontWeight:700, color:tab===k ? G.primary : '#C4C8C4' }}>{l}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ══════════════════════════════════
   APP ROOT
══════════════════════════════════ */
export default function App() {
  const [screen,     setScreen]     = useState('home');
  const [dbs,        setDbs]        = useState({ tracteur:{}, moissonneuse:{}, telescopique:{} });
  const [clientInfo, setClientInfo] = useState(null);
  const [mInfo,      setMInfo]      = useState(null);
  const [inspData,   setInspData]   = useState(null);
  const [visData,    setVisData]    = useState(null);
  const [selPlaque,  setSelPlaque]  = useState(null);
  const [selCompany, setSelCompany] = useState(null);

  useEffect(()=>{
    fetch(`${BASE}tracteurs-db.json`).then(r=>r.json()).then(d=>setDbs(p=>({...p,tracteur:d}))).catch(()=>{});
    fetch(`${BASE}moissonneuses-db.json`).then(r=>r.json()).then(d=>setDbs(p=>({...p,moissonneuse:d}))).catch(()=>{});
    fetch(`${BASE}telescopiques-db.json`).then(r=>r.json()).then(d=>setDbs(p=>({...p,telescopique:d}))).catch(()=>{});
  },[]);

  const go = s => setScreen(s);

  const launchInspectionFromVehicle = (veh) => {
    const catMap = { tracteur:'tracteur', moissonneuse:'moissonneuse', semoir:'autre', dechaumeur:'autre', presse:'autre', autre:'autre' };
    setMInfo({ category:catMap[veh.categorie]||'autre', brand:veh.marque, model:veh.modele, year:veh.dateMEC?veh.dateMEC.slice(-4):'', hours:'', plate:veh.plaque });
    const co = COMPANIES.find(c=>c.id===veh.societeId);
    if (co) setClientInfo({ firstName:co.nom, lastName:'', address:`${co.adresse}, ${co.cp} ${co.ville}`, region:null });
    go('inspection');
  };

  return (
    <div className="screen-enter" key={screen} style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden', position:'relative' }}>
      {screen==='home'       && <HomeScreen       onOpenVehicle={p=>{setSelPlaque(p);go('vehicle');}} onOpenCompany={id=>{setSelCompany(id);go('company');}} onNewInspection={()=>go('client')} />}
      {screen==='vehicle'    && <VehicleScreen    plaque={selPlaque} onBack={()=>go('home')} onLaunchInspection={launchInspectionFromVehicle} />}
      {screen==='company'    && <CompanyScreen    companyId={selCompany} onBack={()=>go('home')} onOpenVehicle={p=>{setSelPlaque(p);go('vehicle');}} />}
      {screen==='client'     && <ClientScreen     onBack={()=>go('home')} onNext={d=>{setClientInfo(d);go('id');}} />}
      {screen==='id'         && <IdScreen         dbs={dbs} onBack={()=>go('client')} onNext={d=>{setMInfo(d);go('inspection');}} />}
      {screen==='inspection' && <InspectionScreen machineInfo={mInfo} onBack={()=>go(mInfo?.plate?'vehicle':'id')} onNext={d=>{setInspData(d);go('visite');}} />}
      {screen==='visite'     && <VisiteScreen     machineInfo={mInfo} onBack={()=>go('inspection')} onNext={d=>{setVisData(d);go('annonce');}} />}
      {screen==='annonce'    && <AnnonceScreen    machineInfo={mInfo} clientInfo={clientInfo} inspection={inspData} visite={visData} onBack={()=>go('visite')} onHome={()=>go('home')} />}
    </div>
  );
}
