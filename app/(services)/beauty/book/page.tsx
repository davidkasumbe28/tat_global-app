"use client";

import type React from "react";

import BeautyForm from "@/components/beauty/book/beauty-form";
import BeautySummary from "@/components/beauty/book/beauty-summary";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import NotAuthorized from "@/components/layout/not-authorized";
import { useStore } from "@/context/store-context";
import beautyServices from "@/lib/data/processed/beauty-services";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookBeautyPage() {
  const { isLoggedIn } = useStore();
  const router = useRouter();
  const [appointmentData, setAppointmentData] = useState({
    service: "",
    date: "",
    time: "",
    location: "salon",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn)
    return <NotAuthorized functionality="Réserver un Service de Beauté" />;

  const getServicePrice = () => {
    return (
      beautyServices.find((s) => s.id === appointmentData.service)?.price || 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Rendez-vous réservé avec succès!");
      router.push("/account");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">
          Réserver un Service de Beauté
        </h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <BeautyForm
            appointmentData={appointmentData}
            setAppointmentData={setAppointmentData}
            beautyServices={beautyServices}
          />

          <BeautySummary
            appointmentData={appointmentData}
            getServicePrice={getServicePrice}
            beautyServices={beautyServices}
            submitting={submitting}
          />
        </form>
      </main>
      <Footer />
    </div>
  );
}
