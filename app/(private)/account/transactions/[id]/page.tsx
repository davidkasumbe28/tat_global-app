"use client";

import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import AccountTransactionDetailsHeader from "@/components/transaction/transaction-details/transaction-details-header";
import AccountTransactionDetailsSheet from "@/components/transaction/transaction-details/transaction-details-sheet";
import { useTheme } from "@/hooks/use-theme";
import { Transaction } from "@/lib/@types/types";
import { handleReadUserTransaction } from "@/lib/handlers/events-handlers/transaction-events";
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
    handleReadUserTransaction(parseInt(transactionId))
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
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <AccountTransactionDetailsHeader transaction={transaction} loading={loading} emuted={isloading} />

        {/* Sheet */}
        <AccountTransactionDetailsSheet transaction={transaction} loading={loading} emuted={isloading} />

      </div>
    </main>
  );
}
