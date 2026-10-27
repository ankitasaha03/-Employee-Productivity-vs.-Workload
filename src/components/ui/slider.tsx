import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (val: number) => void;
  accentColor?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  className,
  accentColor = "accent-blue-500",
  ...props
}: SliderProps) {
  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className={cn(
          "w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          accentColor
        )}
        {...props}
      />
    </div>
  );
}
