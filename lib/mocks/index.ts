// Mock fixtures para Captura SBK 2.0
// Todos os dados da aplicação são mockados aqui. Não há backend nem API routes.
// Estados canônicos: Localizado | Capturado | Enviado | Entregue | Falha de Captura | Falha de Entrega
// Fontes: PDPJ, DJE, TJs, PJe TRT, DataJud

export { mockProcessos, type Processo } from './processos';
export { mockMonitoramentos, type Monitoramento } from './monitoramentos';
export { mockCredenciais, type Credencial } from './credenciais';
export { mockClientesOps, type ClienteOps, type TaxaSucesso } from './clientes-ops';
export { mockEventosCaptura, type EventoCaptura, type TipoEvento } from './eventos-captura';
export { mockRetryProcessos, type RetryProcesso } from './retry';
export { mockRegistrosCapturadosEntregas, type RegistroCapturado } from './registro-captura-entrega';

// Exports para compatibilidade com código anterior
export const mockClientes: unknown[] = [];
export const mockAlertas: unknown[] = [];
export const mockDocumentos: unknown[] = [];
export const mockApiConsumo: unknown[] = [];
