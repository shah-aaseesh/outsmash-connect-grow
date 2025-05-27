
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  gender text not null check (gender in ('woman', 'man', 'non-binary', 'other')),
  birthdate date not null,
  location text not null,
  bio text not null,
  prompt1 text,
  prompt2 text,
  is_profile_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create photos table
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create interests table (predefined interests)
create table public.interests (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null
);

-- Create profile_interests junction table
create table public.profile_interests (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  interest_id uuid references public.interests(id) on delete cascade not null,
  unique(profile_id, interest_id)
);

-- Create preferences table
create table public.preferences (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  looking_for text[] not null,
  min_age integer not null check (min_age >= 18),
  max_age integer not null check (max_age >= 18),
  distance integer not null check (distance > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create matches table (for future use)
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  profile1_id uuid references public.profiles(id) on delete cascade not null,
  profile2_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'matched', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profile1_id, profile2_id)
);

-- Create messages table (for future use)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read boolean default false
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.photos enable row level security;
alter table public.interests enable row level security;
alter table public.profile_interests enable row level security;
alter table public.preferences enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- Create RLS policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create RLS policies for photos
create policy "Users can view their own photos" on public.photos
  for select using (auth.uid() = profile_id);

create policy "Users can insert their own photos" on public.photos
  for insert with check (auth.uid() = profile_id);

create policy "Users can update their own photos" on public.photos
  for update using (auth.uid() = profile_id);

create policy "Users can delete their own photos" on public.photos
  for delete using (auth.uid() = profile_id);

-- Create RLS policies for interests (public read access)
create policy "Anyone can view interests" on public.interests
  for select using (true);

-- Create RLS policies for profile_interests
create policy "Users can view their own profile interests" on public.profile_interests
  for select using (auth.uid() = profile_id);

create policy "Users can insert their own profile interests" on public.profile_interests
  for insert with check (auth.uid() = profile_id);

create policy "Users can delete their own profile interests" on public.profile_interests
  for delete using (auth.uid() = profile_id);

-- Create RLS policies for preferences
create policy "Users can view their own preferences" on public.preferences
  for select using (auth.uid() = profile_id);

create policy "Users can insert their own preferences" on public.preferences
  for insert with check (auth.uid() = profile_id);

create policy "Users can update their own preferences" on public.preferences
  for update using (auth.uid() = profile_id);

-- Create RLS policies for matches
create policy "Users can view their own matches" on public.matches
  for select using (auth.uid() = profile1_id or auth.uid() = profile2_id);

create policy "Users can insert matches they initiate" on public.matches
  for insert with check (auth.uid() = profile1_id);

create policy "Users can update matches they're part of" on public.matches
  for update using (auth.uid() = profile1_id or auth.uid() = profile2_id);

-- Create RLS policies for messages
create policy "Users can view messages from their matches" on public.messages
  for select using (
    exists (
      select 1 from public.matches 
      where id = match_id 
      and (profile1_id = auth.uid() or profile2_id = auth.uid())
    )
  );

create policy "Users can insert messages to their matches" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.matches 
      where id = match_id 
      and (profile1_id = auth.uid() or profile2_id = auth.uid())
    )
  );

-- Insert predefined interests
insert into public.interests (name) values
  ('travel'),
  ('cycling'),
  ('coffee'),
  ('reading'),
  ('cooking'),
  ('art'),
  ('music'),
  ('movies'),
  ('dogs'),
  ('fitness'),
  ('wine'),
  ('hiking'),
  ('gaming'),
  ('photography'),
  ('fashion');

-- Create storage bucket for user photos
insert into storage.buckets (id, name, public) values ('user-photos', 'user-photos', true);

-- Create storage policy for user photos
create policy "Users can upload their own photos" on storage.objects
  for insert with check (
    bucket_id = 'user-photos' and
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

create policy "Users can view their own photos" on storage.objects
  for select using (
    bucket_id = 'user-photos' and
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

create policy "Users can delete their own photos" on storage.objects
  for delete using (
    bucket_id = 'user-photos' and
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.preferences
  for each row execute procedure public.handle_updated_at();
