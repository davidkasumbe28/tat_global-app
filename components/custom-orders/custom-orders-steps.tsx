import { Card } from "../ui/card";
import steps from "@/lib/data/raw/custom-orders";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";

export default function CustomOrdersSteps({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-12 ">
      {steps.map((step, index) => (
        <Card
          key={index}
          className="p-8 hover:shadow-lg transition"
          emuted={emuted}
        >
          <step.icon
            className={cn(
              "w-12 h-12 mb-4",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-foreground"
            )}
          />
          <Skeleton emuted={emuted}>
            <h3 className="font-bold text-lg mb-2">{step.label}</h3>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>{step.description}</p>
          </Skeleton>
        </Card>
      ))}
    </div>
  );
}
