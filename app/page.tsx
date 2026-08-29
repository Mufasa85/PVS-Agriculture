import Footer from "@/components/layout/Footer";
import APropos from "@/components/sections/APropos";
import Activites from "@/components/sections/Activites";
import AgricultureFeature from "@/components/sections/AgricultureFeature";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import PourquoiNousChoisir from "@/components/sections/whyus";
import FurrowDivider from "@/components/ui/FurrowDivider";

export default function HomePage() {
  return (
    <>
      <Hero />

      <FurrowDivider />

      <AgricultureFeature />

      <FurrowDivider flipped />

      <Activites />

      <APropos />

      <PourquoiNousChoisir />

      <Contact />

      <Footer />
    </>
  );
}
