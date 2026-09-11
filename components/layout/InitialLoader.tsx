"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import PageLoader from "@/components/ui/PageLoader";

const SESSION_KEY = "pvs-splash-shown";
const SPLASH_DURATION = 2600;

/**
 * Splash de marque affiché une seule fois par session, au premier
 * chargement complet du site (première visite ou rechargement de page).
 * Les navigations internes suivantes s'appuient sur `app/loading.tsx`,
 * qui ne s'affiche que lorsqu'une page met réellement du temps à charger.
 */
export default function InitialLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with sessionStorage, a browser-only API unavailable during SSR
    setVisible(true);
    window.sessionStorage.setItem(SESSION_KEY, "1");

    const timeout = window.setTimeout(() => setVisible(false), SPLASH_DURATION);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <PageLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
