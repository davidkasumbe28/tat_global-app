"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EventSammaryProps {
  eventData: {
    eventType: string;
    date: string;
    guestCount: string;
    location: string;
    description: string;
    selectedServices: string[];
  };
  calculateTotal: () => number;
  submitting: boolean;
}

export default function EventSummary({
  eventData,
  calculateTotal,
  submitting,
}: EventSammaryProps) {
  return (
    <div>
      <Card className="p-6 sticky top-4">
        <h3 className="text-xl font-bold mb-6">Résumé</h3>
        <div className="space-y-3 mb-6 pb-6 border-b border-border">
          <div className="flex justify-between text-sm">
            <span>Date</span>
            <span className="font-medium">
              {eventData.date || "Non définie"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Invités</span>
            <span className="font-medium">{eventData.guestCount || "0"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Services</span>
            <span className="font-medium">
              {eventData.selectedServices.length}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-foreground">
              {calculateTotal().toLocaleString()} FCFA
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Dépôt: {(calculateTotal() * 0.3).toLocaleString()} FCFA
          </p>
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-foreground text-background hover:bg-primary-dark"
        >
          {submitting ? "Réservation en cours..." : "Confirmer la Réservation"}
        </Button>
      </Card>
    </div>
  );
}
