"use client";

import FavoriteProductCard from "@/components/favorite/favorite-product-card";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function FavoritesPage() {
  const { isloading } = useTheme();
  const {
    favoritesProducts,
    loadFavoritesProduct,
    isloadingFavorites,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useFavorites();

  const ITEMS_PER_PAGE: number = 8;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    loadFavoritesProduct(ITEMS_PER_PAGE.toString());
  }, [currentPage]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-6 flex items-center justify-start gap-4">
        <Link href={isloading ? "#" : APP.private.account}>
          <Button variant={isloading ? "emuted" : "outline"}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Skeleton emuted={isloading}>
          <h1 className="text-4xl font-bold ">Mes Favoris</h1>
        </Skeleton>
      </div>

      {isloadingFavorites ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Chargement des favoris...
            </p>
          </Skeleton>
        </div>
      ) : favoritesProducts.length === 0 && !isloadingFavorites ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Aucun favori trouvé.
            </p>
          </Skeleton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoritesProducts.map((item, index) => (
            <FavoriteProductCard key={index} item={item} emuted={isloading} />
          ))}
        </div>
      )}

      <div className="space-y-8 py-4">
        {totalPages > 1 && !isloadingFavorites && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            emuted={isloading || isloadingFavorites}
          />
        )}
        <div className="text-end">
          <Link
            href={isloading || isloadingFavorites ? "#" : APP.public.catalogue}
          >
            <Button
              variant={isloading || isloadingFavorites ? "emuted" : "default"}
              className={cn(
                !isloading &&
                  !isloadingFavorites &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Parcourir le catalogue
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
