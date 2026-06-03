"use client";

import { useStore } from "@/context/store-context";
import { Theme } from "@/lib/@types/types";
import { useEffect } from "react";

export function useTheme() {
  const { theme, setTheme, applyTheme, isloading, setIsloading } = useStore();

  useEffect(() => {
    setIsloading(true);

    const savedTheme = localStorage.getItem("theme") as Theme | null;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    setTheme(initialTheme);

    applyTheme(initialTheme);

    setIsloading(false);
  }, []);

  const toggleTheme = () => {
    setIsloading(true);

    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);

    setIsloading(false);
  };

  return {
    theme: isloading ? "dark" : theme,
    toggleTheme,
    isloading,
  };
}
