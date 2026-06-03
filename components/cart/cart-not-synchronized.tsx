import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/lib/@types/types";
import { cn } from "@/lib/utils/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CartNotSynchronizedItem from "./cart-not-synchronized-item";
import SuccessInfo from "../success-info";

export default function CartNotSynchronized({
  emuted = true,
  cartItemNotSynchronized,
  success,
  setSuccess,
}: {
  emuted?: boolean;
  cartItemNotSynchronized: CartItem[];
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user, isLoggedIn } = useAuth();
  const {
    cart,
    synchronizedCart,
    setRequiredSynchronized,
    requiredSynchronized,
    setIsloadingCart,
  } = useCart();

  const synchronized = async () => {
    if (requiredSynchronized) {
      try {
        await synchronizedCart(cart?.id as number, user?.id);
        setIsloadingCart(false);
        setSuccess("Panier synchronisé.");
        setRequiredSynchronized(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const giveUp = () => {
    try {
      localStorage.removeItem("cart");
      setSuccess("Panier abandonné.");
      setRequiredSynchronized(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={cn(
        " border border-border rounded-lg px-4 py-2 space-y-4 h-full",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <div className="flex flex-col items-start justify-start">
        <Skeleton emuted={emuted}>
          <h4 className="text-lg font-bold">Panier non synchronisé</h4>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <p className="text-sm font-extralight ">
            Nous avons trouvé un panier non synchronisé à votre compte, est ce
            le votre ?{" "}
          </p>
        </Skeleton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cartItemNotSynchronized.map((item, index) => (
          <CartNotSynchronizedItem key={index} item={item} emuted={emuted} />
        ))}
      </div>

      {success && <SuccessInfo emuted={emuted} info={success} />}

      {requiredSynchronized && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 ">
            <Button
              variant={emuted ? "emuted" : "default"}
              className={cn(
                !emuted &&
                  "bg-foreground text-background hover:bg-primary-dark",
              )}
              onClick={synchronized}
            >
              Synchronisé
            </Button>
            <Button variant={emuted ? "emuted" : "outline"} onClick={giveUp}>
              Abandonné
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
