import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

export default function BeautyBox({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "bg-purple-50 rounded-lg border border-purple-200 p-12",
          emuted && "animate-pulse text-muted-foreground"
        )}
      >
        <Skeleton emuted={emuted}>
          <h2 className="text-2xl font-bold text-black mb-4">
            Où Souhaitez-vous Votre Service?
          </h2>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p className={cn("mb-8", !emuted && "text-gray-500")}>
            Nos professionnels interviennent au salon ou à votre domicile selon
            votre préférence
          </p>
        </Skeleton>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            emuted={emuted}
            className="p-6 cursor-pointer hover:shadow-lg transition border-2 border-transparent "
          >
            <Skeleton emuted={emuted}>
              <h3 className="font-bold text-lg mb-2">Au Salon</h3>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                Profitez de notre espace confortable et de nos équipements
                dernière génération
              </p>
            </Skeleton>
          </Card>
          <Card
            emuted={emuted}
            className="p-6 cursor-pointer hover:shadow-lg transition border-2 border-transparent "
          >
            <Skeleton emuted={emuted}>
              <h3 className="font-bold text-lg mb-2">À Domicile</h3>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                Nos professionnels se déplacent chez vous avec tout le matériel
                nécessaire
              </p>
            </Skeleton>
          </Card>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href={emuted || isloading ? "#" : "/beauty/book"}>
          <Button
            variant={emuted || isloading ? "emuted" : "outline"}
            className={cn(
              !emuted && !isloading && "bg-purple-600 text-background px-8 py-3"
            )}
          >
            Réserver un Rendez-vous
          </Button>
        </Link>
      </div>
    </>
  );
}
