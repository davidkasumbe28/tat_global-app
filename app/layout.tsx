import { StoreProvider } from "@/context/store-context";
import { cn } from "@/lib/utils/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TAT GLOBAL - Vêtements, Chaussures & Parfums",
  description:
    "Boutique en ligne TAT GLOBAL - Mode, chaussures et parfums de qualité",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={cn(poppins.className, "bg-background text-foreground")}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
