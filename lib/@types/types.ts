import {
  PaymentMethod,
  PaymentType,
  StateCollection,
  StateProduct,
} from "../generated/prisma/enums";
import shipping from "./../data/raw/shipping";
import { order } from "./../data/raw/order";
import orders from './../data/processed/orders';
import transactions from './../data/processed/transaction';

export type Theme = "light" | "dark";
export type StatusUser = "IN_PROGRESS" | "CHECKED" | "ONLINE" | "OFFLINE";
export type StateUser = "ENABLED" | "DISABLED";
export type RoleUser = "USER" | "ADMIN";
export type RankAdmin =
  | "SUPER_ADMIN"
  | "STANDARD_ADMIN"
  | "STOCK_MANAGER"
  | "DELIVERY_PERSON";
export type CategoryProduct = "CLOTHING" | "SHOES" | "PERFUMES" | "OTHER";
export type StateCart = "ENABLED" | "DISABLED";
export type StatusOrder =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";
export type ShippingMethodeOrder = "STANDARD" | "EXPRESS" | "OVERNIGHT";
export type ShippingPaymentMethod =
  | "CASH"
  | "AIRTEL_MONEY"
  | "MPESA"
  | "AIRTEL_MONEY_CASH"
  | "MPESA_CASH";
export type StatusInvoice =
  | "DRAFT"
  | "ISSUED"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";
export type StatusTransaction = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type EntryType = "DEBIT" | "CREDIT";
export type StatusCustomOrder =
  | "PENDING"
  | "QUOTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type StatusBeautyAppointment =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
export type CategoryBeautyService =
  | "HAIRCUT"
  | "COLORING"
  | "NAILS"
  | "MAKEUP"
  | "FACIAL"
  | "OTHER";

export interface ResetEmailContent {
  email: string;
  firstName: string;
  tokenId?: string;
  link?: string;
}

export interface OrderConfirmationContent {
  first_name: string;
  last_name: string;
  orderNumber: string;
  orderTotal: number;
  domain_name: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  role: RoleUser;
  state: StateUser;
  status: StatusUser;
  createdAt: Date;
  updatedAt: Date;
  admin: Admin;
  carts : Cart[];
  orders: Order[];
  transactions : Transaction[];
  _count: { carts: number; favorites: number; reviews: number , orders: number , transactions: number };
}

// export interface User {
// id: number;
// email: string;
// firstName: string;
// lastName: string;
// phone: string;
// address: string;
// city: string;
// zipCode: string;
// country: string;
// avatar?: string;
// role: RoleUser;
// state: StateUser;
// status: StatusUser;
// createdAt: Date;
// updatedAt: Date;
// orders : Order[];
// _count: { orders: number };
// }

export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  role: RoleUser;
  state: StateUser;
  status: StatusUser;
  createdAt: Date;
  updatedAt: Date;
  admin: Admin;
  carts: Cart[];
  _count: { carts: number; favorites: number; reviews: number };
}

export interface Manager {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  role: RoleUser;
  state: StateUser;
  status: StatusUser;
  createdAt: Date;
  updatedAt: Date;
  admin: Admin;
  carts: Cart[];
  _count: { carts: number; favorites: number; reviews: number };
}

export interface Admin {
  id: number;
  userId: number;
  user: User;
  rank: RankAdmin;
  daysOverdue: number;
  state: "ENABLED" | "SUSPENDED" | "DISABLED";
  deliveries?: Delivery[];
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: CategoryProduct;
  description?: string;
  features?: string;
  price: number;
  cost?: number;
  image: string;
  sizes?: string;
  colors?: string;
  stock: number;
  rating: number;
  trackingNumber: string;
  state: StateProduct;
  collectionId?: number;
  createdAt: Date;
  updatedAt: Date;
  reviews?: Review[];
  _count?: {
    reviews: number;
    favorites: number;
    cartItems: number;
  };
}

export interface Collection {
  id: number;
  sku: string;
  name: string;
  category: CategoryProduct;
  description?: string;
  image?: string;
  color: string;
  state: StateCollection;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
  _count?: { products: number };
}

export interface Cart {
  id: number;
  userId: number;
  user?: User;
  state: StateCart;
  cartItems?: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
  _count: { orders: number; cartItems: number };
}

export interface CartItem {
  id: number;
  cartId: number;
  cart?: Cart;
  productId: number;
  product?: Product;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  orderNumber: string;
  cartId: number;
  cart?: {
    id: number;
    user: { firstName: string; lastName: string; email: string; phone: string };
    cartItems: CartItem[];
    _count: { cartItems: number };
  };
  userId: number;
  user?: User;
  items: number;
  totalAmount: number;
  status: StatusOrder;
  shippingAddress:
    | {
        address: string;
        city: string;
        zipCode: string;
        country: string;
      }
    | string;
  shippingMethod: ShippingMethodeOrder;
  trackingNumber: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  delivery?: Delivery;
  invoice?: Invoice;
  transactions?: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Delivery {
  id: number;
  orderId: number;
  order?: Order;
  deliveryPersonId: number;
  deliveryPerson?: Admin;
  state: "DELIVERED" | "NODELIVERED";
  status: "PERFORM" | "NOT_PERFORM";
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: number;
  userId: number;
  user?: User;
  productId: number;
  product?: Product;
}

export interface Review {
  id: number;
  userId: number;
  user: User;
  productId: number;
  product?: Product;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: Date;
}

export interface Newsletter {
  id: number;
  email: string;
  subscribedAt: Date;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  orderId: number;
  order?: Order;
  userId: number;
  user?: User;
  issueDate?: Date;
  dueDate?: Date;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: StatusInvoice;
  notes?: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  trackingNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

// export interface InvoiceLineItem {
// id: number;
// productId: number;
// product: Product;
// description: string;
// quantity: number;
// unitPrice: number;
// taxRate: number;
// subtotal: number;
// }

export interface Transaction {
  id: number;
  transactionNumber: string;
  invoiceId: number;
  invoice?: Invoice;
  userId: number;
  amount: number;
  method: PaymentMethod;
  status: StatusTransaction;
  reference?: string;
  createdAt: Date;
}

export interface AccountLedger {
  id: number;
  wording: string;
  transactionId: number;
  transaction?: Transaction;
  entryType: EntryType;
  description: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomOrder {
  id: number;
  userId: number;
  orderNumber: string;
  title: string;
  description: string;
  images?: string[];
  budget: number;
  deliveryDate?: Date;
  status: StatusCustomOrder;
  adminNotes?: string;
  quotedPrice?: number | null;
  createdAt: string;
  updatedAt?: Date;
}

export interface CargoService {
  id: number;
  name: string;
  isAvailable: boolean;
  pricePerKg: number;
  estimatedDays: number;
  description: string;
}

export interface CargoRoute {
  id: number;
  country: string;
  cities: string[];
  serviceId: string;
  basePrice: number;
  cargoServices: CargoService[];
}

export interface CargoShipment {
  id: number;
  userId: number;
  trackingNumber: string;
  weight: number;
  originCity: string;
  destinationCountry: string;
  destinationCity: string;
  service: CargoService;
  route: CargoRoute;
  totalPrice: number;
  status:
    | "pending"
    | "picked_up"
    | "in_transit"
    | "customs"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface EventService {
  id: number;
  name: string;
  category:
    | "decoration"
    | "venue"
    | "catering"
    | "mc"
    | "photography"
    | "entertainment"
    | "other";
  description: string;
  price: number;
  image: string;
  duration?: string;
  availability: boolean;
}

export interface EventPackage {
  id: number;
  name: string;
  description: string;
  services: EventService[];
  totalPrice: number;
  image: string;
}

export interface EventBooking {
  id: number;
  userId: string;
  bookingNumber: string;
  eventDate: Date;
  eventType: "wedding" | "birthday" | "conference" | "corporate" | "other";
  guestCount: number;
  location: string;
  services: EventService[];
  selectedPackage?: EventPackage;
  totalPrice: number;
  deposit: number;
  status:
    | "inquiry"
    | "quoted"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeautyService {
  id: number;
  name: string;
  category: CategoryBeautyService;
  description: string;
  price: number;
  duration: number; // in minutes
  availability: boolean;
}

export interface BeautyAppointment {
  id: number;
  userId: string;
  appointmentNumber: string;
  service: BeautyService;
  appointmentDate: Date;
  time: string;
  location: "salon" | "home";
  address?: string;
  notes?: string;
  status: StatusBeautyAppointment;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceLocation {
  id: number;
  country: string;
  cities: string[];
  isActive: boolean;
}
