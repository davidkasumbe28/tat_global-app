import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function ShippingDeliveryConditions({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="bg-background rounded-lg border border-border p-8">
      <Skeleton emuted={emuted}>
        <h2 className="text-2xl font-bold mb-6">Conditions de Livraison</h2>
      </Skeleton>
      <div className="space-y-4">
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-2">Frais de Port</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Les frais de port varient selon la zone de livraison. Les
              commandes dépassant 50,000 FCF bénéficient d'une réduction de 10%
              sur les frais.
            </p>
          </Skeleton>
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-2">Délais Garantis</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Nos délais sont donnés à titre informatif. Tout délai excessif
              donne droit à un remboursement des frais de port.
            </p>
          </Skeleton>
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-2">Assurance Colis</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Tous les colis sont automatiquement assurés lors du transport. Les
              endommagements seront remboursés ou remplacés.
            </p>
          </Skeleton>
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-2">Retour Gratuit</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Les retours pour défaut de qualité sont gratuits. Consultez notre
              politique de retour complète en ligne.
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
