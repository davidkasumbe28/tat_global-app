export default function Error({ error = "" }: { error?: string }) {
  return (
    <main className="flex-1 flex items-center justify-center min-h-screen">
      <p className="text-gray-500">
        {error
          ? error
          : "Une erreur est survenue, veuillez réesseyer plus tard."}
      </p>
    </main>
  );
}
