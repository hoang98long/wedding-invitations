import { Heart } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="section-backdrop section-backdrop--forest px-5 pb-24 pt-16 text-center text-ivory md:py-24">
      <Heart aria-hidden="true" className="mx-auto mb-7 h-6 w-6 text-gold" strokeWidth={1.2} />
      <p className="font-heading text-3xl leading-snug sm:text-5xl">Cảm ơn vì đã là một phần<br />trong ngày hạnh phúc của chúng mình.</p>
      <p className="mt-7 font-heading text-xl text-champagne sm:text-3xl">Hoàng Long & Hà Thanh</p>
      <p className="mt-5 text-xs tracking-[0.2em] text-ivory/65">28, 29-11-2026 · Hải Phòng</p>
    </footer>
  );
}
