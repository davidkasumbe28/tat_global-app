import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";
import { CategoryProduct, StateProduct } from "@/lib/generated/prisma/enums";


async function handleCreateProduct(formData: Record<string, any>) {
  try {
    const res = await api.post(API.private.products, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadProducts(
  page?: string,
  limit?: string,
  category?: CategoryProduct | "ALL",
  state?: StateProduct | "ALL",
  search?: string,
  sort?: string,
) {
  try {
    const res = await api.get(
      API.private.products +
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

async function handleReadCatalogueProducts(
  page: string,
  limit: string,
  category: CategoryProduct | "ALL",
  search: string = "",
  sort: string = "newest",
  price: string = JSON.stringify({ min: 0, max: 1000 }),
) {
  try {
    const res = await api.get(
      API.public.productsCatalogue +
        "?" +
        "page=" +
        page +
        "&limit=" +
        limit +
        "&category=" +
        category +
        "&search=" +
        search +
        "&sort=" +
        sort +
        "&price=" +
        price,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCollectionProducts(
  collectionId: number,
  page: string,
  limit: string,
) {
  try {
    const res = await api.get(
      API.public.productsCollection +
        "?" +
        "collectionId=" +
        collectionId +
        "&page=" +
        page +
        "&limit=" +
        limit,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCartItemProducts(
  productIds: string,
  page: string,
  limit: string,
) {
  try {
    const res = await api.get(
      API.private.productsCartItem +
        "?productIds=" +
        productIds +
        "&page=" +
        page +
        "&limit=" +
        limit,
    );
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadProduct(id: number) {
  try {
    const res = await api.get(API.private.products + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateProduct(id: number, formData: Record<string, any>) {
  try {
    const res = await api.patch(API.private.products + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteProduct(id: number) {
  try {
    const res = await api.delete(API.private.products + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateProduct,
  handleReadProducts,
  handleReadProduct,
  handleReadCartItemProducts,
  handleReadCatalogueProducts,
  handleReadCollectionProducts,
  handleUpdateProduct,
  handleDeleteProduct,
};
