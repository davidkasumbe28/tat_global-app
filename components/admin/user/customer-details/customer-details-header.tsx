"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminCustomerDetailsHeaderProps {
  customer?: Customer;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminCustomerDetailsHeader({
  customer,
  emuted = true,
  loading,
}: AdminCustomerDetailsHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={emuted ? "#" : APP.admin.customers}>
        <Button
          disabled={emuted}
          variant={emuted ? "emuted" : "outline"}
          size="sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>

      <div>
        <Skeleton emuted={emuted || loading}>
          <h1 className="text-4xl font-bold">
            {capitalizeFirstLetter(customer?.firstName as string) +
              " " +
              capitalizeFirstLetter(customer?.lastName as string) ||
              "Nom du client"}
          </h1>
        </Skeleton>
        <Skeleton emuted={emuted || loading}>
          <p className={cn(!emuted && !loading && "text-gray-500")}>
            {customer?.email || "Adresse email"}
          </p>
        </Skeleton>
      </div>
    </div>
  );
}
