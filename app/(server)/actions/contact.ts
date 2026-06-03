"use server";

import type { ContactMessage, Newsletter } from "@/lib/@types/types";
import { validateEmail } from "@/lib/validators/validators";

// Mock storage
const contactMessages: ContactMessage[] = [];
const newsletters: Newsletter[] = [];

export async function submitContactAction(
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  try {
    // Validate inputs
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      return { success: false, error: "Tous les champs sont requis" };
    }

    if (!validateEmail(email)) {
      return { success: false, error: "Email invalide" };
    }

    if (message.trim().length < 10) {
      return {
        success: false,
        error: "Le message doit contenir au moins 10 caractères",
      };
    }

    const contactMessage: ContactMessage = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: "new",
      createdAt: new Date(),
    };

    contactMessages.push(contactMessage);
    console.log("[v0] Contact message saved:", contactMessage);

    return { success: true, messageId: contactMessage.id };
  } catch (error) {
    console.error("[v0] Submit contact error:", error);
    return { success: false, error: "Erreur lors de l'envoi du message" };
  }
}

export async function subscribeNewsletterAction(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    if (!email.trim()) {
      return { success: false, error: "Email requis" };
    }

    if (!validateEmail(email)) {
      return { success: false, error: "Email invalide" };
    }

    // Check if already subscribed
    const exists = newsletters.some((n) => n.email === email.trim());
    if (exists) {
      return { success: false, error: "Cet email est déjà abonné" };
    }

    const newsletter: Newsletter = {
      id: Date.now(),
      email: email.trim(),
      subscribedAt: new Date(),
    };

    newsletters.push(newsletter);
    console.log("[v0] Newsletter subscription saved:", newsletter);

    return { success: true };
  } catch (error) {
    console.error("[v0] Subscribe newsletter error:", error);
    return { success: false, error: "Erreur lors de l'abonnement" };
  }
}

export async function getContactMessagesAction(): Promise<{
  success: boolean;
  messages?: ContactMessage[];
  error?: string;
}> {
  try {
    return { success: true, messages: contactMessages };
  } catch (error) {
    console.error("[v0] Get messages error:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des messages",
    };
  }
}

export async function updateMessageStatusAction(
  messageId: number,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const validStatuses = ["new", "read", "responded"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Statut invalide" };
    }

    const message = contactMessages.find((m) => m.id === messageId);
    if (!message) {
      return { success: false, error: "Message non trouvé" };
    }

    message.status = status as any;
    console.log("[v0] Message status updated:", messageId, status);

    return { success: true };
  } catch (error) {
    console.error("[v0] Update message status error:", error);
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
