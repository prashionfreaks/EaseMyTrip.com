-- ─── Storage Bucket (do this in Supabase Dashboard) ──────────────────────────
-- 1. Go to Storage in your Supabase project dashboard
-- 2. Create a new bucket named: trip-photos
-- 3. Set it to PUBLIC (so photo URLs work without signed tokens)
-- 4. Add this policy in Storage > Policies > trip-photos:
--    Name: "Authenticated users can upload"
--    Allowed operation: INSERT
--    Policy: (auth.uid() IS NOT NULL)
--    Name: "Anyone can view photos"
--    Allowed operation: SELECT
--    Policy: true
--    Name: "Uploader can delete own photos"
--    Allowed operation: DELETE
--    Policy: (auth.uid()::text = (storage.foldername(name))[1])
-- ────────────────────────────────────────────────────────────────────────────

-- TripSync Supabase Schema v2
-- Run this in Supabase SQL Editor

-- ─── Step 1: Create tables (no policies yet) ────────────────────────────────

create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  color       text default '#2563eb',
  created_at  timestamptz default now()
);

create table if not exists public.trips (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  destination  text not null,
  status       text default 'planning'
               check (status in ('planning','voting','confirmed','completed')),
  created_by   uuid references public.profiles(id),
  data         jsonb not null default '{}'::jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists public.trip_members (
  id        uuid default gen_random_uuid() primary key,
  trip_id   uuid references public.trips(id) on delete cascade,
  user_id   uuid references public.profiles(id) on delete cascade,
  role      text default 'member' check (role in ('organizer','member')),
  color     text default '#2563eb',
  joined_at timestamptz default now(),
  unique (trip_id, user_id)
);

create table if not exists public.trip_invites (
  id           uuid default gen_random_uuid() primary key,
  trip_id      uuid references public.trips(id) on delete cascade,
  invited_by   uuid references public.profiles(id),
  email        text,
  invite_code  text unique default encode(gen_random_bytes(8), 'hex'),
  status       text default 'pending' check (status in ('pending','accepted','expired')),
  expires_at   timestamptz default (now() + interval '7 days'),
  created_at   timestamptz default now()
);

-- ─── Step 2: Enable RLS on all tables ───────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_invites enable row level security;

-- ─── Step 3: Policies — profiles ────────────────────────────────────────────

drop policy if exists "Public profiles are viewable by authenticated users" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select using (auth.uid() is not null);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ─── Step 4: Policies — trips (references trip_members, so must come after) ─

drop policy if exists "Trip members can view trips" on public.trips;
drop policy if exists "Trip organizers can update trips" on public.trips;
drop policy if exists "Authenticated users can insert trips" on public.trips;
drop policy if exists "Trip organizers can delete trips" on public.trips;

create policy "Trip members can view trips"
  on public.trips for select using (
    exists (select 1 from public.trip_members where trip_id = trips.id and user_id = auth.uid())
  );
create policy "Trip organizers can update trips"
  on public.trips for update using (
    exists (select 1 from public.trip_members where trip_id = trips.id and user_id = auth.uid() and role = 'organizer')
  );
create policy "Authenticated users can insert trips"
  on public.trips for insert with check (auth.uid() is not null);
create policy "Trip organizers can delete trips"
  on public.trips for delete using (created_by = auth.uid());

-- ─── Step 5: Policies — trip_members ────────────────────────────────────────

drop policy if exists "Members can view trip_members for their trips" on public.trip_members;
drop policy if exists "Organizers can insert trip_members" on public.trip_members;
drop policy if exists "Organizers can delete trip_members" on public.trip_members;

create policy "Members can view trip_members for their trips"
  on public.trip_members for select using (
    exists (select 1 from public.trip_members tm where tm.trip_id = trip_members.trip_id and tm.user_id = auth.uid())
  );
create policy "Organizers can insert trip_members"
  on public.trip_members for insert with check (
    auth.uid() = user_id or
    exists (select 1 from public.trip_members where trip_id = trip_members.trip_id and user_id = auth.uid() and role = 'organizer')
  );
create policy "Organizers can delete trip_members"
  on public.trip_members for delete using (
    user_id = auth.uid() or
    exists (select 1 from public.trip_members where trip_id = trip_members.trip_id and user_id = auth.uid() and role = 'organizer')
  );

-- ─── Step 6: Policies — trip_invites ────────────────────────────────────────

drop policy if exists "Trip members can view invites" on public.trip_invites;
drop policy if exists "Trip organizers can create invites" on public.trip_invites;

create policy "Trip members can view invites"
  on public.trip_invites for select using (
    exists (select 1 from public.trip_members where trip_id = trip_invites.trip_id and user_id = auth.uid())
  );
create policy "Trip organizers can create invites"
  on public.trip_invites for insert with check (
    exists (select 1 from public.trip_members where trip_id = trip_invites.trip_id and user_id = auth.uid() and role = 'organizer')
  );

-- ─── Step 7: Functions and triggers ─────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, color)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (array['#2563eb','#7c3aed','#0891b2','#059669','#d97706','#dc2626','#db2777'])[floor(random()*7)+1]
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trips_updated_at on public.trips;
create trigger trips_updated_at before update on public.trips
  for each row execute procedure public.update_updated_at();

-- ─── Step 8: Enable Realtime ─────────────────────────────────────────────────

alter publication supabase_realtime add table public.trips;
alter publication supabase_realtime add table public.trip_members;
