import { subDays, subHours } from 'date-fns';

export interface Credencial {
  id: string;
  nome: string;
  tipo: 'PDPJ';
  cnpj_mascarado: string;
  cnpj_completo?: string;
  token_mascarado: string;
  status: 'ativo' | 'expirado' | 'inválido' | 'aguardando';
  ultima_validacao: Date;
  data_expiracao?: Date;
  ativa_em: Date;
}

export interface ClienteRepresentado {
  id: string;
  cnpj_cpf: string;
  nome: string;
  fontes_monitoradas: string[];
  modo_ciencia: 'automatica' | 'manual' | 'desativado';
  status_credencial: 'ativo' | 'expirado' | 'inválido';
  capturas_24h: number;
  ciencias_realizadas: number;
  pendentes_aprovacao: number;
  ultima_validacao: Date;
  tipos_movimentacao_autorizados?: string[];
  historico_ciencias?: {
    id: string;
    data: Date;
    tipo: string;
    status: 'realizada' | 'pendente';
  }[];
}

function gerarCNPJ(): string {
  const parte1 = String(Math.floor(Math.random() * 1000000)).padStart(8, '0');
  const parte2 = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${parte1}${parte2}`;
}

function formatarCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function gerarCNPJMascarado(): string {
  const cnpj = gerarCNPJ();
  const ultimos = cnpj.slice(-4);
  return `${cnpj.slice(0, 2)}.***.***/**${ultimos}`;
}

function gerarTokenMascarado(): string {
  const caracteres = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `pdpj_****${caracteres}`;
}

export const mockCredenciais: Credencial[] = [
  {
    id: 'cred-001',
    nome: 'PDPJ Produção',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'ativo',
    ultima_validacao: subHours(new Date(), 2),
    data_expiracao: subDays(new Date(), -180),
    ativa_em: subDays(new Date(), -365),
  },
  {
    id: 'cred-002',
    nome: 'PDPJ Backup',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'ativo',
    ultima_validacao: subDays(new Date(), 1),
    data_expiracao: subDays(new Date(), -120),
    ativa_em: subDays(new Date(), -200),
  },
  {
    id: 'cred-003',
    nome: 'PDPJ Testes',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 5),
    data_expiracao: subDays(new Date(), 3),
    ativa_em: subDays(new Date(), -100),
  },
  {
    id: 'cred-004',
    nome: 'PDPJ Desenv',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'ativo',
    ultima_validacao: subHours(new Date(), 12),
    data_expiracao: subDays(new Date(), -60),
    ativa_em: subDays(new Date(), -90),
  },
  {
    id: 'cred-005',
    nome: 'PDPJ Cliente A',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 10),
    data_expiracao: subDays(new Date(), 7),
    ativa_em: subDays(new Date(), -150),
  },
  {
    id: 'cred-006',
    nome: 'PDPJ Cliente B',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'inválido',
    ultima_validacao: subDays(new Date(), 2),
    ativa_em: subDays(new Date(), -45),
  },
  {
    id: 'cred-007',
    nome: 'PDPJ Staging',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'expirado',
    ultima_validacao: subDays(new Date(), 8),
    data_expiracao: subDays(new Date(), 1),
    ativa_em: subDays(new Date(), -120),
  },
  {
    id: 'cred-008',
    nome: 'PDPJ Auditoria',
    tipo: 'PDPJ',
    cnpj_completo: formatarCNPJ(gerarCNPJ()),
    cnpj_mascarado: gerarCNPJMascarado(),
    token_mascarado: gerarTokenMascarado(),
    status: 'aguardando',
    ultima_validacao: subDays(new Date(), 15),
    ativa_em: subDays(new Date(), -30),
  },
];

export const mockClientesRepresentados: ClienteRepresentado[] = [
  {
    id: 'cli-001',
    cnpj_cpf: formatarCNPJ(gerarCNPJ()),
    nome: 'Oliveira & Associados Advogados',
    fontes_monitoradas: ['PDPJ', 'DJE', 'PJe'],
    modo_ciencia: 'automatica',
    status_credencial: 'ativo',
    capturas_24h: 12,
    ciencias_realizadas: 8,
    pendentes_aprovacao: 0,
    ultima_validacao: subHours(new Date(), 1),
    tipos_movimentacao_autorizados: ['Citação', 'Intimação', 'Sentença'],
    historico_ciencias: [
      {
        id: 'cien-1',
        data: subHours(new Date(), 2),
        tipo: 'Citação',
        status: 'realizada',
      },
      {
        id: 'cien-2',
        data: subHours(new Date(), 4),
        tipo: 'Intimação',
        status: 'realizada',
      },
      {
        id: 'cien-3',
        data: subHours(new Date(), 6),
        tipo: 'Sentença',
        status: 'realizada',
      },
    ],
  },
  {
    id: 'cli-002',
    cnpj_cpf: formatarCNPJ(gerarCNPJ()),
    nome: 'Silva Consultoria Jurídica',
    fontes_monitoradas: ['PDPJ', 'TJ-SP'],
    modo_ciencia: 'manual',
    status_credencial: 'ativo',
    capturas_24h: 8,
    ciencias_realizadas: 3,
    pendentes_aprovacao: 2,
    ultima_validacao: subHours(new Date(), 6),
    tipos_movimentacao_autorizados: ['Citação'],
  },
  {
    id: 'cli-003',
    cnpj_cpf: formatarCNPJ(gerarCNPJ()),
    nome: 'Costa & Fernandes Escritório',
    fontes_monitoradas: ['PDPJ'],
    modo_ciencia: 'automatica',
    status_credencial: 'expirado',
    capturas_24h: 0,
    ciencias_realizadas: 15,
    pendentes_aprovacao: 0,
    ultima_validacao: subDays(new Date(), 5),
  },
  {
    id: 'cli-004',
    cnpj_cpf: formatarCNPJ(gerarCNPJ()),
    nome: 'Mendes & Pereira Advocacia',
    fontes_monitoradas: ['PDPJ', 'DJE', 'PJe', 'TRT'],
    modo_ciencia: 'automatica',
    status_credencial: 'ativo',
    capturas_24h: 24,
    ciencias_realizadas: 18,
    pendentes_aprovacao: 1,
    ultima_validacao: subHours(new Date(), 3),
  },
  {
    id: 'cli-005',
    cnpj_cpf: formatarCNPJ(gerarCNPJ()),
    nome: 'Rocha Direito Empresarial',
    fontes_monitoradas: ['PDPJ', 'DJE'],
    modo_ciencia: 'desativado',
    status_credencial: 'ativo',
    capturas_24h: 5,
    ciencias_realizadas: 0,
    pendentes_aprovacao: 0,
    ultima_validacao: subDays(new Date(), 2),
  },
];
