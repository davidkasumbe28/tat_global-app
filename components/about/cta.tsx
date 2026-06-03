import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { APP } from "@/lib/data/raw/routes";

export default function Cta({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-12 text-center",
        emuted ? "bg-transparent animate-pulse" : "bg-accent",
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-4">Rejoignez Notre Communauté</h2>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p
          className={cn(
            "mb-6",
            emuted ? "text-muted-foreground" : "text-gray-500 ",
          )}
        >
          Découvrez notre collection exclusive et bénéficiez d'offres spéciales
        </p>
      </Skeleton>
      <Link href={emuted || isloading ? "#" : APP.public.catalogue}>
        <Button
          variant={emuted || isloading ? "emuted" : "default"}
          className={cn(
            " text-lg px-8 py-3",
            !emuted &&
              !isloading &&
              "bg-foreground hover:bg-primary-dark text-background",
          )}
        >
          Commencer à Explorer
        </Button>
      </Link>
    </div>
  );
}
