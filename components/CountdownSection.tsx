"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  fadeUp,
  scaleIn,
  smoothTransition,
  staggerContainer,
  viewportOnce
} from "@/lib/animations";

const weddingDate = new Date("2026-11-29T00:00:00+07:00").getTime();

function getTimeLeft() {
  const distance = Math.max(weddingDate - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const items = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Minutes", value: timeLeft.minutes },
      { label: "Seconds", value: timeLeft.seconds }
    ],
    [timeLeft]
  );

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="countdown" className="bg-ivory bg-soft-radial py-20 md:py-28">
      <div className="section-shell">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={smoothTransition}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-gold">
            Save the date
          </p>
          <h2 className="font-heading text-4xl text-charcoal md:text-6xl">
            Counting every moment
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={scaleIn}
              transition={smoothTransition}
              className="rounded-lg border border-white/70 bg-white/50 p-5 text-center shadow-luxe backdrop-blur-xl md:p-8"
            >
              <motion.p
                key={item.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-heading text-4xl text-charcoal md:text-6xl"
              >
                {String(item.value).padStart(2, "0")}
              </motion.p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-charcoal/55">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
