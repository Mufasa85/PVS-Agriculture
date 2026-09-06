"use client";

import { useEffect, useState } from "react";

import UserForm from "@/components/admin/UserForm";
import { XIcon } from "@/components/ui/icons";

type UserModalData = {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
  isActive: boolean;
};

export default function UserModal({
  open,
  editId,
  onClose,
}: {
  open: boolean;
  editId: number | null;
  onClose: () => void;
}) {
  const [initialData, setInitialData] = useState<UserModalData | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = editId !== null;

  useEffect(() => {
    if (!open) {
      setInitialData(null);
      return;
    }

    if (isEditing) {
      setLoading(true);
      fetch(`/api/admin/users/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            const u = data.user;
            setInitialData({
              id: u.id,
              name: u.name,
              email: u.email,
              password: "",
              role: u.role,
              isActive: u.isActive,
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setInitialData(null);
    }
  }, [open, editId, isEditing]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-pvs border border-line bg-white shadow-card">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
          <h2 className="font-serif text-[18px] font-bold text-brand-900">
            {isEditing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            </div>
          ) : (
            <UserForm
              initialValues={initialData ?? undefined}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
