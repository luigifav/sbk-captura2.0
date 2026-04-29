'use client';

import { EventoCaptura } from '@/lib/mocks/eventos-captura';
import { Timeline, TimelineEvent } from '@/components/ui/timeline';
import { Card, CardContent } from '@/components/ui/card';

interface CaseTimelineProps {
  eventos: EventoCaptura[];
}

const tipoEventoStatusMap: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
  'Localizado': 'info',
  'Capturado': 'success',
  'Enviado': 'info',
  'Entregue': 'success',
  'Falha': 'danger',
};

export function CaseTimeline({ eventos }: CaseTimelineProps) {
  if (eventos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-neutral-500">
          Nenhum evento registrado para este processo.
        </CardContent>
      </Card>
    );
  }

  // Ordena eventos por timestamp descendente (mais recentes primeiro)
  const eventosPorTipo = eventos.reduce((acc, evt) => {
    const tipo = evt.tipo_evento;
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(evt);
    return acc;
  }, {} as Record<string, EventoCaptura[]>);

  // Calcula duração entre os principais eventos (Localizado -> Capturado -> Enviado -> Entregue)
  const ordemPrincipal = ['Localizado', 'Capturado', 'Enviado', 'Entregue'];
  const principaisEventos = ordemPrincipal
    .map(tipo => eventosPorTipo[tipo]?.[0])
    .filter(Boolean) as EventoCaptura[];

  // Identifica gargalos (etapas lentas > 30 minutos)
  const gargalos = new Set<string>();
  for (let i = 0; i < principaisEventos.length - 1; i++) {
    const duracao = (principaisEventos[i].timestamp.getTime() - principaisEventos[i + 1].timestamp.getTime()) / 1000 / 60;
    if (duracao > 30) {
      gargalos.add(`${principaisEventos[i + 1].tipo_evento}-${principaisEventos[i].tipo_evento}`);
    }
  }

  // Constrói eventos para a timeline
  const timelineEvents: TimelineEvent[] = principaisEventos.map((evt, idx) => {
    const proximoIdx = idx + 1;
    const temProximo = proximoIdx < principaisEventos.length;
    const temGargalo = temProximo && gargalos.has(`${evt.tipo_evento}-${principaisEventos[proximoIdx].tipo_evento}`);

    return {
      id: evt.id,
      label: evt.tipo_evento,
      timestamp: evt.timestamp,
      status: temGargalo ? 'danger' : (tipoEventoStatusMap[evt.tipo_evento] || 'default'),
      description: temGargalo ? 'Gargalo identificado (duração > 30 min)' : undefined,
    };
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <Timeline events={timelineEvents} showDuration />
      </CardContent>
    </Card>
  );
}
