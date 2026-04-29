export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r bg-muted/40 p-4">
        <p className="text-sm font-semibold text-muted-foreground">
          Portal do Cliente
        </p>
        {/* Navegação — a ser implementada */}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
