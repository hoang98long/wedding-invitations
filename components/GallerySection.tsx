"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import {
  scaleIn,
  smoothTransition,
  staggerContainer,
  viewportOnce
} from "@/lib/animations";
import { Button } from "@/components/ui/button";

const images = [
  "photo-1522673607200-164d1b6ce486",
  "photo-1519741497674-611481863552",
  "photo-1511285560929-80b456fea0bc",
  "photo-1520854221256-17451cc331bf",
  "photo-1509610973147-232dfea52a97",
  "photo-1532712938310-34cb3982ef74",
  "photo-1469371670807-013ccf25f16a",
  "photo-1529634806980-85c3dd6d34ac"
].map((id, index) => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=80`,
  alt: `Wedding gallery moment ${index + 1}`,
  tall: index === 1 || index === 4 || index === 6
}));

export function GallerySection() {
  const [active, setActive] = useState<(typeof images)[number] | null>(null);

  return (
    <section id="gallery" className="bg-ivory py-20 md:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments in champagne light"
          subtitle="A curated glimpse into the romance, tenderness, and quiet joy surrounding the celebration."
        />

        <motion.div
          className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {images.map((image) => (
            <motion.button
              key={image.src}
              type="button"
              aria-label={`Open ${image.alt}`}
              onClick={() => setActive(image)}
              variants={scaleIn}
              transition={smoothTransition}
              className="group mb-4 block w-full overflow-hidden rounded-lg bg-champagne shadow-luxe"
            >
              <span className="relative block w-full" style={{ height: image.tall ? 470 : 320 }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-charcoal/0 transition duration-500 group-hover:bg-charcoal/18" />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/88 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <Button
              type="button"
              aria-label="Close gallery preview"
              variant="outline"
              size="sm"
              className="absolute right-4 top-4 h-11 w-11 rounded-full p-0"
              onClick={() => setActive(null)}
            >
              <X className="h-5 w-5" />
            </Button>
            <motion.div
              className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
