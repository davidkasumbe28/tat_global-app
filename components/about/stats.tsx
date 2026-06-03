import about from "@/lib/data/raw/about";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function Stats({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {about.stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "bg-foreground rounded-lg p-8 text-center",
            emuted ? "animate-pulse text-muted-foreground" : " text-background",
          )}
        >
          <Skeleton emuted={emuted}>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className="text-lg">{stat.label}</p>
          </Skeleton>
        </div>
      ))}
    </div>
  );
}
