'use client';

import { useState } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  RotateCw,
  Trash2,
  Plus,
  ExternalLink,
  Calendar,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MOCK_API_KEYS = [
  {
    id: '1',
    name: 'Production API Key',
    prefix: 'sk_live_a3f2d8c9e1b4f6a2',
    created: '2024-01-15',
    lastUsed: '2024-04-28',
    environment: 'live',
  },
  {
    id: '2',
    name: 'Development Key',
    prefix: 'sk_test_7e9d2f4c8b1a3e5g',
    created: '2024-02-10',
    lastUsed: '2024-04-27',
    environment: 'test',
  },
  {
    id: '3',
    name: 'Integration Testing',
    prefix: 'sk_test_9c3f1e7d2a8b4f6h',
    created: '2024-03-05',
    lastUsed: '2024-04-20',
    environment: 'test',
  },
];

const MOCK_CONSUMPTION_DATA = [
  { date: '1 Apr', calls: 2400, errors: 240 },
  { date: '2 Apr', calls: 1398, errors: 221 },
  { date: '3 Apr', calls: 9800, errors: 229 },
  { date: '4 Apr', calls: 3908, errors: 200 },
  { date: '5 Apr', calls: 4800, errors: 221 },
  { date: '6 Apr', calls: 3800, errors: 250 },
  { date: '7 Apr', calls: 4300, errors: 210 },
  { date: '8 Apr', calls: 2300, errors: 290 },
  { date: '9 Apr', calls: 1500, errors: 100 },
  { date: '10 Apr', calls: 5200, errors: 180 },
  { date: '11 Apr', calls: 3100, errors: 160 },
  { date: '12 Apr', calls: 6800, errors: 320 },
  { date: '13 Apr', calls: 4200, errors: 140 },
  { date: '14 Apr', calls: 7100, errors: 280 },
  { date: '15 Apr', calls: 5900, errors: 190 },
  { date: '16 Apr', calls: 4400, errors: 220 },
  { date: '17 Apr', calls: 3700, errors: 170 },
  { date: '18 Apr', calls: 6300, errors: 250 },
  { date: '19 Apr', calls: 2900, errors: 110 },
  { date: '20 Apr', calls: 8100, errors: 350 },
  { date: '21 Apr', calls: 4600, errors: 200 },
  { date: '22 Apr', calls: 5300, errors: 210 },
  { date: '23 Apr', calls: 3200, errors: 140 },
  { date: '24 Apr', calls: 7400, errors: 310 },
  { date: '25 Apr', calls: 6100, errors: 260 },
  { date: '26 Apr', calls: 4900, errors: 180 },
  { date: '27 Apr', calls: 5600, errors: 200 },
  { date: '28 Apr', calls: 7200, errors: 330 },
  { date: '29 Apr', calls: 6400, errors: 240 },
  { date: '30 Apr', calls: 8300, errors: 380 },
];

const MOCK_ENDPOINT_BREAKDOWN = [
  {
    endpoint: 'GET /v1/documents/{id}/download',
    calls: 45230,
    latencyP95: '245ms',
    errorRate: '0.12%',
  },
  {
    endpoint: 'POST /v1/documents',
    calls: 28450,
    latencyP95: '1250ms',
    errorRate: '0.05%',
  },
  {
    endpoint: 'GET /v1/documents',
    calls: 18920,
    latencyP95: '380ms',
    errorRate: '0.08%',
  },
  {
    endpoint: 'PUT /v1/documents/{id}',
    calls: 12340,
    latencyP95: '890ms',
    errorRate: '0.03%',
  },
  {
    endpoint: 'DELETE /v1/documents/{id}',
    calls: 5670,
    latencyP95: '320ms',
    errorRate: '0.02%',
  },
];

const MOCK_WEBHOOKS = [
  {
    id: '1',
    url: 'https://api.example.com/webhooks/documents',
    events: ['document.created', 'document.processed'],
    status: 'active',
    lastDelivery: '2024-04-28T14:32:00Z',
  },
  {
    id: '2',
    url: 'https://webhook.site/unique-id-12345',
    events: ['document.failed'],
    status: 'active',
    lastDelivery: '2024-04-28T10:15:00Z',
  },
  {
    id: '3',
    url: 'https://legacy.example.com/notify',
    events: ['document.created'],
    status: 'inactive',
    lastDelivery: '2024-04-20T08:42:00Z',
  },
];

function ApiKeysTab() {
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<'test' | 'live'>(
    'test'
  );
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keysCopied, setKeysCopied] = useState(false);

  const handleCreateKey = () => {
    if (newKeyName.trim()) {
      const newKey = `sk_${newKeyEnvironment}_${Math.random().toString(36).substr(2, 16)}`;
      setGeneratedKey(newKey);
      setNewKeyName('');
      setNewKeyEnvironment('test');
    }
  };

  const copyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setKeysCopied(true);
      setTimeout(() => setKeysCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGeneratedKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Chaves de API</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas chaves de API para acessar a plataforma
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Criar nova API Key
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Prefixo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Criada
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Último Uso
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Ambiente
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_API_KEYS.map((key) => (
              <tr key={key.id} className="border-b hover:bg-muted/30">
                <td className="px-6 py-4 text-sm">{key.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                  {key.prefix}
                </td>
                <td className="px-6 py-4 text-sm">{key.created}</td>
                <td className="px-6 py-4 text-sm">{key.lastUsed}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
                      key.environment === 'live'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {key.environment === 'live' ? 'Produção' : 'Teste'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      title="Regenerar"
                      className="p-1.5 hover:bg-muted rounded transition-colors"
                    >
                      <RotateCw size={16} />
                    </button>
                    <button
                      title="Revogar"
                      className="p-1.5 hover:bg-muted rounded transition-colors text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 m-4">
            {!generatedKey ? (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  Criar nova chave de API
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome da chave
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Produção - App Mobile"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ambiente
                    </label>
                    <select
                      value={newKeyEnvironment}
                      onChange={(e) =>
                        setNewKeyEnvironment(e.target.value as 'test' | 'live')
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="test">Teste</option>
                      <option value="live">Produção</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateKey}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-3">
                    <AlertCircle
                      size={20}
                      className="text-yellow-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-yellow-800">
                      Copie sua chave agora. Não será exibida novamente.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    Sua chave de API
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2 border rounded-lg bg-muted/50 font-mono text-sm break-all overflow-x-auto">
                      {generatedKey}
                    </div>
                    <button
                      onClick={copyKey}
                      className="px-3 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      {keysCopied ? (
                        <>
                          <Check size={16} />
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Entendido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConsumptionTab() {
  const totalCalls = MOCK_CONSUMPTION_DATA.reduce((sum, d) => sum + d.calls, 0);
  const totalErrors = MOCK_CONSUMPTION_DATA.reduce((sum, d) => sum + d.errors, 0);
  const estimatedCost = (totalCalls / 1000) * 0.001;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Chamadas (30d)</p>
          <p className="text-2xl font-semibold">
            {totalCalls.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Taxa de erro</p>
          <p className="text-2xl font-semibold">
            {((totalErrors / totalCalls) * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Custo estimado (30d)
          </p>
          <p className="text-2xl font-semibold">
            R$ {estimatedCost.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Chamadas por dia (últimos 30 dias)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={MOCK_CONSUMPTION_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#3b82f6"
              dot={false}
              name="Chamadas"
            />
            <Line
              type="monotone"
              dataKey="errors"
              stroke="#ef4444"
              dot={false}
              name="Erros"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Breakdown por endpoint</h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Endpoint
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Chamadas
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Latência P95
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Taxa de erro
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ENDPOINT_BREAKDOWN.map((endpoint, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-mono">
                    {endpoint.endpoint}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {endpoint.calls.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm">{endpoint.latencyP95}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-red-600">{endpoint.errorRate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Webhooks</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure webhooks para receber eventos em tempo real
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Criar webhook
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_WEBHOOKS.map((webhook) => (
          <div key={webhook.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-mono text-sm break-all text-muted-foreground">
                  {webhook.url}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-medium ml-2 whitespace-nowrap ${
                  webhook.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="mb-3 space-y-1">
              <p className="text-sm font-medium">Eventos inscritos:</p>
              <div className="flex flex-wrap gap-2">
                {webhook.events.map((event) => (
                  <span
                    key={event}
                    className="px-2 py-1 bg-muted rounded text-xs"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
              <span>
                Último delivery:{' '}
                {new Date(webhook.lastDelivery).toLocaleDateString('pt-BR')}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 hover:bg-muted rounded transition-colors">
                  Editar
                </button>
                <button className="px-3 py-1.5 hover:bg-muted rounded transition-colors text-red-600">
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 m-4">
            <h3 className="text-lg font-semibold mb-4">Criar novo webhook</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL do webhook
                </label>
                <input
                  type="url"
                  placeholder="https://api.example.com/webhooks"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Eventos
                </label>
                <div className="space-y-2">
                  {[
                    'document.created',
                    'document.processed',
                    'document.failed',
                  ].map((event) => (
                    <label key={event} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        defaultChecked={event === 'document.created'}
                      />
                      <span className="text-sm">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentationTab() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">
          Documentação da API
        </h2>
        <p className="text-blue-100 mb-6">
          Guias completos, exemplos de código e referência de API
        </p>
        <a
          href="https://developer.sbk.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Acessar documentação
          <ExternalLink size={18} />
        </a>
      </div>

      <div className="border rounded-lg p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Quick Start</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              Fazer download de um documento:
            </p>
            <div className="bg-background border rounded p-4 overflow-x-auto">
              <pre className="text-xs font-mono">
                {`curl -X GET https://api.sbk.com.br/v1/documents/{id}/download \\
  -H "Authorization: Bearer sk_live_your_key" \\
  -H "Accept: application/pdf" \\
  -o documento.pdf`}
              </pre>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                Substitua <code className="bg-blue-100 px-1 rounded">{'{id}'}</code> pelo ID do documento e use sua chave de API.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Recursos populares:</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://developer.sbk.com.br/docs/authentication"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                Autenticação <ExternalLink size={14} />
              </a>
            </li>
            <li>
              <a
                href="https://developer.sbk.com.br/docs/documents"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                API de Documentos <ExternalLink size={14} />
              </a>
            </li>
            <li>
              <a
                href="https://developer.sbk.com.br/docs/webhooks"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                Configurar Webhooks <ExternalLink size={14} />
              </a>
            </li>
            <li>
              <a
                href="https://developer.sbk.com.br/docs/errors"
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                Tratamento de Erros <ExternalLink size={14} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ApiConsumoPage() {
  const [activeTab, setActiveTab] = useState<
    'keys' | 'consumption' | 'webhooks' | 'docs'
  >('keys');

  const tabs = [
    { id: 'keys', label: 'Chaves de API' },
    { id: 'consumption', label: 'Consumo' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'docs', label: 'Documentação' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API e Consumo</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas chaves de API, monitore o consumo e configure webhooks
        </p>
      </div>

      <div className="border-b">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'keys' && <ApiKeysTab />}
        {activeTab === 'consumption' && <ConsumptionTab />}
        {activeTab === 'webhooks' && <WebhooksTab />}
        {activeTab === 'docs' && <DocumentationTab />}
      </div>
    </div>
  );
}
