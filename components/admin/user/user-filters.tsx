"use client";

import { Button } from "@/components/ui/button";
import { ROLE_USER, USER_STATE } from "@/lib/constants/constants";
import { RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils/utils";
import {
  ArrowDownAz,
  ArrowUpAz,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";

interface AdminUserFiltersProps {
  role: {
    selectedRole: RoleUser | "ALL";
    setSelectedRole: React.Dispatch<React.SetStateAction<RoleUser | "ALL">>;
  };
  state: {
    selectedState: StateUser | "ALL";
    setSelectedState: React.Dispatch<React.SetStateAction<StateUser | "ALL">>;
  };
  sort: {
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
  };
  emuted?: boolean;
  usersPage?: boolean;
}

export default function AdminUserFilters({
  emuted = true,
  role,
  state,
  sort,
  usersPage = true,
}: AdminUserFiltersProps) {
  const { selectedRole, setSelectedRole } = role;
  const { selectedState, setSelectedState } = state;
  const { sortBy, setSortBy } = sort;

  return (
    <div
      className={cn(
        usersPage && "flex flex-col justify-between md:flex-row gap-4",
      )}
    >
      {/* role */}
      {usersPage && (
        <div className="flex gap-2 flex-wrap">
          {ROLE_USER.map((role, index) => (
            <Button
              key={index}
              onClick={() => setSelectedRole(role?.value)}
              disabled={emuted}
              variant={
                emuted
                  ? "emuted"
                  : selectedRole === role.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !emuted &&
                  (selectedRole === role.value
                    ? "bg-foreground hover:bg-primary-dark text-background"
                    : ""),
              )}
            >
              {role.label}
            </Button>
          ))}
        </div>
      )}

      <div className="flex justify-between gap-2">
        {/* State */}
        <div className="flex gap-2 flex-wrap">
          {USER_STATE.map((state, index) => (
            <Button
              key={index}
              onClick={() => setSelectedState(state.value)}
              disabled={emuted}
              variant={
                emuted
                  ? "emuted"
                  : selectedState === state.value
                    ? "default"
                    : "outline"
              }
              className={cn(
                !emuted &&
                  (selectedState === state.value
                    ? "bg-foreground hover:bg-primary-dark text-background"
                    : ""),
              )}
            >
              {state.label}
            </Button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-between gap-2 flex-wrap">
          <Button
            disabled={emuted}
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
            variant={emuted ? "emuted" : "outline"}
            className={cn(
              !emuted &&
                sortBy !== "name-asc" &&
                sortBy !== "name-desc" &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {sortBy === "oldest" ? <CalendarArrowUp /> : <CalendarArrowDown />}
          </Button>
          <Button
            disabled={emuted}
            onClick={() =>
              setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")
            }
            variant={emuted ? "emuted" : "outline"}
            className={cn(
              !emuted &&
                (sortBy == "name-asc" || sortBy == "name-desc") &&
                "bg-foreground text-background hover:bg-primary-dark",
            )}
          >
            {sortBy === "name-desc" ? <ArrowUpAz /> : <ArrowDownAz />}
          </Button>
        </div>
      </div>
    </div>
  );
}
