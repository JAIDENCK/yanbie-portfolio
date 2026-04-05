-- ============================================================
-- Yanbie Portfolio — Supabase SQL Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Profile table (single row)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Yanbie',
  tagline text not null default 'Bringing characters to life, one voice at a time.',
  about text not null default 'Hi! I''m Yanbie, a voice actress passionate about storytelling through sound.',
  email text not null default '',
  photo_url text,
  socials jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Insert default profile row if empty
insert into profile (name, tagline, about, email, socials)
select 'Yanbie', 'Bringing characters to life, one voice at a time.', 'Hi! I''m Yanbie, a voice actress passionate about storytelling through sound.', '', '{}'::jsonb
where not exists (select 1 from profile);

-- Demos table
create table if not exists demos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default 'Demo',
  audio_url text not null,
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- Character ranges table
create table if not exists character_ranges (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text not null default '',
  audio_url text not null,
  order_index integer not null default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS
alter table profile enable row level security;
alter table demos enable row level security;
alter table character_ranges enable row level security;

-- Public can READ everything
create policy "Public read profile" on profile for select using (true);
create policy "Public read demos" on demos for select using (true);
create policy "Public read ranges" on character_ranges for select using (true);

-- Only authenticated users (Yanbie) can WRITE
create policy "Auth write profile" on profile for all using (auth.role() = 'authenticated');
create policy "Auth write demos" on demos for all using (auth.role() = 'authenticated');
create policy "Auth write ranges" on character_ranges for all using (auth.role() = 'authenticated');

-- ============================================================
-- Storage Buckets
-- Run these separately if the SQL editor supports it,
-- otherwise create them manually in Storage > New Bucket
-- ============================================================

-- Create storage buckets (public)
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage policies: anyone can read, only auth can upload
create policy "Public read audio" on storage.objects for select using (bucket_id = 'audio');
create policy "Auth upload audio" on storage.objects for insert with check (bucket_id = 'audio' and auth.role() = 'authenticated');
create policy "Auth update audio" on storage.objects for update using (bucket_id = 'audio' and auth.role() = 'authenticated');
create policy "Auth delete audio" on storage.objects for delete using (bucket_id = 'audio' and auth.role() = 'authenticated');

create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Auth upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Auth update images" on storage.objects for update using (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Auth delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
