import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function CustomOrdersHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-4xl font-bold mb-4">Commandes Personnalisées</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className={cn("text-xl", !emuted && "text-gray-500")}>
          Avez-vous un article spécial ou un service à nous proposer?
          Envoyez-nous votre demande et recevez un devis
        </p>
      </Skeleton>
    </div>
  );
}
