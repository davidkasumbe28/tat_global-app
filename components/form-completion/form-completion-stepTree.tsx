"use client";

import ErrorInfo from "@/components/error-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { NotifyOrderBy } from "@/lib/generated/prisma/enums";
import { handleUploadAvatar } from "@/lib/handlers/events-handlers/upload-events";
import { handleUpdateProfileUser } from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function FormCompletionStepTree({
  isComplete,
  dataAvatar,
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
  dataAvatar: Record<string, any | undefined>;
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
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [notifyOrderBy, setNotifyOrderBy] = useState(dataAvatar.notifyOrderBy);
  const [notifyNewsletter, setNotifyNewsletter] = useState(
    dataAvatar.notifyNewsletter,
  );
  const router = useRouter();

  const user =
    (dataAvatar?.firstName?.charAt(0) || "") +
    (dataAvatar?.lastName?.charAt(0) || "");

  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setUploading(true);
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      setUploading(false);
      setLoading(false);
      return;
    }

    try {
      const res = await handleUploadAvatar(
        selectedFile,
        setProgress,
        setUploading,
        inputRef,
        setError,
      );

      if (res.error) {
        setError(
          res.error ||
            "Une erreur est survenue lors de la mise à jour de l'avatar",
        );
        setLoading(false);
        return;
      }
      setSuccess("Votre avatar a été mise à jour");
      // router.refresh();
      // setTimeout(() => {
      //   window.location.reload();
      //   setLoading(false);
      // }, 1000);
    } catch (error) {
      console.error(error);
      setError(
        "Une erreur est survenue lors de la mise à jour de votre avatar",
      );
    } finally {
      setUploading(false);
      setLoading(false);
      // setIsEditing(false);
    }
  };


  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    const res = await handleUpdateProfileUser({
      avatar:
        "https://nk4klggv4zbdyuue.public.blob.vercel-storage.com/default-avatar.png",
      notifyOrderBy: notifyOrderBy,
      notifyNewsletter: notifyNewsletter,
    });

    if (res.error) {
      setError(
        res.error || "Une erreur est survenue lors de la mise à jour du profil",
      );
      setLoading(false);
      return;
    }
    setSuccess("Votre avatar a été mise à jour");
    router.refresh();
    // setTimeout(() => {
    //   window.location.reload();
    //   setLoading(false);
    // }, 500);
  };

  const handleSubmitNotifyState = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      notifyNewsletter === dataAvatar.notifyNewsletter &&
      notifyOrderBy === dataAvatar.notifyOrderBy
    )
      return;
    setSuccess("");
    setError("");
    setLoading(true);

    const res = await handleUpdateProfileUser({
      notifyOrderBy: notifyOrderBy,
      notifyNewsletter: notifyNewsletter,
    });

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
    if (selectedFile) setIsEditing(true);
  }, [selectedFile]);

  useEffect(() => {
    if (isComplete && !selectedFile) {
      setIsEditing(false);
    }
  }, [success, selectedFile]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        " border border-border rounded-lg overflow-hidden",
        emuted ? "bg-transparent animate-pulse" : "bg-background",
      )}
    >
      {uploading && (
        <div className="flex flex-col justify-center items-center w-full">
          <Progress value={progress} className="rounded-none " />
        </div>
      )}
      <div className=" p-6 space-y-6">
        <div className="flex items-center max-md:items-start justify-between mb-6">
          <Skeleton emuted={emuted}>
            <h2 className="text-2xl font-bold">Mon Avatar</h2>
          </Skeleton>
          <div className="flex max-md:flex-col justify-between items-center gap-4">
            <Button
              onClick={() => {
                if (!isEditing) openFilePicker();
              }}
              disabled={loading || emuted || isloading}
              type={isEditing ? "submit" : "button"}
              variant={
                emuted || isloading
                  ? "emuted"
                  : isEditing
                    ? "default"
                    : "outline"
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
            {isEditing && (
              <Button
                disabled={loading || emuted || isloading}
                onClick={openFilePicker}
                type={"button"}
                variant={emuted || isloading ? "emuted" : "outline"}
              >
                {loading ? "Enregistrement...." : "Modifier"}
              </Button>
            )}

            {!isComplete && (
              <Button
                disabled={loading || emuted || isloading}
                onClick={handleClick}
                type={"button"}
                variant={emuted || isloading ? "emuted" : "default"}
                className={cn(
                  !emuted &&
                    !isloading &&
                    "bg-foreground text-background hover:bg-primary-dark",
                )}
              >
                {loading ? "Enregistrement...." : "Passer"}
              </Button>
            )}

            <input
              required
              type="file"
              ref={inputRef}
              onChange={handleFile}
              accept="image/*"
              name="avatar"
              id="avatar"
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-start items-center gap-6">
          <Avatar
            size="very-large"
            emuted={isloading || emuted}
            className={cn(
              !isEditing && "cursor-pointer",
              "justify-center items-center m-0",
            )}
          >
            <AvatarImage
              src={isloading || emuted ? "" : preview || dataAvatar?.avatar}
              alt="Photo de profil"
            />
            <AvatarFallback
              emuted={isloading || emuted}
              className="text-2xl font-bold"
              delayMs={600}
            >
              {user?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {error && <ErrorInfo emuted={emuted} info={error} />}
        </div>
      </div>

      <div className="p-4 space-y-2">
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
                  onChange={() => setNotifyOrderBy(val)}
                  checked={notifyOrderBy === val}
                  disabled={isloading}
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
            checked={notifyNewsletter}
            onChange={() => setNotifyNewsletter(!notifyNewsletter)}
            disabled={isloading}
            className="w-5 h-5"
          />
        </div>

        <div className="flex justify-end items-center">
          <Button
            onClick={handleSubmitNotifyState}
            disabled={loading || emuted || isloading}
            type="button"
            variant={emuted || isloading ? "emuted" : "default"}
            className={
              !emuted && !isloading
                ? "bg-foreground text-background hover:bg-primary-dark"
                : ""
            }
          >
            {loading ? "Enregistrement...." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </form>
  );
}
