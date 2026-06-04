"use client";

import AdminInvoiceDetailsHeader from "@/components/admin/invoice/invoice-details/invoice-details-header";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { StatusInvoice } from "@/lib/generated/prisma/client";
import { handleReadInvoice } from "@/lib/handlers/events-handlers/invoice-events";
import { formatDate } from "@/lib/utils/date";
import { ChevronLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { Invoice } from "@/lib/@types/types";
import AdminInvoiceDetailsSheet from "@/components/admin/invoice/invoice-details/invoice-details-sheet";
import Loading from "@/components/layout/loading";
import Error from "@/components/layout/error";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const { isloading } = useTheme();
  const [invoice, setInvoice] = useState<Invoice>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
    const [changeData, setChangeData] = useState<Record<string, any>>({});
    const [formData, setFormData] = useState<Record<string, any>>({
      // name: order?.name,
      // category: order?.category,
      // description: order?.description,
      // image: order?.image,
      // color: order?.color,
      // state: order?.state,
    });

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setChangeData((prev) => ({ ...prev, [name]: value }));
    };

  // const invoice = {
  //   number: "TAT-2025-000001",
  //   date: "15 Nov 2025",
  //   dueDate: "15 Dec 2025",
  //   status: "paid",
  //   company: {
  //     name: "TAT GLOBAL",
  //     address: "123 Rue Admin, Paris",
  //     city: "75000 Paris",
  //     country: "France",
  //     phone: "+33 1 23 45 67 89",
  //     email: "contact@tatglobal.com",
  //     siret: "12345678901234",
  //   },
  //   customer: {
  //     name: "Jean Dupont",
  //     email: "jean.dupont@email.com",
  //     address: "123 Rue de la Paix",
  //     city: "75000 Paris",
  //     country: "France",
  //   },
  //   items: [
  //     {
  //       name: "T-Shirt Premium Coton",
  //       quantity: 2,
  //       unitPrice: 49.99,
  //       tax: 20,
  //       subtotal: 99.98,
  //     },
  //     {
  //       name: "Baskets Urbaines",
  //       quantity: 1,
  //       unitPrice: 89.99,
  //       tax: 20,
  //       subtotal: 89.99,
  //     },
  //     {
  //       name: "Parfum Eau de Toilette",
  //       quantity: 1,
  //       unitPrice: 79.99,
  //       tax: 20,
  //       subtotal: 79.99,
  //     },
  //   ],
  //   subtotal: 269.96,
  //   tax: 53.99,
  //   total: 323.95,
  //   paymentTerms: "Net 30",
  //   notes: "Merci pour votre achat chez TAT GLOBAL",
  // };

  useEffect(() => {
    setLoading(true);
    handleReadInvoice(parseInt(invoiceId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }
        setInvoice(res.data);
        // setNewTransaction((prev) => ({
        //   ...prev,
        //   amount:
        //     res?.data?.paymentType == PaymentType.IN_TWO_SLICES
        //       ? res?.data?.totalAmount / 2
        //       : res?.data?.totalAmount,
        // }));
        setFormData(res.data);
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
    <main className="flex-1 space-y-4">
      <div className="space-y-6">
        {/* Header */}
        <AdminInvoiceDetailsHeader invoice={invoice} loading={loading} emuted={isloading}  />

        {/* Sheet */}
        <AdminInvoiceDetailsSheet invoice={invoice} loading={loading} emuted={isloading} />

      </div>
    </main>
  );
}
