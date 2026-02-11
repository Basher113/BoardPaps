import styled from "styled-components";

export const StyledDashboardSection = styled.section`
  padding: 6rem 0;
  background: #ffffff;
  border-top: 1px solid #e4e4e7;

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

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "24px")});
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)
      ${({ $delay }) => $delay || 0}s,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)
      ${({ $delay }) => $delay || 0}s;

  &:hover {
    border-color: #a1a1aa;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
`;

export const StatNumber = styled.div`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #18181b;
  line-height: 1;
  margin-bottom: 0.375rem;
`;

export const StatSublabel = styled.div`
  font-size: 0.8125rem;
  color: #71717a;
`;
