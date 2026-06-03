import {
  Boxes,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingCart,
} from "lucide-react";

const stockManager = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/stock-manager",
  },
  {
    icon: ShoppingCart,
    label: "Commandes",
    href: "/stock-manager/orders",
  },
  {
    icon: Package,
    label: "Produits",
    href: "/stock-manager/products",
  },
    {
    icon: Boxes,
    label: "Collections",
    href: "/stock-manager/collections",
  },
  {
    icon: FileText,
    label: "Factures",
    href: "/stock-manager/invoices",
  },
];

const links = {
  stockManager,
};

export default links;