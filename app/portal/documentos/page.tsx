'use client';

import { useState, useMemo } from 'react';
import {
  Download,
  FileText,
  Eye,
  Copy,
  Check,
  X,
  ChevronDown,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { mockDocumentos, Documento } from '@/lib/mocks/processos';

export default function DocumentosPage() {
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [selectedRows, setSelectedRows] = useState<Documento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fontFilter, setFontFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const fontes = Array.from(new Set(mockDocumentos.map((d) => d.fonte)));
  const tipos = Array.from(new Set(mockDocumentos.map((d) => d.tipo_documento)));

  const documentosFiltrados = useMemo(() => {
    return mockDocumentos.filter((doc) => {
      const matchSearch =
        !searchTerm ||
        doc.cnj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tipo_documento.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFonte = fontFilter === 'all' || doc.fonte === fontFilter;
      const matchType = typeFilter === 'all' || doc.tipo_documento === typeFilter;
      const matchStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchDate =
        (!dateRange.start || doc.data_captura >= dateRange.start) &&
        (!dateRange.end ||
          doc.data_captura <=
            new Date(dateRange.end.getTime() + 86400000));

      return matchSearch && matchFonte && matchType && matchStatus && matchDate;
    });
  }, [searchTerm, fontFilter, typeFilter, statusFilter, dateRange]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDownloadBatch = () => {
    if (selectedRows.length === 0) return;

    showToast(
      `Job de download criado para ${selectedRows.length} documento${selectedRows.length !== 1 ? 's' : ''}, você será notificado quando estiver pronto`,
      'success'
    );

    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setDownloadProgress(null);
          showToast('Download concluído!', 'success');
          return null;
        }
        return prev + Math.random() * 30;
      });
    }, 500);
  };

  const handleExportMetadata = () => {
    if (selectedRows.length === 0) return;

    const csv = [
      ['CNJ', 'Tipo', 'Fonte', 'Tribunal', 'Data Captura', 'Tamanho (KB)', 'Hash', 'Status'],
      ...selectedRows.map((doc) => [
        doc.cnj,
        doc.tipo_documento,
        doc.fonte,
        doc.tribunal,
        format(doc.data_captura, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        (doc.tamanho / 1024).toFixed(2),
        doc.hash_truncado,
        doc.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metadados-documentos-${format(new Date(), 'dd-MM-yyyy-HHmm')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    showToast('Metadados exportados com sucesso', 'success');
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processado':
        return 'bg-green-100 text-green-700';
      case 'processando':
        return 'bg-blue-100 text-blue-700';
      case 'erro':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const columns: ColumnDef<Documento>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 40,
    },
    {
      accessorKey: 'cnj',
      header: 'CNJ',
      cell: ({ row }) => (
        <code className="text-xs font-mono font-semibold">{row.original.cnj}</code>
      ),
    },
    {
      accessorKey: 'tipo_documento',
      header: 'Tipo',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.tipo_documento}</span>
      ),
    },
    {
      accessorKey: 'fonte',
      header: 'Fonte',
      cell: ({ row }) => (
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
          {row.original.fonte}
        </span>
      ),
    },
    {
      accessorKey: 'tribunal',
      header: 'Tribunal',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.tribunal}</span>
      ),
    },
    {
      accessorKey: 'data_captura',
      header: 'Data Captura',
      cell: ({ row }) => (
        <span className="text-xs text-gray-600">
          {format(row.original.data_captura, 'dd/MM/yyyy HH:mm')}
        </span>
      ),
    },
    {
      accessorKey: 'tamanho',
      header: 'Tamanho',
      cell: ({ row }) => (
        <span className="text-xs">
          {(row.original.tamanho / 1024).toFixed(2)} KB
        </span>
      ),
    },
    {
      accessorKey: 'hash_truncado',
      header: 'Hash',
      cell: ({ row }) => (
        <code className="text-xs bg-gray-50 px-1.5 py-0.5 rounded">
          {row.original.hash_truncado}...
        </code>
      ),
    },
    {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDoc(row.original)}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
            title="Visualizar"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '#';
              link.download = `${row.original.cnj}.pdf`;
              link.click();
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      ),
      size: 80,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documentos</h1>
        <p className="text-gray-600 text-sm mt-1">
          Consolidação de documentos da caixa de entrada e monitoramentos
        </p>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4 space-y-4">
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-64">
            <label className="text-sm font-medium block mb-2">
              Buscar por CNJ ou termo
            </label>
            <input
              type="text"
              placeholder="Digite CNJ ou termo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Fonte</label>
            <select
              value={fontFilter}
              onChange={(e) => setFontFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm bg-white"
            >
              <option value="all">Todas</option>
              {fontes.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm bg-white"
            >
              <option value="all">Todos</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm bg-white"
            >
              <option value="all">Todos</option>
              <option value="processado">Processado</option>
              <option value="processando">Processando</option>
              <option value="erro">Erro</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Período</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={
                  dateRange.start
                    ? format(dateRange.start, 'yyyy-MM-dd')
                    : ''
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    start: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
              />
              <input
                type="date"
                value={
                  dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : ''
                }
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    end: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-gray-600">
            {documentosFiltrados.length} documento{documentosFiltrados.length !== 1 ? 's' : ''} encontrado{documentosFiltrados.length !== 1 ? 's' : ''}
          </span>

          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-600">
                {selectedRows.length} selecionado{selectedRows.length !== 1 ? 's' : ''}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadBatch}
                className="h-8 text-xs gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                Download em lote (.zip)
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportMetadata}
                className="h-8 text-xs gap-1"
              >
                <FileText className="h-3.5 w-3.5" />
                Exportar metadados (.csv)
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* DataTable */}
      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={documentosFiltrados}
          searchKey={undefined}
          onSelectionChange={setSelectedRows}
          emptyMessage="Nenhum documento encontrado com os filtros selecionados."
        />
      </Card>

      {/* Drawer Lateral */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div
            className="w-full max-w-lg bg-white flex flex-col h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold font-mono">{selectedDoc.cnj}</h2>
                <div className="flex gap-2 flex-wrap mt-3">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {selectedDoc.tribunal}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                    {selectedDoc.fonte}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedDoc.status)}`}>
                    {selectedDoc.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <div className="text-sm font-medium">Prévia do documento</div>
                  <div className="text-xs mt-1">PDF renderizado como imagem mock</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Metadados</h3>
                <dl className="grid grid-cols-1 gap-4 text-xs space-y-3">
                  <div>
                    <dt className="text-gray-600 font-medium">Tipo de Documento</dt>
                    <dd className="mt-1">{selectedDoc.tipo_documento}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Tribunal</dt>
                    <dd className="mt-1">{selectedDoc.tribunal}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Fonte</dt>
                    <dd className="mt-1">{selectedDoc.fonte}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Data de Captura</dt>
                    <dd className="mt-1">
                      {format(selectedDoc.data_captura, 'dd/MM/yyyy HH:mm:ss', {
                        locale: ptBR,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Tamanho</dt>
                    <dd className="mt-1">
                      {(selectedDoc.tamanho / 1024).toFixed(2)} KB
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Status</dt>
                    <dd className={`mt-1 inline-block px-2 py-1 rounded ${getStatusColor(selectedDoc.status)}`}>
                      {selectedDoc.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-600 font-medium">Origem</dt>
                    <dd className="mt-1 capitalize">
                      {selectedDoc.origem === 'caixa_entrada'
                        ? 'Caixa de Entrada'
                        : 'Monitoramento'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Hash SHA-256</h3>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-50 px-2 py-1.5 rounded flex-1 overflow-x-auto">
                    sha256_{Math.random().toString(36).substring(2, 34)}...
                  </code>
                  <button
                    onClick={() =>
                      copyHashToClipboard(
                        `sha256_${Math.random().toString(36).substring(2, 34)}...`
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 flex-shrink-0"
                  >
                    {copiedHash ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-2"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '#';
                  link.download = `${selectedDoc.cnj}.pdf`;
                  link.click();
                }}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedDoc(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-40">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Download Progress */}
      {downloadProgress !== null && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72">
            <div className="text-sm font-medium mb-2">
              Download em progresso...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(downloadProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {Math.min(Math.round(downloadProgress), 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
