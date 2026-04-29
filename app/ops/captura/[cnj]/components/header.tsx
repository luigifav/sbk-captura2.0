'use client';

import { Processo } from '@/lib/mocks/processos';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  RotateCcw,
  Lock,
  Zap,
  Check,
  ChevronDown,
} from 'lucide-react';

type ActionType = 'capture' | 'reprocess' | 'block' | 'priority' | 'deliver' | null;

interface CaseHeaderProps {
  processo: Processo;
  onAction: (action: ActionType) => void;
}

const statusMap: Record<string, 'localizado' | 'capturado' | 'enviado' | 'entregue' | 'falha-captura' | 'falha-entrega'> = {
  'Localizado': 'localizado',
  'Capturado': 'capturado',
  'Enviado': 'enviado',
  'Entregue': 'entregue',
  'Falha de Captura': 'falha-captura',
  'Falha de Entrega': 'falha-entrega',
};

export function CaseHeader({ processo, onAction }: CaseHeaderProps) {
  const status = statusMap[processo.estado] || 'localizado';

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* CNJ e badges */}
          <div className="flex-1">
            <div className="font-mono text-2xl font-bold text-neutral-900 mb-3">
              {processo.cnj}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge state={status} size="md" />
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200">
                {processo.tribunal}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200">
                {processo.fonte}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200">
                {processo.tipo_andamento}
              </span>
            </div>
          </div>

          {/* Ações operacionais */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('capture')}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Capturar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('reprocess')}
              className="gap-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              Reprocessar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('block')}
              className="gap-1.5"
            >
              <Lock className="h-4 w-4" />
              Bloquear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('priority')}
              className="gap-1.5"
            >
              <Zap className="h-4 w-4" />
              Prioridade
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction('deliver')}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" />
              Entregar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
