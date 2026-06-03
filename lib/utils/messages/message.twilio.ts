import { OrderConfirmationContent } from "@/lib/@types/types";
import { WHATSAPP_TEMPLATES } from "@/lib/constants/constants";

export function twilioOrderConfirmation(
  content: OrderConfirmationContent,
): { contentSid: string, contentVariables: string } {

  const contentSid = WHATSAPP_TEMPLATES.ORDER_CONFIRMATION

  const variables = {
    first_name: content.first_name,
    last_name: content.last_name,
    orderSku: content.orderSku,
    orderTotal: content.orderTotal,
    domain_name: content.domain_name
  }

  const safeVariables = Object.fromEntries(
    Object.entries(variables || {}).map(([key, value]) => [
      key,
      value ? String(value).replace(/\n/g, ' ') : " " // Remplace les sauts de ligne par un espace
    ])
  );

  const contentVariables = JSON.stringify(safeVariables)

  return { contentSid, contentVariables }
}