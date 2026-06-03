"use client";

import { CartItem } from "@/lib/@types/types";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils/utils";

interface OrderCartItemProps {
  item: CartItem;
  emuted?: boolean;
  loading: boolean;
}

export default function OrderCartItem({
  item,
  emuted = true,
  loading,
}: OrderCartItemProps) {
  return (
    <div key={item.id} className="border border-border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <Skeleton emuted={emuted || loading}>
            <p className="font-semibold text-lg">{item?.product?.name}</p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p
              className={cn("text-sm ", !emuted && !loading && "text-gray-500")}
            >
              SKU: {item?.product?.sku}
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p
              className={cn("text-sm ", !emuted && !loading && "text-gray-500")}
            >
              {item.color} - Taille: {item.size}
            </p>
          </Skeleton>
        </div>
        <div className="text-right">
          <Skeleton emuted={emuted || loading}>
            <p className="font-bold">
              {((item?.product?.price || 0) * item.quantity).toFixed(2)} $
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p
              className={cn("text-sm ", !emuted && !loading && "text-gray-500")}
            >
              {item.quantity} ×{" "}
              {parseFloat(item?.product?.price?.toString() || "0")?.toFixed(
                2,
              ) || 0.0}{" "}
              $
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
