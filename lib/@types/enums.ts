
// This file contains all the enums used in the application. Enums are a way to define a set of named constants that can be used to represent a specific set of values. They are useful for improving code readability and maintainability by providing meaningful names for values that would otherwise be represented as magic strings or numbers.

// Enums for DB
export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export enum StatusUser {
  IN_PROGRESS = "IN_PROGRESS",
  CHECKED = "CHECKED",
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum RoleUser {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum RankAdmin {
  SUPER_ADMIN = "SUPER_ADMIN",
  STANDARD_ADMIN = "STANDARD_ADMIN",
  STOCK_MANAGER = "STOCK_MANAGER",
  DELIVERY_PERSON = "DELIVERY_PERSON",
}

export enum CategoryProduct {
  CLOTHING = "CLOTHING",
  SHOES = "SHOES",
  PERFUMES = "PERFUMES",
  OTHER = "OTHER",
}

export enum StatusOrder {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PREPARATION = "IN_PREPARATION",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum StatusCustomOrder {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PRODUCTION = "IN_PRODUCTION",
  READY_FOR_SHIPMENT = "READY_FOR_SHIPMENT",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum StatusBeautyAppointment {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum StatusTransaction {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// Enums for frontend
export enum CheckoutSteps {
  SHIPPING = "SHIPPING",
  PAYMENT = "PAYMENT",
  CONFIRMATION = "CONFIRMATION",
}

export enum PaymentType {
  IN_TWO_SLICES = "IN_TWO_SLICES",
  IN_ONE_SLICE = "IN_ONE_SLICE",
};

export enum PaymentMethod {
  AIRTEL_MONEY = "AIRTEL_MONEY",
  MPESA = "MPESA",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
  CARD = "CARD",
  PAYPAL = "PAYPAL",
  AIRTEL_MONEY_ON_CONFIRMATION_CASH_ON_DELIVERY = "AIRTEL_MONEY_ON_CONFIRMATION_CASH_ON_DELIVERY",
  MPESA_ON_CONFIRMATION_CASH_ON_DELIVERY = "MPESA_ON_CONFIRMATION_CASH_ON_DELIVERY",
};

export enum ShippingType {
  EXPRESS = "EXPRESS",
  STANDARD = "STANDARD",
  OVERNIGHT = "OVERNIGHT",
}

export enum StatusInvoice {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum CompareSigne {
  ">" = ">",
  "<" = "<",
  "=" = "=",
  ">=" = ">=",
  "<=" = "<="
}
