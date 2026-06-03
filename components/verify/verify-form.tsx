"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { Mail } from "lucide-react";
import ErrorInfo from "@/components/error-info";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP } from "@/lib/data/raw/routes";

interface ResetPasswordFormProps {
  formData: Record<string, string>;
  semi_email?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleCancel: (e: React.FormEvent<Element>) => Promise<void>;
  error: string;
  loading: boolean;
  emuted?: boolean;
  isloading?: boolean;
}

export default function VerifyForm({
  formData,
  semi_email,
  handleChange,
  handleSubmit,
  handleCancel,
  error,
  loading,
  emuted = true,
  isloading = true,
}: ResetPasswordFormProps) {
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-end items-end space-y-4 h-full"
      >
        <div className="w-full">
          <Skeleton emuted={emuted}>
            <label htmlFor="tokenId" className="block text-sm font-medium mb-4">
              Un e-mail contenant un code de validation vient d'être envoyé à
              {" " + semi_email}
            </label>
          </Skeleton>
          <div>
            <input
              required
              type="text"
              id="tokenId"
              name="tokenId"
              value={formData.code}
              onChange={handleChange}
              disabled={emuted || loading}
              className="w-full p-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
              placeholder={emuted ? "" : "Votre code"}
            />
          </div>
        </div>

        {error && <ErrorInfo emuted={emuted} info={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 ">
          <Button
            type="button"
            onClick={handleCancel}
            variant={emuted ? "emuted" : "outline"}
            disabled={loading || emuted || isloading}
            className={cn("w-full text-base py-1")}
          >
            {loading ? "Chargement..." : "Ce n'est pas moi"}
          </Button>

          <Button
            type="submit"
            variant={emuted ? "emuted" : "default"}
            disabled={loading || emuted || isloading}
            className={cn(
              "w-full text-base py-1",
              !emuted && "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {loading ? "Récupération en cours..." : "Récupérer"}
          </Button>
        </div>
      </form>
    </>
  );
}
