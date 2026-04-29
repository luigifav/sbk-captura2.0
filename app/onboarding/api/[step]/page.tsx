'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { WizardLayout } from '@/components/onboarding/wizard-layout';
import { Input } from '@/components/onboarding/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
} from '@/lib/onboarding-store';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';

const API_STEPS = ['cadastro', 'verificacao', 'api-key', 'quick-start', 'pronto'];

const STEP_LABELS = [
  'Cadastro',
  'Verificação',
  'API Key',
  'Quick Start',
  'Pronto',
];

function generateApiKey(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `sk_test_${timestamp}${randomStr}`.toUpperCase();
}

export default function ApiOnboardingStep() {
  const params = useParams() as { step: string };
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentStepIndex = API_STEPS.indexOf(params.step);

  useEffect(() => {
    const savedData = getOnboardingData('api') as any;
    setFormData(savedData);

    if (params.step === 'api-key' && !savedData.apiKey) {
      const newApiKey = generateApiKey();
      setFormData((prev: any) => ({ ...prev, apiKey: newApiKey }));
      saveOnboardingData('api', { ...savedData, apiKey: newApiKey });
    }
  }, [params.step]);

  if (currentStepIndex === -1) {
    return <div>Passo inválido</div>;
  }

  const validateStep = (step: string, data: any): boolean => {
    const newErrors: any = {};

    if (step === 'cadastro') {
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = 'E-mail inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(params.step, formData)) return;

    setIsLoading(true);
    saveOnboardingData('api', formData);

    setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < API_STEPS.length) {
        router.push(`/onboarding/api/${API_STEPS[nextIndex]}`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.push(`/onboarding/api/${API_STEPS[currentStepIndex - 1]}`);
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
      totalSteps={API_STEPS.length}
      stepLabels={STEP_LABELS}
    >
      {params.step === 'cadastro' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Crie sua conta de desenvolvedor</h2>
            <p className="mb-6 text-muted-foreground">
              Informe seu e-mail para começar
            </p>
          </div>

          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            helperText="Você receberá um link de verificação"
          />

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

      {params.step === 'api-key' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Sua API Key foi gerada</h2>
            <p className="mb-6 text-muted-foreground">
              Esta é a única vez que você verá essa chave. Copie e guarde em um local seguro
            </p>
          </div>

          <Card className="border-danger/20 bg-danger/5 p-4">
            <p className="text-sm text-danger">
              <strong>Aviso de segurança:</strong> Nunca compartilhe sua API key com ninguém.
              Se comprometida, gere uma nova imediatamente.
            </p>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                API Key de Teste
              </p>
              <div className="flex items-center gap-2">
                <code
                  className="flex-1 rounded bg-secondary/50 px-3 py-2 font-mono text-sm"
                >
                  {showApiKey ? formData.apiKey : '•'.repeat(40)}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="h-10 w-10"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(formData.apiKey)}
                  className="h-10 w-10"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

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

      {params.step === 'quick-start' && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Quick Start</h2>
            <p className="mb-6 text-muted-foreground">
              Faça sua primeira chamada à API
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">
                Exemplo com cURL (já preenchido com sua key)
              </p>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                  <code>{`curl -X GET https://api.captura.sbk/v1/monitoramentos \\
  -H "Authorization: Bearer ${formData.apiKey}" \\
  -H "Content-Type: application/json"`}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() =>
                    copyToClipboard(
                      `curl -X GET https://api.captura.sbk/v1/monitoramentos \\
  -H "Authorization: Bearer ${formData.apiKey}" \\
  -H "Content-Type: application/json"`
                    )
                  }
                >
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Resposta esperada:</p>
              <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100">
                <code>{`{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0
  },
  "status": "success"
}`}</code>
              </pre>
            </div>

            <Card className="border-info/20 bg-info/5 p-4">
              <p className="text-sm text-info-foreground">
                <strong>Documentação completa:</strong>{' '}
                <a href="#" className="underline hover:no-underline">
                  docs.captura.sbk
                </a>
              </p>
            </Card>
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

      {params.step === 'pronto' && (
        <div className="space-y-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
              <Check className="h-10 w-10 text-success" />
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold">API pronta para usar!</h2>
            <p className="mb-4 text-muted-foreground">
              Sua conta de desenvolvedor foi criada com sucesso
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-secondary/50 p-4 text-left text-sm">
            <p>
              <strong>E-mail:</strong> {formData.email}
            </p>
            <p className="flex items-center justify-between">
              <strong>API Key:</strong>
              <code className="rounded bg-white px-2 py-1 font-mono text-xs">
                {formData.apiKey?.substring(0, 15)}...
              </code>
            </p>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                clearOnboardingData('api');
                router.push('/portal/api-consumo');
              }}
            >
              Ir para Dashboard de Consumo
            </Button>
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <a href="#">Developer Portal</a>
            </Button>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
