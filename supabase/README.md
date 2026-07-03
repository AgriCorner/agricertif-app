# Mise en place Supabase (backend AgriCertif)

L'app fonctionne sans Supabase en **mode démo** (pas de login, pas de données).
Pour activer la carte des exploitations et les fiches clients partagées :

## 1. Créer le projet

1. Créer un projet sur [supabase.com](https://supabase.com) (région EU de préférence).
2. Récupérer dans **Settings → API** : la *Project URL*, la clé *anon* et la clé *service_role*.

## 2. Créer les tables

Dans **SQL Editor**, coller et exécuter le contenu de [`schema.sql`](./schema.sql).

## 3. Charger la base des exploitations (SIRENE, depts 10 + 51)

```bash
# 1. Récupère ~24 000 exploitations agricoles depuis l'API publique
#    recherche-entreprises.api.gouv.fr (~15 min, écrit data/farms-10-51.json)
node scripts/build-farms-db.mjs fetch

# 2. Pousse vers la table farms (relançable pour rafraîchir la base)
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
node scripts/build-farms-db.mjs push
```

Les codes NAF retenus sont listés en tête de `scripts/build-farms-db.mjs`.

## 4. Créer les comptes commerciaux

Dashboard → **Authentication → Users → Add user** (cocher *Auto Confirm User*).
Le profil est créé automatiquement. Pour promouvoir un admin :

```sql
update public.profiles set role = 'admin' where id = '<uuid du compte>';
-- et pour renseigner le nom affiché :
update public.profiles set nom = 'Prénom Nom' where id = '<uuid du compte>';
```

## 5. Configurer l'app

- **En local** : copier `.env.example` vers `.env.local` et remplir URL + clé anon.
- **En prod (GitHub Pages)** : ajouter les secrets de dépôt `VITE_SUPABASE_URL`
  et `VITE_SUPABASE_ANON_KEY` (Settings → Secrets and variables → Actions).
  Le workflow de déploiement les injecte au build.

La clé *anon* est publique par design : la sécurité repose sur les policies RLS
du schéma (seuls les comptes authentifiés lisent/écrivent). La clé
*service_role* ne doit jamais être mise dans l'app ni dans un secret de build —
elle ne sert qu'au script de seed, en local.
