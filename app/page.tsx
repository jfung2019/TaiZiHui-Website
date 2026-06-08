import ExperiencesShowcase from "@/components/ExperienceSection";
import HeroSection from "@/components/HeroSection";
import MenuShowcase from "@/components/MenuShowcase";
import Navbar from "@/components/Navbar";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ExperiencesShowcase />
      <MenuShowcase />
    </>
  );
}