"use client";

import AdminTransactionDetailsHeader from "@/components/admin/transaction/transaction-details/transaction-details-header";
import AdminTransactionDetailsSheet from "@/components/admin/transaction/transaction-details/transaction-details-sheet";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Transaction } from "@/lib/@types/types";
import { handleReadTransaction } from "@/lib/handlers/events-handlers/transaction-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransactionDetailPage() {
    const params = useParams();
    const transactionId = params.id as string;
    const { isloading } = useTheme();
    const [transaction, setTransaction] = useState<Transaction>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setLoading(true);
        handleReadTransaction(parseInt(transactionId))
            .then((res) => {
                if (res.error) {
                    setError(
                        res.error || "Une erreur est survenue lors de la récupération",
                    );
                    setLoading(false);
                    return;
                }
                setTransaction(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    }, [success, isEditing]);

    if (loading) return <Loading subject="de la transaction" />;

    if (!transaction && !loading)
        return (
            <Error
                error={error || "Aucune information disponible sur cette transaction."}
            />
        );

    return (
        <main className="flex-1 space-y-4">
            <div className="space-y-6">
                {/* Header */}
                <AdminTransactionDetailsHeader transaction={transaction} loading={loading} emuted={isloading} />

                {/* Sheet */}
                <AdminTransactionDetailsSheet transaction={transaction} loading={loading} emuted={isloading} />

            </div>
        </main>
    );
}
