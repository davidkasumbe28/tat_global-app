"use client";

import CheckoutForm from "@/components/checkout/checkout-form";
import OrderSummary from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "@/hooks/use-theme";
import { CheckoutSteps } from "@/lib/@types/enums";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { isloading } = useTheme();
  const [currentStep, setCurrentStep] = useState<CheckoutSteps>(
    CheckoutSteps.SHIPPING,
  );
  const { cartCount , cartTotal, isloadingCart } = useCart();

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Skeleton emuted={isloading}>
        <h1 className="text-4xl font-bold mb-8">Paiement</h1>
      </Skeleton>

      {isloadingCart ? (
        <div className="text-center py-12">
          <Skeleton emuted={isloading}>
            <p className={cn(" mb-6", !isloading && "text-gray-500")}>
              Chargement des informations de paiement...
            </p>
          </Skeleton>
        </div>
      ) : (!cartTotal || cartTotal === 0) && !isloadingCart ? (
        <div className="text-center py-12">
          <Skeleton emuted={isloading}>
            <p className={cn(" mb-6", !isloading && "text-gray-500")}>
              Vous n'avez aucun produit dans votre panier pour le moment.
            </p>
          </Skeleton>
          <Link href={isloading ? "#" : APP.public.cart}>
            <Button
              variant={isloading ? "emuted" : "default"}
              className={cn(
                !isloading &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Effectuer les achats
            </Button>
          </Link>
        </div>
      ) : (
        cartTotal > 0 &&
        !isloadingCart && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <OrderSummary emuted={isloading} currentStep={currentStep} />

            {/* Checkout form Steps */}
            <CheckoutForm
              setCurrentStep={setCurrentStep}
              currentStep={currentStep}
              emuted={isloading}
            />
          </div>
        )
      )}
    </main>
  );
}
