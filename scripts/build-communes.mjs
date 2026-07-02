/*
 * Génère src/data/communes-10-51.json depuis geo.api.gouv.fr.
 * À relancer uniquement si le découpage communal change.
 *
 *   node scripts/build-communes.mjs
 */
import { writeFileSync } from 'node:fs';

const DEPARTEMENTS = ['10', '51'];

const communes = [];
for (const dep of DEPARTEMENTS) {
  const url = `https://geo.api.gouv.fr/departements/${dep}/communes?fields=nom,code,codesPostaux,centre&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`geo.api.gouv.fr ${res.status} pour dept ${dep}`);
  const list = await res.json();
  for (const c of list) {
    if (!c.centre) continue;
    communes.push({
      nom: c.nom,
      code: c.code,
      cp: c.codesPostaux?.[0] ?? '',
      lat: c.centre.coordinates[1],
      lng: c.centre.coordinates[0],
    });
  }
  console.log(`dept ${dep}: ${list.length} communes`);
}

communes.sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
writeFileSync('src/data/communes-10-51.json', JSON.stringify(communes));
console.log(`total: ${communes.length} communes → src/data/communes-10-51.json`);
