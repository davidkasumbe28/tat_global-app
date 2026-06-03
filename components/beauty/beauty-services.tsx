import beauty from "@/lib/data/raw/beauty";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";

export default function BeautyServices({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      {beauty.services.map((service, i) => {
        const Icon = service.icon;
        return (
          <Card
            key={i}
            emuted={emuted}
            className="p-8 text-center hover:shadow-lg transition"
          >
            <Icon
              className={cn(
                "w-12 h-12 mx-auto mb-4",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-foreground"
              )}
            />
            <Skeleton emuted={emuted}>
              <h3 className="font-bold text-lg mb-2">{service.title}</h3>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                {service.description}
              </p>
            </Skeleton>
          </Card>
        );
      })}
    </div>
  );
}
