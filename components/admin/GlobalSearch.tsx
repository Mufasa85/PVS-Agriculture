"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MailIcon,
  PackageIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "@/components/ui/icons";

type Results = {
  products: { id: number; name: string; category: string }[];
  messages: {
    id: number;
    nom: string;
    email: string;
    sujet: string | null;
    isRead: boolean;
  }[];
  users: { id: number; name: string; email: string; role: string }[];
};

export default function GlobalSearch({
  isSuperAdmin,
}: {
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Debounce : requête 250 ms après la dernière frappe.
  // Tout setState passe par le callback du timer
  // (react-hooks/set-state-in-effect interdit le setState synchrone).
  useEffect(() => {
    const q = query.trim();
    const timer = window.setTimeout(
      () => {
        if (q.length < 2) {
          setResults(null);
          return;
        }
        fetch(`/api/admin/search?q=${encodeURIComponent(q)}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) setResults(data);
          })
          .catch(() => setResults(null));
      },
      q.length < 2 ? 0 : 250,
    );
    return () => window.clearTimeout(timer);
  }, [query]);

  // Fermer au clic extérieur / Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const visibleUsers = isSuperAdmin ? (results?.users ?? []) : [];
  const hasResults =
    (results?.products.length ?? 0) > 0 ||
    (results?.messages.length ?? 0) > 0 ||
    visibleUsers.length > 0;
  const showPanel = open && query.trim().length >= 2;

  return (
    <div
      ref={rootRef}
      className="relative hidden w-[280px] mid:block xl:w-[340px]"
    >
      <SearchIcon
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500/60"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Rechercher produits, messages, utilisateurs…"
        className="w-full rounded-full border border-line bg-white py-2 pl-10 pr-9 text-[13px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setResults(null);
          }}
          aria-label="Effacer"
          className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          <XIcon size={12} />
        </button>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-[14px] border border-line bg-white py-2 shadow-float">
          {results === null ? (
            <p className="px-4 py-3 text-[12.5px] text-ink-500">
              Recherche en cours…
            </p>
          ) : !hasResults ? (
            <p className="px-4 py-3 text-[12.5px] text-ink-500">
              Aucun résultat pour « {query.trim()} »
            </p>
          ) : (
            <>
              {results.products.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 px-4 pb-1 pt-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    <PackageIcon size={12} /> Produits
                  </p>
                  {results.products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => go("/admin/products")}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-brand-50"
                    >
                      <span className="truncate text-[13px] font-semibold text-brand-900">
                        {p.name}
                      </span>
                      <span className="ml-auto shrink-0 text-[11px] text-ink-500">
                        {p.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {results.messages.length > 0 && (
                <div className="mt-1 border-t border-line/60 pt-1">
                  <p className="flex items-center gap-1.5 px-4 pb-1 pt-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    <MailIcon size={12} /> Messages
                  </p>
                  {results.messages.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => go("/admin/messages")}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-brand-50"
                    >
                      <span
                        className={`truncate text-[13px] text-brand-900 ${m.isRead ? "font-medium" : "font-bold"}`}
                      >
                        {m.sujet || m.nom}
                      </span>
                      <span className="ml-auto shrink-0 text-[11px] text-ink-500">
                        {m.email}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {visibleUsers.length > 0 && (
                <div className="mt-1 border-t border-line/60 pt-1">
                  <p className="flex items-center gap-1.5 px-4 pb-1 pt-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-500">
                    <UsersIcon size={12} /> Utilisateurs
                  </p>
                  {visibleUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => go("/admin/users")}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors hover:bg-brand-50"
                    >
                      <span className="truncate text-[13px] font-semibold text-brand-900">
                        {u.name}
                      </span>
                      <span className="ml-auto shrink-0 text-[11px] text-ink-500">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
