import { Navigation } from "./components/navigation/Navigation";
import HeroSection from "./components/HeroSection/HeroSection";
import ProductPreview from "./components/ProductPreview/ProductPreview";
import FeaturesSectionComponent from "./components/FeaturesSection/FeaturesSection";
import TeamsSectionComponent from "./components/TeamsSection/TeamsSection";
import DashboardSectionComponent from "./components/DashboardSection/DashboardSection";
import CTASectionComponent from "./components/CTASection/CTASection";

import { Page } from "./LandingPage.styles";

// Alias for clarity in JSX
const FeaturesSection = FeaturesSectionComponent;
const TeamsSection = TeamsSectionComponent;
const DashboardSection = DashboardSectionComponent;
const CTASection = CTASectionComponent;

export default function LandingPage() {
  return (
    <Page>
      <Navigation />
      <HeroSection />
      <ProductPreview />
      <FeaturesSection />
      <TeamsSection />
      <DashboardSection />
      <CTASection />
    </Page>
  );
}
