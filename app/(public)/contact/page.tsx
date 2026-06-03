"use client";

import ContactForm from "@/components/contact/contact-form";
import ContactInfos from "@/components/contact/contact-infos";
import ContactMap from "@/components/contact/contact-map";
import ContactHeader from "@/components/contact/contact-header";
import { useTheme } from "@/hooks/use-theme";

export default function ContactPage() {
  const { isloading } = useTheme();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ContactHeader emuted={isloading} />

      <ContactInfos emuted={isloading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ContactForm emuted={isloading} />

        <ContactMap emuted={isloading} />
      </div>
    </main>
  );
}
