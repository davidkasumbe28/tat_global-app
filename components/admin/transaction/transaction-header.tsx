"use client";

import { Skeleton } from "@/components/ui/skeleton";

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
      {/* <Link href={emuted ? "#" : APP.admin.collections + "/new"}>
        <Button
          variant={emuted ? "emuted" : "default"}
          className={cn(
            !emuted && "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          <PackagePlus className="sm:hidden" />
          <span className="flex justify-between items-center max-sm:hidden">
            <Plus className="w-4 h-4 mr-2" />
            <span>Ajouter une collection</span>
          </span>
        </Button>
      </Link> */}
    </div>
  );
}
