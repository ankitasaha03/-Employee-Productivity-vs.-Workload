import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-500/15 text-blue-400 border-blue-500/30",
        secondary:
          "border-transparent bg-slate-800 text-slate-300 border-slate-700",
        destructive:
          "border-rose-500/30 bg-rose-500/15 text-rose-400",
        warning:
          "border-amber-500/30 bg-amber-500/15 text-amber-300",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
        outline: "text-slate-300 border-slate-700",
        critical:
          "border-red-500/40 bg-red-950/60 text-red-300 animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
