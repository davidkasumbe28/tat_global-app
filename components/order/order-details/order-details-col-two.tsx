"use client";

import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/lib/@types/types";
import { ORDER_STATUSES, SHIPPING, TAX } from "@/lib/constants/constants";
import { StatusOrder } from "@/lib/generated/prisma/enums";
import {
  handleDeleteUserOrder,
  handleUpdateOrder,
  handleUpdateUserOrder,
} from "@/lib/handlers/events-handlers/order-events";
import { cn } from "@/lib/utils/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface AccountOrderDetailsColTwoProps {
  order: Order;
  emuted?: boolean;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountOrderDetailsColTwo({
  order,
  emuted = true,
  loading,
  setError,
  setSuccess,
  setLoading,
}: AccountOrderDetailsColTwoProps) {
  const [sure, setSure] = useState(false);
  const [orderStatus, setOrderStatus] = useState(
    order?.status || StatusOrder.PENDING,
  );

  const subTotal =
    order?.cart?.cartItems.reduce((total, item) => {
      return total + (item?.product?.price || 0) * item.quantity;
    }, 0) || 0;

  const handleCompleted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.DELIVERED) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleUpdateUserOrder(order.id, {
      status: StatusOrder.COMPLETED,
    });

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de la mise à jour");
      setLoading(false);
      return;
    }
  };

  const handleCanceledOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.PENDING) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleUpdateUserOrder(order.id, {
      status: StatusOrder.CANCELLED,
    });

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de l'annulation de la commande",
      );
      setLoading(false);
      return;
    }
  };

  const handleChangeOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (!Object.values(StatusOrder).includes(order?.status)) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleUpdateUserOrder(order.id, { status: orderStatus });

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors du changement du status de la commande",
      );
      setLoading(false);
      return;
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.CANCELLED) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleDeleteUserOrder(order.id);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la suppression de la commande",
      );
      setLoading(false);
      return;
    }
  };

  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Status Management */}
      <div className="bg-background border border-border rounded-lg p-4">
        <Skeleton emuted={emuted}>
          <h3 className="font-bold mb-1">Statut</h3>
        </Skeleton>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 justify-end items-center">
          <div className="flex justify-start items-center gap-4">
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                Commande :
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold ",
                  !emuted &&
                    (order.status === StatusOrder.DELIVERED
                      ? "bg-green-100 text-green-700"
                      : order.status === StatusOrder.PENDING
                        ? "bg-blue-100 text-blue-700"
                        : order.status === StatusOrder.CANCELLED
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"),
                )}
              >
                {ORDER_STATUSES.map((status) => {
                  if (status.value === order.status) return status.label;
                })}
              </span>
            </Skeleton>
          </div>
          {order.status === StatusOrder.DELIVERED && (
            <Button
              variant={emuted ? "emuted" : "default"}
              type="button"
              onClick={handleCompleted}
              disabled={
                emuted || loading || order.status !== StatusOrder.DELIVERED
              }
              className={cn(
                "w-full",
                !emuted &&
                  !loading &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Commande livrée
            </Button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-background border border-border rounded-lg p-6 space-y-3">
        <Skeleton emuted={emuted}>
          <h3 className="font-bold">Résumé</h3>
        </Skeleton>
        <div className="space-y-2 text-sm border-t border-b border-border py-3">
          <div className="flex justify-between">
            <Skeleton emuted={emuted}>
              <span>Sous-total</span>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <span>{subTotal.toFixed(2)} $</span>
            </Skeleton>
          </div>
          <div className="flex justify-between">
            <Skeleton emuted={emuted}>
              <span>Livraison</span>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <span
                className={cn(
                  !emuted &&
                    !loading &&
                    subTotal > SHIPPING &&
                    "text-green-600",
                )}
              >
                {subTotal > SHIPPING ? "Gratuit" : SHIPPING.toFixed(2) + "$"}
              </span>
            </Skeleton>
          </div>
          <div className="flex justify-between">
            <Skeleton emuted={emuted}>
              <span>Taxes</span>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <span>{(subTotal * TAX).toFixed(2)} $</span>
            </Skeleton>
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <Skeleton emuted={emuted}>
            <span>Total</span>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <span className="">{order?.totalAmount?.toFixed(2)} $</span>
          </Skeleton>
        </div>
        {order?.status !== StatusOrder.PENDING &&
          order?.paymentMethod?.split("_").includes("cash") && (
            <form className="space-y-3">
              <input
                value={order.totalAmount / 2}
                type="number"
                required
                disabled={
                  emuted ||
                  loading ||
                  ["shipped", "delivered", "cancelled"].includes(order.status)
                }
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                  (emuted || loading) &&
                    "bg-muted-foreground text-muted-foreground animate-pulse",
                )}
              />
              <Button
                variant={emuted ? "emuted" : "default"}
                type="submit"
                disabled={
                  emuted ||
                  loading ||
                  ["shipped", "delivered", "cancelled"].includes(order.status)
                }
                className={cn(
                  "w-full",
                  !emuted &&
                    !loading &&
                    "bg-foreground text-background hover:bg-primary-dark",
                )}
              >
                Mettre à jour
              </Button>
            </form>
          )}
      </div>

      {/* {order.status === "pending" &&
              order?.paymentMethod?.split("_").includes("cash") && (
                <form className="space-y-3">
                  <input
                    value={order.totalAmount / 2}
                    type="number"
                    required
                    disabled={
                      emuted ||
                      loading ||
                      ["shipped", "delivered", "cancelled"].includes(
                        order.status,
                      )
                    }
                    className={cn(
                      "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                      (emuted || loading) &&
                        "bg-muted-foreground text-muted-foreground animate-pulse",
                    )}
                  />
                  <Button
                    variant={emuted ? "emuted" : "default"}
                    type="submit"
                    disabled={
                      emuted ||
                      loading ||
                      ["shipped", "delivered", "cancelled"].includes(
                        order.status,
                      )
                    }
                    className={cn(
                      "w-full",
                      !emuted &&
                        !loading &&
                        "bg-foreground text-background hover:bg-primary-dark",
                    )}
                  >
                    Mettre à jour
                  </Button>
                </form>
              )}
              </div>  */}

      {/* Actions */}
      {/* {order.status === "in_preparation" &&
            (order?.deliveries?.length || 0) === 0 && (
              <form onSubmit={handleSubmit} className="space-y-2">
                {isEditing && (
                  <select
                    value={deliveryMen[0].id}
                    required
                    onChange={(e) =>
                      setNewDeliveryPersonId(parseInt(e.target.value))
                    }
                    disabled={emuted || loading}
                    className={cn(
                      "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                      (emuted || loading) &&
                        "bg-muted-foreground text-muted-foreground animate-pulse",
                    )}
                  >
                    {deliveryMen.map((deliveryPerson, index) => (
                      <option
                        className="text-black"
                        key={index}
                        value={deliveryPerson.id}
                      >
                        {capitalizeFirstLetter(deliveryPerson.firstName) +
                          " " +
                          capitalizeFirstLetter(deliveryPerson.lastName)}
                      </option>
                    ))}
                  </select>
                )}

                <div
                  className={cn(
                    "grid gap-2",
                    isEditing && "grid-cols-2 lg:grid-cols-1",
                  )}
                >
                  <Button
                    variant={emuted || loading ? "emuted" : "outline"}
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                      "w-full",
                      !emuted && !loading && " bg-transparent",
                    )}
                  >
                    {isEditing ? "Retour" : "Designer un livreur"}
                  </Button>

                  {isEditing && (
                    <Button
                      variant={emuted || loading ? "emuted" : "default"}
                      type="submit"
                      onClick={() => {
                        if (!isEditing) setIsEditing(true);
                      }}
                      className={cn(
                        "w-full",
                        !emuted &&
                          !loading &&
                          " text-background hover:bg-primary-dark",
                      )}
                    >
                      Designer
                    </Button>
                  )}*/}
      {/* </div> */}

      {/* <Button
                  variant={emuted || loading ? "emuted" : "outline"}
                  className={cn(
                    "w-full",
                    !emuted &&
                      !loading &&
                      " text-destructive hover:text-destructive bg-transparent",
                  )}
                >
                  Annuler la livraison
                </Button>
              </form> */}
      {/* )} */}

      {order.status === StatusOrder.PENDING && (
        <div className="space-y-2">
          <Button
            variant={emuted || loading ? "emuted" : "outline"}
            onClick={() => setSure(true)}
            className={cn(
              "w-full",
              !emuted &&
                !loading &&
                " text-destructive hover:text-destructive bg-transparent",
            )}
          >
            Annuler la commande
          </Button>
          {sure && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={emuted || loading ? "emuted" : "outline"}
                onClick={() => setSure(false)}
                className={cn(!emuted && !loading && " bg-transparent")}
              >
                <X />
              </Button>
              <Button
                variant={emuted || loading ? "emuted" : "default"}
                onClick={handleCanceledOrder}
                className={cn(
                  !emuted &&
                    !loading &&
                    "text-background hover:bg-primary-dark",
                )}
              >
                <Check />
              </Button>
            </div>
          )}
        </div>
      )}

      {order.status === StatusOrder.CANCELLED && (
        <div className="grid grid-cols-1  gap-2">
          <div className="space-y-2">
            <Button
              variant={emuted || loading ? "emuted" : "outline"}
              onClick={() => {
                setSure(true);
                setOrderStatus(StatusOrder.PENDING);
              }}
              className={cn(
                "w-full",
                !emuted &&
                  !loading &&
                  " text-green-300 hover:text-green-300 bg-transparent",
              )}
            >
              Renvoyer la commande
            </Button>
            {sure && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={emuted || loading ? "emuted" : "outline"}
                  onClick={() => setSure(false)}
                  className={cn(!emuted && !loading && " bg-transparent")}
                >
                  <X />
                </Button>
                <Button
                  variant={emuted || loading ? "emuted" : "default"}
                  onClick={handleChangeOrderStatus}
                  className={cn(
                    !emuted &&
                      !loading &&
                      "text-background hover:bg-primary-dark",
                  )}
                >
                  <Check />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <DeleteButton
              size="default"
              useText
              label="Supprimer la commande"
              handleDelete={handleDelete}
              emuted={emuted}
              text="Votre commande"
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
}
