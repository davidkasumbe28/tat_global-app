"use client";

import ErrorInfo from "@/components/error-info";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import services from "@/lib/app/links/services/services";
import { STATUS_USER } from "@/lib/constants/constants";
import { handleUpdateProfileUser } from "@/lib/handlers/events-handlers/user-events";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { useState } from "react";

export default function FormCompletionStepFinal({
  isComplete,
  // me,
  emuted = true,
  isloading = true,
}: {
  isComplete: boolean;
  // me: Record<string, any | undefined>;
  emuted?: boolean;
  isloading?: boolean;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await handleUpdateProfileUser({ status: STATUS_USER.online });

    if (res.error) {
      setError(
        res.error || "Une erreur est survenue lors de la mise à jour du profil",
      );
      setLoading(false);
      return;
    }

    await logout();
    setLoading(false);
  };

  return (
    <div className=" bg-background text-foreground px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <Skeleton emuted={emuted}>
          <h2 className="text-5xl font-bold">Bienvenue sur TAT GLOBAL!</h2>
        </Skeleton>
        <Skeleton emuted={emuted}>
          <h3 className="text-3xl font-bold">Votre inscription est terminée</h3>
        </Skeleton>
        <div className="flex flex-col justify-center items-center gap-2">
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Merci de rejoindre notre communauté !
            </p>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn(!emuted && "text-gray-500")}>
              Nous sommes ravis de vous compter parmi nos nouveaux membres.
            </p>
          </Skeleton>
        </div>
      </div>
      <div className="flex justify-start items-center gap-6">
        <Skeleton emuted={emuted}>
          <h4 className="text-lg font-bold">
            Vous pouvez dès maintenant accedé aux services suivants :{" "}
          </h4>
        </Skeleton>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Link key={index} href={isloading || emuted ? "#" : service.href}>
              <Card
                emuted={emuted || isloading}
                className="h-full hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <div
                  className={cn(
                    "h-32 bg-gradient-to-br flex items-center justify-center",
                    !emuted && !isloading && service.color,
                  )}
                >
                  <Skeleton emuted={emuted || isloading}>
                    <Icon
                      className={cn(
                        "w-12 h-12 ",
                        !emuted && !isloading && "text-background",
                      )}
                    />
                  </Skeleton>
                </div>
                <div className="px-6 py-4 ">
                  <Skeleton emuted={emuted || isloading}>
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  </Skeleton>
                  <Skeleton emuted={emuted || isloading}>
                    <p
                      className={cn(
                        "text-sm mb-4",
                        !emuted && !isloading && "text-gray-500",
                      )}
                    >
                      {service.description}
                    </p>
                  </Skeleton>
                  <Button
                    variant={emuted || isloading ? "emuted" : "outline"}
                    size="sm"
                    className={cn(
                      "w-full",
                      !emuted && !isloading && "bg-transparent",
                    )}
                  >
                    Découvrir
                  </Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex justify-end items-center gap-2"
        >
          <Skeleton emuted={emuted}>
            <h4 className="text-lg font-bold">
              {" "}
              et passez vos commandes en cliquant sur{" "}
            </h4>
          </Skeleton>
          <Button
            type="submit"
            variant={emuted || isloading ? "emuted" : "default"}
            disabled={emuted || isloading || !isComplete}
            className={cn(
              !emuted &&
                !isloading &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {loading ? "Chargement..." : "Terminée"}
          </Button>
        </form>
        <div className="flex justify-end items-center gap-2">
          <Skeleton emuted={emuted}>
            <p
              className={cn(
                "text-[11px] font-extralight ",
                !emuted && !isloading && "text-gray-500",
              )}
            >
              Vous serez deconnectez et redirigé vers la page de connection pour
              vous connectez avec votre nouveau profil à jour.
            </p>
          </Skeleton>
        </div>
      </div>

      {error && <ErrorInfo emuted={emuted} info={error} />}
    </div>
  );
}
