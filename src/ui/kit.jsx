/* ── KIT UI PARTAGÉ (couleurs, icônes, en-tête) ── */

/* ── COULEURS ── */
export const G = {
  primary: '#4C7F05', dark: '#104410', light: '#6BA32E',
  cream: '#F5F2EA', muted: '#5C6B4E', border: '#DDE9D4',
  red: '#C0392B', orange: '#D4681A', gold: '#B8860B',
  white: '#fff', bg: '#F7F5EF',
};

/* ── ICÔNES SVG ── */
export const Ic = ({ n, s = 20, c = 'currentColor', style = {} }) => {
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
    logout:  <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/><polyline points="16,17 21,12 16,7" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></>,
    trash:   <><polyline points="3,6 5,6 21,6" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" style={style}>{paths[n] || null}</svg>;
};

/* ── EN-TÊTE AVEC RETOUR ── */
export function BackHeader({ title, sub, onBack, pct }) {
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
