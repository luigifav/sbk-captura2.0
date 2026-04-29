'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit2, AlertCircle, X } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { PlanComparator } from './components/PlanComparator';
import { CancelSubscriptionModal } from './components/CancelSubscriptionModal';

export default function ContaPage() {
  const [showPlanComparator, setShowPlanComparator] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const currentPlan = {
    name: 'Portal Pro',
    value: 'R$ 199,00',
    nextBilling: '15 de maio de 2026',
  };

  const consumption = [
    { label: 'Capturas', used: 2450, limit: 5000, icon: '📸' },
    { label: 'Downloads', used: 1800, limit: 3000, icon: '⬇️' },
    { label: 'Monitoramentos', used: 8, limit: 20, icon: '👁️' },
    { label: 'Ciências DJE', used: 45, limit: 100, icon: '✓' },
  ];

  const invoices = [
    { date: '15 de abril de 2026', value: 'R$ 199,00', status: 'Pago', id: '001' },
    { date: '15 de março de 2026', value: 'R$ 199,00', status: 'Pago', id: '002' },
    { date: '15 de fevereiro de 2026', value: 'R$ 199,00', status: 'Pago', id: '003' },
    { date: '15 de janeiro de 2026', value: 'R$ 199,00', status: 'Pago', id: '004' },
  ];

  const userData = {
    email: 'maria.silva@example.com',
    cpfCnpj: '12345678901234',
    company: 'Silva Consultoria Jurídica',
    address: 'Rua das Flores, 123',
    city: 'São Paulo, SP',
    zipCode: '01234-567',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Conta & Plano</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua conta, plano e faturas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>Seu plano ativo e próxima cobrança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Plano mensal recorrente</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor mensal:</span>
                    <span className="font-semibold">{currentPlan.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Próxima cobrança:</span>
                    <span className="font-semibold">{currentPlan.nextBilling}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPlanComparator(true)}
                  variant="outline"
                  className="w-full"
                >
                  Mudar de Plano
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Consumo do Período */}
          <Card>
            <CardHeader>
              <CardTitle>Consumo do Período</CardTitle>
              <CardDescription>Uso de recursos neste mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {consumption.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.used} / {item.limit}
                      </span>
                    </div>
                    <ProgressBar used={item.used} limit={item.limit} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card Faturas */}
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
              <CardDescription>Histórico de pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Data</th>
                      <th className="text-left py-3 px-4 font-medium">Valor</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">{invoice.date}</td>
                        <td className="py-3 px-4 font-semibold">{invoice.value}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Baixar PDF"
                          >
                            <Download size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Card Dados Cadastrais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Cadastrais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CPF/CNPJ</p>
                <p className="text-sm font-medium">12345678***234</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Empresa</p>
                <p className="text-sm font-medium">{userData.company}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Endereço</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {userData.address}, {userData.city}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Edit2 size={16} className="mr-2" />
                Editar Dados
              </Button>
            </CardContent>
          </Card>

          {/* Card Cancelamento */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">Cancelamento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-700 mb-4">
                Você poderá exportar seus dados por 90 dias após cancelamento.
              </p>
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
              >
                Cancelar assinatura
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Mudar de Plano */}
      {showPlanComparator && (
        <PlanComparator onClose={() => setShowPlanComparator(false)} currentPlan={currentPlan.name} />
      )}

      {/* Modal Cancelar Assinatura */}
      {showCancelModal && (
        <CancelSubscriptionModal onClose={() => setShowCancelModal(false)} />
      )}
    </div>
  );
}
