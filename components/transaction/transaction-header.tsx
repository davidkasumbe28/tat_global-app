"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";




interface AccountTransactionHeaderProps {
  emuted?: boolean;
  loading: boolean;
}

export default function AccountTransactionHeader({
  emuted = true,
  loading,
}: AccountTransactionHeaderProps) {

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : APP.private.account}>
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
              Mes Transactions
            </h1>
          </Skeleton>
          {/* <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {formatDate(new Date(invoice?.createdAt || new Date()))}
            </p>
          </Skeleton> */}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">

        <Button
          disabled={loading || emuted}
          variant={emuted ? "emuted" : "default"}
          className={cn(
            !emuted &&
              !loading &&
              "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          <Download className="sm:hidden" />
          <span className="flex justify-between items-center max-sm:hidden">
            <Download className="w-4 h-4 mr-2" />
            <span>Télécharger</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
