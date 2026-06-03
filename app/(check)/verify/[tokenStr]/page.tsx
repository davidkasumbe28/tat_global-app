"use client";

import { Skeleton } from "@/components/ui/skeleton";
import VerifyForm from "@/components/verify/verify-form";
import VerifyHeader from "@/components/verify/verify-header";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { APP } from "@/lib/data/raw/routes";
import {
  handleChecking,
  handleIsNotMe,
  handleResendForgotPasswordEmail,
} from "@/lib/handlers/events-handlers/check-events";
import { handleReadProfileUser } from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyTokenIdPage() {
  const { isloading } = useTheme();
  const { isloadingAuth, setIsloadingAuth } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const tokenStr = params.tokenStr as string;
  const uuid = searchParams.get("uuid") as string;

  const [formData, setFormData] = useState<Record<string, string>>({
    tokenId: "",
    tokenStr: tokenStr,
    uuid: uuid,
  });
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  const handleResendEmail = async (e: React.FormEvent) => {
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

    if (!formData.uuid) {
      setError("Vous n'avez pas d'identifiant de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleResendForgotPasswordEmail(formData);

    if (res.error) {
      setError(res.error);
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    setIsloadingAuth(false);
    setLoading(false);
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloadingAuth(true);
    setLoading(true);
    setError("");

    if (!formData.uuid) {
      setError("Vous n'avez pas d'identifiant de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleIsNotMe(formData);

    if (res.error) {
      setError(res.error);
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(APP.auth.login);
    setIsloadingAuth(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloadingAuth(true);
    setLoading(true);
    setError("");

    if (!formData.tokenId) {
      setError("Veuillez saisir votre code.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!formData.tokenStr) {
      setError("Vous n'avez pas de jeton de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    if (!formData.uuid) {
      setError("Vous n'avez pas d'identifiant de vérification.");
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    const res = await handleChecking(formData);

    if (res.error) {
      setError(res.error);
      setIsloadingAuth(false);
      setLoading(false);
      return;
    }

    router.push(res.data);
    setIsloadingAuth(false);
    setLoading(false);
  };

  useEffect(() => {
    handleReadProfileUser()
      .then((res) => {
        if (res.error) {
          setError(
            res.error ||
              "Une erreur est survenue lors de la récupération de vos informations.",
          );
          return;
        }

        const data = res.data;

        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatar: data.avatar,
        });
      })
      .catch((err) => {
        setError(
          err ||
            "Une erreur est survenue lors de la récupération de vos informations.",
        );
      });
  }, []);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl ">
        {/* Box */}
        <div
          className={cn(
            " border border-border rounded-4xl p-8 shadow-lg",
            isloading ? "bg-transparent animate-pulse" : "bg-background",
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VerifyHeader
              emuted={isloading}
              isloading={isloadingAuth}
              user={{
                avatar: user?.avatar,
                name: (user?.firstName[0] || "") + (user?.lastName[0] || ""),
                email: user?.email,
              }}
            />

            <VerifyForm
              formData={formData}
              semi_email={
                (user?.email.slice(0, 3) || "") + "•••••••" + "@gmail.com"
              }
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              error={error}
              loading={loading}
              emuted={isloading}
              isloading={isloadingAuth}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 pt-4">
            <Skeleton emuted={isloading}>
              <label htmlFor="code" className="block text-sm font-medium mb-4">
                Vous n'avez pas reçu le code ?{" "}
                <button
                  type="button"
                  onClick={handleResendEmail}
                  className={cn(
                    !isloading && "text-primary hover:text-primary-dark",
                  )}
                >
                  {" "}
                  Renvoyer le code{" "}
                </button>
              </label>
            </Skeleton>

            <div className="flex justify-end items-end">
              <Skeleton emuted={isloading}>
                <label
                  className={cn(
                    "block text-sm font-medium mb-4",
                    !isloading && "text-gray-600",
                  )}
                >
                  Vous souvennez vous des informations de votre compte ?{" "}
                  <Link
                    href={
                      isloading || isloadingAuth || loading
                        ? "#"
                        : APP.auth.login
                    }
                    className={cn(
                      "font-semibold hover:underline",
                      !isloading &&
                        !loading &&
                        "text-primary-dark hover:text-primary",
                    )}
                  >
                    Se connecter
                  </Link>
                </label>
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
