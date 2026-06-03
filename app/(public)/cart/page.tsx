"use client";

import CartItem from "@/components/cart/cart-item";
import CartNotSynchronized from "@/components/cart/cart-not-synchronized";
import CartSummary from "@/components/cart/cart-summary";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { isloading } = useTheme();
  const { isLoggedIn } = useAuth();
  const {
    cartProducts,
    loadCartItemsProduct,
    requiredSynchronized,
    setCurrentPage,
    currentPage,
    totalPages,
    isloadingCart,
    cartItemNotSynchronized,
  } = useCart();

  const [success, setSuccess] = useState("");

  const ITEMS_PER_PAGE: number = 6;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    loadCartItemsProduct(ITEMS_PER_PAGE.toString());
  }, [isLoggedIn, currentPage, success]);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Skeleton emuted={isloading}>
        <h1 className="text-4xl font-bold mb-8">Votre Panier</h1>
      </Skeleton>

      {requiredSynchronized && !isloadingCart && (
        <CartNotSynchronized
          emuted={isloading}
          cartItemNotSynchronized={cartItemNotSynchronized}
          success={success}
          setSuccess={setSuccess}
        />
      )}

      {isloadingCart ? (
        <div className="text-center py-12">
          <Skeleton emuted={isloading}>
            <p className={cn(!isloading && "text-gray-500")}>
              Chargement du panier...
            </p>
          </Skeleton>
        </div>
      ) : cartProducts.length === 0 && !isloadingCart ? (
        <div className="text-center py-12">
          <Skeleton emuted={isloading}>
            <p className={cn(" mb-6", !isloading && "text-gray-500")}>
              Vous n'avez aucun produit dans votre panier pour le moment.
            </p>
          </Skeleton>
          <Link href={isloading ? "#" : APP.public.catalogue}>
            <Button
              variant={isloading ? "emuted" : "default"}
              className={cn(
                !isloading &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
            >
              Effectuer les achats
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-3 gap-8 ",
            requiredSynchronized && "py-6",
          )}
        >
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartProducts?.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                emuted={isloading}
                setSuccess={setSuccess}
              />
            ))}

            {totalPages > 1 && !isloadingCart && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                emuted={isloading || isloadingCart}
              />
            )}
          </div>

          {/* Summary */}
          <CartSummary emuted={isloading} />
        </div>
      )}
    </main>
  );
}
