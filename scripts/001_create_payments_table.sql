-- Payments table for Base Pay purchases of the v1.1 Full Version.
-- Stores the payer email + on-chain transaction hash so the user can
-- recover their download link later by re-entering their tx hash.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  tx_hash text not null,
  amount text not null default '0.01',
  recipient text,
  network text not null default 'base-mainnet',
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

-- Ensure we only store each transaction hash once (case-insensitive).
create unique index if not exists payments_tx_hash_unique_idx
  on public.payments (lower(tx_hash));

-- Lock the table down.
alter table public.payments enable row level security;
