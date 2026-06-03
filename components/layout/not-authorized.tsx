"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "./navigation/navigation";
import { Button } from "../ui/button";
import Footer from "./footer";

export default function NotAuthorized({
  functionality,
}: {
  functionality?: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-4">Accès Réservé</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Veuillez vous connecter{" "}
            {functionality && "pour " + functionality.toLowerCase()}.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-foreground text-background"
          >
            Se Connecter
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
