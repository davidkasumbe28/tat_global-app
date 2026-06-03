import { cn } from "@/lib/utils/utils";
import { UserPlus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function SignupHeader({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="text-center mb-8">
      <div
        className={cn(
          "w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mx-auto mb-4",
          emuted && "animate-pulse"
        )}
      >
        <UserPlus
          className={cn(
            "w-6 h-6",
            emuted
              ? "text-muted-foreground bg-muted-foreground rounded"
              : "text-background"
          )}
        />
      </div>
      <Skeleton emuted={emuted}>
        <h1 className="text-3xl font-bold">Inscription</h1>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p
          className={cn(
            "mt-2",
            emuted ? "text-muted-foreground" : "text-gray-500"
          )}
        >
          Créez votre compte TAT GLOBAL
        </p>
      </Skeleton>
    </div>
  );
}
