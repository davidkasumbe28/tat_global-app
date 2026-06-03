"use client";

import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/@types/types";
import { generateInvoiceHTML } from "@/lib/utils/invoice.utils";
import { Download } from "lucide-react";

interface InvoiceDownloadButtonProps {
  invoice: Invoice;
  companyInfo: Record<string, string>;
}

export function InvoiceDownloadButton({
  invoice,
  companyInfo,
}: InvoiceDownloadButtonProps) {
  const handleDownload = () => {
    const invoiceHTML = generateInvoiceHTML(invoice, companyInfo);

    // Créer un blob avec le HTML
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Facture_${invoice.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} className="bg-primary text-white">
      <Download className="w-4 h-4 mr-2" />
      Télécharger
    </Button>
  );
}
