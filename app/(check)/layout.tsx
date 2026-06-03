"use client";

export default function CheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground pt-12">
      {children}
    </div>
  );
}
