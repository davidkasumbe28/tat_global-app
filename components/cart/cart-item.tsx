"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CartItem as CartProductItem } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

export default function CartItem({
  item,
  emuted = true,
  setSuccess,
}: {
  item: CartProductItem;
  emuted?: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { isLoggedIn } = useAuth();
  const { removeFromCart, updateCartQuantity, loadCart } = useCart();

  const [loading, setLoading] = useState(false);

  const handleDecrementQuantity = async (id: number, quantity: number) => {
    setLoading(true);
    setSuccess("");
    await updateCartQuantity(isLoggedIn, id, quantity - 1);
    if(!isLoggedIn) await loadCart();
    setSuccess("success");
    setLoading(false);
  };

  const handleIncrementQuantity = async (id: number, quantity: number) => {
    setLoading(true);
    setSuccess("");
    await updateCartQuantity(isLoggedIn, id, quantity + 1);
    if(!isLoggedIn) await loadCart();
    setSuccess("success");
    setLoading(false);
  };

  const handleDeleteCartItem = async (id: number) => {
    setLoading(true);
    setSuccess("");
    await removeFromCart(isLoggedIn, id);
    if(!isLoggedIn) await loadCart();
    setSuccess("success");
    setLoading(false);
  };

  return (
    <div
      key={item.id}
      className={cn(
        " border border-border shadow-xs shadow-accent rounded-lg p-4 flex gap-4",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
        <img
          src={
            emuted
              ? "/placeholder.svg"
              : item?.product?.image || "/placeholder.svg"
          }
          alt={item?.product?.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-semibold text-lg">{item?.product?.name}</h3>
          </Skeleton>
          {(item?.color || item?.size) && (
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                {item?.color && `Couleur: ${item?.color}`}
                {item?.color && item?.size && " | "}
                {item?.size && `Taille: ${item?.size}`}
              </p>
            </Skeleton>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton emuted={emuted || loading}>
            <span
              className={cn(
                "text-xl font-bold ",
                !emuted && !loading && "text-foreground",
              )}
            >
              {((item.product?.price || 0) * item?.quantity)?.toFixed(2)}$
            </span>
          </Skeleton>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-accent shadow-xs shadow-accent rounded-lg overflow-hidden">
              <button
                onClick={() => handleDecrementQuantity(item.id, item.quantity)}
                className={cn(
                  "p-1 transition",
                  emuted || loading
                    ? "bg-muted-foreground text-muted-foreground"
                    : "hover:bg-accent",
                )}
                disabled={item.quantity == 1 || loading || emuted}
              >
                <Minus className="w-4 h-4" />
              </button>
              <Skeleton emuted={emuted || loading}>
                <span className="px-3 py-1">{item.quantity}</span>
              </Skeleton>
              <button
                onClick={() => handleIncrementQuantity(item.id, item.quantity)}
                className={cn(
                  "p-1 transition",
                  emuted || loading
                    ? "bg-muted-foreground text-muted-foreground"
                    : "hover:bg-accent",
                )}
                disabled={
                  item.quantity == item.product?.stock || loading || emuted
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleDeleteCartItem(item.id)}
              className={cn(
                "p-2 rounded-lg transition",
                emuted || loading
                  ? "bg-muted-foreground text-muted-foreground"
                  : "text-destructive hover:bg-red-50",
              )}
              disabled={loading || emuted}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
