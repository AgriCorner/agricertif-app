import { useState, useEffect, useCallback } from 'react';
import { G, Ic, BackHeader } from '../../ui/kit';
import { EQUIPMENT_CATEGORIES } from '../../data/equipmentData';
import { useAuth } from '../auth/useAuth';
import { fetchFiche, upsertFiche, deleteMachine } from '../../lib/api';
import MachineForm from './MachineForm';

const TRANCHES_EFFECTIF = {
  NN: null, '00': '0 salarié', '01': '1 ou 2 salariés', '02': '3 à 5 salariés',
  '03': '6 à 9 salariés', 11: '10 à 19 salariés', 12: '20 à 49 salariés',
  21: '50 à 99 salariés', 22: '100 à 199 salariés',
};
const FORMES_JURIDIQUES = {
  1000: 'Entrepreneur individuel', 5499: 'SARL', 5599: 'SA', 5710: 'SAS', 5720: 'SASU',
  6533: 'GAEC', 6597: 'SCEA', 6598: 'EARL', 6599: 'Société civile d’exploitation',
};

const cardStyle = { background: 'white', borderRadius: 13, padding: '14px 16px', marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' };
const sectionLabel = { fontSize: 10, fontWeight: 700, color: G.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${G.border}`, fontSize: 14, outline: 'none', background: '#FBFAF7' };

function findCat(id) { return EQUIPMENT_CATEGORIES.find(c => c.id === id); }
function findSub(catId, subId) { return findCat(catId)?.subcategories?.find(s => s.id === subId); }

export default function FicheClientScreen({ siret, onBack }) {
  const { demo } = useAuth();
  const [data, setData] = useState(null);      // { farm, fiche, parc }
  const [error, setError] = useState(null);
  const [editContact, setEditContact] = useState(false);
  const [contactDraft, setContactDraft] = useState({});
  const [machineForm, setMachineForm] = useState(null); // null | 'new' | machine
  const [saving, setSaving] = useState(false);

  const reload = useCallback(() => {
    if (demo) return;
    fetchFiche(siret).then(setData).catch(e => setError(e.message));
  }, [siret, demo]);

  useEffect(reload, [reload]);

  if (demo) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg }}>
        <BackHeader title="Fiche client" sub="Prospection" onBack={onBack} />
        <div style={{ padding: 20, fontSize: 13, color: G.muted }}>Mode démo — Supabase non configuré.</div>
      </div>
    );
  }

  const farm = data?.farm;
  const fiche = data?.fiche;
  const parc = data?.parc ?? [];
  const statut = fiche?.statut ?? null;

  const setStatut = async (s) => {
    if (saving || s === statut || s === null) return;
    setSaving(true);
    try { await upsertFiche(siret, { statut: s }); reload(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const startEditContact = () => {
    setContactDraft({
      contact_nom: fiche?.contact_nom ?? '', telephone: fiche?.telephone ?? '',
      email: fiche?.email ?? '', notes: fiche?.notes ?? '',
    });
    setEditContact(true);
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      await upsertFiche(siret, { statut: statut ?? 'prospect', ...contactDraft });
      setEditContact(false);
      reload();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const removeMachine = async (m) => {
    if (!window.confirm(`Supprimer ${m.marque ?? ''} ${m.modele ?? ''} du parc ?`)) return;
    try { await deleteMachine(m.id); reload(); }
    catch (e) { setError(e.message); }
  };

  const statutChip = (value, label, color, bg) => {
    const active = statut === value;
    return (
      <button key={label} onClick={() => setStatut(value)} disabled={saving} style={{ flex: 1, padding: '9px 0', borderRadius: 10, cursor: value ? 'pointer' : 'default', border: `1.5px solid ${active ? color : '#DDD'}`, background: active ? bg : 'white' }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: active ? color : '#BBB' }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: G.bg, overflow: 'hidden' }}>
      <BackHeader title={farm?.nom ?? '…'} sub="Fiche client" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 40px' }}>
        {error && (
          <div style={{ ...cardStyle, background: '#FDECEA', color: G.red, fontSize: 12, fontWeight: 700 }}>{error}</div>
        )}

        {/* Identité SIRENE */}
        <div style={cardStyle}>
          <div style={sectionLabel}>Identité (SIRENE)</div>
          {farm ? (
            <>
              {[
                ['Adresse', [farm.adresse].filter(Boolean).join('')],
                ['SIRET', farm.siret, true],
                ['Activité', farm.naf_label ? `${farm.naf_label} (${farm.naf})` : farm.naf],
                ['Forme juridique', FORMES_JURIDIQUES[farm.forme_juridique] ?? farm.forme_juridique],
                ['Effectif', TRANCHES_EFFECTIF[farm.tranche_effectif] ?? null],
                ['Création', farm.date_creation ? new Date(farm.date_creation).toLocaleDateString('fr-FR') : null],
              ].filter(([, v]) => v).map(([l, v, mono]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '5px 0' }}>
                  <span style={{ fontSize: 12, color: G.muted, flexShrink: 0 }}>{l}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#222', textAlign: 'right', fontFamily: mono ? 'monospace' : undefined }}>{v}</span>
                </div>
              ))}
            </>
          ) : <div style={{ fontSize: 12, color: G.muted }}>Chargement…</div>}
        </div>

        {/* Statut */}
        <div style={cardStyle}>
          <div style={sectionLabel}>Statut</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {statutChip(null, 'À qualifier', '#8A9086', '#F0F1EF')}
            {statutChip('prospect', 'Prospect', G.orange, '#FBF0E7')}
            {statutChip('client', 'Client', G.primary, '#EBF4E1')}
          </div>
        </div>

        {/* Contact */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ ...sectionLabel, marginBottom: 0 }}>Contact & notes</div>
            {!editContact && (
              <button onClick={startEditContact} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                <Ic n="edit" s={16} c={G.primary} />
              </button>
            )}
          </div>
          {editContact ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
              <input style={inputStyle} placeholder="Nom du contact" value={contactDraft.contact_nom} onChange={e => setContactDraft(d => ({ ...d, contact_nom: e.target.value }))} />
              <input style={inputStyle} type="tel" placeholder="Téléphone" value={contactDraft.telephone} onChange={e => setContactDraft(d => ({ ...d, telephone: e.target.value }))} />
              <input style={inputStyle} type="email" placeholder="Email" value={contactDraft.email} onChange={e => setContactDraft(d => ({ ...d, email: e.target.value }))} />
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Notes (matériel recherché, historique, contexte…)" value={contactDraft.notes} onChange={e => setContactDraft(d => ({ ...d, notes: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setEditContact(false)} style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1.5px solid ${G.border}`, background: 'white', fontSize: 13, fontWeight: 700, color: G.muted, cursor: 'pointer' }}>Annuler</button>
                <button onClick={saveContact} disabled={saving} style={{ flex: 2, padding: '11px 0', borderRadius: 10, border: 'none', background: G.primary, color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              {(fiche?.contact_nom || fiche?.telephone || fiche?.email || fiche?.notes) ? (
                <>
                  {fiche.contact_nom && <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{fiche.contact_nom}</div>}
                  {fiche.telephone && (
                    <a href={`tel:${fiche.telephone}`} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 7, fontSize: 13, fontWeight: 600, color: G.primary, textDecoration: 'none' }}>
                      <Ic n="phone" s={14} c={G.primary} />{fiche.telephone}
                    </a>
                  )}
                  {fiche.email && (
                    <a href={`mailto:${fiche.email}`} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, fontSize: 13, fontWeight: 600, color: G.primary, textDecoration: 'none' }}>
                      <Ic n="mail" s={14} c={G.primary} />{fiche.email}
                    </a>
                  )}
                  {fiche.notes && <div style={{ marginTop: 9, fontSize: 12.5, color: '#444', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{fiche.notes}</div>}
                </>
              ) : (
                <div style={{ fontSize: 12, color: G.muted }}>Aucune information de contact — appuyez sur ✎ pour compléter.</div>
              )}
            </div>
          )}
        </div>

        {/* Parc matériel */}
        <div style={cardStyle}>
          <div style={sectionLabel}>Parc matériel ({parc.length})</div>
          {parc.map(m => {
            const cat = findCat(m.categorie);
            const sub = findSub(m.categorie, m.sous_categorie);
            const details = [m.annee, m.puissance ? `${m.puissance} ch` : null, m.largeur ? `${m.largeur} m` : null].filter(Boolean).join(' · ');
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderBottom: '1px solid #F2F2EE' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#EBF4E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ic n={cat?.icon ?? 'truck'} s={21} c={G.primary} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }} onClick={() => setMachineForm(m)}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#111' }}>{[m.marque, m.modele].filter(Boolean).join(' ') || (sub?.label ?? cat?.label ?? m.categorie)}</div>
                  <div style={{ fontSize: 11, color: G.muted, marginTop: 2 }}>{[sub?.label ?? cat?.label, details, m.etat].filter(Boolean).join(' · ')}</div>
                </div>
                <button onClick={() => removeMachine(m)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, flexShrink: 0 }}>
                  <Ic n="trash" s={15} c="#C4C8C4" />
                </button>
              </div>
            );
          })}
          {parc.length === 0 && <div style={{ fontSize: 12, color: G.muted, marginBottom: 4 }}>Aucune machine recensée.</div>}
          <button onClick={() => setMachineForm('new')} style={{ width: '100%', marginTop: 12, padding: '11px 0', borderRadius: 10, border: `1.5px dashed ${G.primary}`, background: '#F8FBF3', color: G.primary, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <Ic n="plus" s={15} c={G.primary} /> Ajouter une machine
          </button>
        </div>

        {fiche?.updated_at && (
          <div style={{ fontSize: 11, color: G.muted, textAlign: 'center', marginTop: 4 }}>
            Modifié{fiche.editor?.nom ? ` par ${fiche.editor.nom}` : ''} le {new Date(fiche.updated_at).toLocaleDateString('fr-FR')} à {new Date(fiche.updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {machineForm && (
        <MachineForm
          siret={siret}
          statut={statut}
          machine={machineForm === 'new' ? null : machineForm}
          onClose={() => setMachineForm(null)}
          onSaved={() => { setMachineForm(null); reload(); }}
        />
      )}
    </div>
  );
}
