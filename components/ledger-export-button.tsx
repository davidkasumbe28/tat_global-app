"use client";

import { Button } from "@/components/ui/button";
import type { AccountLedger } from "@/lib/@types/types";
import { Download } from "lucide-react";

interface LedgerExportButtonProps {
  entries: AccountLedger[];
  customerName: string;
}

export function LedgerExportButton({
  entries,
  customerName,
}: LedgerExportButtonProps) {
  const handleExport = () => {
    // Créer le CSV
    let csv = "Date,Type,Description,Montant,Solde,Référence\n";

    entries.forEach((entry) => {
      const row = [
        entry.date.toLocaleDateString("fr-FR"),
        entry.type,
        entry.description,
        entry.amount.toFixed(2),
        entry.balance.toFixed(2),
        entry.reference || "",
      ].join(",");
      csv += row + "\n";
    });

    // Télécharger
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cahier_Compte_${customerName}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      Exporter CSV
    </Button>
  );
}
