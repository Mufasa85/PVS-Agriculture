import Link from "next/link";

import BrandBadge from "@/components/layout/BrandBadge";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/ui/icons";
import { footer } from "@/lib/content";
import type { SocialNetwork } from "@/lib/types";

const socialIcon: Record<
  SocialNetwork,
  (props: { size?: number; className?: string }) => React.JSX.Element
> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
};

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="shell py-[60px]">
        <div className="grid grid-cols-1 gap-10 mid:grid-cols-2 nav:grid-cols-4">
          {/* Colonne marque + description + réseaux sociaux */}
          <div className="mid:col-span-2 nav:col-span-1">
            <div className="flex items-center gap-3">
              <BrandBadge />
              <span className="block">
                <span className="block font-serif text-[19px] font-bold leading-[1.1]">
                  {footer.brandName}
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {footer.brandSubtitle}
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-[340px] text-[14px] leading-[1.6] text-muted">
              {footer.description}
            </p>

            <ul className="mt-6 flex gap-3">
              {footer.socials.map((social) => {
                const Icon = socialIcon[social.network];
                return (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-white transition-all duration-300 ease-pvs hover:-translate-y-1 hover:border-gold-500 hover:text-gold-500"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h5 className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-gold-500">
              {footer.columnTitles.quickLinks}
            </h5>
            <ul className="flex flex-col gap-2.5">
              {footer.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activités */}
          <div>
            <h5 className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-gold-500">
              {footer.columnTitles.activities}
            </h5>
            <ul className="flex flex-col gap-2.5">
              {footer.activityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coordonnées */}
          <div>
            <h5 className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-gold-500">
              {footer.columnTitles.contact}
            </h5>
            <ul className="flex flex-col gap-2.5">
              {footer.contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14px] text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/[0.08]">
        <div className="shell flex flex-col items-center justify-between gap-4 py-6 mid:flex-row">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} {footer.copyright}
          </p>
          <ul className="flex gap-5">
            {footer.legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[13px] text-muted transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
