"use client";

import FAQBox from "@/components/faq/faq-box";
import FAQHeader from "@/components/faq/faq-header";
import FAQSections from "@/components/faq/faq-sections";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function FAQPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <FAQHeader emuted={isloading} />

      <FAQSections emuted={isloading} />

      <FAQBox emuted={isloading} isloading={isloadingAuth} />
    </main>
  );
}
