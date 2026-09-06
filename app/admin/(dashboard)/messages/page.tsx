"use client";

import { useCallback, useEffect, useState } from "react";

import {
  MailIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
} from "@/components/ui/icons";

type ContactMessage = {
  id: number;
  nom: string;
  telephone: string;
  email: string;
  sujet: string | null;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
};

type Filter = "all" | "unread" | "starred";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return formatDate(iso);
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async (f: Filter, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f !== "all") params.set("filter", f);
      if (s.trim()) params.set("search", s);
      const res = await fetch(`/api/admin/messages?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages(filter, search);
  }, [filter, search, fetchMessages]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  async function markRead(id: number, isRead: boolean) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === id ? data.message : m)));
        setUnreadCount((prev) => prev + (isRead ? -1 : 1));
      }
    } catch {
      console.error("Failed to update message");
    }
  }

  async function toggleStar(id: number, isStarred: boolean) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isStarred }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === id ? data.message : m)));
      }
    } catch {
      console.error("Failed to update message");
    }
  }

  async function deleteMessage(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedId === id) setSelectedId(null);
        if (!messages.find((m) => m.id === id)?.isRead) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      }
    } catch {
      console.error("Failed to delete message");
    }
  }

  function handleMessageClick(msg: ContactMessage) {
    setSelectedId(msg.id);
    if (!msg.isRead) {
      markRead(msg.id, true);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-4 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
            Communication
          </span>
          <h1 className="mt-1 font-serif text-[26px] font-bold text-brand-900">
            Messages reçus
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Suivi des demandes envoyées via le formulaire de contact du site.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
            <span className="text-[13px] font-semibold text-amber-700">
              message{unreadCount > 1 ? "s" : ""} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Barre de recherche + filtres ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <SearchIcon
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500/60"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les messages…"
            className="w-full rounded-[12px] border border-line bg-white py-2.5 pl-11 pr-10 text-[14px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
              aria-label="Effacer la recherche"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-[12px] border border-line bg-white p-1 shadow-soft">
          {([
            { label: "Tous", value: "all" as Filter },
            { label: "Non lus", value: "unread" as Filter },
            { label: "Favoris", value: "starred" as Filter },
          ]).map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[12.5px] font-bold transition-all ${
                filter === item.value
                  ? "bg-brand-600 text-white shadow-brand-btn"
                  : "text-ink-500 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenu : liste + détail ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* Liste des messages */}
        <div className="flex flex-col rounded-[16px] border border-line bg-white shadow-soft overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                  <MailIcon size={24} className="text-brand-400" />
                </div>
                <p className="text-[14px] font-semibold text-ink-700">Aucun message</p>
                <p className="mt-1 text-[13px] text-ink-500">
                  {search ? "Aucun résultat pour cette recherche." : "La boîte de réception est vide."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-line/60">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => handleMessageClick(msg)}
                    className={`flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition-colors ${
                      selectedId === msg.id
                        ? "bg-brand-50"
                        : "hover:bg-brand-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                        )}
                        <span className={`truncate text-[13.5px] ${msg.isRead ? "font-semibold text-ink-700" : "font-bold text-brand-900"}`}>
                          {msg.nom}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {msg.isStarred && (
                          <StarIcon size={13} className="fill-amber-400 text-amber-400" />
                        )}
                        <span className="text-[11px] font-medium text-ink-500">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="truncate text-[12.5px] font-medium text-ink-600">
                      {msg.sujet || "Demande d'information"}
                    </p>
                    <p className="truncate text-[12px] text-ink-500">
                      {msg.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Détail du message */}
        <div className="rounded-[16px] border border-line bg-white shadow-soft">
          {selected ? (
            <div className="flex flex-col">
              {/* En-tête du message */}
              <div className="border-b border-line px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-[20px] font-bold text-brand-900">
                      {selected.sujet || "Demande d'information"}
                    </h2>
                    <p className="mt-1 text-[13px] text-ink-500">
                      Reçu le {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStar(selected.id, !selected.isStarred)}
                      title={selected.isStarred ? "Retirer des favoris" : "Marquer comme favori"}
                      className={`flex h-9 w-9 items-center justify-center rounded-[10px] border transition-colors ${
                        selected.isStarred
                          ? "border-amber-200 bg-amber-50 text-amber-500"
                          : "border-line text-ink-500 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      <StarIcon size={16} className={selected.isStarred ? "fill-current" : ""} />
                    </button>
                    <button
                      type="button"
                      onClick={() => markRead(selected.id, !selected.isRead)}
                      title={selected.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <MailIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMessage(selected.id)}
                      title="Supprimer"
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Infos expéditeur */}
              <div className="border-b border-line px-6 py-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Nom
                    </span>
                    <span className="mt-1 block text-[14px] font-semibold text-brand-900">
                      {selected.nom}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Email
                    </span>
                    <a
                      href={`mailto:${selected.email}`}
                      className="mt-1 block text-[14px] font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">
                      Téléphone
                    </span>
                    <a
                      href={`tel:${selected.telephone}`}
                      className="mt-1 block text-[14px] font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {selected.telephone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Corps du message */}
              <div className="px-6 py-5">
                <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-500">
                  Message
                </h3>
                <div className="rounded-[12px] bg-[#f8f9fc] p-5">
                  <p className="whitespace-pre-wrap text-[14.5px] leading-[1.7] text-brand-900">
                    {selected.message}
                  </p>
                </div>
              </div>

              {/* Actions de réponse */}
              <div className="border-t border-line px-6 py-4">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.sujet || "Demande d'information"}`}
                    className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700"
                  >
                    <MailIcon size={16} />
                    Répondre par email
                  </a>
                  <a
                    href={`tel:${selected.telephone}`}
                    className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Appeler
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                <MailIcon size={28} className="text-brand-400" />
              </div>
              <p className="text-[15px] font-semibold text-ink-700">
                Sélectionnez un message
              </p>
              <p className="mt-1.5 max-w-[280px] text-[13px] text-ink-500">
                Choisissez un message dans la liste pour afficher son contenu complet et les coordonnées de l&apos;expéditeur.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
