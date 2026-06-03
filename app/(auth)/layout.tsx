"use client"

import Footer from "@/components/layout/footer";
import AuthNavigation from "@/components/layout/navigation/auth-navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <AuthNavigation />
      {children}
      <Footer />
    </div>
  );
}
