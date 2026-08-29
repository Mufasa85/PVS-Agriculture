import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import { apropos } from "@/lib/content";

const [imageA, imageB] = apropos.images;

export default function APropos() {
  return (
    <section id="apropos" className="bg-brand-50 py-[76px] nav:py-[110px]">
      <div className="shell grid items-center gap-16 nav:grid-cols-[0.9fr_1.1fr]">
        {/* Desktop : deux visuels superposés. Sous 900px : deux colonnes côte à côte. */}
        <Reveal className="mx-auto grid h-auto w-full max-w-[460px] grid-cols-2 items-stretch gap-3.5 nav:relative nav:mx-0 nav:block nav:h-[460px] nav:max-w-none">
          <div className="relative min-h-[170px] overflow-hidden rounded-pvs-lg bg-brand-600 shadow-float mid:min-h-[220px] nav:absolute nav:left-0 nav:top-0 nav:z-[1] nav:h-[82%] nav:w-[78%] nav:min-h-0">
            <Image
              src={imageA.src}
              alt={imageA.alt}
              fill
              sizes="(max-width: 900px) 45vw, 35vw"
              className="object-cover"
            />
          </div>
          <div className="relative min-h-[170px] overflow-hidden rounded-pvs-lg bg-gold-500 shadow-float mid:min-h-[220px] nav:absolute nav:bottom-0 nav:right-0 nav:z-[2] nav:h-[52%] nav:w-[52%] nav:min-h-0 nav:border-[6px] nav:border-white">
            <Image
              src={imageB.src}
              alt={imageB.alt}
              fill
              sizes="(max-width: 900px) 45vw, 20vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <span className="eyebrow">{apropos.eyebrow}</span>
          <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)]">
            {apropos.title}
          </h2>

          {apropos.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mb-[18px] mt-[18px] text-base text-ink-700">
              {paragraph}
            </p>
          ))}

          <ul className="mt-[30px] flex flex-wrap gap-4">
            {apropos.tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-2.5 rounded-full border border-line bg-white px-[18px] py-3 text-[13.5px] font-bold text-brand-900"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
