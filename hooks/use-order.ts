"use client";

import { useStore } from "@/context/store-context";
import { useEffect, useState } from "react";

export function useOrder() {
  const {
    isLoggedIn,
  } = useStore();


  const [isloadingOrder, setIsloadingOrder] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  return {
    isloadingOrder,
    setIsloadingOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    error,
  };
}
