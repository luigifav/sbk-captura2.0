'use client';

import { useState, useMemo } from 'react';
import {
  Eye,
  EyeOff,
  Archive,
  Download,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Timeline } from '@/components/ui/timeline';
import { mockProcessos, Processo } from '@/lib/mocks/processos';

type SortOrder = 'desc' | 'asc';
type FilterType = 'all' | string;

export default function CaixaEntradaPage() {
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [leitura, setLeitura] = useState<Record<string, boolean>>({});
  const [arquivado, setArquivado] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterFonte, setFilterFonte] = useState<FilterType>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const statusLeitura = useMemo<Record<string, boolean>>(
    () =>
      mockProcessos.reduce(
        (acc, proc) => ({
          ...acc,
          [proc.id]: leitura[proc.id] ?? proc.status_leitura,
        }),
        {} as Record<string, boolean>
      ),
    [leitura]
  );

  const processosFiltrados = useMemo(() => {
    let filtered = mockProcessos
      .filter(
        (proc) =>
          !arquivado[proc.id] &&
          (filterType === 'all' || proc.tipo_andamento === filterType) &&
          (filterFonte === 'all' || proc.fonte === filterFonte)
      )
      .sort((a, b) => {
        const timeA = a.data_captura.getTime();
        const timeB = b.data_captura.getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });

    return filtered;
  }, [sortOrder, filterType, filterFonte, arquivado]);

  const novos = processosFiltrados.filter((p) => !statusLeitura[p.id]).length;
  const total = processosFiltrados.length;

  const handleMarcarTodos = () => {
    const novaLeitura = { ...leitura };
    processosFiltrados.forEach((p) => {
      novaLeitura[p.id] = true;
    });
    setLeitura(novaLeitura);
  };

  const handleMarcarLido = (id: string) => {
    setLeitura((prev) => ({ ...prev, [id]: true }));
    if (selectedProcesso?.id === id) {
      setSelectedProcesso((prev) =>
        prev ? { ...prev, status_leitura: true } : null
      );
    }
  };

  const handleArquivar = (id: string) => {
    setArquivado((prev) => ({ ...prev, [id]: true }));
    if (selectedProcesso?.id === id) {
      setSelectedProcesso(null);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedProcesso) return;
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${selectedProcesso.cnj}.pdf`;
    link.click();
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getAndamentoColor = (tipo: string) => {
    if (tipo === 'Citação' || tipo === 'Intimação') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getAndamentoIndicator = (tipo: string) => {
    return tipo === 'Citação' || tipo === 'Intimação';
  };

  const getTimelineEvents = (processo: Processo) => {
    const estados = [
      { id: '1', label: 'Localizado', timestamp: processo.data_captura },
      { id: '2', label: 'Capturado', timestamp: new Date(processo.data_captura.getTime() + 3600000) },
      { id: '3', label: 'Enviado', timestamp: new Date(processo.data_captura.getTime() + 7200000) },
      { id: '4', label: 'Entregue', timestamp: new Date(processo.data_captura.getTime() + 10800000) },
    ];
    return estados;
  };

  const tipos = Array.from(new Set(mockProcessos.map((p) => p.tipo_andamento)));
  const fontes = Array.from(new Set(mockProcessos.map((p) => p.fonte)));

  if (processosFiltrados.length === 0 && total === 0) {
    return (
      <EmptyState
        illustration="empty"
        title="Nenhuma captura ainda"
        description="Configure suas credenciais PDPJ ou crie um monitoramento para começar a receber processos."
      />
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div className="w-[40%] flex flex-col border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-primary">{novos}</span>
              <span className="text-muted-foreground"> novos / </span>
              <span className="font-semibold">{total}</span>
              <span className="text-muted-foreground"> total</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarcarTodos}
              className="text-xs"
            >
              Marcar todos como lidos
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="relative group">
              <Button
                size="sm"
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                Tipo {filterType !== 'all' && <Check size={14} />}
                <ChevronDown size={14} />
              </Button>
              <div className="hidden group-hover:block absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-48">
                <button
                  onClick={() => setFilterType('all')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                >
                  Todos
                </button>
                {tipos.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFilterType(tipo)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <Button
                size="sm"
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                Fonte {filterFonte !== 'all' && <Check size={14} />}
                <ChevronDown size={14} />
              </Button>
              <div className="hidden group-hover:block absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => setFilterFonte('all')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                >
                  Todas
                </button>
                {fontes.map((fonte) => (
                  <button
                    key={fonte}
                    onClick={() => setFilterFonte(fonte)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                  >
                    {fonte}
                  </button>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="text-xs flex items-center gap-1"
            >
              {sortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 p-2">
          {processosFiltrados.map((processo) => (
            <div
              key={processo.id}
              onClick={() => setSelectedProcesso(processo)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedProcesso?.id === processo.id
                  ? 'bg-primary/10 border border-primary'
                  : 'hover:bg-muted border border-transparent'
              }`}
            >
              <div className="flex gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!statusLeitura[processo.id] && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                    <code className="text-xs font-mono font-semibold truncate">
                      {processo.cnj}
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {processo.tribunal}
                  </div>
                  <div className="flex gap-1 flex-wrap items-center mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getAndamentoColor(
                        processo.tipo_andamento
                      )}`}
                    >
                      {processo.tipo_andamento}
                    </span>
                    {getAndamentoIndicator(processo.tipo_andamento) && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                        PRAZO CORRENDO
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(processo.data_captura, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[60%] flex flex-col">
        {selectedProcesso ? (
          <Card className="flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold font-mono">
                  {selectedProcesso.cnj}
                </h2>
                <button
                  onClick={() => {
                    handleArquivar(selectedProcesso.id);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  title="Arquivar"
                >
                  <Archive size={20} />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                  {selectedProcesso.tribunal}
                </span>
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                  {selectedProcesso.fonte}
                </span>
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                  {selectedProcesso.tipo_andamento}
                </span>
                <span className="px-2 py-1 bg-muted rounded text-xs font-medium capitalize">
                  Polo {selectedProcesso.polo}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  Capturado em{' '}
                  {selectedProcesso.data_captura.toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate flex-1">
                  {selectedProcesso.hash_documento.substring(0, 32)}...
                </code>
                <button
                  onClick={() =>
                    copyHashToClipboard(selectedProcesso.hash_documento)
                  }
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Copiar hash completo"
                >
                  {copiedHash === selectedProcesso.hash_documento ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="px-6 pt-4 flex gap-2 border-b pb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarcarLido(selectedProcesso.id)}
                disabled={statusLeitura[selectedProcesso.id]}
                className="flex items-center gap-2"
              >
                {statusLeitura[selectedProcesso.id] ? (
                  <>
                    <Eye size={16} />
                    <span className="text-xs">Marcado como lido</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} />
                    <span className="text-xs">Marcar como lido</span>
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span className="text-xs">Download PDF</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="flex items-center gap-2 ml-auto"
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                  <span className="text-xs">Ver no tribunal</span>
                </a>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm font-medium">Prévia do documento</div>
                  <div className="text-xs mt-1">
                    PDF renderizado como imagem mock
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Metadados</h3>
                <dl className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <dt className="text-muted-foreground font-medium">
                      Tribunal
                    </dt>
                    <dd className="mt-1">{selectedProcesso.tribunal}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-medium">Fonte</dt>
                    <dd className="mt-1">{selectedProcesso.fonte}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-medium">
                      Andamento
                    </dt>
                    <dd className="mt-1">{selectedProcesso.tipo_andamento}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-medium">Polo</dt>
                    <dd className="mt-1 capitalize">{selectedProcesso.polo}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-medium">
                      Tamanho
                    </dt>
                    <dd className="mt-1">
                      {(selectedProcesso.tamanho_documento / 1024).toFixed(2)} KB
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-medium">Estado</dt>
                    <dd className="mt-1">{selectedProcesso.estado}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Timeline de captura</h3>
                <Timeline
                  events={getTimelineEvents(selectedProcesso)}
                  showDuration={false}
                  compact
                />
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <EmptyState
              illustration="empty"
              title="Nenhum processo selecionado"
              description="Clique em um item da lista para visualizar os detalhes"
              compact
            />
          </Card>
        )}
      </div>
    </div>
  );
}
