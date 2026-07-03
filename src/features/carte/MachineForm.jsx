import { useState, useMemo } from 'react';
import { G, Ic } from '../../ui/kit';
import { EQUIPMENT_CATEGORIES } from '../../data/equipmentData';
import { addMachine, updateMachine, upsertFiche } from '../../lib/api';

const ETATS_MACHINE = ['Neuf', 'Très bon', 'Bon', 'Moyen', 'HS'];

const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, outline: 'none', background: '#FBFAF7' };
const fieldLabel = { fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 };

export default function MachineForm({ siret, statut, machine, onClose, onSaved }) {
  const [categorie, setCategorie] = useState(machine?.categorie ?? null);
  const [sousCategorie, setSousCategorie] = useState(machine?.sous_categorie ?? null);
  const [marque, setMarque] = useState(machine?.marque ?? '');
  const [showBrands, setShowBrands] = useState(false);
  const [modele, setModele] = useState(machine?.modele ?? '');
  const [annee, setAnnee] = useState(machine?.annee ?? '');
  const [puissance, setPuissance] = useState(machine?.puissance ?? '');
  const [largeur, setLargeur] = useState(machine?.largeur ?? '');
  const [etat, setEtat] = useState(machine?.etat ?? null);
  const [notes, setNotes] = useState(machine?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const cat = EQUIPMENT_CATEGORIES.find(c => c.id === categorie);
  const sub = cat?.subcategories?.find(s => s.id === sousCategorie);

  const brands = useMemo(() => {
    const list = sub?.brands ?? cat?.brands ?? [];
    if (!marque) return list.slice(0, 12);
    const q = marque.toLowerCase();
    return list.filter(b => b.toLowerCase().includes(q)).slice(0, 12);
  }, [cat, sub, marque]);

  const save = async () => {
    if (!categorie || saving) return;
    setSaving(true);
    setError(null);
    const fields = {
      categorie,
      sous_categorie: sousCategorie,
      marque: marque || null,
      modele: modele || null,
      annee: annee ? Number(annee) : null,
      puissance: puissance ? Number(puissance) : null,
      largeur: largeur ? Number(String(largeur).replace(',', '.')) : null,
      etat,
      notes: notes || null,
    };
    try {
      if (machine) {
        await updateMachine(machine.id, fields);
      } else {
        /* le parc référence la fiche : on la crée si l'exploitation n'est pas encore qualifiée */
        if (!statut) await upsertFiche(siret, { statut: 'prospect' });
        await addMachine({ siret, ...fields });
      }
      onSaved();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  const chip = (active, label, onClick, icon) => (
    <button key={label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: icon ? '8px 11px' : '7px 11px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${active ? G.primary : '#DDD'}`, background: active ? '#EBF4E1' : 'white' }}>
      {icon && <Ic n={icon} s={16} c={active ? G.primary : '#AAA'} />}
      <span style={{ fontSize: 12, fontWeight: 700, color: active ? G.primary : '#999' }}>{label}</span>
    </button>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 2000, background: 'rgba(10,30,10,0.45)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: G.bg, borderRadius: '18px 18px 0 0', maxHeight: '88%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${G.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#111' }}>{machine ? 'Modifier la machine' : 'Ajouter une machine'}</div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: G.muted, padding: 4 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px 20px' }}>
          <div style={fieldLabel}>Catégorie</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
            {EQUIPMENT_CATEGORIES.map(c => chip(categorie === c.id, c.label, () => { setCategorie(c.id); setSousCategorie(c.subcategories?.length === 1 ? c.subcategories[0].id : null); setMarque(''); }, c.icon))}
          </div>

          {cat?.subcategories?.length > 1 && (
            <>
              <div style={fieldLabel}>Type</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                {cat.subcategories.map(s => chip(sousCategorie === s.id, s.label, () => { setSousCategorie(s.id); setMarque(''); }))}
              </div>
            </>
          )}

          {categorie && (
            <>
              <div style={fieldLabel}>Marque</div>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  style={inputStyle}
                  placeholder="Rechercher une marque…"
                  value={marque}
                  onChange={e => { setMarque(e.target.value); setShowBrands(true); }}
                  onFocus={() => setShowBrands(true)}
                  onBlur={() => setTimeout(() => setShowBrands(false), 150)}
                />
                {showBrands && brands.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'white', borderRadius: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', maxHeight: 190, overflowY: 'auto', marginTop: 4 }}>
                    {brands.map(b => (
                      <button key={b} onMouseDown={() => { setMarque(b); setShowBrands(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 13px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#222' }}>{b}</button>
                    ))}
                  </div>
                )}
              </div>

              <div style={fieldLabel}>Modèle</div>
              <input style={{ ...inputStyle, marginBottom: 14 }} placeholder="Ex : 724 Vario" value={modele} onChange={e => setModele(e.target.value)} />

              <div style={{ display: 'flex', gap: 9, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={fieldLabel}>Année</div>
                  <input style={inputStyle} type="number" inputMode="numeric" placeholder="2018" value={annee} onChange={e => setAnnee(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={fieldLabel}>Puissance (ch)</div>
                  <input style={inputStyle} type="number" inputMode="numeric" placeholder="240" value={puissance} onChange={e => setPuissance(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={fieldLabel}>Largeur (m)</div>
                  <input style={inputStyle} type="text" inputMode="decimal" placeholder="6" value={largeur} onChange={e => setLargeur(e.target.value)} />
                </div>
              </div>

              <div style={fieldLabel}>État</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap', overflowX: 'auto', marginBottom: 14 }}>
                {ETATS_MACHINE.map(v => chip(etat === v, v, () => setEtat(etat === v ? null : v)))}
              </div>

              <div style={fieldLabel}>Notes</div>
              <textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Heures, options, projet de renouvellement…" value={notes} onChange={e => setNotes(e.target.value)} />
            </>
          )}

          {error && <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: G.red }}>{error}</div>}
        </div>

        <div style={{ padding: '12px 18px calc(env(safe-area-inset-bottom, 0px) + 14px)', borderTop: `1px solid ${G.border}`, flexShrink: 0, background: 'white' }}>
          <button onClick={save} disabled={!categorie || saving} style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: !categorie || saving ? '#C9CFC4' : G.primary, color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
            {saving ? 'Enregistrement…' : machine ? 'Enregistrer les modifications' : 'Ajouter au parc'}
          </button>
        </div>
      </div>
    </div>
  );
}
