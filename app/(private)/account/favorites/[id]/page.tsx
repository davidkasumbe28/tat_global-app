"use client";

import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import ProductDetailsColOne from "@/components/product/product-details/product-details-col-one";
import ProductDetailsColTwo from "@/components/product/product-details/product-details-col-two";
import { useTheme } from "@/hooks/use-theme";
import { Product } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { handleReadFavorite } from "@/lib/handlers/events-handlers/favorite-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FavoriteProductDetailsPage() {
  const { isloading } = useTheme();
  const params = useParams();
  const favoriteId = params.id as string;
  const [favoriteProduct, setFavoriteProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    handleReadFavorite(parseInt(favoriteId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération des informations du produit favori",
          );
          setLoading(false);
          return;
        }
        setFavoriteProduct(res.data.product);
        if (
          res.data.product.sizes &&
          res.data.product.sizes.split(",").length > 0
        ) {
          setSelectedSize(res.data.product.sizes.split(",")[0]);
        }
        if (
          res.data.product.colors &&
          res.data.product.colors.split(",").length > 0
        ) {
          setSelectedColor(res.data.product.colors.split(",")[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [favoriteId, success]);

  if (loading) return <Loading subject="du produit favori" />;

  if (!favoriteProduct) return <Error error={error} />;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Col One */}
        <ProductDetailsColOne
          backPath={APP.private.favorites}
          emuted={isloading}
          isloading={loading}
          product={{ name: favoriteProduct.name, image: favoriteProduct.image }}
        />

        {/* Product Col Two */}
        <ProductDetailsColTwo
          emuted={isloading}
          isloading={loading}
          product={favoriteProduct}
          setSelectedColor={setSelectedColor}
          selectedColor={selectedColor}
          setSelectedSize={setSelectedSize}
          selectedSize={selectedSize}
          success={success}
          setSuccess={setSuccess}
        />
      </div>
    </main>
  );
}
