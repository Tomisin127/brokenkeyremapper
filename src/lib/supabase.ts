import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfacing a clear error in dev; at runtime we still create a client that
  // will throw on use so the UI can show a friendly message.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars. " +
      "Expected VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_* equivalents.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: { persistSession: false },
});

export type PaymentRecord = {
  id: string;
  email: string;
  tx_hash: string;
  amount: string;
  recipient: string | null;
  network: string;
  status: string;
  created_at: string;
};
