'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ActionModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  onReasonChange: (reason: string) => void;
}

export function ActionModal({
  title,
  isOpen,
  onClose,
  onConfirm,
  reason,
  onReasonChange,
}: ActionModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isReasonValid = reason.trim().length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Razão da ação (obrigatório)
              </label>
              <textarea
                ref={textareaRef}
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Descreva o motivo desta ação..."
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                rows={4}
              />
              {!isReasonValid && (
                <p className="mt-2 text-xs text-danger-foreground bg-danger-light px-3 py-2 rounded">
                  Você deve informar uma razão para continuar.
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t bg-neutral-50">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!isReasonValid}
              className="flex-1"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
