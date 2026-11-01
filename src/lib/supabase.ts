import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente do Supabase usado pelas telas (lado do navegador).
// As duas variáveis vêm das Environment Variables da Vercel
// (ou do arquivo .env.local quando rodando no seu computador).

let cliente: SupabaseClient | null = null;

export function variaveisConfiguradas(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function supabase(): SupabaseClient {
  if (cliente) return cliente;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !chave) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas. Veja o README.",
    );
  }
  cliente = createClient(url, chave);
  return cliente;
}
