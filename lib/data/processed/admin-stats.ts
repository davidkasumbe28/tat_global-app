import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const adminStats = [
  {
    title: "Revenu Total",
    value: "14,181€",
    change: "+12.5%",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Commandes",
    value: "1,458",
    change: "+8.2%",
    isPositive: true,
    icon: ShoppingBag,
  },
  {
    title: "Clients",
    value: "3,247",
    change: "+5.3%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "Produits",
    value: "342",
    change: "+2.1%",
    isPositive: true,
    icon: Package,
  },
];

export default adminStats;
