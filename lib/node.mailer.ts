import nodemailer from "nodemailer";
import { nodemailerConfig } from "./config/nodemailer.config";

const transporter = nodemailer.createTransport(nodemailerConfig);

interface MailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

async function sendEmail({
  to,
  subject,
  html,
  text,
}: MailPayload) {
  const mailOptions = {
    from: process.env.GMAIL_APP as string,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

export { sendEmail };
