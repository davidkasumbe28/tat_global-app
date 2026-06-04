"use client";

import AdminSearch from "@/components/admin/admin-search";
import AdminTransactionFilters from "@/components/admin/transaction/transaction-filters";
import AdminTransactionHeader from "@/components/admin/transaction/transaction-header";
import AdminTransactionSummary from "@/components/admin/transaction/transaction-sammary";
import AdminTransactionTable from "@/components/admin/transaction/transaction-table";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { Transaction } from "@/lib/@types/types";
import { StatusTransaction, TransactionType } from "@/lib/generated/prisma/enums";
import { handleReadTransactions } from "@/lib/handlers/events-handlers/transaction-events";
import { useEffect, useState } from "react";

export default function AdminTransactionsPage() {

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
    handleReadTransactions(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedType,
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
    <main className="flex-1 space-y-4">
      <div className="space-y-6">
        {/* Header */}
        <AdminTransactionHeader emuted={isloading} />

        {/* Summary */}
        <AdminTransactionSummary transactions={transactions} emuted={isloading} loading={loading} />

        {/* Filters and Search */}
        <div className="bg-background border border-border rounded-lg p-4 space-y-4">
          {/* Filters */}
          <AdminTransactionFilters
            type={{ selectedType, setSelectedType }}
            status={{ selectedStatus, setSelectedStatus }}
            sort={{ sortBy, setSortBy }}
            emuted={isloading}
          />
          {/* Search */}
          <AdminSearch
            search={{ searchQuery, setSearchQuery }}
            placeholder={"Recherche des transactions..."}
            emuted={isloading}
          />
        </div>

        {/* Transactions Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <AdminTransactionTable transactions={transactions} emuted={isloading} loading={loading} />

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
