"use client";

import { CheckoutSteps, PaymentMethod, PaymentType } from "@/lib/@types/enums";
import { PAYMENT } from "@/lib/constants/constants";
import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface CheckoutStepTwoProps {
  currentStep: CheckoutSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<CheckoutSteps>>;
  emuted?: boolean;
  payment: {
    type: PaymentType;
    method: PaymentMethod;
  };
  setPayment: React.Dispatch<
    React.SetStateAction<{
      type: PaymentType;
      method: PaymentMethod;
    }>
  >;
}

export default function CheckoutStepTwo({
  currentStep,
  setCurrentStep,
  emuted = true,
  payment,
  setPayment,
}: CheckoutStepTwoProps) {
  // const [cardData, setCardData] = useState({
  //   cardNumber: "",
  //   cardName: "",
  //   expiryDate: "",
  //   cvv: "",
  // });

  // const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setCardData((prev) => ({ ...prev, [name]: value }));
  // };

  const types = Object.keys(PAYMENT) as PaymentType[];

  return (
    <div
      className={cn(
        "text-foreground border border-border rounded-lg p-6",
        emuted
          ? "bg-transparent text-muted-foreground animate-pulse"
          : "bg-background",
      )}
    >
      <div className="flex items-center gap-3 mb-6 cursor-pointer">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-background",
            emuted
              ? "text-muted-foreground bg-muted-foreground "
              : currentStep === CheckoutSteps.PAYMENT
                ? "bg-primary-dark"
                : "bg-gray-400",
          )}
        >
          2
        </div>
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Paiement</h2>
        </Skeleton>
      </div>

      {currentStep === CheckoutSteps.PAYMENT && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
            {types.map((type: PaymentType, index: number) => (
              <div
                className={cn(
                  payment.type === type &&
                    "p-2 border rounded-lg shadow-md shadow-accent",
                )}
                key={index}
              >
                <label
                  className={cn(
                    "flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer transition",
                    emuted ? "bg-transparent animate-pulse" : "hover:bg-accent",
                  )}
                >
                  <input
                    type="radio"
                    disabled={emuted}
                    value={type}
                    checked={payment.type == type}
                    onChange={() =>
                      setPayment((prev) => ({
                        ...prev,
                        type: type as PaymentType,
                      }))
                    }
                    className={cn(
                      "w-4 h-4",
                      emuted && "cursor-not-allowed animate-pulse",
                    )}
                  />
                  <Skeleton emuted={emuted}>
                    <span>{PAYMENT[type].value}</span>
                  </Skeleton>
                </label>
                {payment.type === type && (
                  <div className="space-y-2 my-1">
                    {Object.keys(PAYMENT[type].options)?.map(
                      (method, index: number) => (
                        <label
                          key={index}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition",
                            emuted
                              ? "bg-transparent animate-pulse"
                              : "hover:bg-accent",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={payment.method === method}
                            onChange={() =>
                              setPayment((prev) => ({
                                ...prev,
                                method: method as PaymentMethod,
                              }))
                            }
                            className={cn(
                              "w-4 h-4",
                              emuted && "cursor-not-allowed animate-pulse",
                            )}
                          />
                          <Skeleton emuted={emuted}>
                            <span>{PAYMENT[type]?.options[method]}</span>
                          </Skeleton>
                        </label>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* <div className="space-y-3">

            <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition">
              <input
                type="radio"
                checked={payment.method === "card"}
                onChange={() => setPaymentMethod("card")}
                className="w-4 h-4"
              />
              <CreditCard className="w-5 h-5" />
              <span>Carte Bancaire</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition">
              <input
                type="radio"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="w-4 h-4"
              />
              <span>PayPal</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent transition">
              <input
                type="radio"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
                className="w-4 h-4"
              />
              <span>Virement bancaire</span>
            </label>
          </div> */}

          {/* {paymentMethod === "card" && (
            <div className="border-t border-border pt-4 space-y-4">
              <input
                type="text"
                name="cardNumber"
                placeholder="Numéro de carte"
                value={cardData.cardNumber}
                onChange={handleCardChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
              />
              <input
                type="text"
                name="cardName"
                placeholder="Nom sur la carte"
                value={cardData.cardName}
                onChange={handleCardChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={cardData.expiryDate}
                  onChange={handleCardChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
            </div>
          )} */}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCurrentStep(CheckoutSteps.SHIPPING)}
              disabled={emuted}
              variant={emuted ? "emuted" : "outline"}
              className="py-6"
            >
              Retour
            </Button>
            <Button
              onClick={() => setCurrentStep(CheckoutSteps.CONFIRMATION)}
              variant={emuted ? "emuted" : "default"}
              disabled={emuted}
              className={cn(
                "py-6",
                !emuted &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Continuer vers la confirmation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
