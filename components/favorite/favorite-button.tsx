"use client";

import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils/utils";
import { Heart } from "lucide-react";
import { useState } from "react";

interface FavoriteButtonProps {
  productId: number;
  className?: string;
  emuted?: boolean;
}

export default function FavoriteButton({
  productId,
  className,
  emuted = true,
}: FavoriteButtonProps) {
  const { isLoggedIn } = useAuth();
  const {
    isFavorite,
    favoriteId,
    addToFavorites,
    removeFromFavorites,
    setIsloadingFavorites,
    isloadingFavorites,
  } = useFavorites();

  const [favorite, setFavorite] = useState(false);
  const [id, setId] = useState<number | null>(null);

  isFavorite(productId).then((value) => setFavorite(value));
  favoriteId(productId).then((value) => setId(value));

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsloadingFavorites(true);
    if (favorite && !isloadingFavorites) {
      removeFromFavorites(isLoggedIn, id as number);
    } else {
      addToFavorites(isLoggedIn, productId);
    }
    setIsloadingFavorites(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isloadingFavorites || emuted}
      className={cn(
        "p-2 rounded-lg transition",
        favorite
          ? "bg-red-50 text-destructive"
          : "hover:bg-accent text-gray-500",
        className,
        (emuted || isloadingFavorites) &&
          "bg-muted-foreground text-muted-foreground hover:bg-muted-foreground animate-pulse",
      )}
      title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
    </button>
  );
}
