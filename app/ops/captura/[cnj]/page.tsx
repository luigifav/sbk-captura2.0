'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { mockProcessos } from '@/lib/mocks/processos';
import { mockEventosCaptura } from '@/lib/mocks/eventos-captura';
import { mockRegistrosCapturadosEntregas } from '@/lib/mocks/registro-captura-entrega';
import { mockClientesRepresentados } from '@/lib/mocks/credenciais';
import { mockCredenciais } from '@/lib/mocks/credenciais';
import { CaseHeader } from './components/header';
import { CaseTimeline } from './components/timeline';
import { AttemptHistory } from './components/attempt-history';
import { ChannelState } from './components/channel-state';
import { MetadataCard, ClientCard, RegistryCard, CredentialCard } from './components/sidebar-cards';
import { ActionModal } from './components/action-modal';
import { EmptyState } from '@/components/ui/empty-state';

type ActionType = 'capture' | 'reprocess' | 'block' | 'priority' | 'deliver' | null;

export default function CaseDetailPage() {
  const params = useParams();
  const cnj = params.cnj as string;

  const [actionModal, setActionModal] = useState<ActionType>(null);
  const [reason, setReason] = useState('');

  const processo = mockProcessos.find(p => p.cnj === cnj);
  if (!processo) {
    return (
      <EmptyState
        title="Processo não encontrado"
        description={`Não há registro para o CNJ: ${cnj}`}
      />
    );
  }

  const eventos = mockEventosCaptura.filter(e => e.processo_id === processo.id);
  const registro = mockRegistrosCapturadosEntregas.find(r => r.cnj === cnj);
  const cliente = mockClientesRepresentados.find(c => c.id === registro?.cliente_id);
  const credencial = mockCredenciais[0];

  const handleActionConfirm = () => {
    console.log(`Ação ${actionModal} realizada com razão: ${reason}`);
    setActionModal(null);
    setReason('');
  };

  const actionLabels: Record<Exclude<ActionType, null>, string> = {
    capture: 'Forçar nova captura',
    reprocess: 'Reprocessar',
    block: 'Bloquear',
    priority: 'Alterar prioridade',
    deliver: 'Marcar manualmente como entregue',
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-50">
      <CaseHeader
        processo={processo}
        onAction={setActionModal}
      />

      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Ciclo de Vida
                </h2>
                <CaseTimeline eventos={eventos} />
              </section>

              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Histórico de Tentativas
                </h2>
                <AttemptHistory eventos={eventos} />
              </section>

              {registro && (
                <section>
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                    Estado por Canal de Entrega
                  </h2>
                  <ChannelState registro={registro} />
                </section>
              )}
            </div>

            <aside className="space-y-4">
              <MetadataCard processo={processo} />
              {cliente && <ClientCard cliente={cliente} />}
              {registro && <RegistryCard registro={registro} />}
              <CredentialCard credencial={credencial} />
            </aside>
          </div>
        </div>
      </div>

      {actionModal && actionModal !== null && (
        <ActionModal
          title={actionLabels[actionModal]}
          isOpen={true}
          onClose={() => {
            setActionModal(null);
            setReason('');
          }}
          onConfirm={handleActionConfirm}
          reason={reason}
          onReasonChange={setReason}
        />
      )}
    </div>
  );
}
