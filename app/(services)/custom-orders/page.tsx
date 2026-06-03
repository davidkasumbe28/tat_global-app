"use client";

import CustomOrdersBox from "@/components/custom-orders/custom-orders-box";
import CustomOrdersHeader from "@/components/custom-orders/custom-orders-header";
import CustomOrdersSteps from "@/components/custom-orders/custom-orders-steps";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";

export default function CustomOrdersPage() {
  const { isloading } = useTheme();
  const { isloadingAuth } = useAuth();

  return (
   <div className="min-h-screen bg-background text-foreground pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CustomOrdersHeader emuted={isloading} />

        <CustomOrdersSteps emuted={isloading} />

        <CustomOrdersBox emuted={isloading} isloading={isloadingAuth} />

        {/* <div className="bg-white rounded-lg border border-border p-8">
          <h2 className="text-2xl font-bold mb-6">Soumettre une Demande</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie de Commande</label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Article Personnalisé</option>
                <option>Service Spécial</option>
                <option>Autre Demande</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre de la Demande</label>
              <input
                type="text"
                placeholder="Ex: T-shirt personnalisé avec logo"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description Détaillée</label>
              <textarea
                rows={6}
                placeholder="Décrivez votre demande en détail: dimensions, matériel, couleur, délai..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget Estimé (FCF)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Délai Souhaité</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark">
              Soumettre la Demande
            </Button>
          </form>
        </div> */}
      </main>

      <Footer />
    </div>
  );
}
