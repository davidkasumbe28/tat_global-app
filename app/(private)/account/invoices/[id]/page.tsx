"use client";

import AccountInvoiceDetailsHeader from "@/components/invoice/invoice-details/invoice-details-header";
import AccountInvoiceDetailsSheet from "@/components/invoice/invoice-details/invoice-details-sheet";
import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import { useTheme } from "@/hooks/use-theme";
import { Invoice } from "@/lib/@types/types";
import { handleReadUserInvoice } from "@/lib/handlers/events-handlers/invoice-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { isloading } = useTheme();
  const [invoice, setInvoice] = useState<Invoice>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    handleReadUserInvoice(parseInt(invoiceId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setInvoice(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [success, isEditing]);

  if (loading) return <Loading subject="de la facture" />;

  if (!invoice && !loading)
    return (
      <Error
        error={error || "Aucune information disponible sur cette facture."}
      />
    );

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="space-y-6">
        {/* Header */}
        <AccountInvoiceDetailsHeader invoice={invoice} loading={loading} emuted={isloading} />

        {/* Sheet */}
        <AccountInvoiceDetailsSheet invoice={invoice} loading={loading} emuted={isloading} />

      </div>
    </main>
  );
}
