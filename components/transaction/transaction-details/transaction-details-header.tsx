"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";




interface AccountTransactionDetailsHeaderProps {
  transaction?: Transaction;
  emuted?: boolean;
  loading: boolean;
}

export default function AccountTransactionDetailsHeader({
  transaction,
  emuted = true,
  loading,
}: AccountTransactionDetailsHeaderProps) {

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : APP.private.transactions}>
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
              {transaction?.transactionNumber || "ID de la transaction"}
            </h1>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {formatDate(new Date(transaction?.createdAt || new Date()))}
            </p>
          </Skeleton>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Button
          disabled={loading || emuted}
          variant={emuted ? "emuted" : "outline"}
        >
          <Printer className="sm:hidden" />
          <span className="flex justify-between items-center max-sm:hidden">
            <Printer className="w-4 h-4 mr-2" />
            <span>Imprimer</span>
          </span>
        </Button>

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
