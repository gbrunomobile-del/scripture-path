-- PRE-CHECK: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- CHANGE: Initial Manna schema — profiles, reading_progress, completed_days, free_play_history
-- POST-VERIFY: SELECT * FROM profiles LIMIT 1; SELECT * FROM reading_progress LIMIT 1;

create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  provider   text not null default 'email',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table if not exists reading_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  current_day  int not null default 1,
  streak       int not null default 0,
  xp           int not null default 0,
  last_read_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id)
);
alter table reading_progress enable row level security;
create policy "Users read own progress"   on reading_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on reading_progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress" on reading_progress for update using (auth.uid() = user_id);

create table if not exists completed_days (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  day_number   int not null,
  completed_at timestamptz not null default now(),
  unique (user_id, day_number)
);
alter table completed_days enable row level security;
create policy "Users read own completed days"   on completed_days for select using (auth.uid() = user_id);
create policy "Users insert own completed days" on completed_days for insert with check (auth.uid() = user_id);

create table if not exists free_play_history (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book    text not null,
  chapter int not null,
  read_at timestamptz not null default now(),
  unique (user_id, book, chapter)
);
alter table free_play_history enable row level security;
create policy "Users read own free play" on free_play_history for select using (auth.uid() = user_id);
create policy "Users insert own free play" on free_play_history for insert with check (auth.uid() = user_id);
