"use client";

import ErrorInfo from "@/components/error-info";
import SuccessInfo from "@/components/success-info";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import countries from "@/lib/data/raw/countries";
import { acronyme, capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";

interface AdminManagerDetailsFormProps {
  formData: Record<string, string>;
  isEditing?: boolean;
  emuted?: boolean;
  loading: boolean;
  error: string;
  success: string;
}

export default function AdminManagerDetailsForm({
  formData,
  isEditing = false,
  emuted = true,
  loading,
  error,
  success,
}: AdminManagerDetailsFormProps) {
  return (
    // <form onSubmit={handleSubmit} className={cn("space-y-2")}>
    <div className={cn("space-y-2")}>
      {/* Box Informations */}
      <div className="bg-background border border-border rounded-lg p-6 space-y-4 w-full">
        <Skeleton emuted={emuted}>
          <h2 className="text-xl font-bold">Informations de base</h2>
        </Skeleton>

        {/* Avatar , Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          {/* Avatar */}
          <div className="col-span-2">
            <Avatar
              size="very-large"
              className={cn("justify-center items-center m-0")}
              emuted={emuted || loading }
            >
              <AvatarImage
                src={
                  emuted || loading 
                    ? "/placeholder.svg"
                    : formData?.avatar || " "
                }
                alt={"avatar de " + formData?.firstName}
              />
              <AvatarFallback
                emuted={emuted || loading }
                className="text-2xl font-bold"
                delayMs={500}
              >
                {acronyme(
                  capitalizeFirstLetter(formData.firstName) +
                    " " +
                    capitalizeFirstLetter(formData.lastName),
                )}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <div className="col-span-4">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Nom de l'admin</label>
            </Skeleton>
            <input
              required
              disabled={loading || emuted || !isEditing}
              type="text"
              name="name"
              value={
                capitalizeFirstLetter(formData.firstName) +
                  " " +
                  capitalizeFirstLetter(formData.lastName) || ""
              }
              placeholder="Name"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* Email */}
          <div className="col-span-4">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Adresse mail</label>
            </Skeleton>
            <input
              required
              disabled
              type="email"
              name="email"
              value={formData.email || ""}
              placeholder="Email"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>
        </div>

        {/* Phone and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Téléphone</label>
            </Skeleton>
            <input
              required
              disabled
              type="tel"
              name="phone"
              value={formData.phone || ""}
              placeholder="Phone"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-1">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Adresse</label>
            </Skeleton>
            <input
              required
              disabled
              type="text"
              name="address"
              value={formData.address || ""}
              placeholder="Adresse"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>
        </div>

        {/* City , ZipCode and Country */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* City */}
          <div className="col-span-2">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Ville</label>
            </Skeleton>
            <input
              required
              disabled
              type="text"
              name="city"
              value={formData.city || ""}
              placeholder="Ville"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* ZipCode */}
          <div className="col-span-2 md:col-span-1">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Code postal</label>
            </Skeleton>
            <input
              required
              disabled
              type="text"
              name="zipcode"
              value={formData.zipCode || ""}
              placeholder="Code postal"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
              )}
            />
          </div>

          {/* Country */}
          <div className="col-span-2">
            <Skeleton emuted={emuted}>
              <label className="text-sm font-semibold">Pays</label>
            </Skeleton>
            <select
              required
              disabled={loading || emuted || !isEditing}
              value={formData.country}
              name="country"
              className={cn(
                "w-full px-4 py-2 border border-border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-foreground",
                (loading || emuted) &&
                  "bg-muted-foreground text-muted-foreground animate-pulse",
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
      </div>

      {error && <ErrorInfo info={error} emuted={emuted} />}

      {success && <SuccessInfo info={success} emuted={emuted} />}
    </div>
  );
}
