'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, X, Download } from 'lucide-react';

interface CancelSubscriptionModalProps {
  onClose: () => void;
}

export function CancelSubscriptionModal({ onClose }: CancelSubscriptionModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-red-100">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Cancelar Assinatura</h2>
              <p className="text-sm text-muted-foreground">Tenha cuidado com essa ação</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <CardContent className="pt-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">Aviso importante</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              Se você cancelar sua assinatura, sua conta será desativada imediatamente. No entanto, você terá 90 dias a partir da data de cancelamento para exportar seus dados.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Próximos passos</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Seus monitoramentos serão pausados</li>
              <li>• Você perderá acesso a novos documentos</li>
              <li>• Dados exportáveis permanecerão por 90 dias</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">Deseja exportar seus dados antes?</p>
            <Button variant="outline" size="sm" className="w-full">
              <Download size={16} className="mr-2" />
              Exportar dados agora
            </Button>
          </div>
        </CardContent>

        <div className="p-6 border-t space-y-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              alert('Cancelamento confirmado (mockado)');
              onClose();
            }}
          >
            Confirmar cancelamento
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
