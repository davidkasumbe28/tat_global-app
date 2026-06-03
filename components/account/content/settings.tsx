"use client";

import { useAuth } from "@/hooks/use-auth";
import { NotifyOrderBy } from "@/lib/generated/prisma/enums";
import {
  handleDeleteUser,
  handleReadProfileUser,
  handleUpdatePassword,
  handleUpdateProfileUser,
} from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import { validatePassword } from "@/lib/validators/validators";
import { Edit, Lock, OctagonAlert, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeButton from "../../theme/theme-button";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";

export default function Settings({
  emuted = true,
  theme,
}: {
  emuted?: boolean;
  theme: string;
}) {
  const { user, isloadingAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({
    currentPassword: "",
    password: "",
  });
  const [data, setData] = useState({
    notifyOrderBy: NotifyOrderBy.EMAIL,
    notifyNewsletter: true,
  });
  const [change, setChange] = useState(data);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeNotify = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    if (!isEditing) return;

    setError("");
    setLoading(true);
    setSuccess("");

    // Validation
    for (const field of Object.keys(formData)) {
      if (!formData[field]) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        break;
      }
    }

    if (formData.password == formData.currentPassword) {
      setError("Le nouveau mot de passe correspond au mot de passe actuel");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(formData.password);

    if (!passwordValidation.valid) {
      setError(passwordValidation.errors.join(", "));
      setLoading(false);
      return;
    }

    const res = await handleUpdatePassword(formData, user?.id || 0);

    if (res.error) {
      setError(
        res.error ||
          "Une erreur est survenue lors de la modification du mot de passe",
      );
      setLoading(false);
      return;
    }

    setSuccess("Mot de passe modifier!");
    setFormData({
      currentPassword: "",
      password: "",
    });
    setLoading(false);
    setIsEditing(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSure) return;

    setLoading(true);

    const res = await handleDeleteUser(user?.id || 0);

    if (res.error) {
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
    setIsSure(false);
  };

  const handleSubmitNotifyState = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      change.notifyNewsletter === data.notifyNewsletter &&
      change.notifyOrderBy === data.notifyOrderBy
    )
      return;

    setSuccess("");
    setError("");
    setLoading(true);

    const res = await handleUpdateProfileUser(change);

    if (res.error) {
      setError(
        res.error || "Une erreur est survenue lors de la mise à jour du profil",
      );
      setLoading(false);
      return;
    }
    setSuccess("Votre profil a été mise à jour");
    router.refresh();
  };

  useEffect(() => {
    setLoading(true);
    handleReadProfileUser()
      .then((res) => {
        if (res.error) {
          setLoading(false);
          return;
        }

        setData({
          notifyOrderBy: res.data.notifyOrderBy,
          notifyNewsletter: res.data.notifyNewsletter,
        });

        setChange({
          notifyOrderBy: res.data.notifyOrderBy,
          notifyNewsletter: res.data.notifyNewsletter,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [success]);

  return (
    <div
      className={cn(
        " border border-border rounded-lg p-6 space-y-6",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      <Skeleton emuted={emuted}>
        <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
      </Skeleton>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Skeleton emuted={emuted}>
              <p className="font-semibold">Theme</p>
            </Skeleton>
            <Skeleton emuted={emuted}>
              <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                {theme == "light" ? "Claire" : "Sombre"}
              </p>
            </Skeleton>
          </div>
          {/* Theme Button */}
          <ThemeButton emuted={emuted} />
        </div>

        <div className=" space-y-2">
          <div className="flex-1 items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Skeleton emuted={emuted}>
                <p className="font-semibold">Notifications par email</p>
              </Skeleton>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Recevoir les mises à jour de commande par :
                </p>
              </Skeleton>
            </div>

            <div className="px-2 pt-4 grid grid-cols-1 md:grid-cols-2">
              {Object.values(NotifyOrderBy).map((val, index) => (
                <label
                  key={index}
                  htmlFor="notifyOrderBy"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="notifyOrderBy"
                    id="notifyOrderBy"
                    value={val}
                    onChange={handleChangeNotify}
                    checked={change.notifyOrderBy === val}
                    disabled={isloadingAuth || loading}
                    className="w-4 h-4 border border-border rounded"
                  />
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn(
                        "text-sm",
                        emuted ? "text-muted-foreground" : "text-gray-500",
                      )}
                    >
                      {val}
                    </span>
                  </Skeleton>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <Skeleton emuted={emuted}>
                <p className="font-semibold">Newsletter</p>
              </Skeleton>
              <Skeleton emuted={emuted}>
                <p className={cn("text-sm ", !emuted && "text-gray-500")}>
                  Recevoir les notifications des offres spéciales et nouveautés
                </p>
              </Skeleton>
            </div>
            <input
              type="checkbox"
              name="notifyNewsletter"
              id="notifyNewsletter"
              checked={change.notifyNewsletter}
              onChange={() =>
                setChange((prev) => ({
                  ...prev,
                  notifyNewsletter: !change.notifyNewsletter,
                }))
              }
              disabled={isloadingAuth || loading}
              className="w-5 h-5"
            />
          </div>

          <div className="flex justify-end items-center">
            <Button
              onClick={handleSubmitNotifyState}
              disabled={loading || emuted || isloadingAuth}
              type="button"
              variant={
                emuted || isloadingAuth || loading ? "emuted" : "default"
              }
              className={
                !emuted && !isloadingAuth && !loading
                  ? "bg-foreground text-background hover:bg-primary-dark"
                  : ""
              }
            >
              {loading ? "Enregistrement...." : "Enregistrer"}
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <Skeleton emuted={emuted}>
            <h3 className="font-bold mb-4">Sécurité</h3>
          </Skeleton>
          <form onSubmit={handleSubmit} className="grid gap-6">
            {isEditing && (
              <>
                <div>
                  <Skeleton emuted={emuted}>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-2"
                    >
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
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={emuted || loading || isloadingAuth}
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
                      Nouveau mot de Passe
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
                      disabled={emuted || loading || isloadingAuth}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground"
                      placeholder={emuted ? "" : "••••••••"}
                    />
                  </div>
                </div>
              </>
            )}
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
            <div className={cn("grid gap-4", isEditing && "md:grid-cols-2")}>
              {isEditing && (
                <Button
                  type={"button"}
                  variant={isloadingAuth || emuted ? "emuted" : "outline"}
                  disabled={isloadingAuth || emuted || loading || !isEditing}
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    }
                  }}
                  className={cn(
                    "w-full justify-center",
                    !emuted && !isloadingAuth && "bg-transparent",
                  )}
                >
                  {loading ? "Chargement..." : "Annuler"}
                </Button>
              )}
              <Button
                type={isEditing ? "submit" : "button"}
                variant={
                  isloadingAuth || emuted
                    ? "emuted"
                    : isEditing
                      ? "default"
                      : "outline"
                }
                disabled={
                  isloadingAuth ||
                  emuted ||
                  loading ||
                  (isEditing && formData.password === formData.currentPassword)
                }
                onClick={() => {
                  if (!isEditing) {
                    setIsEditing(true);
                  }
                }}
                className={cn(
                  "w-full justify-center gap-4",
                  !emuted && !isloadingAuth && isEditing
                    ? "bg-foreground text-background hover:bg-primary-dark"
                    : "bg-transparent",
                )}
              >
                {!loading && <Edit />}
                {loading
                  ? "Chargement..."
                  : isEditing
                    ? "Modifier"
                    : "Modifier le mot de passe"}
              </Button>
            </div>
          </form>
        </div>

        <div className="border-t border-border pt-6">
          <Skeleton emuted={emuted}>
            <h3
              className={cn(
                "font-bold mb-4",
                !isloadingAuth && !emuted && "text-destructive",
              )}
            >
              Zone de danger
            </h3>
          </Skeleton>
          <form onSubmit={handleDelete} className={cn("grid gap-6")}>
            {isSure && (
              <div className="flex justify-between gap-4 items-center p-4 bg-red-50 border border-red-200 rounded-lg text-black text-sm">
                <OctagonAlert className="size-12 text-red-700" />
                En effectuant cette action vous supprimerais tout information
                lié à votre compte, etes vous sur de vouloir continuer ?
              </div>
            )}
            <div className={cn("grid gap-4", isSure && "md:grid-cols-2")}>
              <Button
                type={"button"}
                variant={isloadingAuth || emuted ? "emuted" : "outline"}
                disabled={isloadingAuth || emuted || loading}
                onClick={() => {
                  setIsSure(!isSure);
                }}
                className={cn(
                  "w-full justify-center gap-4",
                  !emuted && !isloadingAuth && !isSure
                    ? "border-destructive text-destructive hover:text-destructive bg-transparent"
                    : "bg-transparent",
                )}
              >
                {!loading && !isSure && <Trash2 className="text-destructive" />}
                {loading
                  ? "Chargement..."
                  : isSure
                    ? "Annuler"
                    : "Supprimer le compte"}
              </Button>
              {isSure && (
                <Button
                  type={isSure ? "submit" : "button"}
                  variant={isloadingAuth || emuted ? "emuted" : "outline"}
                  disabled={isloadingAuth || emuted || loading || !isSure}
                  className={cn(
                    "w-full justify-center gap-4",
                    !isloadingAuth &&
                      !emuted &&
                      "border-destructive text-destructive bg-transparent",
                    isSure && "hover:bg-destructive hover:text-white",
                  )}
                >
                  {!loading && isSure && <Trash2 />}
                  {loading ? "Chargement..." : "Supprimer"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
