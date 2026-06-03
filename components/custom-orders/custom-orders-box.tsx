import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function CustomOrdersBox({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-12 text-center",
        emuted ? "text-muted-foreground animate-pulse" : " text-white"
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-3xl font-bold mb-4">Nous sommes Disponibles</h2>
      </Skeleton>
      <Skeleton emuted={emuted}>
        <p className="text-lg mb-8 opacity-90">
          Proposez un article spécial ou un service précis, nous somme à votre
          disposition
        </p>
      </Skeleton>
      <Link href={emuted || isloading ? "#" : "/custom-orders/book"}>
        <Button
          variant={emuted || isloading ? "emuted" : "default"}
          className={cn(
            !emuted && !isloading && "bg-white text-blue-600 hover:bg-gray-100"
          )}
        >
          Commander Maintenant
        </Button>
      </Link>
    </div>
  );
}
