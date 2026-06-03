"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils/utils";

interface ProgressProps extends React.ComponentProps<
  typeof ProgressPrimitive.Root
> {
  color?: string;
}

function Progress({
  className,
  value,
  color = "bg-blue-500",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { color?: string }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-foreground/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", color)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
