'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { WizardLayout } from '@/components/onboarding/wizard-layout';
import { Input } from '@/components/onboarding/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  validateCPF,
  validateCNPJ,
  formatCPF,
  formatCNPJ,
} from '@/lib/validators';
import {
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
} from '@/lib/onboarding-store';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';

const PORTAL_STEPS = [
  'cadastro',
  'verificacao',
  'plano',
  'pagamento',
  'configuracao',
  'pronto',
];

const STEP_LABELS = [
  'Cadastro',
  'Verificação',
  'Plano',
  'Pagamento',
  'Configuração',
  'Pronto',
];

export default function PortalOnboardingStep() {
  const params = useParams() as { step: string };
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentStepIndex = PORTAL_STEPS.indexOf(params.step);

  useEffect(() => {
    const savedData = getOnboardingData('portal');
    setFormData(savedData);
  }, []);

  if (currentStepIndex === -1) {
    return <div>Passo inválido</div>;
  }

  const validateStep = (step: string, data: any): boolean => {
    const newErrors: any = {};

    if (step === 'cadastro') {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = 'E-mail inválido';
      }
      if (!data.cpfCnpj) {
        newErrors.cpfCnpj = 'CPF ou CNPJ é obrigatório';
      } else {
        const isCPF = data.cpfCnpj.replace(/\D/g, '').length === 11;
        const isValid = isCPF
          ? validateCPF(data.cpfCnpj)
          : validateCNPJ(data.cpfCnpj);
        if (!isValid) {
          newErrors.cpfCnpj = 'CPF ou CNPJ inválido';
        }
      }
    } else if (step === 'plano') {
      if (!data.planType) {
        newErrors.planType = 'Selecione um plano';
      }
    } else if (step === 'pagamento') {
      if (data.paymentMethod === 'card') {
        if (!data.cardNumber || data.cardNumber.replace(/\D/g, '').length !== 16) {
          newErrors.cardNumber = 'Número de cartão inválido';
        }
        if (!data.cardName) {
          newErrors.cardName = 'Nome do titular é obrigatório';
        }
        if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
          newErrors.cardExpiry = 'Data inválida (MM/AA)';
        }
        if (!data.cardCvc || data.cardCvc.length < 3) {
          newErrors.cardCvc = 'CVC inválido';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(params.step, formData)) return;

    setIsLoading(true);
    saveOnboardingData('portal', formData);

    setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < PORTAL_STEPS.length) {
        router.push(`/app/onboarding/portal/${PORTAL_STEPS[nextIndex]}`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.push(`/app/onboarding/portal/${PORTAL_STEPS[currentStepIndex - 1]}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <WizardLayout
      currentStep={currentStepIndex}
      totalSteps={PORTAL_STEPS.length}
      stepLabels={STEP_LABELS}
    >
      {params.step === 'cadastro' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Crie sua conta</h2>
            <p className="mb-6 text-muted-foreground">
              Informe seus dados para começar a usar a Captura SBK
            </p>
          </div>

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
          />

          <div>
            <label className="block text-sm font-medium text-foreground">
              CPF ou CNPJ
            </label>
            <input
              type="text"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={formData.cpfCnpj || ''}
              onChange={(e) => {
                let value = e.target.value;
                const clean = value.replace(/\D/g, '');
                if (clean.length <= 11) {
                  value = formatCPF(value);
                } else if (clean.length <= 14) {
                  value = formatCNPJ(value);
                }
                handleInputChange('cpfCnpj', value);
              }}
              className={`mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                errors.cpfCnpj
                  ? 'border-danger focus-visible:ring-danger/50'
                  : 'border-input'
              }`}
            />
            {errors.cpfCnpj && (
              <p className="mt-1 text-sm text-danger">{errors.cpfCnpj}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              Validação em tempo real
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} disabled={true}>
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {params.step === 'verificacao' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Verificar e-mail</h2>
            <p className="mb-6 text-muted-foreground">
              Enviamos um link de verificação para {formData.email}
            </p>
          </div>

          <Card className="border-brand/20 bg-brand/5 p-6 text-center">
            <p className="mb-4">
              Clique no link no seu e-mail para confirmar a propriedade da conta
            </p>
            <p className="text-sm text-muted-foreground">
              Não recebeu? Verifique sua pasta de spam ou solicite um novo link
            </p>
          </Card>

          <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-secondary/50 p-4 text-center">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              DESENVOLVIMENTO
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNext()}
              className="text-xs"
            >
              Simular clique no link de verificação
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {params.step === 'plano' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Escolha seu plano</h2>
            <p className="mb-6 text-muted-foreground">
              Selecione o plano que melhor se adequa às suas necessidades
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: 'free',
                name: 'Free',
                price: '0',
                features: ['5 monitoramentos', 'Histórico de 30 dias', 'Suporte por e-mail'],
              },
              {
                id: 'pro',
                name: 'Pro',
                price: '299',
                popular: true,
                features: [
                  '50 monitoramentos',
                  'Histórico de 1 ano',
                  'Suporte prioritário',
                  'Webhooks',
                ],
              },
              {
                id: 'business',
                name: 'Business',
                price: 'Customizado',
                features: [
                  'Monitoramentos ilimitados',
                  'Histórico ilimitado',
                  'Suporte 24/7',
                  'API dedicada',
                  'SLA garantido',
                ],
              },
            ].map((plan) => (
              <Card
                key={plan.id}
                className={`relative cursor-pointer p-6 transition-all ${
                  formData.planType === plan.id
                    ? 'border-brand ring-2 ring-brand/20'
                    : 'hover:border-brand/50'
                } ${plan.popular ? 'ring-2 ring-brand/20' : ''}`}
                onClick={() => handleInputChange('planType', plan.id)}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}
                <h3 className="mb-2 text-lg font-semibold">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    R${plan.price}
                  </span>
                  {plan.id !== 'business' && (
                    <span className="text-sm text-muted-foreground">/mês</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {errors.planType && (
            <p className="text-sm text-danger">{errors.planType}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {params.step === 'pagamento' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Pagamento</h2>
            <p className="mb-6 text-muted-foreground">
              Selecione a forma de pagamento (mockado, sem processamento real)
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => {
                handleInputChange('paymentMethod', 'card');
                setErrors({});
              }}
            >
              Cartão de crédito
            </Button>
            <Button
              variant={formData.paymentMethod === 'pix' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => {
                handleInputChange('paymentMethod', 'pix');
                setErrors({});
              }}
            >
              PIX
            </Button>
          </div>

          {formData.paymentMethod === 'card' && (
            <div className="space-y-4 border-t pt-6">
              <Input
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                value={formData.cardNumber || ''}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '').slice(0, 16);
                  value = value.replace(/(\d{4})/g, '$1 ').trim();
                  handleInputChange('cardNumber', value);
                }}
                error={errors.cardNumber}
              />
              <Input
                label="Nome do titular"
                placeholder="Nome completo"
                value={formData.cardName || ''}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                error={errors.cardName}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Validade"
                  placeholder="MM/AA"
                  maxLength="5"
                  value={formData.cardExpiry || ''}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2);
                    }
                    handleInputChange('cardExpiry', value);
                  }}
                  error={errors.cardExpiry}
                />
                <Input
                  label="CVC"
                  placeholder="000"
                  maxLength="3"
                  type="password"
                  value={formData.cardCvc || ''}
                  onChange={(e) =>
                    handleInputChange('cardCvc', e.target.value.replace(/\D/g, ''))
                  }
                  error={errors.cardCvc}
                />
              </div>
            </div>
          )}

          {formData.paymentMethod === 'pix' && (
            <div className="space-y-4 border-t pt-6">
              <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-6 text-center">
                <p className="mb-4 font-medium">QR Code PIX</p>
                <div className="mx-auto h-48 w-48 rounded-lg bg-white p-4">
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    [QR Code placeholder]
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Aponte sua câmera para o QR code acima
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {params.step === 'configuracao' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">
              Configure sua primeira credencial
            </h2>
            <p className="mb-6 text-muted-foreground">
              Escolha por onde começar
            </p>
          </div>

          <div className="space-y-4">
            <Card
              className="cursor-pointer border-2 p-6 transition-all hover:border-brand/50"
              onClick={() => handleInputChange('setupType', 'pdpj')}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Consulta Pública (PDPJ)
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Configura uma credencial para buscar dados públicos de processos judiciais
              </p>
              <div className="text-xs text-muted-foreground">
                Tempo estimado: 5 minutos
              </div>
            </Card>

            <Card
              className="cursor-pointer border-2 p-6 transition-all hover:border-brand/50"
              onClick={() => handleInputChange('setupType', 'monitoring')}
            >
              <h3 className="mb-2 text-lg font-semibold">
                Criar Monitoramento
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Configure seu primeiro monitoramento para receber atualizações em tempo real
              </p>
              <div className="text-xs text-muted-foreground">
                Tempo estimado: 5 minutos
              </div>
            </Card>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => handleNext()}
          >
            Pular esta etapa
          </Button>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={isLoading} className="flex-1">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {params.step === 'pronto' && (
        <div className="space-y-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <Check className="h-10 w-10 text-success" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold">Tudo pronto!</h2>
            <p className="mb-4 text-muted-foreground">
              Sua conta foi criada com sucesso
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-secondary/50 p-4 text-left text-sm">
            <p>
              <strong>E-mail:</strong> {formData.email}
            </p>
            <p>
              <strong>Plano:</strong>{' '}
              {formData.planType?.charAt(0).toUpperCase() +
                formData.planType?.slice(1)}
            </p>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              clearOnboardingData('portal');
              router.push('/portal/caixa-entrada');
            }}
          >
            Ir para o Portal
          </Button>
        </div>
      )}
    </WizardLayout>
  );
}
