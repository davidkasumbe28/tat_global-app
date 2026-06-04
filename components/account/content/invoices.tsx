"use client";

import AccountInvoiceCard from "@/components/invoice/invoice-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { handleReadUserInvoices } from "@/lib/handlers/events-handlers/invoice-events";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";

export default function Invoices({ emuted = true }: { emuted?: boolean }) {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const ITEMS_PER_PAGE: number = 6;

  useEffect(() => {
    handleReadUserInvoices(currentPage.toString(), ITEMS_PER_PAGE.toString())
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        setInvoices(res.data.invoices);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err ||
          "Une erreur est survenue lors de la récupération des factures",
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
          <h2 className="text-2xl font-bold ">Mes Factures</h2>
        </Skeleton>
        <Link href={APP.private.invoices}>
          <Button variant={emuted ? "emuted" : "outline"} >Voir plus</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des factures...</p>
          </div>
        ) : invoices.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune facture.</p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <AccountInvoiceCard key={invoice.id} item={invoice} emuted={emuted} />
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
