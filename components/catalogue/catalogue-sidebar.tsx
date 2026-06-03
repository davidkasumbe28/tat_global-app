import ProductFilters from "../product/product-filters";

export default function CatalogueSidebar({
  emuted = true,
  handleFiltersChange,
}: {
  emuted?: boolean;
  handleFiltersChange: (filters: any) => void;
}) {
  return (
    <div className="lg:col-span-1">
      <ProductFilters onFiltersChange={handleFiltersChange} emuted={emuted} />
    </div>
  );
}
