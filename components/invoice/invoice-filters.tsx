"use client";

import { Button } from "@/components/ui/button";
import { INVOICE_STATUSES } from "@/lib/constants/constants";
import { StatusInvoice } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
  ArrowDownAz,
  ArrowUpAz,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";

interface AccountInvoiceFiltersProps {
  status: {
    selectedStatus: StatusInvoice | "ALL";
    setSelectedStatus: React.Dispatch<
      React.SetStateAction<StatusInvoice | "ALL">
    >;
  };
  sort: {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
  };
  emuted?: boolean;
}

export default function AccountInvoiceFilters({
  emuted = true,
  status,
  sort,
}: AccountInvoiceFiltersProps) {
  const { selectedStatus, setSelectedStatus } = status;
  const { sortBy, setSortBy } = sort;

  return (
    <div className="flex justify-between mb-4">

      {/* State */}
      <div className="flex gap-2 flex-wrap">
        {INVOICE_STATUSES.map((status, index) => (
          <Button
            key={index}
            onClick={() => setSelectedStatus(status.value)}
            disabled={emuted}
            variant={
              emuted
                ? "emuted"
                : selectedStatus === status.value
                  ? "default"
                  : "outline"
            }
            className={cn(
              !emuted &&
                (selectedStatus === status.value
                  ? "bg-foreground hover:bg-primary-dark text-background"
                  : ""),
            )}
          >
            {status.label}
          </Button>
        ))}
      </div>

      <div className="flex justify-between gap-2">
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
        </div>
      </div>
    </div>
  );
}
