import Link from 'next/link';
import {
  ArrowRight,
  Database,
  Send,
  ShieldCheck,
  Activity,
  Webhook,
  Mail,
  LayoutDashboard,
  FileSearch,
  KeyRound,
  Server,
} from 'lucide-react';
import { mockClientesOps } from '@/lib/mocks/clientes-ops';

function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

function formatPercent(n: number): string {
  return `${n.toFixed(1).replace('.', ',')}%`;
}

export default function LandingPage() {
  const ativos = mockClientesOps.filter((c) => c.status === 'ativo');
  const volume24h = mockClientesOps.reduce(
    (acc, c) => acc + c.volume_capturado_24h,
    0,
  );
  const taxas = mockClientesOps.flatMap((c) => [
    c.taxa_sucesso.PDPJ,
    c.taxa_sucesso.DJE,
    c.taxa_sucesso.TJ,
  ]);
  const taxaSucesso = taxas.reduce((a, b) => a + b, 0) / taxas.length;
  const fontesIntegradas = 5;
  const clientesAtivos = ativos.length;

  const numeros = [
    {
      valor: formatNumber(volume24h),
      label: 'Documentos capturados nas últimas 24 horas',
    },
    {
      valor: formatPercent(taxaSucesso),
      label: 'Taxa média de sucesso na captura',
    },
    {
      valor: String(fontesIntegradas),
      label: 'Fontes oficiais integradas',
    },
    {
      valor: formatNumber(clientesAtivos),
      label: 'Clientes ativos na plataforma',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-sm bg-brand" />
            <span className="text-sm font-semibold tracking-tight">
              Captura SBK
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
            <a href="#capacidades" className="hover:text-neutral-900">
              Capacidades
            </a>
            <a href="#numeros" className="hover:text-neutral-900">
              Números
            </a>
            <Link href="/portal/api-consumo" className="hover:text-neutral-900">
              API
            </Link>
            <Link href="/ops/dashboard" className="hover:text-neutral-900">
              Acesso operacional
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/portal/caixa-entrada"
              className="hidden rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 sm:inline-block"
            >
              Acessar Portal
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground hover:bg-brand-hover"
            >
              Criar conta
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Plataforma de captura jurídica
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Infraestrutura de dados jurídicos
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              Captura, normalização e entrega contínua de andamentos
              processuais, intimações e documentos a partir das fontes oficiais
              do Judiciário brasileiro. Em uma única camada de integração.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/portal/caixa-entrada"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-hover"
              >
                Acessar Portal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Criar conta
              </Link>
              <Link
                href="/ops/dashboard"
                className="ml-1 text-sm text-neutral-500 hover:text-neutral-800"
              >
                Acesso operacional SBK
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-neutral-200 pt-10 text-sm text-neutral-600 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-brand" />
              PDPJ
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-brand" />
              DJE
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-brand" />
              Tribunais Estaduais
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-brand" />
              PJe TRT
            </div>
          </div>
        </div>
      </section>

      <section id="capacidades" className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Capacidades
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              Captura, entrega e auditoria em um único pipeline
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Cada etapa é instrumentada, monitorada e exposta por API.
              Sem caixas-pretas entre a fonte oficial e o seu sistema.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <Database className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-neutral-900">
                Captura
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Conexão direta às fontes oficiais com retry, throttling e
                detecção de mudanças.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  PDPJ, Consulta Pública unificada
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  Diários da Justiça Eletrônica
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  TJs estaduais e PJe TRT
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  DataJud para histórico consolidado
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <Send className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-neutral-900">
                Entrega
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Quatro canais paralelos, com confirmação por evento e SLA
                medido ponta a ponta.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-brand" />
                  API REST com paginação por cursor
                </li>
                <li className="flex items-center gap-2">
                  <Webhook className="h-3.5 w-3.5 text-brand" />
                  Webhooks com assinatura HMAC
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  E-mail transacional
                </li>
                <li className="flex items-center gap-2">
                  <LayoutDashboard className="h-3.5 w-3.5 text-brand" />
                  Dashboard web com caixa de entrada
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-subtle text-brand">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-neutral-900">
                Auditoria
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Cada documento capturado tem registro imutável com hash
                criptográfico, fonte e timestamp.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-neutral-700">
                <li className="flex items-center gap-2">
                  <FileSearch className="h-3.5 w-3.5 text-brand" />
                  Hash SHA-256 por documento
                </li>
                <li className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-brand" />
                  Cadeia de credenciais rastreada
                </li>
                <li className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-brand" />
                  Log temporal completo da captura
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" />
                  Integridade verificável a qualquer tempo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="numeros" className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                Números
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Operação contínua, métricas transparentes
              </h2>
            </div>
            <p className="text-sm text-neutral-500">
              Valores apurados a partir do painel operacional interno.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200 lg:grid-cols-4">
            {numeros.map((n) => (
              <div key={n.label} className="bg-white p-6">
                <p className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                  {n.valor}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {n.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              Comece a capturar em minutos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Crie uma conta e configure sua primeira credencial PDPJ ou sua
              primeira chave de API. Sem instalação, sem infraestrutura para
              manter.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-hover"
            >
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portal/caixa-entrada"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            >
              Acessar Portal
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-neutral-500 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 rounded-sm bg-brand" />
            <span className="text-neutral-700">Captura SBK</span>
            <span className="text-neutral-400">2.0</span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/portal/caixa-entrada" className="hover:text-neutral-900">
              Portal
            </Link>
            <Link href="/portal/api-consumo" className="hover:text-neutral-900">
              API
            </Link>
            <a href="#" className="hover:text-neutral-900">
              Documentação
            </a>
            <a href="#" className="hover:text-neutral-900">
              Status
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
