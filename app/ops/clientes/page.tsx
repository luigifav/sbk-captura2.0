'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, FilterGroup } from '@/components/ui/data-table';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cliente {
  id: string;
  nome: string;
  cnpj: string;
  plano: 'essencial' | 'profissional' | 'enterprise';
  mrr: number;
  volume24h: number;
  taxaSucesso: number;
  credenciaisAtivas: { ativas: number; total: number };
  alertasAtivos: number;
  ultimoConsumo: string;
  status: 'ativo' | 'trial' | 'inadimplente' | 'cancelado';
}

const MOCK_CLIENTES: Cliente[] = [
  {
    id: '1',
    nome: 'Tech Solutions Brasil',
    cnpj: '12.345.678/0001-90',
    plano: 'enterprise',
    mrr: 15000,
    volume24h: 45230,
    taxaSucesso: 98.5,
    credenciaisAtivas: { ativas: 8, total: 10 },
    alertasAtivos: 0,
    ultimoConsumo: '2024-04-29T14:32:00Z',
    status: 'ativo',
  },
  {
    id: '2',
    nome: 'FinTech Inovação',
    cnpj: '98.765.432/0001-10',
    plano: 'profissional',
    mrr: 7500,
    volume24h: 28450,
    taxaSucesso: 97.2,
    credenciaisAtivas: { ativas: 4, total: 5 },
    alertasAtivos: 1,
    ultimoConsumo: '2024-04-29T13:15:00Z',
    status: 'ativo',
  },
  {
    id: '3',
    nome: 'Logística Express',
    cnpj: '45.678.901/0001-23',
    plano: 'essencial',
    mrr: 2500,
    volume24h: 8920,
    taxaSucesso: 94.8,
    credenciaisAtivas: { ativas: 2, total: 3 },
    alertasAtivos: 2,
    ultimoConsumo: '2024-04-29T10:42:00Z',
    status: 'ativo',
  },
  {
    id: '4',
    nome: 'Ecommerce Global',
    cnpj: '11.111.111/0001-11',
    plano: 'enterprise',
    mrr: 22000,
    volume24h: 92000,
    taxaSucesso: 99.1,
    credenciaisAtivas: { ativas: 12, total: 15 },
    alertasAtivos: 0,
    ultimoConsumo: '2024-04-29T15:00:00Z',
    status: 'ativo',
  },
  {
    id: '5',
    nome: 'Startup Pagamentos',
    cnpj: '22.222.222/0001-22',
    plano: 'profissional',
    mrr: 5000,
    volume24h: 12340,
    taxaSucesso: 96.3,
    credenciaisAtivas: { ativas: 3, total: 4 },
    alertasAtivos: 0,
    ultimoConsumo: '2024-04-28T18:20:00Z',
    status: 'trial',
  },
  {
    id: '6',
    nome: 'Consultorias Corp',
    cnpj: '33.333.333/0001-33',
    plano: 'essencial',
    mrr: 1500,
    volume24h: 2100,
    taxaSucesso: 92.1,
    credenciaisAtivas: { ativas: 1, total: 2 },
    alertasAtivos: 3,
    ultimoConsumo: '2024-04-27T09:30:00Z',
    status: 'inadimplente',
  },
  {
    id: '7',
    nome: 'Saúde Digital',
    cnpj: '44.444.444/0001-44',
    plano: 'profissional',
    mrr: 8000,
    volume24h: 35000,
    taxaSucesso: 98.7,
    credenciaisAtivas: { ativas: 5, total: 6 },
    alertasAtivos: 0,
    ultimoConsumo: '2024-04-29T12:45:00Z',
    status: 'ativo',
  },
  {
    id: '8',
    nome: 'Varejo Integrado',
    cnpj: '55.555.555/0001-55',
    plano: 'essencial',
    mrr: 3000,
    volume24h: 5600,
    taxaSucesso: 95.4,
    credenciaisAtivas: { ativas: 2, total: 3 },
    alertasAtivos: 1,
    ultimoConsumo: '2024-04-29T11:10:00Z',
    status: 'cancelado',
  },
];

function StatusBadge({ status }: { status: Cliente['status'] }) {
  const configs = {
    ativo: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ativo' },
    trial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trial' },
    inadimplente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Inadimplente' },
    cancelado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' },
  };
  const config = configs[status];
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded text-xs font-medium', config.bg, config.text)}>
      {config.label}
    </span>
  );
}

function TaxaSucessoBadge({ taxa }: { taxa: number }) {
  const variant = taxa >= 99 ? 'green' : taxa >= 96 ? 'blue' : taxa >= 93 ? 'yellow' : 'red';
  const configs = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded text-xs font-medium', configs[variant])}>
      {taxa.toFixed(1)}%
    </span>
  );
}

const columns: ColumnDef<Cliente>[] = [
  {
    accessorKey: 'nome',
    header: 'Cliente',
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.nome}</div>
        <div className="text-xs text-neutral-500">{row.original.cnpj}</div>
      </div>
    ),
  },
  {
    accessorKey: 'plano',
    header: 'Plano',
    cell: ({ row }) => {
      const planoLabels = {
        essencial: 'Essencial',
        profissional: 'Profissional',
        enterprise: 'Enterprise',
      };
      return <span className="text-sm">{planoLabels[row.original.plano]}</span>;
    },
  },
  {
    accessorKey: 'mrr',
    header: 'MRR',
    cell: ({ row }) => <span className="font-medium">R$ {(row.original.mrr / 1000).toFixed(1)}k</span>,
  },
  {
    accessorKey: 'volume24h',
    header: 'Volume 24h',
    cell: ({ row }) => <span>{row.original.volume24h.toLocaleString('pt-BR')}</span>,
  },
  {
    accessorKey: 'taxaSucesso',
    header: 'Taxa de Sucesso',
    cell: ({ row }) => <TaxaSucessoBadge taxa={row.original.taxaSucesso} />,
  },
  {
    accessorKey: 'credenciaisAtivas',
    header: 'Credenciais',
    cell: ({ row }) => {
      const { ativas, total } = row.original.credenciaisAtivas;
      return (
        <span className="text-sm">
          {ativas}/{total}
        </span>
      );
    },
  },
  {
    accessorKey: 'alertasAtivos',
    header: 'Alertas',
    cell: ({ row }) => {
      const count = row.original.alertasAtivos;
      return count > 0 ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <AlertTriangle className="h-3 w-3" />
          {count}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          0
        </span>
      );
    },
  },
  {
    accessorKey: 'ultimoConsumo',
    header: 'Último Consumo',
    cell: ({ row }) => {
      const date = new Date(row.original.ultimoConsumo);
      const now = new Date();
      const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      let label = '';
      if (diffHours < 1) label = 'Agora';
      else if (diffHours < 24) label = `${diffHours}h atrás`;
      else {
        const diffDays = Math.floor(diffHours / 24);
        label = `${diffDays}d atrás`;
      }

      return (
        <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
          <Clock className="h-3.5 w-3.5" />
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

const filterGroups: FilterGroup[] = [
  {
    columnId: 'plano',
    label: 'Plano',
    options: [
      { id: 'essencial', label: 'Essencial', value: 'essencial' },
      { id: 'profissional', label: 'Profissional', value: 'profissional' },
      { id: 'enterprise', label: 'Enterprise', value: 'enterprise' },
    ],
  },
  {
    columnId: 'status',
    label: 'Status',
    options: [
      { id: 'ativo', label: 'Ativo', value: 'ativo' },
      { id: 'trial', label: 'Trial', value: 'trial' },
      { id: 'inadimplente', label: 'Inadimplente', value: 'inadimplente' },
      { id: 'cancelado', label: 'Cancelado', value: 'cancelado' },
    ],
  },
];

export default function ClientesPage() {
  const router = useRouter();
  const [data] = useState<Cliente[]>(MOCK_CLIENTES);

  const handleRowClick = (clientId: string) => {
    router.push(`/app/ops/clientes/${clientId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground mt-2">
          Gestão operacional de todos os clientes da plataforma SBK
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <div onClick={(e) => {
          const row = (e.target as HTMLElement).closest('tr[data-client-id]');
          if (row) {
            const clientId = row.getAttribute('data-client-id');
            if (clientId) handleRowClick(clientId);
          }
        }}>
          <DataTable
            columns={columns}
            data={data}
            searchKey="nome"
            searchPlaceholder="Buscar por nome ou CNPJ..."
            filterGroups={filterGroups}
            emptyMessage="Nenhum cliente encontrado."
            className="[&_tbody_tr]:cursor-pointer"
          />
        </div>
      </div>

      <style jsx>{`
        :global([data-client-id]:hover) {
          background-color: rgb(249 250 251);
        }
      `}</style>
    </div>
  );
}
