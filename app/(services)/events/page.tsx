"use client";

import EventBox from "@/components/event/event-box";
import EventHeader from "@/components/event/event-header";
import EventServices from "@/components/event/event-services";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function EventsPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventHeader emuted={isloading} />

        <EventServices emuted={isloading} />

        <EventBox emuted={isloading} isloading={isloadingAuth} />
      </main>

      <Footer />
    </div>
  );
}
