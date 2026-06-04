import { Boxes, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";

const adminStats = [
  {
    title: "Revenu Total",
    value: 0.00 + " $",
    change: "0",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Commandes",
    value: 0,
    change: "+8.2%",
    isPositive: true,
    icon: ShoppingBag,
  },
  {
    title: "Clients",
    value: 0,
    change: "+5.3%",
    isPositive: true,
    icon: Users,
  },
  {
    title: "Collections",
    value: 0,
    change: "+2.1%",
    isPositive: true,
    icon: Boxes,
  },
  {
    title: "Produits",
    value: 0,
    change: "+2.1%",
    isPositive: true,
    icon: Package,
  },
];

export default adminStats;
