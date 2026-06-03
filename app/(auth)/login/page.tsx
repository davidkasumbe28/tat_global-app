"use client";

import LoginFooter from "@/components/login/login-footer";
import LoginForm from "@/components/login/login-form";
import LoginHeader from "@/components/login/login-header";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_USER } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { handleLogin } from "@/lib/handlers/events-handlers/auth-events";
import enabled from "@/lib/utils/enabled";
import { cn } from "@/lib/utils/utils";
import { validateEmail, validatePassword } from "@/lib/validators/validators";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { isLoggedIn, isloading } = useStore();
  const { status, isloadingAuth, setIsloadingAuth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
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

    if (!validatePassword(formData.password).valid) {
      setError("Mot de passe incorrect.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleLogin(formData, rememberMe);

    if (res.error) {
      setError(res.error || "Une erreur est survenue lors de la connexion");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(APP.private.account);
    setIsloadingAuth(false);
    setLoading(false);
  };

  useEffect(() => {
    if (
      isLoggedIn &&
      !enabled.status(status, [STATUS_USER.checked, STATUS_USER.offline])
    )
      router.push(APP.private.account);
  });

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
          <LoginHeader emuted={isloading} />

          <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            emuted={isloading}
            isloading={isloadingAuth}
          />

          {/* <LoginSocial
              emuted={isloading}
              loading={loading}
              isloading={isloadingAuth}
            /> */}

          <LoginFooter
            emuted={isloading}
            loading={loading}
            isloading={isloadingAuth}
          />
        </div>
      </div>
    </main>
  );
}
