"use client";

import { ORDER_STATUSES } from "@/lib/constants/constants";
import { StatusOrder } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import { Button } from "../ui/button";

interface AccountOrderFiltersProps {
  status: {
    selectedStatus: StatusOrder | "ALL";
    setSelectedStatus: React.Dispatch<
      React.SetStateAction<StatusOrder | "ALL">
    >;
  };
  sort: {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
  };
  emuted?: boolean;
  loading: boolean;
}

export default function AccountOrderFilters({
  status,
  sort,
  emuted = true,
  loading,
}: AccountOrderFiltersProps) {
  const { selectedStatus, setSelectedStatus } = status;
  const { sortBy, setSortBy } = sort;

  return (
    <div className="grid grid-cols-12 mb-4">
      {/* Status */}
      <div className="col-span-10 sm:col-span-11 flex justify-start items-start gap-2 flex-wrap">
        {ORDER_STATUSES.map((status, index) => (
          <Button
            key={index}
            disabled={loading || emuted}
            onClick={() => setSelectedStatus(status?.value)}
            variant={
              loading || emuted
                ? "emuted"
                : selectedStatus === status.value
                  ? "default"
                  : "outline"
            }
            className={cn(
              !loading &&
                selectedStatus === status.value &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {status.label}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="col-span-2 sm:col-span-1 flex justify-end items-start flex-wrap">
        <Button
          disabled={loading || emuted}
          onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          variant={loading || emuted ? "emuted" : "outline"}
          className={cn(
            !loading &&
              sortBy !== "newest" &&
              "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          {sortBy === "newest" ? <CalendarArrowDown /> : <CalendarArrowUp />}
        </Button>
      </div>
    </div>
  );
}
