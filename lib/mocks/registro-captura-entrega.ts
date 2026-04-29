// Seção: 11.5 - Registro Imutável de Captura e Entrega
// 50 registros imutáveis com auditoria completa de captura e entrega
// Campos: id, CNJ, fonte, timestamp captura, hash documento, canal entrega,
// timestamp entrega, evidência técnica, hash do registro

import { subDays, subMinutes, subHours } from 'date-fns';

export interface RegistroCapturado {
  id: string;
  cnj: string;
  fonte: 'PDPJ' | 'DJE' | 'TJ';
  timestamp_captura: Date;
  hash_documento: string;
  canal_entrega: 'API' | 'Webhook' | 'Email' | 'Dashboard';
  timestamp_entrega: Date;
  evidencia_tecnica: {
    ip_origem: string;
    user_agent: string;
    status_http: number;
    tempo_resposta_ms: number;
  };
  hash_registro: string;
  cliente_id: string;
  status: 'sucesso' | 'falha_parcial' | 'falha_total';
}

function gerarIPv4(): string {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function gerarUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'curl/7.85.0',
    'Python-Requests/2.28.0',
    'node-fetch/3.0',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function gerarHashSHA256(): string {
  return Math.random().toString(36).substring(2, 66);
}

const registrosTeste: RegistroCapturado[] = [
  {
    id: 'reg-cap-teste-001',
    cnj: '0000001-01.2026.0.12.3456',
    fonte: 'PDPJ',
    timestamp_captura: subMinutes(subDays(new Date(), 1), 120),
    hash_documento: 'sha256_abc123def456abc123def456abc123def456abc123def456abc123def456ab',
    canal_entrega: 'API',
    timestamp_entrega: subMinutes(subDays(new Date(), 1), 110),
    evidencia_tecnica: {
      ip_origem: '192.168.1.100',
      user_agent: 'node-fetch/3.0',
      status_http: 200,
      tempo_resposta_ms: 245,
    },
    hash_registro: 'sha256_def456ghi789def456ghi789def456ghi789def456ghi789def456ghi789def',
    cliente_id: 'cli-001',
    status: 'sucesso',
  },
];

export const mockRegistrosCapturadosEntregas: RegistroCapturado[] = [
  ...registrosTeste,
  ...Array.from({ length: 50 }, (_, i) => {
    const fontes: ('PDPJ' | 'DJE' | 'TJ')[] = ['PDPJ', 'DJE', 'TJ'];
    const canais: ('API' | 'Webhook' | 'Email' | 'Dashboard')[] = ['API', 'Webhook', 'Email', 'Dashboard'];
    const fonte = fontes[Math.floor(Math.random() * fontes.length)];
    const canal = canais[Math.floor(Math.random() * canais.length)];

    const diasAtras = Math.floor(Math.random() * 30);
    const timestampCaptura = subMinutes(subDays(new Date(), diasAtras), Math.floor(Math.random() * 1440));

    // Simula latência de entrega realista
    const minutosAteEntrega = Math.floor(Math.random() * 60) + 1;
    const timestampEntrega = subMinutes(timestampCaptura, -minutosAteEntrega);

    const httpStatus = Math.random() > 0.05 ? 200 : [400, 401, 403, 429, 500, 503][Math.floor(Math.random() * 6)];
    const status: 'sucesso' | 'falha_parcial' | 'falha_total' = httpStatus === 200 ? 'sucesso' : Math.random() > 0.3 ? 'falha_parcial' : 'falha_total';

    const cnj = `${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}.${new Date().getFullYear()}.${Math.floor(Math.random() * 10)}.${String(Math.floor(Math.random() * 27)).padStart(2, '0')}.${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    return {
      id: `reg-cap-${String(i + 1).padStart(5, '0')}`,
      cnj,
      fonte,
      timestamp_captura: timestampCaptura,
      hash_documento: `sha256_${gerarHashSHA256()}`,
      canal_entrega: canal,
      timestamp_entrega: timestampEntrega,
      evidencia_tecnica: {
        ip_origem: gerarIPv4(),
        user_agent: gerarUserAgent(),
        status_http: httpStatus,
        tempo_resposta_ms: Math.floor(Math.random() * 2000) + 100,
      },
      hash_registro: `sha256_${gerarHashSHA256()}`,
      cliente_id: `cli-${String(Math.floor(Math.random() * 25) + 1).padStart(3, '0')}`,
      status,
    } as RegistroCapturado;
  }),
];
