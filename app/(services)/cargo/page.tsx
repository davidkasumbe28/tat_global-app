"use client";

import CargoBox from "@/components/cargo/cargo-box";
import CargoHeader from "@/components/cargo/cargo-header";
import CargoPresentation from "@/components/cargo/cargo-presentation";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function CargoPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CargoHeader emuted={isloading} />

        <CargoPresentation emuted={isloading} />

        <CargoBox emuted={isloading} isloading={isloadingAuth} />
      </main>

      <Footer />
    </div>
  );
}
