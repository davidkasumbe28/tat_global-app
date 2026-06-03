import { Button } from "@/components/ui/button";
import { APP } from "@/lib/data/raw/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductDetailsColOne {
  emuted: boolean;
  isloading: boolean;
  backPath?: string;
  product: { name: string; image: string };
}

export default function ProductDetailsColOne({
  emuted = true,
  isloading = true,
  backPath = APP.public.catalogue,
  product,
}: ProductDetailsColOne) {
  return (
    <div className="flex flex-col items-center justify-start gap-4 relative">
      {/* Product Header */}
      <div className="flex items-center gap-4 justify-start w-full absolute top-2 left-2 ">
        <Link href={emuted ? "#" : backPath}>
          <Button variant={emuted ? "emuted" : "outline"} size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={
            emuted || isloading
              ? "/placeholder.svg?height=500&width=500&query=product"
              : product.image ||
                "/placeholder.svg?height=500&width=500&query=product"
          }
          alt={emuted || isloading ? "produit" : product.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
