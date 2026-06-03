"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import links from "@/lib/data/raw/links";
import { handleUploadAvatar } from "@/lib/handlers/events-handlers/upload-events";
import { cn } from "@/lib/utils/utils";
import { Edit, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

interface AccountSideBarProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeTab: string;
  isloading?: boolean;
  emuted?: boolean;
}

export default function AccountSideBar({
  setActiveTab,
  activeTab,
  isloading = true,
  emuted = true,
}: AccountSideBarProps) {
  const { logout, user , isloadingAuth } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const name =
    (user?.firstName?.charAt(0) || "") + (user?.lastName?.charAt(0) || "");

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
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();

      form.append("file", selectedFile);

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
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (selectedFile) setIsEditing(true);
  }, [selectedFile]);

  return (
    <div className="lg:col-span-2">
      <div
        className={cn(
          "border border-border rounded-lg p-6 space-y-4",
          emuted ? "bg-transparent animate-pulse" : "bg-background",
        )}
      >
        <form
          onSubmit={handleSubmit}
          className="flex max-md:flex-col lg:flex-col items-center justify-between gap-3 mb-6"
        >
          <div className="flex items-center justify-start gap-3 w-full">
            <Avatar
              emuted={isloading || emuted || isloadingAuth}
              size="very-large"
              className={cn("justify-center items-center m-0")}
            >
              <AvatarImage
                src={isloading || emuted || isloadingAuth ? "" : preview || user?.avatar}
                alt="Photo de profil"
              />
              <AvatarFallback
                emuted={isloading || emuted || isloadingAuth}
                className="text-2xl font-bold"
                delayMs={600}
              >
                {name?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Skeleton emuted={isloading || emuted || isloadingAuth}>
                <p className="font-semibold">
                  {user?.firstName || "Prenom"} {user?.lastName || "Nom"}
                </p>
              </Skeleton>
              <Skeleton emuted={isloading || emuted || isloadingAuth}>
                <p
                  className={cn(
                    "text-sm",
                    !isloading && !emuted && !isloadingAuth && "text-gray-500",
                  )}
                >
                  {user?.email || "user@tatglobal.com"}
                </p>
              </Skeleton>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 w-full">
            <Button
              onClick={() => {
                if (!isEditing) openFilePicker();
              }}
              disabled={loading || isloading || emuted}
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
                  ? "bg-foreground text-background"
                  : ""
              }
            >
              {!loading && !isEditing && <Edit />}
              {isEditing
                ? loading
                  ? "Enregistrement...."
                  : "Enregistrer"
                : "Modifier"}
            </Button>
            {isEditing && (
              <Button
                onClick={openFilePicker}
                disabled={loading || isloading || emuted || isloadingAuth}
                type={"button"}
                variant={emuted || isloading ? "emuted" : "outline"}
              >
                {!loading && isEditing && <Edit />}
                {loading ? "Enregistrement..." : "Modifier"}
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
        </form>

        <nav className="space-y-2">
          {links.user.map((link, index) => (
            <button
              key={index}
              disabled={isloading || emuted}
              onClick={() => setActiveTab(link.value)}
              className={cn(
                "w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition",
                isloading || emuted
                  ? "bg-muted-foreground text-muted-foreground hover:bg-muted-foreground "
                  : activeTab === link.value
                    ? "bg-foreground text-background hover:bg-primary-dark"
                    : "hover:bg-accent",
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.title}
            </button>
          ))}
        </nav>

        <Button
          variant={emuted || isloading ? "emuted" : "outline"}
          onClick={handleLogout}
          disabled={emuted || isloading || isloadingAuth}
          className={cn(
            "w-full",
            !emuted &&
              !isloading &&
              "hover:text-destructive text-destructive bg-transparent",
          )}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
