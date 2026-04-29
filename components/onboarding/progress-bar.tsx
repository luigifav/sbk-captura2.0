export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Passo {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-gradient-to-r from-brand to-brand-light transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {stepLabels && (
        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`text-center ${
                index <= currentStep ? 'text-foreground font-medium' : ''
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
