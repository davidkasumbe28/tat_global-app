"use client";

import CatalogueHeader from "@/components/catalogue/catalogue-header";
import CatalogueProductsGrid from "@/components/catalogue/catalogue-products-grid";
import CatalogueSidebar from "@/components/catalogue/catalogue-sidebar";
import { useStore } from "@/context/store-context";
import type { Product } from "@/lib/@types/types";
import { handleReadCatalogueProducts } from "@/lib/handlers/events-handlers/product-events";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 9;

export default function CataloguePage() {
  const { searchQuery, selectedCategory, priceRange, isloading } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (filters: any) => {
    setSortBy(filters.sortBy);
  };

  useEffect(() => {
    setLoading(true);
    handleReadCatalogueProducts(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedCategory,
      searchQuery,
      sortBy,
      JSON.stringify({ min: priceRange[0], max: priceRange[1] }),
    )
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération des produits",
          );
          setLoading(false);
          return;
        }

        setProducts(res.data.products);
        setProductsCount(res.data.total);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [currentPage, selectedCategory, priceRange, searchQuery, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <CatalogueHeader emuted={isloading} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CatalogueSidebar
          emuted={isloading}
          handleFiltersChange={handleFiltersChange}
        />

        <CatalogueProductsGrid
          emuted={isloading}
          products={products}
          productsCount={productsCount}
          loading={loading}
          totalPages={totalPages}
          selectedCategory={selectedCategory as string}
          priceRangeEnd={priceRange[1]}
          priceRangeStart={priceRange[0]}
          searchQuery={searchQuery}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </main>
  );
}
