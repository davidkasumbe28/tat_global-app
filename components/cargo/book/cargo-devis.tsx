"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, MapPin, Package } from "lucide-react";


interface CargoDevisProps {
  formData: {
    weight: string;
    originCity: string;
    destinationCountry: string;
    destinationCity: string;
    serviceType: string;
    description: string;
    value: string;
  };
  quote: any;
}

export default function CargoDevis({ formData, quote }: CargoDevisProps) {
  return (
    <div className="lg:sticky lg:top-4">
      <Card className="p-8 bg-gradient-to-br from-foreground/10 to-secondary/10 border-2 border-foreground">
        <h3 className="text-2xl font-bold mb-6">Résumé de votre Devis</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="flex items-center gap-2">
              <Package className="w-5 h-5" /> Poids
            </span>
            <span className="font-bold">{formData.weight} kg</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Route
            </span>
            <span className="font-bold text-sm">
              {formData.destinationCountry}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span>Délai Estimé</span>
            <span className="font-bold">{quote?.estimatedDays} jours</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Total
            </span>
            <span className="font-bold text-foreground text-2xl">
              {quote?.price?.toLocaleString()} FCFA
            </span>
          </div>
        </div>
        <Button className="w-full bg-foreground text-background hover:bg-primary-dark">
          Confirmer et Payer
        </Button>
      </Card>
    </div>
  );
}
