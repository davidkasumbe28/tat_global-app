import { de } from "date-fns/locale";

const error = {
  server:
    "Une erreur est survenue sur nos serveurs, veuillez réesseyer plus tard",
  login: "Une erreur est survenue lors de la connexion",
  signup: "Une erreur est survenue lors de l'inscription",
  forgetPassword:
    "Une erreur est survenue lors de la récuperation de vos informations",
  authenticated: "Une erreur est survenue lors de l'authentification",
  logout: "Une erreur est survenue lors de la déconnexion",
  updateStatusUser:
    "Une erreur est survenue lors du mise à jour de votre status",
  updatePasswordUser:
    "Une erreur est survenue lors du mise à jour de votre mot de passe",
  readProfileUser:
    "Une erreur est survenue lors de la récupération de votre profil",
  updateProfileUser:
    "Une erreur est survenue lors du mise à jour de votre profil",
  deleteProfileUser:
    "Une erreur est survenue lors de la suppression de votre profil",
  checking:
    "Une erreur est survenue lors de la confirmation de vos information",
  is_not_me:
    "Une erreur est survenue lors de la verification de vos information",
  resendForgetPasswordEmail:
    "Une erreur est survenue lors de l'envois de l'email de vérification",
  resetPassword:
    "Une erreur est survenue lors de la réinitialisation de votre mot de passe",
  verify: "Une erreur est survenue lors de la verification de vos informations",
  state:
    "Votre compte n'est pas active, contactez le service client pour plus d'information",
  unauthenticated:
    "Jeton d'autorisation introuvable ou expiré, non authentifié",
  invalidToken: "Jeton invalide, non authentifié",
  invalidSession: "Session invalide, non authentifié",
  notAuthorized:
    "Vous n'avez pas les autorisations pour effectuer cette action.",
  vercelBlob: {
    server:
      "Une erreur est survenue sur nos serveurs, veuillez réesseyer plus tard",
    avatar: "Une erreur est survenue lors du téléchargement de votre avatar",
  },
  read: {
    users: "Une erreur est survenue lors de la récupération des utilisateurs",
    user: "Une erreur est survenue lors de la récupération des informations de l'utilisateur",
    managers : "Une erreur est survenue lors de la récupération des administrateurs",
    sessions: "Une erreur est survenue lors de la récupération des sessions",
    session: "Une erreur est survenue lors de la récupération de la session",
    collections:
      "Une erreur est survenue lors de la récupération des collections",
    products: "Une erreur est survenue lors de la récupération des produits",
    favorites:
      "Une erreur est survenue lors de la récupération des produits favoris",
    reviews: "Une erreur est survenue lors de la récupération des avis",
    carts: "Une erreur est survenue lors de la récupération de vos paniers",
    cartItems:
      "Une erreur est survenue lors de la récupération des produits du panier",
    orders: "Une erreur est survenue lors de la récupération des commandes",
    invoices: "Une erreur est survenue lors de la récupération des factures",
    transactions: "Une erreur est survenue lors de la récupération des transactions",
    accountLedgers: "Une erreur est survenue lors de la récupération des comptes",
    stats: "Une erreur est survenue lors de la récupération des stats",

    collection:
      "Une erreur est survenue lors de la récupération des informations de la collection",
    product:
      "Une erreur est survenue lors de la récupération des informations du produit",
    favorite:
      "Une erreur est survenue lors de la récupération des informations du produit favori",
    review:
      "Une erreur est survenue lors de la récupération des informations de l'avis",
    cart: "Une erreur est survenue lors de la récupération de votre panier",
    cartItem:
      "Une erreur est survenue lors de la récupération du produit du panier",
    order: "Une erreur est survenue lors de la récupération du commande",
    invoice: "Une erreur est survenue lors de la récupération de la facture",
    transaction: "Une erreur est survenue lors de la récupération de la transaction",
    accountLedger: "Une erreur est survenue lors de la récupération du compte",
  },
  create: {
    user: "Une erreur est survenue lors l'enregistrement des informations de l'utilisateur",
    session: "Une erreur est survenue lors de l'initialisation de la session",
    favorites:
      "Une erreur est survenue lors de l'ajout des produits dans vos favories",
    collection: "Une erreur est survenue lors de l'ajout de la collection",
    product: "Une erreur est survenue lors de l'ajout du produit",
    favorite:
      "Une erreur est survenue lors de l'ajout du produit dans vos favories",
    review: "Une erreur est survenue lors de la publication de votre avis",
    cart: "Une erreur est survenue lors de l'initialisation de votre panier",
    cartItem:
      "Une erreur est survenue lors de l'ajout du produit dans le panier",
    order: "Une erreur est survenue lors l'enregistrement de votre commande",
    invoice: "Une erreur est survenue lors de la création de la facture",
    delivery: "Une erreur est survenue lors de la création de la livraison",
    transaction : "Une erreur est survenue lors de la création de la transaction",
  },
  update: {
    user: "Une erreur est survenue lors du mise à jour des informations de l'utilisateur",
    session: "Une erreur est survenue lors de la mise à jour de la session",
    collection:
      "Une erreur est survenue lors de la mise à jour des informations de la collection",
    product:
      "Une erreur est survenue lors de la mise à jour des informations du produit",
    review: "Une erreur est survenue lors de la publication de votre avis",
    cartItem:
      "Une erreur est survenue lors de la mise à jour de la quantité du produit",
    order: "Une erreur est survenue lors de la mise à jour de la commande",
    invoice: "Une erreur est survenue lors de la mise à jour de la facture",
      transaction: "Une erreur est survenue lors de la mise à jour de la transaction",
      accountLedger: "Une erreur est survenue lors de la mise à jour du compte",


  },
  delete: {
    user: "Une erreur est survenue lors de la suppression des informations de l'utilisateur",
    session: "Une erreur est survenue lors de la suppression de la session",
    collection:
      "Une erreur est survenue lors de la suppression de la collection",
    product: "Une erreur est survenue lors de la suppression du produit",
    favorite:
      "Une erreur est survenue lors de la suppression du produit de vos favories",
    cartItem:
      "Une erreur est survenue lors du retrait du produit de votre panier",
    order: "Une erreur est survenue lors de la suppression de la commande",
    invoice: "Une erreur est survenue lors de la suppression de la facture",
    transaction: "Une erreur est survenue lors de la suppression de la transaction",
    accountLedger: "Une erreur est survenue lors de la suppression du compte",

  },
};

const success = {
  login: "Connnecter.",
  logout: "Déconnecter.",
  updateProfileUser: "Vos informations ont été mise à jour",
  is_not_me: "Annuler",
  read: {
    users: "",
    user: "",
  },
  create: {
    users: "",
    user: "",
  },
  update: {
    user: (name: string) =>
      "Les informations de l'utilistaeur " + name + " ont été mise à jour",
  },
  delete: {
    user: (name: string) =>
      "Les informations de l'utilistaeur " + name + " ont été supprimer",
  },
};

export default { error, success };
