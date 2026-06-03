import { Invoice, ResetEmailContent } from "@/lib/@types/types";
import { templateEnv } from "@/lib/nunjucks";
import { formatDate } from "../invoice.utils";
import { TEMPLATES_PATH } from "@/lib/constants/constants";


export function renderForgotPasswordEmailHTML(
  content: ResetEmailContent,
): string {
  try {
    const env = templateEnv(TEMPLATES_PATH.EMAIL)
    return env.render("forgot-password-email.template.njk", content);
  } catch (error) {
    throw error
  }
}

export function renderInvoiceEmailHTML(
  invoice: Invoice,
  companyInfo: Record<string, string>,
): string {

  const env = templateEnv(TEMPLATES_PATH.EMAIL)

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  const taxAmount = invoice.items.reduce(
    (sum, item) => sum + item.subtotal * item.taxRate,
    0,
  );

  const total = subtotal + taxAmount;

  return env.render("invoice-email.template.njk", {
    invoice,
    companyInfo,
    subtotal,
    taxAmount,
    total,
    issueDateFormatted: formatDate(invoice.issueDate),
    dueDateFormatted: formatDate(invoice.dueDate),
  });
}