# Auditoria de Front-end, Captura SBK 2.0

Documento de diagnóstico, anterior a qualquer refatoração. Lista divergências entre o estado atual do código e a identidade visual SBK, mapeia violações por rota e enumera componentes ad-hoc que devem ser substituídos pelos primitivos em `components/ui/*`.

## 0. Bloqueio de validação canônica

O briefing indica que o Brand Book SBK 2026 está em `/mnt/skills/organization/sbk-brand/SKILL.md`. Esse caminho não está presente no ambiente atual (a pasta `/mnt/skills` não existe). Em consequência:

- Não foi possível confirmar de forma autoritativa a paleta primária canônica, nem se há uma marca derivada SBK IA com paleta própria.
- Não foi possível confirmar a fonte canônica (Plus Jakarta Sans foi citada no briefing) nem os pesos canônicos (Seminegrito, Leve).
- Não foi possível confirmar o sistema de cards e regras de logo descritos no Brand Book.

Esta auditoria adota como referência operacional `styles/tokens.css`, `tailwind.config.ts` e `app/(marketing)/page.tsx`, que é a área mais próxima da identidade SBK no estado atual. Pontos marcados com **[CONFIRMAR]** dependem do Brand Book para fechamento. Recomenda-se anexar o arquivo do Brand Book ao repositório (por exemplo em `docs/brand/`) antes da Fase 1 da refatoração.

## 1. Inventário de divergências, fundação

### 1.1 Paleta primária

| Item | Atual (`styles/tokens.css`, `tailwind.config.ts`) | Briefing, Brand Book SBK 2026 | Status |
| --- | --- | --- | --- |
| Brand default | `#023631` | `#023631` segundo o usuário, descrito como "atual" e potencialmente divergente do canônico | **[CONFIRMAR]** valor canônico real |
| Brand hover | `#075056` | não especificado | **[CONFIRMAR]** |
| Brand light | `#0a7a82` | não especificado | **[CONFIRMAR]** |
| Brand subtle | `#e6f0ef` | não especificado | **[CONFIRMAR]** |
| Marca SBK IA | inexistente | mencionada no briefing | **[CONFIRMAR]** existência e paleta |

Observação: o usuário escreveu "paleta primária (atual #023631 vs canônica do Brand Book)", o que sugere que o valor atual pode não ser o canônico. Sem o Brand Book, esta auditoria não pode trocar a cor primária.

### 1.2 Cores semânticas

`styles/tokens.css` e `tailwind.config.ts` definem `success`, `warning`, `danger`, `info` em valores Tailwind padrão (`#16a34a`, `#d97706`, `#dc2626`, `#2563eb`) com variantes `light`, `muted` e `foreground`. Estrutura adequada, valores **[CONFIRMAR]** com Brand Book.

### 1.3 Tipografia

| Item | Atual | Briefing | Status |
| --- | --- | --- | --- |
| Família | `Inter` via `next/font/google` em `app/layout.tsx` | `Plus Jakarta Sans` | Divergente |
| Variável CSS | `--font-inter` em `tailwind.config.ts` linha 21 | precisa virar `--font-jakarta` ou similar | Divergente |
| Pesos | padrão da Inter | Seminegrito e Leve | **[CONFIRMAR]** mapeamento exato (provavelmente 600 e 300, ou 600 e 400) |

### 1.4 Reconciliação shadcn versus tokens

`app/globals.css` define os tokens HSL do shadcn. `--primary` está em `174 93% 11%`, equivalente ao `#023631`. Isso já está coerente com o brand atual, porém:

- `--ring` também usa `174 93% 11%`, o que é coerente.
- Não há tokens HSL para `success`, `warning`, `danger`, `info`, então variantes em `components/ui/*` que dependem de `bg-success-light` etc. funcionam só pelo `tailwind.config.ts`, não por CSS-vars. Não é um bug, mas é uma inconsistência de modelo: parte do sistema é HSL via CSS-vars, parte é hex direto via Tailwind. Padronizar.
- Sem suporte real ao tema escuro nas demais áreas (apenas marketing e shadcn-base).

## 2. Mapeamento de violações por rota

Critério: uso de cores Tailwind genéricas (`slate-*`, `orange-*`, `red-*`, `green-*`, `blue-*`, `yellow-*`, `purple-*`) onde deveriam estar tokens semânticos `brand`, `neutral`, `success`, `warning`, `danger`, `info`.

### 2.1 `/ops/*`, paleta exótica fora da identidade

`app/ops/layout.tsx` é a maior violação. Concentra:

- `bg-slate-950` no container raiz, `bg-slate-900` na sidebar e header, `border-slate-800`, `text-slate-300`, `text-slate-400`.
- Identidade "Ops" feita via cor laranja: `text-orange-400`, `bg-orange-500/20`, `border-orange-400`, `bg-orange-500` na faixa "Portal Interno SBK".
- Avatar com gradiente `from-orange-400 to-red-600` em duas posições (sidebar e header).
- Indicador de notificação `bg-red-500`.
- Foco do input `focus:ring-orange-500`.
- `getStatusColor` interna ao layout retornando `bg-green-500/20 text-green-700`, `bg-red-500/20 text-red-700`, `bg-gray-500/20 text-gray-700`.

Outros arquivos `/ops/*` com cores exóticas e ad-hoc (confirmado por `grep` para `slate-9*`, `orange-*`, `red-600`):

- `app/ops/captura/page.tsx`
- `app/ops/captura/[cnj]/page.tsx` e seus `components/*.tsx` (header, timeline, sidebar-cards, action-modal, channel-state, attempt-history)
- `app/ops/dashboard/page.tsx`
- `app/ops/executivo/page.tsx`
- `app/ops/clientes/page.tsx`
- `app/ops/clientes/[id]/page.tsx`
- `app/ops/registro/page.tsx`
- `app/ops/registro/[id]/page.tsx`
- `app/ops/retry-timeout/page.tsx`

Total bruto de ocorrências de `slate-9*` mais `orange-*` mais `red-600` em `app/`: 48 linhas, com epicentro em `app/ops/layout.tsx`.

### 2.2 `/portal/*`, cores Tailwind genéricas em vez de semânticas

`app/portal/layout.tsx` é discreto, usa apenas `bg-background`, `bg-muted/40` e tokens shadcn. Sem violação relevante de paleta.

Páginas com cores genéricas em vez de tokens semânticos:

- `app/portal/documentos/page.tsx`
  - linha 122 a 126, `getStatusColor` retorna `bg-green-100 text-green-700`, `bg-blue-100 text-blue-700`, `bg-red-100 text-red-700`.
  - linhas 351, 488: `text-blue-600`, `text-green-600` em ícones e labels.
  - linhas 529, 530, 547: `bg-green-500`, `bg-blue-500` em barras de progresso.
- `app/portal/alertas/page.tsx`
  - linhas 143, 145, 147: ícones com `text-green-600`, `text-red-600`, `text-yellow-600`.
  - linha 370: badge `bg-blue-100 text-blue-700`.
  - linha 409: `text-green-600`. Linha 426: `text-red-600`.
  - linha 516: `bg-green-600 text-white`. Linha 611: `bg-yellow-100 text-yellow-800`.
- `app/portal/conta/page.tsx`, `app/portal/conta/components/PlanComparator.tsx`, `app/portal/conta/components/ProgressBar.tsx`, `app/portal/conta/components/CancelSubscriptionModal.tsx`: uso de cores Tailwind diretas para faixas, alerts e progress.
- `app/portal/api-consumo/page.tsx`: cores diretas para gráficos e cards de consumo.
- `app/portal/credenciais/page.tsx`: cores diretas em badges de status de credenciais e em alertas de expiração.
- `app/portal/caixa-entrada/page.tsx`: cores diretas em chips de origem e prioridade.
- `app/portal/monitoramento/page.tsx`: cores diretas em status de monitoramento e nas barras de saúde.

### 2.3 Marketing, referência parcial

`app/(marketing)/page.tsx` usa um vocabulário próprio próximo da identidade verde institucional. Pode servir de referência para o tratamento de hero, números e seções de "como funciona". Não é referência para componentes de aplicação (cards de dado, tabelas, badges de status), que não existem na landing.

### 2.4 Onboarding e Auth

- `app/onboarding/api/[step]/page.tsx`: usa `slate-*` e/ou cores brutas.
- `app/(auth)/login` e `app/(auth)/signup`: precisam ser auditados durante a Fase 5; suspeita de uso genérico do shadcn sem tokens de marca.

## 3. Inconsistência de status badges

Existe um componente correto e centralizado em `components/ui/status-badge.tsx` que cobre os seis estados canônicos do produto (`localizado`, `capturado`, `enviado`, `entregue`, `falha-captura`, `falha-entrega`) usando tokens semânticos (`bg-info-light`, `bg-success-light`, `bg-brand-subtle`, `bg-danger-light`, `bg-warning-light`).

Apesar disso, várias páginas reimplementam status com lógica e paleta próprias:

- `app/ops/clientes/page.tsx` linha 131, função `StatusBadge` local que toma `Cliente['status']` (`ativo`, `inativo`, `suspenso`), domínio diferente do `StatusBadge` central. Precisa ou ser estendida no componente central, ou padronizada para usar variantes de `success` (ativo), `neutral`/`muted` (inativo), `warning` (suspenso).
- `app/ops/clientes/[id]/page.tsx` linha 210, outra `StatusBadge` local, com domínio ainda mais amplo (mistura status de cliente, de registro, de captura).
- `app/portal/documentos/page.tsx` linha 119, `getStatusColor` retornando classes `bg-green-100 text-green-700`, etc. Deveria delegar ao `StatusBadge` ou a uma variante adicional dele.
- `app/portal/alertas/page.tsx` linhas 140 e 151, `getStatusIcon` e `getStatusLabel` ad-hoc. Domínio é "delivery status" do alerta. Tratar como variante adicional do `StatusBadge`.
- `app/ops/registro/page.tsx` linhas 22 e 35, `getStatusColor` e `getStatusLabel` ad-hoc para um dos seis estados canônicos. Substituível 1 para 1 pelo `StatusBadge` central.
- `app/ops/registro/[id]/page.tsx` linha 21, `getStatusBadge` ad-hoc renderizando JSX. Substituível pelo `StatusBadge`.

Recomendação: estender `components/ui/status-badge.tsx` com domínios secundários (`ClientStatus`, `AlertDeliveryStatus`) numa API discriminada (`<StatusBadge kind="capture" state="..." />` ou um componente irmão) em vez de criar variantes paralelas.

## 4. Componentes duplicados ou ad-hoc

`components/ui/` já provê `button`, `card`, `checkbox`, `data-table`, `empty-state`, `metric-card`, `status-badge`, `tabs`, `timeline`. A auditoria identificou as seguintes situações que precisam ser revisadas na Fase 4:

- Cards: muitas páginas em `/ops/*` e `/portal/*` montam cartões com `div` mais `border` mais `rounded-lg` mais `p-*` em vez de usar `Card`, `CardHeader`, `CardContent`, `CardFooter`. Risco de espaçamento e sombra inconsistentes.
- Buttons: ao longo de `/portal/conta`, `/portal/credenciais` e `/ops/captura` existem botões com classes Tailwind diretas, sem usar `Button` com `variant`/`size`.
- Timeline: `app/ops/captura/[cnj]/components/timeline.tsx` é uma timeline própria. Conferir se pode reusar `components/ui/timeline.tsx`. Caso contrário, justificar a duplicação ou consolidar.
- MetricCard: vários KPIs em `/ops/dashboard`, `/ops/executivo`, `/portal/api-consumo` reimplementam o padrão "número grande mais label mais delta". Centralizar via `MetricCard`.
- DataTable: `app/ops/clientes/page.tsx` já usa `DataTable`. Confirmar nas demais listagens (`/ops/registro`, `/ops/retry-timeout`) que o mesmo padrão é seguido.
- EmptyState: páginas com listas vazias devem usar o componente, evitando ilustrações ad-hoc.
- Tabs e Checkbox: validar se `app/portal/conta` e telas de filtros usam os primitivos shadcn já presentes.

## 5. Tipografia de títulos de página

Não há um padrão único entre as rotas. Foram observados títulos com:

- `text-2xl font-bold` (sem `tracking`, sem cor explícita)
- `text-3xl font-semibold`
- `text-xl font-semibold text-slate-100` em `/ops`
- `text-2xl font-semibold tracking-tight` (próximo do alvo recomendado)

Padrão alvo proposto, sujeito a confirmação com o Brand Book: `text-2xl font-semibold tracking-tight text-neutral-900` para títulos de página, `text-sm text-neutral-500` para subtítulos. Aplicar de forma global no Fase 4.

## 6. Plano de execução proposto, alinhado ao briefing

A execução respeitará a ordem das cinco fases descritas no briefing, com um commit por fase, na branch `claude/fix-visual-inconsistencies-4m7bT`. Pré-requisito para Fase 1: disponibilizar o Brand Book SBK 2026 no repositório ou confirmar os valores canônicos abertamente neste documento. Sem isso, a Fase 1 é cega e há risco de troca por valores que não correspondem ao canônico.

Resumo das fases:

1. Fundação: tokens, fonte, reconciliação shadcn.
2. Layout `/ops`: remoção de `slate-950`, `orange-*`, `red-600`, distinção visual via tipografia, densidade e badges.
3. Status: consolidação no `StatusBadge`, remoção de `getStatusColor` ad-hoc.
4. Componentes: migração para `components/ui/*`, padronização de tipografia de títulos.
5. Onboarding e Auth: aplicar o mesmo design system.

Após cada fase, `npm run lint` e `npm run build` para verificação. Ao final, registro de eventuais warnings residuais.

## 7. Pontos abertos a confirmar antes da Fase 1

1. Valor hex canônico do `brand.DEFAULT` e suas variantes.
2. Existência e paleta de uma marca SBK IA, e onde ela deve ser usada no produto.
3. Família tipográfica canônica (presume-se `Plus Jakarta Sans`) e mapeamento exato de pesos Seminegrito e Leve para os pesos numéricos do Google Fonts.
4. Valores canônicos para `success`, `warning`, `danger`, `info`, dado que os atuais são valores Tailwind padrão e podem não estar no Brand Book.
5. Política do Brand Book sobre dark mode no produto (manter ou desativar).
