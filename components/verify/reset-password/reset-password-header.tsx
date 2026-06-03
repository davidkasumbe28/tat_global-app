import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { RotateCcw } from "lucide-react";

export default function ResetPasswordHeader({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mx-auto mb-4",
          emuted && "animate-pulse",
        )}
      >
        <RotateCcw
          className={cn(
            "w-6 h-6",
            emuted
              ? "text-muted-foreground bg-muted-foreground rounded"
              : " text-background",
          )}
        />
      </div>
      <Skeleton emuted={emuted}>
        <h1 className="text-3xl font-bold">Réinitialiser le mot de passe</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("mt-2", !emuted && "text-gray-500")}>
          Réinitialiser le mot de passe de votre compte TAT GLOBAL
        </p>
      </Skeleton>
    </div>
  );
}
