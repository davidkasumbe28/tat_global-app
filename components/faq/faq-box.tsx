import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils/utils";
import { APP } from "@/lib/data/raw/routes";

export default function FAQBox({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <div
      className={cn(
        "mt-16 p-12 bg-primary rounded-lg text-center",
        emuted && "animate-pulse text-muted-foreground"
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-2xl font-bold mb-4">
          Vous n'avez pas trouvé la réponse?
        </h2>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className="mb-6">
          Contactez notre équipe support qui vous répondra dans les 24 heures.
        </p>
      </Skeleton>
      <Link href={emuted || isloading ? "#" : APP.public.contact}>
        <Button
          variant={emuted || isloading ? "emuted" : "default"}
          className={cn(
            !emuted &&
              !isloading &&
              "bg-foreground text-background hover:bg-muted-foreground"
          )}
        >
          Nous Contacter
        </Button>
      </Link>
    </div>
  );
}
