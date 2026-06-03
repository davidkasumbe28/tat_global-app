"use client";

import { CheckoutSteps, PaymentMethod, PaymentType } from "@/lib/@types/enums";
import { useState } from "react";
import CheckoutStepConfirmation from "./checkout-stepConfirmation";
import CheckoutStepOne from "./checkout-stepOne";
import CheckoutStepTwo from "./checkout-stepTwo";

interface CheckoutFormProps {
  currentStep: CheckoutSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<CheckoutSteps>>;
  emuted?: boolean;
}

export default function CheckoutForm({
  currentStep,
  setCurrentStep,
  emuted = true,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    address: "",
    city: "",
    zipCode: "",
    country: "France",
  });
  const [payment, setPayment] = useState<{
    type: PaymentType;
    method: PaymentMethod;
  }>({
    type: PaymentType.IN_ONE_SLICE,
    method: PaymentMethod.AIRTEL_MONEY,
  });

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* Step 1: Shipping */}
      <CheckoutStepOne
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        emuted={emuted}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Step 2: Payment */}
      <CheckoutStepTwo
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        emuted={emuted}
        payment={payment}
        setPayment={setPayment}
      />

      {/* Step 3: Confirmation */}
      <CheckoutStepConfirmation
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        emuted={emuted}
        payment={payment}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}
