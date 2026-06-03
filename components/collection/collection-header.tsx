import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";

export default function CollectionHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-12">
      <Skeleton emuted={emuted}>
        <h1 className="text-5xl font-bold mb-4">Nos Collections</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p
          className={cn(
            "text-xl",
            emuted ? "text-muted-foreground" : "text-gray-500"
          )}
        >
          Découvrez nos collections exclusives triées sur le volet
        </p>
      </Skeleton>
    </div>
  );
}
