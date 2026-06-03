"use client";

import { Button } from "@/components/ui/button";
import {
  CATEGORIES_PRODUCT,
  PRODUCT_STATE,
} from "@/lib/constants/constants";
import { CategoryProduct, StateProduct } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
  ArrowDownAz,
  ArrowUpAz,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";

interface AdminProductFiltersProps {
  category: {
    selectedCategory: CategoryProduct | "ALL";
    setSelectedCategory: React.Dispatch<
      React.SetStateAction<CategoryProduct | "ALL">
    >;
  };
  state: {
    selectedState: StateProduct | "ALL";
    setSelectedState: React.Dispatch<
      React.SetStateAction<StateProduct | "ALL">
    >;
  };
  sort: {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
  };
  emuted?: boolean;
}

export default function AdminProductFilters({
  emuted = true,
  category,
  state,
  sort,
}: AdminProductFiltersProps) {
  const { selectedCategory, setSelectedCategory } = category;
  const { selectedState, setSelectedState } = state;
  const { sortBy, setSortBy } = sort;

  return (
    <div className="flex flex-col justify-between lg:flex-row gap-4">
      {/* Category */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES_PRODUCT.map((category, index) => (
          <Button
            key={index}
            onClick={() => setSelectedCategory(category?.value)}
            disabled={emuted}
            variant={
              emuted
                ? "emuted"
                : selectedCategory === category.value
                  ? "default"
                  : "outline"
            }
            className={cn(
              !emuted &&
                (selectedCategory === category.value
                  ? "bg-foreground hover:bg-primary-dark text-background"
                  : ""),
            )}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="flex justify-between gap-2">
        {/* State */}
        <div className="flex gap-2 flex-wrap">
          {PRODUCT_STATE.map((state, index) => (
            <Button
              key={index}
              onClick={() => setSelectedState(state.value)}
              disabled={emuted}
              variant={
                emuted
                  ? "emuted"
                  : selectedState === state.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !emuted &&
                  (selectedState === state.value
                    ? "bg-foreground hover:bg-primary-dark text-background"
                    : ""),
              )}
            >
              {state.label}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-between gap-2 flex-wrap">
          <Button
            disabled={emuted}
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            variant={emuted ? "emuted" : "outline"}
            className={cn(
              !emuted &&
                sortBy !== "name-asc" &&
                sortBy !== "name-desc" &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {sortBy === "oldest" ? <CalendarArrowUp /> : <CalendarArrowDown />}
          </Button>
          <Button
            disabled={emuted}
            onClick={() =>
              setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")
            }
            variant={emuted ? "emuted" : "outline"}
            className={cn(
              !emuted &&
                (sortBy == "name-asc" || sortBy == "name-desc") &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {sortBy === "name-desc" ? <ArrowUpAz /> : <ArrowDownAz />}
          </Button>
        </div>
      </div>
    </div>
  );
}
