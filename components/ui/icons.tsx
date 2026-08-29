/**
 * Icônes SVG reprises trait pour trait de la maquette (index.html).
 * Les couleurs codées en dur d'origine (#dfa62e, #fff) sont remplacées par
 * `currentColor` : la teinte est pilotée par la classe `text-*` du parent.
 */

type IconProps = {
  size?: number;
  className?: string;
};

function svgProps({ size = 18, className }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    className,
    "aria-hidden": true as const,
  };
}

/* ---------- Points du bloc Agriculture ---------- */

export function BarnIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M4 20h16M6 20V10l6-6 6 6v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M12 2v20M12 2c-4 3-6 7-6 11s2 6 6 6M12 2c4 3 6 7 6 11s-2 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect
        x="3"
        y="9"
        width="18"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M7 9V6a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CycleIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 12a4 4 0 004 4M12 8a4 4 0 014 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LinesIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Cartes Activités ---------- */

export function SproutIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function CattleIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M4 10c0-2 2-4 4-4s3 1 4 1 2-1 4-1 4 2 4 4-2 3-2 5v3a2 2 0 01-2 2H8a2 2 0 01-2-2v-3c0-2-2-3-2-5z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function FishIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M3 12c3-4 7-6 12-6 3 0 5 2 6 4-1 2-3 4-6 4-5 0-9-2-12-6z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="17" cy="10" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function PigIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <ellipse
        cx="12"
        cy="13"
        rx="8"
        ry="6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="9" cy="12" r="0.8" fill="currentColor" />
      <circle cx="15" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function FeedBagIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M6 3h12l2 6H4l2-6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 9l1 12h14l1-12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- Contact ---------- */

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.5 2.1L8 9.7a16 16 0 006.3 6.3l1.2-1.2a2 2 0 012.1-.5c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function WhatsAppOutlineIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.2-.7 1-.9 1.2-.4.2-.7.1a8.2 8.2 0 01-4.2-3.7c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5L9 6.7c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1a5.5 5.5 0 003.4.7c.9-.1 1.8-.8 2.1-1.5.2-.7.2-1.3.1-1.5s-.3-.2-.6-.4z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Réseaux sociaux ---------- */

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V11H8v3h2.5v6h3v-6H16l.5-3h-3V9.7c0-.4.3-.7.7-.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 10v7M7 7.2v.1M11 17v-4.5c0-1.4 1-2.5 2.3-2.5s2.2 1.1 2.2 2.5V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
