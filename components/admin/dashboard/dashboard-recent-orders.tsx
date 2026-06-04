"use client";


import { Skeleton } from "@/components/ui/skeleton";
import adminChart from "@/lib/data/processed/admin-chart";
import adminStats from "@/lib/data/processed/admin-stats";
import { cn } from "@/lib/utils/utils";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import OrderTable from "../order/order-table";
import { useEffect, useState } from "react";
import { Order } from "@/lib/@types/types";
import { PaymentMethod, PaymentType, StatusOrder } from "@/lib/generated/prisma/enums";
import { handleReadOrders } from "@/lib/handlers/events-handlers/order-events";


interface AdminDashboardRecentOrdersProps {
  emuted?: boolean;
}

export default function AdminDashboardRecentOrders({
  emuted = true
}: AdminDashboardRecentOrdersProps
) {

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

  const ITEMS_PER_PAGE = 6;

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
    <div className="bg-background border border-border rounded-lg p-6">
      <Skeleton emuted={emuted} >
        <h2 className="text-xl font-bold mb-6">Commandes Récentes</h2>
      </Skeleton>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <OrderTable
          orders={orders}
          handleUpdate={handleUpdate}
          payment={payment}
          setPayment={setPayment}
          newAdress={newAdress}
          handleShippingChange={handleShippingChange}
          emuted={emuted}
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

    </div>
  );
}
