import nunjucks from "nunjucks";

// const templatesPath = path.join(
//   process.cwd(),
//   "src",
//   "emails",
//   "templates",
// );

export const templateEnv = (templatesPath : string) => new nunjucks.Environment(
  new nunjucks.FileSystemLoader(templatesPath),
  {
    autoescape: true,
    noCache: process.env.NODE_ENV === "development",
  },
);



// import  nunjucks from 'nunjucks';
// import path from "path";
// import { ResetEmailContent } from "./@types/types";
// import { Invoice } from "./@types/types";
// import { formatDate } from "./utils/invoice.utils";

// const env = new nunjucks.Environment(
//   new nunjucks.FileSystemLoader(
//     path.join(process.cwd(), "templates")
//   ),
//   {
//     autoescape: true, // très important pour les emails
//   }

// );

// export function resetEmailHTML(content: ResetEmailContent): string {
//   return env.render("reset-email.njk", content);
// }

// export function invoiceEmailHTML(
//   invoice: Invoice,
//   companyInfo: Record<string, string>,
// ): string {

//   const subtotal = invoice.items.reduce(
//     (sum, item) => sum + item.subtotal,
//     0
//   );

//   const taxAmount = invoice.items.reduce(
//     (sum, item) => sum + item.subtotal * item.taxRate,
//     0
//   );

//   const total = subtotal + taxAmount;

//   return env.render("invoice-email.njk", {
//     invoice,
//     companyInfo,
//     subtotal,
//     taxAmount,
//     total,
//     issueDateFormatted: formatDate(invoice.issueDate),
//     dueDateFormatted: formatDate(invoice.dueDate),
//   });
// }