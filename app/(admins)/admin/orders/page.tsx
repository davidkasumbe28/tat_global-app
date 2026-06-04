"use client";

import AdminSearch from "@/components/admin/admin-search";
import AdminOrderFilters from "@/components/admin/order/order-filters";
import AdminOrderHeader from "@/components/admin/order/order-hearder";
import OrderTable from "@/components/admin/order/order-table";
import AdminProductFilters from "@/components/admin/product/product-filters";
import ErrorInfo from "@/components/error-info";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { Order } from "@/lib/@types/types";
import {
  PaymentMethod,
  PaymentType,
  StatusOrder,
} from "@/lib/generated/prisma/enums";
import { handleReadOrders } from "@/lib/handlers/events-handlers/order-events";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const { isloading } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    PaymentType | "ALL"
  >("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StatusOrder | "ALL">(
    "ALL",
  );
  const [sortBy, setSortBy] = useState("newest");

  const [newAdress, setNewAdress] = useState({});

  const [payment, setPayment] = useState<{
    type: PaymentType;
    method: PaymentMethod;
  }>({
    type: PaymentType.IN_ONE_SLICE,
    method: PaymentMethod.AIRTEL_MONEY,
  });

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewAdress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id: number) => {
    setLoading(true);
    
  //   const res = await handleDeleteorder(id);

  //   if (res.error) {
  //     setError(res.error);
  //     setLoading(false);
  //     return;
  //   }

    setSuccess("success");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadOrders(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedPaymentType,
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

        setOrders(res.data.orders);
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
    selectedPaymentType,
    selectedStatus,
    sortBy,
    success,
  ]);

  return (
    <main className="flex-1 space-y-4">
      {/* Header */}
      <AdminOrderHeader emuted={isloading} />

      {/* Filters and Search */}
      <div className="bg-background border border-border rounded-lg p-4 space-y-4">
        {/* Filters */}
        <AdminOrderFilters
          paymentType={{ selectedPaymentType, setSelectedPaymentType }}
          status={{ selectedStatus, setSelectedStatus }}
          sort={{ sortBy, setSortBy }}
          emuted={isloading}
        />
        {/* Search */}
        <AdminSearch
          search={{ searchQuery, setSearchQuery }}
          placeholder={"Recherche des commandes..."}
          emuted={isloading}
        />
      </div>

      {/* Error info */}
      <ErrorInfo info={error} emuted={isloading} />

      {/* orders Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <OrderTable
          orders={orders}
          handleUpdate={handleUpdate}
          payment={payment}
          setPayment={setPayment}
          newAdress={newAdress}
          handleShippingChange={handleShippingChange}
          emuted={isloading}
          loading={loading}
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des commandes....</p>
          </div>
        ) : (
          orders.length == 0 &&
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedPaymentType !== "ALL" &&
                selectedStatus === "ALL" &&
                searchQuery === ""
                  ? "Aucune commande ne correspond à ce type de paiement"
                  : selectedPaymentType === "ALL" &&
                      selectedStatus !== "ALL" &&
                      searchQuery === ""
                    ? "Aucune commande ne correspond à ce statut"
                    : searchQuery !== ""
                      ? "Aucune commande ne correspond à votre recherche."
                      : "Aucune commande trouvée"}
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
