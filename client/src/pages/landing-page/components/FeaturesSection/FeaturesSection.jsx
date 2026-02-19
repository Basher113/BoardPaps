import {
  Users,
  LayoutDashboard,
  CircleDot,
  Shield,
  X,
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
    icon: <CircleDot size={22} />,
    title: "Simple Kanban Board",
    description:
      "Drag and drop issues across columns. That's it. No complicated workflows to configure.",
  },
  {
    icon: <Users size={22} />,
    title: "Email Invitations",
    description:
      "Invite teammates via email with a personal message. They click, join, and start working.",
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: "Personal Dashboard",
    description:
      "See all your assigned issues across projects at a glance. Know exactly what needs your attention.",
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
            BoardPaps gives you exactly what you need to manage your work — 
            nothing more, nothing less.
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
