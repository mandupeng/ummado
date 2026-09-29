import { createPmdClient, createPmdConfig } from '@pmd/core';

export function createUmmadoClient(options?: { isServiceRole?: boolean }) {
  const config = createPmdConfig({
    product: 'ummado',
    monetization: 'ads',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  const key = options?.isServiceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      `Missing Supabase key: ${options?.isServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY'}`
    );
  }

  return createPmdClient(config, {
    auth: { persistSession: false },
  });
}
