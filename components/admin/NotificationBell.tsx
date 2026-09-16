"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type UnreadMessage = {
  id: number;
  nom: string;
  sujet: string;
  createdAt: string;
};

type AuditEntry = {
  id: number;
  action: string;
  createdAt: string;
  user: { name: string } | null;
};

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATE: "a créé un produit",
  PRODUCT_UPDATE: "a modifié un produit",
  PRODUCT_DELETE: "a supprimé un produit",
  PRODUCT_RESTORE: "a restauré un produit",
  PRODUCT_DUPLICATE: "a dupliqué un produit",
  PRODUCT_REORDER: "a réordonné les produits",
  CATEGORY_CREATE: "a créé une catégorie",
  CATEGORY_UPDATE: "a modifié une catégorie",
  CATEGORY_DELETE: "a supprimé une catégorie",
  CATEGORY_REORDER: "a réordonné les catégories",
  USER_CREATE: "a créé un utilisateur",
  USER_UPDATE: "a modifié un utilisateur",
  USER_DELETE: "a supprimé un utilisateur",
  MESSAGE_UPDATE: "a mis à jour un message",
  MESSAGE_DELETE: "a supprimé un message",
  MESSAGE_REPLY: "a répondu à un message",
  LOGIN: "s'est connecté",
  LOGOUT: "s'est déconnecté",
  LOGIN_FAILED: "a échoué une connexion",
  PASSWORD_CHANGE: "a changé son mot de passe",
  PASSWORD_RESET: "a réinitialisé un mot de passe",
  TWO_FACTOR_ENABLE: "a activé la 2FA",
  TWO_FACTOR_DISABLE: "a désactivé la 2FA",
};

function timeAgo(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return new Date(isoDate).toLocaleDateString("fr-FR");
}

/**
 * Cloche de notifications de la topbar admin : badge = messages non lus,
 * panneau = derniers messages non lus + activité récente (audit logs).
 * Rafraîchi toutes les 60 s comme le badge de la sidebar.
 */
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unread, setUnread] = useState<UnreadMessage[]>([]);
  const [activity, setActivity] = useState<AuditEntry[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages?filter=unread&perPage=5");
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
      setUnread(data.messages ?? []);
    } catch {
      // silencieux : notifications indicatives
    }
  }, []);

  useEffect(() => {
    // Différé en microtâche (react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      void loadUnread();
    });
    const timer = setInterval(loadUnread, 60_000);
    return () => clearInterval(timer);
  }, [loadUnread]);

  // Charge l'activité récente à l'ouverture du panneau.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/admin/audit-logs?perPage=6")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setActivity(data.logs ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Échap + clic extérieur ferment le panneau ; focus restauré au bouton.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="panneau-notifications"
        aria-label={
          unreadCount > 0
            ? `Notifications — ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
            : "Notifications"
        }
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="panneau-notifications"
            role="region"
            aria-label="Notifications récentes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 0.8, 0.24, 1] }}
            className="absolute right-0 top-full z-[1200] mt-3 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] border border-line bg-white shadow-float"
          >
            {/* Messages non lus */}
            <div className="border-b border-line px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                Messages non lus
                {unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] text-brand-700">
                    {unreadCount}
                  </span>
                )}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {unread.slice(0, 4).map((m) => (
                  <li key={m.id}>
                    <Link
                      href="/admin/messages"
                      onClick={() => setOpen(false)}
                      className="block rounded-[10px] px-2 py-1.5 transition-colors hover:bg-brand-50"
                    >
                      <span className="block truncate text-[13px] font-bold text-brand-900">
                        {m.nom}
                        <span className="ml-2 font-normal text-ink-500">
                          {timeAgo(m.createdAt)}
                        </span>
                      </span>
                      <span className="block truncate text-[12.5px] text-ink-500">
                        {m.sujet}
                      </span>
                    </Link>
                  </li>
                ))}
                {unread.length === 0 && (
                  <li className="px-2 py-1.5 text-[12.5px] text-ink-500">
                    Aucun message non lu.
                  </li>
                )}
              </ul>
            </div>

            {/* Activité récente */}
            <div className="px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                Activité récente
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {activity.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-baseline justify-between gap-3 rounded-[10px] px-2 py-1.5"
                  >
                    <span className="truncate text-[12.5px] text-ink-700">
                      <span className="font-bold text-brand-900">
                        {log.user?.name ?? "Système"}
                      </span>{" "}
                      {ACTION_LABELS[log.action] ??
                        log.action.toLowerCase().replaceAll("_", " ")}
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-500">
                      {timeAgo(log.createdAt)}
                    </span>
                  </li>
                ))}
                {activity.length === 0 && (
                  <li className="px-2 py-1.5 text-[12.5px] text-ink-500">
                    Aucune activité récente.
                  </li>
                )}
              </ul>
            </div>

            {/* Liens vers les pages complètes */}
            <div className="flex items-center justify-between border-t border-line bg-brand-50/50 px-4 py-2.5">
              <Link
                href="/admin/messages"
                onClick={() => setOpen(false)}
                className="text-[12.5px] font-bold text-brand-700 hover:text-brand-800"
              >
                Tous les messages
              </Link>
              <Link
                href="/admin/audit-logs"
                onClick={() => setOpen(false)}
                className="text-[12.5px] font-bold text-brand-700 hover:text-brand-800"
              >
                Journal d&apos;activité
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
