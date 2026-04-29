export default function OnboardingPage({
  params,
}: {
  params: { step: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Onboarding</h1>
      <p className="mt-1 text-muted-foreground">Passo: {params.step}</p>
    </div>
  );
}
