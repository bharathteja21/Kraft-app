-- Run this in the Supabase SQL editor once you create your project.

create table if not exists profiles (
  id uuid references auth.users primary key,
  email text unique,
  plan text default 'free' check (plan in ('free','pro','studio')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table if not exists brand_kits (
  user_id uuid references auth.users primary key,
  logo_text text default 'Kraft',
  primary_color text default '#c9a24b',
  accent_color text default '#f4ede0',
  font text default 'Georgia',
  updated_at timestamptz default now()
);

create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id text not null,
  fields jsonb default '{}',
  music_track_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table brand_kits enable row level security;
alter table projects enable row level security;

create policy "Users manage their own profile" on profiles
  for all using (auth.uid() = id);

create policy "Users manage their own brand kit" on brand_kits
  for all using (auth.uid() = user_id);

create policy "Users manage their own projects" on projects
  for all using (auth.uid() = user_id);
