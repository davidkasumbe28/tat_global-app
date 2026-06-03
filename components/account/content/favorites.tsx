"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useEffect } from "react";
import FavoriteProductCard from "../../favorite/favorite-product-card";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

export default function Favorites({ emuted = true }: { emuted?: boolean }) {
  const {
    favoritesProducts,
    loadFavoritesProduct,
    isloadingFavorites,
    currentPage,
  } = useFavorites();

  const ITEMS_PER_PAGE: number = 6;

  useEffect(() => {
    loadFavoritesProduct(ITEMS_PER_PAGE.toString());
  }, [currentPage]);

  return (
    <div
      className={cn(
        " border border-border rounded-lg p-6 space-y-4",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-2xl font-bold">Mes Favoris</h2>
        </Skeleton>
        <Link href={APP.private.favorites}>
          <Button variant="outline">Voir plus</Button>
        </Link>
      </div>

      {isloadingFavorites ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Chargement des favoris...
            </p>
          </Skeleton>
        </div>
      ) : favoritesProducts.length === 0 && !isloadingFavorites ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Aucun favori trouvé.
            </p>
          </Skeleton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoritesProducts.map((item, index) => (
            <FavoriteProductCard key={index} item={item} emuted={emuted} />
          ))}
        </div>
      )}

      <div className="space-y-8 py-4">
        <div className="text-end">
          <Link
            href={emuted || isloadingFavorites ? "#" : APP.public.catalogue}
          >
            <Button
              variant={emuted || isloadingFavorites ? "emuted" : "default"}
              className={cn(
                !emuted &&
                  !isloadingFavorites &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Parcourir le catalogue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
