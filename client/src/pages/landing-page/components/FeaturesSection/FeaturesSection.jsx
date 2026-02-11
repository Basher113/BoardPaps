import {
  Users,
  LayoutDashboard,
  CircleDot,
  Shield,
} from "lucide-react";

import {
  StyledFeaturesSection,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
} from "./FeaturesSection.styles";

const features = [
  {
    icon: <Users size={22} />,
    title: "Teams & Invitations",
    description:
      "Invite teammates with a single link. Assign roles and manage permissions instantly.",
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: "User Dashboard",
    description:
      "Track your tasks, progress, and priorities at a glance with a personalized view.",
  },
  {
    icon: <CircleDot size={22} />,
    title: "Issue Tracking",
    description:
      "Create, assign, and move issues across status columns. Stay organized effortlessly.",
  },
  {
    icon: <Shield size={22} />,
    title: "Role-Based Permissions",
    description:
      "Control who can view, edit, and manage your projects with granular access.",
  },
];

export default function FeaturesSection() {
  return (
    <StyledFeaturesSection id="features">
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Everything you need to ship faster</SectionTitle>
          <SectionSubtitle>
            Powerful features designed for modern teams who value clarity and
            focus.
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </SectionContainer>
    </StyledFeaturesSection>
  );
}
