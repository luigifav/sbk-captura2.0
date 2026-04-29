export default function CapturaCnjPage({
  params,
}: {
  params: { cnj: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Captura CNJ</h1>
      <p className="mt-1 text-muted-foreground">CNJ: {params.cnj}</p>
    </div>
  );
}
