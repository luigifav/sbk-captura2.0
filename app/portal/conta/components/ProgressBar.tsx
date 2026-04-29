interface ProgressBarProps {
  used: number;
  limit: number;
}

export function ProgressBar({ used, limit }: ProgressBarProps) {
  const percentage = (used / limit) * 100;
  const isWarning = percentage >= 75;
  const isAlert = percentage >= 90;

  let colorClass = 'bg-blue-500';
  if (isAlert) {
    colorClass = 'bg-red-500';
  } else if (isWarning) {
    colorClass = 'bg-yellow-500';
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}
