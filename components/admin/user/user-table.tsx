"use client";

import { ChangeStateButton } from "@/components/change-state-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/@types/types";
import { APP } from "@/lib/data/raw/routes";
import { RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import { formatDate } from "@/lib/utils/date";
import { capitalizeFirstLetter } from "@/lib/utils/string";
import { cn } from "@/lib/utils/utils";
import { Eye, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface UserTableProps {
  users: User[];
  handleChangeState: (id: number, currentState: StateUser) => void;
  emuted?: boolean;
  loading: boolean;
}

export default function UserTable({
  users,
  handleChangeState,
  emuted = true,
  loading,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-border">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Nom</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Contact</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Commandes</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Dépensé</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Inscription</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Statut</Skeleton>
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              <Skeleton emuted={emuted}>Actions</Skeleton>
            </th>
          </tr>
        </thead>
        {users?.length > 0 && !loading && (
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-accent transition"
              >
                <td className="py-3 px-4 font-semibold">
                  <Skeleton emuted={emuted}>
                    {capitalizeFirstLetter(user.firstName) +
                      " " +
                      capitalizeFirstLetter(user.lastName)}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Skeleton emuted={emuted}>
                        <Mail
                          className={cn("w-4 h-4", !emuted && "text-gray-400")}
                        />
                      </Skeleton>
                      <Skeleton emuted={emuted}>{user.email}</Skeleton>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton emuted={emuted}>
                        <Phone
                          className={cn("w-4 h-4", !emuted && "text-gray-400")}
                        />
                      </Skeleton>
                      <Skeleton emuted={emuted}>{user.phone}</Skeleton>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>{user._count.orders}</Skeleton>
                </td>
                <td className="py-3 px-4 font-bold text-foreground">
                  <Skeleton emuted={emuted}>
                    {(
                      user.transactions?.reduce(
                        (total, transaction) => total + transaction.amount,
                        0,
                      ) || 0
                    ).toFixed(2)}
                    $
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    {formatDate(new Date(user.createdAt))}
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <Skeleton emuted={emuted}>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        !emuted && user.state === StateUser.ENABLED
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {user.state === StateUser.ENABLED ? "actif" : "inactif"}
                    </span>
                  </Skeleton>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      href={
                        emuted
                          ? "#"
                          : APP.admin.users +
                            (user.role === RoleUser.ADMIN
                              ? "/managers"
                              : "/customers") +
                            "/" +
                            user.id
                      }
                    >
                      <Button
                        size="sm"
                        variant={emuted ? "emuted" : "default"}
                        className={cn(!emuted && " hover:bg-primary-dark")}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <ChangeStateButton
                      handleChangeState={() =>
                        handleChangeState(user.id, user.state)
                      }
                      text="ce client"
                      currentState={user.state}
                      emuted={emuted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
