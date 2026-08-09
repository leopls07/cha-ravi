# Chá de Fraldas do Ravi 💛

Convite digital mobile-first para o Chá de Fraldas do Ravi, feito em Next.js (App Router) +
TypeScript + Tailwind + Framer Motion. Inclui contagem regressiva, RSVP via WhatsApp, geração de
Pix (QR Code + copia-e-cola) no navegador, mural de recados e quiz — os dois últimos com Supabase.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros scripts úteis:

```bash
npm run test        # roda os testes (Vitest) do gerador de Pix
npm run test:watch  # testes em modo watch
npm run lint         # eslint
npm run build         # build de produção
```

## Como editar textos, datas e valores

Tudo o que aparece no site — nome do bebê, data/hora/local, contatos, chave Pix, listas de
presente e valores de "Outros presentes" — está centralizado em [`lib/event.ts`](lib/event.ts).
Edite esse arquivo; não é necessário mexer nos componentes.

Itens marcados com `// TODO` ainda precisam de confirmação antes de publicar (ver seção
"Pendências" abaixo).

## Como criar o projeto no Supabase

O mural de recados e o quiz usam o Supabase apenas para leitura/inserção pública de duas tabelas.

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso
   cria as tabelas `recados` e `votos`, ativa Row Level Security com políticas de leitura e
   inserção públicas, e habilita o Realtime na tabela `recados`.
3. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.example` para `.env.local` e preencha:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

Sem essas variáveis configuradas, o site inteiro continua funcionando normalmente — apenas o
mural e o quiz mostram uma mensagem de "indisponível no momento".

## Deploy na Vercel

1. Suba o repositório para o GitHub (ou outro provedor suportado).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. A Vercel detecta o Next.js automaticamente (sem configuração adicional).

## Estrutura

```
app/                 rotas do App Router (layout, página única, OG image, ícones)
components/screens/  uma tela por arquivo (Envelope, Capa, Detalhes, RSVP, Presentes, Pix, Mural, Quiz)
components/ui/       componentes de UI reutilizáveis
components/illustrations/  ilustrações em SVG (sem imagens externas)
lib/                 dados do evento, geração de Pix, helpers (calendário, WhatsApp, Supabase...)
supabase/schema.sql  schema SQL do Supabase
```

## Pendências antes de publicar

- [ ] Valores reais dos itens em "Outros presentes" (`lib/event.ts`)
- [ ] Cidade cadastrada na conta Pix da Emilly (campo 60 do BR Code, `lib/event.ts`)
- [ ] Número de WhatsApp que vai receber as confirmações (`WHATSAPP_RSVP` em `lib/event.ts`)
- [ ] Nomes e telefones dos contatos/anfitriões (`CONTATOS` em `lib/event.ts`)
- [ ] Se haverá dress code ou tema de roupa
- [ ] Fotos (ultrassom / ensaio) — o site já funciona sem elas; se surgirem depois, adicione em
      `/public` e troque as ilustrações da capa
