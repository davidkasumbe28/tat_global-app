"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { APP } from "@/lib/data/raw/routes";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";
import { Plus } from "lucide-react";


interface AdminTransactionHeaderProps {
  emuted?: boolean;
}

export default function AdminTransactionHeader({
  emuted = true,
}: AdminTransactionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Skeleton emuted={emuted}>
        <h1 className="text-4xl font-bold">Gestion des Transactions</h1>
      </Skeleton>
      <Link href={emuted ? "#" : APP.admin.transactions + "/new"}>
        <Button
          variant={emuted ? "emuted" : "default"}
          className={cn(
            !emuted && "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          <Plus className="sm:hidden" />
          <span className="flex justify-between items-center max-sm:hidden">
            <Plus className="w-4 h-4 mr-2" />
            <span>Nouvelle Transaction</span>
          </span>
        </Button>
      </Link>
    </div>
  );
}
