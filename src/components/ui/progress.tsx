import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export function Progress({
  value,
  indicatorColor = "bg-blue-500",
  className,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-slate-800",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all duration-500", indicatorColor)}
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </div>
  );
}
