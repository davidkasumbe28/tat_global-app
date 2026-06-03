"use client";

import ForgetPasswordFooter from "@/components/forget-password/forget-password-footer";
import ForgetPasswordForm from "@/components/forget-password/forget-password-form";
import ForgetPasswordHeader from "@/components/forget-password/forget-password-header";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { handleForgetPassword } from "@/lib/handlers/events-handlers/auth-events";
import { cn } from "@/lib/utils/utils";
import { validateEmail } from "@/lib/validators/validators";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function ForgetPasswordPage() {
  const { isloading } = useTheme();
  const { isloadingAuth, setIsloadingAuth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloadingAuth(true);
    setLoading(true);
    setError("");

    // Validation
    for (const field of Object.keys(formData)) {
      if (!formData[field]) {
        setError("Veuillez remplir tous les champs");
        setIsloadingAuth(false);
        setLoading(false);
        break;
      }
    }

    if (!validateEmail(formData.email)) {
      setError("Adresse email invalide");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleForgetPassword(formData);

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de la récupération");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(res.data);
    setIsloadingAuth(false);
    setLoading(false);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Box */}
        <div
          className={cn(
            "border border-border rounded-lg p-8 shadow-lg",
            isloading ? "bg-transparent animate-pulse" : "bg-background",
          )}
        >
          <ForgetPasswordHeader emuted={isloading} />

          <ForgetPasswordForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            emuted={isloading}
            isloading={isloadingAuth}
          />

          <ForgetPasswordFooter
            emuted={isloading}
            isloading={isloadingAuth}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
}
