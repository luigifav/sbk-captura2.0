// Seção: 2.1 - Timeline de Eventos de Captura
// Timeline realista para cada processo: Localizado → Capturado → Enviado → Entregue
// Latências: Localizado→Capturado: 5-40min, Enviado→Entregue: 30s-8min
// Alguns processos incluem tentativas falhadas antes do sucesso

import { subMinutes, subSeconds } from 'date-fns';
import { mockProcessos } from './processos';

export type TipoEvento = 'Localizado' | 'Capturado' | 'Enviado' | 'Entregue' | 'Falha';

export interface EventoCaptura {
  id: string;
  processo_id: string;
  tipo_evento: TipoEvento;
  timestamp: Date;
  detalhes?: string;
  tentativa?: number;
}

export const mockEventosCaptura: EventoCaptura[] = [];

let eventoId = 0;

mockProcessos.forEach((processo) => {
  const estado = processo.estado;
  const datCaptura = processo.data_captura;

  // Localizado
  mockEventosCaptura.push({
    id: `evt-${String(++eventoId).padStart(6, '0')}`,
    processo_id: processo.id,
    tipo_evento: 'Localizado',
    timestamp: datCaptura,
  });

  // Se o processo tem falha de captura, adiciona evento de falha
  if (estado === 'Falha de Captura') {
    mockEventosCaptura.push({
      id: `evt-${String(++eventoId).padStart(6, '0')}`,
      processo_id: processo.id,
      tipo_evento: 'Falha',
      timestamp: subMinutes(datCaptura, Math.floor(Math.random() * 35) + 5),
      detalhes: 'Erro ao acessar documento',
    });
    return;
  }

  // Capturado (5-40 min depois)
  const minutosCaptacao = Math.floor(Math.random() * 35) + 5;
  const datCapturado = subMinutes(datCaptura, -minutosCaptacao);

  // Para 10% dos processos, tenta novamente após falha
  if (Math.random() < 0.1) {
    mockEventosCaptura.push({
      id: `evt-${String(++eventoId).padStart(6, '0')}`,
      processo_id: processo.id,
      tipo_evento: 'Falha',
      timestamp: subMinutes(datCapturado, Math.floor(Math.random() * 20) + 5),
      detalhes: 'Timeout na conexão',
      tentativa: 1,
    });
  }

  mockEventosCaptura.push({
    id: `evt-${String(++eventoId).padStart(6, '0')}`,
    processo_id: processo.id,
    tipo_evento: 'Capturado',
    timestamp: datCapturado,
  });

  // Se o estado é apenas Capturado, não continua
  if (estado === 'Capturado') return;

  // Se falha de entrega, adiciona evento de falha antes de enviado
  if (estado === 'Falha de Entrega' || estado === 'Enviado') {
    const datEnviado = subMinutes(datCapturado, -Math.floor(Math.random() * 30) - 2);
    mockEventosCaptura.push({
      id: `evt-${String(++eventoId).padStart(6, '0')}`,
      processo_id: processo.id,
      tipo_evento: 'Enviado',
      timestamp: datEnviado,
    });

    if (estado === 'Falha de Entrega') {
      mockEventosCaptura.push({
        id: `evt-${String(++eventoId).padStart(6, '0')}`,
        processo_id: processo.id,
        tipo_evento: 'Falha',
        timestamp: subSeconds(datEnviado, Math.floor(Math.random() * 60) + 10),
        detalhes: 'API do cliente retornou erro',
      });
      return;
    }
  }

  // Entregue (30s-8min depois de Enviado)
  if (estado === 'Entregue' || estado === 'Enviado') {
    const datEnviado = subMinutes(datCapturado, -Math.floor(Math.random() * 30) - 2);
    if (!mockEventosCaptura.some((e) => e.processo_id === processo.id && e.tipo_evento === 'Enviado')) {
      mockEventosCaptura.push({
        id: `evt-${String(++eventoId).padStart(6, '0')}`,
        processo_id: processo.id,
        tipo_evento: 'Enviado',
        timestamp: datEnviado,
      });
    }

    if (estado === 'Entregue') {
      const minutosEntrega = Math.floor(Math.random() * 7.5) + 0.5; // 30s a 8min em minutos
      const datEntregue = subMinutes(datEnviado, -minutosEntrega);

      mockEventosCaptura.push({
        id: `evt-${String(++eventoId).padStart(6, '0')}`,
        processo_id: processo.id,
        tipo_evento: 'Entregue',
        timestamp: datEntregue,
      });
    }
  }
});
