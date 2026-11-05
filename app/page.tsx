import { CountdownSection } from "@/components/CountdownSection";
import { FooterSection } from "@/components/FooterSection";
import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { GiftSection } from "@/components/GiftSection";
import { GuestbookSection } from "@/components/GuestbookSection";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { WeddingInfoSection } from "@/components/WeddingInfoSection";

export default function Home() {
  return (
    <main className="overflow-hidden bg-ivory">
      <HeroSection />
      <CountdownSection />
      <GallerySection />
      <WeddingInfoSection />
      <GuestbookSection />
      <GiftSection />
      <FooterSection />
      <BackgroundMusic />
    </main>
  );
}
