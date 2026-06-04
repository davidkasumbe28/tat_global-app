"use client";

import AccountTransactionCard from "@/components/transaction/transaction-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { handleReadUserTransactions } from "@/lib/handlers/events-handlers/transaction-events";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

export default function Transactions({ emuted = true }: { emuted?: boolean }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE: number = 6;

  useEffect(() => {
    handleReadUserTransactions(currentPage.toString(), ITEMS_PER_PAGE.toString())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        setTransactions(res.data.transactions);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err ||
          "Une erreur est survenue lors de la récupération des transactions",
        );
        setLoading(false);
      });
  }, []);

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-6 space-y-4",
        emuted
          ? "bg-muted-transparent animate-pulse text-muted-foreground"
          : "bg-background text-foreground",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-2xl font-bold ">Mes Transactions</h2>
        </Skeleton>
        <Link href={APP.private.transactions}>
          <Button variant={emuted ? "emuted" : "outline"} >Voir plus</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des transactions...</p>
          </div>
        ) : transactions.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune transaction.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <AccountTransactionCard key={transaction.id} item={transaction} emuted={emuted} />
          ))
        )}
      </div>

      {/* <div className="flex max-sm:flex-col justify-end items-center gap-6  py-4">
        <Link href={emuted || loading ? "#" : APP.public.cart}>
          <Button
            variant={emuted || loading ? "emuted" : "default"}
            className={cn(
              !emuted &&
              !loading &&
              "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            Voir mon compte
          </Button>
        </Link>
      </div> */}

    </div>
  );
}
