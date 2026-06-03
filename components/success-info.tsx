import { cn } from "@/lib/utils/utils";

export default function SuccessInfo({
  emuted = true,
  info = "",
}: {
  emuted?: boolean;
  info?: string;
}) {
  return (
    <div
      className={cn(
        "p-4 text-sm",
        emuted
          ? "bg-muted-foreground text-muted-foreground"
          : "bg-green-50 border border-green-200 rounded-lg text-green-700",
      )}
    >
      {info}
    </div>
  );
}
