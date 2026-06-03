import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import { CategoryProduct, StateProduct } from "@/lib/generated/prisma/enums";

async function handleCreateCollection(formData: Record<string, any>) {
  try {
    const res = await api.post(API.private.collections, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCollectionCollections() {
  try {
    const res = await api.get(API.public.collectionsCollection);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadSelectCollections(
  category?: CategoryProduct | "ALL",
  state?: StateProduct | "ALL",
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.collectionsSelect +
        "?category=" +
        category +
        "&state=" +
        state +
        "&sort=" +
        sort,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCollections(
  page?: string,
  limit?: string,
  category?: CategoryProduct | "ALL",
  state?: StateProduct | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.collections +
        "?page=" +
        page +
        "&limit=" +
        limit +
        "&category=" +
        category +
        "&state=" +
        state +
        "&search=" +
        search +
        "&sort=" +
        sort,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCollection(id: number) {
  try {
    const res = await api.get(API.private.collections + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateCollection(
  id: number,
  formData: Record<string, any>,
) {
  try {
    const res = await api.patch(API.private.collections + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteCollection(id: number) {
  try {
    const res = await api.delete(API.private.collections + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateCollection,
  handleReadCollectionCollections,
  handleReadSelectCollections,
  handleReadCollections,
  handleReadCollection,
  handleUpdateCollection,
  handleDeleteCollection,
};
