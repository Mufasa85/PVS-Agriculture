import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { pourquoiNousChoisir } from "@/lib/content";

export default function PourquoiNousChoisir() {
  return (
    <section className="bg-white py-[76px] nav:py-[110px]">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={pourquoiNousChoisir.eyebrow}
            title={pourquoiNousChoisir.title}
            center
          />
        </Reveal>

        <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3 wide:grid-cols-5">
          {pourquoiNousChoisir.items.map((item, index) => (
            <Reveal
              key={item.tag}
              as="li"
              delay={index * 0.08}
              className="rounded-pvs border border-line px-[22px] py-8 text-left transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:bg-brand-50 hover:shadow-card"
            >
              <span className="mb-[18px] block font-serif text-[15px] font-bold text-gold-600">
                {item.tag}
              </span>
              <h4 className="mb-2 text-[16.5px]">{item.title}</h4>
              <p className="text-[13.5px] text-ink-500">{item.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
