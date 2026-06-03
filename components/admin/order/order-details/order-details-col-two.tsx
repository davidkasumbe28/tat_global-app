"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Manager, Order } from "@/lib/@types/types";
import {
  ORDER_STATUSES,
  PAYMENT,
  SHIPPING,
  TAX,
  TRANSACTION_TYPES,
} from "@/lib/constants/constants";
import {
  PaymentMethod,
  PaymentType,
  StatusOrder,
  TransactionType,
} from "@/lib/generated/prisma/enums";
import { handleCreateDelivery } from "@/lib/handlers/events-handlers/delivery-events";
import { handleCreateInvoice } from "@/lib/handlers/events-handlers/invoice-events";
import {
  handleDeleteUserOrder,
  handleUpdateOrder,
  handleUpdateUserOrder,
} from "@/lib/handlers/events-handlers/order-events";
import { handleCreateTransaction } from "@/lib/handlers/events-handlers/transaction-events";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminOrderDetailsColTwoProps {
  order?: Order;
  managers: Manager[];
  emuted?: boolean;
  newTransaction: {
    amount: number;
    method: PaymentMethod;
    type: TransactionType;
    reference: string;
  };
  handleChangeTransaction: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  loading: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminOrderDetailsColTwo({
  order,
  managers,
  emuted = true,
  newTransaction,
  handleChangeTransaction,
  loading,
  setError,
  setSuccess,
  setLoading,
}: AdminOrderDetailsColTwoProps) {
  const [sure, setSure] = useState(false);
  const [deliveryPersonId, setDeliveryPersonId] = useState(
    managers[0]?.id || 0,
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

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.PENDING) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleCreateInvoice({
      userId: order.userId,
      orderId: order.id,
      notes:
        "Merci de nous faire confiance ! Nous sommes ravis de vous servir et espérons que vous apprécierez votre achat. Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter. Nous sommes là pour vous aider !",
    });

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la création de la facture",
      );
      setLoading(false);
      return;
    }

    setSuccess("La commande a été confirmée avec succès");
    setLoading(false);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.CONFIRMED) return;

    setError("");
    setLoading(true);
    setSuccess("");

    // console.log({
    //   userId: order.userId,
    //   invoiceId: order.invoice?.id as number,
    //   amount: newTransaction.amount,
    //   method: newTransaction.method,
    //   type: newTransaction.type,
    //   reference: "REF-" + Date.now(), // You can add a reference if needed
    // });

    const res = await handleCreateTransaction({
      userId: order.userId,
      invoiceId: order.invoice?.id as number,
      amount: newTransaction.amount,
      method: newTransaction.method,
      type: newTransaction.type,
      reference: "REF" + Date.now(), // You can add a reference if needed
    });

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la transaction du paiement",
      );
      setLoading(false);
      return;
    }

    setSuccess("La transaction a été enregistrée avec succès");
    setLoading(false);
  };

  const handlePlanDelivery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) return;
    else if (order?.status !== StatusOrder.IN_PREPARATION) return;

    setError("");
    setLoading(true);
    setSuccess("");

    const res = await handleCreateDelivery({
      deliveryPersonId,
      userId: order?.userId,
      orderId: order?.id,
    });

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la designation du livreur",
      );
      setLoading(false);
      return;
    }

    setSuccess("Désignation du livreur éffectuer");
    setLoading(false);
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
                Commande
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold ",
                  !emuted &&
                    (order?.status === StatusOrder.DELIVERED
                      ? "bg-green-100 text-green-700"
                      : order?.status === StatusOrder.PENDING
                        ? "bg-blue-100 text-blue-700"
                        : order?.status === StatusOrder.CANCELLED
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"),
                )}
              >
                {ORDER_STATUSES.map((status) => {
                  if (status.value === order?.status) return status.label;
                })}
              </span>
            </Skeleton>
          </div>
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

      {/* Plan delivery */}
      {order?.status === StatusOrder.IN_PREPARATION &&
        !order?.delivery?.deliveryPersonId && (
          <div className="space-y-2 border rounded-lg p-5">
            <Skeleton emuted={emuted}>
              <span className="text-lg font-bold">Désignation du livreur</span>
            </Skeleton>

            <select
              value={deliveryPersonId}
              required
              onChange={(e) => setDeliveryPersonId(parseInt(e.target.value))}
              disabled={emuted || loading}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                (emuted || loading) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            >
              {managers.map((manager, index) => (
                <option className="text-black" key={index} value={manager.id}>
                  {capitalizeFirstLetter(manager.firstName) +
                    " " +
                    capitalizeFirstLetter(manager.lastName)}
                </option>
              ))}
            </select>

            <div className="space-y-2">
              <Button
                variant={emuted || loading ? "emuted" : "outline"}
                onClick={() => setSure(true)}
                className={cn(
                  "w-full",
                  !emuted &&
                    !loading &&
                    " text-yellow-500 hover:text-yellow-500 bg-transparent",
                )}
              >
                Désigner
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
                    onClick={handlePlanDelivery}
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
          </div>
        )}

      {/* Confirmation */}
      <>
        {order?.status === StatusOrder.PENDING && (
          <div className="space-y-2">
            <Button
              variant={emuted || loading ? "emuted" : "outline"}
              onClick={() => setSure(true)}
              className={cn(
                "w-full",
                !emuted &&
                  !loading &&
                  " text-yellow-500 hover:text-yellow-500 bg-transparent",
              )}
            >
              Confirmer la commande
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
                  onClick={handleConfirm}
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
      </>

      {/* Paiement Transaction */}
      <>
        {order?.status === StatusOrder.CONFIRMED && (
          <div className="space-y-2 border rounded-lg p-5">
            <Skeleton emuted={emuted}>
              <span className="text-lg font-bold">
                Paiement{" "}
                {order.paymentType === PaymentType.IN_ONE_SLICE
                  ? "1ere tranche"
                  : ""}{" "}
              </span>
            </Skeleton>

            {order.paymentMethod !== PaymentMethod.CASH_ON_DELIVERY && (
              <>
                <input
                  value={newTransaction.amount}
                  type="number"
                  name="amount"
                  onChange={handleChangeTransaction}
                  required
                  disabled={emuted || loading}
                  className={cn(
                    "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                    (emuted || loading) &&
                      "bg-muted-foreground text-muted-foreground animate-pulse",
                  )}
                />
                <select
                  value={newTransaction.method}
                  required
                  name="method"
                  onChange={handleChangeTransaction}
                  disabled={emuted || loading}
                  className={cn(
                    "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                    (emuted || loading) &&
                      "bg-muted-foreground text-muted-foreground animate-pulse",
                  )}
                >
                  {Object.keys(PAYMENT.IN_ONE_SLICE.options).map(
                    (option, index) => {
                      if (option !== "CASH_ON_DELIVERY")
                        return (
                          <option
                            className="text-black"
                            key={index}
                            value={option}
                          >
                            {PAYMENT.IN_ONE_SLICE.options[option]}
                          </option>
                        );
                    },
                  )}
                </select>
                <select
                  value={newTransaction.type}
                  required
                  onChange={handleChangeTransaction}
                  name="type"
                  disabled={emuted || loading}
                  className={cn(
                    "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                    (emuted || loading) &&
                      "bg-muted-foreground text-muted-foreground animate-pulse",
                  )}
                >
                  {TRANSACTION_TYPES.map((type, index) => {
                    if (type.value !== "ALL")
                      return (
                        <option
                          className="text-black"
                          key={index}
                          value={type.value}
                        >
                          {type.label}
                        </option>
                      );
                  })}
                </select>
              </>
            )}

            <div className="space-y-2">
              <Button
                variant={emuted || loading ? "emuted" : "outline"}
                onClick={() => setSure(true)}
                className={cn(
                  "w-full",
                  !emuted &&
                    !loading &&
                    " text-yellow-500 hover:text-yellow-500 bg-transparent",
                )}
              >
                Enregistrer
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
                    onClick={handleSaveTransaction}
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
          </div>
        )}
      </>
    </div>
  );
}
