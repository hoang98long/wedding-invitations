import { CalendarDays, Clock3, MapPin, Navigation } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ceremonies, directionsUrl, mapEmbedUrl } from "@/lib/wedding";

export function WeddingInfoSection() {
  return (
    <section id="wedding-info" className="section-space bg-champagne/30">
      <div className="section-shell">
        <SectionHeading eyebrow="Trân trọng kính mời" title="Về chung một nhà" subtitle="Sự hiện diện của bạn là niềm hạnh phúc của chúng mình và hai bên gia đình. Hẹn bạn đến chung vui trong ngày đặc biệt này." />
        <div className="grid gap-7 md:grid-cols-2">
          {ceremonies.map(ceremony => (
            <article key={ceremony.side} className="flex min-w-0 flex-col overflow-hidden border border-gold/30 bg-ivory">
              <div className="flex flex-1 flex-col items-center px-5 pb-8 pt-9 text-center sm:px-9">
                <p className="eyebrow">Lễ cưới · {ceremony.side}</p>
                <h3 className="mt-4 font-heading text-4xl leading-snug">{ceremony.name}</h3>
                <div className="my-6 h-px w-16 bg-gold/50" />
                <time dateTime={ceremony.dateTime} className="flex flex-col items-center gap-3">
                  <span className="flex items-center gap-2 text-sm text-charcoal/75"><Clock3 aria-hidden="true" className="h-4 w-4 text-gold" />{ceremony.time} · {ceremony.weekday}</span>
                  <span className="flex items-center gap-2 font-heading text-3xl"><CalendarDays aria-hidden="true" className="h-5 w-5 text-gold" />{ceremony.date}</span>
                </time>
                <p className="mt-6 flex items-center gap-2 text-sm font-medium"><MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" />{ceremony.area}</p>
                <a href={ceremony.placeUrl} target="_blank" rel="noopener noreferrer" className="mt-3 max-w-full text-sm leading-6 text-charcoal/70 underline decoration-gold/50 underline-offset-4 hover:text-charcoal">{ceremony.venue}</a>
                <a href={directionsUrl(ceremony.coordinates)} target="_blank" rel="noopener noreferrer" className="action-button mt-7 w-full sm:w-auto" aria-label={`Chỉ đường đến lễ cưới bên ${ceremony.side.toLowerCase()}`}>
                  <Navigation aria-hidden="true" className="h-4 w-4" />Chỉ đường đến dự cưới
                </a>
              </div>
              <iframe title={`Bản đồ lễ cưới bên ${ceremony.side.toLowerCase()} — ${ceremony.venue}`} src={mapEmbedUrl(ceremony.coordinates)} className="h-64 w-full border-0 border-t border-gold/20 sm:h-72" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
