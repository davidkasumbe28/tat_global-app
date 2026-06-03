import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function ContactHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-16">
      <Skeleton emuted={emuted}>
        <h1 className="text-5xl font-bold mb-4">Contactez-Nous</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p
          className={cn(
            "text-xl",
            emuted ? "text-muted-foreground" : "text-gray-500"
          )}
        >
          Nous sommes là pour répondre à vos questions et vous aider
        </p>
      </Skeleton>
    </div>
  );
}
