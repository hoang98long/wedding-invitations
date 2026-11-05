"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Heart, LoaderCircle, Send } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import type { WeddingWish } from "@/lib/wishes";
import { needsGuestbookSetup } from "@/lib/guestbook-errors";

function formatWishDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(date));
}

function newSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // getRandomValues also works when previewing from a phone over local HTTP.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function GuestbookSection() {
  const [wishes, setWishes] = useState<WeddingWish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [setupRequired, setSetupRequired] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submissionId = useRef<string | null>(null);

  const loadWishes = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/wishes", { cache: "no-store", signal });
      const data: { wishes?: WeddingWish[]; error?: string; code?: string } | null = await response.json().catch(() => null);
      if (!signal?.aborted) setSetupRequired(needsGuestbookSetup(data?.code));
      if (!response.ok || !Array.isArray(data?.wishes)) throw new Error(data?.error || "Chưa thể tải lời chúc. Bạn vui lòng thử lại nhé.");
      if (!signal?.aborted) setWishes(data.wishes);
    } catch (error) {
      if (!signal?.aborted) setLoadError(error instanceof Error ? error.message : "Chưa thể tải lời chúc. Bạn thử lại nhé.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadWishes(controller.signal);
    return () => controller.abort();
  }, [loadWishes]);

  async function submitWish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setSubmitError("");
    setSuccess("");
    try {
      // Keep the ID after a network error, so a retry cannot post the same wish twice.
      submissionId.current ??= newSubmissionId();
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId.current, name, message, website: formData.get("website") || "" })
      });
      const data: { wish?: WeddingWish; error?: string; code?: string } | null = await response.json().catch(() => null);
      if (!response.ok || !data?.wish) {
        if (needsGuestbookSetup(data?.code)) setSetupRequired(true);
        throw new Error(data?.error || "Chưa gửi được lời chúc. Nội dung vẫn được giữ lại để bạn thử lần nữa nhé.");
      }
      const saved = data.wish;
      setWishes(previous => [saved, ...previous.filter(wish => wish.id !== saved.id)].slice(0, 100));
      setName("");
      setMessage("");
      submissionId.current = null;
      setSuccess("Lời chúc của bạn đã được gửi. Cảm ơn bạn đã yêu thương chúng mình!");
      setLoadError("");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Chưa gửi được lời chúc. Bạn thử lại nhé.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="guestbook" className="section-space">
      <div className="section-shell">
        <SectionHeading eyebrow="Lưu lại một lời yêu thương" title="Lời chúc gửi chúng mình" subtitle="Một lời chúc nhỏ, một niềm vui thật lớn. Cảm ơn bạn đã cùng chúng mình lưu giữ những điều dịu dàng trong ngày chung đôi." />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <form onSubmit={submitWish} className="wedding-paper relative self-start rounded-t-[2.5rem] border border-gold/30 p-5 sm:p-8">
            <h3 className="font-heading text-2xl">Gửi lời chúc</h3>
            <label htmlFor="guest-name" className="mt-6 block text-sm font-medium">Tên của bạn <span className="text-charcoal/60">*</span></label>
            <input id="guest-name" name="name" autoComplete="name" required maxLength={80} value={name} disabled={submitting} onChange={event => { setName(event.target.value); submissionId.current = null; }} placeholder="Cho chúng mình biết tên bạn nhé" className="form-field mt-2" />
            <label htmlFor="guest-message" className="mt-5 block text-sm font-medium">Lời chúc yêu thương <span className="text-charcoal/60">*</span></label>
            <textarea id="guest-message" name="message" required maxLength={600} rows={5} value={message} disabled={submitting} onChange={event => { setMessage(event.target.value); submissionId.current = null; }} placeholder="Viết lời chúc của bạn tại đây…" aria-describedby="message-count" className="form-field mt-2 min-h-36 resize-y" />
            <p id="message-count" className="mt-1 text-right text-[11px] text-charcoal/60">{message.length}/600</p>
            <div className="honeypot" aria-hidden="true"><label htmlFor="guest-website">Website</label><input id="guest-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <button type="submit" disabled={submitting || setupRequired || !name.trim() || !message.trim()} className="action-button mt-5 w-full">
              {submitting ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}{submitting ? "Đang gửi lời chúc…" : "Gửi lời chúc"}
            </button>
            <p className="mt-4 text-xs leading-6 text-charcoal/60">Tên và lời chúc sẽ xuất hiện trong sổ lời chúc bên dưới.</p>
            {setupRequired && <p role="status" className="mt-3 text-sm leading-6 text-[#526153]">Chúng mình đang chuẩn bị sổ lời chúc. Bạn ghé lại sau một chút để gửi lời yêu thương nhé.</p>}
            {submitError && <p role="alert" className="mt-4 text-sm leading-6 text-red-800">{submitError}</p>}
            {success && <p role="status" className="mt-4 text-sm leading-6 text-[#3f6346]">{success}</p>}
          </form>
          <div aria-busy={loading} className="wedding-paper self-start rounded-t-[2.5rem] border border-gold/25 p-5 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="font-heading text-2xl">Sổ lời chúc</h3>
              <button type="button" disabled={loading} onClick={() => void loadWishes()} className="min-h-11 text-xs text-charcoal/70 underline decoration-gold/60 underline-offset-4 disabled:opacity-50">Làm mới</button>
            </div>
            {loading && <p role="status" className="py-8 text-sm text-charcoal/65">Đang mở những lời yêu thương…</p>}
            {loadError && <div role="alert" className="rounded-xl border border-gold/25 bg-white/50 p-5 text-sm leading-7"><Heart aria-hidden="true" className="mb-4 h-5 w-5 text-[#73826a]" strokeWidth={1.3} /><p>{loadError}</p><button type="button" onClick={() => void loadWishes()} className="mt-2 min-h-11 underline decoration-gold/60 underline-offset-4">Thử tải lại</button></div>}
            {!loading && !loadError && wishes.length === 0 && <div className="flex min-h-60 flex-col items-center justify-center border border-dashed border-gold/40 p-8 text-center"><Heart aria-hidden="true" className="mb-4 h-7 w-7 text-gold" strokeWidth={1.3} /><p className="font-heading text-2xl">Lời chúc đầu tiên đang chờ bạn</p><p className="mt-3 max-w-xs text-sm leading-7 text-charcoal/65">Gửi một lời yêu thương để mở đầu cuốn sổ hạnh phúc của chúng mình nhé.</p></div>}
            {wishes.length > 0 && <div className="max-h-[580px] space-y-4 overflow-y-auto overscroll-contain pr-2" tabIndex={0} role="region" aria-label="Các lời chúc của khách mời">
              {wishes.map(wish => <article key={wish.id} className="border-b border-gold/25 pb-5 pt-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><h4 className="min-w-0 break-words font-heading text-xl [overflow-wrap:anywhere]">{wish.name}</h4><time dateTime={wish.createdAt} className="shrink-0 text-[10px] text-charcoal/60">{formatWishDate(wish.createdAt)}</time></div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-charcoal/75 [overflow-wrap:anywhere]">{wish.message}</p>
              </article>)}
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
