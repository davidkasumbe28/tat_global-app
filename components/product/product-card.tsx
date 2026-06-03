"use client";

import FavoriteButton from "@/components/favorite/favorite-button";
import type { Product } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Eye, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { APP } from "@/lib/data/raw/routes";

interface ProductCardProps {
  product: Product;
  emuted?: boolean;
}

export default function ProductCard({
  product,
  emuted = true,
}: ProductCardProps) {
  const categories = [
    { label: "Tous", value: "all" },
    { label: "Vêtements", value: "clothing" },
    { label: "Chaussures", value: "shoes" },
    { label: "Parfums", value: "perfumes" },
    { label: "Autres", value: "other" },
  ];

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative w-full h-48 bg-gray-100">
        <img
          src={
            emuted
              ? "/placeholder.svg?height=200&width=200&query=product"
              : product.image ||
                "/placeholder.svg?height=200&width=200&query=product"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavoriteButton
            productId={product?.id}
            className={cn("shadow-lg ", !emuted && "bg-background")}
            emuted={emuted}
          />
        </div>
      </div>

      <div className="p-4">
        <Skeleton emuted={emuted}>
          <span
            className={cn(
              "text-xs uppercase tracking-wide",
              !emuted && "text-foreground",
            )}
          >
            {categories.map((category) => {
              if (category.value == product.category) return category.label;
            })}
          </span>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <h3 className="font-semibold text-lg mt-2 mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Skeleton>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 ",
                  emuted
                    ? "text-muted-foreground fill-muted-foreground animate-pulse"
                    : i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "text-gray-300",
                )}
              />
            ))}
          </div>
          <Skeleton emuted={emuted}>
            <span className={cn("text-sm", !emuted && "text-gray-500")}>
              ({product.rating})
            </span>
          </Skeleton>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton emuted={emuted}>
            <span
              className={cn(
                "text-2xl font-bold ",
                !emuted && "text-foreground",
              )}
            >
              {parseInt(product?.price?.toString())?.toFixed(2)}$
            </span>
          </Skeleton>
          <Link href={emuted ? "#" : APP.public.product + "/" + product.id}>
            <Button
              size="sm"
              variant={emuted ? "emuted" : "default"}
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
