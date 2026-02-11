import { useScrollReveal } from "../../hooks/useScrollReveal";

import {
  StyledDashboardSection ,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  StatsGrid,
  StatCard,
  StatLabel,
  StatNumber,
  StatSublabel,
} from "./DashboardSection.styles";

const stats = [
  { label: "To Do", number: "12", sublabel: "tasks pending" },
  { label: "In Progress", number: "8", sublabel: "actively working" },
  { label: "In Review", number: "5", sublabel: "awaiting review" },
  { label: "Completed", number: "34", sublabel: "tasks done" },
];

export default function DashboardSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <StyledDashboardSection id="dashboard">
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Your productivity at a glance</SectionTitle>
          <SectionSubtitle>
            Track every status and stay on top of your team's work with a
            clear, organized view.
          </SectionSubtitle>
        </SectionHeader>

        <StatsGrid ref={ref}>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              $visible={isVisible}
              $delay={index * 0.1}
            >
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber>{stat.number}</StatNumber>
              <StatSublabel>{stat.sublabel}</StatSublabel>
            </StatCard>
          ))}
        </StatsGrid>
      </SectionContainer>
    </StyledDashboardSection>
  );
}
