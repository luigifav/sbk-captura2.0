'use client';

import React, { useState, useMemo } from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ColumnDef } from '@tanstack/react-table';
import { mockRegistrosCapturadosEntregas, type RegistroCapturado } from '@/lib/mocks/registro-captura-entrega';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function truncateHash(hash: string, length: number = 8): string {
  return hash.length > length ? hash.substring(0, length) + '...' : hash;
}

function formatDateTime(date: Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'sucesso':
      return 'bg-green-100 text-green-800';
    case 'falha_parcial':
      return 'bg-yellow-100 text-yellow-800';
    case 'falha_total':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'sucesso':
      return 'Sucesso';
    case 'falha_parcial':
      return 'Falha Parcial';
    case 'falha_total':
      return 'Falha Total';
    default:
      return status;
  }
}

export default function RegistroPage() {
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFonte, setFiltroFonte] = useState('');
  const [filtroCanal, setFiltroCanal] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  const clientes = useMemo(() => {
    return Array.from(new Set(mockRegistrosCapturadosEntregas.map(r => r.cliente_id))).sort();
  }, []);

  const fontes = useMemo(() => {
    return Array.from(new Set(mockRegistrosCapturadosEntregas.map(r => r.fonte))).sort();
  }, []);

  const canais = useMemo(() => {
    return Array.from(new Set(mockRegistrosCapturadosEntregas.map(r => r.canal_entrega))).sort();
  }, []);

  const registrosFiltrados = useMemo(() => {
    return mockRegistrosCapturadosEntregas.filter(registro => {
      let match = true;

      if (filtroCliente && registro.cliente_id !== filtroCliente) {
        match = false;
      }

      if (filtroFonte && registro.fonte !== filtroFonte) {
        match = false;
      }

      if (filtroCanal && registro.canal_entrega !== filtroCanal) {
        match = false;
      }

      if (filtroPeriodo) {
        const agora = new Date();
        const dataCaptura = new Date(registro.timestamp_captura);

        switch (filtroPeriodo) {
          case 'hoje':
            if (dataCaptura.toDateString() !== agora.toDateString()) match = false;
            break;
          case 'semana':
            const uma_semana_atras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (dataCaptura < uma_semana_atras) match = false;
            break;
          case 'mes':
            const um_mes_atras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (dataCaptura < um_mes_atras) match = false;
            break;
        }
      }

      return match;
    });
  }, [filtroCliente, filtroFonte, filtroCanal, filtroPeriodo]);

  const columns: ColumnDef<RegistroCapturado>[] = [
    {
      accessorKey: 'id',
      header: 'ID do Registro',
      cell: ({ row }) => (
        <code className="text-xs font-semibold text-orange-600">{row.original.id}</code>
      ),
    },
    {
      accessorKey: 'cnj',
      header: 'CNJ',
      cell: ({ row }) => (
        <code className="text-xs text-neutral-600">{row.original.cnj}</code>
      ),
    },
    {
      accessorKey: 'cliente_id',
      header: 'Cliente',
    },
    {
      accessorKey: 'fonte',
      header: 'Fonte',
      cell: ({ row }) => (
        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.fonte}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp_captura',
      header: 'Captura',
      cell: ({ row }) => (
        <span className="text-xs text-neutral-600">
          {formatDateTime(row.original.timestamp_captura)}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp_entrega',
      header: 'Entrega',
      cell: ({ row }) => (
        <span className="text-xs text-neutral-600">
          {formatDateTime(row.original.timestamp_entrega)}
        </span>
      ),
    },
    {
      accessorKey: 'canal_entrega',
      header: 'Canal Confirmado',
      cell: ({ row }) => (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
          {row.original.canal_entrega}
        </span>
      ),
    },
    {
      accessorKey: 'hash_registro',
      header: 'Hash (Integridade)',
      cell: ({ row }) => (
        <code className="text-xs font-mono text-neutral-500" title={row.original.hash_registro}>
          {truncateHash(row.original.hash_registro)}
        </code>
      ),
    },
    {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`/ops/registro/${row.original.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              title="Ver detalhes completos"
            >
              <Eye className="h-3.5 w-3.5" />
              Ver
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 text-xs"
            onClick={() => {
              window.print();
            }}
            title="Exportar como PDF"
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-orange-600" />
          <h1 className="text-3xl font-bold text-neutral-900">Registros Imutáveis</h1>
        </div>
        <p className="text-sm text-neutral-600">
          Auditoria completa de captura e entrega de documentos CNJ. Todos os registros são imutáveis e armazenados com hash de integridade.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Cliente
                </label>
                <select
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todos</option>
                  {clientes.map((cliente) => (
                    <option key={cliente} value={cliente}>
                      {cliente}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Fonte
                </label>
                <select
                  value={filtroFonte}
                  onChange={(e) => setFiltroFonte(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todos</option>
                  {fontes.map((fonte) => (
                    <option key={fonte} value={fonte}>
                      {fonte}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Período
                </label>
                <select
                  value={filtroPeriodo}
                  onChange={(e) => setFiltroPeriodo(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todos</option>
                  <option value="hoje">Hoje</option>
                  <option value="semana">Últimos 7 dias</option>
                  <option value="mes">Últimos 30 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  Canal
                </label>
                <select
                  value={filtroCanal}
                  onChange={(e) => setFiltroCanal(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todos</option>
                  {canais.map((canal) => (
                    <option key={canal} value={canal}>
                      {canal}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-neutral-500">
              Mostrando <span className="font-semibold">{registrosFiltrados.length}</span> de <span className="font-semibold">{mockRegistrosCapturadosEntregas.length}</span> registros
            </p>
          </div>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={registrosFiltrados}
        searchKey="cnj"
        searchPlaceholder="Buscar por CNJ..."
        emptyMessage="Nenhum registro encontrado com os filtros selecionados."
      />
    </div>
  );
}
