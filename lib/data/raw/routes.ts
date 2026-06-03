import invoices from "../processed/invoices";
import transactions from "../processed/transaction";

const APP = {
  auth: {
    login: "/login",
    forgetPassword: "/forget-password",
    signup: "/signup",
  },

  check: {
    verify: "/verify",
    verifyToken: /^\/verify\/[a-f0-9]{64}$/,
    resetPassword: "/reset-password",
    resetPasswordToken: /^\/reset-password\/[a-f0-9]{64}$/,
  },

  admin: {
    dashboard: "/admin",
    users : "/admin/users",
    customers: "/admin/users/customers",
    managers : "/admin/users/managers",
    collections: "/admin/collections",
    products: "/admin/products",
    orders : "/admin/orders",
    invoices : "/admin/invoices",
  },

  public: {
    home: "/",
    catalogue: "/catalogue",
    collection: "/collection",
    customOrders: "/custom-orders",
    beauty: "/beauty",
    cargo: "/cargo",
    events: "/events",
    about: "/about",
    contact: "/contact",
    faq: "/faq",
    product: "/product",
    productId: /^\/product\/([1-9]\d*)$/,
    cart: "/cart",
  },

  private: {
    formCompletion: "/form-completion",
    account: "/account",
    favorites: "/account/favorites",
    orders: "/account/orders",
    invoices: "/account/invoices",
    customOrders: "/custom-orders/book",
    beauty: "/beauty/book",
    cargo: "/cargo/book",
    events: "/events/book",
    checkout: "/checkout",
    admin: "/admin",
  },
};

const API = {
  public: {
    home: "/",
    login: "/auth/login",
    signup: "/auth/signup",
    forgetPassword: "/auth/forget-password",
    collectionsCollection: "/collections/collection",
    productsCollection: "/products/collection",
    productsCatalogue: "/products/catalogue",
  },
  private: {
    auth: "/auth",
    me: "/auth/me",
    logout: "/auth/logout",
    check: "/check",
    isNotMe: "/check/is-not-me",
    resendForgotPasswordEmail: "/check/resend-forgot-password-email",
    resetPassword: "/check/reset-password",
    verify: "/check/verify",
    uploadAvatar: "/auth/me/upload/avatar",
    favorites: "/auth/me/favorites",
    favoritesFavorite: "/auth/me/favorites/favorite",
    reviews: "/auth/me/reviews",
    reviewsReview: "/auth/me/reviews/review",
    cart: "/auth/me/cart",
    cartItems: "/auth/me/cartItems",
    cartItemsCart: "/auth/me/cartItems/cart",
    myOrders: "/auth/me/orders",
    myOrdersOrder: "/auth/me/orders/order",
    myInvoices: "/auth/me/invoices",
    myInvoicesInvoice: "/auth/me/invoices/invoice",
    users : "/users",
    collections: "/collections",
    collectionsSelect: "/collections/select",
    products: "/products",
    productsCartItem: "/products/cartItem",
    orders: "/orders",
    invoices : "/invoices",
    transactions : "/transactions",
    deliveries : "/deliveries"
  },
};

export { APP, API };
