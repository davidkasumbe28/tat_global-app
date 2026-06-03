"use client";

import { useStore } from "@/context/store-context";
import { CartItem, Product } from "@/lib/@types/types";
import {
  handleCreateCart,
  handleReadCart,
} from "@/lib/handlers/events-handlers/cart-events";
import {
  handleCreateCartItems,
  handleReadCartItemsCart,
} from "@/lib/handlers/events-handlers/cartItem-events";
import { handleReadCartItemProducts } from "@/lib/handlers/events-handlers/product-events";
import { useEffect, useState } from "react";

export function useCart() {
  const {
    cart,
    setCart,
    cartProducts,
    setCartProducts,
    createCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    summaryCart,
    requiredSyncCart,
    isLoggedIn,
  } = useStore();
  const [requiredSynchronized, setRequiredSynchronized] =
    useState<boolean>(false);
  const [cartItemNotSynchronized, setCartItemNotSynchronized] = useState<
    CartItem[]
  >([]);
  const [isloadingCart, setIsloadingCart] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const synchronizedCart = async (cartId: number, userId?: number) => {
    try {
      setIsloadingCart(true);
      const carts = localStorage.getItem("cart");

      if (!carts || carts === null) {
        localStorage.removeItem("cart");
        setIsloadingCart(false);
        return;
      }

      const localCart = JSON.parse(carts);

      if (localCart?.cartItems?.length === 0) {
        localStorage.removeItem("cart");
        setIsloadingCart(false);
        return;
      }

      const data = localCart.cartItems.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const currentCart = await handleReadCart(cartId);

      if (currentCart.error) {
        setIsloadingCart(false);
        return;
      }

      if (!cart && userId) {
        const newCart = await handleCreateCart({ id: userId });

        if (newCart.error) {
          setIsloadingCart(false);
          return;
        }

        setCart(newCart.data);

        const res = await handleCreateCartItems(newCart.data.id, data);

        if (res.error) {
          setIsloadingCart(false);
          return;
        }

        localStorage.removeItem("cart");

        setCart(res.data);

        setIsloadingCart(false);
        return;
      }

      const res = await handleCreateCartItems(cartId, data);

      if (res.error) {
        setIsloadingCart(false);
        return;
      }

      localStorage.removeItem("cart");

      setCart(res.data);

      setIsloadingCart(false);
    } catch (err) {
      setCart(null);
      console.log("useCart synchronizedCartItems error : ", err);
    } finally {
      setIsloadingCart(false);
    }
  };

  const loadCartItemsProduct = async (limit: string) => {
    try {
      setIsloadingCart(true);
      // if is not loggedIn
      if (!isLoggedIn) {
        const carts = localStorage.getItem("cart");

        if (!carts || carts === null) {
          setCartProducts([]);
          setIsloadingCart(false);
          return;
        }

        const localCart = JSON.parse(carts);

        if (localCart?.cartItems?.length === 0) {
          setCartProducts([]);
          setIsloadingCart(false);
          return;
        }

        const productIds: number[] = [];

        const ids = localCart.cartItems.map((item: CartItem) => item.productId);

        ids.map((id: number) => {
          if (!productIds.includes(id)) productIds.push(id);
        });

        const res = await handleReadCartItemProducts(
          JSON.stringify({ productIds }),
          currentPage.toString(),
          limit,
        );

        if (res.error) {
          setError(
            "Une erreur est survenue lors de la récupération des produits du panier",
          );
          setCartProducts([]);
          setIsloadingCart(false);
          return;
        }

        const products = res.data.products;

        const cartItems: CartItem[] = [];

        localCart.cartItems.map((item: CartItem) => {
          products.map((p: Product) => {
            if (item.productId === p.id) {
              const cartItem = { ...item, product: p };
              cartItems.push(cartItem);
            }
          });
        });

        setCartProducts(cartItems);
        const totalPages = Math.ceil(res.data.total / parseInt(limit));
        setTotalPages(totalPages);
        setIsloadingCart(false);
        return;
      }

      // if is loggedIn and requiredSyncCart

      // if requiredSyncCart
      if (requiredSyncCart(isLoggedIn)) {
        const carts = localStorage.getItem("cart");

        if (!carts || carts === null) {
          setCartItemNotSynchronized([]);
          return;
        }

        const localCart = JSON.parse(carts);

        if (localCart?.cartItems?.length === 0) {
          setCartItemNotSynchronized([]);
          return;
        }

        const productIds: number[] = [];

        const ids = localCart.cartItems.map((item: CartItem) => item.productId);

        ids.map((id: number) => {
          if (!productIds.includes(id)) productIds.push(id);
        });

        const res = await handleReadCartItemProducts(
          JSON.stringify({ productIds }),
          currentPage.toString(),
          "9",
        );

        if (res.error) {
          setCartItemNotSynchronized([]);
          // setIsloadingCart(false);
          return
        }

        const products = res.data.products;

        const cartItems: CartItem[] = [];

        localCart.cartItems.map((item: CartItem) => {
          products.map((p: Product) => {
            if (item.productId === p.id) {
              const cartItem = { ...item, product: p };
              cartItems.push(cartItem);
            }
          });
        });

        setCartItemNotSynchronized(cartItems);
      }

      // cartItemProduct
      if (!cart) {
        setIsloadingCart(false)
        return
      }

      const res = await handleReadCartItemsCart(
        cart?.id as number || 0,
        currentPage.toString(),
        limit,
      );

      if (res.error) {
        setError(
          res.error ||
          "Une erreur est survenue lors de la récupération des produits du panier",
        );
        setCartProducts([]);
        setIsloadingCart(false);
        return;
      }

      setCartProducts(res.data.cartItems);
      const totalPages = Math.ceil(res.data.total / parseInt(limit));
      setTotalPages(totalPages);
      setIsloadingCart(false);
    } catch (err) {
      console.log("useCart loadCartItemsProduct error : ", err);
      setIsloadingCart(false);
    }
  };

  const loadCart = async () => {
    try {
      setIsloadingCart(true);
      const cart = localStorage.getItem("cart");

      if (!cart) {
        setCart(null);
        setIsloadingCart(false);
        return;
      }

      const currentCart = JSON.parse(cart as string);

      const items = currentCart.cartItems;

      setCart({
        id: currentCart.id,
        state: currentCart.state,
        cartItems: items,
      });
      setIsloadingCart(false);
    } catch (err) {
      setCart(null);
      console.log("useCart loadCart error : ", err);
      setIsloadingCart(false);
    }
  };

  useEffect(() => {
    setRequiredSynchronized(requiredSyncCart(isLoggedIn));
    loadCart();
  }, [isLoggedIn, requiredSynchronized]);

  
  return {
    cart,
    cartProducts,
    createCart,
    addToCart,
    removeFromCart,
    synchronizedCart,
    requiredSynchronized,
    setRequiredSynchronized,
    updateCartQuantity,
    loadCart,
    loadCartItemsProduct,
    clearCart,
    cartTotal,
    cartCount,
    summaryCart,
    requiredSyncCart,
    cartItemNotSynchronized,
    isloadingCart,
    setIsloadingCart,
    currentPage,
    setCurrentPage,
    totalPages,
    error,
  };
}
