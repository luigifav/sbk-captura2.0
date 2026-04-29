# Handoff: Captura SBK 2.0

> Plataforma jurídico-tecnológica · Portal Operacional (/ops) + Portal Cliente (/portal) + assistente Lum.IA

---

## Overview

Este pacote contém o **redesign visual e estrutural** do Captura SBK 2.0, cobrindo os dois portais que o produto entrega hoje:

- **`/ops`** — portal operacional usado pela equipe SBK (capturas, retries, clientes, executivo, registro)
- **`/portal`** — portal externo usado pelos clientes BPO (caixa de entrada, monitoramento, documentos, alertas, API, credenciais, conta)

O redesign foi guiado pelo **documento de auditoria** que você forneceu e pelo **brand book SBK**. Os principais problemas resolvidos:

- Substituição do `Inter` pelo **Plus Jakarta Sans** (fonte da marca) + **Fraunces** (display)
- Eliminação do palette `slate-950 / orange-* / red-*` no `/ops` → uso do **verde-profundo** + **verde-escuro** da marca
- Substituição dos badges de status ad-hoc pelos **6 estados canônicos** (`localizado`, `capturado`, `enviado`, `entregue`, `falha-captura`, `falha-entrega`)
- Aplicação do **sistema de cards SBK** (border-first, sem barras de acento à esquerda)
- Padronização do **page header** (eyebrow + title + subtitle) em todas as telas
- Introdução de uma **superfície de IA explícita** (Lum.IA) com gradiente verde-profundo, distinto do resto da UI

---

## About the Design Files

⚠️ **Os arquivos HTML/CSS/JSX neste bundle são REFERÊNCIAS DE DESIGN, não código de produção.**

Eles foram criados em HTML + React inline + Babel standalone para fins de prototipação rápida. Eles **não devem ser copiados diretamente** para o repositório de produção. O objetivo é que você (ou o Claude Code) **recrie esses designs no ambiente real** do Captura SBK 2.0:

- Use o framework já estabelecido no projeto (Next.js, Vite + React, ou o que estiver em uso)
- Use as bibliotecas de componentes que já existem (shadcn/ui, Radix, etc.)
- Use o sistema de roteamento do projeto (App Router, React Router, etc.)
- Use a infra de fetching/state que já existe (React Query, SWR, Zustand, etc.)

Os arquivos `.jsx` aqui usam padrões "globals + window assignment" típicos de protótipo single-file com Babel inline. Em produção isso vira `import / export` normal, hooks de verdade, e separação por feature.

---

## Fidelity

**Hi-fi.** As cores, tipografia, espaçamentos, bordas, sombras, estados de hover e gradientes estão finalizados e refletem o sistema visual final pretendido. Recrie pixel-perfeito usando os componentes do seu codebase.

Os dados são **mockados mas realistas** (CNJ no formato correto, TJSP/TJRJ/TJMG/TRT, CNPJs, valores em BRL) — quando integrar com a API real, substitua o `data.js` pelas chamadas reais, mas mantenha os mesmos formatos de exibição.

---

## Screens / Views

### Portal Operacional (`/ops`)

#### 1. Dashboard (`/ops/dashboard`)
- **Propósito**: Visão geral da operação em tempo real para o time SBK
- **Layout**:
  - Hero strip no topo com gradiente verde-profundo, saudação personalizada e timestamp da última sincronização
  - Grid de 4 colunas com `MetricCard`s (Processos capturados 24h, Em fila MCP/IA, Laudos auto-gerados, Movimentações 24h)
  - Grid 1.4fr / 1fr: **gráfico de barras** (capturas por dia da semana, com pico destacado) + **lista de canais** (PDPJ, DJE, TJ Direct, DataJud, etc, com latência e success rate)
  - Activity feed em tempo real com badge "AO VIVO" pulsante
- **Componentes notáveis**:
  - `SBKMetric` — card métrica com sparkline opcional, delta e ícone de tendência
  - `bars` — barras animadas com tooltip no pico
  - Activity feed com tags coloridas por tipo (`ai`, `success`, `info`, `warn`, `danger`)

#### 2. Captura por CNJ (`/ops/captura`)
- **Propósito**: Investigar um processo específico, ver histórico de tentativas, pedir laudo da IA
- **Layout**: split 320px / 1fr
  - **Esquerda**: lista scrollável de processos em monitoramento, com seleção via border-left verde
  - **Direita**: detalhe do processo selecionado
    - Header com tribunal, vara, número CNJ, partes, cliente, status badge, ações (Recapturar / Pedir laudo IA)
    - Grid 4 colunas com métricas (valor da causa, risco IA, capturado às, última atualização)
    - Split 1fr / 1fr abaixo:
      - **Histórico de tentativas** — timeline vertical com pontos coloridos por tone
      - **Resumo automático Lum.IA** — card com gradiente verde-profundo, fundo escuro, copy explicativo, botões de ação

#### 3. Retry / Timeout (`/ops/retry`)
- **Propósito**: Fila de capturas que falharam, aguardando reprocessamento
- **Layout**:
  - Page header padrão com botão "Reprocessar todos"
  - Chips de filtro (Todos / Warning / Crítico)
  - Tabela com colunas: CNJ, Erro, Idade, Tentativas, Próximo retry, Ação
- **Estados**: tentativas ≥ 3 ficam em vermelho; "manual" no próximo retry fica em warning

#### 4. Clientes (`/ops/clientes`)
- **Propósito**: Lista mestre de clientes BPO, com saúde e status
- **Layout**:
  - 3 cards de KPI (MRR, volume médio/cliente, saúde média)
  - Tabela com avatar (iniciais sobre verde-50), nome, CNPJ, plano, volume, barra de saúde, status

#### 5. Executivo (`/ops/executivo`)
- **Propósito**: KPIs de negócio para liderança
- **Layout**:
  - 4 cards (receita acumulada, margem operacional, churn 30d, NPS)
  - Split 1fr/1fr: receita por plano (barras horizontais) + top 5 clientes por volume

#### 6. Registro (`/ops/registro`)
- **Propósito**: Log pesquisável de todas as capturas
- **Layout**: chips de filtro removíveis + tabela completa com hora, CNJ, cliente, tribunal, canal, status

---

### Portal Cliente (`/portal`)

#### 7. Caixa de entrada (`/portal/caixa`)
- **Propósito**: Tela inicial para o cliente — processos capturados nos últimos dias
- **Layout**: 4 cards de KPI + tabela de processos clicáveis

#### 8. Monitoramento (`/portal/monitoramento`)
- **Propósito**: Watchlist de processos sob observação contínua
- **Layout**:
  - Card grande de "Saúde da carteira" (97%, com barra)
  - 2 cards menores (capturas hoje, falhas pendentes)
  - Tabela com filtros segmentados (Todos / Com mov. / Sem mov.) e barra de risco por linha

#### 9. Documentos (`/portal/documentos`)
- **Propósito**: Acervo de PDFs (peças, decisões, contratos)
- **Layout**: grid 3 colunas de cards com ícone "PDF" verde-50, nome, processo, data, tamanho, ações Ver/Baixar

#### 10. Alertas (`/portal/alertas`)
- **Propósito**: Inbox de eventos importantes
- **Layout**: lista com indicador de não-lido, tag colorida por tipo, mensagem, processo associado, timestamp

#### 11. Consumo de API (`/portal/api`)
- **Propósito**: Cliente Enterprise acompanha quota e endpoints
- **Layout**:
  - Card grande com display do uso atual (40px, Fraunces) + barra de progresso
  - Tabela de endpoints (path mono, chamadas, latência, % erro)

#### 12. Credenciais (`/portal/credenciais`)
- **Propósito**: Gerenciar API keys
- **Layout**:
  - Banner LGPD em verde-50 com ícone shield
  - Cards de credencial com chave mascarada/revelável (`sbk_prod_••••••`), botão Rotacionar, último uso

#### 13. Conta (`/portal/conta`)
- **Propósito**: Dados cadastrais + plano
- **Layout**: split 1fr/320px
  - Esquerda: form-style com labels à esquerda, valores à direita, separadores horizontais
  - Direita: card sticky com gradiente verde-profundo descrevendo o plano Enterprise

---

### Componentes globais

#### App Shell (`shell.jsx`)
- **Sidebar 248px sticky**:
  - Variante **`ops`**: gradiente verde-profundo (190deg, `#023631 → #012824 → #011C1A`), grid pattern overlay, glow radial superior esquerdo, status pill "Sistema operacional"
  - Variante **`portal`**: off-white, logo SBK com filtro CSS para virar verde
  - Brand row, badge "v2.0", nav agrupado por seção, badges numéricos por item, user card no rodapé
- **Top bar**:
  - Search input centrado com ícone, placeholder contextual ao portal
  - Tag "LIVE" pulsante (apenas /ops)
  - Botão notificações + divider + CTA primário ("Nova captura" no /ops, "Pedir laudo IA" no /portal)

#### Lum.IA Drawer (no `Captura SBK 2.0.html`)
- Drawer lateral direito de 440px
- Header em gradiente verde-profundo, badge sparkle com glow, status "Pronta · MCP · 97.8%"
- Histórico de mensagens com bubbles (user = verde-escuro à direita; AI = grey-50 à esquerda)
- Indicador "pensando…" com 3 dots
- Quick actions (chips verde-50): Gerar laudo / Buscar CNJ / Status retry
- Input + botão send
- Backdrop semi-transparente verde-profundo (40% opacity)
- Animação `slidein` 280ms cubic-bezier

#### FAB Lum.IA
- Botão flutuante 56x56 bottom-right, gradiente verde-escuro → ciano, ícone sparkle

---

## Interactions & Behavior

| Interação | Comportamento |
|---|---|
| Click em item da sidebar | Troca de rota (estado React, sem URL — em produção usar router real) |
| Click em "Trocar para Portal Cliente / Ops" | Mesma sidebar, troca de portal |
| Click no FAB Lum.IA | Abre drawer com animação slide-in 280ms |
| Click no backdrop ou no X | Fecha drawer |
| Submit no input do drawer | Envia mensagem, mostra "pensando…" 900ms, retorna resposta mockada por keyword (laudo / cnj / falha) |
| Hover em linha de tabela | Cursor pointer; em produção, navegar para detalhe |
| Click em botão "Reprocessar" | Em produção: chamar endpoint de retry |
| Click em "Recapturar" / "Pedir laudo IA" | Em produção: dispatch da action correspondente |

### Animações

| Elemento | Animação |
|---|---|
| `.fade-in` | `fadeIn` 240ms ease-out — toda transição de tela |
| `.pulse-dot` | `pulse` 2s infinite — status indicators e LIVE tag |
| `.bar.peak` | Glow + scale leve no peak do bar chart |
| Drawer Lum.IA | `slidein` 280ms `cubic-bezier(0.20, 0.80, 0.20, 1)` |
| Backdrop | `fade` 200ms |
| Sidebar link active | `border-left` 3px verde-escuro + bg verde-50, transição 120ms |

---

## State Management

A versão de produção precisará de:

- **Routing**: Next.js App Router com rotas paralelas para `/ops/*` e `/portal/*`, ou React Router v6
- **Auth/role**: middleware para diferenciar usuário SBK (acessa `/ops`) de cliente BPO (acessa `/portal`)
- **Data fetching**: React Query / SWR para:
  - `GET /processes` — lista de processos (paginação, filtros)
  - `GET /processes/:cnj` — detalhe + histórico de tentativas
  - `POST /processes/:cnj/retry` — re-disparar captura
  - `GET /clients` — clientes BPO (apenas /ops)
  - `GET /alerts` — alertas (apenas /portal)
  - `GET /metrics/dashboard` — KPIs do dashboard
  - `GET /api-usage` — quota e endpoints (apenas /portal)
  - `GET /credentials` — API keys (apenas /portal)
- **Real-time**: WebSocket ou SSE para o activity feed do dashboard e o status "AO VIVO"
- **Lum.IA**: integração com endpoint MCP — substituir as respostas mockadas por streaming real

---

## Design Tokens

Todos os tokens estão em **`sbk-tokens.css`** (arquivo do brand kit). Resumo dos principais:

### Cores

```css
/* Brand core */
--sbk-verde-profundo: #012824;   /* darkest, used for /ops chrome */
--sbk-verde-escuro:   #075056;   /* primary brand color */
--sbk-verde:          #2A7C79;
--sbk-verde-claro:    #0A5A52;   /* success */
--sbk-verde-50:       #E6EEEC;   /* tint */

--sbk-ciano-profundo: ...;       /* secondary */
--sbk-ciano-escuro:   ...;
--sbk-ciano:          ...;
--sbk-ciano-50:       ...;

--sbk-off-white:      #ECEFF3;
--sbk-branco:         #FFFFFF;

/* Greys */
--sbk-grey-50:  #F6F8F7;
--sbk-grey-100: ...;
--sbk-grey-200: ...;

/* Semantic */
--sbk-fg-1:   var(--sbk-verde-profundo);  /* never pure black */
--sbk-fg-2:   #475765;
--sbk-fg-3:   #8A99A6;
--sbk-bg:        var(--sbk-off-white);
--sbk-bg-canvas: var(--sbk-branco);       /* card surface */
--sbk-bg-subtle: var(--sbk-grey-100);
--sbk-border:    rgba(...);

--sbk-warning:    /* yellow */;
--sbk-warning-bg: /* yellow tint */;
--sbk-danger:     #B53838;
--sbk-danger-bg:  /* red tint */;
```

> ⚠️ Os valores exatos hex estão em `sbk-tokens.css` — use ele como source of truth e copie para o seu sistema (Tailwind config, CSS vars, ou o que usarem).

### Tipografia

```css
--sbk-font-body:    'Plus Jakarta Sans', system-ui, sans-serif;
--sbk-font-display: 'Fraunces', Georgia, serif;
--sbk-font-mono:    'JetBrains Mono', monospace;
```

| Uso | Família | Tamanho | Peso | Letter-spacing |
|---|---|---|---|---|
| Page title (h1) | Plus Jakarta Sans | 24-30px | 600 | -0.02em |
| Hero number / display | Fraunces | 36-40px | 600 | -0.02em |
| Section heading (h3) | Plus Jakarta Sans | 14-16px | 600 | normal |
| Body | Plus Jakarta Sans | 13-14px | 300-400 | normal |
| Eyebrow / label | Plus Jakarta Sans | 10-11px | 600 | 0.10-0.16em uppercase |
| CNJ / numbers | JetBrains Mono | 11-13px | 400-500 | normal |

### Spacing & Radius

- Card padding: 18px (compact) / 24px (lg)
- Card radius: 12px
- Button radius: 8px
- Pill/tag radius: 999px
- Status badge: filled, 11px, peso 600, padding 4px 10px
- Page padding: 24px 32px 64px

### Status Badges (canonical 6)

| State | Class | Color tone |
|---|---|---|
| Localizado | `s-localizado` | Ciano |
| Capturado | `s-capturado` | Verde médio |
| Enviado | `s-enviado` | Verde-escuro |
| Entregue | `s-entregue` | Verde-claro success |
| Falha de captura | `s-falha-cap` | Warning |
| Falha de entrega | `s-falha-ent` | Danger |

---

## Assets

- **`assets/sbk-logo.png`** — logo da marca (preto sobre transparente; no /ops é usado direto, no /portal recebe filtro CSS para virar verde)
- **`assets/sbkia-logo.png`** — logo da Lum.IA (não usado diretamente nesta versão; reservado para tela de IA expandida)
- **Iconografia**: stroke icons custom em `primitives.jsx` (set lucide-style, 24px viewBox). Em produção, substituir por **`lucide-react`** que já cobre todos os ícones usados.

---

## Files

Arquivos do bundle, na ordem em que carregam:

| Arquivo | Conteúdo |
|---|---|
| `Captura SBK 2.0.html` | Entry HTML, monta `<App>`, contém o drawer Lum.IA e o root do Tweaks |
| `sbk-tokens.css` | **Brand tokens — copiar para o seu design system** |
| `app.css` | Estilos do shell, sidebar, topbar, cards, tabelas, badges, animações |
| `data.js` | Mock data (substituir por chamadas de API reais) |
| `primitives.jsx` | `Icon`, `StatusBadge`, `Sparkline`, `MetricCard` |
| `shell.jsx` | `AppShell` (sidebar + topbar) |
| `ops.jsx` | 6 telas do `/ops` |
| `portal.jsx` | 7 telas do `/portal` |
| `tweaks-panel.jsx` | Painel de tweaks (não vai pra produção) |
| `assets/` | Logos PNG |

---

## Recommended next steps for implementation

1. **Copie `sbk-tokens.css` para o seu projeto** — é o output mais valioso desse handoff
2. **Identifique seu sistema de componentes atual** (shadcn/ui? Mantine? custom?) e mapeie os componentes que você precisa: Card, Button, Table, Badge, Tabs/Chips, Drawer, Toast
3. **Implemente as primitives primeiro**: `StatusBadge` (com os 6 estados canônicos), `MetricCard`, `Sparkline`, `PageHeader` (eyebrow + title + subtitle)
4. **Implemente o `AppShell`** com a variante de tema (`ops` vs `portal`) — isso destrava todas as telas
5. **Implemente as telas em ordem de impacto**: Dashboard → Captura por CNJ → Caixa de entrada → resto
6. **Integre Lum.IA por último**, depois que o resto estiver funcional, com endpoint MCP real
7. **Não copie a estrutura `window.X = X` dos arquivos `.jsx`** — eram só para o protótipo single-file. Use ESM normal.
