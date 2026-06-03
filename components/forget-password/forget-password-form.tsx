"use client";

import ErrorInfo from "@/components/error-info";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";

interface ForgetPasswordFormProps {
  formData: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  error: string;
  loading: boolean;
  emuted?: boolean;
  isloading?: boolean;
}

export default function ForgetPasswordForm({
  formData,
  handleChange,
  handleSubmit,
  error,
  loading,
  emuted = true,
  isloading = true,
}: ForgetPasswordFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Skeleton emuted={emuted}>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Adresse Email
          </label>
        </Skeleton>
        <div className="relative">
          <Mail
            className={cn(
              "absolute left-3 top-3.5 w-5 h-5 ",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-gray-400",
            )}
          />
          <input
            required
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={emuted || loading}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "Exemple@gmail.com"}
          />
        </div>
      </div>

      {error && <ErrorInfo emuted={emuted} info={error} />}

      <Button
        type="submit"
        variant={emuted ? "emuted" : "default"}
        disabled={loading || emuted || isloading}
        className={cn(
          "w-full text-base py-3",
          !emuted && "bg-foreground text-background hover:bg-primary-dark",
        )}
      >
        {loading ? "Envoi en cours..." : "Envoyer"}
      </Button>
    </form>
  );
}
