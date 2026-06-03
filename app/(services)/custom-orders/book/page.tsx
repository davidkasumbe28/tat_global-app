"use client";

import CustomOrdersForm from "@/components/custom-orders/book/custom-orders-form";
import CustomOrdersItem from "@/components/custom-orders/book/custom-orders-item";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation/navigation";
import NotAuthorized from "@/components/layout/not-authorized";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/context/store-context";
import { CustomOrder } from "@/lib/@types/types";
import { mockCustomOrders } from "@/lib/data/mock/mock.data";
import { order as libAppOrder } from "@/lib/data/raw/order";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function BookCustomOrdersPage() {
  const { isLoggedIn, isloading } = useStore();
  const [orders, setOrders] = useState(mockCustomOrders);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: 0,
    orderNumber: "",
    title: "",
    description: "",
    budget: "",
  });

  if (!isLoggedIn)
    return (
      <NotAuthorized
        functionality={"Commandez vos produits et services sur mesure"}
      />
    );

  const handleSubmitOrder = () => {
    if (formData.title && formData.description && formData.budget) {
      const newOrder: CustomOrder = {
        id: orders.length + 1,
        ...formData,
        budget: Number.parseInt(formData.budget),
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
        quotedPrice: null,
      };
      setOrders([newOrder, ...orders]);
      setFormData({
        userId: 0,
        orderNumber: "",
        title: "",
        description: "",
        budget: "",
      });
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex max-lg:flex-col justify-between items-end mb-12">
          <div className="flex flex-col justify-center items-center mb-12 w-full h-full ">
            <h1 className="text-4xl font-bold mb-2">
              Commandes Personnalisées
            </h1>
            <p className="text-xl text-muted-foreground">
              Commandez vos produits et services sur mesure
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-foreground text-background hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Commande
          </Button>
        </div>

        {showForm && (
          <CustomOrdersForm
            formData={formData}
            setShowForm={setShowForm}
            setFormData={setFormData}
            handleSubmitOrder={handleSubmitOrder}
          />
        )}

        <div className="grid gap-6">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                Aucune commande personnalisée pour le moment
              </p>
            </Card>
          ) : (
            orders.map((order, index) => (
              <CustomOrdersItem
                key={index}
                order={order}
                libAppOrder={libAppOrder}
              />
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
