import {
  CategoryBeautyService,
  // CategoryProduct,
  RankAdmin,
  // RoleUser,
  ShippingMethodeOrder,
  ShippingPaymentMethod,
  StatusBeautyAppointment,
  StatusCustomOrder,
  // StatusInvoice,
  // StatusOrder,
  // StatusTransaction,
  StatusUser,
  Theme,
} from "../@types/types";
import path from "path";
import {
  CategoryProduct,
  PaymentType,
  RoleUser,
  StateProduct,
  StateUser,
  StatusOrder,
  StatusInvoice,
  TransactionType,
  StatusTransaction,
} from "../generated/prisma/enums";
// import { ShippingPaymentType } from "../@types/enums";

const SESSION_DURATION: number = 1000 * 60 * 60 * 24 * 7; // 7 jours

const CHECK_SESSION_DURATION: number = 1000 * 60 * 15; // 15 min

const TAX: number = 0.2 as const;

const SHIPPING: number = 20 as const;

const THEME: Record<Theme, string> = {
  light: "Claire",
  dark: "Sombre",
} as const;

const WHATSAPP_TEMPLATES = {
  ORDER_CONFIRMATION: "HX54f05b8eb5d928d403983e52954431ab",
  ORDER_TRACKING: "HXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
} as const;

const TEMPLATES_PATH = {
  EMAIL: path.join(process.cwd(), "lib", "templates", "emails"),
  MESSAGE: path.join(process.cwd(), "lib", "templates", "messages"),
} as const;

const ROLE_USER: { label: string; value: RoleUser | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Client", value: RoleUser.USER },
  { label: "Admin", value: RoleUser.ADMIN },
] as const;

const USER_STATE: { label: string; value: StateUser | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Actif", value: StateUser.ENABLED },
  { label: "Inactif", value: StateUser.DISABLED },
] as const;

const CATEGORIES_PRODUCT: { label: string; value: CategoryProduct | "ALL" }[] =
  [
    { label: "Tous", value: "ALL" },
    { label: "Vêtements", value: CategoryProduct.CLOTHING },
    { label: "Chaussures", value: CategoryProduct.SHOES },
    { label: "Parfums", value: CategoryProduct.PERFUMES },
    { label: "Autres", value: CategoryProduct.OTHER },
  ] as const;

const PRODUCT_STATE: { label: string; value: StateProduct | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Disponible", value: StateProduct.AVAILABLE },
  { label: "Indisponible", value: StateProduct.UNAVAILABLE },
] as const;

const ORDER_STATUSES: { label: string; value: StatusOrder | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "En attente", value: StatusOrder.PENDING },
  { label: "Confirmée", value: StatusOrder.CONFIRMED },
  { label: "En préparation", value: StatusOrder.IN_PREPARATION },
  { label: "Expédiée", value: StatusOrder.SHIPPED },
  { label: "Livrée", value: StatusOrder.DELIVERED },
  { label: "Annulée", value: StatusOrder.CANCELLED },
  { label: "Finalisée", value: StatusOrder.COMPLETED },
];

const INVOICE_STATUSES: { label: string; value: StatusInvoice | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Brouillon", value: StatusInvoice.DRAFT },
  { label: "Émise", value: StatusInvoice.ISSUED },
  { label: "Payée", value: StatusInvoice.PAID },
  { label: "En retard", value: StatusInvoice.OVERDUE },
  { label: "Annulée", value: StatusInvoice.CANCELLED },
];

const TRANSACTION_STATUSES: { label: string; value: StatusTransaction | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "En attente", value: StatusTransaction.PENDING },
  { label: "Échouée", value: StatusTransaction.FAILED },
  { label: "Rembourcée", value: StatusTransaction.REFUNDED },
  { label: "Compétée", value: StatusTransaction.COMPLETED }
];

const PAYMENT_TYPES: { label: string; value: PaymentType | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "En une tranche", value: PaymentType.IN_ONE_SLICE },
  { label: "En deux tranhes", value: PaymentType.IN_TWO_SLICES },
];

const COLLECTION_COLORS: { label: string; value: string }[] = [
  { label: "Vert", value: "bg-green-50" },
  { label: "Rouge", value: "bg-red-50" },
  { label: "Bleu", value: "bg-blue-50" },
  { label: "Blanc", value: "bg-white-50" },
  { label: "Noir", value: "bg-black-50" },
  { label: "Jaune", value: "bg-yellow-50" },
  { label: "Violet", value: "bg-purple-50" },
  { label: "Gris", value: "bg-gray-50" },
];

const ACTIVITY_STATE: {
  label: "Actif" | "Inactif";
  value: "ENABLED" | "DISABLED";
}[] = [
  { label: "Actif", value: "ENABLED" },
  { label: "Inactif", value: "DISABLED" },
];

const AVAILABILITY_STATE: {
  label: "Disponible" | "Indisponible";
  value: "AVAILABLE" | "UNAVAILABLE";
}[] = [
  { label: "Disponible", value: "AVAILABLE" },
  { label: "Indisponible", value: "UNAVAILABLE" },
];

const STATUS_USER: Record<string, StatusUser> = {
  in_progress: "IN_PROGRESS",
  checked: "CHECKED",
  online: "ONLINE",
  offline: "OFFLINE",
};

const RANK_ADMIN: Record<string, RankAdmin> = {
  super_admin: "SUPER_ADMIN",
  standard_admin: "STANDARD_ADMIN",
  stock_manager: "STOCK_MANAGER",
  delivery_person: "DELIVERY_PERSON",
};

const CATEGORY_PRODUCT: Record<CategoryProduct, string> = {
  CLOTHING: "Vetements",
  SHOES: "Chaussures",
  PERFUMES: "Parfums",
  OTHER: "Autres",
};

const STATUS_ORDER: Record<StatusOrder, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PREPARATION: "En préparation",
  SHIPPED: "",
  DELIVERED: "Livrée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const SHIPPING_METHOD: Record<ShippingMethodeOrder, string> = {
  EXPRESS: "Express",
  STANDARD: "Standard",
  OVERNIGHT: "Du jour au lendemain",
};

// ------------------------- For custom orders and beauty appointments -- -----------------------

export const PAYMENT: Record<
  PaymentType,
  { value: string; options: Record<string, string> }
> = {
  IN_TWO_SLICES: {
    value: "En deux tranches",
    options: {
      AIRTEL_MONEY_ON_CONFIRMATION_CASH_ON_DELIVERY:
        "Airtel Money à la confirmation et cash à la livraison",
      MPESA_ON_CONFIRMATION_CASH_ON_DELIVERY:
        "M-Pesa à la confirmation et cash à la livraison",
      AIRTEL_MONEY: "Airtel Money à la confirmation et à la livraison",
      MPESA: "M-Pesa à la confirmation et à la livraison",
    },
  },
  IN_ONE_SLICE: {
    value: "En une tranche",
    options: {
      AIRTEL_MONEY: "Airtel Money",
      MPESA: "M-Pesa",
      CASH_ON_DELIVERY: "Paiement cash à la livraison",
      CARD: "Carte bancaire",
      PAYPAL: "PayPal",
    },
  },
};

const TRANSACTION_TYPES: { label: string; value: TransactionType | "ALL" }[] = [
  { label: "Tous", value: "ALL" },
  { label: "Vente", value: TransactionType.SALE },
  { label: "Reçu", value: TransactionType.RECEIPT },
  { label: "Ajustement", value: TransactionType.ADJUSTMENT },
  { label: "Remboursement", value: TransactionType.REFUND },
];

// const STATUS_INVOICE: Record<StatusInvoice, string> = {
//   draft: "",
//   issued: "",
//   paid: "",
//   overdue: "",
//   cancelled: "",
// };

// const STATUS_TRANSACTION: Record<StatusTransaction, string> = {
//   pending: "",
//   completed: "",
//   failed: "",
//   refunded: "",
// };

// const STATUS_CUSTOM_ORDER: Record<StatusCustomOrder, string> = {
//   pending: "",
//   quoted: "",
//   accepted: "",
//   in_progress: "",
//   completed: "",
//   cancelled: "",
// };

// const STATUS_BEAUTY_APPOINTMENT: Record<StatusBeautyAppointment, string> = {
//   pending: "",
//   confirmed: "",
//   completed: "",
//   cancelled: "",
//   no_show: "",
// };

// const CATEGORY_BEAUTY_SERVICES: Record<CategoryBeautyService, string> = {
//   haircut: "",
//   coloring: "",
//   nails: "",
//   makeup: "",
//   facial: "",
//   other: "",
// };

export {
  // CATEGORY_BEAUTY_SERVICES,
  CATEGORY_PRODUCT,
  RANK_ADMIN,
  ROLE_USER,
  SHIPPING,
  SHIPPING_METHOD,
  // STATUS_BEAUTY_APPOINTMENT,
  // STATUS_CUSTOM_ORDER,
  // STATUS_INVOICE,
  STATUS_ORDER,
  // STATUS_TRANSACTION,
  STATUS_USER,
  TAX,
  THEME,
  WHATSAPP_TEMPLATES,
  TEMPLATES_PATH,
  SESSION_DURATION,
  CHECK_SESSION_DURATION,
  CATEGORIES_PRODUCT,
  PRODUCT_STATE,
  ORDER_STATUSES,
  COLLECTION_COLORS,
  ACTIVITY_STATE,
  AVAILABILITY_STATE,
  USER_STATE,
  PAYMENT_TYPES,
  TRANSACTION_TYPES,
  INVOICE_STATUSES,
  TRANSACTION_STATUSES
};
