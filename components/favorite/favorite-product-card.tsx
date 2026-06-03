"use client";

import FavoriteButton from "@/components/favorite/favorite-button";
import type { Favorite } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";

interface FavoriteProductCardProps {
  item: Favorite;
  emuted?: boolean;
}

export default function FavoriteProductCard({
  item,
  emuted = true,
}: FavoriteProductCardProps) {

  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-md transition group">
      <div
        className={cn(
          "relative w-full h-48 rounded overflow-hidden ",
          emuted
            ? "bg-muted-foreground text-muted-foreground animate-pulse"
            : "bg-gray-100",
        )}
      >
        <img
          src={
            emuted
              ? "/placeholder.svg?height=200&width=200&query=product"
              : item.product?.image ||
                "/placeholder.svg?height=200&width=200&query=product"
          }
          alt={item.product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div
          className={cn(
            "absolute top-2 right-2 opacity-0 transition-opacity",
            "group-hover:opacity-100",
          )}
        >
          <FavoriteButton
            productId={item.product?.id || 0}
            emuted={emuted}
            className="bg-background shadow-lg"
          />
        </div>
      </div>
      <div className="p-2">
        <Skeleton emuted={emuted}>
          <span
            className={cn(
              "text-xs uppercase tracking-wide",
              !emuted && "text-foreground",
            )}
          >
            {CATEGORIES_PRODUCT.map((category) => {
              if (category.value === item.product?.category)
                return category.label;
            })}
          </span>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <h3 className="font-semibold text-lg mt-2 mb-1 line-clamp-2">
            {item.product?.name}
          </h3>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p className={cn("font-bold mt-2", !emuted && "text-foreground")}>
            {parseInt(item.product?.price?.toString() || "0")?.toFixed(2)}$
          </p>
        </Skeleton>
        <div className="flex justify-end items-center mt-3 w-full">
          <Link href={emuted ? "#" : APP.private.favorites + "/" + item.id}>
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
