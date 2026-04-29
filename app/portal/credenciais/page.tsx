'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  Edit2,
  Trash2,
  Plus,
  Settings,
  AlertTriangle,
  ChevronRight,
  X,
  ChevronDown,
  Lock,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockCredenciais, mockClientesRepresentados, type ClienteRepresentado } from '@/lib/mocks/credenciais';

export default function CredenciaisPage() {
  const [isEscritorio, setIsEscritorio] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<ClienteRepresentado | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const clientesComCredencialExpirada = mockClientesRepresentados.filter(
    c => c.status_credencial === 'expirado'
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      {/* Dev Toggle */}
      <div className="flex items-center justify-end mb-6 gap-2">
        <span className="text-xs text-neutral-500">Dev:</span>
        <button
          onClick={() => setIsEscritorio(!isEscritorio)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            isEscritorio ? 'bg-brand' : 'bg-neutral-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              isEscritorio ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="text-xs text-neutral-600">
          {isEscritorio ? 'Escritório' : 'Cliente'}
        </span>
      </div>

      {/* Variante 1: Cliente Direto */}
      {!isEscritorio && (
        <div className="max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Credenciais PDPJ</h1>
            <p className="text-neutral-600">Gerencie suas credenciais de acesso ao PDPJ</p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="mb-6 gap-2"
          >
            <Plus size={16} />
            Adicionar credencial PDPJ
          </Button>

          <div className="space-y-3">
            {mockCredenciais.map((cred) => (
              <Card key={cred.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{cred.nome}</h3>
                        <p className="text-sm text-neutral-600">{cred.cnpj_completo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <StatusBadge status={cred.status} />
                      <span className="text-xs text-neutral-500">
                        Validada {formatDistanceToNow(cred.ultima_validacao, {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-neutral-100 rounded p-2 w-fit">
                      <Lock size={14} className="text-neutral-500" />
                      <code className="text-xs font-mono text-neutral-700">
                        {cred.token_mascarado}
                      </code>
                      <button
                        onClick={() => handleCopyToken(cred.token_mascarado)}
                        className="p-0.5 hover:bg-neutral-200 rounded transition-colors"
                        title="Copiar token"
                      >
                        {copiedToken === cred.token_mascarado ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-neutral-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Edit2 size={14} />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                      Revogar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Modal Adicionar Credencial */}
          {showAddModal && (
            <AddCredencialModal onClose={() => setShowAddModal(false)} />
          )}
        </div>
      )}

      {/* Variante 2: Escritório */}
      {isEscritorio && (
        <div className="max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Credenciais de Clientes Representados
            </h1>
            <p className="text-neutral-600">
              Você está no modo Escritório, gerenciando credenciais de{' '}
              <span className="font-semibold">{mockClientesRepresentados.length}</span>{' '}
              clientes representados
            </p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-neutral-600 mb-1">Total de Clientes</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockClientesRepresentados.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-neutral-600 mb-1">Capturas (24h)</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockClientesRepresentados.reduce((acc, c) => acc + c.capturas_24h, 0)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-neutral-600 mb-1">Ciências Realizadas</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockClientesRepresentados.reduce((acc, c) => acc + c.ciencias_realizadas, 0)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-neutral-600 mb-1">Pendentes de Aprovação</p>
              <p className="text-2xl font-bold text-neutral-900">
                {mockClientesRepresentados.reduce((acc, c) => acc + c.pendentes_aprovacao, 0)}
              </p>
            </Card>
          </div>

          {/* Banner Credenciais Expiradas */}
          {clientesComCredencialExpirada > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">
                  {clientesComCredencialExpirada}{' '}
                  {clientesComCredencialExpirada === 1
                    ? 'cliente com credencial expirada'
                    : 'clientes com credenciais expiradas'}
                </p>
                <p className="text-xs text-yellow-700">
                  Renove para retomar captura
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                Renovar
              </Button>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 mb-6">
            <Button className="gap-2">
              <Plus size={16} />
              Adicionar cliente representado
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings size={16} />
              Configurar modo de ciência
            </Button>
          </div>

          {/* Tabela de Clientes */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">
                      Fontes Monitoradas
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">
                      Modo de Ciência
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-neutral-700">
                      Capturas 24h
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {mockClientesRepresentados.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-neutral-900">{cliente.nome}</p>
                          <p className="text-xs text-neutral-600">
                            {cliente.cnpj_cpf}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {cliente.fontes_monitoradas.map((fonte) => (
                            <span
                              key={fonte}
                              className="px-2 py-1 bg-brand-subtle text-brand text-xs font-medium rounded"
                            >
                              {fonte}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-neutral-700">
                          {cliente.modo_ciencia === 'automatica'
                            ? 'Automática'
                            : cliente.modo_ciencia === 'manual'
                            ? 'Aprovação manual'
                            : 'Desativado'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={cliente.status_credencial} />
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-neutral-900">
                        {cliente.capturas_24h}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedCliente(cliente);
                            setShowDrawer(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium text-brand hover:bg-brand-subtle transition-colors"
                        >
                          <Settings size={14} />
                          Configurar
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Drawer de Configuração */}
          {showDrawer && selectedCliente && (
            <ClienteDrawer
              cliente={selectedCliente}
              onClose={() => {
                setShowDrawer(false);
                setSelectedCliente(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    ativo: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Ativo',
    },
    expirado: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'Expirado',
    },
    inválido: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      label: 'Inválido',
    },
    aguardando: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Aguardando',
    },
  };

  const config = configs[status] || configs.aguardando;

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function AddCredencialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Adicionar Credencial PDPJ
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <>
              {showInstructions && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 w-full"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        showInstructions ? '' : 'rotate-180'
                      }`}
                    />
                    Como obter seu token PDPJ
                  </button>
                  {showInstructions && (
                    <div className="ml-6 space-y-2 text-xs text-blue-700">
                      <p>
                        1. Acesse{' '}
                        <a
                          href="#"
                          className="underline hover:text-blue-900"
                        >
                          https://portal.cnj.jus.br
                        </a>
                      </p>
                      <p>
                        2. Faça login com suas credenciais
                      </p>
                      <p>
                        3. Vá em Integrações &gt; Tokens de Acesso
                      </p>
                      <p>
                        4. Clique em "Novo Token" e selecione "PDPJ"
                      </p>
                      <p>
                        5. Copie o token gerado
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-900">
                  Token PDPJ
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Seu token do portal CNJ"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-900">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!token || !cnpj}
                  className="flex-1"
                >
                  Próximo
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    Credencial válida
                  </p>
                  <p className="text-xs text-green-700">
                    Seu token foi validado com sucesso
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-neutral-600">CNPJ</p>
                <p className="font-mono text-sm text-neutral-900">{cnpj}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    setStep(1);
                    setToken('');
                    setCnpj('');
                  }}
                  className="flex-1"
                >
                  Adicionar
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function ClienteDrawer({
  cliente,
  onClose,
}: {
  cliente: ClienteRepresentado;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            Configuração de Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Info Cliente */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-600 uppercase">
              Cliente
            </p>
            <p className="font-semibold text-neutral-900">{cliente.nome}</p>
            <p className="text-sm text-neutral-600">{cliente.cnpj_cpf}</p>
          </div>

          {/* Fontes */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-neutral-600 uppercase">
              Fontes Monitoradas
            </p>
            <div className="space-y-2">
              {cliente.fontes_monitoradas.map((fonte) => (
                <label key={fonte} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-neutral-300"
                  />
                  <span className="text-sm text-neutral-900">{fonte}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Modo de Ciência */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-neutral-600 uppercase">
              Modo de Ciência
            </p>
            <div className="space-y-2">
              {(['automatica', 'manual', 'desativado'] as const).map((modo) => (
                <label key={modo} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="modo_ciencia"
                    value={modo}
                    defaultChecked={cliente.modo_ciencia === modo}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-neutral-900">
                    {modo === 'automatica'
                      ? 'Ciência Automática'
                      : modo === 'manual'
                      ? 'Aprovação Manual'
                      : 'Desativado'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipos de Movimentação */}
          {cliente.tipos_movimentacao_autorizados && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-neutral-600 uppercase">
                Tipos de Movimentação que Autorizam Ciência
              </p>
              <div className="space-y-2">
                {cliente.tipos_movimentacao_autorizados.map((tipo) => (
                  <label key={tipo} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded border-neutral-300"
                    />
                    <span className="text-sm text-neutral-900">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Histórico de Ciências */}
          {cliente.historico_ciencias && cliente.historico_ciencias.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <p className="text-xs font-semibold text-neutral-600 uppercase">
                Histórico Recente
              </p>
              <div className="space-y-2">
                {cliente.historico_ciencias.slice(0, 3).map((ciencia) => (
                  <div key={ciencia.id} className="flex items-center gap-2 text-xs">
                    <Check size={14} className="text-green-600" />
                    <div>
                      <p className="text-neutral-900">
                        {ciencia.tipo}
                      </p>
                      <p className="text-neutral-600">
                        {format(ciencia.data, "HH:mm 'de' dd 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-200 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button onClick={onClose} className="flex-1">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
