'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Download, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockRegistrosCapturadosEntregas } from '@/lib/mocks/registro-captura-entrega';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatDateTime(date: Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
}

function truncateHash(hash: string, length: number = 8): string {
  return hash.length > length ? hash.substring(0, length) + '...' : hash;
}

function getStatusBadge(status: string) {
  const config = {
    sucesso: { bg: 'bg-green-100', text: 'text-green-800', icon: Check, label: 'Sucesso' },
    falha_parcial: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle, label: 'Falha Parcial' },
    falha_total: { bg: 'bg-red-100', text: 'text-red-800', icon: X, label: 'Falha Total' },
  };

  const current = config[status as keyof typeof config] || config.falha_total;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${current.bg} ${current.text}`}>
      <Icon className="w-4 h-4" />
      {current.label}
    </span>
  );
}

export default function RegistroDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const registro = mockRegistrosCapturadosEntregas.find(r => r.id === id);

  if (!registro) {
    return (
      <div className="flex flex-col gap-6">
        <Link href="/ops/registro">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-neutral-600">Registro não encontrado.</p>
        </div>
      </div>
    );
  }

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/ops/registro">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <Button onClick={handleExportPdf} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-900">
            Instrumento Interno no MVP
          </p>
          <p className="text-xs text-yellow-800 mt-1">
            Este registro é instrumento interno no MVP. Exposição externa para Enterprise prevista para Fase 2.
          </p>
        </div>
      </div>

      <Card className="p-8 bg-white border border-neutral-300">
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-neutral-300 pb-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">REGISTRO IMUTÁVEL</h1>
                <p className="text-sm text-neutral-600 mt-1">Auditoria Completa de Captura e Entrega</p>
              </div>
              <div className="text-right">
                {getStatusBadge(registro.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">ID do Registro</p>
                <p className="font-mono text-lg font-bold text-orange-600 mt-1">{registro.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Número CNJ</p>
                <p className="font-mono text-lg font-bold text-neutral-900 mt-1">{registro.cnj}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">
                Dados do Registro
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Cliente</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{registro.cliente_id}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Fonte</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{registro.fonte}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Canal de Entrega</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">{registro.canal_entrega}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Status</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1">
                    {registro.status === 'sucesso' ? 'Entregue' : 'Entrega com Falhas'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">
                Timestamps de Processamento
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Captura</p>
                  <p className="text-sm font-mono text-neutral-900 mt-1">
                    {formatDateTime(registro.timestamp_captura)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Entrega</p>
                  <p className="text-sm font-mono text-neutral-900 mt-1">
                    {formatDateTime(registro.timestamp_entrega)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">
                Hashes de Integridade
              </h2>
              <div className="space-y-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div>
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Hash do Documento Original (SHA-256)</p>
                  <code className="text-xs font-mono text-neutral-800 mt-2 block break-all">{registro.hash_documento}</code>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <p className="text-xs text-neutral-600 uppercase tracking-wider font-medium">Hash do Registro (SHA-256)</p>
                  <code className="text-xs font-mono text-orange-700 mt-2 block break-all font-bold">{registro.hash_registro}</code>
                  <p className="text-xs text-neutral-500 mt-2">
                    Certifica a integridade de todos os dados deste registro. Qualquer alteração invalidaria este hash.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">
                Evidências Técnicas
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-semibold text-slate-900 mb-3">
                    {registro.canal_entrega === 'API' && 'REST API'}
                    {registro.canal_entrega === 'Webhook' && 'Webhook'}
                    {registro.canal_entrega === 'Email' && 'SMTP Email'}
                    {registro.canal_entrega === 'Dashboard' && 'Dashboard Web'}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-600 font-medium">IP de Origem</p>
                      <code className="text-xs font-mono text-slate-900 mt-1 block">{registro.evidencia_tecnica.ip_origem}</code>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Status HTTP</p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">
                        <span className={registro.evidencia_tecnica.status_http === 200 ? 'text-green-700' : 'text-red-700'}>
                          {registro.evidencia_tecnica.status_http}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">User-Agent</p>
                      <code className="text-xs font-mono text-slate-900 mt-1 block break-all">{registro.evidencia_tecnica.user_agent}</code>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Tempo de Resposta</p>
                      <p className="text-sm font-semibold text-slate-900 mt-1">{registro.evidencia_tecnica.tempo_resposta_ms}ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-neutral-300 pt-8 mt-8">
              <p className="text-xs text-neutral-500 text-center">
                Documento gerado automaticamente pelo sistema SBK de Captura e Auditoria
              </p>
              <p className="text-xs text-neutral-500 text-center mt-1">
                Registrado em: {formatDateTime(new Date())}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-3 print:hidden">
        <Link href="/ops/registro">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <Button onClick={handleExportPdf} className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
