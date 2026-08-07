import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import FreeDownloadsSection from "@/components/landing/FreeDownloadsSection";
import PricingSection from "@/components/landing/PricingSection";
import AudienceSection from "@/components/landing/AudienceSection";
import PrivacySection from "@/components/landing/PrivacySection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen scroll-smooth">
    <Navbar />
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ComparisonSection />
      <FreeDownloadsSection />
      <PricingSection />
      <AudienceSection />
      <PrivacySection />
      <FaqSection />
      <FinalCtaSection />
    </main>
    <Footer />
  </div>
);

export default Index;
