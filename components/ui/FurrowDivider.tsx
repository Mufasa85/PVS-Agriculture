/**
 * Séparateur « sillon » — élément signature de la maquette.
 * `flipped` reprend le `transform:rotate(180deg)` utilisé en sortie de section.
 * Le tracé est dupliqué sur une largeur double puis animé en boucle (drift
 * horizontal) pour donner un effet d'ondulation continue, façon vague.
 */
export default function FurrowDivider({
  flipped = false,
}: {
  flipped?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`block w-full overflow-hidden leading-[0] ${flipped ? "rotate-180" : ""}`}
    >
      <svg
        viewBox="0 0 2880 90"
        preserveAspectRatio="none"
        className="wave-drift block h-auto w-[200%]"
      >
        <path
          d="M0 40 C 240 5, 480 75, 720 40 S 1200 5, 1440 40 V90 H0 Z"
          fill="#10154a"
        />
        <path
          d="M1440 40 C 1680 5, 1920 75, 2160 40 S 2640 5, 2880 40 V90 H1440 Z"
          fill="#10154a"
        />
      </svg>
    </div>
  );
}
