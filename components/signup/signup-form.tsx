"use client";

import { cn } from "@/lib/utils/utils";
import { Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ErrorInfo from "../error-info";

interface SignupFormProps {
  formData: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<Element>) => Promise<void>;
  error: string;
  loading: boolean;
  agreeTerms: boolean;
  setAgreeTerms: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  isloading?: boolean;
}

export default function SignupForm({
  formData,
  handleChange,
  handleSubmit,
  error,
  loading,
  agreeTerms,
  setAgreeTerms,
  emuted = true,
  isloading = true,
}: SignupFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
        <div>
          <Skeleton emuted={emuted}>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2"
            >
              Prénom
            </label>
          </Skeleton>
          <div className="relative">
            <User
              className={cn(
                "absolute left-3 top-3.5 w-5 h-5 ",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-gray-400",
              )}
            />
            <input
              required
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={emuted || loading}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
              placeholder={emuted ? "" : "Jean"}
            />
          </div>
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2"
            >
              Nom
            </label>
          </Skeleton>
          <div className="relative">
            <User
              className={cn(
                "absolute left-3 top-3.5 w-5 h-5 ",
                emuted
                  ? "text-muted-foreground bg-muted-foreground rounded"
                  : "text-gray-400",
              )}
            />
            <input
              required
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={emuted || loading}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
              placeholder={emuted ? "" : "Dupont"}
            />
          </div>
        </div>
      </div>

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
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Téléphone
          </label>
        </Skeleton>
        <div className="relative">
          <Phone
            className={cn(
              "absolute left-3 top-3.5 w-5 h-5 ",
              emuted
                ? "text-muted-foreground bg-muted-foreground rounded"
                : "text-gray-400",
            )}
          />
          <input
            required
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={emuted || loading}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
            placeholder={emuted ? "" : "+243 XXXXXXXXX"}
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

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={agreeTerms}
          disabled={emuted || loading}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="w-4 h-4 border border-border rounded mt-1"
        />
        <Skeleton emuted={emuted}>
          <span
            className={cn(
              "text-sm",
              emuted ? "text-muted-foreground" : "text-gray-500",
            )}
          >
            Je accepte les{" "}
            <Link
              href={emuted || isloading || loading ? "#" : "#"}
              className={cn(
                "hover:underline",
                emuted || loading
                  ? "text-muted-foreground"
                  : "text-primary-dark hover:text-primary",
              )}
            >
              conditions d'utilisation
            </Link>{" "}
            et la{" "}
            <Link
              href={emuted || isloading || loading ? "#" : "#"}
              className={cn(
                "hover:underline",
                emuted || loading
                  ? "text-muted-foreground"
                  : "text-primary-dark hover:text-primary",
              )}
            >
              politique de confidentialité
            </Link>
          </span>
        </Skeleton>
      </label>

      {error && <ErrorInfo emuted={emuted} info={error} />}

      <Button
        type="submit"
        variant={emuted ? "emuted" : "default"}
        disabled={
          emuted ||
          loading ||
          isloading ||
          formData.password !== formData.confirmPassword
        }
        className={cn(
          "w-full text-base py-3",
          !emuted && "bg-foreground text-background hover:bg-primary-dark",
        )}
      >
        {loading ? "Inscription en cours..." : "Créer un Compte"}
      </Button>
    </form>
  );
}
