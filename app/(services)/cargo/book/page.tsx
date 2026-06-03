"use client";

import CargoDevis from "@/components/cargo/book/cargo-devis";
import CargoForm from "@/components/cargo/book/cargo-form";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import NotAuthorized from "@/components/layout/not-authorized";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils/utils";
import { useState } from "react";

export default function BookCargoPage() {
  const { isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    weight: "",
    originCity: "Paris",
    destinationCountry: "",
    destinationCity: "",
    serviceType: "standard",
    description: "",
    value: "",
  });
  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  if (!isLoggedIn)
    return <NotAuthorized functionality={"Réserver un Envoi Cargo"} />;

  const calculateQuote = () => {
    setCalculating(true);
    setTimeout(() => {
      const basePrice = Number.parseInt(formData.weight) * 50;
      const countryMultiplier =
        formData.destinationCountry === "France" ? 1 : 2.5;
      const serviceMultiplier = formData.serviceType === "express" ? 1.5 : 1;
      const total = basePrice * countryMultiplier * serviceMultiplier;
      setQuote({
        price: total,
        estimatedDays: formData.serviceType === "express" ? 3 : 7,
      });
      setCalculating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Réserver un Envoi Cargo</h1>
        <div
          className={cn("grid grid-cols-1 gap-8", quote && "lg:grid-cols-2")}
        >
          <CargoForm
            formData={formData}
            setFormData={setFormData}
            calculating={calculating}
            calculateQuote={calculateQuote}
          />

          {quote && <CargoDevis formData={formData} quote={quote} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
