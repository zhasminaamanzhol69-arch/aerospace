create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(trim(comment)) between 2 and 500),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "read own reviews"
  on public.reviews for select
  using (auth.uid() = user_id);

create policy "insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);
