export default function AdminLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      {/* En-tête */}
      <div className="flex flex-col gap-3">
        <div className="h-3 w-32 rounded bg-brand-100" />
        <div className="h-7 w-56 rounded bg-brand-100" />
        <div className="h-4 w-72 rounded bg-ink-100" />
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-[16px] border border-line bg-white p-5 shadow-soft"
          >
            <div className="h-7 w-16 rounded bg-brand-100" />
            <div className="mt-2 h-3 w-24 rounded bg-ink-100" />
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="rounded-[16px] border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full bg-brand-50" />
              <div className="flex-1">
                <div className="h-3.5 w-1/3 rounded bg-ink-100" />
                <div className="mt-2 h-3 w-1/2 rounded bg-ink-100/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
