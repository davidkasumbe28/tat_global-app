import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function EventBox({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-12 text-center",
        emuted ? "text-muted-foreground animate-pulse" : "text-white"
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-4">
          Packages Complets Disponibles
        </h2>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className="text-lg mb-8 opacity-90">
          Choisissez parmi nos packages préconçus ou créez votre propre
          combinaison de services
        </p>
      </Skeleton>
      <Link href={emuted || isloading ? "#" : "/events/book"}>
        <Button
          variant={emuted || isloading ? "emuted" : "default"}
          className={cn(
            !emuted && !isloading && "bg-white text-pink-600 hover:bg-gray-100"
          )}
        >
          Réserver Maintenant
        </Button>
      </Link>
    </div>
  );
}
