export const nodemailerConfig = {
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_APP,
    pass: process.env.GMAIL_APP_PASS,
  },
};
