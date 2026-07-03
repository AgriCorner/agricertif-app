-- ============================================================
-- AgriCertif — schéma Supabase v1
-- À exécuter dans le SQL Editor du dashboard Supabase.
-- ============================================================

-- PROFILES ----------------------------------------------------
-- Un profil par utilisateur auth, créé automatiquement à l'inscription.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null default '',
  role text not null default 'commercial' check (role in ('admin','commercial')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nom)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom', split_part(new.email,'@',1)));
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- FARMS -------------------------------------------------------
-- Référentiel SIRENE en lecture seule, alimenté par
-- scripts/build-farms-db.mjs avec la clé service_role.
create table public.farms (
  siret text primary key,
  siren text not null,
  nom text not null,
  naf text not null,
  naf_label text,
  adresse text,
  code_postal text,
  commune text,
  code_insee text,
  lat double precision,
  lng double precision,
  tranche_effectif text,
  date_creation date,
  forme_juridique text
);
create index farms_code_insee_idx on public.farms (code_insee);

-- FICHES CLIENTS ----------------------------------------------
create table public.fiches_clients (
  siret text primary key references public.farms(siret),
  statut text not null default 'prospect' check (statut in ('prospect','client')),
  contact_nom text,
  telephone text,
  email text,
  notes text not null default '',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PARC MATERIEL -----------------------------------------------
create table public.parc_materiel (
  id uuid primary key default gen_random_uuid(),
  siret text not null references public.fiches_clients(siret) on delete cascade,
  categorie text not null,
  sous_categorie text,
  marque text,
  modele text,
  annee int,
  puissance int,
  largeur numeric,
  etat text,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index parc_siret_idx on public.parc_materiel (siret);

-- AUDIT -------------------------------------------------------
create or replace function public.set_audit_fields()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  if tg_op = 'INSERT' then
    new.created_at := now();
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
  else
    new.created_at := old.created_at;
    new.created_by := old.created_by;
  end if;
  return new;
end $$;

create trigger fiches_audit before insert or update on public.fiches_clients
  for each row execute function public.set_audit_fields();
create trigger parc_audit before insert or update on public.parc_materiel
  for each row execute function public.set_audit_fields();

-- RLS ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.fiches_clients enable row level security;
alter table public.parc_materiel enable row level security;

create policy "profiles read all" on public.profiles
  for select to authenticated using (true);
-- Un utilisateur peut modifier son nom mais pas son propre rôle.
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));

-- farms : lecture seule pour les commerciaux ; le seed passe par
-- service_role qui bypasse RLS — aucune policy insert/update.
create policy "farms read" on public.farms
  for select to authenticated using (true);

-- fiches : partagées entre tous les commerciaux ; pas de delete en v1
-- (suppression via le dashboard par un admin si besoin).
create policy "fiches read"   on public.fiches_clients for select to authenticated using (true);
create policy "fiches insert" on public.fiches_clients for insert to authenticated with check (true);
create policy "fiches update" on public.fiches_clients for update to authenticated using (true);

create policy "parc read"   on public.parc_materiel for select to authenticated using (true);
create policy "parc insert" on public.parc_materiel for insert to authenticated with check (true);
create policy "parc update" on public.parc_materiel for update to authenticated using (true);
create policy "parc delete" on public.parc_materiel for delete to authenticated using (true);

-- ADMINS ------------------------------------------------------
-- Après création des comptes dans Authentication → Users :
--   update public.profiles set role = 'admin' where id = '<uuid-du-compte>';
