import { sendEmail } from "../../node.mailer";
import { capitalizeFirstLetter } from "../string";
import { renderForgotPasswordEmailHTML } from "./email.renderer";

export async function sendResetEmail(
  { firstName, email }: { firstName: string; email: string },
  tokenId: string,
  link?: string,
) {
  const content = {
    email,
    firstName: capitalizeFirstLetter(firstName),
    tokenId,
    link,
  };

  const message = await sendEmail({
    to: email,
    subject: "Récupération du compte TAT GLOBAL",
    html: renderForgotPasswordEmailHTML(content),
  });

  return message
}
