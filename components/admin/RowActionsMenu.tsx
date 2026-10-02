"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import ConfirmDialog from "@/components/admin/ConfirmDialog";

type RowActionVariant = "default" | "danger";

export type RowAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  confirm?: {
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  };
  variant?: RowActionVariant;
  href?: string;
};

export default function RowActionsMenu({
  actions,
  label = "Actions de la ligne",
}: {
  actions: RowAction[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<RowAction | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  function handleAction(action: RowAction) {
    if (action.href) return;
    setOpen(false);
    if (action.confirm) {
      setPendingConfirm(action);
      return;
    }
    action.onClick?.();
  }

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={label}
          title="Actions"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line bg-white text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
        >
          <MoreHorizontal size={15} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              role="menu"
              aria-label={label}
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.16, 0.8, 0.24, 1] }}
              className="absolute right-0 top-full z-[1200] mt-2 w-[200px] origin-top-right overflow-hidden rounded-[12px] border border-line bg-white shadow-float"
            >
              <ul className="flex flex-col py-1">
                {actions.map((action) => {
                  const isDanger = action.variant === "danger";
                  const itemClass = `flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] font-medium transition-colors ${
                    isDanger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                  }`;

                  const iconEl = isValidElement(action.icon)
                    ? cloneElement(
                        action.icon as ReactElement<{ size?: number }>,
                        { size: 15 },
                      )
                    : action.icon;

                  const content = (
                    <>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] ${
                          isDanger
                            ? "bg-red-50 text-red-500"
                            : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        {iconEl}
                      </span>
                      <span className="truncate">{action.label}</span>
                    </>
                  );

                  if (action.href) {
                    return (
                      <li key={action.key} role="none">
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                          className={itemClass}
                          onClick={() => setOpen(false)}
                        >
                          {content}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={action.key} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleAction(action)}
                        className={itemClass}
                      >
                        {content}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={pendingConfirm !== null}
        title={pendingConfirm?.confirm?.title ?? ""}
        message={pendingConfirm?.confirm?.message ?? ""}
        onCancel={() => setPendingConfirm(null)}
        onConfirm={async () => {
          const action = pendingConfirm;
          setPendingConfirm(null);
          if (action?.confirm) {
            await action.confirm.onConfirm();
          }
        }}
      />
    </>
  );
}

export const rowActionIcons = {
  edit: <Pencil size={15} />,
  duplicate: <Copy size={15} />,
  view: <ExternalLink size={15} />,
  delete: <Trash2 size={15} />,
};