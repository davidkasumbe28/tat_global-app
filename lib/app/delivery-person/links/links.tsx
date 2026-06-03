import { LayoutDashboard, Truck } from "lucide-react";

const deliveryPerson = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/delivery-person",
  },
  {
    icon: Truck,
    label: "Livraisons",
    href: "/delivery-person/deliveries",
  },
  // {
  //   icon: Package,
  //   label: "Produits",
  //   href: "/stock-manager/products",
  // },
  //   {
  //   icon: Boxes,
  //   label: "Collections",
  //   href: "/stock-manager/collections",
  // },
  // {
  //   icon: FileText,
  //   label: "Factures",
  //   href: "/stock-manager/invoices",
  // },
];

const links = {
  deliveryPerson,
};

export default links;
