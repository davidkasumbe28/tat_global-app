"use client";

import { useCart } from "@/hooks/use-cart";
import { TAX } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface CartSummaryProps {
  emuted?: boolean;
}

export default function CartSummary({ emuted = true }: CartSummaryProps) {
  const { cartTotal, summaryCart, isloadingCart } = useCart();
  const { shipping, tax, total } = summaryCart();

  return (
    <div className="lg:col-span-1">
      <div
        className={cn(
          " border border-border shadow-xs shadow-foreground rounded-lg p-6 space-y-4 sticky top-20",
          emuted ? "bg-transparent animate-pulse" : "bg-background",
        )}
      >
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Résumé</h2>
        </Skeleton>
        <div
          className={cn(
            "bg-accent p-4 rounded-lg flex gap-2 items-start",
            emuted && "animate-pulse",
          )}
        >
          <Truck
            className={cn(
              "w-5 h-5 flex-shrink-0 mt-0.5",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded animate-pulse"
                : "text-foreground",
            )}
          />
          <Skeleton emuted={emuted || isloadingCart}>
            <p className="text-sm">
              {shipping === 0
                ? "Livraison gratuite"
                : `Livraison gratuite à partir de 50€`}
            </p>
          </Skeleton>
        </div>

        <div className="space-y-2 text-sm border-t border-b border-border py-4">
          <div className="flex justify-between">
            <Skeleton emuted={emuted}>
              <span>Sous-total</span>
            </Skeleton>
            <Skeleton emuted={emuted || isloadingCart}>
              <span>{cartTotal.toFixed(2)}$</span>
            </Skeleton>
          </div>
          <div className="flex justify-between">
            <Skeleton emuted={emuted}>
              <span>Livraison</span>
            </Skeleton>
            <Skeleton emuted={emuted || isloadingCart}>
              <span
                className={
                  !emuted && !isloadingCart && shipping === 0
                    ? "text-green-600 font-semibold"
                    : ""
                }
              >
                {shipping === 0 ? "Gratuit" : `${shipping.toFixed(2)}$`}
              </span>
            </Skeleton>
          </div>
          <div className="flex justify-between">
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

        <div className="flex max-md:flex-col lg:flex-col gap-4 w-full items-center ">
          <Link
            href={emuted || isloadingCart ? "#" : APP.private.checkout}
            className="w-full"
          >
            <Button
              variant={emuted || isloadingCart ? "emuted" : "default"}
              className={cn(
                "w-full py-6",
                !emuted &&
                  !isloadingCart &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Procéder au paiement
            </Button>
          </Link>

          <Link
            href={emuted || isloadingCart ? "#" : APP.public.catalogue}
            className="w-full"
          >
            <Button
              variant={emuted || isloadingCart ? "emuted" : "outline"}
              className={cn(
                "w-full",
                !emuted && !isloadingCart && "bg-transparent",
              )}
            >
              Continuer les achats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
