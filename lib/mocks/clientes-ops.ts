// Seção: 9.2 - Portal de Operações
// 25 clientes para gestão interna com planos, volume capturado, taxa de sucesso e MRR

import { subDays, subHours, subMonths, format } from 'date-fns';

export interface TaxaSucesso {
  PDPJ: number;
  DJE: number;
  TJ: number;
}

export interface ClienteOps {
  id: string;
  nome: string;
  plano: 'Portal' | 'API' | 'Enterprise';
  volume_capturado_24h: number;
  taxa_sucesso: TaxaSucesso;
  alertas_ativos: number;
  mrr: number;
  status: 'ativo' | 'inativo' | 'suspenso';
  ultima_atividade: Date;
}

export interface MRRHistorico {
  mes: string;
  Portal: number;
  API: number;
  Enterprise: number;
}

export interface VolumesPorFonte {
  fonte: string;
  volume: number;
}

export interface Anomalia {
  tipo: 'inativo' | 'queda-volume' | 'spike-erro';
  cliente: string;
  descricao: string;
  timestamp: Date;
  severidade: 'baixa' | 'media' | 'alta';
}

export interface KR {
  nome: string;
  baseline: number;
  alvoMVP: number;
  atual: number;
  unidade: string;
}

const nomes = [
  'Advocacia Silva & Associados',
  'Justiça Digital LTDA',
  'Consultoria Jurídica Nacional',
  'Escritório Brasileiro de Direito',
  'Gestão Processual Inteligente',
  'DataJus Consultoria',
  'Law Tech Solutions',
  'Tribunal Virtual Brasil',
  'Processo Fácil Serviços',
  'Análise Jurídica Premium',
  'Sistema Legal Cloud',
  'Smart Justice Plataforma',
  'Jurisprudência Online',
  'Acompanhamento Processual 24h',
  'Portal Jurídico Integrado',
  'Inteligência Legal SBK',
  'Automação de Processos',
  'Central de Monitoramento',
  'Diligências Digitais',
  'Expediente Virtual',
  'Gestão de Cartório',
  'Platform de Notificações',
  'Recuperação Processual',
  'Suporte Jurídico Online',
  'Decisão Inteligente',
];

export const mockClientesOps: ClienteOps[] = nomes.map((nome, i) => {
  const planos: ('Portal' | 'API' | 'Enterprise')[] = ['Portal', 'API', 'Enterprise'];
  const plano = planos[Math.floor(Math.random() * planos.length)];

  let volumeBase = 10;
  if (plano === 'API') volumeBase = 150;
  if (plano === 'Enterprise') volumeBase = 500;

  const volume = volumeBase + Math.floor(Math.random() * volumeBase * 0.5);

  return {
    id: `cli-${String(i + 1).padStart(3, '0')}`,
    nome,
    plano,
    volume_capturado_24h: volume,
    taxa_sucesso: {
      PDPJ: Math.floor(Math.random() * 20) + 85,
      DJE: Math.floor(Math.random() * 15) + 80,
      TJ: Math.floor(Math.random() * 25) + 75,
    },
    alertas_ativos: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
    mrr: plano === 'Portal' ? Math.floor(Math.random() * 2000) + 500 : plano === 'API' ? Math.floor(Math.random() * 5000) + 2000 : Math.floor(Math.random() * 15000) + 8000,
    status: Math.random() > 0.15 ? 'ativo' : Math.random() > 0.5 ? 'inativo' : 'suspenso',
    ultima_atividade: subHours(new Date(), Math.floor(Math.random() * 168)),
  };
});

export const mockMRRHistorico: MRRHistorico[] = Array.from({ length: 12 }).map((_, i) => {
  const mes = format(subMonths(new Date(), 11 - i), 'MMM yyyy');
  return {
    mes,
    Portal: Math.floor(Math.random() * 15000) + 5000,
    API: Math.floor(Math.random() * 35000) + 15000,
    Enterprise: Math.floor(Math.random() * 50000) + 25000,
  };
});

export const mockVolumesPorFonte: VolumesPorFonte[] = [
  { fonte: 'PDPJ', volume: Math.floor(Math.random() * 5000) + 3000 },
  { fonte: 'DJE', volume: Math.floor(Math.random() * 4000) + 2000 },
  { fonte: 'TJ', volume: Math.floor(Math.random() * 3000) + 1500 },
  { fonte: 'PJe', volume: Math.floor(Math.random() * 2000) + 800 },
  { fonte: 'DataJud', volume: Math.floor(Math.random() * 1500) + 500 },
];

export const mockAnomalias: Anomalia[] = [
  {
    tipo: 'inativo',
    cliente: 'Análise Jurídica Premium',
    descricao: 'Cliente sem atividade há 7 dias',
    timestamp: subDays(new Date(), 2),
    severidade: 'media',
  },
  {
    tipo: 'queda-volume',
    cliente: 'Justiça Digital LTDA',
    descricao: 'Queda de 60% no volume comparado ao mês anterior',
    timestamp: subDays(new Date(), 1),
    severidade: 'alta',
  },
  {
    tipo: 'spike-erro',
    cliente: 'Consultoria Jurídica Nacional',
    descricao: 'Taxa de erro aumentou para 15% em captura PDPJ',
    timestamp: new Date(),
    severidade: 'alta',
  },
  {
    tipo: 'inativo',
    cliente: 'Portal Jurídico Integrado',
    descricao: 'Cliente inativo há mais de 30 dias',
    timestamp: subDays(new Date(), 5),
    severidade: 'baixa',
  },
];

export const mockKRs: KR[] = [
  {
    nome: 'Tempo cadastro para primeiro consumo',
    baseline: 240,
    alvoMVP: 120,
    atual: 95,
    unidade: 'minutos',
  },
  {
    nome: 'SLA captura (p95)',
    baseline: 3600,
    alvoMVP: 1800,
    atual: 1450,
    unidade: 'segundos',
  },
  {
    nome: 'SLA entrega (p95)',
    baseline: 7200,
    alvoMVP: 3600,
    atual: 2800,
    unidade: 'segundos',
  },
  {
    nome: 'Cobertura PDPJ',
    baseline: 75,
    alvoMVP: 95,
    atual: 88,
    unidade: '%',
  },
];
