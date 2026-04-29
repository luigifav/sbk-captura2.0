'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Check } from 'lucide-react';

interface PlanComparatorProps {
  onClose: () => void;
  currentPlan: string;
}

export function PlanComparator({ onClose, currentPlan }: PlanComparatorProps) {
  const plans = [
    {
      name: 'Free',
      price: 'Gratuito',
      description: 'Para testar a plataforma',
      features: [
        { name: 'Capturas', included: true },
        { name: 'Downloads', included: true },
        { name: 'Monitoramentos', included: false },
        { name: 'Ciências DJE', included: false },
        { name: 'Suporte por email', included: true },
        { name: 'API', included: false },
      ],
      cta: 'Fazer upgrade',
    },
    {
      name: 'Portal Pro',
      price: 'R$ 199/mês',
      description: 'Mais recursos e suporte',
      features: [
        { name: 'Capturas', included: true },
        { name: 'Downloads', included: true },
        { name: 'Monitoramentos', included: true },
        { name: 'Ciências DJE', included: true },
        { name: 'Suporte por email', included: true },
        { name: 'API', included: true },
      ],
      cta: 'Plano atual',
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Sob consulta',
      description: 'Solução customizada',
      features: [
        { name: 'Capturas', included: true },
        { name: 'Downloads', included: true },
        { name: 'Monitoramentos', included: true },
        { name: 'Ciências DJE', included: true },
        { name: 'Suporte prioritário 24/7', included: true },
        { name: 'API com limites altos', included: true },
      ],
      cta: 'Contactar vendas',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Comparador de Planos</h2>
            <p className="text-sm text-muted-foreground">Escolha o plano que melhor atende suas necessidades</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col transition-all ${
                  plan.current
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'hover:shadow-lg'
                }`}
              >
                <CardHeader>
                  {plan.current && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground mb-2 w-fit">
                      Plano atual
                    </div>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  <div>
                    <p className="text-3xl font-bold">{plan.price}</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-0.5 rounded ${
                            feature.included
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Check size={16} />
                        </div>
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.current ? 'outline' : 'default'}
                    className="w-full mt-auto"
                    disabled={plan.current}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
