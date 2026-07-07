"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  fadeUp,
  smoothTransition,
  viewportOnce
} from "@/lib/animations";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  guests: z.coerce.number().min(1, "Please enter at least 1 guest.").max(10),
  attendance: z.enum(["attending", "not-attending"], {
    required_error: "Please confirm your attendance."
  })
});

type RSVPForm = z.infer<typeof schema>;

export function RSVPSection() {
  const [submitted, setSubmitted] = useState<RSVPForm | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RSVPForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      guests: 1,
      attendance: "attending"
    }
  });

  function onSubmit(values: RSVPForm) {
    setSubmitted(values);
    reset(values);
  }

  return (
    <section id="rsvp" className="bg-champagne/45 py-20 md:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="RSVP"
          title="Kindly reply"
          subtitle="Your response helps the families prepare a warm and seamless celebration."
        />

        <motion.div
          className="mx-auto max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={smoothTransition}
        >
          {submitted ? (
            <Card className="bg-ivory p-8 text-center md:p-12">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="font-heading text-4xl text-charcoal">
                Thank you, {submitted.fullName}
              </h3>
              <p className="mx-auto mt-5 max-w-md leading-7 text-charcoal/68">
                Your RSVP has been saved for this session. We are grateful to
                celebrate this day with you.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="mt-7"
                onClick={() => setSubmitted(null)}
              >
                Update response
              </Button>
            </Card>
          ) : (
            <Card className="bg-ivory p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      {...register("fullName")}
                    />
                    {errors.fullName ? (
                      <p className="text-sm text-red-700">
                        {errors.fullName.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      inputMode="tel"
                      placeholder="0900000000"
                      {...register("phone")}
                    />
                    {errors.phone ? (
                      <p className="text-sm text-red-700">
                        {errors.phone.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    min={1}
                    max={10}
                    {...register("guests")}
                  />
                  {errors.guests ? (
                    <p className="text-sm text-red-700">
                      {errors.guests.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label>Attendance Confirmation</Label>
                  <Controller
                    control={control}
                    name="attendance"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        <Label className="flex cursor-pointer items-center gap-3 rounded-md border border-gold/25 bg-white/70 p-4">
                          <RadioGroupItem value="attending" />
                          Attending
                        </Label>
                        <Label className="flex cursor-pointer items-center gap-3 rounded-md border border-gold/25 bg-white/70 p-4">
                          <RadioGroupItem value="not-attending" />
                          Not Attending
                        </Label>
                      </RadioGroup>
                    )}
                  />
                  {errors.attendance ? (
                    <p className="text-sm text-red-700">
                      {errors.attendance.message}
                    </p>
                  ) : null}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  Send RSVP
                </Button>
              </form>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
}
