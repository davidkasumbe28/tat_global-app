"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { Lock, Mail } from "lucide-react";
import ErrorInfo from "@/components/error-info";
import { Button } from "@/components/ui/button";

interface ResetPasswordFormProps {
  formData: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  handleContinue: (e: React.FormEvent<Element>) => Promise<void>;
  error: string;
  loading: boolean;
  emuted?: boolean;
  isloading?: boolean;
}

export default function ResetPasswordForm({
  formData,
  handleChange,
  handleSubmit,
  handleContinue,
  error,
  loading,
  emuted = true,
  isloading = true,
}: ResetPasswordFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Skeleton emuted={emuted}>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Mot de Passe
          </label>
        </Skeleton>
        <div className="relative">
          <Lock
            className={cn(
              "absolute left-3 top-3.5 w-5 h-5 ",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-gray-400",
            )}
          />
          <input
            required
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={emuted || loading}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "••••••••"}
          />
        </div>
      </div>

      <div>
        <Skeleton emuted={emuted}>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            Confirmer le Mot de Passe
          </label>
        </Skeleton>
        <div className="relative">
          <Lock
            className={cn(
              "absolute left-3 top-3.5 w-5 h-5 ",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-gray-400",
            )}
          />
          <input
            required
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={emuted || loading}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "••••••••"}
          />
        </div>
      </div>

      {error && <ErrorInfo emuted={emuted} info={error} />}

      <div className="grid grid-cols-1 gap-4">
        <Button
          type="button"
          onClick={handleContinue}
          variant={emuted ? "emuted" : "outline"}
          disabled={loading || emuted || isloading}
          className={cn("w-full text-base py-3")}
        >
          {loading ? "Chargement..." : "Continuer avec l'actuel"}
        </Button>

        <Button
          type="submit"
          variant={emuted ? "emuted" : "default"}
          disabled={
            loading ||
            emuted ||
            isloading ||
            formData.password !== formData.confirmPassword
          }
          className={cn(
            "w-full text-base py-3",
            !emuted && "bg-foreground text-background hover:bg-primary-dark",
          )}
        >
          {loading ? "Réinitialisation en cours..." : "Réinitialiser"}
        </Button>
      </div>
    </form>
  );
}
