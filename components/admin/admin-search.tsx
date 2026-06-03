"use client";

import { cn } from "@/lib/utils/utils";
import { Search } from "lucide-react";

interface AdminSearchProps {
  search: {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  };
  placeholder: string;
  emuted?: boolean;
}

export default function AdminSearch({
  search,
  placeholder,
  emuted = true,
}: AdminSearchProps) {
  const { searchQuery, setSearchQuery } = search;

  return (
    <div className="flex-1 relative">
      <Search
        className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
          emuted
            ? "bg-muted-foreground text-muted-foreground rounded animate-pulse"
            : "text-gray-500",
        )}
      />
      <input
        type="text"
        placeholder={emuted ? "" : placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={emuted}
        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
      />
    </div>
  );
}
