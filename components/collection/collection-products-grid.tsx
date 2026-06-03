import { Collection, Product } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import Pagination from "../pagination";
import ProductCard from "../product/product-card";
import { Skeleton } from "../ui/skeleton";

interface CollectionProductsGridProps {
  emuted?: boolean;
  loading: boolean;
  collections: Collection[];
  selectedCollection: number;
  products: Product[];
  totalPages?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ColletionProductsGrid({
  emuted = true,
  loading,
  collections,
  selectedCollection,
  products,
  totalPages = 0,
  currentPage,
  onPageChange,
}: CollectionProductsGridProps) {
  return (
    <div className="mb-16">
      <Skeleton emuted={emuted || loading}>
        <h2 className="text-3xl font-bold mb-8">
          Produits -{" "}
          {collections.find((c) => c.id === selectedCollection)?.name}
        </h2>
      </Skeleton>
      {loading ? (
        <div className="text-center py-12">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Chargement des produits...
            </p>
          </Skeleton>
        </div>
      ) : products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Aucun produit dans cette collection.
            </p>
          </Skeleton>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
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
