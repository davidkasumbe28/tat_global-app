import api from "@/lib/api";
import { API } from "@/lib/data/raw/routes";

async function handleCreateCart(formData: { id: number }) {
  try {
    const res = await api.post(API.private.cart, formData);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

// async function handleReadCartsCart() {
//   try {
//     const res = await api.get(API.private.cart);
//     return res as Record<string, any>;
//   } catch (error) {
//     const err = error as Error;
//     const message = err.message;
//     return { error: message } as Record<string, any>;
//   }
// }

async function handleReadCarts() {
  try {
    const res = await api.get(API.private.cart);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}

async function handleReadCart(id: number) {
  try {
    const res = await api.get(API.private.cart + "/" + id);
    return res as Record<string, any>;
  } catch (error) {
    const err = error as Error;
    const message = err.message;
    return { error: message } as Record<string, any>;
  }
}


export {
  handleCreateCart,
  // handleReadCartsCart,
  handleReadCarts,
  handleReadCart,
};
