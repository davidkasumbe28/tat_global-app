"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Invoice } from "@/lib/@types/types";
import { INVOICE_STATUSES } from "@/lib/constants/constants";
import company from "@/lib/data/raw/company";
import { StatusInvoice } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/invoice.utils";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";

interface AdminInvoiceDetailsSheetProps {
  invoice?: Invoice;
  emuted?: boolean;
  loading: boolean;
}

export default function AdminInvoiceDetailsSheet({
  invoice,
  emuted = true,
  loading,
}: AdminInvoiceDetailsSheetProps) {
  console.log("Invoice in Sheet : ", invoice);

  const subtotal =
    invoice?.order?.cart?.cartItems?.reduce(
      (total, item) => total + (item?.product?.price || 0) * item?.quantity,
      0,
    ) || 0;

  const tax = subtotal * (invoice?.taxAmount || 0);

  return (
    <div className="border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex max-md:flex-col items-start justify-between border-b border-border gap-2 pb-6">
        {/* Company Info */}
        <div className="flex flex-col justify-start items-start w-full">
          <Skeleton emuted={emuted}>
            <h1
              className={cn(
                "text-3xl font-bold",
                !emuted && "text-primary-dark",
              )}
            >
              {company.info.name}
            </h1>
          </Skeleton>
          <div className="mt-4 text-sm space-y-1">
            <Skeleton emuted={emuted}>
              <p>{company.info.address}</p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p>
                {company.info.city} , {company.info.country}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p>
                <span className={cn(!emuted && "text-gray-500 ")}>Tel : </span>
                {company.info.phone}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p>
                <span className={cn(!emuted && "text-gray-500 ")}>
                  Email :{" "}
                </span>
                {company.info.email}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p>
                <span className={cn(!emuted && "text-gray-500 ")}>
                  Siret :{" "}
                </span>
                {company.info.siret}
              </p>
            </Skeleton>
          </div>
        </div>

        <div className="flex flex-col justify-end items-end w-full">
          <div className="mt-4 space-y-2 text-sm text-left">
            <Skeleton emuted={emuted || loading}>
              <p
                className={cn(
                  "text-2xl font-bold mt-2",
                  !emuted && !loading && "text-primary-dark",
                )}
              >
                {invoice?.invoiceNumber || "ID de la facture"}
              </p>
            </Skeleton>

            <Skeleton emuted={emuted || loading}>
              <p>
                <span
                  className={cn(
                    " font-normal",
                    !emuted && !loading && "text-gray-500",
                  )}
                >
                  Status :{" "}
                </span>{" "}
                <span
                  className={cn(
                    "font-semibold",
                    !emuted &&
                      !loading &&
                      (invoice?.status === StatusInvoice.PAID
                        ? "text-green-500"
                        : invoice?.status === StatusInvoice.ISSUED
                          ? "text-blue-500"
                          : invoice?.status === StatusInvoice.CANCELLED
                            ? "text-red-500"
                            : "text-yellow-500"),
                  )}
                >
                  {INVOICE_STATUSES.find(
                    (status) => status.value === invoice?.status,
                  )?.label || "Statut inconnu"}
                </span>
              </p>
            </Skeleton>

            <Skeleton emuted={emuted || loading}>
              <p>
                <span className={cn(!emuted && !loading && "text-gray-500")}>
                  Date d'émission :
                </span>{" "}
                {formatDate(new Date(invoice?.createdAt || new Date()))}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p>
                <span className={cn(!emuted && !loading && "text-gray-500")}>
                  Échéance :
                </span>{" "}
                {formatDate(new Date(invoice?.dueDate || new Date()))}
              </p>
            </Skeleton>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-2 ">Facturé à : </h3>
          </Skeleton>
          <Skeleton emuted={emuted || loading}>
            <p className="font-semibold">
              {capitalizeFirstLetter(invoice?.user?.firstName || "John") +
                " " +
                capitalizeFirstLetter(invoice?.user?.lastName || "Doe")}
            </p>
          </Skeleton>
          <div
            className={cn("text-sm", !emuted && !loading && "text-gray-500")}
          >
            <Skeleton emuted={emuted || loading}>
              <p>{invoice?.user?.address}</p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p>
                {invoice?.user?.city} , {invoice?.user?.country}
              </p>
            </Skeleton>
            <Skeleton emuted={emuted || loading}>
              <p className="">{invoice?.user?.email}</p>
            </Skeleton>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Produit</th>
              <th className="text-center py-3 px-4 font-semibold">Quantité</th>
              <th className="text-right py-3 px-4 font-semibold">P.U</th>
              <th className="text-right py-3 px-4 font-semibold">P.T</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.order?.cart?.cartItems?.map((item, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="py-3 px-4">
                  {item?.product?.name} ({item?.product?.sku}){" "}
                </td>
                <td className="py-3 px-4 text-center">{item?.quantity}</td>
                <td className="py-3 px-4 text-right">
                  {item?.product?.price?.toFixed(2)}$
                </td>
                <td className="py-3 px-4 text-right font-semibold">
                  {(item?.quantity * (item?.product?.price || 0))?.toFixed(2)}$
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-80 space-y-2 border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Sous-total:</span>
            <span className="font-semibold">{subtotal.toFixed(2)}$</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              TVA ({(invoice?.taxAmount || 0) * 100}%):
            </span>
            <span className="font-semibold">{tax?.toFixed(2)}$</span>
          </div>
          <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-primary text-2xl">
              {invoice?.order?.totalAmount?.toFixed(2)}$
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-8 space-y-4">
        {invoice?.notes && (
          <div className="text-center">
            {/* <h4 className="font-semibold mb-2">Notes:</h4> */}
            <p className="text-sm text-gray-500">{invoice?.notes}</p>
          </div>
        )}

        <div className="text-center">
          {/* <h4 className="font-semibold mb-2">Conditions de paiement:</h4> */}
          <p className="text-sm text-gray-500">
            Les marchandises vendues ne sont ni échangées ni reprises
          </p>
          <p className="text-sm text-gray-500">
            {" "}
            "Autorisation d'acquitter la TVA d'àprès les débits"{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
