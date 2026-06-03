"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import countries from "@/lib/data/raw/countries";
import { handleUpdateProfileUser } from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormCompletionStepTwo({
  isComplete,
  dataAddress,
  setDataAddress,
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
  dataAddress: Record<string, any | undefined>;
  setDataAddress: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
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
    setDataAddress((prev) => ({ ...prev, [name]: value }));
    setChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!change) return;

    setSuccess("");
    setError("");
    setLoading(true);
    if (isEditing) {
      // Validation
      for (const field of Object.keys(dataAddress)) {
        if (!dataAddress[field]) {
          setError("Veuillez remplir tous les champs");
          setLoading(false);
          return;
        }
      }

      // Validation
      for (const field of Object.keys(change)) {
        if (!change[field]) {
          setError("Veuillez remplir tous les champs");
          setLoading(false);
          return;
        }
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
    }
    setSuccess("Votre adresse a été mise à jour");
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
          <h2 className="text-2xl font-bold">Mon Adresse</h2>
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
      <div className="space-y-4">
        <div>
          <Skeleton emuted={emuted}>
            <label className={cn("text-sm", !emuted && "text-gray-500")}>
              Adresse
            </label>
          </Skeleton>
          <input
            type="text"
            name="address"
            value={dataAddress.address}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton emuted={emuted}>
              <label className={cn("text-sm", !emuted && "text-gray-500")}>
                Code postal
              </label>
            </Skeleton>
            <input
              type="text"
              name="zipCode"
              value={dataAddress.zipCode}
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
                Ville
              </label>
            </Skeleton>
            <input
              type="text"
              name="city"
              value={dataAddress.city}
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
              Pays
            </label>
          </Skeleton>
          <select
            name="country"
            value={dataAddress.country}
            onChange={handleChange}
            disabled={!isEditing || loading || emuted || isloading}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg mt-1",
              isloading || emuted
                ? "bg-muted-foreground text-muted-foreground animate-pulse"
                : "disabled:bg-accent",
            )}
          >
            <option className="text-black" value="">
              Pays
            </option>
            {Object.keys(countries.subscribed).map((country, index) => (
              <option key={index} className="text-black" value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <ErrorInfo emuted={emuted} info={error} />}

    </form>
  );
}
