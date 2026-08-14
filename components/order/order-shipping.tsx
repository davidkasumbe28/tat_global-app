"use client";

import { Order } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { APP } from "@/lib/data/raw/routes";
import { usePathname } from "next/navigation";

interface OrderShippingProps {
  order?: Order;
  shippingAddress: { address: string; city: string; country: string };
  deliveryPerson: { name: string; email: string; phone: string };
  emuted?: boolean;
  loading: boolean;
}
export default function OrderShipping({
  order,
  shippingAddress,
  deliveryPerson,
  emuted = true,
  loading,
}: OrderShippingProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 gap-2">
        <div>
          <Skeleton emuted={emuted}>
            <p className={cn("text-sm ", !emuted && "text-gray-500")}>
              Adresse
            </p>
          </Skeleton>

          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {shippingAddress.city}
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {shippingAddress.country}
            </p>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className="font-semibold">{shippingAddress.address || ""}</p>
          </Skeleton>
        </div>

        {order?.delivery && (
          <div>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                Livreur
              </p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p className="font-semibold">{deliveryPerson.name}</p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p className={cn(!emuted && !loading && "text-gray-500")}>
                {deliveryPerson.email}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p className={cn(!emuted && !loading && "text-gray-500")}>
                {deliveryPerson.phone}
              </p>
            </Skeleton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-border pt-3">
        <div>
          <Skeleton emuted={emuted}>
            <p className={cn("text-sm ", !emuted && "text-gray-500")}>
              Commande
            </p>
          </Skeleton>
          <div>
            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Numéro de commande
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-mono font-bold">{order?.orderNumber}</p>
              </Skeleton>
            </div>
            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Numéro de suivi
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-mono font-bold">{order?.trackingNumber}</p>
              </Skeleton>
            </div>
          </div>
        </div>

        {order?.invoice && (
          <div>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                Facture
              </p>
            </Skeleton>
            <div>
              <div>
                <Skeleton emuted={emuted}>
                  <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                    Numéro de facture
                  </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading}>
                  <Link
                    href={
                      pathname.startsWith("/account")
                        ? APP.private.invoices + "/" + order?.invoice?.id
                        : APP.admin.invoices + "/" + order?.invoice?.id
                    }
                  >
                    <p className="font-mono font-bold hover:text-primary-dark">
                      {order?.invoice?.invoiceNumber}
                    </p>
                  </Link>
                </Skeleton>
              </div>
              <div>
                <Skeleton emuted={emuted}>
                  <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                    Numéro de suivi
                  </p>
                </Skeleton>
                <Skeleton emuted={emuted || loading}>
                  <p className="font-mono font-bold">
                    {order?.invoice?.trackingNumber}
                  </p>
                </Skeleton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
