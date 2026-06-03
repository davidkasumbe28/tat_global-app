"use client";

import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
