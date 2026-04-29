'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CodeIcon, Globe } from 'lucide-react';

export default function OnboardingSelectFlow() {
  const router = useRouter();

  const handlePortalClick = () => {
    router.push('/onboarding/portal/cadastro');
  };

  const handleApiClick = () => {
    router.push('/onboarding/api/cadastro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container flex flex-col items-center justify-center py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Bem-vindo à Captura SBK
          </h1>
          <p className="text-lg text-muted-foreground">
            Como você quer usar a plataforma?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:max-w-3xl">
          <Card
            onClick={handlePortalClick}
            className="group cursor-pointer transition-all duration-300 hover:border-brand hover:shadow-lg hover:shadow-brand/20"
          >
            <div className="p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 transition-all duration-300 group-hover:bg-brand/20">
                <Globe className="h-8 w-8 text-brand" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Portal Web</h2>
              <p className="mb-6 text-muted-foreground">
                Para advogados, gestores e analistas
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Interface intuitiva
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Monitoramento em tempo real
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Integração com Consulta Pública
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Gestão de credenciais
                </li>
              </ul>
              <Button className="w-full" onClick={handlePortalClick}>
                Começar com Portal Web
              </Button>
            </div>
          </Card>

          <Card
            onClick={handleApiClick}
            className="group cursor-pointer transition-all duration-300 hover:border-brand hover:shadow-lg hover:shadow-brand/20"
          >
            <div className="p-8">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-brand/10 transition-all duration-300 group-hover:bg-brand/20">
                <CodeIcon className="h-8 w-8 text-brand" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">API REST</h2>
              <p className="mb-6 text-muted-foreground">
                Para desenvolvedores e integradores
              </p>
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  API REST completa
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Webhooks em tempo real
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Documentação integrada
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-brand">•</span>
                  Suporte a múltiplas linguagens
                </li>
              </ul>
              <Button className="w-full" onClick={handleApiClick}>
                Começar com API
              </Button>
            </div>
          </Card>
        </div>

        <Card className="mt-12 w-full max-w-3xl border-brand/20 bg-brand/5">
          <div className="p-6 text-center">
            <h3 className="mb-2 font-semibold text-foreground">
              Precisa de volume alto?
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Entre em contato com nosso time comercial para soluções enterprise customizadas
            </p>
            <Button variant="outline" asChild>
              <a href="mailto:comercial@captura.sbk">
                Fale com nosso comercial
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
