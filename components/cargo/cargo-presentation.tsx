import cargo from "@/lib/data/raw/cargo";
import { cn } from "@/lib/utils/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function CargoPresentation({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12">
      {cargo.presentation.map((item, index) => (
        <Card
          key={index}
          emuted={emuted}
          className="p-8 text-center hover:shadow-lg transition"
        >
          <item.icon
            className={cn(
              "w-12 h-12  mx-auto mb-4",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-foreground",
            )}
          />
          <Skeleton emuted={emuted}>
            <h3 className="font-bold text-lg mb-2">{item.label}</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>{item.description}</p>
          </Skeleton>
        </Card>
      ))}
    </div>
  );
}
