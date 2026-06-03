"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUSES, PAYMENT_TYPES } from "@/lib/constants/constants";
import { PaymentType, StatusOrder } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
  ArrowDownAz,
  ArrowUpAz,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";

interface AdminOrderFiltersProps {
  paymentType: {
    selectedPaymentType: PaymentType | "ALL";
    setSelectedPaymentType: React.Dispatch<
      React.SetStateAction<PaymentType | "ALL">
    >;
  };
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
}

export default function AdminOrderFilters({
  emuted = true,
  paymentType,
  status,
  sort,
}: AdminOrderFiltersProps) {
  const { selectedPaymentType, setSelectedPaymentType } = paymentType;
  const { selectedStatus, setSelectedStatus } = status;
  const { sortBy, setSortBy } = sort;

  return (
    <div className="flex flex-col justify-between gap-4">
      {/* State */}
      <div className="flex gap-2 flex-wrap">
        {ORDER_STATUSES.map((status, index) => (
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
          {PAYMENT_TYPES.map((type, index) => (
            <Button
              key={index}
              onClick={() => setSelectedPaymentType(type?.value)}
              disabled={emuted}
              variant={
                emuted
                  ? "emuted"
                  : selectedPaymentType === type.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !emuted &&
                  (selectedPaymentType === type.value
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
