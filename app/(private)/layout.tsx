"use client";

import Footer from "@/components/layout/footer";
import PrivateNavigation from "@/components/layout/navigation/private-navigation";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <PrivateNavigation />
      {children}
      <Footer />
    </div>
  );
}
