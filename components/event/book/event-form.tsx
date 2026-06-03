"use client";

import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";

interface EventFormProps {
  eventData: {
    eventType: string;
    date: string;
    guestCount: string;
    location: string;
    description: string;
    selectedServices: string[];
  };
  setEventData: React.Dispatch<
    React.SetStateAction<{
      eventType: string;
      date: string;
      guestCount: string;
      location: string;
      description: string;
      selectedServices: string[];
    }>
  >;
  eventsServices: {
    id: string;
    name: string;
    price: number;
  }[];
  toggleService: (serviceId: string) => void;
}

export default function EventForm({
  eventData,
  setEventData,
  eventsServices,
  toggleService,
}: EventFormProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Détails de l'Événement</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Type d'Événement
            </label>
            <select
              value={eventData.eventType}
              onChange={(e) =>
                setEventData({ ...eventData, eventType: e.target.value })
              }
              className="w-full px-4 py-3 border border-border rounded-lg"
            >
              <option value="wedding">Mariage</option>
              <option value="birthday">Anniversaire</option>
              <option value="corporate">Événement Corporatif</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) =>
                  setEventData({ ...eventData, date: e.target.value })
                }
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Nombre d'Invités
              </label>
              <input
                type="number"
                value={eventData.guestCount}
                onChange={(e) =>
                  setEventData({ ...eventData, guestCount: e.target.value })
                }
                placeholder="0"
                className="w-full px-4 py-3 border border-border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Lieu
            </label>
            <input
              type="text"
              value={eventData.location}
              onChange={(e) =>
                setEventData({ ...eventData, location: e.target.value })
              }
              placeholder="Adresse complète"
              className="w-full px-4 py-3 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description/Notes
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              placeholder="Détails supplémentaires sur votre événement..."
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg"
            />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Services Disponibles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {eventsServices.map((service) => (
            <label
              key={service.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                eventData.selectedServices.includes(service.id)
                  ? "border-foreground bg-foreground/5"
                  : "border-border"
              }`}
            >
              <input
                type="checkbox"
                checked={eventData.selectedServices.includes(service.id)}
                onChange={() => toggleService(service.id)}
                className="mr-3"
              />
              <span className="font-medium">{service.name}</span>
              <span className="block text-sm text-muted-foreground">
                {service.price.toLocaleString()} FCFA
              </span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
