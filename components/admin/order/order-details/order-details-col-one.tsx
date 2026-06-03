"use client";

import OrderCartItem from "@/components/order/order-cart-item";
import OrderShipping from "@/components/order/order-shipping";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/lib/@types/types";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";

interface AdminOrderDetailsColOneProps {
  order?: Order;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminOrderDetailsColOne({
  order,
  emuted = true,
  loading,
}: AdminOrderDetailsColOneProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Cart Items */}
      <div className="bg-background border border-border rounded-lg p-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold mb-4">Articles commandés</h2>
        </Skeleton>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des articles...</p>
            </div>
          ) : !loading && order?.cart?.cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun article trouvé</p>
            </div>
          ) : (
            order?.cart?.cartItems.map((item, index) => (
              <OrderCartItem
                key={index}
                item={item}
                emuted={emuted}
                loading={loading}
              />
            ))
          )}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-background border border-border rounded-lg p-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold mb-4">Livraison</h2>
        </Skeleton>

        <OrderShipping
          order={order}
          shippingAddress={JSON.parse(order?.shippingAddress as string)}
          deliveryPerson={{
            name:
              capitalizeFirstLetter(
                (order?.delivery?.deliveryPerson?.user?.firstName ||
                  " ") as string,
              ) +
              " " +
              capitalizeFirstLetter(
                (order?.delivery?.deliveryPerson?.user?.lastName ||
                  " ") as string,
              ),
            email: order?.delivery?.deliveryPerson?.user?.email as string,
            phone: order?.delivery?.deliveryPerson?.user?.phone as string,
          }}
          emuted={emuted}
          loading={loading}
        />
      </div>

      {/* Customer */}
      <div className="bg-background border border-border rounded-lg p-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold mb-4">Informations client</h2>
        </Skeleton>
        <div className="space-y-2">
          <Skeleton emuted={emuted || loading}>
            <p className="font-semibold">
              {capitalizeFirstLetter(order?.user?.firstName || "") +
                " " +
                capitalizeFirstLetter(order?.user?.lastName || "")}{" "}
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              Email: {order?.user?.email}
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              Tél: {order?.user?.phone}
            </p>
          </Skeleton>
        </div>
      </div>
    </div>
  );
}
