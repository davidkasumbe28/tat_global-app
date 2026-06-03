"use client";

import ResetPasswordForm from "@/components/verify/reset-password/reset-password-form";
import ResetPasswordHeader from "@/components/verify/reset-password/reset-password-header";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import {
  handleResetPassword,
  handleVerify,
} from "@/lib/handlers/events-handlers/check-events";
import { cn } from "@/lib/utils/utils";
import { validatePassword } from "@/lib/validators/validators";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { isloading } = useTheme();
  const { isloadingAuth, setIsloadingAuth } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const tokenStr = params.tokenStr as string;
  const id = searchParams.get("id") as string;
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, string>>({
    tokenStr: tokenStr,
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloadingAuth(true);
    setLoading(true);
    setError("");

    if (!formData.tokenStr) {
      setError("Vous n'avez pas de jeton de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!id) {
      setError("Vous n'avez pas d'identifiant de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleVerify(formData);

    if (res.error) {
      setError(res.error);
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(APP.private.account);
    setIsloadingAuth(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloadingAuth(true);
    setLoading(true);
    setError("");

    if (!formData.tokenStr) {
      setError("Vous n'avez pas de jeton de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!id) {
      setError("Vous n'avez pas d'identifiant de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(formData.password);

    if (!passwordValidation.valid) {
      setError(passwordValidation.errors.join(", "));
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleResetPassword(formData);

    if (res.error) {
      setError(res.error);
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(APP.private.account);
    setIsloadingAuth(false);
    setLoading(false);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md ">
        {/* Box */}
        <div
          className={cn(
            " border border-border rounded-lg p-8 shadow-lg",
            isloading ? "bg-transparent animate-pulse" : "bg-background",
          )}
        >
          <ResetPasswordHeader emuted={isloading} />

          <ResetPasswordForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleContinue={handleContinue}
            error={error}
            loading={loading}
            emuted={isloading}
            isloading={isloadingAuth}
          />
        </div>
      </div>
    </main>
  );
}
