// Seção: 9.2 - Portal de Operações
// 25 clientes para gestão interna com planos, volume capturado, taxa de sucesso e MRR

import { subDays, subHours } from 'date-fns';

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
