import { ReactNode } from 'react';
import { ProgressBar } from './progress-bar';

export interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  title?: string;
  description?: string;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  stepLabels,
  title,
  description,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container max-w-2xl py-8">
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          {title && <h1 className="mb-2 text-2xl font-bold">{title}</h1>}
          {description && (
            <p className="mb-6 text-muted-foreground">{description}</p>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
