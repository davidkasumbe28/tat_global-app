import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleCreateFavorites(formData: Record<string, number[]>) {
  try {
    const res = await api.post(API.private.favoritesFavorite, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleCreateFavorite(formData: { productId: number }) {
  try {
    const res = await api.post(API.private.favorites, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadFavorites() {
  try {
    const res = await api.get(API.private.favorites);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadFavorite(id: number) {
  try {
    const res = await api.get(API.private.favorites + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadFavoritesFavorite(page: string, limit: string) {
  try {
    const res = await api.get(
      API.private.favoritesFavorite + "?page=" + page + "&limit=" + limit,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteFavorite(id: number) {
  try {
    const res = await api.delete(API.private.favorites + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateFavorites,
  handleCreateFavorite,
  handleReadFavoritesFavorite,
  handleReadFavorites,
  handleReadFavorite,
  handleDeleteFavorite,
};
