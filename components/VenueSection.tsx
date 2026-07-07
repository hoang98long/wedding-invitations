"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin } from "lucide-react";

import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fadeUp, smoothTransition, viewportOnce } from "@/lib/animations";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Ph%C3%B2ng%20kh%C3%A1m%20%C4%91a%20khoa%20%C4%90%C3%B4ng%20H%E1%BA%A3i%20T%C3%A2n%20K%E1%BB%B3%20H%E1%BA%A3i%20Ph%C3%B2ng";

export function VenueSection() {
  return (
    <section id="venue" className="bg-ivory py-20 md:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Venue"
          title="Tân Kỳ, Hải Phòng"
          subtitle="Join us at Phòng khám đa khoa Đông Hải, a welcoming location for family and guests."
        />

        <motion.div
          className="grid overflow-hidden rounded-lg border border-gold/20 bg-white shadow-luxe lg:grid-cols-[0.9fr_1.1fr]"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={smoothTransition}
        >
          <Card className="rounded-none border-0 bg-white p-7 shadow-none md:p-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gold/12 text-gold">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-4xl text-charcoal">
              Phòng khám đa khoa Đông Hải
            </h3>
            <p className="mt-5 leading-8 text-charcoal/70">
              Address: Tân Kỳ, Hải Phòng, Việt Nam
            </p>
            <Button asChild className="mt-8">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open Google Maps
              </a>
            </Button>
          </Card>
          <div className="min-h-[360px] bg-champagne">
            <iframe
              title="Phòng khám đa khoa Đông Hải map"
              src="https://www.google.com/maps?q=Ph%C3%B2ng%20kh%C3%A1m%20%C4%91a%20khoa%20%C4%90%C3%B4ng%20H%E1%BA%A3i%20T%C3%A2n%20K%E1%BB%B3%20H%E1%BA%A3i%20Ph%C3%B2ng&output=embed"
              width="100%"
              height="100%"
              className="h-[360px] w-full border-0 lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
