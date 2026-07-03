/*
 * Base des exploitations agricoles (SIRENE) — départements 10 + 51.
 *
 *   node scripts/build-farms-db.mjs fetch
 *     → interroge recherche-entreprises.api.gouv.fr et écrit data/farms-10-51.json
 *
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/build-farms-db.mjs push
 *     → upsert le fichier vers la table `farms` (idempotent, relançable)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const DEPARTEMENTS = ['10', '51'];

// Codes NAF agricoles retenus. Ajuster ici puis relancer fetch + push.
const NAF_CODES = {
  '01.11Z': 'Culture de céréales, légumineuses et oléagineux',
  '01.13Z': 'Culture de légumes, melons, racines et tubercules',
  '01.16Z': 'Culture de plantes à fibres (lin, chanvre)',
  '01.19Z': 'Autres cultures non permanentes',
  '01.21Z': 'Culture de la vigne',
  '01.24Z': 'Culture de fruits à pépins et à noyau',
  '01.25Z': 'Culture d’autres fruits',
  '01.30Z': 'Pépinières et autres cultures en pot',
  '01.41Z': 'Élevage de vaches laitières',
  '01.42Z': 'Élevage d’autres bovins et de buffles',
  '01.43Z': 'Élevage de chevaux et d’autres équidés',
  '01.45Z': 'Élevage d’ovins et de caprins',
  '01.46Z': 'Élevage de porcins',
  '01.47Z': 'Élevage de volailles',
  '01.49Z': 'Élevage d’autres animaux',
  '01.50Z': 'Culture et élevage associés (polyculture-élevage)',
  '01.61Z': 'Travaux agricoles (ETA)',
  '01.62Z': 'Activités de soutien à la production animale',
  '01.63Z': 'Traitement primaire des récoltes',
  '01.64Z': 'Traitement des semences',
};

const API = 'https://recherche-entreprises.api.gouv.fr/search';
const PER_PAGE = 25;
const MAX_RESULTS = 10000; // plafond de pagination de l'API
const THROTTLE_MS = 160;   // limite API : 7 req/s

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function apiGet(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams(params)}`;
  await sleep(THROTTLE_MS);
  const res = await fetch(url);
  if (res.status === 429 || res.status >= 500) {
    if (attempt > 5) throw new Error(`API ${res.status} après 5 tentatives : ${url}`);
    await sleep(2000 * attempt);
    return apiGet(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`API ${res.status} : ${url}`);
  return res.json();
}

/* Paginne une requête (activite_principale + departement OU code_postal)
   et pousse les établissements retenus dans `out` (Map siret → farm). */
async function collect(out, naf, scope) {
  const base = {
    activite_principale: naf,
    etat_administratif: 'A',
    minimal: 'true',
    include: 'matching_etablissements',
    limite_matching_etablissements: '100',
    per_page: String(PER_PAGE),
    ...scope,
  };
  const first = await apiGet({ ...base, page: '1' });

  if (first.total_results > MAX_RESULTS && scope.departement) {
    // Trop de résultats pour la pagination : on redécoupe par code postal.
    console.log(`  ${naf} dept ${scope.departement}: ${first.total_results} résultats > ${MAX_RESULTS}, découpage par code postal`);
    const communes = JSON.parse(readFileSync('src/data/communes-10-51.json', 'utf8'));
    const cps = [...new Set(communes.filter(c => c.code.startsWith(scope.departement)).map(c => c.cp))].sort();
    for (const cp of cps) await collect(out, naf, { code_postal: cp });
    return;
  }
  if (first.total_results > MAX_RESULTS) {
    console.warn(`  ⚠ ${naf} ${JSON.stringify(scope)}: ${first.total_results} résultats, au-delà du plafond — résultats tronqués`);
  }

  let page = 1;
  let data = first;
  while (true) {
    for (const r of data.results) {
      for (const etab of r.matching_etablissements ?? []) {
        if (etab.etat_administratif !== 'A') continue;
        if (etab.activite_principale !== naf) continue;
        if (!DEPARTEMENTS.some(d => (etab.commune ?? '').startsWith(d))) continue;
        if (out.has(etab.siret)) continue;
        out.set(etab.siret, {
          siret: etab.siret,
          siren: r.siren,
          nom: r.nom_complet,
          naf,
          naf_label: NAF_CODES[naf],
          adresse: etab.adresse ?? null,
          code_postal: etab.code_postal ?? null,
          commune: etab.libelle_commune ?? null,
          code_insee: etab.commune ?? null,
          lat: etab.latitude ? Number(etab.latitude) : null,
          lng: etab.longitude ? Number(etab.longitude) : null,
          tranche_effectif: etab.tranche_effectif_salarie ?? null,
          date_creation: etab.date_creation ?? null,
          forme_juridique: r.nature_juridique ?? null,
        });
      }
    }
    if (page >= data.total_pages || page * PER_PAGE >= MAX_RESULTS) break;
    page += 1;
    data = await apiGet({ ...base, page: String(page) });
  }
}

async function cmdFetch() {
  const out = new Map();
  for (const dep of DEPARTEMENTS) {
    for (const naf of Object.keys(NAF_CODES)) {
      const before = out.size;
      await collect(out, naf, { departement: dep });
      console.log(`${naf} dept ${dep}: +${out.size - before} établissements (total ${out.size})`);
    }
  }
  mkdirSync('data', { recursive: true });
  const farms = [...out.values()];
  writeFileSync('data/farms-10-51.json', JSON.stringify(farms));
  const geocoded = farms.filter(f => f.lat != null && f.lng != null).length;
  console.log(`\n${farms.length} établissements écrits dans data/farms-10-51.json (${geocoded} géolocalisés)`);
}

async function cmdPush() {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis pour push.');
    process.exit(1);
  }
  const supabase = createClient(url, key);
  const farms = JSON.parse(readFileSync('data/farms-10-51.json', 'utf8'));
  for (let i = 0; i < farms.length; i += 500) {
    const chunk = farms.slice(i, i + 500);
    const { error } = await supabase.from('farms').upsert(chunk, { onConflict: 'siret' });
    if (error) throw new Error(`upsert lot ${i / 500 + 1}: ${error.message}`);
    console.log(`${Math.min(i + 500, farms.length)}/${farms.length}`);
  }
  console.log('Push terminé.');
}

const cmd = process.argv[2];
if (cmd === 'fetch') await cmdFetch();
else if (cmd === 'push') await cmdPush();
else {
  console.error('Usage: node scripts/build-farms-db.mjs fetch|push');
  process.exit(1);
}
