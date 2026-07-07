"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/SectionHeading";
import {
  fadeLeft,
  fadeRight,
  smoothTransition,
  viewportOnce
} from "@/lib/animations";
import { cn } from "@/lib/utils";

const stories = [
  {
    title: "First Meet",
    date: "A quiet beginning",
    text: "A simple conversation became the first page of a story built on warmth, care, and a shared sense of home."
  },
  {
    title: "First Date",
    date: "The city lights",
    text: "Over dinner and long walks, they discovered the kind of comfort that makes time feel softer."
  },
  {
    title: "Proposal",
    date: "A promise",
    text: "In a moment held close by family and love, Long asked Thanh to begin forever together."
  },
  {
    title: "Wedding Day",
    date: "29 November 2026",
    text: "A celebration of two families, one promise, and a beautiful future waiting ahead."
  }
];

export function StorySection() {
  return (
    <section id="story" className="bg-champagne/45 py-20 md:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Our story"
          title="A love made of little moments"
          subtitle="From first hello to forever, each chapter has carried them closer to this celebration."
        />

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gold/35 md:left-1/2" />
          <div className="space-y-8">
            {stories.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={item.title}
                  className={cn(
                    "relative grid gap-6 pl-12 md:grid-cols-2 md:pl-0",
                    isLeft ? "" : "md:[&>*:first-child]:col-start-2"
                  )}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={isLeft ? fadeRight : fadeLeft}
                  transition={smoothTransition}
                >
                  <span className="absolute left-[11px] top-8 h-3 w-3 rounded-full bg-gold ring-8 ring-champagne md:left-[calc(50%-6px)]" />
                  <div
                    className={cn(
                      "rounded-lg border border-gold/20 bg-ivory p-6 shadow-luxe",
                      isLeft && "md:text-right"
                    )}
                  >
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                      {item.date}
                    </p>
                    <h3 className="font-heading text-3xl text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-charcoal/68">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
