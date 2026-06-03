"use client";

import BeautyBox from "@/components/beauty/beauty-box";
import BeautyHeader from "@/components/beauty/beauty-header";
import BeautyServices from "@/components/beauty/beauty-services";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function BeautyPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BeautyHeader emuted={isloading} />

        <BeautyServices emuted={isloading} />

        <BeautyBox emuted={isloading} isloading={isloadingAuth} />
      </main>

      <Footer />
    </div>
  );
}
