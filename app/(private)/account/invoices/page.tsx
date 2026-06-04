"use client";

import AccountInvoiceCard from "@/components/invoice/invoice-card";
import InvoiceFilters from "@/components/invoice/invoice-filters";
import InvoiceSearch from "@/components/invoice/invoice-search";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";
import { Invoice } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { StatusInvoice } from "@/lib/generated/prisma/enums";
import { handleReadInvoices } from "@/lib/handlers/events-handlers/invoice-events";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Download, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InvoicesPage() {
  // const [filterStatus, setFilterStatus] = useState("all");

  // const invoices = [
  //   {
  //     id: "inv-1",
  //     number: "TAT-2025-000001",
  //     date: "15 Nov 2025",
  //     dueDate: "15 Dec 2025",
  //     amount: "251.94€",
  //     status: "paid",
  //     order: "TAT-2025-001234",
  //   },
  //   {
  //     id: "inv-2",
  //     number: "TAT-2025-000002",
  //     date: "10 Nov 2025",
  //     dueDate: "10 Dec 2025",
  //     amount: "89.99€",
  //     status: "issued",
  //     order: "TAT-2025-001233",
  //   },
  //   {
  //     id: "inv-3",
  //     number: "TAT-2025-000003",
  //     date: "5 Nov 2025",
  //     dueDate: "5 Dec 2025",
  //     amount: "179.98€",
  //     status: "overdue",
  //     order: "TAT-2025-001232",
  //   },
  // ];

  // const filteredInvoices =
  //   filterStatus === "all"
  //     ? invoices
  //     : invoices.filter((inv) => inv.status === filterStatus);

  const { isloading } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusInvoice | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };


  // const handleUpdate = async (id: number) => {
  //   setLoading(true);
  //   const res = await handleUpdateInvoice(id, { status : invoiceStatus});

  //   if (res.error) {
  //     setError(res.error);
  //     setLoading(false);
  //     return;
  //   }

  //   setSuccess("success");
  //   setLoading(false);
  // };

  useEffect(() => {
    setLoading(true);
    handleReadInvoices(
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

        setInvoices(res.data.invoices);
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
    searchQuery,
    selectedStatus,
    sortBy,
    success,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "issued":
        return "bg-blue-100 text-blue-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-6 flex items-center justify-start gap-4">
        <Link href={isloading ? "#" : APP.private.account}>
          <Button variant={isloading ? "emuted" : "outline"}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Skeleton emuted={isloading}>
          <h1 className="text-4xl font-bold ">Mes Factures</h1>
        </Skeleton>
      </div>


      {/* Invoice Filters */}
      <InvoiceFilters
        status={{ selectedStatus, setSelectedStatus }}
        sort={{ sortBy, setSortBy }}
        emuted={isloading}
      />

      {/* Invoice Search */}
      <InvoiceSearch
        search={{ searchQuery, setSearchQuery }}
        emuted={isloading}
      />

      {loading ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Chargement des factures...
            </p>
          </Skeleton>
        </div>
      ) : invoices.length === 0 && !loading ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Aucune facture trouvée.
            </p>
          </Skeleton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map((invoice) => (
            <AccountInvoiceCard key={invoice.id} item={invoice} emuted={isloading} />
          ))}
        </div>
      )}

      <div className="space-y-8 py-4">
        {totalPages > 1 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            emuted={isloading || loading}
          />
        )}

        {/* <div className="text-end">
          <Link href={isloading || loading ? "#" : APP.public.cart}>
            <Button
              variant={isloading || loading ? "emuted" : "default"}
              className={cn(
                !isloading &&
                  !loading &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Voir mon panier
            </Button>
          </Link>
        </div> */}

      </div>
    </main>
  );
}
