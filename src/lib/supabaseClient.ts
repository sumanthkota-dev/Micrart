import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
  db: { schema: 'portfolio' },
  auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
}
);

// export const fromSchema = (table: string) => supabase.from(`portfoio.${table}`);