# Captura SBK 2.0 — Contexto de Produto

Captura SBK 2.0 é uma plataforma de dados jurídicos com três perfis (Portal, API, Enterprise). Tem dois portais distintos: Portal do Cliente (consumidores) e Portal Interno de Operações SBK (operadores). Estados canônicos do processo: Localizado, Capturado, Enviado, Entregue, Falha de Captura, Falha de Entrega. Fontes: PDPJ, DJE, TJs, PJe TRT, DataJud.

## Portais

### Portal do Cliente (/portal)

Interface self-service para clientes que contratam a plataforma.

- Caixa de Entrada: processos recentes capturados
- Monitoramento: acompanhamento de processos em observação
- Documentos: acesso a peças processuais
- Alertas: notificações configuradas pelo cliente
- Consumo de API: métricas de uso da API
- Credenciais: gestão de chaves de acesso
- Conta: dados cadastrais e plano contratado

### Portal Ops (/ops)

Interface interna para a equipe SBK operar a plataforma.

- Dashboard: visão geral de saúde operacional
- Captura por CNJ: consulta e status de captura de um processo específico
- Retry / Timeout: gestão de capturas com falha
- Clientes: gestão da base de clientes
- Executivo: indicadores de negócio

## Onboarding (/onboarding/:step)

Wizard de autoatendimento para novos clientes configurarem sua conta, escolherem tribunais monitorados e ativarem integrações.

## Decisões de Arquitetura

- Sem API routes: o projeto é 100% front-end com dados estáticos.
- Route groups `(marketing)` e `(auth)` não criam segmentos de URL.
- `/portal` e `/ops` têm layouts próprios com sidebar placeholder.
- Todos os mocks residem em `/lib/mocks/index.ts`.
- Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS v3, shadcn/ui (tema neutral), Inter (next/font/google).
