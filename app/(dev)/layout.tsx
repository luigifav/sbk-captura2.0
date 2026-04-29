import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System | Captura SBK 2.0",
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
