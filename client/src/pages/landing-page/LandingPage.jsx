import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../../reducers/slices/user/user.slice";

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
  const navigate = useNavigate();
  const { data: currentUser, isLoading: currentUserLoading } =
    useGetCurrentUserQuery();

  if (currentUserLoading) {
    return null;
  }

  if (currentUser) {
    navigate("/app");
    return null;
  }

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
