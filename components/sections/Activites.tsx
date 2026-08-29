import Link from "next/link";

import ActivitiesCarousel from "@/components/sections/ActivitiesCarousel";
import ActivityCard from "@/components/sections/ActivityCard";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import {
  CattleIcon,
  FeedBagIcon,
  FishIcon,
  PigIcon,
  SproutIcon,
} from "@/components/ui/icons";
import { activities, activitesSection, ctaBanner } from "@/lib/content";

const iconBySlug = {
  agriculture: SproutIcon,
  elevage: CattleIcon,
  pisciculture: FishIcon,
  porcherie: PigIcon,
  produits: FeedBagIcon,
} as const;

/**
 * La maquette pose les ancres de navigation sur le corps de certaines cartes
 * (#elevage, #pisciculture, #produits) — #agriculture vit sur la section dédiée.
 */
const anchorBySlug: Record<string, string | undefined> = {
  elevage: "elevage",
  pisciculture: "pisciculture",
  produits: "produits",
};

export default function Activites() {
  return (
    <section id="activites" className="bg-white py-[76px] nav:py-[110px]">
      <div className="shell">
        <Reveal>
          <SectionHead
            eyebrow={activitesSection.eyebrow}
            title={activitesSection.title}
            subtitle={activitesSection.subtitle}
            center
          />
        </Reveal>

        {/* 5 activités + la carte CTA finale, comme dans la maquette */}
        <ActivitiesCarousel count={activities.length + 1}>
          {activities.map((activity, index) => (
            <Reveal
              key={activity.slug}
              delay={(index % 3) * 0.08}
              className="flex shrink-0 basis-[88%] flex-col mid:basis-[82%] cards:basis-auto"
            >
              <ActivityCard
                activity={activity}
                anchorId={anchorBySlug[activity.slug]}
                icon={
                  iconBySlug[activity.slug as keyof typeof iconBySlug] ??
                  SproutIcon
                }
              />
            </Reveal>
          ))}

          <Reveal
            delay={0.16}
            className="flex shrink-0 basis-[88%] flex-col mid:basis-[82%] cards:basis-auto"
          >
            <div className="flex h-full flex-col justify-center rounded-pvs-lg border border-line bg-white px-[30px] py-10">
              <span className="eyebrow mb-3">{ctaBanner.eyebrow}</span>
              <h3 className="mb-3 text-xl">{ctaBanner.title}</h3>
              <p className="mb-[22px] text-[14.5px] text-ink-500">
                {ctaBanner.text}
              </p>
              <Link
                href={ctaBanner.cta.href}
                className="btn btn-primary btn-sm w-fit"
              >
                {ctaBanner.cta.label}
              </Link>
            </div>
          </Reveal>
        </ActivitiesCarousel>
      </div>
    </section>
  );
}
