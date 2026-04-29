'use client';

import { Processo } from '@/lib/mocks/processos';
import { RegistroCapturado } from '@/lib/mocks/registro-captura-entrega';
import { ClienteRepresentado, Credencial } from '@/lib/mocks/credenciais';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export function MetadataCard({ processo }: { processo: Processo }) {
  const dataMovimentacao = processo.data_captura.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const retencaoDias = 90;
  const retencaoAte = new Date(processo.data_captura);
  retencaoAte.setDate(retencaoAte.getDate() + retencaoDias);
  const retencaoAteFmt = retencaoAte.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Metadados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">SHA-256</p>
          <code className="block text-xs bg-neutral-100 p-2 rounded font-mono overflow-auto max-h-12 break-all">
            {processo.hash_documento}
          </code>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Tamanho</p>
          <p className="text-sm text-neutral-900">
            {(processo.tamanho_documento / 1024).toFixed(2)} KB
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Retenção até</p>
          <p className="text-sm text-neutral-900">{retencaoAteFmt}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Movimentação Original</p>
          <p className="text-sm text-neutral-900">{dataMovimentacao}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientCard({ cliente }: { cliente: ClienteRepresentado }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Nome</p>
          <p className="text-sm font-medium text-neutral-900">{cliente.nome}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">CNPJ/CPF</p>
          <p className="text-sm text-neutral-600">{cliente.cnpj_cpf}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Plano</p>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-brand-subtle text-brand">
            {cliente.modo_ciencia}
          </span>
        </div>
        <Button variant="outline" size="sm" className="w-full text-xs">
          Acessar Perfil
        </Button>
      </CardContent>
    </Card>
  );
}

export function RegistryCard({ registro }: { registro: RegistroCapturado }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registro de Captura e Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">ID do Registro</p>
          <code className="block text-xs font-mono text-neutral-900">
            {registro.id}
          </code>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Status</p>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-success-light text-success-foreground">
            Emitido
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar PDF
        </Button>
      </CardContent>
    </Card>
  );
}

export function CredentialCard({ credencial }: { credencial: Credencial }) {
  const statusVariant = credencial.status === 'ativo'
    ? 'bg-success-light text-success-foreground'
    : credencial.status === 'expirado'
    ? 'bg-danger-light text-danger-foreground'
    : credencial.status === 'inválido'
    ? 'bg-danger-light text-danger-foreground'
    : 'bg-warning-light text-warning-foreground';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Credencial Usada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Identificador</p>
          <code className="block text-xs font-mono text-neutral-900">
            {credencial.token_mascarado}
          </code>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Status na Captura</p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusVariant}`}
          >
            {credencial.status.charAt(0).toUpperCase() + credencial.status.slice(1)}
          </span>
        </div>
        <div>
          <p className="text-xs text-neutral-500 font-medium mb-1">Última Validação</p>
          <p className="text-xs text-neutral-600">
            {credencial.ultima_validacao.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
