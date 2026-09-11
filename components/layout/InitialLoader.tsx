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
  // Toujours `false` au rendu initial (serveur ET premier rendu client) pour
  // éviter tout écart d'hydratation : `sessionStorage` n'existe pas côté serveur.
  const [visible, setVisible] = useState(false);

  // Effet 1 : décide, une seule fois par session, s'il faut révéler le splash.
  // Idempotent — si React le rejoue (Strict Mode, dev), le drapeau déjà posé
  // empêche juste un second appel superflu, sans rien casser.
  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec sessionStorage, indisponible en SSR
    setVisible(true);
  }, []);

  // Effet 2 : programme la disparition. Dépend uniquement de l'état React
  // `visible` (pas d'un drapeau externe à usage unique), donc même rejoué
  // deux fois par Strict Mode, il annule/reprogramme correctement le timer
  // au lieu de le perdre.
  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setVisible(false), SPLASH_DURATION);
    return () => window.clearTimeout(timeout);
  }, [visible]);

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
