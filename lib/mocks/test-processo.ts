import { subDays, subMinutes } from 'date-fns';
import { Processo } from './processos';

export const testProcesso: Processo = {
  id: 'proc-teste-001',
  cnj: '0000001-01.2026.0.12.3456',
  fonte: 'PDPJ',
  tipo_andamento: 'Sentença',
  polo: 'ativo',
  tribunal: 'TJ-SP',
  data_captura: subMinutes(new Date(), 120),
  status_leitura: true,
  estado: 'Entregue',
  hash_documento: 'sha256_abc123def456abc123def456abc123def456abc123def456abc123def456ab',
  tamanho_documento: 2345,
};
