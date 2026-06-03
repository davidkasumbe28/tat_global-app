"use client";

import Error from "@/components/layout/error";
import Loading from "@/components/layout/loading";
import ProductDetailsColOne from "@/components/product/product-details/product-details-col-one";
import ProductDetailsColTwo from "@/components/product/product-details/product-details-col-two";
import { useTheme } from "@/hooks/use-theme";
import { Product } from "@/lib/@types/types";
import { handleReadProduct } from "@/lib/handlers/events-handlers/product-events";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetailsPage() {
  const { isloading } = useTheme();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    handleReadProduct(parseInt(productId))
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération des informations du produit",
          );
          setLoading(false);
          return;
        }
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.split(",").length > 0) {
          setSelectedSize(res.data.sizes.split(",")[0]);
        }
        if (res.data.colors && res.data.colors.split(",").length > 0) {
          setSelectedColor(res.data.colors.split(",")[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [productId, success]);

  if (loading) return <Loading subject="du produit" />;

  if (!product) return <Error error={error} />;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Col One */}
        <ProductDetailsColOne
          emuted={isloading}
          isloading={loading}
          product={{ name: product.name, image: product.image }}
        />

        {/* Product Col Two */}
        <ProductDetailsColTwo
          emuted={isloading}
          isloading={loading}
          product={product}
          setSelectedColor={setSelectedColor}
          selectedColor={selectedColor}
          setSelectedSize={setSelectedSize}
          selectedSize={selectedSize}
          setSuccess={setSuccess}
          success={success}
        />
      </div>
    </main>
  );
}
