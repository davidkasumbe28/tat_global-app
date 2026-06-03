"use client";

import { cn } from "@/lib/utils/utils";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ErrorInfo from "../error-info";
import { APP } from "@/lib/data/raw/routes";

interface LoginFormProps {
  formData: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  error: string;
  loading: boolean;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  isloading?: boolean;
}

export default function LoginForm({
  formData,
  handleChange,
  handleSubmit,
  error,
  loading,
  rememberMe,
  setRememberMe,
  emuted = true,
  isloading = true,
}: LoginFormProps) {
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

      <div className="flex md:items-center max-md:flex-col gap-2 justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={emuted || loading}
            className="w-4 h-4 border border-border rounded"
          />
          <Skeleton emuted={emuted}>
            <span
              className={cn(
                "text-sm",
                emuted ? "text-muted-foreground" : "text-gray-500",
              )}
            >
              Se souvenir de moi
            </span>
          </Skeleton>
        </label>
        <div className="flex max-md:justify-end">
          <Skeleton emuted={emuted}>
            <Link
              href={emuted || loading ? "#" : APP.auth.forgetPassword}
              className={cn(
                "hover:underline",
                emuted || loading
                  ? "text-muted-foreground"
                  : "text-primary-dark hover:text-primary",
              )}
            >
              Mot de passe oublié ?
            </Link>
          </Skeleton>
        </div>
      </div>

      {error && <ErrorInfo emuted={emuted} info={error} />}

      <Button
        type="submit"
        variant={emuted ? "emuted" : "default"}
        disabled={emuted || loading || isloading}
        className={cn(
          "w-full text-base py-3",
          !emuted && "bg-foreground text-background hover:bg-primary-dark",
        )}
      >
        {loading ? "Connexion en cours..." : "Se Connecter"}
      </Button>
    </form>
  );
}
