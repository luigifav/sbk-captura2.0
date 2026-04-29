'use client';

import { RegistroCapturado } from '@/lib/mocks/registro-captura-entrega';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChannelStateProps {
  registro: RegistroCapturado;
}

export function ChannelState({ registro }: ChannelStateProps) {
  const statusVariant = registro.status === 'sucesso'
    ? 'bg-success-light text-success-foreground'
    : registro.status === 'falha_parcial'
    ? 'bg-warning-light text-warning-foreground'
    : 'bg-danger-light text-danger-foreground';

  const statusLabel = registro.status === 'sucesso'
    ? 'Sucesso'
    : registro.status === 'falha_parcial'
    ? 'Falha Parcial'
    : 'Falha Total';

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-neutral-50">
                <th className="px-6 py-3 text-left font-semibold text-neutral-900">
                  Canal
                </th>
                <th className="px-6 py-3 text-left font-semibold text-neutral-900">
                  Estado
                </th>
                <th className="px-6 py-3 text-left font-semibold text-neutral-900">
                  HTTP
                </th>
                <th className="px-6 py-3 text-left font-semibold text-neutral-900">
                  Resposta
                </th>
                <th className="px-6 py-3 text-left font-semibold text-neutral-900">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-3">
                  <span className="font-medium text-neutral-900">
                    {registro.canal_entrega}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                      statusVariant
                    )}
                  >
                    {statusLabel}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <code className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded">
                    {registro.evidencia_tecnica.status_http}
                  </code>
                </td>
                <td className="px-6 py-3 text-neutral-600">
                  {registro.evidencia_tecnica.tempo_resposta_ms}ms
                </td>
                <td className="px-6 py-3 text-neutral-600">
                  <time className="text-xs">
                    {registro.timestamp_entrega.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </time>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Evidência técnica */}
        <div className="border-t px-6 py-4 bg-neutral-50">
          <h4 className="text-xs font-semibold text-neutral-600 mb-3">
            EVIDÊNCIA TÉCNICA
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-neutral-500 mb-1">IP de Origem</p>
              <code className="block bg-white border rounded p-2 font-mono text-neutral-900">
                {registro.evidencia_tecnica.ip_origem}
              </code>
            </div>
            <div>
              <p className="text-neutral-500 mb-1">User Agent</p>
              <code className="block bg-white border rounded p-2 font-mono text-neutral-900 text-2xs overflow-auto max-h-20">
                {registro.evidencia_tecnica.user_agent}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
