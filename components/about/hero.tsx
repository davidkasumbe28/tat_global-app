import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function Hero({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="mb-16 text-center">
      <Skeleton emuted={emuted}>
        <h1 className="text-5xl font-bold mb-4">À Propos de TAT GLOBAL</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p
          className={cn(
            "text-xl",
            emuted ? "text-muted-foreground" : "text-gray-500"
          )}
        >
          Votre partenaire de confiance pour la mode, les chaussures et les
          parfums de qualité
        </p>
      </Skeleton>
    </div>
  );
}
