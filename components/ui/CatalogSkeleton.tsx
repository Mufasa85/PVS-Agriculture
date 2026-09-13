/**
 * Skeleton de chargement des pages catalogue (hero + grille produits),
 * affiché par le loading.tsx de chaque route publique ISR.
 */
export default function CatalogSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Chargement de la page…</span>

      {/* Hero */}
      <div className="flex min-h-[70vh] items-center justify-center bg-brand-100/60">
        <div className="shell flex animate-pulse flex-col items-center gap-6 py-[120px]">
          <div className="h-4 w-44 rounded-full bg-brand-200/70" />
          <div className="h-12 w-full max-w-[560px] rounded-2xl bg-brand-200/70" />
          <div className="h-4 w-full max-w-[420px] rounded-full bg-brand-200/70" />
          <div className="mt-4 flex gap-4">
            <div className="h-12 w-40 rounded-full bg-brand-200/70" />
            <div className="h-12 w-48 rounded-full bg-brand-200/70" />
          </div>
        </div>
      </div>

      {/* Grille produits */}
      <div className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <div className="mx-auto mb-14 flex animate-pulse flex-col items-center gap-4">
            <div className="h-4 w-36 rounded-full bg-brand-100" />
            <div className="h-9 w-full max-w-[420px] rounded-xl bg-brand-100" />
          </div>
          <div className="grid animate-pulse grid-cols-1 gap-6 mid:grid-cols-2 nav:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-pvs-lg border border-line bg-white"
              >
                <div className="aspect-[4/3] bg-brand-100" />
                <div className="flex flex-col gap-3 px-5 py-6">
                  <div className="h-4 w-3/4 rounded-full bg-brand-100" />
                  <div className="h-3 w-full rounded-full bg-brand-100" />
                  <div className="h-3 w-2/3 rounded-full bg-brand-100" />
                  <div className="mt-2 h-6 w-24 rounded-full bg-brand-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
