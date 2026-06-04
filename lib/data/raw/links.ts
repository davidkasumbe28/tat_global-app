import {
  Boxes,
  Facebook,
  Instagram,
  ShoppingBag,
  SquareStack,
  Truck,
  Twitter,
} from "lucide-react";
import { BarChart3, IdCard, LayoutDashboard, Users } from "lucide-react";

import {
  CreditCard,
  FileText,
  Heart,
  Package,
  Settings,
  User,
} from "lucide-react";
import services from "./services";

const user = [
  {
    icon: User,
    title: "Profil",
    value: "profile",
  },
  {
    icon: Package,
    title: "Commandes",
    value: "orders",
  },
  {
    icon: Heart,
    title: "Favoris",
    value: "favorites",
  },
  {
    icon: Settings,
    title: "Paramètres",
    value: "settings",
  },
  {
    icon: FileText,
    title: "Factures",
    value: "invoices",
  },
  {
    icon: CreditCard,
    title: "Transactions",
    value: "transactions",
  },
];

const admin = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Utilisateurs",
    href: "/admin/users",
  },
  {
    icon: Boxes,
    label: "Collections",
    href: "/admin/collections",
  },
  {
    icon: Package,
    label: "Produits",
    href: "/admin/products",
  },
  {
    icon: ShoppingBag,
    label: "Commandes",
    href: "/admin/orders",
  },
  {
    icon: Truck,
    label: "Livraisons",
    href: "/admin/deliveries",
  },
  {
    icon: SquareStack,
    label: "Services",
    href: "/admin/manager-services",
  },
  {
    icon: FileText,
    label: "Factures",
    href: "/admin/invoices",
  },
  {
    icon: CreditCard,
    label: "Transactions",
    href: "/admin/transactions",
  },
];

const app = [
  {
    icon: null,
    title: "Catalogue",
    href: "/catalogue",
  },
  {
    icon: null,
    title: "Collections",
    href: "/collection",
  },
  {
    icon: null,
    title: "Services",
    href: null,
    services: services.map((service) => ({
      icon: service.icon,
      title: service.title,
      href: service.href,
    })),
  },
  {
    icon: null,
    title: "À propos",
    href: "/about",
  },
  {
    icon: null,
    title: "Contact",
    href: "/contact",
  },
];

const navigation = [
  {
    icon: null,
    title: "Accueil",
    href: "/",
  },
  {
    icon: null,
    title: "Catalogue",
    href: "/catalogue",
  },
  {
    icon: null,
    title: "Collections",
    href: "/collection",
  },
  {
    icon: null,
    title: "À propos",
    href: "/about",
  },
];

const servicesLinks = services.map((service) => ({
  icon: service.icon,
  title: service.title,
  href: service.href,
}));

const support = [
  {
    icon: null,
    title: "Contact",
    href: "/contact",
  },
  {
    icon: null,
    title: "FAQ",
    href: "/faq",
  },
  {
    icon: null,
    title: "Livraison",
    href: "/shipping",
  },
];

const socialNetworks = [
  {
    icon: Facebook,
    title: "Facebook",
    href: "https://facebook.com",
  },
  {
    icon: Twitter,
    title: "X",
    href: "https://x.com",
  },
  {
    icon: Instagram,
    title: "Instagram",
    href: "https://instagram.com",
  },
];

const links = {
  app,
  navigation,
  services: servicesLinks,
  support,
  socialNetworks,
  admin,
  user,
};

export default links;
