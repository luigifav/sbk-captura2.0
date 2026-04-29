// Seção 9.5: Gestão de Retry e Timeout

import { subDays, subHours, addHours } from 'date-fns';

export interface RetryProcessoPush {
  id: string;
  processo_id: string;
  cnj: string;
  cliente: string;
  canal: 'email' | 'webhook';
  numero_tentativas: number;
  tentativas_totais: number;
  ultimo_erro: string;
  ultima_tentativa: Date;
  proxima_tentativa: Date;
  dias_em_retry: number;
  timestamp_inicio_retry: Date;
  status: 'ativo' | 'aguardando' | 'pausado';
}

export interface RetryProcessoPull {
  id: string;
  processo_id: string;
  cnj: string;
  cliente: string;
  canal_pull: 'API' | 'portal';
  dias_desde_disponibilizacao: number;
  ultimo_acesso: Date;
  timestamp_disponibilizacao: Date;
  dias_em_timeout: number;
  status: 'ativo' | 'expirado';
}

export interface AlertRegra {
  id: string;
  nome: string;
  tipo: 'retry_simultaneo' | 'retry_duracao';
  cliente?: string;
  parametro_1: number;
  parametro_2?: number;
  descricao: string;
  ativo: boolean;
  criado_em: Date;
  modificado_em: Date;
}

const erros = [
  'Timeout na conexão com tribunal',
  'Documento não encontrado na fonte',
  'Erro 500 no servidor da DJE',
  'Certificado SSL expirado',
  'Limite de requisições atingido',
  'Documento corrompido',
  'Credencial expirada',
  'Acesso negado pela fonte',
  'Rede indisponível',
  'Serviço temporariamente indisponível',
];

const clientes = ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E'];
const canais = ['email', 'webhook'] as const;
const canaisPull = ['API', 'portal'] as const;

export const mockRetryProcessosPush: RetryProcessoPush[] = Array.from({ length: 35 }, (_, i) => {
  const diasEmRetry = Math.floor(Math.random() * 20) + 1;
  const numeroTentativas = Math.floor(Math.random() * 12) + 2;
  const tentativasTotais = Math.floor(Math.random() * 20) + 5;
  const inicioRetry = subDays(new Date(), diasEmRetry);

  return {
    id: `retry-push-${String(i + 1).padStart(3, '0')}`,
    processo_id: `proc-${String(Math.floor(Math.random() * 80) + 1).padStart(5, '0')}`,
    cnj: `${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${new Date().getFullYear()}.${Math.floor(Math.random() * 10)}.${String(Math.floor(Math.random() * 27)).padStart(2, '0')}.${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    canal: canais[Math.floor(Math.random() * canais.length)],
    numero_tentativas: numeroTentativas,
    tentativas_totais: tentativasTotais,
    ultimo_erro: erros[Math.floor(Math.random() * erros.length)],
    ultima_tentativa: subHours(new Date(), Math.floor(Math.random() * 24) + 1),
    proxima_tentativa: addHours(new Date(), Math.floor(Math.random() * 48) + 1),
    dias_em_retry: diasEmRetry,
    timestamp_inicio_retry: inicioRetry,
    status: Math.random() > 0.3 ? 'ativo' : Math.random() > 0.5 ? 'aguardando' : 'pausado',
  };
});

export const mockRetryProcessosPull: RetryProcessoPull[] = Array.from({ length: 25 }, (_, i) => {
  const diasDisponibilizacao = Math.floor(Math.random() * 30) + 1;
  const inicioDisponibilizacao = subDays(new Date(), diasDisponibilizacao);

  return {
    id: `retry-pull-${String(i + 1).padStart(3, '0')}`,
    processo_id: `proc-${String(Math.floor(Math.random() * 80) + 1).padStart(5, '0')}`,
    cnj: `${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${new Date().getFullYear()}.${Math.floor(Math.random() * 10)}.${String(Math.floor(Math.random() * 27)).padStart(2, '0')}.${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    cliente: clientes[Math.floor(Math.random() * clientes.length)],
    canal_pull: canaisPull[Math.floor(Math.random() * canaisPull.length)],
    dias_desde_disponibilizacao: diasDisponibilizacao,
    ultimo_acesso: subDays(new Date(), Math.floor(Math.random() * diasDisponibilizacao)),
    timestamp_disponibilizacao: inicioDisponibilizacao,
    dias_em_timeout: Math.floor(Math.random() * 20) + 1,
    status: Math.random() > 0.7 ? 'expirado' : 'ativo',
  };
});

export const mockAlertRegras: AlertRegra[] = [
  {
    id: 'alerta-001',
    nome: 'Cliente A - Retry Simultâneo Alto',
    tipo: 'retry_simultaneo',
    cliente: 'Cliente A',
    parametro_1: 50,
    descricao: 'Alertar quando Cliente A tem mais de 50 processos em retry simultâneo',
    ativo: true,
    criado_em: subDays(new Date(), 30),
    modificado_em: subDays(new Date(), 5),
  },
  {
    id: 'alerta-002',
    nome: 'Todos - Retry Longa Duração',
    tipo: 'retry_duracao',
    parametro_1: 15,
    descricao: 'Alertar quando qualquer processo está em retry há mais de 15 dias',
    ativo: true,
    criado_em: subDays(new Date(), 60),
    modificado_em: subDays(new Date(), 2),
  },
  {
    id: 'alerta-003',
    nome: 'Cliente B - Retry Simultâneo Crítico',
    tipo: 'retry_simultaneo',
    cliente: 'Cliente B',
    parametro_1: 100,
    descricao: 'Alertar quando Cliente B tem mais de 100 processos em retry simultâneo',
    ativo: false,
    criado_em: subDays(new Date(), 45),
    modificado_em: subDays(new Date(), 10),
  },
];
