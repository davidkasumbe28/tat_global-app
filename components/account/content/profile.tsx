"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  handleReadProfileUser,
  handleUpdateProfileUser,
} from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

export default function Profile({ emuted = true }: { emuted?: boolean }) {
  const { user, isloadingAuth, setIsloadingAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Record<string, any>>({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState<Record<string, any | undefined>>();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!change) return;

    setSuccess("");
    setError("");
    setLoading(true);

    // Validation
    for (const field of Object.keys(profile)) {
      if (!profile[field]) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        break;
      }
    }

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
        res.error || "Une erreur est survenue lors de la mise à jour du profil",
      );
      setLoading(false);
      return;
    }

    setSuccess("Profil mise à jour");
    setLoading(false);
    setIsEditing(false);
    router.refresh();
  };

  useEffect(() => {
    setIsloadingAuth(true);
    handleReadProfileUser()
      .then((res) => {
        if (res.error) {
          setError(res.error);
          setIsloadingAuth(false);
          return;
        }

        const data = res.data;

        setProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.zipCode,
          country: data.country,
        });

        setIsloadingAuth(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsloadingAuth(false);
      });
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        " border border-border rounded-lg p-6 space-y-6",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

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
          disabled={loading || emuted || isloadingAuth}
          type={isEditing ? "submit" : "button"}
          variant={
            emuted || isloadingAuth
              ? "emuted"
              : isEditing
                ? "default"
                : "outline"
          }
          className={
            !emuted && !isloadingAuth && isEditing
              ? "bg-foreground text-background hover:bg-primary-dark"
              : ""
          }
        >
          {!loading && !isEditing && <Edit />}
          {loading
            ? "Enregistrement..."
            : isEditing
              ? "Enregistrer"
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
            value={profile.firstName || ""}
            onChange={handleChange}
            disabled={!isEditing || loading || emuted || isloadingAuth}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg mt-1",
              isloadingAuth
                ? "bg-muted-foreground text-muted-foreground animate-pulse"
                : "disabled:bg-accent ",
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
            value={profile.lastName || ""}
            onChange={handleChange}
            disabled={!isEditing || loading || emuted || isloadingAuth}
            className={cn(
              "w-full px-4 py-2 border border-border rounded-lg mt-1",
              isloadingAuth
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
          value={profile.email || ""}
          onChange={handleChange}
          disabled={!isEditing || loading || emuted || isloadingAuth}
          className={cn(
            "w-full px-4 py-2 border border-border rounded-lg mt-1",
            isloadingAuth
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
          value={profile.phone || ""}
          onChange={handleChange}
          disabled={!isEditing || loading || emuted || isloadingAuth}
          className={cn(
            "w-full px-4 py-2 border border-border rounded-lg mt-1",
            isloadingAuth
              ? "bg-muted-foreground text-muted-foreground animate-pulse"
              : "disabled:bg-accent",
          )}
        />
      </div>

      <div className="border-t border-border pt-6">
        <Skeleton emuted={emuted}>
          <h3 className="font-bold mb-4">Adresse</h3>
        </Skeleton>
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
              value={profile.address || ""}
              onChange={handleChange}
              disabled={!isEditing || loading || emuted || isloadingAuth}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1",
                isloadingAuth
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
                name="postalCode"
                value={profile.postalCode || ""}
                onChange={handleChange}
                disabled={!isEditing || loading || emuted || isloadingAuth}
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg mt-1",
                  isloadingAuth
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
                value={profile.city || ""}
                onChange={handleChange}
                disabled={!isEditing || loading || emuted || isloadingAuth}
                className={cn(
                  "w-full px-4 py-2 border border-border rounded-lg mt-1",
                  isloadingAuth
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
              value={profile.country || ""}
              onChange={handleChange}
              disabled={!isEditing || loading || emuted || isloadingAuth}
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1",
                isloadingAuth
                  ? "bg-muted-foreground text-muted-foreground animate-pulse"
                  : "disabled:bg-accent",
              )}
            >
              <option>France</option>
              <option>Belgique</option>
              <option>Suisse</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
