"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, type CaptureStatus } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Timeline, type TimelineEvent } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";

/* ─── Utilitários ────────────────────────────────────────── */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-200 py-12">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-400">
      {children}
    </p>
  );
}

/* ─── Mock data para DataTable ───────────────────────────── */

interface CapturaRow {
  id: string;
  cnj: string;
  tribunal: string;
  status: CaptureStatus;
  dataCaptura: string;
  responsavel: string;
}

const mockData: CapturaRow[] = [
  {
    id: "1",
    cnj: "0001234-12.2024.8.26.0100",
    tribunal: "TJSP",
    status: "entregue",
    dataCaptura: "29/04/2024 14:32",
    responsavel: "Bot-01",
  },
  {
    id: "2",
    cnj: "0002345-23.2024.8.19.0001",
    tribunal: "TJRJ",
    status: "capturado",
    dataCaptura: "29/04/2024 13:10",
    responsavel: "Bot-02",
  },
  {
    id: "3",
    cnj: "0003456-34.2024.4.03.6100",
    tribunal: "TRF3",
    status: "enviado",
    dataCaptura: "29/04/2024 12:55",
    responsavel: "Bot-01",
  },
  {
    id: "4",
    cnj: "0004567-45.2024.8.26.0050",
    tribunal: "TJSP",
    status: "falha-captura",
    dataCaptura: "29/04/2024 11:20",
    responsavel: "Bot-03",
  },
  {
    id: "5",
    cnj: "0005678-56.2024.8.13.0024",
    tribunal: "TJBA",
    status: "localizado",
    dataCaptura: "29/04/2024 10:05",
    responsavel: "Bot-02",
  },
  {
    id: "6",
    cnj: "0006789-67.2024.5.15.0013",
    tribunal: "TRT15",
    status: "falha-entrega",
    dataCaptura: "28/04/2024 22:40",
    responsavel: "Bot-04",
  },
];

const columns: ColumnDef<CapturaRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "cnj",
    header: "CNJ",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-neutral-700">{row.original.cnj}</span>
    ),
  },
  {
    accessorKey: "tribunal",
    header: "Tribunal",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-neutral-800">
        {row.original.tribunal}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge state={row.original.status} />,
  },
  {
    accessorKey: "dataCaptura",
    header: "Capturado em",
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-neutral-500">
        {row.original.dataCaptura}
      </span>
    ),
  },
  {
    accessorKey: "responsavel",
    header: "Bot",
    cell: ({ row }) => (
      <span className="text-xs text-neutral-500">{row.original.responsavel}</span>
    ),
  },
];

/* ─── Mock data para Timeline ────────────────────────────── */

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    timestamp: new Date("2024-04-29T14:32:10"),
    label: "Documento entregue ao cliente",
    description: "PDF enviado via webhook para o endpoint configurado.",
    status: "success",
    metadata: { Tamanho: "842 KB", Páginas: "12" },
  },
  {
    id: "2",
    timestamp: new Date("2024-04-29T14:31:45"),
    label: "Documento enviado para processamento",
    status: "info",
    description: "Enfileirado no worker de entrega.",
  },
  {
    id: "3",
    timestamp: new Date("2024-04-29T14:30:02"),
    label: "Captura concluída",
    description: "Download do PDF realizado com sucesso.",
    status: "success",
    metadata: { Bot: "Bot-01", Tentativas: "1" },
  },
  {
    id: "4",
    timestamp: new Date("2024-04-29T14:29:11"),
    label: "Processo localizado no TJSP",
    status: "info",
    metadata: { Vara: "4ª Vara Cível", Comarca: "São Paulo" },
  },
  {
    id: "5",
    timestamp: new Date("2024-04-29T14:28:00"),
    label: "Solicitação recebida",
    description: "CNJ validado. Captura iniciada.",
    status: "default",
  },
];

/* ─── Página ─────────────────────────────────────────────── */

export default function ComponentsPage() {
  const [tableData, setTableData] = useState(mockData);
  const [page, setPage] = useState(0);

  const pageSize = 4;
  const pagedData = tableData.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      {/* Header */}
      <header className="border-b border-neutral-200 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          Captura SBK 2.0
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
          Design System
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Rota interna para revisao visual dos componentes. Nao indexado.
        </p>
      </header>

      {/* ── Tokens de cor ────────────────────────────────────── */}
      <Section
        title="Tokens de cor"
        description="Paleta de marca e estados semanticos."
      >
        <div className="space-y-4">
          <div>
            <Label>Marca</Label>
            <div className="flex gap-2">
              {[
                { bg: "bg-brand", label: "brand", hex: "#023631" },
                { bg: "bg-brand-hover", label: "hover", hex: "#075056" },
                { bg: "bg-brand-light", label: "light", hex: "#0a7a82" },
                { bg: "bg-brand-subtle", label: "subtle", hex: "#e6f0ef", dark: true },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-10 w-16 rounded-md border border-neutral-200 ${t.bg}`}
                  />
                  <span className="text-xs text-neutral-500">{t.label}</span>
                  <span className="text-2xs font-mono text-neutral-400">{t.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Semanticos</Label>
            <div className="flex gap-2">
              {[
                { bg: "bg-success", label: "success", hex: "#16a34a" },
                { bg: "bg-warning", label: "warning", hex: "#d97706" },
                { bg: "bg-danger", label: "danger", hex: "#dc2626" },
                { bg: "bg-info", label: "info", hex: "#2563eb" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-10 w-16 rounded-md ${t.bg}`}
                  />
                  <span className="text-xs text-neutral-500">{t.label}</span>
                  <span className="text-2xs font-mono text-neutral-400">{t.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Neutros</Label>
            <div className="flex gap-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((n) => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-8 w-8 rounded border border-neutral-200 bg-neutral-${n}`}
                  />
                  <span className="text-2xs text-neutral-400">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── StatusBadge ──────────────────────────────────────── */}
      <Section
        title="StatusBadge"
        description="Seis estados do fluxo de captura. Aceita prop size=sm|md."
      >
        <div className="space-y-4">
          <div>
            <Label>Tamanho md (default)</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "localizado",
                  "capturado",
                  "enviado",
                  "entregue",
                  "falha-captura",
                  "falha-entrega",
                ] as CaptureStatus[]
              ).map((s) => (
                <StatusBadge key={s} state={s} />
              ))}
            </div>
          </div>
          <div>
            <Label>Tamanho sm</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "localizado",
                  "capturado",
                  "enviado",
                  "entregue",
                  "falha-captura",
                  "falha-entrega",
                ] as CaptureStatus[]
              ).map((s) => (
                <StatusBadge key={s} state={s} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── MetricCard ───────────────────────────────────────── */}
      <Section
        title="MetricCard"
        description="Card compacto para dashboards. Sparkline e delta opcionais."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetricCard
            label="Capturas hoje"
            value="1.284"
            delta={12.3}
            sparkline={[40, 55, 47, 60, 72, 65, 80, 74, 88, 92]}
            description="vs. ontem"
          />
          <MetricCard
            label="Taxa de sucesso"
            value="97,4%"
            delta={-0.8}
            sparkline={[98, 97.5, 98.2, 96.8, 97.1, 97.9, 97.3, 97.4]}
            description="ultimos 7d"
          />
          <MetricCard
            label="Falhas"
            value="34"
            delta={-22.1}
            description="vs. ontem"
          />
          <MetricCard
            label="Tempo medio"
            value="4,2s"
            delta={5.6}
            sparkline={[3.8, 4.1, 3.9, 4.5, 4.3, 4.0, 4.2]}
          />
        </div>

        <div className="mt-4">
          <Label>Estado loading</Label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard label="" value="" loading />
            <MetricCard label="" value="" loading />
          </div>
        </div>
      </Section>

      {/* ── DataTable ────────────────────────────────────────── */}
      <Section
        title="DataTable"
        description="Wrapper sobre tanstack/react-table com paginacao cursor-based, busca, filtros e selecao em lote."
      >
        <DataTable
          columns={columns}
          data={pagedData}
          searchKey="cnj"
          searchPlaceholder="Buscar por CNJ..."
          filterGroups={[
            {
              columnId: "tribunal",
              label: "Tribunal",
              options: [
                { id: "tjsp", label: "TJSP", value: "TJSP" },
                { id: "tjrj", label: "TJRJ", value: "TJRJ" },
                { id: "trf3", label: "TRF3", value: "TRF3" },
              ],
            },
            {
              columnId: "status",
              label: "Status",
              options: [
                { id: "entregue", label: "Entregue", value: "entregue" },
                { id: "falha", label: "Falha", value: "falha-captura" },
              ],
            },
          ]}
          bulkActions={[
            {
              label: "Re-processar",
              onClick: (rows) => alert(`Re-processar ${rows.length} linhas`),
            },
            {
              label: "Remover",
              variant: "destructive",
              onClick: (rows) => {
                const ids = rows.map((r) => r.id);
                setTableData((prev) => prev.filter((r) => !ids.includes(r.id)));
              },
            },
          ]}
          pagination={{
            hasNextPage: (page + 1) * pageSize < tableData.length,
            hasPrevPage: page > 0,
            onNextPage: () => setPage((p) => p + 1),
            onPrevPage: () => setPage((p) => p - 1),
            totalCount: tableData.length,
            pageSize,
          }}
        />

        <div className="mt-6">
          <Label>Estado loading</Label>
          <DataTable columns={columns} data={[]} loading />
        </div>
      </Section>

      {/* ── EmptyState ───────────────────────────────────────── */}
      <Section
        title="EmptyState"
        description="Quatro variacoes de ilustracao. CTA opcional."
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {(
            [
              {
                variant: "empty" as const,
                title: "Nenhum processo",
                description: "Adicione um CNJ para iniciar a captura.",
                cta: "Adicionar processo" as string | undefined,
              },
              {
                variant: "search" as const,
                title: "Sem resultados",
                description: "Tente ajustar os filtros aplicados.",
                cta: undefined as string | undefined,
              },
              {
                variant: "error" as const,
                title: "Algo deu errado",
                description: "Erro ao carregar os dados. Tente novamente.",
                cta: "Tentar novamente" as string | undefined,
              },
              {
                variant: "no-data" as const,
                title: "Sem dados no periodo",
                description: "Nenhuma captura realizada no intervalo selecionado.",
                cta: undefined as string | undefined,
              },
            ]
          ).map((item) => (
            <div
              key={item.variant}
              className="rounded-lg border border-neutral-200 bg-white"
            >
              <EmptyState
                illustration={item.variant}
                title={item.title}
                description={item.description}
                compact
                cta={
                  item.cta
                    ? { label: item.cta, onClick: () => {} }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <Section
        title="Timeline"
        description="Drill-down de captura com eventos cronologicos, duracao entre steps e metadados."
      >
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Label>Padrao</Label>
            <div className="rounded-lg border border-neutral-200 bg-white p-5">
              <Timeline events={timelineEvents} />
            </div>
          </div>
          <div>
            <Label>Compacto</Label>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <Timeline events={timelineEvents} compact />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Buttons ──────────────────────────────────────────── */}
      <Section title="Buttons" description="Variantes e tamanhos.">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-brand hover:bg-brand-hover text-brand-foreground">
            Primario
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            className="bg-brand hover:bg-brand-hover text-brand-foreground"
          >
            Pequeno
          </Button>
          <Button className="bg-brand hover:bg-brand-hover text-brand-foreground">
            Medio
          </Button>
          <Button
            size="lg"
            className="bg-brand hover:bg-brand-hover text-brand-foreground"
          >
            Grande
          </Button>
          <Button disabled className="bg-brand text-brand-foreground">
            Desabilitado
          </Button>
        </div>
      </Section>

      {/* ── Tipografia ───────────────────────────────────────── */}
      <Section title="Tipografia" description="Escala e pesos.">
        <div className="space-y-3">
          {[
            { cls: "text-3xl font-bold", label: "3xl / bold", text: "Infraestrutura de dados juridicos" },
            { cls: "text-2xl font-semibold", label: "2xl / semibold", text: "Captura SBK 2.0" },
            { cls: "text-xl font-semibold", label: "xl / semibold", text: "Dashboard de operacoes" },
            { cls: "text-lg font-medium", label: "lg / medium", text: "Processos em andamento" },
            { cls: "text-base font-normal", label: "base / regular", text: "O processo foi localizado e aguarda captura pelo robo designado." },
            { cls: "text-sm font-normal text-neutral-500", label: "sm / regular / muted", text: "Atualizado ha 3 minutos. Proximo ciclo em 12 minutos." },
            { cls: "text-xs font-medium uppercase tracking-widest text-neutral-400", label: "xs / caps", text: "TRIBUNAL ESTADUAL" },
            { cls: "font-mono text-xs text-neutral-600", label: "mono / xs", text: "0001234-12.2024.8.26.0100" },
          ].map((item) => (
            <div key={item.label} className="flex items-baseline gap-6">
              <span className="w-48 shrink-0 text-xs text-neutral-400">{item.label}</span>
              <p className={item.cls}>{item.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
