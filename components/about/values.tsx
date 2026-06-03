import about from "@/lib/data/raw/about";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function Values({ emuted = true }: { emuted?: boolean }) {
  return (
    <div
      className={cn(
        "bg-background rounded-lg border border-border p-12 mb-16",
        emuted && "bg-transparent animate-pulse",
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-12 text-center">Nos Valeurs</h2>
      </Skeleton>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {about.values.map((value, index) => (
          <div key={index} className="text-center">
            <value.icon
              className={cn(
                "w-12 h-12 mx-auto mb-4",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-foreground",
              )}
            />
            <Skeleton emuted={emuted}>
              <h3 className="font-bold text-lg mb-2">{value.label}</h3>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p
                className={cn(
                  emuted ? "text-muted-foreground" : "text-gray-500",
                )}
              >
                {value.value}
              </p>
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}
