import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// `null` quando as variáveis de ambiente não estão configuradas — permite que
// o mural/quiz falhem graciosamente em vez de quebrar o build/preview.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type Recado = {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
};

export type Voto = {
  id: string;
  guest_id: string;
  pergunta_id: string;
  opcao_id: string;
  created_at: string;
};
