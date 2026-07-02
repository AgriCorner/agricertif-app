import { supabase } from './supabase';

/* Couche d'accès aux données Supabase. Toutes les fonctions supposent
   isSupabaseConfigured === true (l'UI les court-circuite en mode démo). */

export async function fetchFarmsByInsee(codes) {
  const { data, error } = await supabase
    .from('farms')
    .select('siret, nom, naf, naf_label, adresse, code_postal, commune, code_insee, lat, lng, tranche_effectif')
    .in('code_insee', codes);
  if (error) throw error;
  return data;
}

/* Statuts de toutes les fiches (petite table) — pour colorer les marqueurs. */
export async function fetchStatuts() {
  const { data, error } = await supabase.from('fiches_clients').select('siret, statut');
  if (error) throw error;
  return Object.fromEntries(data.map(f => [f.siret, f.statut]));
}

export async function fetchFiche(siret) {
  const [farmRes, ficheRes, parcRes] = await Promise.all([
    supabase.from('farms').select('*').eq('siret', siret).maybeSingle(),
    supabase.from('fiches_clients').select('*, editor:profiles!fiches_clients_updated_by_fkey(nom)').eq('siret', siret).maybeSingle(),
    supabase.from('parc_materiel').select('*').eq('siret', siret).order('created_at'),
  ]);
  if (farmRes.error) throw farmRes.error;
  if (ficheRes.error) throw ficheRes.error;
  if (parcRes.error) throw parcRes.error;
  return { farm: farmRes.data, fiche: ficheRes.data, parc: parcRes.data };
}

export async function upsertFiche(siret, fields) {
  const { error } = await supabase.from('fiches_clients').upsert({ siret, ...fields }, { onConflict: 'siret' });
  if (error) throw error;
}

export async function addMachine(machine) {
  const { error } = await supabase.from('parc_materiel').insert(machine);
  if (error) throw error;
}

export async function updateMachine(id, fields) {
  const { error } = await supabase.from('parc_materiel').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteMachine(id) {
  const { error } = await supabase.from('parc_materiel').delete().eq('id', id);
  if (error) throw error;
}
