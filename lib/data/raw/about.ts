import { Award, Globe, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Award,
    label: "Qualité",
    value: "Nous garantissons des produits de haute qualité",
  },
  {
    icon: Users,
    label: "Clients",
    value: "Votre satisfaction est notre priorité",
  },
  {
    icon: Globe,
    label: "Global",
    value: "Service livraison worldwide",
  },
  {
    icon: Zap,
    label: "Innovation",
    value: "Technologies et services modernes",
  },
];

const stats = [
  { label: "Clients Satisfaits", value: "10K+" },
  { label: "Produits Disponibles", value: "5000+" },
  { label: "Pays Livrés", value: "50+" },
];

const about = {
  values,
  stats,
};

export default about;
