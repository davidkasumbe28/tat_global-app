import { OrderConfirmationContent } from "@/lib/@types/types";
import { sendMessage } from "@/lib/twilio";
import { twilioOrderConfirmation } from "./message.twilio";


export async function sendOrderConfirmationMessage(to: string, content: OrderConfirmationContent) {

  const { contentSid, contentVariables } = twilioOrderConfirmation(content)

  const message = await sendMessage({ to, contentSid, contentVariables });

  console.log(message)
}