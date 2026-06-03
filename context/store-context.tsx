"use client";

import { CartAuth } from "@/lib/@types/cart.type";
import { FavoriteAuth } from "@/lib/@types/favorite.type";
import { UserAuth } from "@/lib/@types/user.type";
import { handleCreateCart } from "@/lib/handlers/events-handlers/cart-events";
import {
  handleCreateCartItem,
  handleDeleteCartItem,
  handleUpdateCartItem,
} from "@/lib/handlers/events-handlers/cartItem-events";
import {
  handleCreateFavorite,
  handleDeleteFavorite,
} from "@/lib/handlers/events-handlers/favorite-events";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  CartItem,
  CategoryProduct,
  Favorite,
  Order,
  StateCart,
  StatusUser,
  Theme,
} from "../lib/@types/types";
import {
  ROLE_USER,
  SHIPPING,
  STATUS_USER,
  TAX,
} from "../lib/constants/constants";
import { RoleUser } from "@/lib/generated/prisma/enums";

interface StoreContextType {
  // app state
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (newTheme: Theme) => void;
  isloading: boolean;
  setIsloading: (isloading: boolean) => void;

  // User state
  user: UserAuth | null;
  setUser: (user: UserAuth | null) => void;
  status: StatusUser;
  setStatus: (status: StatusUser) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;

  // Cart state
  cart: CartAuth | null;
  setCart: (cart: CartAuth | null) => void;
  cartProducts: CartItem[];
  setCartProducts: (cartProducts: CartItem[]) => void;
  createCart: (isLoggedIn: boolean, userId?: number) => Promise<void>;
  addToCart: (
    isLoggedIn: boolean,
    cartId: number,
    productId: number,
    quantity: number,
    size?: string,
    color?: string,
  ) => Promise<void>;
  removeFromCart: (isLoggedIn: boolean, id: number) => Promise<void>;
  updateCartQuantity: (
    isLoggedIn: boolean,
    id: number,
    quantity: number,
  ) => Promise<void>;
  clearCart: (isLoggedIn: boolean, cartId: number) => Promise<void>;
  cartTotal: number;
  cartCount: number;
  summaryCart: () => {
    shipping: number;
    tax: number;
    reduction?: number;
    otherFees?: number;
    total: number;
  };
  requiredSyncCart: (isLoggedIn: boolean) => boolean;

  // // Orders state
  // orders: Order[];
  // setOrders: (orders: Order[]) => void;

  // Favorites state
  favorites: FavoriteAuth[];
  setFavorites: (favorites: FavoriteAuth[]) => void;
  favoritesProducts: Favorite[];
  setFavoritesProducts: (favoritesProducts: Favorite[]) => void;
  addToFavorites: (isLoggedIn: boolean, productId: number) => Promise<void>;
  removeFromFavorites: (isLoggedIn: boolean, id: number) => Promise<void>;
  isFavorite: (productId: number) => Promise<boolean>;
  favoriteId: (productId: number) => Promise<number | null>;

  // Search & filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CategoryProduct | "ALL";
  setSelectedCategory: (category: CategoryProduct | "ALL") => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isloading, setIsloading] = useState(true);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [status, setStatus] = useState<StatusUser>(STATUS_USER.OFFLINE);
  const [cart, setCart] = useState<CartAuth | null>(null);
  const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteAuth[]>([]);
  const [favoritesProducts, setFavoritesProducts] = useState<Favorite[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryProduct | "ALL"
  >("ALL");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const isLoggedIn = user !== null;

  const isAdmin = user ? user.role === RoleUser.ADMIN : false;

  // ---------------------------- theme callback ------------------------------------
  // ------------------------------------------------------------------------------------
  const applyTheme = useCallback((newTheme: Theme) => {
    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []);

  // ---------------------------- cart callback ------------------------------------
  // ------------------------------------------------------------------------------------
  const createCart = useCallback(
    async (isLoggedIn: boolean, userId?: number) => {
      // if is not loggedIn
      if (!isLoggedIn) {
        const cart = localStorage.getItem("cart");

        if (cart) {
          const currentCart = JSON.parse(cart);
          setCart(currentCart);

          return;
        }

        const newCart = {
          id: Date.now(),
          state: "ENABLED",
          cartItems: [],
        };

        if (!newCart) return;

        localStorage.setItem("cart", JSON.stringify(newCart));
        setCart(newCart as CartAuth);

        return;
      }

      // if isLoggedIn
      const res = await handleCreateCart({ id: userId as number });

      if (res.error) {
        setCart(null);
        return;
      }

      setCart({
        id: res.data.id,
        state: res.data.state as StateCart,
        cartItems: res.data.cartItems,
      });
    },
    [],
  );

  const addToCart = useCallback(
    async (
      isLoggedIn: boolean,
      cartId: number,
      productId: number,
      quantity: number,
      size?: string,
      color?: string,
    ) => {
      // if is not loggedIn
      if (!isLoggedIn) {
        const cart = JSON.parse(localStorage.getItem("cart") as string);

        const prevItems = cart?.cartItems;

        if (!prevItems && prevItems.length === 0) {
          const item = {
            id: Date.now(),
            productId,
            quantity,
            size,
            color,
          };

          const newItems = [item];

          const newCart = { ...cart, cartItems: newItems };

          localStorage.setItem("cart", JSON.stringify(newCart));

          setCart(newCart);

          return;
        }

        const existingItem = prevItems?.find(
          (item: CartItem) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color,
        );

        if (existingItem) {
          const newItems = prevItems.map((item: CartItem) => {
            if (item.id === existingItem.id)
              return {
                ...existingItem,
                quantity: (existingItem.quantity += quantity),
              };
            else return item;
          });

          const newCart = { ...cart, cartItems: newItems };
          localStorage.setItem("cart", JSON.stringify(newCart));

          setCart(newCart);

          return;
        }

        const item = {
          id: Date.now(),
          productId,
          quantity,
          size,
          color,
        };

        const newItems = [...prevItems, item];

        const newCart = { ...cart, cartItems: newItems };

        localStorage.setItem("cart", JSON.stringify(newCart));

        setCart(newCart);

        return;
      }

      // if is loggedIn
      const res = await handleCreateCartItem({
        cartId,
        productId,
        quantity,
        size: size as string,
        color: color as string,
      });

      if (res.error) return;

      setCart(res.data);
      return;
    },
    [],
  );

  const removeFromCart = useCallback(
    async (isLoggedIn: boolean, id: number) => {
      // if is not loggedIn
      if (!isLoggedIn) {
        const cart = JSON.parse(localStorage.getItem("cart") as string);

        const prevItems = cart?.cartItems;

        if (!prevItems && prevItems.length === 0) return;

        const newItems = prevItems.filter((item: CartItem) => item.id !== id);

        const newCart = {
          ...cart,
          cartItems: newItems,
        };

        localStorage.setItem("cart", JSON.stringify(newCart));

        setCart(newCart);

        return;
      }

      // if is loggedIn
      const res = await handleDeleteCartItem(id);

      if (res.error) return;
    },
    [],
  );

  const updateCartQuantity = useCallback(
    async (isLoggedIn: boolean, id: number, quantity: number) => {
      if (quantity >= 1) {
        // if is not loggedIn
        if (!isLoggedIn) {
          const cart = JSON.parse(localStorage.getItem("cart") as string);

          const prevItems = cart?.cartItems;

          if (!prevItems && prevItems.length === 0) return;

          const newItems = prevItems.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item,
          );

          const newCart = {
            ...cart,
            cartItems: newItems,
          };

          localStorage.setItem("cart", JSON.stringify(newCart));

          setCart(newCart);

          return;
        }

        // if is loggedIn

        const res = await handleUpdateCartItem(id, {
          quantity,
        });

        if (res.error) return;
      }
    },
    [removeFromCart],
  );

  const clearCart = useCallback(async (isLoggedIn: boolean, cartId: number) => {
    // if is not loggedIn
    if (!isLoggedIn) {
      const cart = JSON.parse(localStorage.getItem("cart") as string);

      if (cart.id !== cartId) return;

      const prevItems = cart?.cartItems;

      if (!prevItems && prevItems.length === 0) return;

      const newItems: CartItem[] = [];

      const newCart = { ...cart, cartItems: newItems };

      localStorage.setItem("cart", JSON.stringify(newCart));

      setCart(newCart);

      return;
    }

    // if is loggedIn

    // const resGet = await handleGetCartItemUser(userId);

    // if (resGet.error) return;

    // let items = resGet.data;

    // if (items?.length > 0) {
    //   items?.map(async (item: CartItem) => {
    //     const res = await handleDeleteUserCartItem(item?.id);

    //     if (res.error) return;

    //     return;
    //   });
    // }

    // setCart(null);
  }, []);

  const cartTotal =
    isLoggedIn && cart
      ? cart?.cartItems?.reduce(
          (total, item) => total + (item?.product?.price || 0) * item?.quantity,
          0,
        ) || 0
      : cartProducts?.reduce(
          (total, item) => total + (item?.product?.price || 0) * item?.quantity,
          0,
        ) || 0;

  const cartCount =
    cart?.cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;

  const summaryCart = () => {
    const shipping = cartTotal >= SHIPPING ? 0 : SHIPPING;

    const tax = cartTotal * TAX;

    const total = cartTotal + shipping + tax;

    return {
      shipping,
      tax,
      total,
    };
  };

  const requiredSyncCart = (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      try {
        const carts = localStorage.getItem("cart");

        if (!carts || carts === null) {
          localStorage.removeItem("cart");
          return false;
        }

        const localCart = JSON.parse(carts);

        if (localCart?.cartItems?.length === 0) {
          localStorage.removeItem("cart");
          return false;
        }

        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  // // ------------------------------- orders callback ------------------------------------
  // // ------------------------------------------------------------------------------------

  // const summaryOrder = {
  //   shipping: cartTotal >= 50 ? 0 : 10,
  //   tax: cartTotal * TAX,
  //   total: cartTotal + cartTotal >= 50 ? 0 : 10 + cartTotal * TAX,
  // };

  // ---------------------------- favorites callback ------------------------------------
  // ------------------------------------------------------------------------------------
  const addToFavorites = useCallback(
    async (isLoggedIn: boolean, productId: number) => {
      // if is not loggedIn
      if (!isLoggedIn) {
        const favorites = localStorage.getItem("favorites");

        if (!favorites || favorites === null) {
          const newItems = [{ id: Date.now(), productId }];

          const newFavorites = JSON.stringify({
            items: newItems,
          });

          localStorage.setItem("favorites", newFavorites);

          setFavorites(newItems);

          return;
        }

        const prevFavorites = JSON.parse(favorites as string);

        const items = prevFavorites?.items;

        const exists = items.some(
          (item: FavoriteAuth) => item.productId === productId,
        );
        if (exists) return;

        const newItems = [...items, { id: Date.now(), productId }];

        const newFavorites = JSON.stringify({
          items: newItems,
        });

        localStorage.setItem("favorites", newFavorites);

        setFavorites(newItems);

        return;
      }

      // if is loggedIn
      const res = await handleCreateFavorite({
        productId,
      });

      if (res.error) return;

      setFavorites(res.data);
    },
    [],
  );

  const removeFromFavorites = useCallback(
    async (isLoggedIn: boolean, id: number) => {
      // if is not loggedIn
      if (!isLoggedIn) {
        const favorites = localStorage.getItem("favorites");

        if (!favorites || favorites === null) {
          setFavorites([]);
          return;
        }

        const prevFavorites = JSON.parse(favorites as string);

        const items = prevFavorites.items;

        if (!items || items.length === 0) return;

        const newItems = items.filter((item: FavoriteAuth) => item.id !== id);

        const newFavorites = JSON.stringify({
          items: newItems,
        });

        localStorage.setItem("favorites", newFavorites);

        setFavorites(newItems);

        return;
      }

      // if is loggedIn
      const res = await handleDeleteFavorite(id);

      if (res.error) return;

      setFavorites(res.data);
    },
    [],
  );

  const isFavorite = useCallback(
    async (productId: number) => {
      return favorites?.some((fav) => fav.productId === productId);
    },
    [favorites],
  );

  const favoriteId = useCallback(
    async (productId: number) => {
      return favorites?.find((fav) => fav.productId === productId)?.id || null;
    },
    [favorites],
  );

  const value: StoreContextType = {
    theme,
    setTheme,
    isloading,
    setIsloading,
    applyTheme,
    user,
    setUser,
    status,
    setStatus,
    isLoggedIn,
    isAdmin,
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
    favorites,
    setFavorites,
    favoritesProducts,
    setFavoritesProducts,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoriteId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
