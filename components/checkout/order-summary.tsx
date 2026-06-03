import { useCart } from "@/hooks/use-cart";
import { SHIPPING, TAX } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function OrderSummary({
  emuted = true,
  currentStep,
}: {
  emuted?: boolean;
  currentStep: string;
}) {
  const { cartTotal, summaryCart, isloadingCart } = useCart();

  const { shipping, tax, total } = summaryCart();

  return (
    <div className="lg:col-span-1">
      <div
        className={cn(
          "border border-border shadow-xs shadow-foreground rounded-lg p-6 space-y-4 sticky top-20",
          emuted ? "bg-transparent animate-pulse" : "bg-background",
        )}
      >
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Résumé de la commande</h2>
        </Skeleton>

        <div className="space-y-3 border-t border-b border-border py-4">
          <div className="flex justify-between text-sm">
            <Skeleton emuted={emuted}>
              <span>Sous-total</span>
            </Skeleton>
            <Skeleton emuted={emuted || isloadingCart}>
              <span>{cartTotal.toFixed(2)}$</span>
            </Skeleton>
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton emuted={emuted}>
              <span>Livraison</span>
            </Skeleton>
            <Skeleton emuted={emuted || isloadingCart}>
              {shipping === 0 ? (
                <span
                  className={cn(
                    " font-semibold",
                    !emuted && !isloadingCart && "text-green-600",
                  )}
                >
                  Gratuit
                </span>
              ) : (
                <span>{SHIPPING.toFixed(2)}$</span>
              )}
            </Skeleton>
          </div>
          <div className="flex justify-between text-sm">
            <Skeleton emuted={emuted}>
              <span>Taxes ({TAX * 100}%)</span>
            </Skeleton>
            <Skeleton emuted={emuted || isloadingCart}>
              <span>{tax?.toFixed(2)}$</span>
            </Skeleton>
          </div>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <Skeleton emuted={emuted}>
            <span>Total</span>
          </Skeleton>
          <Skeleton emuted={emuted || isloadingCart}>
            <span
              className={cn(!emuted && !isloadingCart && "text-foreground")}
            >
              {total.toFixed(2)}$
            </span>
          </Skeleton>
        </div>

        {currentStep === "confirmation" && (
          <div className="flex flex-col gap-2">
            <Link href={emuted ? "#" : APP.public.catalogue}>
              <Button
                variant={emuted ? "emuted" : "default"}
                className={cn(
                  "w-full",
                  !emuted &&
                    "bg-foreground text-background hover:bg-primary-dark",
                )}
              >
                Continuer les achats
              </Button>
            </Link>
            <Button
              variant={emuted || isloadingCart ? "emuted" : "outline"}
              className={cn(
                "w-full",
                !emuted &&
                  !isloadingCart &&
                  "text-destructive hover:text-destructive",
              )}
            >
              Annuler la commande
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
