"use client";

import Hero from "@/components/home/hero";
import ProductCatalog from "@/components/home/product-catalog";
import ServicesCard from "@/components/home/services-card";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();
  
  return (
    <div className="min-h-screen bg-background text-foreground gap-5 ">
      <Navigation />

      <main>
        <Hero emuted={isloading} isloading={isloadingAuth} />
        <ServicesCard emuted={isloading} isloading={isloadingAuth} />
        <ProductCatalog emuted={isloading} />
      </main>

      <Footer />
    </div>
  );
}
