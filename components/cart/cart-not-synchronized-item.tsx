"use client";

import { CartItem as CartProductItem } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";

export default function CartNotSynchronizedItem({
  item,
  emuted = true,
}: {
  item: CartProductItem;
  emuted?: boolean;
}) {
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
                {item?.color && "Couleur : " + item?.color}
                {item?.color && item?.size && " | "}
                {item?.size && "Taille : " + item?.size}
              </p>
            </Skeleton>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton emuted={emuted}>
            <span className={cn("text-sm", !emuted && "text-gray-500")}>
              Quantité : {item.quantity}
            </span>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <span
              className={cn("text-xl font-bold ", !emuted && "text-foreground")}
            >
              {((item.product?.price || 0) * item?.quantity)?.toFixed(2)}$
            </span>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
