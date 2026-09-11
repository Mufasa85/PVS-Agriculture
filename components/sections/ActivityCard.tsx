import Image from "next/image";
import Link from "next/link";

import { CategoryIcon } from "@/components/admin/CategoryIcon";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { Activity } from "@/lib/types";

/**
 * `id` optionnel : la maquette pose les ancres #elevage / #pisciculture /
 * #produits sur le corps de la carte correspondante.
 */
export default function ActivityCard({
  activity,
  anchorId,
  icon,
}: {
  activity: Activity;
  anchorId?: string;
  icon: string;
}) {
  return (
    <article className="group flex shrink-0 snap-center basis-[88%] flex-col overflow-hidden rounded-pvs-lg border border-line bg-white transition-all duration-[400ms] ease-pvs hover:-translate-y-2 hover:border-transparent hover:shadow-float mid:basis-[82%] cards:basis-auto">
      <div className="relative aspect-[16/11] overflow-hidden bg-brand-100">
        <Image
          src={activity.imageSrc}
          alt={activity.imageAlt}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1080px) 45vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-pvs group-hover:scale-[1.08]"
        />
        <span className="absolute -bottom-6 left-[22px] z-[2] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-brand-600 text-white shadow-[0_8px_20px_rgba(58,69,196,0.4)]">
          <CategoryIcon icon={icon} size={22} />
        </span>
      </div>

      <div id={anchorId} className="px-[26px] pb-7 pt-10">
        <h3 className="mb-2.5 text-xl">{activity.title}</h3>
        <p className="mb-5 text-[14.5px] text-ink-500">
          {activity.description}
        </p>
        <Link
          href={activity.href}
          className="group/link inline-flex items-center gap-2 text-sm font-bold text-brand-600"
        >
          En savoir plus
          <span className="transition-transform duration-300 ease-pvs group-hover/link:translate-x-[5px]">
            <ArrowRightIcon size={16} />
          </span>
        </Link>
      </div>
    </article>
  );
}
