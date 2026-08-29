import type { ReactNode } from "react";

/** Équivalent de `.section-head` / `.section-head.center` de la maquette. */
export default function SectionHead({
  eyebrow,
  title,
  subtitle,
  center = false,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`mb-14 max-w-[640px] ${center ? "mx-auto text-center" : ""} ${
        className ?? ""
      }`}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)]">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-[17px] text-ink-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
