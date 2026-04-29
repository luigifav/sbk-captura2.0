"use client";

import { useState, useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  mockRetryProcessosPush,
  mockRetryProcessosPull,
  mockAlertRegras,
  type RetryProcessoPush,
  type RetryProcessoPull,
  type AlertRegra,
} from "@/lib/mocks/retry";

export default function RetryTimeoutPage() {
  const [selectedTab, setSelectedTab] = useState("retry-push");
  const [selectedPushRows, setSelectedPushRows] = useState<RetryProcessoPush[]>([]);
  const [selectedPullRows, setSelectedPullRows] = useState<RetryProcessoPull[]>([]);
  const [filterCliente, setFilterCliente] = useState("");
  const [filterCanal, setFilterCanal] = useState("");
  const [filterDiasRetry, setFilterDiasRetry] = useState(30);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");

  const clientesUnicos = Array.from(
    new Set(mockRetryProcessosPush.map((p) => p.cliente))
  );
  const canaisUnicos = Array.from(
    new Set(mockRetryProcessosPush.map((p) => p.canal))
  );

  const filteredPushData = useMemo(() => {
    return mockRetryProcessosPush.filter((p) => {
      if (filterCliente && p.cliente !== filterCliente) return false;
      if (filterCanal && p.canal !== filterCanal) return false;
      if (p.dias_em_retry > filterDiasRetry) return false;
      return true;
    });
  }, [filterCliente, filterCanal, filterDiasRetry]);

  const metricsRetryAtivo = useMemo(() => {
    const totalAtivos = mockRetryProcessosPush.length;
    const hoje = mockRetryProcessosPush.filter((p) => p.status === "ativo").length;
    const ontemData = new Date();
    ontemData.setDate(ontemData.getDate() - 1);
    const ontem = mockRetryProcessosPush.filter(
      (p) => p.timestamp_inicio_retry < ontemData && p.status === "ativo"
    ).length;

    const delta = ontem > 0 ? ((hoje - ontem) / ontem) * 100 : 0;

    return {
      total: totalAtivos,
      delta: delta,
      sparkline: [15, 18, 14, 22, 19, 24, 21],
    };
  }, []);

  const metricsTimeoutConsumo = useMemo(() => {
    const totalTimeout = mockRetryProcessosPull.length;
    const delta = -5.2;

    return {
      total: totalTimeout,
      delta: delta,
      sparkline: [28, 25, 22, 24, 20, 18, 16],
    };
  }, []);

  const metricsTempoMédio = useMemo(() => {
    const tempoMedio =
      mockRetryProcessosPush.reduce((acc, p) => acc + p.dias_em_retry, 0) /
      mockRetryProcessosPush.length;

    const horas = Math.round(tempoMedio * 24);

    return {
      value: `${horas}h`,
      description: `Média: ${tempoMedio.toFixed(1)} dias`,
    };
  }, []);

  const handleBulkAction = (action: string, rows: RetryProcessoPush[]) => {
    if (rows.length === 0) return;

    if (rows.length > 500) {
      alert("Limite máximo: 500 processos por ação");
      return;
    }

    setBulkAction(action);
    setShowBulkModal(true);
  };

  const confirmBulkAction = () => {
    if (bulkAction === "forcar-tentativa") {
      alert(
        `Forçando nova tentativa imediata para ${selectedPushRows.length} processos...`
      );
    } else if (bulkAction === "alterar-canal") {
      alert(
        `Alterando canal de entrega para ${selectedPushRows.length} processos...`
      );
    } else if (bulkAction === "marcar-entregue") {
      alert(
        `Marcando como entregue manualmente ${selectedPushRows.length} processos...`
      );
    } else if (bulkAction === "cancelar") {
      alert(`Cancelando tentativas futuras para ${selectedPushRows.length} processos...`);
    }

    setShowBulkModal(false);
    setSelectedPushRows([]);
  };

  const pushColumns = [
    {
      id: "select",
      header: "Selec",
      cell: () => null,
      enableSorting: false,
    },
    {
      accessorKey: "cnj",
      header: "CNJ",
      cell: (info: any) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
    },
    {
      accessorKey: "canal",
      header: "Canal",
      cell: (info: any) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "numero_tentativas",
      header: "Tentativas",
      cell: (info: any) => (
        <span className="font-medium">
          {info.getValue()} de {info.row.original.tentativas_totais}
        </span>
      ),
    },
    {
      accessorKey: "ultima_tentativa",
      header: "Última Tentativa",
      cell: (info: any) => format(info.getValue(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    {
      accessorKey: "proxima_tentativa",
      header: "Próxima Tentativa",
      cell: (info: any) => format(info.getValue(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    {
      accessorKey: "ultimo_erro",
      header: "Último Erro",
      cell: (info: any) => (
        <div className="max-w-xs truncate text-xs text-neutral-600">
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorKey: "dias_em_retry",
      header: "Dias em Retry",
      cell: (info: any) => {
        const dias = info.getValue();
        return (
          <span
            className={dias > 15 ? "font-bold text-danger" : "text-neutral-700"}
          >
            {dias}d
          </span>
        );
      },
    },
  ];

  const pullColumns = [
    {
      id: "select",
      header: "Selec",
    },
    {
      accessorKey: "cnj",
      header: "CNJ",
      cell: (info: any) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
    },
    {
      accessorKey: "canal_pull",
      header: "Canal Pull",
      cell: (info: any) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "dias_desde_disponibilizacao",
      header: "Dias Disponível",
      cell: (info: any) => <span>{info.getValue()}d</span>,
    },
    {
      accessorKey: "ultimo_acesso",
      header: "Último Acesso",
      cell: (info: any) => format(info.getValue(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info: any) => {
        const status = info.getValue();
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              status === "expirado" ? "text-danger" : "text-success"
            }`}
          >
            {status === "expirado" ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <CheckCircle2 className="h-3 w-3" />
            )}
            {status === "expirado" ? "Expirado" : "Ativo"}
          </span>
        );
      },
    },
  ];

  const alertColumns = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "cliente",
      header: "Cliente",
      cell: (info: any) => info.getValue() || "Todos",
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (info: any) => {
        const tipo = info.getValue();
        return tipo === "retry_simultaneo" ? "Retry Simultâneo" : "Duração Retry";
      },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: (info: any) => (
        <div className="max-w-sm text-xs text-neutral-600">{info.getValue()}</div>
      ),
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: (info: any) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            info.getValue() ? "text-success" : "text-neutral-500"
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          {info.getValue() ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      accessorKey: "modificado_em",
      header: "Modificado",
      cell: (info: any) =>
        formatDistanceToNow(info.getValue(), { locale: ptBR, addSuffix: true }),
    },
  ];

  const pushBulkActions = [
    {
      label: "Forçar Tentativa",
      onClick: () => handleBulkAction("forcar-tentativa", selectedPushRows),
    },
    {
      label: "Alterar Canal",
      onClick: () => handleBulkAction("alterar-canal", selectedPushRows),
    },
    {
      label: "Marcar Entregue",
      onClick: () => handleBulkAction("marcar-entregue", selectedPushRows),
      variant: "outline" as const,
    },
    {
      label: "Cancelar",
      onClick: () => handleBulkAction("cancelar", selectedPushRows),
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Retry / Timeout</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Gerenciamento centralizado de processos em retry e timeout
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Em Retry Ativo (Push)"
          value={metricsRetryAtivo.total}
          delta={metricsRetryAtivo.delta}
          sparkline={metricsRetryAtivo.sparkline}
          description="últimos 7 dias"
        />
        <MetricCard
          label="Em Timeout de Consumo (Pull)"
          value={metricsTimeoutConsumo.total}
          delta={metricsTimeoutConsumo.delta}
          sparkline={metricsTimeoutConsumo.sparkline}
          description="últimos 7 dias"
        />
        <MetricCard
          label="Tempo Médio em Retry"
          value={metricsTempoMédio.value}
          description={metricsTempoMédio.description}
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="retry-push">Retry Ativo (Push)</TabsTrigger>
          <TabsTrigger value="timeout-pull">Timeout de Consumo (Pull)</TabsTrigger>
          <TabsTrigger value="alertas">Alertas Configurados</TabsTrigger>
        </TabsList>

        <TabsContent value="retry-push">
          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    Cliente
                  </label>
                  <select
                    value={filterCliente}
                    onChange={(e) => setFilterCliente(e.target.value)}
                    className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2 text-sm"
                  >
                    <option value="">Todos</option>
                    {clientesUnicos.map((cliente) => (
                      <option key={cliente} value={cliente}>
                        {cliente}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    Canal
                  </label>
                  <select
                    value={filterCanal}
                    onChange={(e) => setFilterCanal(e.target.value)}
                    className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2 text-sm"
                  >
                    <option value="">Todos</option>
                    {canaisUnicos.map((canal) => (
                      <option key={canal} value={canal}>
                        {canal}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    Dias em Retry: até {filterDiasRetry}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={filterDiasRetry}
                    onChange={(e) => setFilterDiasRetry(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <DataTable
              columns={pushColumns}
              data={filteredPushData}
              searchKey="cnj"
              searchPlaceholder="Buscar por CNJ..."
              onSelectionChange={setSelectedPushRows}
              bulkActions={selectedPushRows.length > 0 ? pushBulkActions : []}
              emptyMessage="Nenhum processo em retry encontrado"
            />
          </div>
        </TabsContent>

        <TabsContent value="timeout-pull">
          <div className="space-y-4">
            <DataTable
              columns={pullColumns}
              data={mockRetryProcessosPull}
              searchKey="cnj"
              searchPlaceholder="Buscar por CNJ..."
              onSelectionChange={setSelectedPullRows}
              emptyMessage="Nenhum processo em timeout encontrado"
            />
          </div>
        </TabsContent>

        <TabsContent value="alertas">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Regra
              </Button>
            </div>

            <DataTable
              columns={alertColumns}
              data={mockAlertRegras}
              emptyMessage="Nenhuma regra de alerta configurada"
            />
          </div>
        </TabsContent>
      </Tabs>

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-neutral-200 max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Confirmar Ação em Lote
            </h2>
            <p className="text-sm text-neutral-600">
              Você está prestes a executar uma ação em{" "}
              <span className="font-semibold">{selectedPushRows.length} processos</span>.
              Esta ação não pode ser desfeita. Deseja continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowBulkModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="default" onClick={confirmBulkAction}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
