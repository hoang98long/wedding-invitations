import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = { eyebrow: string; title: string; subtitle?: string; light?: boolean };

export function SectionHeading({ eyebrow, title, subtitle, light }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-2xl text-center md:mb-14", light && "text-white")}>
      <p className={cn("eyebrow", light && "text-champagne")}>{eyebrow}</p>
      <div aria-hidden="true" className="my-5 flex items-center justify-center gap-3 text-gold">
        <span className="gold-divider" /><Heart className="h-3 w-3" /><span className="gold-divider" />
      </div>
      <h2 className="font-heading text-[clamp(2rem,4.3vw,3.6rem)] leading-[1.3] tracking-[-0.025em]">{title}</h2>
      {subtitle && <p className={cn("mx-auto mt-5 max-w-xl text-sm leading-7 text-charcoal/70 md:text-base", light && "text-white/75")}>{subtitle}</p>}
    </div>
  );
}
