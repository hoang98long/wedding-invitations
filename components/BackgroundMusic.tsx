"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || manuallyPaused.current || !audio.paused) return;
    audio.volume = 0.35;
    // Browsers may block sound until the first visitor interaction.
    void audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    start();
    const onInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-music-control]")) return;
      start();
    };
    document.addEventListener("pointerdown", onInteraction);
    document.addEventListener("keydown", onInteraction);
    return () => {
      document.removeEventListener("pointerdown", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, [start]);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    setError("");
    if (audio.paused) {
      manuallyPaused.current = false;
      audio.volume = 0.35;
      try { await audio.play(); } catch { setError("Chưa thể phát nhạc. Bạn hãy thử lại nhé."); }
    } else {
      manuallyPaused.current = true;
      audio.pause();
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/media/sound/Music.mp3" loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError("Chưa thể tải nhạc. Bạn hãy thử lại nhé."); }} />
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-2 md:right-6">
        {error && <p role="status" className="max-w-56 rounded-lg border border-gold/30 bg-ivory px-4 py-2 text-xs leading-5 shadow-lg">{error}</p>}
        <button data-music-control type="button" onClick={toggleMusic} aria-label={playing ? "Tạm dừng nhạc nền" : "Bật nhạc nền"} title={playing ? "Tạm dừng nhạc nền" : "Bật nhạc nền"} aria-pressed={playing} className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-gold/40 bg-ivory/95 p-3 text-xs font-medium text-charcoal shadow-lg backdrop-blur sm:px-4">
          {playing ? <Music2 aria-hidden="true" className="h-4 w-4 text-[#526153]" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
          <span className="hidden sm:inline">{playing ? "Nhạc đang phát" : "Bật nhạc"}</span>
        </button>
      </div>
    </>
  );
}
