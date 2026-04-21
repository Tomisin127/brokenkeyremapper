-- Payments table for Base Pay purchases of the v1.1 Full Version.
-- Stores the payer email (collected via Base Pay payerInfo) + on-chain
-- transaction hash so the user can recover their download link later.

create extension if not exists "pgcrypto";

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

-- Allow the anon client to INSERT a completed payment. This is safe because
-- we always verify the payment on-chain (via getPaymentStatus) before calling
-- insert, and the tx hash is uniquely constrained.
drop policy if exists "anon can insert payments" on public.payments;
create policy "anon can insert payments"
  on public.payments
  for insert
  to anon, authenticated
  with check (true);

-- We deliberately do NOT grant SELECT on this table to anon so that emails
-- cannot be scraped with the public anon key. Instead, expose a narrow RPC
-- that only returns a boolean for a given tx hash.

drop function if exists public.verify_payment(text);
create or replace function public.verify_payment(tx_hash_input text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.payments
    where lower(tx_hash) = lower(tx_hash_input)
  );
$$;

grant execute on function public.verify_payment(text) to anon, authenticated;
