'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  AlertCircle,
  Mail,
  MessageCircle,
  Webhook,
  ToggleLeft,
  ToggleRight,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

type TriggerType = 'novo_processo' | 'citacao' | 'falha_captura' | 'credencial_expirando' | 'monitoramento_match';
type ChannelType = 'email' | 'whatsapp' | 'webhook';
type DeliveryStatus = 'entregue' | 'falha' | 'pendente';

interface NotificationRule {
  id: string;
  nome: string;
  trigger: TriggerType;
  channels: ChannelType[];
  filtros?: {
    fonte?: string[];
    tipo?: string[];
  };
  ativo: boolean;
  criadoEm: Date;
}

interface AlertHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  trigger: TriggerType;
  channel: ChannelType;
  status: DeliveryStatus;
  timestamp: Date;
  destinatario: string;
  mensagem?: string;
}

const mockRules: NotificationRule[] = [
  {
    id: 'rule-001',
    nome: 'Citações recebidas',
    trigger: 'citacao',
    channels: ['email', 'whatsapp'],
    filtros: { fonte: ['PDPJ', 'DJE'] },
    ativo: true,
    criadoEm: subDays(new Date(), 15),
  },
  {
    id: 'rule-002',
    nome: 'Novos processos na caixa',
    trigger: 'novo_processo',
    channels: ['email'],
    filtros: { tipo: ['Intimação', 'Citação'] },
    ativo: true,
    criadoEm: subDays(new Date(), 30),
  },
  {
    id: 'rule-003',
    nome: 'Falhas de captura',
    trigger: 'falha_captura',
    channels: ['email'],
    ativo: true,
    criadoEm: subDays(new Date(), 8),
  },
  {
    id: 'rule-004',
    nome: 'Monitoramento - Match em TJ-SP',
    trigger: 'monitoramento_match',
    channels: ['webhook'],
    ativo: false,
    criadoEm: subDays(new Date(), 3),
  },
];

const mockAlerts: AlertHistory[] = [
  ...Array.from({ length: 45 }, (_, i) => {
    const status: DeliveryStatus[] = ['entregue', 'entregue', 'entregue', 'falha', 'pendente'];
    const channels: ChannelType[] = ['email', 'whatsapp', 'webhook'];
    const triggers: TriggerType[] = ['citacao', 'novo_processo', 'falha_captura', 'monitoramento_match'];

    return {
      id: `alert-${String(i + 1).padStart(5, '0')}`,
      ruleId: mockRules[Math.floor(Math.random() * mockRules.length)].id,
      ruleName: mockRules[Math.floor(Math.random() * mockRules.length)].nome,
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      status: status[Math.floor(Math.random() * status.length)],
      timestamp: subDays(new Date(), Math.floor(Math.random() * 30)),
      destinatario: `user+${i}@example.com`,
      mensagem: 'Notificação enviada com sucesso',
    };
  }),
];

function getTriggerLabel(trigger: TriggerType): string {
  const labels: Record<TriggerType, string> = {
    novo_processo: 'Novo processo na caixa',
    citacao: 'Citação recebida',
    falha_captura: 'Falha de captura',
    credencial_expirando: 'Credencial expirando',
    monitoramento_match: 'Match em monitoramento',
  };
  return labels[trigger];
}

function getChannelIcon(channel: ChannelType) {
  const icons: Record<ChannelType, React.ReactNode> = {
    email: <Mail size={16} />,
    whatsapp: <MessageCircle size={16} />,
    webhook: <Webhook size={16} />,
  };
  return icons[channel];
}

function getChannelLabel(channel: ChannelType): string {
  const labels: Record<ChannelType, string> = {
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    webhook: 'Webhook',
  };
  return labels[channel];
}

function getStatusIcon(status: DeliveryStatus) {
  switch (status) {
    case 'entregue':
      return <CheckCircle2 className="text-green-600" size={16} />;
    case 'falha':
      return <XCircle className="text-red-600" size={16} />;
    case 'pendente':
      return <Clock className="text-yellow-600" size={16} />;
  }
}

function getStatusLabel(status: DeliveryStatus): string {
  const labels: Record<DeliveryStatus, string> = {
    entregue: 'Entregue',
    falha: 'Falha',
    pendente: 'Pendente',
  };
  return labels[status];
}

type WizardStep = 1 | 2 | 3;

interface WizardState {
  nome: string;
  trigger: TriggerType | '';
  channels: ChannelType[];
  fonteFiltros: string[];
  tipoFiltros: string[];
}

export default function AlertasPage() {
  const [rules, setRules] = useState<NotificationRule[]>(mockRules);
  const [alerts, setAlerts] = useState<AlertHistory[]>(mockAlerts);
  const [selectedTab, setSelectedTab] = useState<'rules' | 'history'>('rules');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [wizardState, setWizardState] = useState<WizardState>({
    nome: '',
    trigger: '',
    channels: [],
    fonteFiltros: [],
    tipoFiltros: [],
  });
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const alertsUltimos30Dias = useMemo(() => {
    const dataLimite = subDays(new Date(), 30);
    return alerts.filter((a) => a.timestamp >= dataLimite);
  }, [alerts]);

  const handleOpenWizard = (ruleId?: string) => {
    if (ruleId) {
      const rule = rules.find((r) => r.id === ruleId);
      if (rule) {
        setEditingRuleId(ruleId);
        setWizardState({
          nome: rule.nome,
          trigger: rule.trigger,
          channels: rule.channels,
          fonteFiltros: rule.filtros?.fonte || [],
          tipoFiltros: rule.filtros?.tipo || [],
        });
      }
    } else {
      setEditingRuleId(null);
      setWizardState({
        nome: '',
        trigger: '',
        channels: [],
        fonteFiltros: [],
        tipoFiltros: [],
      });
    }
    setWizardStep(1);
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    setWizardStep(1);
  };

  const handleNextStep = () => {
    if (wizardStep < 3) {
      setWizardStep((wizardStep + 1) as WizardStep);
    }
  };

  const handlePreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep((wizardStep - 1) as WizardStep);
    }
  };

  const handleSaveRule = () => {
    if (!wizardState.nome || !wizardState.trigger || wizardState.channels.length === 0) {
      return;
    }

    const newRule: NotificationRule = {
      id: editingRuleId || `rule-${Date.now()}`,
      nome: wizardState.nome,
      trigger: wizardState.trigger as TriggerType,
      channels: wizardState.channels,
      filtros:
        wizardState.fonteFiltros.length > 0 || wizardState.tipoFiltros.length > 0
          ? {
              fonte: wizardState.fonteFiltros.length > 0 ? wizardState.fonteFiltros : undefined,
              tipo: wizardState.tipoFiltros.length > 0 ? wizardState.tipoFiltros : undefined,
            }
          : undefined,
      ativo: editingRuleId ? rules.find((r) => r.id === editingRuleId)?.ativo || true : true,
      criadoEm: editingRuleId ? rules.find((r) => r.id === editingRuleId)?.criadoEm || new Date() : new Date(),
    };

    if (editingRuleId) {
      setRules((prev) => prev.map((r) => (r.id === editingRuleId ? newRule : r)));
    } else {
      setRules((prev) => [...prev, newRule]);
    }

    handleCloseWizard();
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ativo: !r.ativo } : r))
    );
  };

  const handleToggleChannel = (channel: ChannelType) => {
    setWizardState((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleToggleFonteFiltro = (fonte: string) => {
    setWizardState((prev) => ({
      ...prev,
      fonteFiltros: prev.fonteFiltros.includes(fonte)
        ? prev.fonteFiltros.filter((f) => f !== fonte)
        : [...prev.fonteFiltros, fonte],
    }));
  };

  const handleToggleTipoFiltro = (tipo: string) => {
    setWizardState((prev) => ({
      ...prev,
      tipoFiltros: prev.tipoFiltros.includes(tipo)
        ? prev.tipoFiltros.filter((t) => t !== tipo)
        : [...prev.tipoFiltros, tipo],
    }));
  };

  const fontes = ['PDPJ', 'DJE', 'TJ'];
  const tipos = ['Citação', 'Intimação', 'Sentença', 'Despacho', 'Decisão'];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas e Notificações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure regras de notificação para eventos importantes
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSelectedTab('rules')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedTab === 'rules'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Regras de Notificação
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            selectedTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Histórico de Alertas
        </button>
      </div>

      {selectedTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => handleOpenWizard()} className="gap-2">
              <Plus size={16} />
              Nova Regra
            </Button>
          </div>

          {rules.length === 0 ? (
            <EmptyState
              illustration="empty"
              title="Nenhuma regra de notificação"
              description="Crie sua primeira regra para começar a receber alertas sobre eventos importantes"
            />
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{rule.nome}</h3>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          {getTriggerLabel(rule.trigger)}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-wrap mb-3">
                        {rule.channels.map((channel) => (
                          <span
                            key={channel}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"
                          >
                            {getChannelIcon(channel)}
                            {getChannelLabel(channel)}
                          </span>
                        ))}
                      </div>

                      {rule.filtros && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          {rule.filtros.fonte && (
                            <div>
                              Fontes: <span className="font-medium">{rule.filtros.fonte.join(', ')}</span>
                            </div>
                          )}
                          {rule.filtros.tipo && (
                            <div>
                              Tipos: <span className="font-medium">{rule.filtros.tipo.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        Criada em{' '}
                        {formatDistanceToNow(rule.criadoEm, {
                          locale: ptBR,
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title={rule.ativo ? 'Desativar' : 'Ativar'}
                      >
                        {rule.ativo ? (
                          <ToggleRight className="text-green-600" size={20} />
                        ) : (
                          <ToggleLeft className="text-muted-foreground" size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenWizard(rule.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'history' && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {alertsUltimos30Dias.length} alertas dos últimos 30 dias
          </div>

          {alertsUltimos30Dias.length === 0 ? (
            <EmptyState
              illustration="empty"
              title="Nenhum alerta enviado"
              description="Nenhum alerta foi enviado nos últimos 30 dias"
            />
          ) : (
            <div className="space-y-2">
              {alertsUltimos30Dias
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{alert.ruleName}</span>
                        <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                          {getTriggerLabel(alert.trigger)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(alert.channel)}
                          <span>{getChannelLabel(alert.channel)}</span>
                          <span className="text-muted-foreground">para</span>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {alert.destinatario}
                          </code>
                        </div>
                        <div>
                          {formatDistanceToNow(alert.timestamp, {
                            locale: ptBR,
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(alert.status)}
                        <span className="text-xs font-medium">{getStatusLabel(alert.status)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {showWizard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingRuleId ? 'Editar Regra' : 'Nova Regra de Notificação'}
                </h2>
                <button
                  onClick={handleCloseWizard}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step === wizardStep
                          ? 'bg-primary text-primary-foreground'
                          : step < wizardStep
                          ? 'bg-green-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step < wizardStep ? '✓' : step}
                    </div>
                    {step < 3 && <div className="w-6 h-0.5 bg-muted" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome da Regra</label>
                    <input
                      type="text"
                      value={wizardState.nome}
                      onChange={(e) =>
                        setWizardState((prev) => ({ ...prev, nome: e.target.value }))
                      }
                      placeholder="Ex: Citações recebidas"
                      className="w-full mt-2 px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Evento Disparador</label>
                    <div className="mt-2 space-y-2">
                      {(['novo_processo', 'citacao', 'falha_captura', 'credencial_expirando', 'monitoramento_match'] as const).map(
                        (trigger) => (
                          <label key={trigger} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              checked={wizardState.trigger === trigger}
                              onChange={() =>
                                setWizardState((prev) => ({ ...prev, trigger }))
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{getTriggerLabel(trigger)}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-3">
                      Canais de Notificação
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="checkbox"
                          checked={wizardState.channels.includes('email')}
                          onChange={() => handleToggleChannel('email')}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            <Mail size={16} />
                            E-mail
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Enviar notificações para seu e-mail registrado
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors opacity-60 relative">
                        <input
                          type="checkbox"
                          checked={wizardState.channels.includes('whatsapp')}
                          onChange={() => handleToggleChannel('whatsapp')}
                          className="w-4 h-4"
                          disabled
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            <MessageCircle size={16} />
                            WhatsApp
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Disponível no plano Professional+
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Upgrade necessário
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="checkbox"
                          checked={wizardState.channels.includes('webhook')}
                          onChange={() => handleToggleChannel('webhook')}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm flex items-center gap-2">
                            <Webhook size={16} />
                            Webhook
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Integrar com seu próprio sistema
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Filtros Opcionais (deixe em branco para aplicar a todos)
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">
                      Fontes
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {fontes.map((fonte) => (
                        <button
                          key={fonte}
                          onClick={() => handleToggleFonteFiltro(fonte)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            wizardState.fonteFiltros.includes(fonte)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {fonte}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-2">
                      Tipos de Documento
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {tipos.map((tipo) => (
                        <button
                          key={tipo}
                          onClick={() => handleToggleTipoFiltro(tipo)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            wizardState.tipoFiltros.includes(tipo)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-muted/20 flex items-center justify-between">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={wizardStep === 1}
              >
                Anterior
              </Button>

              <div className="text-sm text-muted-foreground">
                Passo {wizardStep} de 3
              </div>

              <div className="flex gap-2">
                {wizardStep === 3 ? (
                  <>
                    <Button
                      onClick={handleCloseWizard}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveRule}
                      disabled={
                        !wizardState.nome ||
                        !wizardState.trigger ||
                        wizardState.channels.length === 0
                      }
                    >
                      {editingRuleId ? 'Atualizar' : 'Criar'} Regra
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (wizardStep === 1 && (!wizardState.nome || !wizardState.trigger))
                    }
                  >
                    Próximo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
