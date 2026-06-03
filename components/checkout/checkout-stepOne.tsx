"use client";

import { cn } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CheckoutSteps } from "@/lib/@types/enums";
import { handleReadProfileUser } from "@/lib/handlers/events-handlers/user-events";

interface CheckoutStepOneProps {
  currentStep: CheckoutSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<CheckoutSteps>>;
  emuted?: boolean;
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function CheckoutStepOne({
  currentStep,
  setCurrentStep,
  emuted = true,
  formData,
  setFormData,
}: CheckoutStepOneProps) {
  const [loading, setLoading] = useState(!true);
  const [useNewAdress, setUseNewAdress] = useState(false);

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setLoading(true);
    handleReadProfileUser()
      .then((res) => {
        if (res.error) return;
        const { address, city, zipCode, country } = res.data;
        setFormData({ address, city, zipCode, country });
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const field of Object.keys(formData)) {
      if (!formData[field]) return;
    }
    setCurrentStep(CheckoutSteps.PAYMENT);
  };

  return (
    <div
      className={cn(
        " border border-border rounded-lg p-6",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <div className="flex items-center gap-3 mb-6 cursor-pointer">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-background",
            emuted
              ? "text-muted-foreground bg-muted-foreground "
              : currentStep === CheckoutSteps.SHIPPING
                ? "bg-primary-dark"
                : "bg-gray-400",
          )}
        >
          1
        </div>
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Adresse de livraison</h2>
        </Skeleton>
      </div>

      {currentStep === CheckoutSteps.SHIPPING && !useNewAdress && (
        <div className="grid md:grid-cols-2 gap-2">
          <Button
            variant={emuted || loading ? "emuted" : "default"}
            onClick={() => {
              for (const field of Object.keys(formData)) {
                if (!formData[field]) return;
              }
              setCurrentStep(CheckoutSteps.PAYMENT);
            }}
            disabled={emuted || loading}
            className={cn(
              "w-full py-6",
              !emuted &&
                !loading &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            Continuer avec l'adresse enregistrer
          </Button>
          <Button
            variant={emuted || loading ? "emuted" : "outline"}
            onClick={() => {
              if (!useNewAdress) {
                setUseNewAdress(true);
              }
            }}
            disabled={emuted || loading}
            className={cn("w-full py-6")}
          >
            Nouvelle adresse
          </Button>
        </div>
      )}

      {currentStep === CheckoutSteps.SHIPPING && useNewAdress && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            required
            value={formData.address}
            onChange={handleShippingChange}
            disabled={emuted || loading}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
              (emuted || loading) &&
                "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="zipCode"
              placeholder="Code postal"
              required
              value={formData.zipCode}
              onChange={handleShippingChange}
              disabled={emuted || loading}
              className={cn(
                "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                (emuted || loading) &&
                  "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
              )}
            />
            <input
              type="text"
              name="city"
              placeholder="Ville"
              required
              value={formData.city}
              onChange={handleShippingChange}
              disabled={emuted || loading}
              className={cn(
                "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                (emuted || loading) &&
                  "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
              )}
            />
            <select
              name="country"
              required
              value={formData.country}
              onChange={handleShippingChange}
              disabled={emuted || loading}
              className={cn(
                "px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground",
                (emuted || loading) &&
                  "bg-muted-foreground placeholder:bg-muted-foreground text-muted-foreground cursor-not-allowed ",
              )}
            >
              <option className="text-black">France</option>
              <option className="text-black">Belgique</option>
              <option className="text-black">Suisse</option>
              <option className="text-black">Luxembourg</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4 ">
            <Button
              variant={emuted || loading ? "emuted" : "outline"}
              type="button"
              onClick={() => {
                if (useNewAdress) {
                  setUseNewAdress(false);
                }
              }}
              disabled={emuted || loading}
              className={cn("w-full py-6")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant={emuted || loading ? "emuted" : "default"}
              disabled={emuted || loading}
              className={cn(
                "w-full py-6",
                !emuted &&
                  !loading &&
                  "bg-foreground text-background hover:bg-primary-dark ",
              )}
            >
              Continuer vers le paiement
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
