"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Download, Heart } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const accounts = [
  { side: "Chú rể", bank: "MB", name: "NGUYEN HOANG LONG", number: "0560131149005", qr: "/media/qr/QR_groom.png" },
  { side: "Cô dâu", bank: "BIDV", name: "NGUYEN HA THANH", number: "1600306634", qr: "/media/qr/QR_bride.png" }
];

export function GiftSection() {
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");

  async function copyAccount(number: string) {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      setNotice("Đã sao chép số tài khoản.");
    } catch {
      // Clipboard requires HTTPS on mobile. Selecting the visible text also works on HTTP.
      const element = document.getElementById(`account-${number}`) as HTMLParagraphElement | null;
      if (element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setNotice("Bạn hãy nhấn giữ số tài khoản để sao chép nhé.");
    }
  }

  return (
    <section id="gifts" className="section-space bg-champagne/30">
      <div className="section-shell">
        <SectionHeading eyebrow="Hộp mừng cưới" title="Gửi chút yêu thương" subtitle="Bạn đến chung vui đã là món quà quý giá. Nếu muốn gửi thêm một chút yêu thương, chúng mình xin nhận bằng tất cả sự trân trọng." />
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:gap-6">
          {accounts.map(account => (
            <article key={account.side} className="flex min-w-0 flex-col items-center border border-gold/30 bg-ivory px-3 py-6 text-center sm:px-8 sm:py-9">
              <Heart aria-hidden="true" className="mb-3 h-4 w-4 text-gold" />
              <h3 className="font-heading text-2xl sm:text-3xl">{account.side}</h3>
              <div className="my-5 w-full max-w-[230px] bg-white p-2 sm:p-4">
                <div className="relative aspect-square w-full">
                  <Image src={account.qr} alt={`Mã QR mừng cưới ${account.side.toLowerCase()} — ${account.bank}, ${account.name}, ${account.number}`} fill sizes="(min-width: 640px) 200px, 40vw" className="object-contain" unoptimized />
                </div>
              </div>
              <p className="text-base font-semibold text-[#526153] sm:text-lg">{account.bank}</p>
              <p className="mt-2 min-h-10 text-[10px] font-medium leading-5 tracking-[0.04em] sm:min-h-0 sm:text-sm">{account.name}</p>
              <p id={`account-${account.number}`} className="mt-2 select-all whitespace-nowrap font-mono text-[11px] font-semibold tracking-tight sm:text-base sm:tracking-normal">{account.number}</p>
              <button type="button" className="mt-4 flex min-h-11 items-center justify-center gap-1.5 text-[10px] font-medium text-charcoal/75 hover:text-charcoal sm:text-xs" onClick={() => copyAccount(account.number)} aria-label={`Sao chép số tài khoản ${account.side.toLowerCase()}`}>
                {copied === account.number ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
                {copied === account.number ? "Đã sao chép" : "Sao chép STK"}
              </button>
              <a href={account.qr} download={`QR-mung-cuoi-${account.side === "Chú rể" ? "chu-re" : "co-dau"}.png`} className="mt-1 flex min-h-11 items-center gap-1.5 text-[10px] text-charcoal/70 underline decoration-gold/50 underline-offset-4 sm:text-xs">
                <Download aria-hidden="true" className="h-3.5 w-3.5" />Lưu ảnh QR
              </a>
            </article>
          ))}
        </div>
        <p role="status" className="mt-4 min-h-6 text-center text-xs text-charcoal/70">{notice}</p>
        <p className="mx-auto mt-3 max-w-lg text-center text-xs leading-6 text-charcoal/65">Có thể lưu ảnh QR để mở trong ứng dụng ngân hàng.<br />Cảm ơn bạn đã gửi gắm yêu thương đến chúng mình.</p>
      </div>
    </section>
  );
}
