"use client";

import CollectionCarousel from "@/components/collection/collection-carousel";
import CollectionHeader from "@/components/collection/collection-header";
import CollectionProductsGrid from "@/components/collection/collection-products-grid";
import { useTheme } from "@/hooks/use-theme";
import { Collection, Product } from "@/lib/@types/types";
import { handleReadCollectionCollections } from "@/lib/handlers/events-handlers/collection-events";
import { handleReadCollectionProducts } from "@/lib/handlers/events-handlers/product-events";
import { useEffect, useState } from "react";

export default function CollectionPage() {
  const { isloading } = useTheme();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState(0);
  const [error, setError] = useState("");

  const ITEMS_PER_PAGE = 8;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(true);
    handleReadCollectionCollections()
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération des collections",
          );
          setLoading(false);
          return;
        }
        setCollections(res.data.collections);
        setSelectedCollection(res.data.collections[0].id);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCollection === 0) {
      setLoadingProducts(false);
      return;
    }

    setLoadingProducts(true);
    handleReadCollectionProducts(
      selectedCollection,
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
    )
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération des produits",
          );
          setLoadingProducts(false);
          return;
        }
        setProducts(res.data.products);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoadingProducts(false);
      })
      .catch((err) => {
        setError(err);
        setLoadingProducts(false);
      });
  }, [currentPage, selectedCollection]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CollectionHeader emuted={isloading} />

      <CollectionCarousel
        emuted={isloading}
        loading={loading}
        collections={collections}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
      />

      {selectedCollection !== 0 && collections.length > 0 && (
        <CollectionProductsGrid
          emuted={isloading}
          loading={loadingProducts}
          collections={collections}
          selectedCollection={selectedCollection}
          products={products}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}

      {/* Exclusive Offers */}
      {/* <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Offres Exclusives</h2>
          <p className="text-lg mb-6 opacity-90">
            Bénéficiez de -25% sur votre première collection avec le code:
            PREMIERE25
          </p>
          <p className="text-sm opacity-75 mb-6">
            Offre valide jusqu'au 31 décembre 2025 pour les nouvelles commandes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-background text-foreground hover:bg-gray-100">
              Voir les Détails
            </Button>
            <Button
              variant="outline"
              className="text-background border-background hover:bg-foreground/90 hover:text-primary bg-transparent"
            >
              Profiter de l'Offre
            </Button>
          </div> 
        </div>*/}
    </main>
  );
}
