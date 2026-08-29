import { brand } from "@/lib/content";

export default function BrandBadge() {
  return (
    <div className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 shadow-brand">
      <span
        aria-hidden="true"
        className="absolute -bottom-1.5 left-[8%] right-[8%] h-[60%] rounded-[50%] bg-white"
      />
      <span className="relative z-[2] -translate-y-2 font-serif text-base font-extrabold text-white">
        {brand.name}
      </span>
    </div>
  );
}
