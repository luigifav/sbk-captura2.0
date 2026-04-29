import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/* ─── Ilustrações SVG inline ─────────────────────────────── */

const illustrations = {
  empty: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="15" y="10" width="90" height="60" rx="4" fill="#f5f5f5" stroke="#e5e5e5" strokeWidth="1" />
      <rect x="25" y="22" width="40" height="4" rx="2" fill="#d4d4d4" />
      <rect x="25" y="30" width="60" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="25" y="37" width="50" height="3" rx="1.5" fill="#e5e5e5" />
      <rect x="25" y="44" width="55" height="3" rx="1.5" fill="#e5e5e5" />
      <circle cx="88" cy="56" r="14" fill="#e6f0ef" />
      <path d="M84 56h8M88 52v8" stroke="#023631" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="52" cy="36" r="22" fill="#f5f5f5" stroke="#e5e5e5" strokeWidth="1.5" />
      <circle cx="52" cy="36" r="14" fill="#e6f0ef" />
      <path d="M52 29v14M45 36h14" stroke="#023631" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="69" y1="53" x2="82" y2="66" stroke="#d4d4d4" strokeWidth="3" strokeLinecap="round" />
      <rect x="78" y="60" width="18" height="8" rx="2" transform="rotate(45 78 60)" fill="#e5e5e5" />
    </svg>
  ),
  error: (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="60" cy="38" r="24" fill="#fef2f2" stroke="#fee2e2" strokeWidth="1.5" />
      <path d="M60 26v16" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="48" r="1.5" fill="#dc2626" />
    </svg>
  ),
  "no-data": (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="10" y="50" width="100" height="1" fill="#e5e5e5" />
      <rect x="20" y="30" width="12" height="21" rx="2" fill="#e6f0ef" />
      <rect x="38" y="20" width="12" height="31" rx="2" fill="#023631" opacity="0.3" />
      <rect x="56" y="38" width="12" height="13" rx="2" fill="#e6f0ef" />
      <rect x="74" y="14" width="12" height="37" rx="2" fill="#023631" opacity="0.6" />
      <rect x="92" y="26" width="12" height="25" rx="2" fill="#e6f0ef" />
      <line x1="50" y1="10" x2="86" y2="46" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="86" y1="10" x2="50" y2="46" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
} as const;

export type EmptyStateVariant = keyof typeof illustrations;

export interface EmptyStateCTA {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline";
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  illustration?: EmptyStateVariant;
  title: string;
  description?: string;
  cta?: EmptyStateCTA;
  compact?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      illustration = "empty",
      title,
      description,
      cta,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          compact ? "py-8 px-4" : "py-16 px-6",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "mb-4",
            compact ? "h-16 w-24" : "h-20 w-32"
          )}
        >
          {illustrations[illustration]}
        </div>

        <h3
          className={cn(
            "font-semibold text-neutral-900",
            compact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={cn(
              "mt-1 text-neutral-500",
              compact ? "text-xs" : "text-sm"
            )}
          >
            {description}
          </p>
        )}

        {cta && (
          <Button
            variant={cta.variant === "outline" ? "outline" : "default"}
            size={compact ? "sm" : "default"}
            onClick={cta.onClick}
            className={cn(
              compact ? "mt-3" : "mt-5",
              cta.variant !== "outline" &&
                "bg-brand hover:bg-brand-hover text-brand-foreground"
            )}
          >
            {cta.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
