"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/@types/types";
import { StatusTransaction } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";



interface AdminTransactionSummaryProps {
    transactions: Transaction[],
    emuted?: boolean;
    loading: boolean;
}

export default function AdminTransactionSummary({
    transactions,
    emuted = true,
    loading,
}: AdminTransactionSummaryProps) {

    const totalPaid = transactions
        .filter((t) => t.status === StatusTransaction.COMPLETED)
        .reduce((sum, t) => sum + t.amount, 0) || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")} >
                <Skeleton emuted={emuted} >
                    <p className=" text-sm font-semibold mb-2">
                        Montant total payé
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className={cn("text-3xl font-bold", !emuted && !loading && "text-primary-dark")} >
                        {totalPaid.toFixed(2)}$
                    </p>
                </Skeleton>
            </div>

            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")}>
                <Skeleton emuted={emuted} >
                    <p className=" text-sm font-semibold mb-2">
                        Nombre de transactions
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className="text-3xl font-bold">{transactions.length}</p>
                </Skeleton>
            </div>

            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")}>
                <Skeleton emuted={emuted} >
                    <p className="text-sm font-semibold mb-2">
                        Transactions en attente
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className={cn("text-3xl font-bold ", !emuted && !loading && "text-blue-600")} >
                        {transactions.filter((t) => t.status === StatusTransaction.COMPLETED).length}
                    </p>
                </Skeleton>
            </div>
        </div>
    );
}
