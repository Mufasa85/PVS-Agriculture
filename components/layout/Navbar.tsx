"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import BrandBadge from "@/components/layout/BrandBadge";
import { brand, navCta, navLinks, primaryNavLinks, servicesLinks } from "@/lib/content";
import {
  CattleIcon,
  ChevronDownIcon,
  FeedBagIcon,
  FishIcon,
  PigIcon,
  SproutIcon,
} from "@/components/ui/icons";

const serviceIcons: Record<string, typeof SproutIcon> = {
  sprout: SproutIcon,
  cattle: CattleIcon,
  fish: FishIcon,
  pig: PigIcon,
  feedbag: FeedBagIcon,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openServices = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setServicesOpen(true);
  };

  const scheduleCloseServices = () => {
    closeTimeout.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] border-b bg-white/[0.88] backdrop-blur-[14px] transition-[border-color,box-shadow] duration-300 ${
          scrolled ? "border-line shadow-header" : "border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-shell items-center justify-between px-7 py-4">
          <Link href={brand.homeHref} className="flex items-center gap-3">
            <BrandBadge />
            <span className="block">
              <span className="block font-serif text-[19px] font-bold leading-[1.1] text-brand-900">
                {brand.name}
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                {brand.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-[34px] nav:flex">
            <Link
              href={primaryNavLinks[0].href}
              className="group relative py-1.5 text-[14.5px] font-semibold text-ink-700 transition-colors hover:text-brand-700"
            >
              {primaryNavLinks[0].label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-500 transition-[width] duration-300 ease-pvs group-hover:w-full" />
            </Link>

            {/* ── Dropdown Services ── */}
            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((open) => !open)}
                aria-expanded={servicesOpen}
                className="group relative flex items-center gap-1.5 py-1.5 text-[14.5px] font-semibold text-ink-700 transition-colors hover:text-brand-700"
              >
                Services
                <ChevronDownIcon
                  size={15}
                  className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                />
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-500 transition-[width] duration-300 ease-pvs group-hover:w-full" />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18, ease: [0.16, 0.8, 0.24, 1] }}
                    className="absolute left-1/2 top-full z-[1100] mt-3 w-[560px] -translate-x-1/2 rounded-pvs-lg border border-line bg-white p-3 shadow-float"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {servicesLinks.map((service) => {
                        const Icon = serviceIcons[service.icon] ?? SproutIcon;
                        return (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setServicesOpen(false)}
                            className="flex items-start gap-3 rounded-[12px] p-3 transition-colors duration-200 hover:bg-brand-50"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-100 text-brand-700">
                              <Icon size={19} />
                            </span>
                            <span className="block">
                              <span className="block text-[14px] font-bold text-brand-900">
                                {service.label}
                              </span>
                              <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-ink-500">
                                {service.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {primaryNavLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-1.5 text-[14.5px] font-semibold text-ink-700 transition-colors hover:text-brand-700"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold-500 transition-[width] duration-300 ease-pvs group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href={navCta.href} className="btn btn-primary hidden nav:inline-flex">
              {navCta.label}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className="relative z-[1100] flex w-[26px] flex-col gap-[5px] nav:hidden"
            >
              <span
                className={`h-0.5 w-full rounded-sm bg-brand-900 transition-transform duration-300 ease-pvs ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-sm bg-brand-900 transition-opacity duration-300 ease-pvs ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-sm bg-brand-900 transition-transform duration-300 ease-pvs ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 0.8, 0.24, 1] }}
            className="fixed inset-0 z-[1050] flex flex-col justify-center overflow-y-auto bg-white p-10 nav:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line py-[1px] font-serif text-[28px] font-semibold text-brand-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={navCta.href}
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary mt-[26px] w-fit"
            >
              {navCta.label}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

