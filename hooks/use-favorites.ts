import { useStore } from "@/context/store-context";
import { FavoriteAuth } from "@/lib/@types/favorite.type";
import {
  handleCreateFavorites,
  handleReadFavoritesFavorite,
} from "@/lib/handlers/events-handlers/favorite-events";
import { useEffect, useState } from "react";

export function useFavorites() {
  const {
    favorites,
    setFavorites,
    favoritesProducts,
    setFavoritesProducts,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoriteId,
  } = useStore();

  const [isloadingFavorites, setIsloadingFavorites] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const synchronizedFavorites = async () => {
    try {
      setIsloadingFavorites(true);
      const favorites = localStorage.getItem("favorites");

      if (!favorites || favorites === null) {
        localStorage.removeItem("favorites");
        setIsloadingFavorites(false);
        return;
      }

      const localFavorites = JSON.parse(favorites);

      if (localFavorites?.items?.length === 0) {
        localStorage.removeItem("favorites");
        setIsloadingFavorites(false);
        return;
      }

      const productIds = localFavorites?.items?.map(
        (item: FavoriteAuth) => item.productId,
      );

      const res = await handleCreateFavorites({ productIds });

      if (res.error) {
        setIsloadingFavorites(false);
        return;
      }

      localStorage.removeItem("favorites");
      setFavorites(res.data);
      setIsloadingFavorites(false);
    } catch (err) {
      setFavorites([]);
      console.log("useFavorites synchronizedFavorites error : ", err);
    } finally {
      setIsloadingFavorites(false);
    }
  };

  const loadFavoritesProduct = async (limit: string) => {
    try {
      setIsloadingFavorites(true);
      const res = await handleReadFavoritesFavorite(
        currentPage.toString(),
        limit,
      );

      if (res.error) {
        setError(
          res.error ||
            "Une erreur est survenue lors de la récupération des produits favoris",
        );
        setFavoritesProducts([]);
        setIsloadingFavorites(false);
        return;
      }

      setFavoritesProducts(res.data.favorites);
      const totalPages = Math.ceil(res.data.total / parseInt(limit));
      setTotalPages(totalPages);
    } catch (err) {
      console.log("useFavorites loadFavoritesProduct error : ", err);
    } finally {
      setIsloadingFavorites(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setIsloadingFavorites(true);
      const favorites = localStorage.getItem("favorites");

      if (!favorites || favorites === null) {
        setFavorites([]);
        setIsloadingFavorites(false);
        return;
      }

      const localFavorites = JSON.parse(favorites);

      setFavorites(localFavorites?.items);
      setIsloadingFavorites(false);
    } catch (err) {
      setFavorites([]);
      console.log("useFavorites loadFavorites error : ", err);
    } finally {
      setIsloadingFavorites(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    favoritesProducts,
    addToFavorites,
    removeFromFavorites,
    synchronizedFavorites,
    loadFavorites,
    loadFavoritesProduct,
    isFavorite,
    favoriteId,
    isloadingFavorites,
    setIsloadingFavorites,
    currentPage,
    setCurrentPage,
    totalPages,
    error,
  };
}
