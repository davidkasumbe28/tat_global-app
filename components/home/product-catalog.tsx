"use client";

import { CategoryProduct, Product } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { handleReadCatalogueProducts } from "@/lib/handlers/events-handlers/product-events";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "../product/product-card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";

export default function ProductCatalog({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryProduct | "ALL"
  >("ALL");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ITEMS_PER_PAGE = 8;

  // const categories: { label: string; value: CategoryProduct | "ALL" }[] = [
  //   { label: "Tous", value: "ALL" },
  //   { label: "Vêtements", value: "CLOTHING" },
  //   { label: "Chaussures", value: "SHOES" },
  //   { label: "Parfums", value: "PERFUMES" },
  //   { label: "Autres", value: "OTHER" },
  // ];

  useEffect(() => {
    setLoading(true);
    handleReadCatalogueProducts(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedCategory,
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
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [currentPage, selectedCategory]);

  return (
    <section className="py-16 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton emuted={emuted}>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Notre Catalogue
          </h2>
        </Skeleton>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {CATEGORIES_PRODUCT.map((category, index) => (
            <Button
              key={index}
              disabled={loading || emuted}
              onClick={() => setSelectedCategory(category?.value)}
              variant={
                loading || emuted
                  ? "emuted"
                  : selectedCategory === category.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !loading &&
                  selectedCategory === category.value &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center items-center w-full p-4">
              <Skeleton emuted={emuted}>
                <p className={cn(!emuted && "text-gray-500")}>
                  Chargement des produits....
                </p>
              </Skeleton>
            </div>
          ) : products.length == 0 && selectedCategory === "ALL" ? (
            <div className="flex justify-center items-center w-full p-4">
              <Skeleton emuted={emuted}>
                <p className={cn(!emuted && "text-gray-500")}>
                  Aucun produit dans le catalogue
                </p>
              </Skeleton>
            </div>
          ) : products.length == 0 && selectedCategory !== "ALL" ? (
            <div className="flex justify-center items-center w-full p-4">
              <Skeleton emuted={emuted}>
                <p className={cn(!emuted && "text-gray-500")}>
                  Aucun produit de cette categorie dans le catalogue
                </p>
              </Skeleton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {!loading &&
                products.length > 0 &&
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    emuted={emuted}
                  />
                ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-end mt-10">
            <Button
              disabled={loading || emuted}
              variant={loading || emuted ? "emuted" : "default"}
              className={cn(
                !loading &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              <Link href={APP.public.catalogue}>
                Découvrir notre catalogue complet
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
