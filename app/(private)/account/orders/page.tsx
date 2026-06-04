"use client";

import AccountOrderCard from "@/components/order/order-card";
import AccountOrderFilters from "@/components/order/order-filters";
import OrderSearch from "@/components/order/order-search";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";
import { Order } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { StatusOrder } from "@/lib/generated/prisma/enums";
import { handleReadUserOrders } from "@/lib/handlers/events-handlers/order-events";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountOrdersPage() {
  const { isloading } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<StatusOrder | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE: number = 8;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    handleReadUserOrders(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedStatus,
      searchQuery,
      sortBy,
    )
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "Erreur serveur");
        setLoading(false);
      });
  }, [currentPage, selectedStatus, searchQuery, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      
      <div className="mb-6 flex items-center justify-start gap-4">
        <Link href={isloading ? "#" : APP.private.account}>
          <Button variant={isloading ? "emuted" : "outline"}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <Skeleton emuted={isloading}>
          <h1 className="text-4xl font-bold ">Mes Commandes</h1>
        </Skeleton>
      </div>

      {/* Order Filters */}
      <AccountOrderFilters
        status={{ selectedStatus, setSelectedStatus }}
        sort={{ sortBy, setSortBy }}
        emuted={isloading}
        loading={loading}
      />

      {/* Order Search */}
      <OrderSearch
        search={{ searchQuery, setSearchQuery }}
        emuted={isloading}
      />

      {loading ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Chargement des commandes...
            </p>
          </Skeleton>
        </div>
      ) : orders.length === 0 && !loading ? (
        <div className="text-center py-12 h-full">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Aucune commande trouvée.
            </p>
          </Skeleton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <AccountOrderCard key={order.id} item={order} emuted={isloading} />
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
        <div className="text-end">
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
        </div>
      </div>
    </main>
  );
}
