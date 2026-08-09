-- Schema do Supabase para o Chá de Fraldas do Ravi
-- Rode este SQL no editor SQL do seu projeto Supabase (Project > SQL Editor).

create table if not exists recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 60),
  mensagem text not null check (char_length(mensagem) between 1 and 280),
  created_at timestamptz default now()
);

create table if not exists votos (
  id uuid primary key default gen_random_uuid(),
  guest_id text not null,
  pergunta_id text not null,
  opcao_id text not null,
  created_at timestamptz default now(),
  unique (guest_id, pergunta_id)
);

alter table recados enable row level security;
alter table votos   enable row level security;

create policy "leitura publica recados" on recados for select using (true);
create policy "insercao publica recados" on recados for insert with check (true);
create policy "leitura publica votos"  on votos  for select using (true);
create policy "insercao publica votos" on votos  for insert with check (true);

-- Habilita o Realtime para o mural de recados (Database > Replication no painel,
-- ou via SQL abaixo caso a publicação supabase_realtime já exista):
alter publication supabase_realtime add table recados;
