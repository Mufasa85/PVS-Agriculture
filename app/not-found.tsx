import Link from "next/link";

import Footer from "@/components/layout/Footer";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div
          aria-hidden="true"
          className="hero-blob absolute -top-[10%] left-1/2 z-0 h-[400px] w-[400px] -translate-x-1/2 bg-brand-600 opacity-[0.07]"
        />

        <div className="shell relative z-[1] py-[120px] text-center">
          <p className="font-serif text-[clamp(80px,18vw,180px)] font-bold leading-none text-brand-900">
            4<span className="text-gold-500">0</span>4
          </p>

          <h1 className="mt-6 text-[clamp(24px,3.5vw,36px)]">
            Oups, cette page n'existe pas
          </h1>

          <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.7] text-ink-500">
            La page que vous recherchez a peut-être été déplacée, supprimée, ou
            n'a jamais existé. Pas d'inquiétude — retrouvez ci-dessous nos
            principales activités.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
            <Link
              href="/contact"
              className="btn border-[1.5px] border-brand-200 bg-white text-brand-900 hover:border-brand-300 hover:bg-brand-50"
            >
              Nous contacter
            </Link>
          </div>

          <ul className="mx-auto mt-14 flex max-w-[600px] flex-wrap justify-center gap-3">
            {[
              { label: "Agriculture", href: "/agriculture" },
              { label: "Élevage", href: "/elevage" },
              { label: "Pisciculture", href: "/pisciculture" },
              { label: "Porcherie", href: "/porcherie" },
              { label: "Produits pour animaux", href: "/produits-animaux" },
              { label: "Nos tarifs", href: "/tarifs" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-[18px] py-3 text-[13.5px] font-bold text-brand-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                >
                  {link.label}
                  <ArrowRightIcon
                    size={14}
                    className="text-gold-500 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
}
