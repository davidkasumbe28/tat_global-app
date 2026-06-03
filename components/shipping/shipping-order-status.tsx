import shipping from "@/lib/data/raw/shipping";
import { cn } from "@/lib/utils/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ShippingOrderStatus({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="mb-16">
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-8">Statuts de Commande</h2>
      </Skeleton>
      <div className="grid md:grid-cols-4 gap-4">
        {shipping.statuses.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card
              key={i}
              emuted={emuted}
              className={cn(item.color, "p-6 text-center")}
            >
              <Icon
                className={cn(
                  "w-8 h-8 mx-auto mb-2",
                  emuted
                    ? "text-muted-foreground bg-muted-foreground animate-pulse rounded"
                    : "text-gray-700",
                )}
              />
              <Skeleton emuted={emuted}>
                <p className={cn("font-medium", !emuted && "text-black")}>
                  {item.status}
                </p>
              </Skeleton>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
