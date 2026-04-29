import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Tipos ──────────────────────────────────────────────── */

export type TimelineEventStatus =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  label: string;
  description?: string;
  status?: TimelineEventStatus;
  icon?: React.ReactNode;
  metadata?: Record<string, string>;
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[];
  showDuration?: boolean;
  compact?: boolean;
}

/* ─── Helpers ────────────────────────────────────────────── */

function formatTimestamp(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m < 60) return rem > 0 ? `${m}min ${rem}s` : `${m}min`;
  const h = Math.floor(m / 60);
  const mRem = m % 60;
  return mRem > 0 ? `${h}h ${mRem}min` : `${h}h`;
}

/* ─── Dot de status ──────────────────────────────────────── */

const dotVariants: Record<TimelineEventStatus, string> = {
  success: "bg-success ring-success/20",
  warning: "bg-warning ring-warning/20",
  danger: "bg-danger ring-danger/20",
  info: "bg-info ring-info/20",
  default: "bg-neutral-400 ring-neutral-200",
};

interface EventDotProps {
  status: TimelineEventStatus;
  icon?: React.ReactNode;
  compact?: boolean;
}

function EventDot({ status, icon, compact }: EventDotProps) {
  if (icon) {
    return (
      <span
        className={cn(
          "flex items-center justify-center rounded-full ring-4",
          compact ? "h-6 w-6 text-2xs" : "h-8 w-8 text-xs",
          dotVariants[status],
          "text-white"
        )}
      >
        {icon}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "block rounded-full ring-4",
        compact ? "h-2.5 w-2.5" : "h-3 w-3",
        dotVariants[status]
      )}
    />
  );
}

/* ─── Timeline ───────────────────────────────────────────── */

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ events, showDuration = true, compact = false, className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn("relative space-y-0", className)}
        {...props}
      >
        {events.map((event, index) => {
          const next = events[index + 1];
          const durationMs = next
            ? event.timestamp.getTime() - next.timestamp.getTime()
            : null;
          const isLast = index === events.length - 1;
          const status = event.status ?? "default";

          return (
            <li key={event.id} className="relative flex gap-4">
              {/* Linha vertical + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center",
                    compact ? "mt-0.5" : "mt-1"
                  )}
                >
                  <EventDot
                    status={status}
                    icon={event.icon}
                    compact={compact}
                  />
                </div>
                {!isLast && (
                  <div className="mt-1 flex-1 border-l border-neutral-200" />
                )}
              </div>

              {/* Conteúdo */}
              <div
                className={cn(
                  "min-w-0 flex-1",
                  isLast ? "pb-0" : compact ? "pb-4" : "pb-5"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p
                    className={cn(
                      "font-medium text-neutral-900",
                      compact ? "text-xs" : "text-sm"
                    )}
                  >
                    {event.label}
                  </p>
                  <time
                    dateTime={event.timestamp.toISOString()}
                    className="shrink-0 text-xs text-neutral-400 tabular-nums"
                  >
                    {formatTimestamp(event.timestamp)}
                  </time>
                </div>

                {event.description && (
                  <p
                    className={cn(
                      "mt-0.5 text-neutral-500",
                      compact ? "text-xs" : "text-xs"
                    )}
                  >
                    {event.description}
                  </p>
                )}

                {event.metadata &&
                  Object.entries(event.metadata).length > 0 && (
                    <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(event.metadata).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1">
                          <dt className="text-2xs font-medium uppercase tracking-wide text-neutral-400">
                            {k}
                          </dt>
                          <dd className="text-xs text-neutral-600">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                {showDuration && durationMs !== null && durationMs > 0 && (
                  <p className="mt-1 text-2xs text-neutral-400">
                    Duração: {formatDuration(Math.abs(durationMs))}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
);

Timeline.displayName = "Timeline";

export { Timeline };
