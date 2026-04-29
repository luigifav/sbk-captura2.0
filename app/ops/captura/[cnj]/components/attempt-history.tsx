'use client';

import { useState } from 'react';
import { EventoCaptura } from '@/lib/mocks/eventos-captura';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AttemptHistoryProps {
  eventos: EventoCaptura[];
}

export function AttemptHistory({ eventos }: AttemptHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Agrupa eventos de captura e entrega com suas falhas
  const tentativas: Array<{
    id: string;
    tipo: 'captura' | 'entrega';
    timestamp: Date;
    resultado: 'sucesso' | 'falha';
    detalhes?: string;
    tentativa?: number;
  }> = [];

  eventos.forEach(evt => {
    if (evt.tipo_evento === 'Falha') {
      tentativas.push({
        id: evt.id,
        tipo: evt.tentativa ? 'entrega' : 'captura',
        timestamp: evt.timestamp,
        resultado: 'falha',
        detalhes: evt.detalhes,
        tentativa: evt.tentativa,
      });
    } else if (evt.tipo_evento === 'Capturado') {
      tentativas.push({
        id: evt.id,
        tipo: 'captura',
        timestamp: evt.timestamp,
        resultado: 'sucesso',
      });
    } else if (evt.tipo_evento === 'Entregue') {
      tentativas.push({
        id: evt.id,
        tipo: 'entrega',
        timestamp: evt.timestamp,
        resultado: 'sucesso',
      });
    }
  });

  if (tentativas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-neutral-500">
          Nenhuma tentativa registrada.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {tentativas.map((tentativa) => (
            <div
              key={tentativa.id}
              className="border-b last:border-0"
            >
              <button
                onClick={() => setExpandedId(
                  expandedId === tentativa.id ? null : tentativa.id
                )}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left"
              >
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-neutral-400 transition-transform',
                    expandedId === tentativa.id && 'rotate-180'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900">
                      {tentativa.tipo === 'captura' ? 'Captura' : 'Entrega'}
                      {tentativa.tentativa && ` (Tentativa ${tentativa.tentativa})`}
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                        tentativa.resultado === 'sucesso'
                          ? 'bg-success-light text-success-foreground'
                          : 'bg-danger-light text-danger-foreground'
                      )}
                    >
                      {tentativa.resultado === 'sucesso' ? 'Sucesso' : 'Falha'}
                    </span>
                  </div>
                  <time className="text-xs text-neutral-500">
                    {tentativa.timestamp.toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </time>
                </div>
              </button>

              {expandedId === tentativa.id && (
                <div className="px-6 py-4 bg-neutral-50 border-t">
                  {tentativa.detalhes && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-neutral-600 mb-2">
                        Erro
                      </h4>
                      <p className="text-sm text-neutral-700 font-mono bg-white p-3 rounded border border-neutral-200">
                        {tentativa.detalhes}
                      </p>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log(`Abrindo logs técnicos para ${tentativa.id}`);
                    }}
                  >
                    Ver logs técnicos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
