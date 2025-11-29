-- Run this in the Supabase SQL Editor

create table tax_rates (
  zip_code text primary key,
  state text,
  city text,
  combined_rate float
);

-- Optional: Enable Row Level Security (RLS) if you want to restrict access
-- alter table tax_rates enable row level security;
-- create policy "Public Read Access" on tax_rates for select using (true);
