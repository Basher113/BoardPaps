import styled from "styled-components";

export const StyledTeamsSection = styled.section`
  padding: 6rem 0;
  background: #fafafa;

  @media (min-width: 768px) {
    padding: 8rem 0;
  }
`;

export const SectionContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

export const TeamsContent = styled.div``;

export const TeamsTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #18181b;
  margin-bottom: 1.5rem;
`;

export const TeamsText = styled.p`
  font-size: 1.0625rem;
  color: #71717a;
  line-height: 1.65;
  margin-bottom: 2rem;
`;

export const TeamsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TeamsListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #3f3f46;
  border-bottom: 1px solid #f4f4f5;

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: #18181b;
    flex-shrink: 0;
  }
`;

export const InviteDiagram = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
`;

export const InviteBox = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
`;

export const InviteBoxLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #18181b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const InviteBoxSublabel = styled.div`
  font-size: 0.6875rem;
  color: #a1a1aa;
  margin-top: 0.25rem;
`;

export const InviteArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #71717a;
  }
`;

export const AnimatedLine = styled.svg`
  width: 60px;
  height: 20px;
  overflow: visible;

  path {
    stroke: #a1a1aa;
    stroke-width: 1.5;
    stroke-dasharray: 60;
    stroke-dashoffset: ${({ $visible }) => ($visible ? 0 : 60)};
    fill: none;
    transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;
