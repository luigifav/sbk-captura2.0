"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Pause, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface ConnectorStatus {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "failed";
  p95Latency: number;
  captures24h: number;
  successRate: number;
  lastHealthCheck: Date;
}

interface Alert {
  id: string;
  type: "volume_drop" | "error_spike" | "connector_down" | "expired_credential";
  client: string;
  connector: string;
  severity: "critical" | "warning";
  duration: string;
  createdAt: Date;
}

interface SuccessRateData {
  time: string;
  PDPJ: number;
  DJE: number;
  "TJ-SP": number;
  "TJ-RJ": number;
  "PJe TRT": number;
  DataJud: number;
}

const CONNECTORS = ["PDPJ", "DJE", "TJ-SP", "TJ-RJ", "PJe TRT", "DataJud"];

function generateConnectorData(): ConnectorStatus[] {
  return CONNECTORS.map((name) => ({
    id: name.toLowerCase().replace(" ", "-"),
    name,
    status: Math.random() > 0.15 ? "healthy" : Math.random() > 0.5 ? "degraded" : "failed",
    p95Latency: Math.floor(Math.random() * 800) + 100,
    captures24h: Math.floor(Math.random() * 5000) + 500,
    successRate: Math.random() * 8 + 92,
    lastHealthCheck: new Date(Date.now() - Math.random() * 3600000),
  }));
}

function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const types: Array<Alert["type"]> = ["volume_drop", "error_spike", "connector_down", "expired_credential"];
  const connectors = ["PDPJ", "DJE", "TJ-SP"];
  const clients = ["Cliente A", "Cliente B", "Cliente Crítico"];

  for (let i = 0; i < 5; i++) {
    const isCritical = Math.random() > 0.6;
    alerts.push({
      id: `alert-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      client: clients[Math.floor(Math.random() * clients.length)],
      connector: connectors[Math.floor(Math.random() * connectors.length)],
      severity: isCritical ? "critical" : "warning",
      duration: `${Math.floor(Math.random() * 120) + 5}m`,
      createdAt: new Date(Date.now() - Math.random() * 7200000),
    });
  }

  return alerts.sort((a, b) => {
    if (a.severity === "critical" && b.severity !== "critical") return -1;
    if (a.severity !== "critical" && b.severity === "critical") return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

function generateSuccessRateData(): SuccessRateData[] {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - (23 - i));
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit" });
  });

  return hours.map((time) => ({
    time,
    PDPJ: Math.random() * 8 + 92,
    DJE: Math.random() * 6 + 94,
    "TJ-SP": Math.random() * 9 + 91,
    "TJ-RJ": Math.random() * 7 + 93,
    "PJe TRT": Math.random() * 10 + 90,
    DataJud: Math.random() * 5 + 95,
  }));
}

function getAlertTypeLabel(type: Alert["type"]): string {
  const labels = {
    volume_drop: "Queda de volume",
    error_spike: "Spike de erro",
    connector_down: "Conector down",
    expired_credential: "Credencial expirada",
  };
  return labels[type];
}

function getStatusBadge(status: string): React.ReactNode {
  const styles = {
    healthy: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700",
    degraded: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700",
    failed: "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700",
  };

  const labels = {
    healthy: "Saudável",
    degraded: "Degradado",
    failed: "Falha",
  };

  return (
    <span className={styles[status as keyof typeof styles]}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {labels[status as keyof typeof labels]}
    </span>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}

export default function DashboardPage() {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>(generateConnectorData());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());
  const [successData, setSuccessData] = useState<SuccessRateData[]>(generateSuccessRateData());
  const [pauseConfirming, setPauseConfirming] = useState<string | null>(null);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [captures24h, setCaptures24h] = useState(12543);
  const [sparklineData, setSparklineData] = useState(Array.from({ length: 24 }, () => Math.random() * 500 + 200));

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectors((prev) =>
        prev.map((c) => ({
          ...c,
          p95Latency: Math.max(100, c.p95Latency + (Math.random() - 0.5) * 100),
          successRate: Math.max(85, Math.min(100, c.successRate + (Math.random() - 0.5) * 2)),
          lastHealthCheck: new Date(),
        }))
      );

      setAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          duration: `${Math.floor(Math.random() * 120) + 5}m`,
        }))
      );

      setSuccessData((prev) =>
        prev.map((d) => ({
          ...d,
          PDPJ: Math.random() * 8 + 92,
          DJE: Math.random() * 6 + 94,
          "TJ-SP": Math.random() * 9 + 91,
          "TJ-RJ": Math.random() * 7 + 93,
          "PJe TRT": Math.random() * 10 + 90,
          DataJud: Math.random() * 5 + 95,
        }))
      );

      setSparklineData((prev) => [
        ...prev.slice(1),
        Math.random() * 500 + 200,
      ]);

      setCaptures24h((prev) => prev + Math.floor(Math.random() * 50) - 10);
      setActiveAlerts((prev) => Math.max(0, prev + (Math.random() > 0.7 ? 1 : -1)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const healthyCount = connectors.filter((c) => c.status === "healthy").length;
  const avgSuccessRate = (connectors.reduce((sum, c) => sum + c.successRate, 0) / connectors.length).toFixed(1);
  const successDelta = (Math.random() - 0.5) * 2;

  const alertColumns: ColumnDef<Alert>[] = [
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => getAlertTypeLabel(row.original.type),
    },
    {
      accessorKey: "client",
      header: "Cliente",
    },
    {
      accessorKey: "connector",
      header: "Conector",
    },
    {
      accessorKey: "duration",
      header: "Duração",
    },
    {
      accessorKey: "severity",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Acknowledge
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Resolver
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard Operacional</h1>
        <p className="mt-1 text-sm text-neutral-500">Monitoramento em tempo real dos conectores e alertas</p>
      </div>

      {/* Linha 1: Métricas */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Capturas últimas 24h"
          value={captures24h.toLocaleString("pt-BR")}
          sparkline={sparklineData}
          description="distribuição horária"
        />
        <MetricCard
          label="Taxa de sucesso global"
          value={`${avgSuccessRate}%`}
          delta={successDelta}
          description="vs ontem"
        />
        <MetricCard
          label="Alertas ativos"
          value={activeAlerts}
          className={activeAlerts > 0 ? "border-red-200 bg-red-50" : ""}
          description={activeAlerts > 0 ? "Atenção necessária" : "Tudo bem"}
        />
        <MetricCard
          label="Conectores saudáveis"
          value={`${healthyCount} de ${connectors.length}`}
          description={`Último check: agora`}
        />
      </div>

      {/* Linha 2: Status dos conectores */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Status dos Conectores</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {connectors.map((connector) => (
            <Card key={connector.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-900">{connector.name}</h3>
                    <div className="mt-1">{getStatusBadge(connector.status)}</div>
                  </div>
                  {pauseConfirming === connector.id ? (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setPauseConfirming(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        onClick={() => {
                          setPauseConfirming(null);
                        }}
                      >
                        Confirmar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      onClick={() => setPauseConfirming(connector.id)}
                    >
                      <Pause className="h-3 w-3" />
                      Pausar
                    </Button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Latência p95:</span>
                    <span className="font-medium">{connector.p95Latency.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Capturas 24h:</span>
                    <span className="font-medium">{connector.captures24h.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Taxa sucesso:</span>
                    <span className="font-medium">{connector.successRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Último check:</span>
                    <span className="font-medium">{formatTime(connector.lastHealthCheck)}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full text-xs">
                  Ver detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Linha 3: Alertas ativos */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Alertas Ativos</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Conector</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Duração</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {alerts.map((alert) => (
                    <tr
                      key={alert.id}
                      className={
                        alert.severity === "critical"
                          ? "bg-red-50 hover:bg-red-100"
                          : "hover:bg-neutral-50"
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {alert.severity === "critical" && (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{getAlertTypeLabel(alert.type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{alert.client}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
                          {alert.connector}
                        </span>
                      </td>
                      <td className="px-4 py-3">{alert.duration}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Resolver
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Linha 4: Gráfico de taxa de sucesso */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Taxa de Sucesso por Fonte (24h)</h2>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={successData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[85, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#374151" }}
              />
              <Legend />
              <ReferenceLine
                y={95}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: "Threshold 95%", position: "right", fill: "#ef4444", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="PDPJ" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="DJE" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="TJ-SP" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="TJ-RJ" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="PJe TRT" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="DataJud" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
