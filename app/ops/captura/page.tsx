'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { StatusBadge, type CaptureStatus } from '@/components/ui/status-badge';
import { mockProcessos } from '@/lib/mocks/processos';
import { cn } from '@/lib/utils';

const ESTADO_TO_BADGE: Record<string, CaptureStatus> = {
  Localizado: 'localizado',
  Capturado: 'capturado',
  Enviado: 'enviado',
  Entregue: 'entregue',
  'Falha de Captura': 'falha-captura',
  'Falha de Entrega': 'falha-entrega',
};

const ESTADOS = [
  'Localizado',
  'Capturado',
  'Enviado',
  'Entregue',
  'Falha de Captura',
  'Falha de Entrega',
];

const FONTES = ['PDPJ', 'DJE', 'TJ'];

export default function OpsCapturaIndexPage() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [filtroFonte, setFiltroFonte] = useState<string | null>(null);

  const dados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return mockProcessos.filter((p) => {
      if (termo && !p.cnj.toLowerCase().includes(termo)) return false;
      if (filtroEstado && p.estado !== filtroEstado) return false;
      if (filtroFonte && p.fonte !== filtroFonte) return false;
      return true;
    });
  }, [busca, filtroEstado, filtroFonte]);

  const irParaDetalhe = (cnj: string) => {
    router.push(`/ops/captura/${encodeURIComponent(cnj)}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Captura por CNJ
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Selecione um processo para inspecionar a linha do tempo de captura,
          tentativas e entregas.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por CNJ"
              className="h-8 w-64 rounded-md border border-neutral-200 bg-white pl-8 pr-8 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label="Limpar busca"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <FilterChip
            label="Estado"
            options={ESTADOS}
            active={filtroEstado}
            onChange={setFiltroEstado}
          />
          <FilterChip
            label="Fonte"
            options={FONTES}
            active={filtroFonte}
            onChange={setFiltroFonte}
          />

          <span className="ml-auto text-xs text-neutral-500">
            {dados.length} processo{dados.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  CNJ
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  Tribunal
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  Fonte
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  Tipo de andamento
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  Estado
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-neutral-500">
                  Data de captura
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {dados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-neutral-400"
                  >
                    Nenhum processo encontrado.
                  </td>
                </tr>
              ) : (
                dados.map((p) => {
                  const badge = ESTADO_TO_BADGE[p.estado];
                  return (
                    <tr
                      key={p.id}
                      onClick={() => irParaDetalhe(p.cnj)}
                      className="cursor-pointer transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs text-neutral-800">
                          {p.cnj}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {p.tribunal}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                          {p.fonte}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {p.tipo_andamento}
                      </td>
                      <td className="px-3 py-2.5">
                        {badge ? (
                          <StatusBadge state={badge} size="sm" />
                        ) : (
                          <span className="text-xs text-neutral-500">
                            {p.estado}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-neutral-600">
                        {format(p.data_captura, 'dd/MM/yyyy HH:mm')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-neutral-400">{label}:</span>
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(isActive ? null : opt)}
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-brand text-brand-foreground'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
