import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function Story({ emuted = true }: { emuted?: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
      <div>
        <Skeleton emuted={emuted}>
          <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p
            className={cn(
              " mb-4 leading-relaxed",
              emuted ? "text-muted-foreground" : "text-gray-500"
            )}
          >
            Depuis sa fondation en 2015, TAT GLOBAL s'est établie comme une
            marque de référence dans le commerce de mode en ligne. Notre mission
            est de rendre les produits de qualité accessibles à tous.
          </p>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p
            className={cn(
              "mb-4 leading-relaxed",
              emuted ? "text-muted-foreground" : "text-gray-500"
            )}
          >
            Nous avons grandi en mettant l'accent sur la satisfaction client, la
            qualité des produits et l'innovation dans le service. Aujourd'hui,
            nous servons des milliers de clients satisfaits dans le monde
            entier.
          </p>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p
            className={cn(
              "leading-relaxed",
              emuted ? "text-muted-foreground" : "text-gray-500"
            )}
          >
            Notre engagement envers l'excellence et la durabilité continue de
            définir notre approche de chaque produit que nous proposons.
          </p>
        </Skeleton>
      </div>
      <div
        className={cn(
          "bg-accent rounded-lg h-96 flex items-center justify-center",
          emuted && "animate-pulse"
        )}
      >
        <img
          src={emuted ? "/placeholder.svg" : "/tat-global-office-team.jpg"}
          alt="TAT GLOBAL"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
