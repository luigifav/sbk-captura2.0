import * as React from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Sparkline ──────────────────────────────────────────── */

interface SparklineProps {
  data: number[];
  className?: string;
  color?: string;
}

function Sparkline({ data, className, color = "currentColor" }: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 80;
  const height = 24;
  const padding = 2;

  const points = data
    .map((v, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = padding + ((max - v) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Delta ──────────────────────────────────────────────── */

interface DeltaProps {
  value: number;
  className?: string;
}

function Delta({ value, className }: DeltaProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isPositive && "text-success",
        !isPositive && !isNeutral && "text-danger",
        isNeutral && "text-neutral-500",
        className
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {isPositive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

/* ─── MetricCard ─────────────────────────────────────────── */

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: number;
  sparkline?: number[];
  description?: string;
  loading?: boolean;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      label,
      value,
      delta,
      sparkline,
      description,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border border-neutral-200 bg-white p-4",
          "transition-shadow hover:shadow-sm",
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-7 w-32 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-neutral-500">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                  {value}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  {delta !== undefined && <Delta value={delta} />}
                  {description && (
                    <span className="text-xs text-neutral-400">{description}</span>
                  )}
                </div>
              </div>

              {sparkline && sparkline.length >= 2 && (
                <Sparkline
                  data={sparkline}
                  className="h-6 w-20 shrink-0 text-brand"
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
);

MetricCard.displayName = "MetricCard";

export { MetricCard, Sparkline, Delta };
