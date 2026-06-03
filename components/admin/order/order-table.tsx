"use client";

import CheckoutStepTwo from "@/components/checkout/checkout-stepTwo";
import { DeleteButton } from "@/components/delete-button";
import { EditButton } from "@/components/edit-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection, Order } from "@/lib/@types/types";
import {
  CATEGORIES_PRODUCT,
  ORDER_STATUSES,
  PAYMENT,
} from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import {
  PaymentMethod,
  PaymentType,
  StateCollection,
  StatusOrder,
} from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OrderTableProps {
  orders: Order[];
  handleUpdate: (id: number) => void;
  emuted?: boolean;
  loading: boolean;
  payment: {
    type: PaymentType;
    method: PaymentMethod;
  };
  setPayment: React.Dispatch<
    React.SetStateAction<{
      type: PaymentType;
      method: PaymentMethod;
    }>
  >;
  newAdress: {
    adress?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  handleShippingChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export default function OrderTable({
  orders,
  handleUpdate,
  emuted = true,
  loading,
  payment,
  setPayment,
  newAdress,
  handleShippingChange,
}: OrderTableProps) {
  // const ors = [
  //   {
  //     id: "TAT-2025-001234",
  //     customer: "Jean Dupont",
  //     date: "18 Nov 2025",
  //     amount: "251.94€",
  //     status: "Livrée",
  //   },
  //   {
  //     id: "TAT-2025-001233",
  //     customer: "Marie Martin",
  //     date: "17 Nov 2025",
  //     amount: "129.99€",
  //     status: "En transit",
  //   },
  //   {
  //     id: "TAT-2025-001232",
  //     customer: "Pierre Bernard",
  //     date: "16 Nov 2025",
  //     amount: "199.98€",
  //     status: "En préparation",
  //   },
  // ];

  const types = Object.keys(PAYMENT) as PaymentType[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Commande</th>
            <th className="text-left py-3 px-4 font-semibold">Client</th>
            <th className="text-left py-3 px-4 font-semibold">Date</th>
            <th className="text-left py-3 px-4 font-semibold">Montant</th>
            <th className="text-left py-3 px-4 font-semibold">Statut</th>
            <th className="text-left py-3 px-4 font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-border hover:bg-accent transition"
            >
              <td className="py-3 px-4 font-semibold">{order.orderNumber}</td>
              <td className="py-3 px-4">
                {capitalizeFirstLetter(order?.cart?.user?.firstName as string) +
                  " " +
                  capitalizeFirstLetter(order?.cart?.user?.lastName as string)}
              </td>
              <td className="py-3 px-4">
                {formatDate(new Date(order.createdAt))}
              </td>
              <td className="py-3 px-4 text-foreground font-bold">
                {order.totalAmount?.toFixed(2)}$
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    order.status === StatusOrder.DELIVERED
                      ? "bg-green-100 text-green-700"
                      : order.status === StatusOrder.SHIPPED
                        ? "bg-blue-100 text-blue-700"
                        : order.status === StatusOrder.CANCELLED
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700",
                  )}
                >
                  {ORDER_STATUSES.map((status) => {
                    if (status.value == order.status) return status.label;
                  })}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={emuted ? "#" : APP.admin.orders + "/" + order.id}>
                    <Button
                      size="sm"
                      variant={emuted ? "emuted" : "default"}
                      className={cn(!emuted && " hover:bg-primary-dark")}
                    >
                      <Eye className={cn("w-4 h-4")} />
                    </Button>
                  </Link>
                  {(StatusOrder.PENDING === order.status ||
                    StatusOrder.CONFIRMED === order.status ||
                    StatusOrder.IN_PREPARATION === order.status) && (
                    <EditButton
                      sku={order.orderNumber}
                      handleEdit={() => handleUpdate(order.id)}
                      text="commande"
                      emuted={emuted}
                    >
                      <div>
                        {order.status === StatusOrder.PENDING && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                              {types.map((type: PaymentType, index: number) => (
                                <div key={index} className="space-y-1">
                                  <label
                                    className={cn(
                                      "flex items-center gap-2 py-2 px-4 border border-border rounded-lg cursor-pointer transition",
                                      emuted
                                        ? "bg-transparent animate-pulse"
                                        : "hover:bg-accent",
                                    )}
                                  >
                                    <input
                                      type="radio"
                                      disabled={emuted}
                                      value={type}
                                      checked={payment.type == type}
                                      onChange={() =>
                                        setPayment((prev) => ({
                                          ...prev,
                                          type: type as PaymentType,
                                        }))
                                      }
                                      className={cn(
                                        "w-4 h-4",
                                        emuted &&
                                          "cursor-not-allowed animate-pulse",
                                      )}
                                    />
                                    <Skeleton emuted={emuted}>
                                      <span>{PAYMENT[type].value}</span>
                                    </Skeleton>
                                  </label>
                                  {payment.type === type && (
                                    <div className="space-y-2">
                                      {Object.keys(PAYMENT[type].options)?.map(
                                        (method, index: number) => (
                                          <label
                                            key={index}
                                            className={cn(
                                              "flex items-center gap-2 py-2 px-4 border border-border rounded-lg cursor-pointer transition",
                                              emuted
                                                ? "bg-transparent animate-pulse"
                                                : "hover:bg-accent",
                                            )}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                payment.method === method
                                              }
                                              onChange={() =>
                                                setPayment((prev) => ({
                                                  ...prev,
                                                  method:
                                                    method as PaymentMethod,
                                                }))
                                              }
                                              className={cn(
                                                "w-4 h-4",
                                                emuted &&
                                                  "cursor-not-allowed animate-pulse",
                                              )}
                                            />
                                            <Skeleton emuted={emuted}>
                                              <span>
                                                {PAYMENT[type]?.options[method]}
                                              </span>
                                            </Skeleton>
                                          </label>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {order.status === StatusOrder.CONFIRMED && (
                          <div className="space-y-4">
                            <input
                              type="text"
                              name="address"
                              placeholder="Adresse"
                              required
                              value={newAdress.adress || ""}
                              onChange={handleShippingChange}
                              disabled={emuted || loading}
                              className={cn(
                                "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                                (emuted || loading) &&
                                  "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
                              )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                              <input
                                type="text"
                                name="zipCode"
                                placeholder="Code postal"
                                required
                                value={newAdress.zipCode || ""}
                                onChange={handleShippingChange}
                                disabled={emuted || loading}
                                className={cn(
                                  "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                                  (emuted || loading) &&
                                    "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
                                )}
                              />
                              <input
                                type="text"
                                name="city"
                                placeholder="Ville"
                                required
                                value={newAdress.city || ""}
                                onChange={handleShippingChange}
                                disabled={emuted || loading}
                                className={cn(
                                  "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                                  (emuted || loading) &&
                                    "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
                                )}
                              />
                              <select
                                name="country"
                                required
                                value={newAdress.country || ""}
                                onChange={handleShippingChange}
                                disabled={emuted || loading}
                                className={cn(
                                  "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                                  (emuted || loading) &&
                                    "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
                                )}
                              >
                                <option className="text-black">France</option>
                                <option className="text-black">Belgique</option>
                                <option className="text-black">Suisse</option>
                                <option className="text-black">
                                  Luxembourg
                                </option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* update delivery person */}
                        {order.status === StatusOrder.IN_PREPARATION && (
                          <div>update delivery person</div>
                        )}

                        <p className=" font-extralight text-end text-sm text-gray-500 py-4">
                          Voulez-vous vraiment modifier cette commande ?
                        </p>
                      </div>
                    </EditButton>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
