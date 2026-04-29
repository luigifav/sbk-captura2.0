// Seção: 2.1 - Processamento de Captura e Entrega
// 80 processos com CNJ válido, distribuição realista de fontes e andamentos
// Estados canônicos: Localizado, Capturado, Enviado, Entregue, Falha de Captura, Falha de Entrega

import { subDays, subMinutes } from 'date-fns';

const tribunais = [
  'TJ-SP', 'TJ-RJ', 'TJ-MG', 'TJ-BA', 'TJ-RS', 'TJ-PR', 'TJ-PE', 'TJ-CE',
  'TRT-1', 'TRT-2', 'TRT-3', 'TRT-4', 'TRT-8', 'TRT-9', 'TRT-15',
  'STJ', 'STF', 'TSE',
];

const andamentos = [
  'Citação',
  'Citação',
  'Intimação',
  'Intimação',
  'Sentença',
  'Despacho',
  'Decisão',
  'Outros',
];

const fontes = ['PDPJ', 'DJE', 'TJ'];

const estatos = ['Localizado', 'Capturado', 'Enviado', 'Entregue', 'Falha de Captura', 'Falha de Entrega'];

function gerarCNJ(): string {
  // Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
  const sequencial = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
  const digitos = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const ano = new Date().getFullYear();
  const segmento = String(Math.floor(Math.random() * 10)).padStart(1, '0');
  const tribunal = String(Math.floor(Math.random() * 27)).padStart(2, '0');
  const origem = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `${sequencial}-${digitos}.${ano}.${segmento}.${tribunal}.${origem}`;
}

function selecionarPorProbabilidade<T>(items: T[], probabilidades: number[]): T {
  const total = probabilidades.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= probabilidades[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
}

export interface Processo {
  id: string;
  cnj: string;
  fonte: string;
  tipo_andamento: string;
  polo: 'ativo' | 'passivo';
  tribunal: string;
  data_captura: Date;
  status_leitura: boolean;
  estado: string;
  hash_documento: string;
  tamanho_documento: number;
}

export interface Documento {
  id: string;
  cnj: string;
  tipo_documento: string;
  fonte: 'PDPJ' | 'DJE' | 'TJ' | 'Monitoramento';
  tribunal: string;
  data_captura: Date;
  tamanho: number;
  hash_truncado: string;
  status: 'processado' | 'processando' | 'erro';
  origem: 'caixa_entrada' | 'monitoramento';
}

export const mockProcessos: Processo[] = Array.from({ length: 80 }, (_, i) => {
  const fonte = selecionarPorProbabilidade(fontes, [0.6, 0.25, 0.15]);
  const andamento = selecionarPorProbabilidade(andamentos, [0.15, 0.15, 0.15, 0.15, 0.2, 0.1, 0.1, 0.0]);
  const estado = selecionarPorProbabilidade(
    estatos,
    [0.05, 0.1, 0.15, 0.65, 0.03, 0.02]
  );

  const diasAtras = Math.floor(Math.random() * 30);
  const datCaptura = subMinutes(subDays(new Date(), diasAtras), Math.floor(Math.random() * 1440));

  return {
    id: `proc-${String(i + 1).padStart(5, '0')}`,
    cnj: gerarCNJ(),
    fonte,
    tipo_andamento: andamento,
    polo: Math.random() > 0.5 ? 'ativo' : 'passivo',
    tribunal: tribunais[Math.floor(Math.random() * tribunais.length)],
    data_captura: datCaptura,
    status_leitura: Math.random() > 0.3,
    estado,
    hash_documento: `sha256_${Math.random().toString(36).substring(2, 66)}`,
    tamanho_documento: Math.floor(Math.random() * 5000) + 100,
  };
});

const tiposDocumento = [
  'Citação',
  'Sentença',
  'Despacho',
  'Intimação',
  'Decisão',
  'Agravo',
  'Petição',
  'Parecer',
];

export const mockDocumentos: Documento[] = Array.from({ length: 120 }, (_, i) => {
  const fonte = selecionarPorProbabilidade(
    ['PDPJ', 'DJE', 'TJ', 'Monitoramento'] as const,
    [0.35, 0.25, 0.2, 0.2]
  );
  const tipo = tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)];
  const origem = Math.random() > 0.4 ? 'caixa_entrada' : 'monitoramento';
  const status = selecionarPorProbabilidade(
    ['processado', 'processando', 'erro'] as const,
    [0.85, 0.1, 0.05]
  );

  const diasAtras = Math.floor(Math.random() * 60);
  const datCaptura = subMinutes(subDays(new Date(), diasAtras), Math.floor(Math.random() * 1440));
  const hash = `sha256_${Math.random().toString(36).substring(2, 66)}`;

  return {
    id: `doc-${String(i + 1).padStart(6, '0')}`,
    cnj: gerarCNJ(),
    tipo_documento: tipo,
    fonte,
    tribunal: tribunais[Math.floor(Math.random() * tribunais.length)],
    data_captura: datCaptura,
    tamanho: Math.floor(Math.random() * 10000) + 100,
    hash_truncado: hash.substring(0, 8),
    status,
    origem,
  };
});
