import * as React from "react";
import {
  MapPin,
  CheckCircle2,
  Send,
  PackageCheck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CaptureStatus =
  | "localizado"
  | "capturado"
  | "enviado"
  | "entregue"
  | "falha-captura"
  | "falha-entrega";

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  className: string;
}

const STATUS_MAP: Record<CaptureStatus, StatusConfig> = {
  localizado: {
    label: "Localizado",
    icon: MapPin,
    className:
      "bg-info-light text-info-foreground ring-info/20",
  },
  capturado: {
    label: "Capturado",
    icon: CheckCircle2,
    className:
      "bg-success-light text-success-foreground ring-success/20",
  },
  enviado: {
    label: "Enviado",
    icon: Send,
    className:
      "bg-brand-subtle text-brand ring-brand/20",
  },
  entregue: {
    label: "Entregue",
    icon: PackageCheck,
    className:
      "bg-success-muted text-success-foreground ring-success/20",
  },
  "falha-captura": {
    label: "Falha na captura",
    icon: XCircle,
    className:
      "bg-danger-light text-danger-foreground ring-danger/20",
  },
  "falha-entrega": {
    label: "Falha na entrega",
    icon: AlertTriangle,
    className:
      "bg-warning-light text-warning-foreground ring-warning/20",
  },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: CaptureStatus;
  size?: "sm" | "md";
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ state, size = "md", className, ...props }, ref) => {
    const config = STATUS_MAP[state];
    const Icon = config.icon;

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
          size === "md" && "px-2.5 py-0.5 text-xs",
          size === "sm" && "px-2 py-px text-2xs",
          config.className,
          className
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "shrink-0",
            size === "md" ? "h-3 w-3" : "h-2.5 w-2.5"
          )}
        />
        {config.label}
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
