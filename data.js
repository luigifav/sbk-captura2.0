# Prompt inicial para o Claude Code

Cole este prompt na primeira mensagem ao abrir o Claude Code dentro do seu repositório do **Captura SBK 2.0**.

---

```
Recebi um pacote de design handoff para o redesign do Captura SBK 2.0. Os arquivos
estão em ./design_handoff_captura_sbk_2.0/ na raiz deste repo.

Quero que você integre esse design ao codebase de produção. Antes de começar:

1. Leia ./design_handoff_captura_sbk_2.0/README.md inteiro — ele explica o que é,
   o que é design (não copiar direto) e o que é design system (copiar).

2. Faça um tour pelo meu repo atual e me diga:
   - Qual o framework (Next.js / Vite / outro)
   - Qual a biblioteca de componentes em uso (shadcn / Radix / custom / etc)
   - Como está organizada a estrutura de pastas
   - Como funciona o roteamento entre /ops e /portal hoje (se já existir)
   - Que tokens de design já existem (Tailwind config? CSS vars? styled-components theme?)

3. Compare o que existe hoje vs o que o handoff propõe. Me liste:
   - Quais arquivos do handoff devem ser COPIADOS direto (ex: sbk-tokens.css)
   - Quais devem ser RECRIADOS usando os componentes do meu codebase
   - Quais conflitam com algo existente e precisam de decisão minha

4. NÃO comece a implementar ainda. Me apresente o plano primeiro, em fases:
   - Fase 1: tokens + primitives (Icon, StatusBadge, MetricCard, PageHeader)
   - Fase 2: AppShell com variante ops/portal
   - Fase 3: telas do /ops em ordem de impacto
   - Fase 4: telas do /portal
   - Fase 5: drawer Lum.IA + integração MCP

5. Crie uma branch nova `redesign/captura-2.0` e faça commits pequenos por fase,
   com mensagens em português no padrão Conventional Commits
   (feat:, refactor:, style: etc).

Quando o plano estiver aprovado, implemente uma fase por vez e abra um PR ao final.

Importante:
- NÃO copie a estrutura `window.X = X` dos arquivos .jsx do handoff — era só
  para o protótipo single-file. Use ESM normal (import/export).
- NÃO copie data.js — substitua pelas chamadas reais à API.
- A fonte é Plus Jakarta Sans (body) + Fraunces (display) + JetBrains Mono.
  Já estão importadas via Google Fonts no protótipo, replique no app.
- Os 6 estados canônicos de status são sagrados: localizado, capturado, enviado,
  entregue, falha-captura, falha-entrega. Não invente novos.
- A paleta /ops é verde-profundo (#012824) → /portal é off-white (#ECEFF3).
  Nada de slate, orange ou red soltos.

Pode começar.
```

---

## Como usar

1. **Baixe o pacote** que o Claude te entregou no chat
2. **Descompacte na raiz do seu repo** do Captura SBK 2.0 — vai criar a pasta `design_handoff_captura_sbk_2.0/`
3. **Abra o Claude Code** nesse diretório (`claude` no terminal, dentro do repo)
4. **Cole o prompt acima** na primeira mensagem
5. O Claude Code vai fazer o tour, te apresentar o plano, e implementar fase por fase

## Dica

Se o seu repo é monorepo (apps/web, apps/api, etc), coloque o handoff
**na raiz do monorepo** mesmo, não dentro de uma app. Assim o Claude Code
consegue ver a estrutura inteira e decidir onde encaixar cada coisa.
