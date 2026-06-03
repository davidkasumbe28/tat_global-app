import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleCreateCartItems(
  cartId: number,
  formData: {
    productId: number;
    quantity: number;
    size: string;
    color: string;
  }[],
) {
  try {
    const res = await api.post(API.private.cartItemsCart, {
      cartId,
      data: formData,
    });
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleCreateCartItem(formData: {
  cartId: number;
  productId: number;
  quantity: number;
  size: string;
  color: string;
}) {
  try {
    const res = await api.post(API.private.cartItems, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCartItemsCart(
  cartId: number,
  page: string,
  limit: string,
) {
  try {
    const res = await api.get(
      API.private.cartItemsCart +
      "?cartId=" +
      cartId +
      "?page=" +
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

async function handleReadCartItems(cartId: number) {
  try {
    const res = await api.get(API.private.cartItems + "?cartId=" + cartId);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCartItem(id: number) {
  try {
    const res = await api.get(API.private.cartItems + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleUpdateCartItem(id: number, formData: { quantity: number }) {
  try {
    const res = await api.patch(API.private.cartItems + "/" + id, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleDeleteCartItem(id: number) {
  try {
    const res = await api.delete(API.private.cartItems + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

export {
  handleCreateCartItems,
  handleCreateCartItem,
  handleReadCartItemsCart,
  handleReadCartItems,
  handleReadCartItem,
  handleUpdateCartItem,
  handleDeleteCartItem,
};
