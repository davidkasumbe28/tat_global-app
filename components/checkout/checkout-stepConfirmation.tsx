"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { CheckoutSteps, PaymentMethod, PaymentType } from "@/lib/@types/enums";
import { TriangleAlert } from "lucide-react";
import { handleCreateOrder } from "@/lib/handlers/events-handlers/order-events";

interface CheckoutStepConfirmationProps {
  currentStep: CheckoutSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<CheckoutSteps>>;
  emuted?: boolean;
  payment: {
    type: PaymentType;
    method: PaymentMethod;
  };
  formData: Record<string, any>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export default function CheckoutStepConfirmation({
  currentStep,
  setCurrentStep,
  emuted = true,
  payment,
  formData,
  setFormData,
}: CheckoutStepConfirmationProps) {
  const { user } = useAuth();
  const { cart, cartTotal, cartCount, summaryCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [newOrder, setNewOrder] = useState<Record<string, any> | null>(null);
  const [shippingType, setShippingType] = useState("standard");
  const router = useRouter();

  const { shipping, tax, total } = summaryCart();

  const handleConfirmed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newOrder = {
      userId: user?.id as number,
      cartId: cart?.id as number,
      totalAmount: total,
      paymentMethod: payment.method,
      paymentType: payment.type,
      shippingAddress: JSON.stringify(formData),
      // shippingType,
    };

    const res = await handleCreateOrder(newOrder);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("Commande créée avec succès !");
    setNewOrder(res.data);
    setCurrentStep(CheckoutSteps.CONFIRMATION);
    setOrderConfirmed(true);
    setLoading(false);
    // setTimeout(() => {
    // setLoading(false);
    //   router.push("/account/order/" + res.data.id);
    // });
  };

  return (
    <>
      {currentStep === CheckoutSteps.CONFIRMATION && (
        <div
          className={cn(
            "border border-border rounded-lg p-6 text-center space-y-6",
            emuted
              ? "bg-transparent text-muted-foreground animate-pulse"
              : "bg-background",
          )}
        >
          {orderConfirmed && (
            <>
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                  emuted ? "bg-muted-foreground animate-pulse" : "bg-green-100",
                )}
              >
                <svg
                  className={cn(
                    "w-8 h-8",
                    emuted ? "text-muted-foreground" : "text-green-600",
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <Skeleton emuted={emuted}>
                  <h3 className="text-2xl font-bold mb-2">
                    Commande confirmée!
                  </h3>
                </Skeleton>
                <Skeleton emuted={emuted || loading}>
                  <p className={cn(!emuted && !loading && "text-gray-500")}>
                    Numéro de commande: {newOrder?.orderNumber}
                  </p>
                </Skeleton>
              </div>
              <Skeleton emuted={emuted || loading}>
                <p className={cn(!emuted && !loading && "text-gray-500")}>
                  Un email de confirmation a été envoyé à {newOrder?.user?.email} et toute
                  autre communication liée à votre commande vous sera envoyée
                  par cette adresse mail.
                </p>
              </Skeleton>
            </>
          )}

          {!orderConfirmed && (
            <>
              {/* <div className="space-y-3">
                <label
                  className={cn(
                    "flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer transition",
                    emuted ? "bg-transparent animate-pulse" : "hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    disabled={emuted || loading}
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className={cn(
                      "w-4 h-4",
                      (emuted || loading) && "cursor-not-allowed animate-pulse",
                    )}
                  />
                  <Skeleton emuted={emuted}>
                    <span>Standard</span>
                  </Skeleton>
                </label>

                <label
                  className={cn(
                    "flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer transition",
                    emuted ? "bg-transparent animate-pulse" : "hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    disabled={emuted || loading}
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className={cn(
                      "w-4 h-4",
                      (emuted || loading) && "cursor-not-allowed animate-pulse",
                    )}
                  />
                  <Skeleton emuted={emuted}>
                    <span>Express</span>
                  </Skeleton>
                </label>

                <label
                  className={cn(
                    "flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer transition",
                    emuted ? "bg-transparent animate-pulse" : "hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    disabled={emuted || loading}
                    checked={shippingMethod === "overnight"}
                    onChange={() => setShippingMethod("overnight")}
                    className={cn(
                      "w-4 h-4",
                      (emuted || loading) && "cursor-not-allowed animate-pulse",
                    )}
                  />
                  <Skeleton emuted={emuted}>
                    <span>Du jour au lendemain</span>
                  </Skeleton>
                </label>
              </div> */}

              <div>
                <Skeleton emuted={emuted}>
                  <h3 className="text-2xl font-bold mb-2">Confirmation</h3>
                </Skeleton>
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                    emuted
                      ? "bg-muted-foreground animate-pulse"
                      : "bg-yellow-100",
                  )}
                >
                  <TriangleAlert
                    className={cn(
                      "w-8 h-8",
                      emuted ? "text-muted-foreground" : "text-yellow-600",
                    )}
                  />
                </div>
              </div>
              <Skeleton emuted={emuted || loading}>
                <p className={cn(!emuted && !loading && "text-gray-500")}>
                  Etes vous sûr de vouloir confirmer votre commande ? Une fois
                  confirmé, vous ne pourrez plus modifier votre commande si ce
                  n'est pas en contactant le support client.
                </p>
              </Skeleton>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setCurrentStep(CheckoutSteps.PAYMENT)}
                  disabled={emuted || loading}
                  variant={emuted || loading ? "emuted" : "outline"}
                  className="py-6"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleConfirmed}
                  variant={emuted || loading ? "emuted" : "default"}
                  disabled={emuted || loading}
                  className={cn(
                    "py-6",
                    !emuted &&
                      !loading &&
                      "bg-foreground text-background hover:bg-primary-dark",
                  )}
                >
                  Confirmer la commande
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
