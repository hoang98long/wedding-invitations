"use client";

import { motion } from "framer-motion";

import { fadeUp, smoothTransition, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn("mx-auto mb-12 max-w-2xl text-center", light && "text-white")}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={smoothTransition}
    >
      <p
        className={cn(
          "mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-gold",
          light && "text-champagne"
        )}
      >
        {eyebrow}
      </p>
      <div className="gold-divider mx-auto mb-5" />
      <h2 className="font-heading text-4xl leading-tight text-charcoal md:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mx-auto mt-5 max-w-xl text-sm leading-7 text-charcoal/70 md:text-base",
            light && "text-white/72"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}
