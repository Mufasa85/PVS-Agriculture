"use client";

import { useEffect, useState } from "react";

type AuditEntry = {
  id: number;
  action: string;
  userName: string;
  userEmail: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATE: "Création",
  PRODUCT_UPDATE: "Modification",
  PRODUCT_DELETE: "Mise en corbeille",
  PRODUCT_RESTORE: "Restauration",
  PRODUCT_PURGE: "Suppression définitive",
  PRODUCT_DUPLICATE: "Duplication",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProductHistory({ productId }: { productId: number }) {
  const [logs, setLogs] = useState<AuditEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/products/${productId}/history`)
      .then((res) => (res.ok ? res.json() : { logs: [] }))
      .then((data) => {
        if (!cancelled) setLogs(data.logs ?? []);
      })
      .catch(() => {
        if (!cancelled) setLogs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (logs === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="py-12 text-center text-[13.5px] text-ink-500">
        Aucun événement enregistré pour ce produit.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line/60">
      {logs.map((log) => (
        <li key={log.id} className="flex items-start gap-3 py-3.5">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-semibold text-brand-900">
              {ACTION_LABELS[log.action] ?? log.action}
            </p>
            <p className="text-[12px] text-ink-500">
              {log.userName}
              {log.userEmail ? ` (${log.userEmail})` : ""} ·{" "}
              {formatDateTime(log.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
