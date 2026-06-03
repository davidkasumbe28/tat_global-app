import { Activity, Globe, Map, Tag } from "lucide-react";

const destinations = [
  {
    region: "Afrique de l'Ouest",
    countries: "Côte d'Ivoire, Sénégal, Mali, Burkina Faso",
    icon: Globe,
  },
  {
    region: "Afrique de l'Est",
    countries: "Kenya, Tanzanie, Ouganda, Rwanda",
    icon: Globe,
  },
  {
    region: "Afrique du Nord",
    countries: "Maroc, Algérie, Tunisie, Égypte",
    icon: Globe,
  },
  {
    region: "Europe",
    countries: "France, Belgique, Pays-Bas, Allemagne",
    icon: Globe,
  },
];

const presentation = [
  {
    icon: Map,
    label: "Destinations Variées",
    description: "Livraison vers l'Afrique, l'Europe et d'autres régions",
  },
  {
    icon: Activity,
    label: "Suivi en Temps Réel",
    description: "Suivez votre colis à chaque étape du voyage",
  },
  {
    icon: Tag,
    label: "Tarifs Compétitifs",
    description: "Les meilleurs prix pour vos envois internationaux",
  },
];

const cargo = {
  destinations,
  presentation,
};

export default cargo;
