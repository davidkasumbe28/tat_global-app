import { cn } from "@/lib/utils/utils";

export default function ErrorInfo({
  emuted = true,
  info = "",
}: {
  emuted?: boolean;
  info?: string;
}) {
  if (info)
    return (
      <div
        className={cn(
          "p-4 text-sm",
          emuted
            ? "bg-muted-foreground text-muted-foreground"
            : "bg-red-50 border border-red-200 rounded-lg text-red-700",
        )}
      >
        {info}
      </div>
    );
}
