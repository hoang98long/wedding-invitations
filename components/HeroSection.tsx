"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, CalendarDays, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fadeUp, smoothTransition, staggerContainer } from "@/lib/animations";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 13) % 84)}%`,
  delay: index * 0.35,
  duration: 5 + (index % 5)
}));

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal px-4 py-24 text-white"
    >
      <Image
        src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=2200&q=85"
        alt="Romantic wedding couple"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/42 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.34)_68%)]" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-champagne/70"
          style={{ left: particle.left, bottom: "-2rem" }}
          animate={{ y: ["0vh", "-108vh"], opacity: [0, 0.8, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          transition={smoothTransition}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.38em] text-champagne"
        >
          Wedding Day
        </motion.p>
        <motion.h1
          variants={fadeUp}
          transition={smoothTransition}
          className="font-heading text-6xl leading-[0.95] md:text-8xl lg:text-9xl"
        >
          Hoàng Long
          <span className="mx-auto my-4 block font-body text-3xl font-light text-gold md:text-5xl">
            &
          </span>
          Hà Thanh
        </motion.h1>
        <motion.p
          variants={fadeUp}
          transition={smoothTransition}
          className="mt-7 text-lg tracking-[0.24em] text-white/88 md:text-xl"
        >
          29 November 2026
        </motion.p>
        <motion.div
          variants={fadeUp}
          transition={smoothTransition}
          className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
        >
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <a href="#wedding-info">
              <CalendarDays className="h-4 w-4" />
              Xem thông tin
            </a>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href="#rsvp">
              <Send className="h-4 w-4" />
              RSVP ngay
            </a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.a
        href="#countdown"
        aria-label="Scroll to countdown"
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/80"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-8 w-8" />
      </motion.a>
    </section>
  );
}
