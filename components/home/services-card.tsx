"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import services from "@/lib/app/links/services/services";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function ServicesCard({
  emuted = true,
  isloading = true,
}: {
  emuted?: boolean;
  isloading?: boolean;
}) {
  return (
    <section className="py-16 bg-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton emuted={emuted}>
            <h2
              className={cn(
                "text-3xl font-bold mb-4",
                !emuted && "text-foreground "
              )}
            >
              Nos Services Complets
            </h2>
          </Skeleton>
          <Skeleton emuted={emuted}>
            <p className={cn("max-w-2xl mx-auto", !emuted && "text-gray-500")}>
              Au-delà de nos produits, TAT GLOBAL vous offre une gamme complète
              de services pour répondre à tous vos besoins
            </p>
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
                      !isloading && !emuted && service.color
                    )}
                  >
                    <Skeleton emuted={isloading || emuted}>
                      <Icon
                        className={cn(
                          "w-12 h-12 ",
                          !isloading && !emuted && "text-background"
                        )}
                      />
                    </Skeleton>
                  </div>
                  <div className="px-6 py-4 ">
                    <Skeleton emuted={isloading || emuted}>
                      <h3 className="font-bold text-lg mb-2">
                        {service.title}
                      </h3>
                    </Skeleton>
                    <Skeleton emuted={isloading || emuted}>
                      <p
                        className={cn(
                          "text-sm mb-4",
                          !isloading && !emuted && "text-gray-500"
                        )}
                      >
                        {service.description}
                      </p>
                    </Skeleton>
                    <Button
                      variant={isloading || emuted ? "emuted" : "outline"}
                      size="sm"
                      className={cn(
                        "w-full",
                        !isloading && !emuted && "bg-transparent"
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
      </div>
    </section>
  );
}
