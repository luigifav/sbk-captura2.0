'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, FilterGroup } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, Copy } from 'lucide-react';
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
  dataCadastro: string;
  email: string;
  telefone: string;
}

interface Captura {
  id: string;
  referencia: string;
  tipo: string;
  quantidade: number;
  dataCriacao: string;
  status: 'processado' | 'falha' | 'entregue' | 'pendente';
  taxaSucesso: number;
}

interface Credencial {
  id: string;
  nome: string;
  tipo: 'webhook' | 'api_key' | 'certificado';
  criada: string;
  ultimoUso: string;
  status: 'ativa' | 'inativa';
}

interface Alerta {
  id: string;
  tipo: string;
  severidade: 'info' | 'warning' | 'error';
  mensagem: string;
  data: string;
}

const MOCK_CLIENTE: Cliente = {
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
  dataCadastro: '2023-06-15',
  email: 'contato@techsolutions.com.br',
  telefone: '(11) 98765-4321',
};

const MOCK_CAPTURAS: Captura[] = [
  {
    id: '1',
    referencia: 'CAP-2024-001',
    tipo: 'Nota Fiscal',
    quantidade: 150,
    dataCriacao: '2024-04-29T10:00:00Z',
    status: 'entregue',
    taxaSucesso: 100,
  },
  {
    id: '2',
    referencia: 'CAP-2024-002',
    tipo: 'RPS',
    quantidade: 320,
    dataCriacao: '2024-04-29T09:00:00Z',
    status: 'entregue',
    taxaSucesso: 98.4,
  },
  {
    id: '3',
    referencia: 'CAP-2024-003',
    tipo: 'Carnê',
    quantidade: 85,
    dataCriacao: '2024-04-29T08:00:00Z',
    status: 'processado',
    taxaSucesso: 97.6,
  },
  {
    id: '4',
    referencia: 'CAP-2024-004',
    tipo: 'Boleto',
    quantidade: 240,
    dataCriacao: '2024-04-28T14:30:00Z',
    status: 'entregue',
    taxaSucesso: 99.2,
  },
  {
    id: '5',
    referencia: 'CAP-2024-005',
    tipo: 'Recibo',
    quantidade: 45,
    dataCriacao: '2024-04-28T11:00:00Z',
    status: 'pendente',
    taxaSucesso: 0,
  },
];

const MOCK_CREDENCIAIS: Credencial[] = [
  {
    id: '1',
    nome: 'API Key Produção',
    tipo: 'api_key',
    criada: '2023-06-15',
    ultimoUso: '2024-04-29T14:32:00Z',
    status: 'ativa',
  },
  {
    id: '2',
    nome: 'Webhook Entrega',
    tipo: 'webhook',
    criada: '2023-07-20',
    ultimoUso: '2024-04-29T14:00:00Z',
    status: 'ativa',
  },
  {
    id: '3',
    nome: 'Certificado SSL',
    tipo: 'certificado',
    criada: '2023-08-10',
    ultimoUso: '2024-04-28T10:15:00Z',
    status: 'ativa',
  },
  {
    id: '4',
    nome: 'API Key Teste (Desativada)',
    tipo: 'api_key',
    criada: '2023-06-20',
    ultimoUso: '2024-03-15T09:00:00Z',
    status: 'inativa',
  },
];

const MOCK_ALERTAS: Alerta[] = [
  {
    id: '1',
    tipo: 'Taxa de Sucesso Baixa',
    severidade: 'warning',
    mensagem: 'Taxa de sucesso em 92% (abaixo do limite de 95%)',
    data: '2024-04-29T12:00:00Z',
  },
  {
    id: '2',
    tipo: 'Limite de Requisições',
    severidade: 'info',
    mensagem: 'Cliente atingiu 85% do limite mensal de requisições',
    data: '2024-04-28T16:45:00Z',
  },
  {
    id: '3',
    tipo: 'Falha de Autenticação',
    severidade: 'error',
    mensagem: '5 tentativas de autenticação falhadas em sequência',
    data: '2024-04-27T14:20:00Z',
  },
];

const MOCK_AUDITORIA = [
  {
    id: '1',
    acao: 'Upgrade de Plano',
    usuario: 'gerente-sbk',
    detalhes: 'Plano alterado de Profissional para Enterprise',
    data: '2024-04-20T10:30:00Z',
  },
  {
    id: '2',
    acao: 'Credencial Criada',
    usuario: 'system',
    detalhes: 'Nova chave API gerada para produção',
    data: '2024-04-15T14:15:00Z',
  },
  {
    id: '3',
    acao: 'Suspensão Temporária',
    usuario: 'ops-sbk',
    detalhes: 'Conta suspensa por falta de pagamento (0,5 dias)',
    data: '2024-04-10T09:00:00Z',
  },
  {
    id: '4',
    acao: 'Limite Ajustado',
    usuario: 'gerente-sbk',
    detalhes: 'Limite de requisições aumentado de 50k para 100k por dia',
    data: '2024-04-05T11:20:00Z',
  },
];

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    ativo: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ativo' },
    trial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trial' },
    inadimplente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Inadimplente' },
    cancelado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' },
    entregue: { bg: 'bg-green-100', text: 'text-green-700', label: 'Entregue' },
    processado: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processado' },
    falha: { bg: 'bg-red-100', text: 'text-red-700', label: 'Falha' },
    pendente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendente' },
    ativa: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ativa' },
    inativa: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inativa' },
  };

  const config = configs[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded text-xs font-medium', config.bg, config.text)}>
      {config.label}
    </span>
  );
}

const capturasColumns: ColumnDef<Captura>[] = [
  {
    accessorKey: 'referencia',
    header: 'Referência',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
  },
  {
    accessorKey: 'quantidade',
    header: 'Quantidade',
    cell: ({ row }) => <span>{row.original.quantidade.toLocaleString('pt-BR')}</span>,
  },
  {
    accessorKey: 'dataCriacao',
    header: 'Data',
    cell: ({ row }) => new Date(row.original.dataCriacao).toLocaleDateString('pt-BR'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'taxaSucesso',
    header: 'Taxa de Sucesso',
    cell: ({ row }) => <span>{row.original.taxaSucesso.toFixed(1)}%</span>,
  },
];

const credenciaisColumns: ColumnDef<Credencial>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => {
      const tipos = { webhook: 'Webhook', api_key: 'API Key', certificado: 'Certificado' };
      return <span>{tipos[row.original.tipo as keyof typeof tipos]}</span>;
    },
  },
  {
    accessorKey: 'criada',
    header: 'Criada em',
    cell: ({ row }) => new Date(row.original.criada).toLocaleDateString('pt-BR'),
  },
  {
    accessorKey: 'ultimoUso',
    header: 'Último uso',
    cell: ({ row }) => {
      const date = new Date(row.original.ultimoUso);
      const diffHours = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60));
      return <span className="text-sm text-neutral-600">{diffHours}h atrás</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

function OverviewTab({ cliente }: { cliente: Cliente }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">Plano Atual</p>
          <p className="text-lg font-semibold capitalize">{cliente.plano}</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">MRR</p>
          <p className="text-lg font-semibold">R$ {(cliente.mrr / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">Taxa de Sucesso</p>
          <p className="text-lg font-semibold">{cliente.taxaSucesso.toFixed(1)}%</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">Data de Cadastro</p>
          <p className="text-lg font-semibold">{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
        <h3 className="font-semibold mb-3">Informações de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Email</p>
            <p className="text-sm">{cliente.email}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Telefone</p>
            <p className="text-sm">{cliente.telefone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CapturasTab({ cliente }: { cliente: Cliente }) {
  return <DataTable columns={capturasColumns} data={MOCK_CAPTURAS} emptyMessage="Nenhuma captura encontrada." />;
}

function CredenciaisTab() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <DataTable columns={credenciaisColumns} data={MOCK_CREDENCIAIS} emptyMessage="Nenhuma credencial encontrada." />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700 mb-2 font-medium">Próximas ações</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Renovar certificados que vencem em menos de 30 dias</li>
          <li>• Desativar credenciais não utilizadas há mais de 90 dias</li>
          <li>• Revisar permissões das chaves ativas</li>
        </ul>
      </div>
    </div>
  );
}

function ConsumoTab({ cliente }: { cliente: Cliente }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">Consumo Hoje</p>
          <p className="text-2xl font-semibold">{cliente.volume24h.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-neutral-500 mt-2">requisições</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">MRR</p>
          <p className="text-2xl font-semibold">R$ {(cliente.mrr / 1000).toFixed(1)}k</p>
          <p className="text-xs text-neutral-500 mt-2">receita mensal</p>
        </div>
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <p className="text-xs text-neutral-500 mb-1">Último Consumo</p>
          <p className="text-lg font-semibold">
            {new Date(cliente.ultimoConsumo).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-xs text-neutral-500 mt-2">hoje</p>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
        <h3 className="font-semibold mb-3">Detalhamento de Consumo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Requisições Processadas</span>
            <span className="font-medium">{(cliente.volume24h * 0.95).toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span>Requisições com Falha</span>
            <span className="font-medium text-red-600">{Math.floor(cliente.volume24h * 0.05).toLocaleString('pt-BR')}</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{cliente.volume24h.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditoriaTab() {
  return (
    <div className="space-y-2">
      {MOCK_AUDITORIA.map((log) => (
        <div key={log.id} className="border border-neutral-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium">{log.acao}</p>
              <p className="text-sm text-neutral-600">{log.detalhes}</p>
            </div>
            <span className="text-xs text-neutral-500 whitespace-nowrap">
              {new Date(log.data).toLocaleDateString('pt-BR')} {new Date(log.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-xs text-neutral-500">Por: {log.usuario}</p>
        </div>
      ))}
    </div>
  );
}

function RegistrosTab() {
  const mockRegistros = [
    {
      id: '1',
      tipo: 'Captura',
      documento: 'NF-2024-001',
      dataCriacao: '2024-04-29T14:30:00Z',
      dataEntrega: '2024-04-29T14:35:00Z',
      status: 'entregue',
    },
    {
      id: '2',
      tipo: 'Captura',
      documento: 'RPS-2024-005',
      dataCriacao: '2024-04-29T13:15:00Z',
      dataEntrega: '2024-04-29T13:20:00Z',
      status: 'entregue',
    },
    {
      id: '3',
      tipo: 'Captura',
      documento: 'BOL-2024-012',
      dataCriacao: '2024-04-29T12:45:00Z',
      dataEntrega: null,
      status: 'pendente',
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Tipo</th>
            <th className="px-4 py-3 text-left font-semibold">Documento</th>
            <th className="px-4 py-3 text-left font-semibold">Data Captura</th>
            <th className="px-4 py-3 text-left font-semibold">Data Entrega</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {mockRegistros.map((reg) => (
            <tr key={reg.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">{reg.tipo}</td>
              <td className="px-4 py-3 font-mono text-xs">{reg.documento}</td>
              <td className="px-4 py-3">{new Date(reg.dataCriacao).toLocaleString('pt-BR')}</td>
              <td className="px-4 py-3">
                {reg.dataEntrega ? new Date(reg.dataEntrega).toLocaleString('pt-BR') : '—'}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={reg.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'capturas' | 'credenciais' | 'consumo' | 'auditoria' | 'registros'
  >('overview');

  const cliente = MOCK_CLIENTE;

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cliente não encontrado</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'capturas', label: 'Capturas' },
    { id: 'credenciais', label: 'Credenciais' },
    { id: 'consumo', label: 'Consumo & Billing' },
    { id: 'auditoria', label: 'Auditoria' },
    { id: 'registros', label: 'Registros' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{cliente.nome}</h1>
            <p className="text-neutral-600 mt-1">{cliente.cnpj}</p>
          </div>
          <StatusBadge status={cliente.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-neutral-500">Plano</p>
            <p className="text-sm font-semibold capitalize">{cliente.plano}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">MRR</p>
            <p className="text-sm font-semibold">R$ {(cliente.mrr / 1000).toFixed(1)}k</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Taxa Sucesso</p>
            <p className="text-sm font-semibold">{cliente.taxaSucesso.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Credenciais</p>
            <p className="text-sm font-semibold">
              {cliente.credenciaisAtivas.ativas}/{cliente.credenciaisAtivas.total}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'overview' && <OverviewTab cliente={cliente} />}
        {activeTab === 'capturas' && <CapturasTab cliente={cliente} />}
        {activeTab === 'credenciais' && <CredenciaisTab />}
        {activeTab === 'consumo' && <ConsumoTab cliente={cliente} />}
        {activeTab === 'auditoria' && <AuditoriaTab />}
        {activeTab === 'registros' && <RegistrosTab />}
      </div>
    </div>
  );
}
