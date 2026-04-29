// Seção: 8.1 - Gestão de Retry e Timeout
// 30 processos em retry ativo com tentativas, último erro, próxima tentativa e dias em retry

import { subDays, subHours, addHours } from 'date-fns';

export interface RetryProcesso {
  id: string;
  processo_id: string;
  cnj: string;
  numero_tentativas: number;
  ultimo_erro: string;
  proxima_tentativa: Date;
  dias_em_retry: number;
  timestamp_inicio_retry: Date;
  status: 'ativo' | 'aguardando' | 'pausado';
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

export const mockRetryProcessos: RetryProcesso[] = Array.from({ length: 30 }, (_, i) => {
  const diasEmRetry = Math.floor(Math.random() * 14) + 1;
  const numeroTentativas = Math.floor(Math.random() * 12) + 2;
  const inicioRetry = subDays(new Date(), diasEmRetry);

  return {
    id: `retry-${String(i + 1).padStart(3, '0')}`,
    processo_id: `proc-${String(Math.floor(Math.random() * 80) + 1).padStart(5, '0')}`,
    cnj: `${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${new Date().getFullYear()}.${Math.floor(Math.random() * 10)}.${String(Math.floor(Math.random() * 27)).padStart(2, '0')}.${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    numero_tentativas: numeroTentativas,
    ultimo_erro: erros[Math.floor(Math.random() * erros.length)],
    proxima_tentativa: addHours(new Date(), Math.floor(Math.random() * 48) + 1),
    dias_em_retry: diasEmRetry,
    timestamp_inicio_retry: inicioRetry,
    status: Math.random() > 0.3 ? 'ativo' : Math.random() > 0.5 ? 'aguardando' : 'pausado',
  };
});
