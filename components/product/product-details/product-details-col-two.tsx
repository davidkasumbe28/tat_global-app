import AddToCartButton from "@/components/cart/add-to-cart-button";
import DeliveryInfo from "@/components/delivery-info";
import ErrorInfo from "@/components/error-info";
import FavoriteButton from "@/components/favorite/favorite-button";
import ReviewButton from "@/components/review/review-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Product, Review } from "@/lib/@types/types";
import { UserAuth } from "@/lib/@types/user.type";
import { cn } from "@/lib/utils/utils";
import { Star } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface ProductDetailsColTwo {
  emuted: boolean;
  isloading: boolean;
  product: Product;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  selectedSize: string;
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductDetailsColTwo({
  emuted = true,
  isloading = true,
  product,
  setSelectedColor,
  selectedColor,
  setSelectedSize,
  selectedSize,
  success,
  setSuccess,
}: ProductDetailsColTwo) {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isloadingCart } = useCart()

  const categories = [
    { label: "Tous", value: "ALL" },
    { label: "Vêtements", value: "CLOTHING" },
    { label: "Chaussures", value: "SHOES" },
    { label: "Parfums", value: "PERFUMES" },
    { label: "Autres", value: "OTHER" },
  ];

  const ratings = product?.reviews?.map((review: Review) => review.rating);

  const reviewsRating =
    ratings && ratings.length > 0
      ? ratings?.reduce((accumulator: number, currentValue: number) => {
          return accumulator + currentValue;
        }, 0)
      : 0;

  const rating =
    (product.rating + reviewsRating) / ((product?._count?.reviews || 0) + 1);

  return (
    <div className="space-y-6">
      <div>
        {/* Category */}
        <Skeleton emuted={emuted || isloading || loading}>
          <span className="text-sm uppercase font-semibold">
            {categories.map((category) => {
              if (category.value === product?.category) return category.label;
            })}
          </span>
        </Skeleton>

        {/* Name */}
        <Skeleton emuted={emuted || isloading || loading}>
          <h1 className="text-4xl font-bold mt-2 mb-2 text-balance">
            {product.name}
          </h1>
        </Skeleton>

        {/* Rating and reviews  */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  emuted || isloading || loading
                    ? "fill-muted-foreground text-muted-foreground animate-pulse"
                    : i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-gray-300",
                )}
              />
            ))}
          </div>

          <Skeleton emuted={emuted || isloading || loading}>
            <span
              className={cn(
                "text-sm",
                !emuted && !isloading && !loading && "text-gray-500",
              )}
            >
              {rating.toFixed(1)} ({product?._count?.reviews || 0} avis)
            </span>
          </Skeleton>
        </div>

        {/* Description */}
        <Skeleton emuted={emuted || isloading || loading}>
          <p
            className={cn(!emuted && !isloading && !loading && "text-gray-500")}
          >
            {product.description}
          </p>
        </Skeleton>
      </div>

      {/* Price and Stock */}
      <div className="border-t border-b border-border py-4">
        <Skeleton emuted={emuted || isloading || loading}>
          <p className="text-4xl font-bold ">
            {parseInt(product?.price.toString())?.toFixed(2)}$
          </p>
        </Skeleton>

        <Skeleton emuted={emuted || isloading || loading || isloadingCart}>
          {product?.stock || 0 > 0 ? (
            <p
              className={cn(
                "text-sm mt-2",
                !emuted && !isloading && !loading && !isloadingCart && "text-green-600",
              )}
            >
              En stock ({product?.stock} disponibles)
            </p>
          ) : (
            <p
              className={cn(
                "text-sm mt-2",
                !emuted && !isloading && !loading && !isloadingCart && "text-destructive",
              )}
            >
              Rupture de stock
            </p>
          )}
        </Skeleton>
      </div>

      {/* Color Selection */}
      {product.colors?.split(",") &&
        (product?.colors.split(",")).length > 1 && (
          <div>
            <Skeleton emuted={emuted}>
              <h3 className="font-bold mb-3">Couleur</h3>
            </Skeleton>
            <div className="flex gap-3 flex-wrap">
              {product.colors.split(",").map(
                (color) =>
                  color && (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={emuted || isloading || loading}
                      className={cn(
                        "px-4 py-2 rounded-lg border-2 transition",
                        emuted || isloading || loading
                          ? "text-muted-foreground bg-muted-foreground animate-pulse"
                          : selectedColor === color
                            ? "hover:border-primary-dark bg-foreground hover:bg-primary-dark text-background"
                            : "border-border hover:border-foreground",
                      )}
                    >
                      {color}
                    </button>
                  ),
              )}
            </div>
          </div>
        )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 1 && (
        <div>
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-3">Taille</h3>
          </Skeleton>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {product.sizes.split(",").map(
              (size) =>
                size && (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={emuted || isloading || loading}
                    className={cn(
                      "py-2 rounded-lg border-2 transition text-sm",
                      emuted || isloading || loading
                        ? "text-muted-foreground bg-muted-foreground animate-pulse"
                        : selectedSize === size
                          ? "hover:border-primary-dark bg-foreground hover:bg-primary-dark text-background"
                          : "border-border hover:border-foreground",
                    )}
                  >
                    {size}
                  </button>
                ),
            )}
          </div>
        </div>
      )}

      {/* Add to Cart with integrated quantity */}
      {(product?.stock || 0) > 0 && (
        <div>
          <AddToCartButton
            product={product}
            size={selectedSize}
            color={selectedColor}
            className={cn(
              "w-full",
              emuted || (isloading && loading && "animate-pulse"),
            )}
            emuted={emuted || isloading || loading}
            setSuccess={setSuccess}
          />
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Add and Remove to favorites */}
        <FavoriteButton
          productId={product.id}
          className="w-full h-auto justify-center bg-accent hover:bg-accent/80 col-span-3 sm:col-span-1"
          emuted={emuted || isloading || loading}
        />

        {/* Publish review */}
        <ReviewButton
          product={product}
          user={user as UserAuth}
          isLoggedIn={isLoggedIn}
          emuted={emuted}
          setError={setError}
          setSuccess={setSuccess}
          success={success}
          setLoading={setLoading}
          loading={loading}
          isloading={isloading}
        />
      </div>

      {/* Error Info */}
      {error && (
        <ErrorInfo emuted={emuted || isloading || loading} info={error} />
      )}

      {/* Delivery Info */}
      <DeliveryInfo emuted={emuted || loading} />
    </div>
  );
}
