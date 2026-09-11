"use client";

import { useCallback, useEffect, useState } from "react";

import { SearchIcon } from "@/components/ui/icons";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type AuditLog = {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string } | null;
};

type AuditData = {
  logs: AuditLog[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  actionTypes: string[];
  entityTypes: string[];
};

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATE: "Création produit",
  PRODUCT_UPDATE: "Modification produit",
  PRODUCT_DELETE: "Suppression produit",
  CATEGORY_CREATE: "Création catégorie",
  CATEGORY_UPDATE: "Modification catégorie",
  CATEGORY_DELETE: "Suppression catégorie",
  USER_CREATE: "Création utilisateur",
  USER_UPDATE: "Modification utilisateur",
  USER_DELETE: "Suppression utilisateur",
  MESSAGE_UPDATE: "Modification message",
  MESSAGE_DELETE: "Suppression message",
  ADMIN_LOGIN: "Connexion admin",
  ADMIN_LOGOUT: "Déconnexion admin",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-amber-50 text-amber-700 border-amber-200",
  DELETE: "bg-red-50 text-red-700 border-red-200",
  LOGIN: "bg-brand-50 text-brand-700 border-brand-200",
  LOGOUT: "bg-ink-100 text-ink-600 border-line",
};

function getActionColor(action: string): string {
  if (action.includes("DELETE")) return ACTION_COLORS.DELETE;
  if (action.includes("UPDATE")) return ACTION_COLORS.UPDATE;
  if (action.includes("CREATE")) return ACTION_COLORS.CREATE;
  if (action.includes("LOGIN")) return ACTION_COLORS.LOGIN;
  if (action.includes("LOGOUT")) return ACTION_COLORS.LOGOUT;
  return "bg-ink-100 text-ink-600 border-line";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatMetadata(meta: Record<string, unknown> | null): string {
  if (!meta) return "—";
  const entries = Object.entries(meta);
  if (entries.length === 0) return "—";
  return entries
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`)
    .join("\n");
}

export default function AdminAuditLogsPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchLogs = useCallback(async (p: number, a: string, e: string, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("perPage", "25");
      if (a) params.set("action", a);
      if (e) params.set("entityType", e);
      if (s.trim()) params.set("search", s);
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      console.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(page, action, entityType, search);
  }, [page, action, entityType, search, fetchLogs]);

  function resetFilters() {
    setAction("");
    setEntityType("");
    setSearch("");
    setPage(1);
  }

  const hasFilters = action || entityType || search;

  return (
    <div className="flex flex-col gap-6">
      {/* ── En-tête ── */}
      <div>
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
          Sécurité & Traçabilité
        </span>
        <h1 className="mt-1 font-serif text-[26px] font-bold text-brand-900">
          Journal d&apos;audit
        </h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          Historique complet des actions effectuées dans l&apos;espace d&apos;administration.
        </p>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative max-w-md flex-1">
          <SearchIcon
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500/60"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher (action, entité, IP)…"
            className="w-full rounded-[12px] border border-line bg-white py-2.5 pl-11 pr-10 text-[14px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
              aria-label="Effacer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          className="rounded-[12px] border border-line bg-white px-4 py-2.5 text-[13.5px] font-semibold text-brand-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        >
          <option value="">Toutes les actions</option>
          {data?.actionTypes.map((a) => (
            <option key={a} value={a}>
              {ACTION_LABELS[a] ?? a}
            </option>
          ))}
        </select>

        <select
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setPage(1); }}
          className="rounded-[12px] border border-line bg-white px-4 py-2.5 text-[13.5px] font-semibold text-brand-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        >
          <option value="">Tous les types</option>
          {data?.entityTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-[10px] border border-line bg-white px-3 py-2 text-[12.5px] font-semibold text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Tableau ── */}
      <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="text-[13px] font-semibold text-ink-700">
            {data ? `${data.total} entrée${data.total > 1 ? "s" : ""}` : "Chargement…"}
          </span>
          {data && data.total > 0 && (
            <span className="text-[12px] text-ink-500">
              Page {data.page} / {data.totalPages}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            </div>
          ) : !data || data.logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[14px] font-semibold text-ink-700">Aucune entrée</p>
              <p className="mt-1 text-[13px] text-ink-500">
                {hasFilters ? "Aucun résultat pour ces filtres." : "Le journal est vide."}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-line bg-[#f8f9fc]">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                    Utilisateur
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                    Action
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                    Entité
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500 hidden nav:table-cell">
                    Adresse IP
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className={`cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-brand-50/30 ${
                      expandedId === log.id ? "bg-brand-50/40" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[12.5px] text-ink-600 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      {log.user ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] font-bold text-white">
                            {log.user.name.split(" ").map((p) => p[0]?.toUpperCase()).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] font-semibold text-brand-900">
                              {log.user.name}
                            </p>
                            <p className="truncate text-[11px] text-ink-500">
                              {log.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[12.5px] text-ink-500/60 italic">Système</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${getActionColor(log.action)}`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-semibold text-brand-900">
                          {log.entityType}
                        </span>
                        {log.entityId && (
                          <span className="text-[11px] text-ink-500">
                            ID: {log.entityId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-ink-500 hidden nav:table-cell">
                      {log.ipAddress || "—"}
                    </td>
                  </tr>
                ))}
                {data.logs.map((log) =>
                  expandedId === log.id ? (
                    <tr key={`${log.id}-detail`} className="bg-[#f8f9fc]">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="rounded-[10px] border border-line bg-white p-4">
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                            Détails
                          </p>
                          <pre className="whitespace-pre-wrap text-[12.5px] leading-[1.6] text-brand-900 font-mono">
                            {formatMetadata(log.metadata)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {data && data.total > 0 && (
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-3.5">
            <span className="text-[12.5px] font-semibold text-ink-500">
              Page {data.page} / {data.totalPages}
            </span>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                )}
                {(() => {
                  const pages: (number | "ellipsis")[] = [];
                  const totalPages = data.totalPages;
                  const current = data.page;
                  const add = (p: number | "ellipsis") => pages.push(p);

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) add(i);
                  } else {
                    add(1);
                    if (current > 3) add("ellipsis");
                    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) add(i);
                    if (current < totalPages - 2) add("ellipsis");
                    add(totalPages);
                  }

                  return pages.map((p, idx) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === current}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  );
                })()}
                {page < data.totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(data.totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
