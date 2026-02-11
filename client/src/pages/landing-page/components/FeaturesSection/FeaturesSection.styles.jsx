import styled from "styled-components";

export const StyledFeaturesSection = styled.section`
  padding: 6rem 0;
  background: #ffffff;
  border-top: 1px solid #e4e4e7;
  border-bottom: 1px solid #e4e4e7;

  @media (min-width: 768px) {
    padding: 8rem 0;
  }
`;

export const SectionContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #18181b;
  margin-bottom: 1rem;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #71717a;
  max-width: 36rem;
  margin: 0 auto;
  line-height: 1.6;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 1.75rem;
  transition: border-color 0.25s ease, transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    border-color: #a1a1aa;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  }
`;

export const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  color: #18181b;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

export const FeatureDescription = styled.p`
  font-size: 0.9375rem;
  color: #71717a;
  line-height: 1.55;
`;
