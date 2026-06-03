"use client";

import AdminSearch from "@/components/admin/admin-search";
import AdminInvoiceFilters from "@/components/admin/invoice/invoice-filters";
import AdminInvoiceHeader from "@/components/admin/invoice/invoice-header";
import InvoiceTable from "@/components/admin/invoice/invoice-table";
import AdminOrderFilters from "@/components/admin/order/order-filters";
import AdminOrderHeader from "@/components/admin/order/order-hearder";
import OrderTable from "@/components/admin/order/order-table";
import AdminProductFilters from "@/components/admin/product/product-filters";
import ErrorInfo from "@/components/error-info";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { Invoice, Order } from "@/lib/@types/types";
import {
  PaymentMethod,
  PaymentType,
  StatusInvoice,
} from "@/lib/generated/prisma/enums";
import { handleReadInvoices, handleUpdateInvoice } from "@/lib/handlers/events-handlers/invoice-events";
// import { handleReadInvoices } from "@/lib/handlers/events-handlers/order-events";
import { useEffect, useState } from "react";

export default function AdminInvoicesPage() {
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
  const [invoiceStatus, setInvoiceStatus] = useState<StatusInvoice>(StatusInvoice.DRAFT);

  // const [payment, setPayment] = useState<{
  //   type: PaymentType;
  //   method: PaymentMethod;
  // }>({
  //   type: PaymentType.IN_ONE_SLICE,
  //   method: PaymentMethod.AIRTEL_MONEY,
  // });

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handleShippingChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  // ) => {
  //   const { name, value } = e.target;
  //   setNewAdress((prev) => ({ ...prev, [name]: value }));
  // };

  const handleUpdate = async (id: number) => {
    setLoading(true);
    const res = await handleUpdateInvoice(id, { status : invoiceStatus});

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("success");
    setLoading(false);
  };

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

  return (
    <main className="flex-1 space-y-4">
      {/* Header */}
      <AdminInvoiceHeader emuted={isloading} />

      {/* Filters and Search */}
      <div className="bg-background border border-border rounded-lg p-4 space-y-4">
        {/* Filters */}
        <AdminInvoiceFilters
          status={{ selectedStatus, setSelectedStatus }}
          sort={{ sortBy, setSortBy }}
          emuted={isloading}
        />
        {/* Search */}
        <AdminSearch
          search={{ searchQuery, setSearchQuery }}
          placeholder={"Recherche des factures..."}
          emuted={isloading}
        />
      </div>

      {/* Error info */}
      <ErrorInfo info={error} emuted={isloading} />

      {/* invoices Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <InvoiceTable
          invoices={invoices}
          handleUpdate={handleUpdate}
          invoiceStatus={invoiceStatus}
          setInvoiceStatus={setInvoiceStatus}
          emuted={isloading}
          loading={loading}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des factures....</p>
          </div>
        ) : (
          invoices.length == 0 &&
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedStatus !== "ALL" && searchQuery === ""
                    ? "Aucune facture ne correspond à ce statut"
                    : searchQuery !== ""
                      ? "Aucune facture ne correspond à votre recherche."
                      : "Aucune facture trouvée"}
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
    </main>
  );
}
