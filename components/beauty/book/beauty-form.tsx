"use client";

import { Card } from "@/components/ui/card";

interface BeautyFormProps {
  appointmentData: {
    service: string;
    date: string;
    time: string;
    location: string;
    address: string;
    notes: string;
  };
  setAppointmentData: React.Dispatch<
    React.SetStateAction<{
      service: string;
      date: string;
      time: string;
      location: string;
      address: string;
      notes: string;
    }>
  >;
  beautyServices: {
    id: string;
    name: string;
    price: number;
    duration: string;
  }[];
}

export default function BeautyForm({
  appointmentData,
  setAppointmentData,
  beautyServices,
}: BeautyFormProps) {
  return (
    <div className="lg:col-span-2">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Détails du Rendez-vous</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Service</label>
            <select
              value={appointmentData.service}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  service: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-border rounded-lg"
            >
              <option value="">Sélectionner un service</option>
              {beautyServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.price.toLocaleString()} FCFA (
                  {service.duration})
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={appointmentData.date}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    date: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Heure</label>
              <input
                type="time"
                value={appointmentData.time}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    time: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lieu</label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <label
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  appointmentData.location === "salon"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                }`}
              >
                <input
                  type="radio"
                  value="salon"
                  checked={appointmentData.location === "salon"}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      location: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                Au Salon
              </label>
              <label
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  appointmentData.location === "home"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                }`}
              >
                <input
                  type="radio"
                  value="home"
                  checked={appointmentData.location === "home"}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      location: e.target.value,
                    })
                  }
                  className="mr-2"
                />
                À Domicile
              </label>
            </div>
            {appointmentData.location === "home" && (
              <input
                type="text"
                value={appointmentData.address}
                onChange={(e) =>
                  setAppointmentData({
                    ...appointmentData,
                    address: e.target.value,
                  })
                }
                placeholder="Votre adresse complète"
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Notes/Demandes Spéciales
            </label>
            <textarea
              value={appointmentData.notes}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  notes: e.target.value,
                })
              }
              placeholder="Toute information supplémentaire..."
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
