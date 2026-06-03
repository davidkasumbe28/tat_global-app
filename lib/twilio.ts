import twilio from 'twilio';

// Initialisation du client avec les types auto-générés
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

interface WhatsAppPayload {
  to: string;
  body?: string;
  contentSid?: string,
  contentVariables?: string
}

async function sendMessage({ to, body, contentSid, contentVariables }: WhatsAppPayload) {

  const message = await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: "whatsapp:" + to, // Format E.164 (ex: +33600000000)
    body,
    contentSid,
    contentVariables
  });

  return message

}

export { sendMessage }