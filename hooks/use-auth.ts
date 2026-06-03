"use client";

import { useStore } from "@/context/store-context";
import links from "@/lib/data/raw/links";
import { APP } from "@/lib/data/raw/routes";
import {
  handleAuthenticated,
  handleLogout,
} from "@/lib/handlers/events-handlers/auth-events";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFavorites } from "./use-favorites";
import { Cart } from "@/lib/@types/types";
import { useCart } from "./use-cart";

export function useAuth() {
  const {
    user,
    setUser,
    status,
    setStatus,
    isLoggedIn,
    setFavorites,
    setCart,
  } = useStore();
  const { createCart, setIsloadingCart } =
    useCart();
  const { synchronizedFavorites, setIsloadingFavorites } =
    useFavorites();
  const [isloadingAuth, setIsloadingAuth] = useState(true);
  const router = useRouter();

  const pathname = usePathname();

  const navigationPathname = links.navigation.map((link) => link.href);

  const servicesPathname = links.services.map((link) => link.href);

  const supportPathname = links.support.map((link) => link.href);

  const otherPathname = [
    "/login",
    "/signup",
    "/login/forget-password",
    "/product",
    "/cart",
  ];

  const authenticated = async () => {
    try {
      setIsloadingAuth(true);

      const res = await handleAuthenticated();

      if (res?.error) {
        setUser(null);
        setStatus("OFFLINE");
        // await loadFavorites();
        // await createCart(isLoggedIn, user?.id);
        // await loadCart();
        // if (
        //   !otherPathname.includes(pathname) &&
        //   !navigationPathname.includes(pathname) &&
        //   !servicesPathname.includes(pathname) &&
        //   !supportPathname.includes(pathname) &&
        //   !/^\/product\/[^/]+$/.test(pathname)
        // ) {
        //   router.push(APP.public.login);
        //   setIsloadingAuth(false);
        //   return;
        // }
        setIsloadingAuth(false);
        return;
      }

      const auth_user = res.data;

      setUser(auth_user);
      setStatus(auth_user.status);
      setFavorites(auth_user.favorites);
      setCart(auth_user.cart);
      await synchronizedFavorites();
      setIsloadingFavorites(false);
      if (!auth_user.cart) await createCart(isLoggedIn, auth_user.id)
      setIsloadingCart(false);

      // await loadFavorites();
      // await synchronizedCartItems();
      // await loadCart();
      // setCart(
      //   auth_user.carts.find((cart: CartAuth) => cart.state === "ENABLED") ||
      //     null,
      // );
      // setFavorites(auth_user.favorites);
      // createCart(isLoggedIn, auth_user.id);
      // loadCart();
      // loadFavorites();
      // if (auth_user.status === STATUS_USER.in_progress)
      //   return router.push(APP.private.formCompletion);
      // if (
      //   auth_user.status === STATUS_USER.checked &&
      //   pathname !== APP.private.formCompletion &&
      //   Object.values(APP.private).includes(pathname)
      // )
      //   return router.push(APP.public.forgetPassword);
    } catch (err) {
      console.log("useAuth authenticated error : ", err);
    } finally {
      setIsloadingAuth(false);
    }
  };

  const logout = async () => {
    try {
      setIsloadingAuth(true);
      const res = await handleLogout();

      if (res?.error) {
        setIsloadingAuth(false);
        return false;
      }

      setUser(null);
      setStatus("OFFLINE");
      // await loadFavorites();
      // await createCart(isLoggedIn, user?.id);
      // await loadCart();
      setIsloadingAuth(false);
      router.push(APP.auth.login);
    } catch (err) {
      console.log("useAuth logout error : ", err);
    } finally {
      setIsloadingAuth(false);
    }
  };

  useEffect(() => {
    authenticated();
  }, []);

  return { user, status, isLoggedIn, logout, isloadingAuth, setIsloadingAuth };
}
