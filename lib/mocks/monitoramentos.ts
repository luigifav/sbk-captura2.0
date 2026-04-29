// Seção: 5.2 - Monitoramento de Processos
// 12 monitoramentos com termos, fontes ativadas, frequência e matches

import { subDays, subHours } from 'date-fns';

export interface Monitoramento {
  id: string;
  termo: string;
  fontes_ativadas: string[];
  frequencia: 'real-time' | 'horaria' | '4h' | 'diaria';
  total_matches_24h: number;
  total_matches_7d: number;
  status: 'ativo' | 'pausado' | 'excluido';
  ultima_atualizacao: Date;
}

const termos = [
  'Execução de Sentença',
  'Recuperação Judicial',
  'Falência',
  'Ação Trabalhista',
  'Dano Moral',
  'Responsabilidade Civil',
  'Direitos do Consumidor',
  'Sucessão',
  'Divórcio',
  'Guarda de Menores',
  'Alimentos',
  'Propriedade Intelectual',
];

const fontes = ['PDPJ', 'DJE', 'TJ'];

export const mockMonitoramentos: Monitoramento[] = termos.map((termo, i) => {
  const fontesAtivadas = fontes.filter(() => Math.random() > 0.3);
  const matches24h = Math.floor(Math.random() * 50) + 1;
  const matches7d = matches24h * (Math.floor(Math.random() * 5) + 2);

  return {
    id: `mon-${String(i + 1).padStart(3, '0')}`,
    termo,
    fontes_ativadas: fontesAtivadas.length > 0 ? fontesAtivadas : ['PDPJ'],
    frequencia: ['real-time', 'horaria', 'diaria'][Math.floor(Math.random() * 3)] as any,
    total_matches_24h: matches24h,
    total_matches_7d: matches7d,
    status: Math.random() > 0.15 ? 'ativo' : Math.random() > 0.5 ? 'pausado' : 'excluido',
    ultima_atualizacao: subHours(new Date(), Math.floor(Math.random() * 24)),
  };
});
