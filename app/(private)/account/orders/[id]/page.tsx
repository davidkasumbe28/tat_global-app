"use client";

import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import AccountOrderDetailsColOne from "@/components/order/order-details/order-details-col-one";
import AccountOrderDetailsColTwo from "@/components/order/order-details/order-details-col-two";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/use-theme";
import { Order } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { handleReadUserOrder } from "@/lib/handlers/events-handlers/order-events";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountOrderDetailPage() {
  const { isloading } = useTheme();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    handleReadUserOrder(parseInt(orderId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "Une erreur est survenue lors de la récupération");
        setLoading(false);
      });
  }, [success]);

  if (loading) return <Loading subject="du commande" />;

  if (!order) return <Error error={error} />;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={isloading || loading ? "#" : APP.private.orders}>
              <Button
                disabled={loading || isloading}
                variant={isloading || loading ? "emuted" : "outline"}
                size="sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div>
              <Skeleton emuted={isloading}>
                <h1 className="text-4xl font-bold">{order.orderNumber}</h1>
              </Skeleton>
              <Skeleton emuted={isloading || loading}>
                <p className={cn(!isloading && !loading && "text-gray-500")}>
                  {formatDate(new Date(order?.createdAt) || new Date())}
                </p>
              </Skeleton>
            </div>
          </div>

          {/* <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              disabled={isloading || loading}
              variant={isloading || loading ? "emuted" : "outline"}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isloading || loading}
              variant={isloading || loading ? "emuted" : "outline"}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div> */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col One */}
          <AccountOrderDetailsColOne
            order={order}
            emuted={isloading}
            loading={loading}
          />

          {/* Col Two */}
          <AccountOrderDetailsColTwo
            order={order}
            emuted={isloading}
            setError={setError}
            setSuccess={setSuccess}
            setLoading={setLoading}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
