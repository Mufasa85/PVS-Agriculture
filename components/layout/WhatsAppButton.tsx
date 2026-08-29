import { whatsappHref } from "@/lib/content";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      className="group fixed bottom-[26px] right-[26px] z-[900] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-whatsapp shadow-whatsapp transition-transform duration-300 ease-pvs hover:scale-[1.08]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 animate-wa-pulse rounded-full bg-whatsapp motion-reduce:animate-none"
      />
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.41 1.3-1.94 1.35-.53.05-1.02.24-3.46-.72-2.94-1.16-4.79-4.2-4.94-4.4-.14-.19-1.17-1.55-1.17-2.96 0-1.41.73-2.11 1-2.4.24-.29.53-.36.72-.36.19 0 .39 0 .55.01.19.01.44-.07.68.53.24.58.83 2.01.9 2.16.07.15.12.32.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.14-.3.3-.13.6.17.29.75 1.24 1.6 2 1.1.98 2.03 1.29 2.32 1.43.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.72-.17 1.4z" />
      </svg>
    </a>
  );
}
