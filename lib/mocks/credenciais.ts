// Seção: 6.3 - Gestão de Credenciais
// 8 credenciais PDPJ com CNPJ mascarado, status e última validação
// 3 credenciais expiradas para demonstrar alertas

import { subDays, subHours } from 'date-fns';

export interface Credencial {
  id: string;
  nome: string;
  tipo: 'PDPJ';
  cnpj_mascarado: string;
  status: 'ativo' | 'expirado' | 'inválido' | 'aguardando';
  ultima_validacao: Date;
  data_expiracao?: Date;
  ativa_em: Date;
}

function gerarCNPJMascarado(): string {
  const parte1 = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  const parte2 = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${parte1}.${parte2}.*****-**`;
}

export const mockCredenciais: Credencial[] = [
  {
    id: 'cred-001',
    nome: 'PDPJ Produção',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'ativo',
    ultima_validacao: subHours(new Date(), 2),
    data_expiracao: subDays(new Date(), -180),
    ativa_em: subDays(new Date(), -365),
  },
  {
    id: 'cred-002',
    nome: 'PDPJ Backup',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'ativo',
    ultima_validacao: subDays(new Date(), 1),
    data_expiracao: subDays(new Date(), -120),
    ativa_em: subDays(new Date(), -200),
  },
  {
    id: 'cred-003',
    nome: 'PDPJ Testes',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 5),
    data_expiracao: subDays(new Date(), 3),
    ativa_em: subDays(new Date(), -100),
  },
  {
    id: 'cred-004',
    nome: 'PDPJ Desenv',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'ativo',
    ultima_validacao: subHours(new Date(), 12),
    data_expiracao: subDays(new Date(), -60),
    ativa_em: subDays(new Date(), -90),
  },
  {
    id: 'cred-005',
    nome: 'PDPJ Cliente A',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 10),
    data_expiracao: subDays(new Date(), 7),
    ativa_em: subDays(new Date(), -150),
  },
  {
    id: 'cred-006',
    nome: 'PDPJ Cliente B',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'inválido',
    ultima_validacao: subDays(new Date(), 2),
    ativa_em: subDays(new Date(), -45),
  },
  {
    id: 'cred-007',
    nome: 'PDPJ Staging',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 8),
    data_expiracao: subDays(new Date(), 1),
    ativa_em: subDays(new Date(), -120),
  },
  {
    id: 'cred-008',
    nome: 'PDPJ Auditoria',
    tipo: 'PDPJ',
    cnpj_mascarado: gerarCNPJMascarado(),
    status: 'aguardando',
    ultima_validacao: subDays(new Date(), 15),
    ativa_em: subDays(new Date(), -30),
  },
];
