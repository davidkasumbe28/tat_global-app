import { cn } from "@/lib/utils/utils";

function Skeleton({
  className,
  emuted = true,
  ...props
}: React.ComponentProps<"div"> & { emuted?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        emuted &&
          "bg-muted-foreground hover:bg-muted-foreground text-muted-foreground hover:text-muted-foreground animate-pulse rounded-md w-auto",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
