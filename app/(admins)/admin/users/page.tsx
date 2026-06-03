"use client";

import AdminSearch from "@/components/admin/admin-search";
import AdminUserFilters from "@/components/admin/user/user-filters";
import UserHeader from "@/components/admin/user/user-header";
import UserTable from "@/components/admin/user/user-table";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { User } from "@/lib/@types/types";
import { RoleUser, StateUser } from "@/lib/generated/prisma/enums";
import {
  handleReadUsers,
  handleUpdateUser,
} from "@/lib/handlers/events-handlers/user-events";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const { isloading } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleUser | "ALL">("ALL");
  const [selectedState, setSelectedState] = useState<StateUser | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const ITEMS_PER_PAGE = 12;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangeState = async (id: number, currentState: StateUser) => {
    setLoading(true);

    const newState =
      currentState === StateUser.ENABLED
        ? StateUser.DISABLED
        : StateUser.ENABLED;

    const res = await handleUpdateUser(id, { state: newState });

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    setSuccess("success");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleReadUsers(
      currentPage.toString(),
      ITEMS_PER_PAGE.toString(),
      selectedRole,
      selectedState,
      searchQuery,
      sortBy,
    )
      .then((res) => {
        if (res.error) {
          setError(
            res.error || "Une erreur est survenue lors de la récupération",
          );
          setLoading(false);
          return;
        }

        setUsers(res.data.users);
        const totalPages = Math.ceil(res.data.total / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [currentPage, searchQuery, selectedRole, selectedState, sortBy, success]);

  return (
    <main className="flex-1 space-y-4">
      {/* Header */}
      <UserHeader emuted={isloading} />

      {/* Filters and Search */}
      <div className="bg-background border border-border rounded-lg p-4 space-y-4">
        {/* Filters */}
        <AdminUserFilters
          role={{ selectedRole, setSelectedRole }}
          state={{ selectedState, setSelectedState }}
          sort={{ sortBy, setSortBy }}
          emuted={isloading}
        />

        {/* Search */}
        <AdminSearch
          search={{ searchQuery, setSearchQuery }}
          emuted={isloading}
          placeholder="Recherche des utilisateurs..."
        />
      </div>

      {/* users Table */}
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <UserTable
          users={users}
          handleChangeState={handleChangeState}
          emuted={isloading}
          loading={loading}
        />
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chargement des utilisateurs...</p>
          </div>
        ) : (
          users.length == 0 &&
          !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedRole !== "ALL" &&
                selectedState === "ALL" &&
                searchQuery === ""
                  ? "Aucun utilisateur ne correspond à ce role"
                  : selectedRole === "ALL" &&
                      selectedState !== "ALL" &&
                      searchQuery === ""
                    ? "Aucun utilisateur ne correspond à cet état"
                    : searchQuery !== ""
                      ? "Aucun utilisateur ne correspond à votre recherche."
                      : "Aucun utilisateur trouvé"}
              </p>
            </div>
          )
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          emuted={isloading || loading}
        />
      )}
    </main>
  );
}
