'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Pause,
  Play,
  Trash2,
  Edit2,
  Clock,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockMonitoramentos, Monitoramento } from '@/lib/mocks/monitoramentos';

interface ResultadoRecente {
  id: string;
  termo: string;
  processo_cnj: string;
  tribunal: string;
  data_match: Date;
  fonte: string;
}

interface NovoMonitoramento {
  termo: string;
  fontes: string[];
  frequencia: 'real-time' | 'horaria' | 'diaria' | '4h';
  notificar_email: boolean;
  notificar_whatsapp: boolean;
}

const FONTES_DISPONIVEIS = ['PDPJ', 'DJE', 'TJ-SP', 'TJ-RJ', 'TJ-MG', 'TJ-BA'];

const gerarResultadosRecentes = (): ResultadoRecente[] => {
  const resultados: ResultadoRecente[] = [];
  let id = 0;

  mockMonitoramentos.forEach((mon) => {
    const matchesTotal = mon.total_matches_7d;
    const processos = [
      '0000001-95.2024.8.26.0100',
      '0000002-95.2024.8.26.0100',
      '0000003-95.2024.8.26.0100',
      '0000004-95.2024.8.26.0100',
      '0000005-95.2024.8.26.0100',
    ];
    const tribunais = ['TJ-SP', 'TJ-RJ', 'TJ-MG', 'TJ-BA'];

    for (let i = 0; i < Math.min(matchesTotal, 5); i++) {
      resultados.push({
        id: `res-${String(id).padStart(4, '0')}`,
        termo: mon.termo,
        processo_cnj: processos[i % processos.length],
        tribunal: tribunais[i % tribunais.length],
        data_match: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ),
        fonte: mon.fontes_ativadas[
          Math.floor(Math.random() * mon.fontes_ativadas.length)
        ],
      });
      id++;
    }
  });

  return resultados.sort(
    (a, b) => b.data_match.getTime() - a.data_match.getTime()
  );
};

export default function MonitoramentoPage() {
  const [aba, setAba] = useState<'termos' | 'resultados'>('termos');
  const [monitoramentos, setMonitoramentos] = useState<Monitoramento[]>(
    mockMonitoramentos.filter((m) => m.status !== 'excluido')
  );
  const [resultadosRecentes] = useState<ResultadoRecente[]>(
    gerarResultadosRecentes()
  );
  const [showModal, setShowModal] = useState(false);
  const [novoMonitoramento, setNovoMonitoramento] = useState<NovoMonitoramento>({
    termo: '',
    fontes: [],
    frequencia: 'horaria',
    notificar_email: false,
    notificar_whatsapp: false,
  });

  const handleToggleFonte = (fonte: string) => {
    setNovoMonitoramento((prev) => ({
      ...prev,
      fontes: prev.fontes.includes(fonte)
        ? prev.fontes.filter((f) => f !== fonte)
        : [...prev.fontes, fonte],
    }));
  };

  const handleCriarMonitoramento = () => {
    if (!novoMonitoramento.termo.trim() || novoMonitoramento.fontes.length === 0) {
      return;
    }

    const novoMon: Monitoramento = {
      id: `mon-${String(monitoramentos.length + 1).padStart(3, '0')}`,
      termo: novoMonitoramento.termo,
      fontes_ativadas: novoMonitoramento.fontes,
      frequencia: novoMonitoramento.frequencia,
      total_matches_24h: 0,
      total_matches_7d: 0,
      status: 'ativo',
      ultima_atualizacao: new Date(),
    };

    setMonitoramentos((prev) => [novoMon, ...prev]);
    setShowModal(false);
    setNovoMonitoramento({
      termo: '',
      fontes: [],
      frequencia: 'horaria',
      notificar_email: false,
      notificar_whatsapp: false,
    });
  };

  const handleToggleStatus = (id: string) => {
    setMonitoramentos((prev) =>
      prev.map((mon) =>
        mon.id === id
          ? {
              ...mon,
              status: mon.status === 'ativo' ? 'pausado' : 'ativo',
              ultima_atualizacao: new Date(),
            }
          : mon
      )
    );
  };

  const handleExcluir = (id: string) => {
    setMonitoramentos((prev) => prev.filter((mon) => mon.id !== id));
  };

  const frequenciaLabel = (freq: string) => {
    const labels: Record<string, string> = {
      'real-time': 'Tempo real',
      horaria: '1h',
      '4h': '4h',
      diaria: 'Diária',
    };
    return labels[freq] || freq;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Monitoramento de Movimentações</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Novo monitoramento
        </Button>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setAba('termos')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            aba === 'termos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Termos monitorados ({monitoramentos.length})
        </button>
        <button
          onClick={() => setAba('resultados')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            aba === 'resultados'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Resultados recentes
        </button>
      </div>

      {aba === 'termos' && (
        <Card className="overflow-hidden">
          {monitoramentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <AlertCircle size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Nenhum monitoramento ativo
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Crie seu primeiro monitoramento para começar a acompanhar processos
              </p>
              <Button onClick={() => setShowModal(true)}>
                Criar monitoramento
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Termo</th>
                    <th className="px-6 py-3 text-left font-semibold">Fontes</th>
                    <th className="px-6 py-3 text-center font-semibold">
                      Frequência
                    </th>
                    <th className="px-6 py-3 text-center font-semibold">
                      Matches 24h
                    </th>
                    <th className="px-6 py-3 text-center font-semibold">
                      Matches 7d
                    </th>
                    <th className="px-6 py-3 text-left font-semibold">
                      Última atualização
                    </th>
                    <th className="px-6 py-3 text-center font-semibold">Status</th>
                    <th className="px-6 py-3 text-center font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoramentos.map((mon) => (
                    <tr
                      key={mon.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{mon.termo}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {mon.fontes_ativadas.map((fonte) => (
                            <span
                              key={fonte}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                            >
                              {fonte}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium">
                          <Clock size={14} />
                          {frequenciaLabel(mon.frequencia)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {mon.total_matches_24h}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {mon.total_matches_7d}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {formatDistanceToNow(mon.ultima_atualizacao, {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mon.status === 'ativo'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {mon.status === 'ativo' ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(mon.id)}
                            className="p-1.5 hover:bg-muted rounded transition-colors"
                            title={
                              mon.status === 'ativo' ? 'Pausar' : 'Retomar'
                            }
                          >
                            {mon.status === 'ativo' ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} />
                            )}
                          </button>
                          <button
                            className="p-1.5 hover:bg-muted rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleExcluir(mon.id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {aba === 'resultados' && (
        <div className="space-y-4">
          {resultadosRecentes.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <AlertCircle size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">
                Nenhum resultado recente
              </h3>
              <p className="text-sm text-muted-foreground">
                Os matches dos monitoramentos aparecerão aqui
              </p>
            </Card>
          ) : (
            resultadosRecentes.map((resultado) => (
              <Card
                key={resultado.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">
                      {resultado.termo}
                    </h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        <span className="font-mono text-primary">
                          {resultado.processo_cnj}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        <span>{resultado.tribunal}</span>
                        <span>{resultado.fonte}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(resultado.data_match, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 text-xs"
                    >
                      Ver na caixa
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <Card
            className="w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Novo monitoramento</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Termo</label>
                <input
                  type="text"
                  value={novoMonitoramento.termo}
                  onChange={(e) =>
                    setNovoMonitoramento((prev) => ({
                      ...prev,
                      termo: e.target.value,
                    }))
                  }
                  placeholder="Ex: Execução de Sentença"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Fontes</label>
                <div className="space-y-2">
                  {FONTES_DISPONIVEIS.map((fonte) => (
                    <label
                      key={fonte}
                      className="flex items-center gap-2 cursor-pointer p-2 hover:bg-muted rounded"
                    >
                      <input
                        type="checkbox"
                        checked={novoMonitoramento.fontes.includes(fonte)}
                        onChange={() => handleToggleFonte(fonte)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{fonte}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Frequência
                </label>
                <select
                  value={novoMonitoramento.frequencia}
                  onChange={(e) =>
                    setNovoMonitoramento((prev) => ({
                      ...prev,
                      frequencia: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="real-time">Tempo real</option>
                  <option value="horaria">1 hora</option>
                  <option value="4h">4 horas</option>
                  <option value="diaria">Diária</option>
                </select>
              </div>

              <div className="space-y-3 border-t pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={novoMonitoramento.notificar_email}
                    onChange={(e) =>
                      setNovoMonitoramento((prev) => ({
                        ...prev,
                        notificar_email: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">
                    Notificar por e-mail quando houver match
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer opacity-50">
                  <input
                    type="checkbox"
                    disabled
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm flex items-center gap-2">
                    Notificar por WhatsApp
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      Requer plano Pro+
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCriarMonitoramento}
                disabled={!novoMonitoramento.termo.trim() || novoMonitoramento.fontes.length === 0}
                className="flex-1"
              >
                Criar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
