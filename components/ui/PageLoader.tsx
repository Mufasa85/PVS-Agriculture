"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { type JSX, useEffect, useState } from "react";

/**
 * Loader animé "de la graine à la récolte" : une même main dessine
 * successivement une plante qui grandit, un porc, une poule, une vache
 * puis une feuille, en boucle — un raccourci visuel des activités de
 * PVS ONGD ASBL, dans un style croquis (traits qui se tracent en direct).
 */

type StageKey = "plant" | "pig" | "chicken" | "cow" | "leaf";

const STAGE_ORDER: StageKey[] = ["plant", "pig", "chicken", "cow", "leaf"];

const STAGE_CAPTIONS: Record<StageKey, string> = {
  plant: "De la graine…",
  pig: "…à la porcherie…",
  chicken: "…à la basse-cour…",
  cow: "…à l'élevage bovin…",
  leaf: "…jusqu'à la récolte.",
};

const STAGE_DURATION = 2400;

const groupVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.04 },
  },
};

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
  },
};

const dotVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const sceneStrokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Ground() {
  return (
    <motion.line
      x1="26"
      y1="172"
      x2="174"
      y2="172"
      variants={drawVariants}
      className="text-brand-100"
      {...sceneStrokeProps}
      strokeWidth={3}
    />
  );
}

function PlantScene() {
  return (
    <>
      <Ground />
      <motion.path
        d="M100 172 C100 150 98 118 100 92"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M100 142 C 80 140 62 124 58 106 C 80 108 98 120 100 142 Z"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M100 118 C120 116 138 100 142 82 C120 84 102 96 100 118 Z"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.circle
        cx="100"
        cy="88"
        r="8"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
      <motion.circle cx="100" cy="88" r="2" variants={dotVariants} className="fill-gold-500 text-gold-500" />
    </>
  );
}

function PigScene() {
  return (
    <>
      <Ground />
      <motion.path
        d="M46 130 C42 104 66 84 106 84 C140 84 160 100 162 122 C164 140 150 152 130 152 L70 152 C54 150 48 142 46 130 Z"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M66 90 L54 72 L80 84 Z"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.rect
        x="150"
        y="108"
        width="22"
        height="18"
        rx="8"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M50 108 C40 100 42 88 52 86"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      {[74, 96, 118, 140].map((x) => (
        <motion.line
          key={x}
          x1={x}
          y1="150"
          x2={x}
          y2="170"
          variants={drawVariants}
          className="text-brand-700"
          {...sceneStrokeProps}
          strokeWidth={4}
        />
      ))}
      <motion.circle cx="158" cy="116" r="1.6" variants={dotVariants} className="fill-brand-900 text-brand-900" />
      <motion.circle cx="166" cy="116" r="1.6" variants={dotVariants} className="fill-brand-900 text-brand-900" />
      <motion.circle cx="132" cy="102" r="2.2" variants={dotVariants} className="fill-brand-900 text-brand-900" />
    </>
  );
}

function ChickenScene() {
  return (
    <>
      <Ground />
      <motion.ellipse
        cx="96"
        cy="126"
        rx="38"
        ry="30"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.circle
        cx="144"
        cy="94"
        r="16"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M134 80 L138 70 L142 80 L146 68 L150 80"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M160 94 L174 90 L160 100 Z"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M64 106 C40 94 34 74 44 58"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M68 118 C46 112 34 96 40 82"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      <motion.line
        x1="88"
        y1="154"
        x2="86"
        y2="172"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.line
        x1="108"
        y1="154"
        x2="110"
        y2="172"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.circle cx="148" cy="90" r="2" variants={dotVariants} className="fill-brand-900 text-brand-900" />
    </>
  );
}

function CowScene() {
  return (
    <>
      <Ground />
      <motion.path
        d="M52 108 C52 92 66 82 86 82 L146 82 C164 82 176 96 176 112 L176 134 C176 146 166 154 152 154 L70 154 C56 154 48 146 48 134 Z"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.ellipse
        cx="34"
        cy="112"
        rx="20"
        ry="18"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M22 94 C18 86 22 78 30 76"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M36 94 C40 86 38 78 32 76"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M90 100 C100 96 110 102 106 112 C98 116 88 110 90 100 Z"
        variants={drawVariants}
        className="text-brand-300"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M132 120 C140 116 148 122 144 130 C136 134 128 128 132 120 Z"
        variants={drawVariants}
        className="text-brand-300"
        {...sceneStrokeProps}
      />
      <motion.path
        d="M170 132 C180 142 182 156 174 166"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
      />
      {[68, 90, 132, 154].map((x) => (
        <motion.line
          key={x}
          x1={x}
          y1="152"
          x2={x}
          y2="172"
          variants={drawVariants}
          className="text-brand-700"
          {...sceneStrokeProps}
          strokeWidth={4}
        />
      ))}
      <motion.circle cx="26" cy="108" r="2" variants={dotVariants} className="fill-brand-900 text-brand-900" />
    </>
  );
}

function LeafScene() {
  return (
    <>
      <Ground />
      <motion.path
        d="M100 40 C142 50 162 92 150 132 C140 162 112 172 100 172 C88 172 60 162 50 132 C38 92 58 50 100 40 Z"
        variants={drawVariants}
        className="text-brand-700"
        {...sceneStrokeProps}
      />
      <motion.line
        x1="100"
        y1="50"
        x2="100"
        y2="168"
        variants={drawVariants}
        className="text-brand-600"
        {...sceneStrokeProps}
        strokeWidth={3}
      />
      {[
        [100, 75, 72, 60],
        [100, 75, 128, 60],
        [100, 108, 66, 96],
        [100, 108, 134, 96],
        [100, 138, 74, 132],
        [100, 138, 126, 132],
      ].map(([x1, y1, x2, y2], i) => (
        <motion.line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          variants={drawVariants}
          className="text-brand-600"
          {...sceneStrokeProps}
          strokeWidth={2.5}
        />
      ))}
      <motion.line
        x1="100"
        y1="172"
        x2="100"
        y2="186"
        variants={drawVariants}
        className="text-gold-500"
        {...sceneStrokeProps}
      />
    </>
  );
}

const SCENES: Record<StageKey, () => JSX.Element> = {
  plant: PlantScene,
  pig: PigScene,
  chicken: ChickenScene,
  cow: CowScene,
  leaf: LeafScene,
};

export default function PageLoader({
  fullScreen = false,
  compact = false,
  showCaption = true,
  caption,
  className,
}: {
  fullScreen?: boolean;
  /** Version réduite, pensée pour être incrustée dans une carte ou un formulaire. */
  compact?: boolean;
  /** Masque la légende narrative et les puces d'étapes (utile si l'appelant affiche son propre texte). */
  showCaption?: boolean;
  /** Remplace la légende narrative par un texte fixe (ex: "Envoi de votre message…"). */
  caption?: string;
  className?: string;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStageIndex((i) => (i + 1) % STAGE_ORDER.length);
    }, STAGE_DURATION);
    return () => window.clearInterval(interval);
  }, []);

  const stageKey = STAGE_ORDER[stageIndex];
  const Scene = SCENES[stageKey];
  const sizeClass = compact
    ? "h-[76px] w-[76px]"
    : "h-[132px] w-[132px] nav:h-[160px] nav:w-[160px]";

  const content = (
    <div className={`flex flex-col items-center gap-6 ${className ?? ""}`}>
      <div className={`relative ${sizeClass}`}>
        <AnimatePresence mode="wait">
          <motion.svg
            key={stageKey}
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full"
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86, transition: { duration: 0.28 } }}
            transition={reduceMotion ? { duration: 0 } : undefined}
          >
            <Scene />
          </motion.svg>
        </AnimatePresence>
      </div>

      {showCaption && (
        <div className="flex flex-col items-center gap-3 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={caption ?? stageKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-[15px] font-semibold text-brand-900 nav:text-[16px]"
            >
              {caption ?? STAGE_CAPTIONS[stageKey]}
            </motion.p>
          </AnimatePresence>

          <div className="flex items-center gap-1.5" role="status" aria-label="Chargement en cours">
            {STAGE_ORDER.map((key) => (
              <span
                key={key}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  key === stageKey ? "bg-gold-500" : "bg-brand-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!fullScreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      {content}
    </div>
  );
}
