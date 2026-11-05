"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { weddingPhotos } from "@/lib/wedding";

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;
  const active = activeIndex === null ? null : weddingPhotos[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function move(step: number) {
    setActiveIndex(index => index === null ? null : (index + step + weddingPhotos.length) % weddingPhotos.length);
  }

  return (
    <section id="gallery" className="section-space bg-ivory">
      <div className="section-shell">
        <SectionHeading eyebrow="Những khung hình thương nhớ" title="Giữa muôn vàn khoảnh khắc, mình chọn có nhau" subtitle="Mai này khi nhìn lại, điều đẹp nhất trong mỗi khung hình vẫn là nụ cười của người bên cạnh." />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {weddingPhotos.map((photo, index) => (
            <button key={photo.file} type="button" aria-label={`Xem ảnh cưới ${index + 1}: ${photo.alt}`} onClick={() => setActiveIndex(index)} className="group relative block aspect-[3/4] w-full overflow-hidden bg-champagne text-white">
              <Image src={`/media/images/${photo.file}.webp`} alt={photo.alt} fill sizes="(min-width: 1200px) 360px, (min-width: 1024px) 31vw, 47vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035] group-focus-visible:scale-[1.035]" loading="lazy" />
              <span aria-hidden="true" className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-charcoal/30 backdrop-blur-sm sm:bottom-4 sm:right-4"><Expand className="h-3.5 w-3.5" /></span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-charcoal/60">Chạm vào ảnh để ngắm trọn khoảnh khắc.</p>
      </div>
      <dialog ref={dialogRef} aria-label="Album ảnh cưới Hoàng Long và Hà Thanh" onClose={() => setActiveIndex(null)} onClick={event => { if (event.target === event.currentTarget) setActiveIndex(null); }} onKeyDown={event => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }} className="gallery-dialog">
        <button type="button" autoFocus aria-label="Đóng ảnh" onClick={() => setActiveIndex(null)} className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/60 sm:right-6 sm:top-6"><X aria-hidden="true" className="h-6 w-6" /></button>
        {active && <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-3 px-12 py-20 sm:px-20">
          <div className="relative min-h-0 w-full max-w-5xl flex-1">
            <Image src={`/media/images/${active.file}.webp`} alt={active.alt} fill sizes="(min-width: 1200px) 1000px, 90vw" className="object-contain" />
          </div>
          <p className="max-w-xl text-center text-xs leading-6 text-white/80" aria-live="polite">{(activeIndex ?? 0) + 1} / {weddingPhotos.length} · {active.alt}</p>
        </div>}
        <button type="button" aria-label="Ảnh trước" onClick={() => move(-1)} className="absolute left-0 top-1/2 z-10 flex h-14 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/10 sm:left-4"><ChevronLeft aria-hidden="true" className="h-8 w-8" /></button>
        <button type="button" aria-label="Ảnh tiếp theo" onClick={() => move(1)} className="absolute right-0 top-1/2 z-10 flex h-14 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white hover:bg-white/10 sm:right-4"><ChevronRight aria-hidden="true" className="h-8 w-8" /></button>
      </dialog>
    </section>
  );
}
