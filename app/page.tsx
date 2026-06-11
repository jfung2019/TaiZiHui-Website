import ExperiencesShowcase from "@/components/ExperienceSection";
import FacebookPostsSection from "@/components/FacebookPostsSection";
import HeroSection from "@/components/HeroSection";
import MenuShowcase from "@/components/MenuShowcase";
import Navbar from "@/components/Navbar";
import LocationSection from "@/components/LocationSection";
import ParkingSection from "@/components/ParkingSection";
import SignatureFoodSection from "@/components/SignatureFoodSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ExperiencesShowcase />
      <LocationSection />
      <ParkingSection />
      <MenuShowcase />
      <SignatureFoodSection />
      <FacebookPostsSection />
    </>
  );
}