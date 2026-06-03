// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useState,
//   type ReactNode,
// } from "react";
// import type {
//   CartItem,
//   Favorite,
//   Order,
//   StatusUser,
//   Theme,
//   User,
// } from "./types";
// import { id } from "date-fns/locale";

// interface AdminContextType {
//   // Order state
//   order: Order | null;
//   setOrder: (order: Order | null) => void;
//   // createCart: (isLoggedIn: boolean, userId: number) => void;
//   // addToCart: (
//   //   isLoggedIn: boolean,
//   //   cartId: number,
//   //   userId: number,
//   //   productId: number,
//   //   quantity: number,
//   //   size?: string,
//   //   color?: string
//   // ) => void;
//   // removeFromCart: (isLoggedIn: boolean, id: number) => void;
//   // updateCartQuantity: (
//   //   isLoggedIn: boolean,
//   //   id: number,
//   //   quantity: number
//   // ) => void;
//   // clearCart: (isLoggedIn: boolean, userId: number) => void;
//   // cartTotal: () => number;
//   // cartCount: number;

//   // // Favorites state
//   // favorites: Favorite[];
//   // setFavorites: (favorites: Favorite[]) => void;
//   // favoritesProducts: Favorite[];
//   // setFavoritesProducts: (favoritesProducts: Favorite[]) => void;
//   // addToFavorites: (
//   //   isLoggedIn: boolean,
//   //   productId: number,
//   //   userId: number
//   // ) => void;
//   // removeFromFavorites: (isLoggedIn: boolean, id: number) => void;
//   // isFavorite: (productId: number) => boolean;
//   // favoriteId: (productId: number, userId: number) => number;

//   // // Search & filter state
//   // searchQuery: string;
//   // setSearchQuery: (query: string) => void;
//   // selectedCategory: string | null;
//   // setSelectedCategory: (category: string | null) => void;
//   // priceRange: [number, number];
//   // setPriceRange: (range: [number, number]) => void;
// }

// const AdminContext = createContext<AdminContextType | undefined>(undefined);

// export function AdminProvider({ children }: { children: ReactNode }) {
//   const [theme, setTheme] = useState<Theme>("light");
//   const [isloading, setIsloading] = useState(true);
//   const [user, setUser] = useState<User | null>(null);
//   const [status, setStatus] = useState<StatusUser>("offline");
//   const [order, setOrder] = useState<Order | null>(null);
//   const [cartProducts, setCartProducts] = useState<CartItem[]>([]);
//   const [favorites, setFavorites] = useState<Favorite[]>([]);
//   const [favoritesProducts, setFavoritesProducts] = useState<Favorite[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

//   // const isLoggedIn = user !== null;

//   // const applyTheme = useCallback((newTheme: Theme) => {
//   //   const html = document.documentElement;
//   //   if (newTheme === "dark") {
//   //     html.classList.add("dark");
//   //   } else {
//   //     html.classList.remove("dark");
//   //   }
//   // }, []);

//   // const createCart = useCallback(
//   //   async (isLoggedIn: boolean, userId: number) => {
//   //     if (!isLoggedIn) {
//   //       const prevCart = JSON.parse(
//   //         localStorage.getItem("cart") ||
//   //           JSON.stringify({
//   //             cartItems: [],
//   //           })
//   //       );

//   //       if (prevCart.cartItems.length !== 0) {
//   //         setCart(prevCart);
//   //         return;
//   //       }

//   //       const cart = JSON.stringify({
//   //         cartItems: [],
//   //       });

//   //       localStorage.setItem("cart", cart);

//   //       setCart(JSON.parse(cart));

//   //       return;
//   //     }

//   //     const resGet = await handleGetUserCart();

//   //     if (resGet.error) return;

//   //     if (resGet.data.length !== 0) {
//   //       setCart(resGet.data[0]);

//   //       return;
//   //     }

//   //     const resPost = await handleCreateUserCart({
//   //       userId: userId,
//   //     });

//   //     if (resPost.error) return;

//   //     setCart(resPost.data);

//   //     return;
//   //   },
//   //   []
//   // );

//   // const addToCart = useCallback(
//   //   async (
//   //     isLoggedIn: boolean,
//   //     cartId: number,
//   //     userId: number,
//   //     productId: number,
//   //     quantity: number,
//   //     size?: string,
//   //     color?: string
//   //   ) => {
//   //     createCart(isLoggedIn, user?.id || 0);

//   //     if (!isLoggedIn) {
//   //       const prevCart = JSON.parse(
//   //         localStorage.getItem("cart") ||
//   //           JSON.stringify({
//   //             id: 0,
//   //             cartItems: [],
//   //           })
//   //       );

//   //       if (prevCart.id === 0) return;

//   //       let items = prevCart.cartItems;

//   //       const existingItem = items?.find(
//   //         (item: CartItem) =>
//   //           item.productId === productId &&
//   //           item.size === size &&
//   //           item.color === color
//   //       );

//   //       if (existingItem) {
//   //         items = items.map((item: CartItem) => {
//   //           if (item.id === existingItem.id)
//   //             return {
//   //               ...existingItem,
//   //               quantity: (existingItem.quantity += quantity),
//   //             };
//   //           else return item;
//   //         });

//   //         const cart = JSON.stringify({
//   //           ...prevCart,
//   //           cartItems: items,
//   //         });

//   //         localStorage.setItem("cart", cart);

//   //         setCart(JSON.parse(cart));

//   //         return;
//   //       }

//   //       const cart = JSON.stringify({
//   //         ...prevCart,
//   //         cartItems: [
//   //           ...items,
//   //           {
//   //             id: Date.now(),
//   //             productId,
//   //             quantity,
//   //             size,
//   //             color,
//   //           },
//   //         ],
//   //       });

//   //       localStorage.setItem("cart", cart);

//   //       setCart(JSON.parse(cart));

//   //       return;
//   //     }

//   //     const resGet = await handleGetUserCart();

//   //     if (resGet.error) return;

//   //     let items = resGet.data[0]?.cartItems;

//   //     const existingItem = items?.find(
//   //       (item: CartItem) =>
//   //         // item.cartId === cartId &&
//   //         item.productId === productId &&
//   //         item.size === size &&
//   //         item.color === color
//   //     );

//   //     if (existingItem) {
//   //       const item = items.find(
//   //         (item: CartItem) => item.id === existingItem.id
//   //       );

//   //       if (item) {
//   //         const resUpdate = await handleUpdateUserCartItem(item?.id, {
//   //           quantity: (item.quantity += quantity),
//   //         });

//   //         if (resUpdate.error) return;

//   //         return;
//   //       }

//   //       return;
//   //     }

//   //     const resPost = await handleCreateUserCartItem({
//   //       cartId,
//   //       productId,
//   //       quantity,
//   //       size,
//   //       color,
//   //     });

//   //     if (resPost.error) return;

//   //     return;
//   //   },
//   //   []
//   // );

//   // const removeFromCart = useCallback(
//   //   async (isLoggedIn: boolean, id: number) => {
//   //     if (!isLoggedIn) {
//   //       const prevCart = JSON.parse(
//   //         localStorage.getItem("cart") ||
//   //           JSON.stringify({
//   //             id: 0,
//   //             cartItems: [],
//   //           })
//   //       );

//   //       if (prevCart.id === 0) return;

//   //       let items = prevCart.cartItems;

//   //       items = items.filter((item: CartItem) => item.id !== id);

//   //       const cart = JSON.stringify({
//   //         ...prevCart,
//   //         cartItems: items,
//   //       });

//   //       localStorage.setItem("cart", cart);

//   //       setCart(JSON.parse(cart));

//   //       return;
//   //     }

//   //     const res = await handleDeleteUserCartItem(id);

//   //     if (res.error) return;

//   //     return;
//   //   },
//   //   []
//   // );

//   // const updateCartQuantity = useCallback(
//   //   async (isLoggedIn: boolean, id: number, quantity: number) => {
//   //     if (quantity >= 1) {
//   //       if (!isLoggedIn) {
//   //         const prevCart = JSON.parse(
//   //           localStorage.getItem("cart") ||
//   //             JSON.stringify({
//   //               id: 0,
//   //               cartItems: [],
//   //             })
//   //         );

//   //         if (prevCart.id === 0) return;

//   //         let items = prevCart.cartItems;

//   //         items = items.map((item: CartItem) =>
//   //           item.id === id ? { ...item, quantity } : item
//   //         );

//   //         const cart = JSON.stringify({
//   //           ...prevCart,
//   //           cartItems: items,
//   //         });

//   //         localStorage.setItem("cart", cart);

//   //         return;
//   //       }

//   //       const res = await handleUpdateUserCartItem(id, {
//   //         quantity: quantity,
//   //       });

//   //       if (res.error) return;

//   //       return;
//   //     }
//   //   },
//   //   [removeFromCart]
//   // );

//   // const clearCart = useCallback(async (isLoggedIn: boolean, userId: number) => {
//   //   if (!isLoggedIn) {
//   //     const cart = JSON.parse(
//   //       localStorage.getItem("cart") ||
//   //         JSON.stringify({
//   //           id: 0,
//   //           cartItems: [],
//   //         })
//   //     );

//   //     localStorage.setItem("cart", cart);

//   //     return;
//   //   }

//   //   const resGet = await handleGetCartItemUser(userId);

//   //   if (resGet.error) return;

//   //   let items = resGet.data;

//   //   if (items?.length > 0) {
//   //     items?.map(async (item: CartItem) => {
//   //       const res = await handleDeleteUserCartItem(item?.id);

//   //       if (res.error) return;

//   //       return;
//   //     });
//   //   }

//   //   setCart(null);
//   // }, []);

//   // const cartTotal = () => {
//   //   return cartProducts?.reduce(
//   //     (total, item) => total + (item?.product?.price || 0) * item?.quantity,
//   //     0
//   //   );
//   // };

//   // const cartCount =
//   //   cart?.cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;

//   // const addToFavorites = useCallback(
//   //   async (isLoggedIn: boolean, productId: number, userId: number) => {
//   //     if (!isLoggedIn) {
//   //       const prevFavorites = JSON.parse(
//   //         localStorage.getItem("favorites") ||
//   //           JSON.stringify({ items: [], updatedAt: "" })
//   //       );

//   //       const items = prevFavorites?.items;

//   //       const exists = items.some(
//   //         (item: Favorite) =>
//   //           item.productId === productId && item.userId === userId
//   //       );
//   //       if (exists) return;

//   //       const favorites = JSON.stringify({
//   //         items: [
//   //           ...items,
//   //           {
//   //             id: Date.now(),
//   //             userId: userId,
//   //             productId: productId,
//   //           },
//   //         ],
//   //         updatedAt: new Date(),
//   //       });

//   //       localStorage.setItem("favorites", favorites);

//   //       return;
//   //     }

//   //     const resGet = await handleGetFavoritesUser(userId);

//   //     if (resGet.error) return;

//   //     let items = resGet.data;

//   //     const exists = items.some(
//   //       (item: Favorite) =>
//   //         item.productId === productId && item.userId === userId
//   //     );

//   //     if (exists) return;

//   //     const resPost = await handleCreateUserFavorite({
//   //       userId,
//   //       productId,
//   //     });

//   //     if (resPost.error) return;

//   //     return;
//   //   },
//   //   []
//   // );

//   // const removeFromFavorites = useCallback(
//   //   async (isLoggedIn: boolean, id: number) => {
//   //     if (!isLoggedIn) {
//   //       const prevFavorites = JSON.parse(
//   //         localStorage.getItem("favorites") ||
//   //           JSON.stringify({ items: [], updatedAt: "" })
//   //       );

//   //       let items = prevFavorites?.items;

//   //       items = items.filter((item: Favorite) => item.id !== id);

//   //       const favorites = JSON.stringify({
//   //         items: items,
//   //         updatedAt: new Date(),
//   //       });

//   //       localStorage.setItem("favorites", favorites);
//   //       return;
//   //     }

//   //     const res = await handleDeleteUserFavorite(id);

//   //     if (res.error) return;

//   //     return;
//   //   },
//   //   []
//   // );

//   // const isFavorite = useCallback(
//   //   (productId: number) => {
//   //     return favorites.some((fav) => fav.productId === productId);
//   //   },
//   //   [favorites]
//   // );

//   // const favoriteId = useCallback(
//   //   (productId: number, userId: number) => {
//   //     const favorite = favorites.find(
//   //       (fav) => fav.productId === productId && fav.userId === userId
//   //     ) || { id: 0, productId: 0, userId: 0 };
//   //     return favorite.id;
//   //   },
//   //   [favorites]
//   // );

//   const value: AdminContextType = {
//     order,
//     setOrder,
//     // theme,
//     // setTheme,
//     // isloading,
//     // setIsloading,
//     // applyTheme,
//     // user,
//     // setUser,
//     // status,
//     // setStatus,
//     // isLoggedIn,
//     // cart,
//     // setCart,
//     // cartProducts,
//     // setCartProducts,
//     // createCart,
//     // addToCart,
//     // removeFromCart,
//     // updateCartQuantity,
//     // clearCart,
//     // cartTotal,
//     // cartCount,
//     // favorites,
//     // setFavorites,
//     // favoritesProducts,
//     // setFavoritesProducts,
//     // addToFavorites,
//     // removeFromFavorites,
//     // isFavorite,
//     // favoriteId,
//     // searchQuery,
//     // setSearchQuery,
//     // selectedCategory,
//     // setSelectedCategory,
//     // priceRange,
//     // setPriceRange,
//   };

//   return (
//     <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
//   );
// }

// export function useAdmin() {
//   const context = useContext(AdminContext);
//   if (context === undefined) {
//     throw new Error("useStore must be used within a StoreProvider");
//   }
//   return context;
// }
