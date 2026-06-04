"use client";

import { Button } from "@/components/ui/button";
import { TRANSACTION_STATUSES, TRANSACTION_TYPES } from "@/lib/constants/constants";
import { StatusTransaction, TransactionType } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
    ArrowDownAz,
    ArrowUpAz,
    CalendarArrowDown,
    CalendarArrowUp,
} from "lucide-react";

interface AdminTransactionFiltersProps {
  type: {
    selectedType: TransactionType | "ALL";
    setSelectedType: React.Dispatch<
      React.SetStateAction<TransactionType | "ALL">
    >;
  };
  status: {
    selectedStatus: StatusTransaction | "ALL";
    setSelectedStatus: React.Dispatch<
      React.SetStateAction<StatusTransaction | "ALL">
    >;
  };
  sort: {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
  };
  emuted?: boolean;
}

export default function AdminTransactionFilters({
  emuted = true,
  type,
  status,
  sort,
}: AdminTransactionFiltersProps) {
  const { selectedType, setSelectedType } = type;
  const { selectedStatus, setSelectedStatus } = status;
  const { sortBy, setSortBy } = sort;

  return (
    <div className="flex flex-col justify-between gap-4">
      {/* State */}
      <div className="flex gap-2 flex-wrap">
        {TRANSACTION_STATUSES.map((status, index) => (
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
        {/* Category */}
        <div className="flex gap-2 flex-wrap">
          {TRANSACTION_TYPES.map((type, index) => (
            <Button
              key={index}
              onClick={() => setSelectedType(type.value)}
              disabled={emuted}
              variant={
                emuted
                  ? "emuted"
                  : selectedType === type.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !emuted &&
                  (selectedType === type.value
                    ? "bg-foreground hover:bg-primary-dark text-background"
                    : ""),
              )}
            >
              {type.label}
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
