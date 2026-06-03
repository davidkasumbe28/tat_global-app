"use client";

import AdminSearch from "@/components/admin/admin-search";
import AdminProductFilters from "@/components/admin/product/product-filters";
import AdminProductHeader from "@/components/admin/product/product-header";
import ProductTable from "@/components/admin/product/product-table";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { Product } from "@/lib/@types/types";
import { CategoryProduct, StateProduct } from "@/lib/generated/prisma/enums";
import {
  handleDeleteProduct,
  handleReadProducts,
} from "@/lib/handlers/events-handlers/product-events";
import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const { isloading } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryProduct | "ALL"
  >("ALL");
  const [selectedState, setSelectedState] = useState<StateProduct | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const res = await handleDeleteProduct(id);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("success");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadProducts(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedCategory,
      selectedState,
      searchQuery,
      sortBy,
    )
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setProducts(res.data.products);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedState,
    sortBy,
    success,
  ]);

  return (
    <main className="flex-1 space-y-4">
      {/* Header */}
      <AdminProductHeader emuted={isloading} />

      {/* Filters and Search */}
      <div className="bg-background border border-border rounded-lg p-4 space-y-4">
        {/* Filters */}
        <AdminProductFilters
          category={{ selectedCategory, setSelectedCategory }}
          state={{ selectedState, setSelectedState }}
          sort={{ sortBy, setSortBy }}
          emuted={isloading}
        />
        {/* Search */}
        <AdminSearch
          search={{ searchQuery, setSearchQuery }}
          placeholder={"Recherche des produits..."}
          emuted={isloading}
        />
      </div>

      {/* Products Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <ProductTable
          products={products}
          handleDelete={handleDelete}
          emuted={isloading}
          loading={loading}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des produits....</p>
          </div>
        ) : (
          products.length == 0 &&
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedCategory !== "ALL" &&
                selectedState === "ALL" &&
                searchQuery === ""
                  ? "Aucun produit ne correspond à cette catégorie"
                  : selectedCategory === "ALL" &&
                      selectedState !== "ALL" &&
                      searchQuery === ""
                    ? "Aucun produit ne correspond à cet état"
                    : searchQuery !== ""
                      ? "Aucun produit ne correspond à votre recherche."
                      : "Aucun produit trouvé"}
              </p>
            </div>
          )
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          emuted={isloading || loading}
        />
      )}
    </main>
  );
}
