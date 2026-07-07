"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import {
  fadeUp,
  scaleIn,
  smoothTransition,
  staggerContainer,
  viewportOnce
} from "@/lib/animations";

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden bg-charcoal px-4 py-24 text-center text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,106,0.22),transparent_34rem)]" />
      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        <motion.div
          variants={scaleIn}
          transition={smoothTransition}
          className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold/45 text-gold"
          animate={{ scale: [1, 1.08, 1] }}
        >
          <Heart className="h-6 w-6 fill-current" />
        </motion.div>
        <motion.h2
          variants={fadeUp}
          transition={smoothTransition}
          className="font-heading text-5xl leading-tight md:text-7xl"
        >
          Thank you for celebrating with us
        </motion.h2>
        <motion.p
          variants={fadeUp}
          transition={smoothTransition}
          className="mt-8 font-heading text-3xl text-gold md:text-5xl"
        >
          Hoàng Long & Hà Thanh
        </motion.p>
      </motion.div>
    </footer>
  );
}
