import { CountdownSection } from "@/components/CountdownSection";
import { FooterSection } from "@/components/FooterSection";
import { GallerySection } from "@/components/GallerySection";
import { HeroSection } from "@/components/HeroSection";
import { RSVPSection } from "@/components/RSVPSection";
import { StorySection } from "@/components/StorySection";
import { VenueSection } from "@/components/VenueSection";
import { WeddingInfoSection } from "@/components/WeddingInfoSection";

export default function Home() {
  return (
    <main className="overflow-hidden bg-ivory">
      <HeroSection />
      <CountdownSection />
      <StorySection />
      <GallerySection />
      <WeddingInfoSection />
      <VenueSection />
      <RSVPSection />
      <FooterSection />
    </main>
  );
}
