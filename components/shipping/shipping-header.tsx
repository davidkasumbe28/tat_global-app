import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function ShippingHeader({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-5xl font-bold mb-4">Informations de Livraison</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("text-xl", !emuted && "text-gray-500")}>
          Tout ce que vous devez savoir sur nos services et délais de livraison
        </p>
      </Skeleton>
    </div>
  );
}
