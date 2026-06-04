import ExperienceSection from "@/components/ExperienceSection";
import HeroSection from "@/components/HeroSection";
import MenuShowcase from "@/components/MenuShowcase";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <MenuShowcase />
    </>
  );
}