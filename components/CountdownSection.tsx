"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { wedding } from "@/lib/wedding";

const weddingTime = Date.parse(wedding.countdownTo);
function getTimeLeft() {
  const seconds = Math.max(0, Math.floor((weddingTime - Date.now()) / 1000));
  return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

export function CountdownSection() {
  // The server and first client render both show "--". Read the clock only after hydration.
  const [timeLeft, setTimeLeft] = useState<number[] | null>(null);
  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, []);

  const hasStarted = timeLeft !== null && timeLeft.every(value => value === 0);
  return (
    <section id="countdown" className="section-space">
      <div className="section-shell">
        <SectionHeading eyebrow="Đếm ngược đến ngày chung đôi" title={hasStarted ? "Ngày hạnh phúc đã đến" : "Đếm từng khoảnh khắc, chờ ngày có nhau"} subtitle="Hẹn gặp bạn lúc 16h00, ngày 28 tháng 11 năm 2026 — khi niềm vui được sẻ chia và yêu thương thêm trọn vẹn." />
        <div role="timer" aria-label="Thời gian còn lại đến lễ cưới" aria-live="off" className="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:gap-5">
          {["Ngày", "Giờ", "Phút", "Giây"].map((label, index) => (
            <div key={label} className="rounded-t-[2.5rem] border border-gold/25 bg-ivory/80 px-1 py-6 text-center sm:rounded-t-[4rem] sm:py-9">
              <p data-countdown-value className="font-heading text-[clamp(1.8rem,6vw,4rem)] leading-tight tabular-nums">{timeLeft ? String(timeLeft[index]).padStart(2, "0") : "--"}</p>
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.15em] text-charcoal/65 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
