"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/@types/types";
import { StatusTransaction } from "@/lib/generated/prisma/enums";
import { handleReadTransactionsSummary } from "@/lib/handlers/events-handlers/transaction-events";
import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";


interface AdminTransactionSummaryProps {
    transactionStatus: StatusTransaction | undefined,
    emuted?: boolean;
    loading: boolean;
}

export default function AdminTransactionSummary({
    transactionStatus,
    emuted = true
}: AdminTransactionSummaryProps) {

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [transactionsSummary, setTransactionsSummary] = useState({
        totalTransactions: 0,
        totalReceipt: 0,
        completedTransactions: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
        refundedTransactions: 0,
        saleTransactions: 0,
        receiptTransactions: 0,
        refundTransactions: 0,
        adjustmentTransactions: 0
    });

    useEffect(() => {
        setLoading(true);
        handleReadTransactionsSummary()
            .then((res) => {
                if (res.error) {
                    setError(
                        res.error || "Une erreur est survenue lors de la récupération du résumé des transactions",
                    );
                    setLoading(false);
                    return;
                }

                setTransactionsSummary(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [transactionStatus]);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")} >
                <Skeleton emuted={emuted} >
                    <p className=" text-sm font-semibold mb-2">
                        Montant total payé
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className={cn("text-3xl font-bold", !emuted && !loading && "text-primary-dark")} >
                        {transactionsSummary.totalReceipt.toFixed(2)}$
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
                    <p className="text-3xl font-bold">{transactionsSummary.totalTransactions}</p>
                </Skeleton>
            </div>

            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")}>
                <Skeleton emuted={emuted} >
                    <p className="text-sm font-semibold mb-2">
                        Transactions en attente
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className={cn("text-3xl font-bold ", !emuted && !loading && "text-yellow-500")} >
                        {transactionsSummary.pendingTransactions}
                    </p>
                </Skeleton>
            </div>
            <div className={cn("border border-border rounded-lg p-6", emuted && "animate-pulse bg-transparent")}>
                <Skeleton emuted={emuted} >
                    <p className="text-sm font-semibold mb-2">
                        Transactions complétées
                    </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading} >
                    <p className={cn("text-3xl font-bold ", !emuted && !loading && "text-blue-600")} >
                        {transactionsSummary.completedTransactions}
                    </p>
                </Skeleton>
            </div>
        </div>
    );
}
