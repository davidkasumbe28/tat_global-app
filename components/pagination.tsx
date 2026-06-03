"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  checked?: boolean;
  emuted?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  checked = false,
  emuted = true,
}: PaginationProps) {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const startPage = Math.max(1, currentPage - 2);
    return startPage + i;
  }).filter((page) => page <= totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant={emuted ? "emuted" : "outline"}
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || emuted}
        className="p-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={
            emuted ? "emuted" : currentPage === page ? "default" : "outline"
          }
          size="sm"
          className={
            !emuted && currentPage === page
              ? "bg-foreground hover:bg-primary-dark text-background"
              : ""
          }
        >
          {checked ? <Check /> : page}
        </Button>
      ))}

      <Button
        variant={emuted ? "emuted" : "outline"}
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || emuted}
        className="p-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
