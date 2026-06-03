"use client";

import { useStore } from "@/context/store-context";
import { cn } from "@/lib/utils/utils";
import { Search } from "lucide-react";
import type React from "react";

interface ProductSearchProps {
  emuted?: boolean;
}

export default function ProductSearch({ emuted = true }: ProductSearchProps) {
  const { searchQuery, setSearchQuery } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  return (
    <div className="relative">
      <Search
        className={cn(
          "absolute left-3 top-3.5 w-5 h-5 ",
          emuted
            ? "text-muted-foreground bg-muted-foreground rounded"
            : "text-gray-400",
        )}
      />
      <input
        type="text"
        disabled={emuted}
        value={searchQuery}
        onChange={handleChange}
        placeholder={emuted ? "" : "Rechercher des produits..."}
        className={cn(
          "w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foregorund",
          emuted && " animate-pulse",
        )}
      />
    </div>
  );
}
