"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { handleUpdateProfileUser } from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import { validateEmail, validatePhone } from "@/lib/validators/validators";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormCompletionStepOne({
  isComplete,
  dataProfile,
  setDataProfile,
  isEditing,
  setIsEditing,
  emuted = true,
  isloading = true,
  success,
  setSuccess,
  loading,
  setLoading,
}: {
  isComplete: boolean;
  dataProfile: Record<string, any | undefined>;
  setDataProfile: React.Dispatch<
    React.SetStateAction<Record<string, any | undefined>>
  >;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  emuted?: boolean;
  isloading?: boolean;
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [error, setError] = useState("");
  const [change, setChange] = useState<Record<string, any | undefined>>();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDataProfile((prev) => ({ ...prev, [name]: value }));
    setChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!change) return;

    setSuccess("");
    setError("");
    setLoading(true);

    // Validation
    for (const field of Object.keys(dataProfile)) {
      if (!dataProfile[field]) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }
    }

    for (const field of Object.keys(change)) {
      if (!change[field]) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }
    }

    if (change.email)
      if (!validateEmail(change.email)) {
        setError("Adresse email invalide");
        setLoading(false);
        return;
      }

    if (change.phone)
      if (!validatePhone(change.phone)) {
        setError("Vous devez respecter le format du numéro de téléphone");
        setLoading(false);
        return;
      }

    const res = await handleUpdateProfileUser(change);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la mise à jour de votre profil",
      );
      setLoading(false);
      return;
    }

    setSuccess("Votre profil a été mise à jour");
    router.refresh();
    // setTimeout(() => {
    //   window.location.reload();
    //   setLoading(false);
    // }, 1000);
  };

  useEffect(() => {
    if (isComplete) {
      setIsEditing(false);
    }
  }, [success]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "border border-border rounded-lg p-6 space-y-6",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <Skeleton emuted={emuted}>
          <h2 className="text-2xl font-bold">Mon Profil</h2>
        </Skeleton>
        <Button
          onClick={() => {
            if (!isEditing) {
              setIsEditing(!isEditing);
              return;
            }
          }}
          disabled={loading || emuted || isloading || (isEditing && !change)}
          type={isEditing ? "submit" : "button"}
          variant={
            emuted || isloading ? "emuted" : isEditing ? "default" : "outline"
          }
          className={
            !emuted && !isloading && isEditing
              ? "bg-foreground text-background hover:bg-primary-dark"
              : ""
          }
        >
          {isEditing
            ? loading
              ? "Enregistrement...."
              : "Enregistrer"
            : "Modifier"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Skeleton emuted={emuted}>
            <label className={cn("text-sm", !emuted && "text-gray-500")}>
              Prénom
            </label>
          </Skeleton>
          <input
            type="text"
            name="firstName"
            value={dataProfile?.firstName}
            onChange={handleChange}
            disabled={!isEditing || loading || emuted || isloading}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg mt-1",
              isloading || emuted
                ? "bg-muted-foreground text-muted-foreground animate-pulse"
                : "disabled:bg-accent",
            )}
          />
        </div>
        <div>
          <Skeleton emuted={emuted}>
            <label className={cn("text-sm", !emuted && "text-gray-500")}>
              Nom
            </label>
          </Skeleton>
          <input
            type="text"
            name="lastName"
            value={dataProfile.lastName}
            onChange={handleChange}
            disabled={!isEditing || loading || emuted || isloading}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg mt-1",
              isloading || emuted
                ? "bg-muted-foreground text-muted-foreground animate-pulse"
                : "disabled:bg-accent",
            )}
          />
        </div>
      </div>

      <div>
        <Skeleton emuted={emuted}>
          <label className={cn("text-sm", !emuted && "text-gray-500")}>
            Email
          </label>
        </Skeleton>
        <input
          type="email"
          name="email"
          value={dataProfile.email}
          onChange={handleChange}
          disabled={!isEditing || loading || emuted || isloading}
          className={cn(
            "w-full px-4 py-2 border border-border rounded-lg mt-1",
            isloading || emuted
              ? "bg-muted-foreground text-muted-foreground animate-pulse"
              : "disabled:bg-accent",
          )}
        />
      </div>

      <div>
        <Skeleton emuted={emuted}>
          <label className={cn("text-sm", !emuted && "text-gray-500")}>
            Téléphone
          </label>
        </Skeleton>
        <input
          type="tel"
          name="phone"
          value={dataProfile.phone}
          onChange={handleChange}
          disabled={!isEditing || loading || emuted || isloading}
          className={cn(
            "w-full px-4 py-2 border border-border rounded-lg mt-1",
            isloading || emuted
              ? "bg-muted-foreground text-muted-foreground animate-pulse"
              : "disabled:bg-accent",
          )}
        />
      </div>

      {error && <ErrorInfo emuted={emuted} info={error} />}
      
    </form>
  );
}
