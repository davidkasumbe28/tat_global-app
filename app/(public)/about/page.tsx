"use client";

import Cta from "@/components/about/cta";
import Hero from "@/components/about/hero";
import Stats from "@/components/about/stats";
import Story from "@/components/about/story";
import Values from "@/components/about/values";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function AboutPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Hero emuted={isloading} />
      <Story emuted={isloading} />
      <Values emuted={isloading} />
      <Stats emuted={isloading} />
      <Cta emuted={isloading} isloading={isloadingAuth} />
    </main>
  );
}
