"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import { ArrowLeft, Edit, SquareX } from "lucide-react";
import Link from "next/link";
import { formatDate } from "./../../../../lib/utils/date";
import { PaymentMethod, PaymentType, StatusOrder } from "@/lib/generated/prisma/enums";
import { EditButton } from "@/components/edit-button";
import { PAYMENT } from "@/lib/constants/constants";

interface AdminOrderDetailsHeaderProps {
  order?: Order;
  handleUpdate: (id: number) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function AdminOrderDetailsHeader({
  order,
  isEditing,
  setIsEditing,
  handleUpdate,
  emuted = true,
  loading,
  payment,
  setPayment,
  newAdress,
  handleShippingChange,

}: AdminOrderDetailsHeaderProps) {


  const types = Object.keys(PAYMENT) as PaymentType[];

  return (
    <div className="flex justify-between max-md:flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Link href={emuted ? "#" : APP.admin.orders}>
          <Button
            disabled={emuted}
            variant={emuted ? "emuted" : "outline"}
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <Skeleton emuted={emuted || loading}>
            <h1 className="text-4xl font-bold">
              {order?.orderNumber || "ID de la commande"}
            </h1>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className={cn(!emuted && !loading && "text-gray-500")}>
              {formatDate(new Date(order?.createdAt || "Date de création"))}
            </p>
          </Skeleton>
        </div>
      </div>
      <div className="flex justify-end items-end max-md:w-full">
{(StatusOrder.PENDING === order?.status ||
        StatusOrder.CONFIRMED === order?.status ||
        StatusOrder.IN_PREPARATION === order?.status) && (
          <EditButton
            sku={order?.orderNumber}
            handleEdit={() => handleUpdate(order?.id)}
            text="commande"
            emuted={emuted}
            size="lg"
            useText
          >
            <div>
              {order?.status === StatusOrder.PENDING && (
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
      
      {/* {(StatusOrder.PENDING === order?.status ||
        StatusOrder.CONFIRMED === order?.status ||
        StatusOrder.IN_PREPARATION === order?.status) && (
        <Button
          disabled={loading || emuted}
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          variant={emuted ? "emuted" : !isEditing ? "default" : "outline"}
          className={cn(
            !isEditing &&
              !emuted &&
              !loading &&
              "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          {isEditing ? (
            <>
              <SquareX className="sm:hidden" />
              <span className="flex justify-between items-center max-sm:hidden">
                <SquareX className="w-4 h-4 mr-2" />
                <span>Annuler</span>
              </span>
            </>
          ) : (
            <>
              <Edit className="sm:hidden" />
              <span className="flex justify-between items-center max-sm:hidden">
                <Edit className="w-4 h-4 mr-2" />
                <span>Modifier</span>
              </span>
            </>
          )}
        </Button>
      )} */}
    </div>
  );
}
