import Image from "next/image";
import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import { wedding } from "@/lib/wedding";

export function HeroSection() {
  return (
    <section id="hero" className="relative">
      <nav aria-label="Điều hướng thiệp cưới" className="section-shell flex items-center justify-between gap-3 border-b border-gold/25 py-5 md:py-6">
        <a href="#hero" aria-label="Hoàng Long và Hà Thanh — về đầu trang" className="flex items-center gap-2 font-heading text-2xl text-charcoal">
          L <Heart aria-hidden="true" className="h-3.5 w-3.5 text-gold" /> T
        </a>
        <div className="flex items-center gap-4 text-[11px] font-medium text-charcoal/75 sm:gap-8 sm:text-sm">
          <a className="nav-link" href="#wedding-info">Lễ cưới</a>
          <a className="nav-link" href="#gallery">Ảnh cưới</a>
          <a className="nav-link" href="#guestbook">Lời chúc</a>
          <a className="nav-link hidden sm:inline-flex" href="#gifts">Mừng cưới</a>
        </div>
      </nav>
      <div className="section-shell grid items-center gap-10 pb-12 pt-12 md:min-h-[760px] md:grid-cols-[1.1fr_1fr] md:gap-12 md:py-16 lg:gap-20">
        <div className="text-center md:text-left">
          <p className="eyebrow">Trân trọng báo tin vui</p>
          <h1 className="mt-7 font-heading text-[clamp(3.1rem,6.5vw,6.5rem)] leading-[1.18] tracking-[-0.045em]">
            {wedding.groom}
            <span className="my-1 block font-heading text-[0.6em] italic text-gold">&</span>
            {wedding.bride}
          </h1>
          <p className="mt-7 text-base font-medium tracking-[0.18em] text-charcoal/80 sm:text-lg">{wedding.dates}</p>
          <div className="mx-auto my-7 h-px w-16 bg-gold/60 md:mx-0" />
          <p className="mx-auto max-w-sm text-sm leading-7 text-charcoal/70 md:mx-0 md:text-base">
            Từ hôm nay, mỗi chặng đường đều có nhau.<br />
            Mời bạn đến, cùng chúng mình viết nên<br className="hidden sm:block" /> một ngày thật nhiều yêu thương.
          </p>
          <a href="#wedding-info" className="action-button mt-8 inline-flex">
            Cùng chung vui <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-[460px] px-3 pb-6 md:max-w-none">
          <div className="absolute inset-x-0 bottom-3 top-4 rounded-t-[48%] border border-gold/50" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[48%] bg-champagne">
            <Image src="/media/images/LMC_0129.webp" alt="Hoàng Long và Hà Thanh rạng rỡ bên nhau trong bộ ảnh cưới" fill priority sizes="(min-width: 1200px) 480px, (min-width: 768px) 45vw, 90vw" className="object-cover" />
          </div>
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap border border-gold/25 bg-ivory px-6 py-3 text-xs tracking-[0.16em]">
            <span>28 · 29</span><Heart aria-hidden="true" className="h-3.5 w-3.5 text-gold" /><span>11 · 2026</span>
          </div>
        </div>
      </div>
      <a href="#countdown" className="mx-auto flex w-fit items-center gap-3 pb-8 text-[10px] uppercase tracking-[0.24em] text-charcoal/60">
        Hẹn bạn trong ngày hạnh phúc <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
      </a>
    </section>
  );
}
