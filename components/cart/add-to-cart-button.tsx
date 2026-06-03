"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface AddToCartButtonProps {
  product: Product;
  size?: string;
  color?: string;
  className?: string;
  emuted?: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export default function AddToCartButton({
  product,
  size,
  color,
  className,
  emuted = true,
  setSuccess,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { isLoggedIn, user } = useAuth();
  const { cart, createCart, addToCart, isloadingCart, setIsloadingCart } =
    useCart();

  const handleAddToCart = async () => {
    setIsloadingCart(true);
    setSuccess("");
    if (!cart) await createCart(isLoggedIn, user?.id);
    await addToCart(
      isLoggedIn,
      cart?.id as number,
      product.id,
      quantity,
      size,
      color,
    );
    setTimeout(async () => {
      // await loadCart();
      setSuccess("Produit ajouté au panier!");
      setIsloadingCart(false);
      
    }, 2000);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center border border-border overflow-hidden rounded-lg">
        <button
          disabled={isloadingCart || emuted}
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={cn(
            "px-3 py-2 overflow-hidden transition",
            emuted || isloadingCart
              ? "bg-muted-foreground text-muted-foreground animate-pulse"
              : "hover:bg-accent",
          )}
        >
          -
        </button>
        <Skeleton emuted={emuted || isloadingCart}>
          <span className="px-4 py-2 border-l border-r border-border">
            {quantity}
          </span>
        </Skeleton>
        <button
          disabled={isloadingCart || emuted}
          onClick={() => {
            if (quantity < product.stock) setQuantity(quantity + 1);
          }}
          className={cn(
            "px-3 py-2 overflow-hidden transition",
            emuted || isloadingCart
              ? "bg-muted-foreground text-muted-foreground animate-pulse"
              : "hover:bg-accent",
          )}
        >
          +
        </button>
      </div>

      <Button
        disabled={isloadingCart || emuted}
        variant={isloadingCart || emuted ? "emuted" : "default"}
        onClick={handleAddToCart}
        className={cn(
          "flex-1 transition ",
          (!emuted || !isloadingCart) &&
            (isloadingCart
              ? "bg-green-600 hover:bg-green-700 text-foreground"
              : "bg-foreground hover:bg-primary-dark  text-background"),
        )}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isloadingCart ? "Ajouté!" : "Ajouter"}
      </Button>
    </div>
  );
}
