"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface BeautySammaryProps {
  appointmentData: {
    service: string;
    date: string;
    time: string;
    location: string;
    address: string;
    notes: string;
  };
  getServicePrice: () => number;
  beautyServices: {
    id: string;
    name: string;
    price: number;
    duration: string;
  }[];
  submitting: boolean;
}

export default function BeautySummary({
  appointmentData,
  getServicePrice,
  beautyServices,
  submitting,
}: BeautySammaryProps) {
  return (
    <div>
      <Card className="p-6 sticky top-4">
        <h3 className="text-xl font-bold mb-6">Résumé</h3>
        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex justify-between text-sm">
            <span>Service</span>
            <span className="font-medium">
              {beautyServices.find((s) => s.id === appointmentData.service)
                ?.name || "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date</span>
            <span className="font-medium">
              {appointmentData.date || "Non définie"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Heure</span>
            <span className="font-medium">
              {appointmentData.time || "Non définie"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Lieu</span>
            <span className="font-medium">
              {appointmentData.location === "salon" ? "Salon" : "Domicile"}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-lg font-bold text-foreground">
            <DollarSign className="w-5 h-5" />
            {getServicePrice().toLocaleString()} FCFA
          </div>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-foreground hover:bg-primary-dark text-white"
        >
          {submitting ? "Réservation..." : "Confirmer"}
        </Button>
      </Card>
    </div>
  );
}
