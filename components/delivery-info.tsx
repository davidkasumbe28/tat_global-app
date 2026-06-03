import { cn } from "@/lib/utils/utils";
import { ShieldCheck, Truck } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function DeliveryInfo({ emuted = true }: { emuted: boolean }) {
  return (
    <div
      className={cn(
        "bg-accent p-4 rounded-lg space-y-3",
        emuted && "animate-pulse",
      )}
    >
      <div className="flex gap-3">
        <Truck
          className={cn(
            "w-5 h-5 flex-shrink-0 mt-1",
            emuted
              ? "text-muted-foreground bg-muted-foreground animate-pulse rounded"
              : "text-foreground",
          )}
        />
        <div>
          <Skeleton emuted={emuted}>
            <p className="font-semibold">Livraison gratuite</p>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn("text-sm", !emuted && "text-gray-500")}>
              À partir de 50$
            </p>
          </Skeleton>
        </div>
      </div>
      <div className="flex gap-3">
        <ShieldCheck
          className={cn(
            "w-5 h-5 flex-shrink-0 mt-1",
            emuted
              ? "text-muted-foreground bg-muted-foreground animate-pulse rounded"
              : "text-foreground",
          )}
        />
        <div>
          <Skeleton emuted={emuted}>
            <p className="font-semibold">Garantie 30 jours</p>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn("text-sm", !emuted && "text-gray-500")}>
              Retour gratuit et facile
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
