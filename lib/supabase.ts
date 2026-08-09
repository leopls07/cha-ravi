import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Chamada de "anon key" nos projetos Supabase antigos e de "publishable key"
// (prefixo sb_publishable_...) nos novos — o painel do projeto mostra o nome
// que vale para a sua conta.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// `null` quando as variáveis de ambiente não estão configuradas — permite que
// o mural/quiz falhem graciosamente em vez de quebrar o build/preview.
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

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
