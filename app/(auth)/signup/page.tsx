"use client";

import SignupFooter from "@/components/signup/signup-footer";
import SignupForm from "@/components/signup/signup-form";
import SignupHeader from "@/components/signup/signup-header";
import { useStore } from "@/context/store-context";
import { useAuth } from "@/hooks/use-auth";
import { STATUS_USER } from "@/lib/constants/constants";
import { APP } from "@/lib/data/raw/routes";
import { handleSignup } from "@/lib/handlers/events-handlers/auth-events";
import enabled from "@/lib/utils/enabled";
import { cn } from "@/lib/utils/utils";
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from "@/lib/validators/validators";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const { isLoggedIn, isloading } = useStore();
  const { status, isloadingAuth, setIsloadingAuth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
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

    if (!validateEmail(formData.email)) {
      setError("Adresse email invalide");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Vous devez respecter le format du numéro de téléphone");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleSignup(formData);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de l'inscription, veuillez réesseyer",
      );
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(APP.private.formCompletion);
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
          <SignupHeader emuted={isloading} />

          <SignupForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            emuted={isloading}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            isloading={isloadingAuth}
          />

          {/* <SignupSocial
              emuted={isloading}
              loading={loading}
              isloading={isloadingAuth}
            /> */}

          <SignupFooter
            emuted={isloading}
            loading={loading}
            isloading={isloadingAuth}
          />
        </div>
      </div>
    </main>
  );
}
