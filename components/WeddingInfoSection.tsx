"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fadeUp,
  smoothTransition,
  staggerContainer,
  viewportOnce
} from "@/lib/animations";

const details = [
  { icon: Calendar, label: "Date", value: "28 November 2027" },
  { icon: Clock, label: "Time", value: "09:00 AM" },
  { icon: MapPin, label: "Location", value: "Tân Kỳ, Hải Phòng" }
];

export function WeddingInfoSection() {
  return (
    <section id="wedding-info" className="bg-champagne/45 py-20 md:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Wedding information"
          title="Ceremony"
          subtitle="The family ceremony will be held in Tân Kỳ, Hải Phòng with love, gratitude, and blessing."
        />

        <motion.div
          className="grid gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {details.map((detail) => (
            <motion.div
              key={detail.label}
              variants={fadeUp}
              transition={smoothTransition}
            >
              <Card className="h-full bg-ivory/90">
                <CardHeader className="items-center text-center">
                  <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/12 text-gold">
                    <detail.icon className="h-5 w-5" />
                  </span>
                  <CardTitle>{detail.label}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-charcoal/72">{detail.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
