"use client";

import { ChangeStateButton } from "@/components/change-state-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Manager } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { StateUser } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

interface AdminManagerDetailsMoreDetailProps {
  manager?: Manager;
  handleChangeState: (id: number, currentState: StateUser) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminManagerDetailsMoreDetail({
  manager,
  handleChangeState,
  emuted = true,
  loading,
}: AdminManagerDetailsMoreDetailProps) {
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
                  {manager?._count?.favorites || 0}{" "}
                  {(manager?._count?.favorites || 0) > 1
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
                  {manager?._count?.reviews || 0} avis
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
                  {manager?._count.carts || 0}{" "}
                  {(manager?._count?.carts || 0) > 1 ? "paniers" : "panier"}
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
                  {manager?.carts?.length && manager?.carts?.length > 0
                    ? manager?.carts?.reduce(
                        (total, item) => total + item?._count.cartItems,
                        0,
                      ) || 0
                    : 0}{" "}
                  {(manager?.carts?.reduce(
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
                  {manager?.carts?.length && manager?.carts?.length > 0
                    ? manager?.carts?.reduce(
                        (total, item) => total + item?._count.orders,
                        0,
                      ) || 0
                    : 0}{" "}
                  {(manager?.carts?.reduce(
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
                  {manager?.carts
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
                  {formatDate(new Date(manager?.createdAt || Date.now()))}
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
                  {formatDate(new Date(manager?.updatedAt || Date.now()))}
                </p>
              </Skeleton>
            </div>
          </div>
          <div className="flex md:flex-col xl:flex-row justify-end items-end gap-2">
            {manager?.admin && (
              <Link
                href={emuted ? "#" : APP.admin.managers + "/" + manager?.id}
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
                  manager?.id as number,
                  manager?.state as StateUser,
                )
              }
              text={"ce client"}
              currentState={manager?.state as StateUser}
              size="default"
              emuted={emuted || loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
