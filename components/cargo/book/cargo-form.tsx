"use client";
import { Button } from '@/components/ui/button';


interface CargoFormProps {
  formData: {
    weight: string;
    originCity: string;
    destinationCountry: string;
    destinationCity: string;
    serviceType: string;
    description: string;
    value: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      weight: string;
      originCity: string;
      destinationCountry: string;
      destinationCity: string;
      serviceType: string;
      description: string;
      value: string;
    }>
  >;
  calculateQuote: React.MouseEventHandler<HTMLButtonElement>;
  calculating: boolean;
}

export default function CargoForm({
  formData,
  setFormData,
  calculateQuote,
  calculating,
}: CargoFormProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-8">
      <h2 className="text-2xl font-bold mb-6">Détails de l'Envoi</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Poids (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) =>
              setFormData({ ...formData, weight: e.target.value })
            }
            placeholder="Ex: 5"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ville d'Origine
            </label>
            <input
              type="text"
              value={formData.originCity}
              onChange={(e) =>
                setFormData({ ...formData, originCity: e.target.value })
              }
              disabled
              className="w-full px-4 py-3 border border-border rounded-lg bg-muted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Pays Destination
            </label>
            <select
              value={formData.destinationCountry}
              onChange={(e) =>
                setFormData({ ...formData, destinationCountry: e.target.value })
              }
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              <option value="">Sélectionner un pays</option>
              <option value="France">France</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Mali">Mali</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ville Destination
          </label>
          <input
            type="text"
            value={formData.destinationCity}
            onChange={(e) =>
              setFormData({ ...formData, destinationCity: e.target.value })
            }
            placeholder="Ex: Abidjan"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Type de Service
          </label>
          <select
            value={formData.serviceType}
            onChange={(e) =>
              setFormData({ ...formData, serviceType: e.target.value })
            }
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          >
            <option value="standard">Standard (7 jours)</option>
            <option value="express">Express (3 jours)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Valeur Déclarée (FCFA)
          </label>
          <input
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            placeholder="0"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description du Contenu
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Décrivez ce que contient votre colis..."
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
          />
        </div>

        <Button
          onClick={calculateQuote}
          disabled={
            !formData.weight || !formData.destinationCountry || calculating
          }
          className="w-full bg-foreground text-background hover:bg-primary-dark"
        >
          {calculating ? "Calcul en cours..." : "Calculer le Devis"}
        </Button>
      </div>
    </div>
  );
}
