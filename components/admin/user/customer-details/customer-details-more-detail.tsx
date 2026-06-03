"use client";

import { ChangeStateButton } from "@/components/change-state-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { StateUser } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

interface AdminCustomerDetailsMoreDetailProps {
  customer?: Customer;
  handleChangeState: (id: number, currentState: StateUser) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminCustomerDetailsMoreDetail({
  customer,
  handleChangeState,
  emuted = true,
  loading,
}: AdminCustomerDetailsMoreDetailProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-6 space-y-4">
      <div className="space-y-4">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Autre informations</h2>
        </Skeleton>

        <div className="grid grid-cols-1 md:grid-cols-5 space-y-4 md:space-x-2 ">
          <div className="col-span-4 grid grid-cols-2 sm:grid-cols-4">
            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Favoris
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?._count?.favorites || 0}{" "}
                  {(customer?._count?.favorites || 0) > 1
                    ? "favoris"
                    : "favori"}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Avis
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?._count?.reviews || 0} avis
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Paniers
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?._count.carts || 0}{" "}
                  {(customer?._count?.carts || 0) > 1 ? "paniers" : "panier"}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Produits
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?.carts?.length && customer?.carts?.length > 0
                    ? customer?.carts?.reduce(
                        (total, item) => total + item?._count.cartItems,
                        0,
                      ) || 0
                    : 0}{" "}
                  {(customer?.carts?.reduce(
                    (total, item) => total + item?._count.cartItems,
                    0,
                  ) || 0) > 1
                    ? "produits"
                    : "produit"}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Commandes
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?.carts?.length && customer?.carts?.length > 0
                    ? customer?.carts?.reduce(
                        (total, item) => total + item?._count.orders,
                        0,
                      ) || 0
                    : 0}{" "}
                  {(customer?.carts?.reduce(
                    (total, item) => total + item?._count.orders,
                    0,
                  ) || 0) > 1
                    ? "commandes"
                    : "commande"}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Dépenses
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {customer?.carts
                    ?.map((cart) =>
                      cart.orders?.reduce(
                        (total, order) => total + order.totalAmount,
                        0,
                      ),
                    )
                    .reduce((total, cart) => total + cart, 0)}
                  $
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Ajouter
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {formatDate(new Date(customer?.createdAt || Date.now()))}
                </p>
              </Skeleton>
            </div>

            <div>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Modifier
                </p>
              </Skeleton>
              <Skeleton emuted={emuted || loading}>
                <p className="font-semibold">
                  {formatDate(new Date(customer?.updatedAt || Date.now()))}
                </p>
              </Skeleton>
            </div>
          </div>
          <div className="flex md:flex-col xl:flex-row justify-end items-end gap-2">
            {customer?.admin && (
              <Link
                href={emuted ? "#" : APP.admin.managers + "/" + customer?.id}
              >
                <Button
                  disabled={emuted}
                  variant={emuted ? "emuted" : "outline"}
                  size="sm"
                >
                  Administrateur
                </Button>
              </Link>
            )}
            <ChangeStateButton
              useIcon={false}
              handleChangeState={() =>
                handleChangeState(
                  customer?.id as number,
                  customer?.state as StateUser,
                )
              }
              text={"ce client"}
              currentState={customer?.state as StateUser}
              size="default"
              emuted={emuted || loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
