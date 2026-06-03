"use client";

import FormCompletionForm from "@/components/form-completion/form-completion-form";
import Pagination from "@/components/pagination";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function FormCompletionPage() {
  const { isloading } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex-1 flex-col items-center justify-center px-4 py-12">
      <FormCompletionForm
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setTotalPages={setTotalPages}
        emuted={isloading}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          emuted={isloading}
        />
      )}
    </main>
  );
}
