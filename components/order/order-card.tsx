"use client";

import { Order } from "@/lib/@types/types";
import { ORDER_STATUSES } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { StatusOrder } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

interface AccountOrderCardProps {
  item: Order;
  emuted?: boolean;
}

export default function AccountOrderCard({
  item,
  emuted = true,
}: AccountOrderCardProps) {
  return (
    <div
      key={item.id}
      className="border border-border rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-row items-center justify-between gap-10">
          <div>
            <Skeleton emuted={emuted}>
              <p className="font-semibold text-lg">{item.orderNumber}</p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                {formatDate(new Date(item.createdAt))}
              </p>
            </Skeleton>
          </div>

          <div className="text-right">
            <Skeleton emuted={emuted}>
              <p
                className={cn(
                  "font-bold text-lg",
                  !emuted && "text-foreground",
                )}
              >
                {item.totalAmount.toFixed(2)}$
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm", !emuted && "text-gray-500")}>
                {item.cart?._count.cartItems}{" "}
                {(item.cart?._count.cartItems || 0) > 1
                  ? "articles"
                  : "article"}
              </p>
            </Skeleton>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <Skeleton emuted={emuted}>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold ",
                !emuted &&
                  (item?.status === StatusOrder.DELIVERED
                    ? "bg-green-100 text-green-700"
                    : item?.status === StatusOrder.PENDING
                      ? "bg-blue-100 text-blue-700"
                      : item?.status === StatusOrder.CANCELLED
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"),
              )}
            >
              {ORDER_STATUSES.map((status) => {
                if (status.value === item.status) return status.label;
              })}
            </span>
          </Skeleton>
          <Link href={emuted ? "#" : APP.private.orders + "/" + item.id}>
            <Button
              variant={emuted ? "emuted" : "default"}
              size="sm"
              className={cn(
                !emuted &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              <Eye />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
