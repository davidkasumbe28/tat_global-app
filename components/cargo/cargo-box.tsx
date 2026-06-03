import cargo from "@/lib/data/raw/cargo";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function CargoBox({
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
          "bg-orange-50 rounded-lg border border-orange-200 p-8 mb-12",
          emuted && "animate-pulse text-muted-foreground",
        )}
      >
        <Skeleton emuted={emuted}>
          <h2 className="text-2xl text-black font-bold mb-8">
            Destinations Disponibles
          </h2>
        </Skeleton>
        <div className="grid md:grid-cols-2 gap-6">
          {cargo.destinations.map((dest, i) => (
            <div
              key={i}
              className={cn(
                "p-6 border border-border rounded-lg hover:shadow-lg shadow-gray transition",
                emuted
                  ? "bg-transparent animate-pulse text-muted-foreground"
                  : "bg-background ",
              )}
            >
              <Skeleton emuted={emuted}>
                <h3 className="font-bold text-lg mb-2">{dest.region}</h3>
              </Skeleton>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm", !emuted && "text-gray-500")}>
                  {dest.countries}
                </p>
              </Skeleton>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href={emuted || isloading ? "#" : "/cargo/book"}>
          <Button
            variant={emuted || isloading ? "emuted" : "outline"}
            className={cn(
              "px-8 py-3",
              !emuted && !isloading && "bg-orange-600 text-background",
            )}
          >
            Réserver un Envoi
          </Button>
        </Link>
      </div>
    </>
  );
}
