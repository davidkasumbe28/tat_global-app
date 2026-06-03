"use client";

import { useCart } from "@/hooks/use-cart";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { RefreshCcw, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export default function CartButton({ emuted = true }: { emuted?: boolean }) {
  const { cartCount, isloadingCart, requiredSynchronized } = useCart();
  const pathname = usePathname();

  const enabled = (href: string) => {
    return pathname === href;
  };

  return (
    <Link
      href={isloadingCart || emuted ? "#" : APP.public.cart}
      className={cn(
        "relative p-2 hover:text-primary rounded-lg transition",
        enabled(APP.public.cart) && "hover:text-primary text-primary-dark",
        !emuted && "hover:bg-accent",
      )}
    >
      <Skeleton
        emuted={isloadingCart || emuted}
        className={cn((isloadingCart || emuted) && "p-1.5")}
      >
        <ShoppingCart className="w-5 h-5" />
        {(cartCount > 0 || requiredSynchronized) && (
          <span
            className={cn(
              "absolute top-0 right-0 text-xs rounded-full w-5 h-5 flex items-center justify-center",
              isloadingCart || emuted
                ? "bg-muted-foreground"
                : requiredSynchronized
                  ? "bg-warning text-background animate-bounce "
                  : "bg-destructive text-background",
            )}
          >
            {!requiredSynchronized ? cartCount : <RefreshCcw size={13} />}
          </span>
        )}
      </Skeleton>
    </Link>
  );
}
