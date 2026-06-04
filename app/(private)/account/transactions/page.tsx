"use client";

import Pagination from "@/components/pagination";
import AccountTransactionFilters from "@/components/transaction/transaction-filters";
import AccountTransactionHeader from "@/components/transaction/transaction-header";
import TransactionSearch from "@/components/transaction/transaction-search";
import AccountTransactionSummary from "@/components/transaction/transaction-summary";
import AccountTransactionTable from "@/components/transaction/transaction-table";
import { useTheme } from "@/hooks/use-theme";
import { Transaction } from "@/lib/@types/types";
import { StatusTransaction, TransactionType } from "@/lib/generated/prisma/enums";
import { handleReadUserTransactions } from "@/lib/handlers/events-handlers/transaction-events";
import { useEffect, useState } from "react";

export default function TransactionsPage() {

  const { isloading } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<TransactionType | "ALL">(
    "ALL",
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(true);
    handleReadUserTransactions(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedStatus,
      searchQuery,
      sortBy,
    )
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setTransactions(res.data.transactions);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [
    currentPage,
    selectedType,
    searchQuery,
    selectedStatus,
    sortBy,
    success,
  ]);


  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <AccountTransactionHeader emuted={isloading} loading={loading} />

        {/* Summary */}
        <AccountTransactionSummary transactions={transactions} emuted={isloading} loading={loading} />

        {/* Filters */}
        <AccountTransactionFilters sort={{ sortBy, setSortBy }} status={{ selectedStatus, setSelectedStatus }} emuted={isloading} loading={loading} />

        {/* Search */}
        <TransactionSearch search={{ searchQuery, setSearchQuery }} emuted={isloading} />

        {/* Transactions Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <AccountTransactionTable transactions={transactions} emuted={isloading} loading={loading} />

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des transactions....</p>
            </div>
          ) : (
            transactions.length == 0 &&
            !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {selectedType !== "ALL" &&
                    selectedStatus === "ALL" &&
                    searchQuery === ""
                    ? "Aucune transaction ne correspond à ce type"
                    : selectedType === "ALL" &&
                      selectedStatus !== "ALL" &&
                      searchQuery === ""
                      ? "Aucune transaction ne correspond à ce statut"
                      : searchQuery !== ""
                        ? "Aucune transaction ne correspond à votre recherche."
                        : "Aucune transaction trouvée"}
                </p>
              </div>
            )
          )}

        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            emuted={isloading || loading}
          />
        )}

      </div>
    </main>
  );
}
