import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { APP } from "@/lib/data/raw/routes";

export default function Hero({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <section
      className={cn(
        "bg-gradient-to-br from-transparent to-foreground py-28 ",
        emuted && "animate-pulse",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Skeleton emuted={emuted}>
          <h1
            className={cn(
              "text-4xl sm:text-5xl font-bold mb-6 text-balance",
              !emuted && "text-background",
            )}
          >
            Bienvenue chez TAT GLOBAL
          </h1>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p
            className={cn(
              "text-lg mb-8 text-balance",
              !emuted && "text-accent",
            )}
          >
            Découvrez notre collection exclusive de vêtements, chaussures et
            parfums de qualité
          </p>
        </Skeleton>

        <Link href={isloading || emuted ? "#" : APP.public.collection}>
          <button
            className={cn(
              " px-8 py-3 rounded-lg  transition",
              isloading || emuted
                ? "bg-muted-foreground text-muted-foreground animate-pulse"
                : "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            Découvrir nos Collections
          </button>
        </Link>
      </div>
    </section>
  );
}
