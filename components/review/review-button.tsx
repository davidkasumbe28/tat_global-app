import { Product } from "@/lib/@types/types";
import { UserAuth } from "@/lib/@types/user.type";
import {
  handleCreateReview,
  handleUpdateReview,
} from "@/lib/handlers/events-handlers/review-events";
import { cn } from "@/lib/utils/utils";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface ReviewButton {
  product: Product;
  user: UserAuth;
  isLoggedIn: boolean;
  emuted?: boolean;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  success: string;
  isloading?: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  className?: string;
}

export default function ReviewButton({
  product,
  user,
  isLoggedIn,
  emuted = true,
  setError,
  setSuccess,
  success,
  setLoading,
  isloading = true,
  loading,
  className,
}: ReviewButton) {
  const [formData, setFormData] = useState({
    productId: product.id,
    rating: "0.0",
  });
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { rating } = formData;

    if (!rating || rating == "0.0" || parseInt(rating) > 5) {
      setError("");
      setLoading(false);
      return;
    }

    if ((product?.reviews?.length || 0) > 0) {
      const isExist = product?.reviews?.find(
        (review) =>
          review.userId === user?.id && review.productId === product.id,
      );

      if (isExist) {
        const res = await handleUpdateReview(isExist.id, formData);

        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la publication de votre avis, veuillez réesseyer.",
          );
          setLoading(false);
          return;
        }

        setSuccess("success");
        setFormData({
          productId: product.id,
          rating: "0.0",
        });
        setIsEdit(false);
        setLoading(false);
        return;
      }
    }

    const res = await handleCreateReview(formData);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la publication de votre avis, veuillez réesseyer.",
      );
      setLoading(false);
      return;
    }

    setSuccess("success");
    setFormData({
      productId: product.id,
      rating: "0.0",
    });
    setIsEdit(false);
    setLoading(false);
  };

  return (
    <>
      {!isEdit && (
        <Button
          variant={emuted || isloading || loading ? "emuted" : "outline"}
          disabled={emuted || isloading || loading || isEdit || !isLoggedIn}
          onClick={() => setIsEdit(true)}
          className={cn(
            "w-full col-span-3 sm:col-span-2",
            className,
            emuted || isloading || loading ? "animate-pulse" : "bg-transparent",
          )}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Votre avis
        </Button>
      )}

      {/* Form Rating */}
      {isEdit && (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex justify-between items-center w-full gap-4 col-span-3 sm:col-span-2 ",
            className,
          )}
        >
          <div className="w-full">
            <input
              type="number"
              disabled={isloading || emuted || loading}
              min={0.0}
              max={5}
              value={formData.rating}
              name="rating"
              onChange={handleChange}
              placeholder={emuted ? "" : "0.0"}
              step="0.1"
              className="w-full px-4 py-[5] border border-border rounded-lg mt-0 focus:outline-none focus:ring-2 focus:ring-foreground"
            />
          </div>

          {/* Actions Form */}
          <div className="flex gap-2">
            <Button
              disabled={emuted || isloading || loading}
              onClick={() => setIsEdit(false)}
              variant={emuted || isloading ? "emuted" : "outline"}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              variant={emuted ? "emuted" : "default"}
              disabled={isloading || emuted || loading}
              className={cn(
                !emuted &&
                  "bg-foreground text-background hover:bg-primary-dark",
                success && isEdit && "bg-green-600",
              )}
            >
              {isloading ? "Envois..." : "Envoyer"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
