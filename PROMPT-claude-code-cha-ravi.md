# PROMPT PARA O CLAUDE CODE — Site do Chá de Fraldas do Ravi

> Cole este arquivo inteiro no Claude Code (ou rode `claude` na pasta vazia e cole o conteúdo).

---

## 1. Objetivo

Construir um **site de convite digital** para o Chá de Fraldas do Ravi, feito para ser aberto **no celular** a partir de um link enviado no WhatsApp. O convidado deve conseguir, em poucos toques:

1. Abrir o convite e ver data, hora e local
2. Confirmar (ou recusar) presença
3. Ver sugestões de presente
4. Presentear via **Pix**, com **QR Code e código copia-e-cola gerados no navegador**
5. Deixar um recado no mural e responder um quiz divertido

**Deploy:** Vercel.

---

## 2. Stack obrigatória

- **Next.js 14+ (App Router)** + **TypeScript**
- **Tailwind CSS**
- **Framer Motion** para transições entre telas e microanimações
- **`qrcode`** (npm) ou `qrcode.react` para gerar o QR do Pix no client
- **Supabase** (`@supabase/supabase-js`) — **usado APENAS para o mural de recados e o quiz**. Nada mais.
- Sem imagens externas: toda a ilustração é **SVG/CSS inline** (ver seção 4)
- Tudo em **pt-BR**

Estrutura sugerida:

```
app/
  layout.tsx
  page.tsx                 # orquestrador das telas
  globals.css
components/
  screens/EnvelopeScreen.tsx
  screens/CoverScreen.tsx
  screens/DetailsScreen.tsx
  screens/RsvpScreen.tsx
  screens/GiftsScreen.tsx
  screens/PixScreen.tsx
  screens/MuralScreen.tsx
  screens/QuizScreen.tsx
  ui/            # Botão, Card, Chip, Stepper, Dots, etc.
  illustrations/ # SVGs: ursinho, balões, nuvens, varal, folhas
lib/
  pix.ts         # geração do payload EMV
  supabase.ts
  event.ts       # TODAS as constantes do evento
  calendar.ts    # .ics + link Google Calendar
```

**Regra importante:** todos os dados do evento (nomes, data, endereço, telefones, chave Pix, valores, listas de presente) ficam centralizados em `lib/event.ts` como um único objeto exportado, para serem editados sem mexer em componentes.

---

## 3. Dados reais do evento

```ts
// lib/event.ts
export const EVENTO = {
  bebe: "Ravi",
  titulo: "Chá de Fraldas do Ravi",
  data: "2026-09-05T12:00:00-03:00", // Sábado, 05 de setembro de 2026
  dataLabel: "Sábado, 05 de setembro de 2026",
  horaLabel: "12h",
  local: "CRESSPOM",
  endereco:
    "Setor de Clubes Recreativos e Esportivos Norte, Trecho 3, Conjunto 11/14 — Brasília/DF",
  mapsQuery: "CRESSPOM Setor de Clubes Norte Trecho 3 Conjunto 11/14 Brasilia DF",
  frase: "Nosso pequeno grande amor",
};

export const CONTATOS = [
  { nome: "Emilly Bento Szervinsks", papel: "Mamãe do Ravi", whatsapp: "5561999790968" },
  { nome: "Organização", papel: "Dúvidas sobre o chá", whatsapp: "5561983046539" },
  // TODO: confirmar/ajustar nomes e números antes de publicar
];

export const PIX = {
  chave: "+5561999790968",       // chave = celular
  chaveExibicao: "+55 61 99979-0968",
  nome: "EMILLY BENTO SZERVINSKS", // máx 25 chars, sem acento, MAIÚSCULO
  cidade: "BRASILIA",              // máx 15 chars, sem acento, MAIÚSCULO — cidade do titular
  valorPacoteFralda: 75.0,
};
```

⚠️ **Atenção:** no HTML antigo a cidade do Pix estava como `"SAO PAULO"`. Corrigir para a cidade real do titular da conta (provavelmente `BRASILIA`). O campo 60 do BR Code deve bater com o cadastro, senão alguns bancos recusam.

---

## 4. Identidade visual (crítico)

O visual deve seguir a arte do convite físico: **tema ursinho / boho / tons terrosos**, com arco de balões, varal de roupinhas, nuvens e bolo de fraldas.

### Paleta

```css
--verde-salvia:  #A3B18A;  /* balões verdes */
--verde-escuro:  #6B7F5E;  /* nome "Ravi" */
--dourado:       #B8963F;  /* títulos em script, ícones, corações */
--dourado-claro: #D9C089;
--bege:          #E4CDA7;  /* balões nude */
--areia:         #F1E4CE;
--creme:         #FAF5EC;  /* fundo principal */
--marrom-cacau:  #6E4B32;  /* balões marrons, texto forte */
--marrom-claro:  #A9835E;
--branco:        #FFFFFF;
--linha:         #E8DCC4;
```

- Fundo geral: `--creme`. Cards: `--branco` com borda `--linha` e sombra suave.
- Botão primário: gradiente `--verde-salvia → --verde-escuro`, texto branco, `rounded-full`.
- Botão secundário: outline `--dourado`, texto `--marrom-cacau`.
- Corações `♥` dourados como separadores decorativos (igual ao convite).

### Tipografia (Google Fonts, via `next/font`)

- Títulos principais ("Chá de Fraldas", "Ravi"): script elegante — **Parisienne** ou **Great Vibes**, cor `--dourado` (e `--verde-escuro` para "Ravi")
- Subtítulos: **Fraunces**
- Corpo/UI: **Quicksand**

### Ilustrações SVG a criar (sem fotos)

1. **Arco de balões** — cluster de círculos nas cores da paleta, alguns com "confete dourado" (pontinhos), alguns com brilho especular. Usar como moldura no topo/laterais.
2. **Ursinho de pelúcia** — SVG simples com laço dourado. Aparece na capa e na tela de agradecimento.
3. **Varal de roupinhas** — cordinha com pregadores + body, macacão, meias. Animar com balanço suave (`rotate` ±2°, `ease-in-out`, infinito, dessincronizado por item).
4. **Nuvens e folhinhas de eucalipto** — decoração de fundo com parallax leve.
5. **Bolo de fraldas** — na tela de presentes/Pix.

Animações: entrada com `fade + slide-up` (stagger 60ms), balões flutuando devagar, confete dourado discreto ao confirmar presença. **Respeitar `prefers-reduced-motion`.**

---

## 5. Arquitetura de navegação

Experiência tipo "convite que se abre", **mobile-first**, num container central de no máximo `420px` de largura, com cantos arredondados e borda suave — no desktop, centralizado sobre um fundo com textura de balões desfocada.

Telas, nesta ordem:

| # | Tela | Conteúdo |
|---|------|----------|
| 0 | **Envelope** | Envelope fechado que abre ao toque (animação de flap). "Você recebeu um convite especial" |
| 1 | **Capa** | "Chá de Fraldas do Ravi" em script dourado, ursinho, balões, contagem regressiva |
| 2 | **Detalhes** | Data, hora, local, endereço, mapa, botões de calendário |
| 3 | **Confirmar presença** | Formulário de RSVP |
| 4 | **Presentes** | Sugestões (sem reserva) |
| 5 | **Pix** | Seletor de pacotes + QR Code |
| 6 | **Mural de recados** | Escrever + ler recados |
| 7 | **Quiz / enquetes** | Perguntas divertidas com resultado em tempo real |

Navegação:

- Botão grande de avançar no rodapé de cada tela + link "‹ Voltar"
- **Swipe horizontal** (touch) para trocar de tela
- **Dots** de progresso no rodapé (8 pontos, o ativo vira uma barrinha)
- Um menu discreto (ícone ☰ ou barra inferior com 4 ícones: Convite · Presentes · Recados · Quiz) para pular direto — o convidado não pode ficar preso num fluxo linear
- Estado da tela refletido na URL via hash (`#presentes`) para permitir link direto e botão "voltar" do navegador funcionar

---

## 6. Telas em detalhe

### 6.1 Envelope (tela 0)

Envelope em CSS nas cores creme/bege com lacre de coração dourado. Ao tocar: flap gira em 3D (`rotateX`), o "cartão" desliza para cima e transiciona para a capa. Botão alternativo "Abrir convite →" para acessibilidade.

### 6.2 Capa (tela 1)

- Moldura de balões SVG no topo e nas laterais
- Varal de roupinhas animado
- "Chá de Fraldas" (script dourado, grande) / "do" / "Ravi" (script verde)
- Ursinho + nuvem na base
- **Contagem regressiva** para 05/09/2026 12h (BRT): blocos de dias / horas / minutos / segundos, cada número num cartãozinho creme com borda dourada. Depois da data, exibir "O grande dia chegou! 💛"
- Dica: "👉 arraste para o lado ou toque no botão"

### 6.3 Detalhes (tela 2)

Cards com ícone dourado à esquerda:

- 📅 Data — Sábado, 05 de setembro de 2026
- 🕐 Hora — 12h
- 📍 Local — CRESSPOM, Setor de Clubes Recreativos e Esportivos Norte, Trecho 3, Conjunto 11/14

Ações:

- **"Abrir no Google Maps"** → `https://www.google.com/maps/search/?api=1&query=<encoded mapsQuery>`
- **"Como chegar"** → `https://www.google.com/maps/dir/?api=1&destination=<encoded>`
- **"Adicionar ao Google Calendar"** → link `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=20260905T150000Z/20260905T190000Z&location=...&details=...`
- **"Baixar convite (.ics)"** → gerar o arquivo no client via Blob (funciona no iPhone)
- Card **"Fale com a gente"** com os contatos de `CONTATOS`, cada um com botão que abre `https://wa.me/<numero>`

### 6.4 Confirmar presença (tela 3) — SEM BACKEND

O RSVP **não é salvo em banco**. Ele monta uma mensagem e abre o WhatsApp da organização.

Campos:

- Nome (obrigatório)
- Quantidade de acompanhantes (stepper 0–6)
- Botões grandes: **"Vou comparecer 💚"** / **"Não poderei ir"**
- Se "vou comparecer": aparece bloco opcional "Vai levar fralda? Escolha o tamanho" → chips `P`, `M`, `G`, `GG`, `Ainda não sei`, com a dica: *"💡 o Ravi usa G por mais tempo que M — se puder escolher, o G ajuda ainda mais!"*
- Campo opcional "Recado rápido"

Ao confirmar:

- Animação de confete dourado + card de sucesso: *"Presença confirmada, {nome}! 💛"*
- Botão destacado **"Avisar no WhatsApp"** abrindo `https://wa.me/5561983046539?text=<mensagem>`
- **Aviso claro e visível:** *"⚠️ Sua confirmação só chega até nós quando você toca no botão e envia a mensagem no WhatsApp."* Isso é essencial — sem isso o RSVP se perde.
- Salvar o estado em `localStorage` para que, ao reabrir o link, o site já cumprimente pelo nome e mostre "você já confirmou" com opção de alterar

Mensagem gerada (exemplo):

```
Olá! {nome} confirmou presença no Chá de Fraldas do Ravi 💙
📅 05/09/2026 às 12h — CRESSPOM
👥 Acompanhantes: {n}
🍼 Vai levar fralda tamanho: {tamanho}
💬 {recado}
```

Se "não poderei ir": mensagem carinhosa, sem culpa, e um botão suave levando à tela de Pix — *"Se quiser, ainda dá pra mandar um carinho de longe"*.

### 6.5 Presentes (tela 4) — só sugestões, sem reserva

Grid de cards, cada categoria com um ícone SVG:

**🍼 Fraldas (o principal)**
Pampers Premium Care · Pampers Confort Sec · Huggies Supreme Care — tamanhos **M** e **G**

**🧸 Mimos**
Fraldas de pano · Toalha de banho · Roupinhas · Cueiro · Lenço umedecido · Pomada de assadura · Sabonete líquido · Shampoo · Colônia · Mordedor · Chocalho

**🎁 Outros presentes** *(NOVO — os valores serão revisados depois, deixar como constantes fáceis de editar em `lib/event.ts` e marcar `// TODO: confirmar valores`)*

| Item | Valor sugerido (placeholder) |
|---|---|
| Kit banho completo | R$ 120,00 |
| Kit higiene (pomada, lenços, sabonete) | R$ 90,00 |
| Body / macacão | R$ 80,00 |
| Manta / cueiro | R$ 70,00 |
| Brinquedo (mordedor, chocalho) | R$ 50,00 |
| Fralda de pano (pacote) | R$ 60,00 |

Cada item de "Outros presentes" tem um botão **"Presentear via Pix"** que leva à tela de Pix já com aquele valor preenchido.

Nota no rodapé: *"Quem vier ao chá pode trazer a fralda e/ou um mimo no dia :)"*

### 6.6 Pix (tela 5) — a parte mais importante

Texto de abertura, tom leve e sem cobrança:
*"Se você mora longe ou preferir, pode contribuir com o valor das fraldas por Pix. Sem nenhuma obrigação — sua presença já é o maior presente."*

**A) Chave Pix simples**
Card com a chave `+55 61 99979-0968`, nome `Emilly Bento Szervinsks`, botão **"Copiar chave"** com feedback "Chave copiada! ✓".

**B) Seletor interativo de pacotes de fralda — destaque da tela**

Substituir os botões fixos (1x / 3x / 5x) por um **stepper visual e lúdico**:

- Um contador grande com botões `−` e `+`, indo de **1 a 20 pacotes**, valor unitário **R$ 75,00**
- A cada incremento, **aparece um ícone de pacote de fralda** numa fileira/pilha animada (spring, com pequeno bounce) — o usuário literalmente vê a pilha de fraldas crescer
- O total (`quantidade × 75`) atualiza com animação de contagem crescente, em fonte grande dourada
- **Atalhos rápidos** em chips: `1`, `2`, `3`, `5`, `10` pacotes
- Mensagens divertidas conforme a quantidade (microcopy que muda em tempo real):
  - 1 → *"Um pacote já salva um dia inteiro! 🍼"*
  - 2–3 → *"O bumbum do Ravi agradece 💛"*
  - 4–6 → *"Uau, isso é quase uma semana de tranquilidade!"*
  - 7–10 → *"Você é oficialmente padrinho(a) das madrugadas 🌙"*
  - 11+ → *"Calma, você vai zerar o estoque da farmácia! 🧸"*
- **Slider alternativo** (input range estilizado) sincronizado com o stepper, para quem prefere arrastar
- Abaixo, opção **"Prefiro escolher outro valor"** → input numérico livre com máscara de moeda (R$ 0,00)

**C) Geração do BR Code**

Ao definir o valor, mostrar num card:

- QR Code (≥ 200px, cor `--verde-escuro` sobre branco, com margem branca — não usar cor muito clara, prejudica a leitura)
- Rótulo "Pix copia e cola"
- O payload em fonte pequena com `word-break`
- Botão **"Copiar código Pix"** com feedback "Código copiado! Cole no app do seu banco ✓"
- Botão **"Compartilhar"** usando `navigator.share` quando disponível

**D) Botão "Já fiz o Pix 💛"**
Abre o WhatsApp da Emilly com: `Oi! Acabei de fazer um Pix de R$ {valor} para o Chá de Fraldas do Ravi. Sou {nome}. 💛`

**Implementação do payload Pix (EMV / BR Code)** — portar esta lógica, já validada, para `lib/pix.ts` em TypeScript:

```ts
function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

const tlv = (id: string, value: string) =>
  id + String(value.length).padStart(2, "0") + value;

export function buildPixPayload(amount: number): string {
  const merchant = tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", PIX.chave));
  const payload =
    "000201" +
    merchant +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", PIX.nome) +
    tlv("60", PIX.cidade) +
    tlv("62", tlv("05", "CHAFRALDARAVI")) +
    "6304";
  return payload + crc16(payload);
}
```

Regras a respeitar em `lib/pix.ts`:

- `PIX.nome` ≤ 25 caracteres, `PIX.cidade` ≤ 15, ambos **sem acentos**, em maiúsculas — normalizar com `.normalize("NFD").replace(/[̀-ͯ]/g, "")`
- O `tlv` deve calcular o comprimento em **bytes**, não em caracteres (se algum acento escapar, o tamanho quebra)
- Escrever **testes unitários** (Vitest) verificando: comprimento dos campos, CRC de um payload conhecido, e que o valor `R$ 75,00` produza `540575.00`

### 6.7 Mural de recados (tela 6) — Supabase

- Formulário: nome + mensagem (máx 280 caracteres, contador visível)
- Ao enviar, o recado aparece no mural (optimistic update)
- Mural: cards em estilo *polaroid / bilhetinho* com leve rotação aleatória (−3° a 3°), fundo creme, borda dourada, alternando com cards verde-sálvia. Rolagem infinita ou "ver mais".
- Realtime do Supabase para novos recados aparecerem sozinhos
- Cada recado mostra nome + tempo relativo ("há 2 horas")
- Campo honeypot anti-spam + rate limit simples por `localStorage`
- Filtro básico de palavrão (lista pequena) antes de inserir

### 6.8 Quiz e enquetes (tela 7) — Supabase

Perguntas de múltipla escolha, uma por tela com transição:

1. Vai puxar mais o papai ou a mamãe?
2. Quantos quilos o Ravi vai nascer? — `< 2,5kg` / `2,5–3kg` / `3–3,5kg` / `3,5–4kg` / `> 4kg`
3. Vai nascer antes, no dia certo ou depois da data prevista?
4. Quantas fraldas por dia nas primeiras semanas? — `4` / `6` / `8` / `10+`
5. Ravi vai ser: dorminhoco 😴 / agitado 🏃 / chorão 😭 / comilão 🍼
6. Cor dos olhos: castanho / verde / azul

Depois de votar em cada pergunta:

- Mostrar **barras de resultado animadas** com a porcentagem de todos os convidados
- Destacar a opção escolhida pelo usuário
- Ao final: card de resumo *"Seus palpites 💛"* + botão **"Compartilhar meus palpites no WhatsApp"**
- Impedir voto duplicado com um `guest_id` (UUID em `localStorage`) — não é segurança, é só evitar ruído

### Schema Supabase

```sql
create table recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 60),
  mensagem text not null check (char_length(mensagem) between 1 and 280),
  created_at timestamptz default now()
);

create table votos (
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
```

Usar a **anon key** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) direto no client. Como só há INSERT e SELECT em tabelas públicas, isso é aceitável aqui.

---

## 7. Requisitos técnicos e de qualidade

**Mobile-first**

- Testar em 360px, 390px e 430px de largura
- Área de toque mínima 44×44px
- Sem scroll horizontal em nenhuma tela
- `viewport-fit=cover` + `env(safe-area-inset-bottom)` para iPhone com notch
- Usar `100dvh` (não `100vh`) para evitar corte pela barra do Safari
- Inputs com `font-size: 16px` para o iOS não dar zoom automático
- Testar o site dentro do **navegador embutido do WhatsApp** (in-app browser) — `navigator.clipboard` pode falhar lá; manter fallback com `document.execCommand('copy')`

**Performance e SEO/compartilhamento**

- Lighthouse mobile ≥ 90
- Fontes via `next/font` com `display: swap`
- **Open Graph** caprichado: `og:title` = "Chá de Fraldas do Ravi 💛", `og:description` = "05/09/2026 às 12h — CRESSPOM. Confirme sua presença!", e uma **`og:image` 1200×630 gerada dinamicamente** com `next/og` (ImageResponse) na paleta do convite. Isso é o que aparece quando o link é colado no WhatsApp — precisa ficar bonito.
- Favicon e `apple-touch-icon` com o ursinho
- `manifest.json` para "adicionar à tela de início"

**Acessibilidade**

- Contraste AA (cuidado: dourado sobre creme costuma reprovar — escurecer o dourado para texto pequeno)
- Navegação por teclado funcionando em todas as telas
- `aria-label` nos botões só com ícone
- `prefers-reduced-motion` desliga animações

**Código**

- TypeScript estrito, sem `any`
- Componentes pequenos e reutilizáveis
- Zero hardcode de conteúdo dentro de componentes — tudo de `lib/event.ts`
- `README.md` explicando: como rodar, como editar textos/valores, como criar o projeto no Supabase e rodar o SQL, e como fazer deploy na Vercel
- `.env.example` com as duas variáveis do Supabase

---

## 8. Entregáveis

1. Projeto Next.js completo, rodando com `npm run dev`
2. `lib/event.ts` com todos os dados centralizados e comentários `// TODO` nos valores a confirmar
3. Testes unitários do gerador de Pix passando
4. SQL do Supabase em `supabase/schema.sql`
5. `README.md` com instruções de deploy na Vercel
6. `.env.example`

## 9. Ordem de execução sugerida

1. Scaffold Next.js + Tailwind + tema/paleta em `tailwind.config.ts` e `globals.css`
2. `lib/event.ts` e componentes de UI base (Botão, Card, Chip, Stepper, Dots)
3. Ilustrações SVG (balões, ursinho, varal, nuvens)
4. Shell de navegação (telas + swipe + dots + hash na URL)
5. Telas 0–3 (Envelope, Capa com countdown, Detalhes, RSVP)
6. `lib/pix.ts` + testes → tela de Pix com o stepper de pacotes
7. Tela de Presentes
8. Supabase → Mural e Quiz
9. OG image, manifest, acessibilidade, polimento de animações
10. Rodar Lighthouse mobile e corrigir o que ficar abaixo de 90

---

## 10. Pendências para o dono do projeto confirmar antes de publicar

- [ ] Valores reais dos itens em "Outros presentes"
- [ ] Cidade cadastrada na conta Pix da Emilly (campo 60 do BR Code)
- [ ] Número de WhatsApp que vai receber as confirmações
- [ ] Nomes e telefones dos contatos/anfitriões
- [ ] Se haverá dress code ou tema de roupa
- [ ] Fotos (ultrassom / ensaio) — o site já nasce funcionando sem elas; se surgirem depois, adicionar em `/public/images` e trocar as ilustrações da capa
