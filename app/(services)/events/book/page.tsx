"use client";

import type React from "react";

import EventForm from "@/components/event/book/event-form";
import EventSummary from "@/components/event/book/event-summary";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import NotAuthorized from "@/components/layout/not-authorized";
import { useStore } from "@/context/store-context";
import eventsServices from "@/lib/data/processed/events-services";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookEventPage() {
  const { isLoggedIn } = useStore();
  const router = useRouter();
  const [eventData, setEventData] = useState({
    eventType: "wedding",
    date: "",
    guestCount: "",
    location: "",
    description: "",
    selectedServices: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn)
    return <NotAuthorized functionality="Réserver pour vos événements" />;

  const toggleService = (serviceId: string) => {
    setEventData({
      ...eventData,
      selectedServices: eventData.selectedServices.includes(serviceId)
        ? eventData.selectedServices.filter((s) => s !== serviceId)
        : [...eventData.selectedServices, serviceId],
    });
  };

  const calculateTotal = () => {
    return eventsServices
      ?.filter((s) => eventData.selectedServices.includes(s.id))
      .reduce((total, s) => total + s.price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Événement réservé avec succès!");
      router.push("/account");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Organiser Votre Événement</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <EventForm
            eventData={eventData}
            setEventData={setEventData}
            eventsServices={eventsServices}
            toggleService={toggleService}
          />

          <EventSummary
            eventData={eventData}
            calculateTotal={calculateTotal}
            submitting={submitting}
          />
        </form>
      </main>
      <Footer />
    </div>
  );
}
