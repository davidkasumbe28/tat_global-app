import ProductSearch from "../product/product-search";
import { Skeleton } from "../ui/skeleton";

export default function CatalogueHeader({
  emuted = true,
}: {
  emuted?: boolean;
}) {
  return (
    <div className="mb-8">
      <Skeleton emuted={emuted}>
        <h1 className="text-4xl font-bold mb-6">Catalogue Complet</h1>
      </Skeleton>
      <ProductSearch emuted={emuted} />
    </div>
  );
}
