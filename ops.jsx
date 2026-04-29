/* Mock data for Captura SBK 2.0 prototype.
   Realistic Brazilian legal data — CNJ format, real TJs, BPO clients. */

const MOCK = {
  user: {
    name: 'Netusha Calado',
    email: 'netusha.calado@bradesco.com.br',
    role: 'Operador SBK',
    company: 'SBK · Operações',
    initials: 'NC',
  },
  client: {
    name: 'Maria Helena Andrade',
    email: 'maria.andrade@stellaragro.com.br',
    role: 'Gerente Jurídico',
    company: 'Stellar Agro Ltda',
    initials: 'MA',
    plan: 'Enterprise · 25.000 captures/mês',
  },

  /* Six canonical states + ad-hoc variants */
  processes: [
    { num: '0801234-56.2024.8.26.0100', tribunal: 'TJSP', vara: '5ª Vara Cível Central',
      parte: 'Bradesco S.A. × Mantris LTDA', status: 'capturado',
      value: 'R$ 145.230,00', risk: 35, captured: '14:32', updated: 'há 12 min',
      cliente: 'Bradesco S.A.' },
    { num: '0892341-22.2024.8.19.0001', tribunal: 'TJRJ', vara: '12ª Vara Empresarial',
      parte: 'BMG Banco × Sotero Distribuidora', status: 'enviado',
      value: 'R$ 87.500,00', risk: 52, captured: '13:55', updated: 'há 28 min',
      cliente: 'BMG Banco' },
    { num: '5012345-78.2023.8.13.0024', tribunal: 'TJMG', vara: '3ª Vara Cível BH',
      parte: 'Saint-Gobain × União', status: 'entregue',
      value: 'R$ 312.000,00', risk: 68, captured: '11:14', updated: 'há 2 h',
      cliente: 'Saint-Gobain' },
    { num: '0023456-12.2024.5.02.0011', tribunal: 'TRT-2', vara: '11ª Vara do Trabalho',
      parte: 'Nestlé × Carlos M. Souza', status: 'localizado',
      value: 'R$ 56.800,00', risk: 22, captured: '09:48', updated: 'há 4 h',
      cliente: 'Nestlé Brasil' },
    { num: '1004567-89.2024.8.26.0100', tribunal: 'TJSP', vara: '17ª Vara Cível',
      parte: 'Daycoval × Falcon Holding', status: 'falha-captura',
      value: '—', risk: 0, captured: '—', updated: 'há 6 h',
      cliente: 'Daycoval' },
    { num: '7891234-33.2024.4.03.6100', tribunal: 'TRF-3', vara: '6ª Vara Federal',
      parte: 'Zurich × Receita Federal', status: 'falha-entrega',
      value: 'R$ 1.245.000,00', risk: 88, captured: '08:22', updated: 'há 8 h',
      cliente: 'Zurich Seguros' },
    { num: '2345678-90.2024.8.26.0053', tribunal: 'TJSP', vara: '4ª Vara da Fazenda',
      parte: 'Itaú × Município de São Paulo', status: 'capturado',
      value: 'R$ 567.100,00', risk: 44, captured: '14:18', updated: 'há 17 min',
      cliente: 'Itaú' },
    { num: '0067890-44.2024.5.10.0019', tribunal: 'TRT-10', vara: '19ª Vara DF',
      parte: 'Petrobras × Sindipetro', status: 'enviado',
      value: 'R$ 2.100.000,00', risk: 71, captured: '10:02', updated: 'há 3 h',
      cliente: 'Petrobras' },
  ],

  /* Captura attempts for the detail screen */
  attempts: [
    { ts: '27/04 14:32:11', channel: 'PDPJ', state: 'success',  msg: 'Processo capturado com sucesso · 47 documentos baixados', tone: 'success' },
    { ts: '27/04 14:31:47', channel: 'PDPJ', state: 'progress', msg: 'Iniciando captura via Model Context Protocol', tone: 'info' },
    { ts: '27/04 14:30:12', channel: 'PJe',  state: 'fallback', msg: 'PJe TRT indisponível — failover para PDPJ', tone: 'warn' },
    { ts: '27/04 14:30:00', channel: 'PJe',  state: 'failed',   msg: 'Timeout ao consultar PJe TRT-2', tone: 'danger' },
    { ts: '27/04 12:14:33', channel: 'DJE',  state: 'success',  msg: 'Pré-captura via DJE/SP confirmada', tone: 'success' },
  ],

  /* Channel state for /ops/captura */
  channels: [
    { name: 'PDPJ',     up: true,  latency: 320, success: 98.4, calls: 12480 },
    { name: 'DJE',      up: true,  latency: 1100, success: 96.2, calls: 4870 },
    { name: 'TJSP',     up: true,  latency: 480, success: 99.1, calls: 8910 },
    { name: 'TJRJ',     up: false, latency: null, success: 0,   calls: 1240 },
    { name: 'PJe TRT',  up: true,  latency: 920, success: 94.8, calls: 3150 },
    { name: 'DataJud',  up: true,  latency: 240, success: 99.7, calls: 15600 },
  ],

  /* Retry queue */
  retries: [
    { num: '0998877-66.2024.8.26.0100', err: 'Timeout PJe TRT', age: '2h', tries: 3, next: 'em 12 min', tone: 'warn' },
    { num: '5544332-21.2024.8.13.0024', err: 'CAPTCHA não resolvido', age: '4h', tries: 5, next: 'em 28 min', tone: 'danger' },
    { num: '0011223-44.2024.4.03.6100', err: 'Schema PDPJ alterado', age: '6h', tries: 2, next: 'manual', tone: 'danger' },
    { num: '7766554-33.2024.5.02.0011', err: 'Rate limit DJE', age: '1h', tries: 1, next: 'em 5 min', tone: 'warn' },
  ],

  /* Clients */
  clients: [
    { id: 'c1', name: 'Bradesco S.A.', cnpj: '60.746.948/0001-12', plan: 'Enterprise', vol: '12.4k/mês', status: 'ativo',  health: 98 },
    { id: 'c2', name: 'Itaú Unibanco',     cnpj: '60.701.190/0001-04', plan: 'Enterprise', vol: '9.8k/mês',  status: 'ativo',  health: 96 },
    { id: 'c3', name: 'BMG Banco',         cnpj: '61.186.680/0001-74', plan: 'API',        vol: '2.1k/mês',  status: 'ativo',  health: 92 },
    { id: 'c4', name: 'Nestlé Brasil',     cnpj: '60.409.075/0001-52', plan: 'Portal',     vol: '847/mês',   status: 'ativo',  health: 99 },
    { id: 'c5', name: 'Daycoval',          cnpj: '62.232.889/0001-90', plan: 'Portal',     vol: '420/mês',   status: 'suspenso', health: 64 },
    { id: 'c6', name: 'Zurich Seguros',    cnpj: '17.197.385/0001-21', plan: 'Enterprise', vol: '4.2k/mês',  status: 'ativo',  health: 91 },
    { id: 'c7', name: 'Saint-Gobain',      cnpj: '61.064.838/0001-22', plan: 'API',        vol: '1.5k/mês',  status: 'ativo',  health: 95 },
    { id: 'c8', name: 'Petrobras',         cnpj: '33.000.167/0001-01', plan: 'Enterprise', vol: '18.9k/mês', status: 'ativo',  health: 97 },
  ],

  /* Documents (cliente portal) */
  documents: [
    { name: 'Petição Inicial.pdf', proc: '0801234-56.2024.8.26.0100', date: '27/04/2026', size: '2.4 MB', kind: 'inicial' },
    { name: 'Contestação Bradesco.pdf', proc: '0801234-56.2024.8.26.0100', date: '26/04/2026', size: '1.1 MB', kind: 'contestacao' },
    { name: 'Laudo Pericial.pdf', proc: '5012345-78.2023.8.13.0024', date: '25/04/2026', size: '3.7 MB', kind: 'laudo' },
    { name: 'Sentença.pdf', proc: '0023456-12.2024.5.02.0011', date: '23/04/2026', size: '672 KB', kind: 'sentenca' },
    { name: 'Embargos.pdf', proc: '7891234-33.2024.4.03.6100', date: '21/04/2026', size: '892 KB', kind: 'embargos' },
  ],

  /* Alerts (cliente) */
  alerts: [
    { proc: '0801234-56.2024.8.26.0100', kind: 'Movimentação', msg: 'Decisão proferida — embargos rejeitados', when: 'há 12 min', tone: 'warn',  read: false },
    { proc: '0892341-22.2024.8.19.0001', kind: 'Audiência', msg: 'Audiência designada para 12/05/2026 às 14:30', when: 'há 1 h', tone: 'info',  read: false },
    { proc: '5012345-78.2023.8.13.0024', kind: 'Sentença',   msg: 'Sentença favorável publicada', when: 'há 3 h', tone: 'success', read: true },
    { proc: '0023456-12.2024.5.02.0011', kind: 'Prazo',      msg: 'Prazo de recurso encerra em 48h', when: 'há 5 h', tone: 'danger',  read: true },
    { proc: '7891234-33.2024.4.03.6100', kind: 'Captura',    msg: 'Falha de captura — credencial expirada', when: 'há 8 h', tone: 'danger',  read: true },
  ],

  /* API consumption (cliente portal) */
  apiUsage: {
    total: 18470,
    quota: 25000,
    today: 743,
    avg: 642,
    endpoints: [
      { path: '/v2/processos/captura',  calls: 9214, avg: 312, err: 0.4 },
      { path: '/v2/processos/laudo',    calls: 4720, avg: 1840, err: 1.1 },
      { path: '/v2/movimentacoes',      calls: 3140, avg: 220, err: 0.2 },
      { path: '/v2/documentos/baixar',  calls: 1396, avg: 540, err: 0.6 },
    ],
  },

  /* Credentials */
  credentials: [
    { name: 'Produção · Bradesco',   key: 'sbk_prod_8e3f...', created: '12/03/2026', last: 'há 4 min', uses: 18470 },
    { name: 'Sandbox · Stellar Agro', key: 'sbk_test_a1b2...', created: '08/04/2026', last: 'há 2 h',   uses: 1240 },
  ],

  /* Activity feed */
  activity: [
    { t: '14:35', tag: 'IA',       tone: 'ai',      txt: 'MCP processou 23 documentos — acuracidade 98.4%' },
    { t: '14:32', tag: 'Laudo',    tone: 'success', txt: 'Laudo técnico gerado para 0801234-56.2024.8.26.0100' },
    { t: '14:18', tag: 'Captura',  tone: 'info',    txt: 'Captura concluída — Itaú · 14 processos' },
    { t: '13:55', tag: 'Mov',      tone: 'warn',    txt: 'Nova movimentação — TJRJ 12ª Vara Empresarial' },
    { t: '13:40', tag: 'Falha',    tone: 'danger',  txt: 'TJRJ offline — failover para DataJud' },
    { t: '13:12', tag: 'Cadastro', tone: 'info',    txt: 'Cadastro interpretativo concluído — 8 processos' },
  ],

  /* Bars data — captures by tribunal, last 7 days */
  bars7d: [42, 65, 38, 72, 91, 56, 84],

  /* Trend sparklines */
  spark: {
    capt: [42, 48, 55, 62, 58, 70, 84, 92],
    iaQ:  [180, 175, 192, 188, 180, 184, 178, 184],
    laudos: [120, 145, 132, 168, 152, 184, 172, 196],
    moves: [820, 940, 1020, 980, 1080, 1140, 1180, 1203],
  },
};

window.MOCK = MOCK;
