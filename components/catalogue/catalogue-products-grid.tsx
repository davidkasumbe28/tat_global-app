import Pagination from "@/components/pagination";
import { Product } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import ProductCard from "../product/product-card";
import { Skeleton } from "../ui/skeleton";

interface CatalogueProductsGridProps {
  products: Product[];
  productsCount: number;
  emuted?: boolean;
  loading: boolean;
  totalPages?: number;
  selectedCategory?: string;
  priceRangeEnd: number;
  priceRangeStart: number;
  searchQuery: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function CatalogueProductsGrid({
  products,
  productsCount,
  emuted = true,
  loading,
  totalPages = 0,
  selectedCategory = "ALL",
  priceRangeEnd,
  priceRangeStart,
  searchQuery,
  currentPage,
  onPageChange,
}: CatalogueProductsGridProps) {
  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <Skeleton emuted={emuted}>
          <p className={cn(emuted ? "text-muted-foreground" : "text-gray-500")}>
            {productsCount} produit
            {productsCount !== 1 ? "s" : ""}
          </p>
        </Skeleton>
      </div>

      {loading ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={emuted}>
            {" "}
            <p className={cn(!emuted && "text-gray-500")}>
              Chargement des produits...
            </p>
          </Skeleton>
        </div>
      ) : products.length === 0 &&
        selectedCategory === "ALL" &&
        priceRangeEnd === 1000 &&
        priceRangeStart === 0 &&
        searchQuery === "" ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={emuted}>
            {" "}
            <p className={cn(!emuted && "text-gray-500")}>
              Aucun produit dans le catalogue.
            </p>
          </Skeleton>
        </div>
      ) : products.length === 0 &&
        (selectedCategory !== "ALL" ||
          priceRangeEnd !== 1000 ||
          priceRangeStart !== 0 ||
          searchQuery !== "") ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={emuted}>
            {" "}
            <p className={cn(!emuted && "text-gray-500")}>
              Aucun produit ne correspond à votre recherche.
            </p>
          </Skeleton>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} emuted={emuted} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              emuted={loading || emuted}
            />
          )}
        </>
      )}
    </div>
  );
}
