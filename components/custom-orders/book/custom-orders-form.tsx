"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomOrdersFormProps {
  formData: {
    userId: number;
    orderNumber: string;
    title: string;
    description: string;
    budget: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      userId: number;
      orderNumber: string;
      title: string;
      description: string;
      budget: string;
    }>
  >;
  handleSubmitOrder: React.MouseEventHandler<HTMLButtonElement>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomOrdersForm({
  formData,
  setFormData,
  handleSubmitOrder,
  setShowForm,
}: CustomOrdersFormProps) {
  return (
    <Card className="p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6">Soumettre une Demande</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Titre de la Commande
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ex: Robe de soirée noire"
            className="w-full px-4 py-3 border border-border rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Description Détaillée
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Décrivez votre commande en détail..."
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Budget Estimé (FCFA)
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
            placeholder="0"
            className="w-full px-4 py-3 border border-border rounded-lg"
          />
        </div>

        <div className="flex gap-4 items-end">
          <Button
            onClick={handleSubmitOrder}
            className="flex-1 bg-foreground text-background hover:bg-primary-dark items-end"
          >
            Soumettre
          </Button>
          <Button
            onClick={() => setShowForm(false)}
            variant="outline"
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </div>
    </Card>
  );
}
