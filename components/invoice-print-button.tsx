"use client";

import { Button } from "@/components/ui/button";
import type { Invoice } from "@/lib/@types/types";
import { generateInvoiceHTML, printInvoice } from "@/lib/utils/invoice.utils";
import { Printer } from "lucide-react";

interface InvoicePrintButtonProps {
  invoice: Invoice;
  companyInfo: Record<string, string>;
}

export function InvoicePrintButton({
  invoice,
  companyInfo,
}: InvoicePrintButtonProps) {
  const handlePrint = () => {
    const invoiceHTML = generateInvoiceHTML(invoice, companyInfo);
    printInvoice(invoiceHTML);
  };

  return (
    <Button onClick={handlePrint} variant="outline">
      <Printer className="w-4 h-4 mr-2" />
      Imprimer
    </Button>
  );
}
