/**
 * Séparateur « sillon » — élément signature de la maquette.
 * `flipped` reprend le `transform:rotate(180deg)` utilisé en sortie de section.
 */
export default function FurrowDivider({
  flipped = false,
}: {
  flipped?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`block w-full leading-[0] ${flipped ? "rotate-180" : ""}`}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-auto w-full"
      >
        <path
          d="M0 40 C 240 5, 480 75, 720 40 S 1200 5, 1440 40 V90 H0 Z"
          fill="#10154a"
        />
      </svg>
    </div>
  );
}
