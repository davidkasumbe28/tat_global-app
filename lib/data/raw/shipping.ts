import { AlertCircle, CheckCircle, Clock, MapPin } from "lucide-react";

const zones = [
  {
    name: "Zone 1 - Capitale",
    delay: "1-2 jours",
    price: "3,000 FCF",
    coverage: "Zone urbaine principale",
  },
  {
    name: "Zone 2 - Régions Proches",
    delay: "2-3 jours",
    price: "5,000 FCF",
    coverage: "100km autour de la capitale",
  },
  {
    name: "Zone 3 - Autres Régions",
    delay: "3-5 jours",
    price: "7,000 FCF",
    coverage: "Reste du territoire national",
  },
  {
    name: "Zone 4 - International",
    delay: "7-14 jours",
    price: "À partir de 15,000 FCF",
    coverage: "Destinations internationales",
  },
];

const statuses = [
  { status: "En Attente", color: "bg-yellow-100", icon: AlertCircle },
  { status: "En Préparation", color: "bg-blue-100", icon: Clock },
  { status: "Expédié", color: "bg-purple-100", icon: MapPin },
  { status: "Livré", color: "bg-green-100", icon: CheckCircle },
];

const shipping = {
  zones,
  statuses,
};

export default shipping;
