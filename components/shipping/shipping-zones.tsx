import shipping from "@/lib/data/raw/shipping";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ShippingZones({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="mb-16">
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-8">
          Zones et Délais de Livraison
        </h2>
      </Skeleton>
      <div className="grid md:grid-cols-2 gap-6">
        {shipping.zones.map((zone, i) => (
          <Card
            key={i}
            emuted={emuted}
            className="p-6 hover:shadow-lg transition"
          >
            <Skeleton emuted={emuted}>
              <h3 className="font-bold text-lg mb-4">{zone.name}</h3>
            </Skeleton>
            <div className="space-y-2 text-sm">
              <Skeleton emuted={emuted}>
                <p>
                  <span className="font-medium">Délai:</span> {zone.delay}
                </p>
              </Skeleton>
              <Skeleton emuted={emuted}>
                <p>
                  <span className="font-medium">Tarif:</span> {zone.price}
                </p>
              </Skeleton>
              <Skeleton emuted={emuted}>
                <p>
                  <span className="font-medium">Zone:</span> {zone.coverage}
                </p>
              </Skeleton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
