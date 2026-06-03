import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";

export default function CargoHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-4xl font-bold mb-4">Service Cargo</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("text-xl", !emuted && "text-gray-500")}>
          Livraison nationale et internationale vers plusieurs pays et villes
        </p>
      </Skeleton>
    </div>
  );
}
