"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/context/store-context";
import { cn } from "@/lib/utils/utils";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { CategoryProduct } from "@/lib/generated/prisma/enums";
import { CATEGORIES_PRODUCT } from "@/lib/constants/constants";

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
  emuted?: boolean;
}

export default function ProductFilters({
  onFiltersChange,
  emuted = true,
}: ProductFiltersProps) {
  const { selectedCategory, setSelectedCategory, priceRange, setPriceRange } =
    useStore();
  const [sortBy, setSortBy] = useState("newest");

  const handleCategoryChange = (category: CategoryProduct | "ALL") => {
    const newCategory = category == "ALL" ? "ALL" : category;
    setSelectedCategory(newCategory);
    onFiltersChange({ category: newCategory, sortBy, priceRange });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onFiltersChange({ category: selectedCategory, sortBy: sort, priceRange });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    onFiltersChange({
      category: selectedCategory,
      sortBy,
      priceRange: [min, max],
    });
  };

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 space-y-6",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      {/* Categories */}
      <div>
        <Skeleton emuted={emuted}>
          <h3 className="font-semibold mb-4">Catégories</h3>
        </Skeleton>
        <div className="space-y-2">
          {CATEGORIES_PRODUCT.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(cat?.value)}
              disabled={emuted}
              className={cn(
                "block w-full text-left px-3 py-2 border border-border rounded transition",
                emuted
                  ? "text-muted-foreground bg-muted-foreground"
                  : (cat?.value === "ALL" && !selectedCategory) ||
                      selectedCategory === cat?.value
                    ? "bg-foreground text-background hover:bg-primary-dark"
                    : "hover:bg-accent",
              )}
            >
              {cat.label.charAt(0).toUpperCase() + cat?.label.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Skeleton emuted={emuted}>
          <h3 className="font-semibold mb-4">Prix</h3>
        </Skeleton>

        <div className="space-y-3">
          <div>
            <label
              className={cn(
                "text-sm",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-gray-500",
              )}
            >
              Min: {priceRange[0]}$
            </label>
            <input
              type="range"
              min={"0"}
              max={"1000"}
              value={priceRange[0]}
              disabled={emuted}
              onChange={(e) =>
                handlePriceChange(Number(e.target.value), priceRange[1])
              }
              className="w-full"
            />
          </div>
          <div>
            <label
              className={cn(
                "text-sm",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-gray-500",
              )}
            >
              Max: {priceRange[1]}$
            </label>
            <input
              type="range"
              min={"0"}
              max={"1000"}
              value={priceRange[1]}
              disabled={emuted}
              onChange={(e) =>
                handlePriceChange(priceRange[0], Number(e.target.value))
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <Skeleton emuted={emuted}>
          <h3 className="font-semibold mb-4">Trier par</h3>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={emuted}
            className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          >
            <option className="text-black" value="newest">
              Plus récents
            </option>
            <option className="text-black" value="price-asc">
              Prix: bas à haut
            </option>
            <option className="text-black" value="price-desc">
              Prix: haut à bas
            </option>
            <option className="text-black" value="rating">
              Note: élevée
            </option>
          </select>
        </Skeleton>
      </div>

      <Button
        onClick={() => {
          setSelectedCategory("ALL");
          setPriceRange([0, 1000]);
          setSortBy("newest");
        }}
        disabled={emuted}
        variant={emuted ? "emuted" : "outline"}
        className="w-full"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
