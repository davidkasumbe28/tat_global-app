import {
  CreditCard,
  FileText,
  Heart,
  Package,
  Settings,
  User
} from "lucide-react";

const user = [
  {
    icon: User,
    title: "Profil",
    value: "profile",
  },
  {
    icon: Package,
    title: "Mes commandes",
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

// const navigation = [
//   {
//     icon: null,
//     title: "Accueil",
//     href: "/",
//   },
//   {
//     icon: null,
//     title: "Catalogue",
//     href: "/catalogue",
//   },
//   {
//     icon: null,
//     title: "Collections",
//     href: "/collection",
//   },
//   {
//     icon: null,
//     title: "À propos",
//     href: "/about",
//   },
// ];

// const servicesLinks = services.map((service) => ({
//   icon: service.icon,
//   title: service.title,
//   href: service.href,
// }));

// const support = [
//   {
//     icon: null,
//     title: "Contact",
//     href: "/contact",
//   },
//   {
//     icon: null,
//     title: "FAQ",
//     href: "/faq",
//   },
//   {
//     icon: null,
//     title: "Livraison",
//     href: "/shipping",
//   },
// ];

// const socialNetworks = [
//   {
//     icon: Facebook,
//     title: "Facebook",
//     href: "https://facebook.com",
//   },
//   {
//     icon: Twitter,
//     title: "X",
//     href: "https://x.com",
//   },
//   {
//     icon: Instagram,
//     title: "Instagram",
//     href: "https://instagram.com",
//   },
// ];

const links = {
  user
};

export default links;
