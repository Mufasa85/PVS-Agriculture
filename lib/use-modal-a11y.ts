"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessibilité modale : focus le premier élément interactif à l'ouverture,
 * piège Tab/Shift+Tab dans le panneau, restaure le focus à la fermeture.
 * À combiner avec role="dialog" aria-modal="true" sur le panneau.
 */
export function useModalA11y(open: boolean) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const items = Array.from(panel!.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", handleTab);
    return () => {
      panel.removeEventListener("keydown", handleTab);
      previouslyFocused?.focus();
    };
  }, [open]);

  return panelRef;
}
