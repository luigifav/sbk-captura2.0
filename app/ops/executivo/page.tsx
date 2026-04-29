'use client';

import { MetricCard } from '@/components/ui/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import {
  mockClientesOps,
  mockMRRHistorico,
  mockVolumesPorFonte,
  mockAnomalias,
  mockKRs,
} from '@/lib/mocks/clientes-ops';
import { format, differenceInDays } from 'date-fns';

export default function ExecutivoPage() {
  const clientesAtivos = mockClientesOps.filter((c) => c.status === 'ativo').length;
  const clientesAPI = mockClientesOps.filter((c) => c.plano === 'API' && c.status === 'ativo').length;
  const clientesEnterprise = mockClientesOps.filter((c) => c.plano === 'Enterprise' && c.status === 'ativo').length;
  const clientesPortal = mockClientesOps.filter((c) => c.plano === 'Portal' && c.status === 'ativo').length;

  const mrrTotal = mockClientesOps.reduce((sum, c) => sum + c.mrr, 0);
  const volumeTotal = mockVolumesPorFonte.reduce((sum, v) => sum + v.volume, 0);
  const nps = 72;

  const topClientes = mockClientesOps
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 10);

  const columns = [
    {
      accessorKey: 'nome',
      header: 'Cliente',
      cell: ({ row }: any) => <span className="font-medium">{row.original.nome}</span>,
    },
    {
      accessorKey: 'plano',
      header: 'Plano',
      cell: ({ row }: any) => (
        <span className="inline-block rounded px-2 py-1 text-xs font-medium"
          style={{
            backgroundColor: row.original.plano === 'Enterprise' ? '#e0e7ff' : row.original.plano === 'API' ? '#dcfce7' : '#f3e8ff',
            color: row.original.plano === 'Enterprise' ? '#4f46e5' : row.original.plano === 'API' ? '#16a34a' : '#a855f7',
          }}>
          {row.original.plano}
        </span>
      ),
    },
    {
      accessorKey: 'volume_capturado_24h',
      header: 'Volume 30d',
      cell: ({ row }: any) => <span>{(row.original.volume_capturado_24h * 30).toLocaleString()}</span>,
    },
    {
      accessorKey: 'mrr',
      header: 'MRR',
      cell: ({ row }: any) => <span>R$ {row.original.mrr.toLocaleString('pt-BR')}</span>,
    },
    {
      accessorKey: 'growth',
      header: 'Taxa Crescimento',
      cell: ({ row }: any) => {
        const growth = Math.floor(Math.random() * 40) - 5;
        return (
          <span className={growth >= 0 ? 'text-green-600' : 'text-red-600'}>
            {growth >= 0 ? '+' : ''}{growth}%
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status Saúde',
      cell: ({ row }: any) => {
        const statusMap = {
          ativo: { label: 'Saudável', color: '#10b981' },
          inativo: { label: 'Em risco', color: '#f59e0b' },
          suspenso: { label: 'Suspenso', color: '#ef4444' },
        };
        const s = statusMap[row.original.status];
        return (
          <span style={{ color: s.color }} className="font-medium">
            {s.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Executivo</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Indicadores de negócio da plataforma
        </p>
      </div>

      {/* Linha 1: Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="MRR Total"
          value={`R$ ${(mrrTotal / 1000).toFixed(1)}k`}
          delta={8.2}
          sparkline={[4500, 5200, 4800, 5900, 5100, 6200, 5800]}
        />
        <MetricCard
          label="Clientes Ativos"
          value={clientesAtivos}
          description={`Portal: ${clientesPortal}, API: ${clientesAPI}, Enterprise: ${clientesEnterprise}`}
          delta={5.5}
        />
        <MetricCard
          label="Volume Capturado (30d)"
          value={`${(volumeTotal / 1000).toFixed(1)}k`}
          delta={12.3}
          sparkline={[2200, 2600, 2400, 2900, 2700, 3100, 3200]}
        />
        <MetricCard
          label="NPS Produto"
          value={nps}
          description="Último survey"
          delta={-2.1}
        />
      </div>

      {/* Linha 2: Gráficos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Gráfico MRR por plano */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">MRR por Plano (12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockMRRHistorico}>
                <defs>
                  <linearGradient id="colorPortal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAPI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEnterprise" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Portal"
                  stackId="1"
                  stroke="#a855f7"
                  fillOpacity={1}
                  fill="url(#colorPortal)"
                />
                <Area
                  type="monotone"
                  dataKey="API"
                  stackId="1"
                  stroke="#16a34a"
                  fillOpacity={1}
                  fill="url(#colorAPI)"
                />
                <Area
                  type="monotone"
                  dataKey="Enterprise"
                  stackId="1"
                  stroke="#4f46e5"
                  fillOpacity={1}
                  fill="url(#colorEnterprise)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico Volume por Fonte */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Volume por Fonte (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockVolumesPorFonte}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="fonte" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => value.toLocaleString('pt-BR')}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }}
                />
                <Bar dataKey="volume" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Linha 3: Tabela + Anomalias */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 10 Clientes por Consumo</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={topClientes} />
            </CardContent>
          </Card>
        </div>

        {/* Card Anomalias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Anomalias Detectadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAnomalias.map((anomalia, idx) => (
              <div
                key={idx}
                className="border-l-4 pl-3 py-2"
                style={{
                  borderColor:
                    anomalia.severidade === 'alta'
                      ? '#ef4444'
                      : anomalia.severidade === 'media'
                      ? '#f59e0b'
                      : '#10b981',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {anomalia.cliente}
                    </p>
                    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                      {anomalia.descricao}
                    </p>
                  </div>
                  <span
                    className="mt-1 shrink-0 rounded text-xs font-medium px-1.5 py-0.5"
                    style={{
                      backgroundColor:
                        anomalia.severidade === 'alta'
                          ? '#fee2e2'
                          : anomalia.severidade === 'media'
                          ? '#fef3c7'
                          : '#dcfce7',
                      color:
                        anomalia.severidade === 'alta'
                          ? '#991b1b'
                          : anomalia.severidade === 'media'
                          ? '#92400e'
                          : '#166534',
                    }}
                  >
                    {anomalia.severidade}
                  </span>
                </div>
                <p className="mt-1.5 text-2xs text-neutral-400">
                  {format(anomalia.timestamp, 'dd/MM HH:mm')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Linha 4: Progress Bars com KRs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">KRs de Produto (Seção 5.3 PRD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockKRs.map((kr, idx) => {
            const progress = (kr.atual / kr.alvoMVP) * 100;
            const isMerit = kr.atual >= kr.alvoMVP;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-900">{kr.nome}</p>
                  <p className="text-sm font-semibold text-neutral-700">
                    {kr.atual} {kr.unidade}
                  </p>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: isMerit ? '#10b981' : '#4f46e5',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Baseline: {kr.baseline}</span>
                  <span>Alvo MVP: {kr.alvoMVP}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
