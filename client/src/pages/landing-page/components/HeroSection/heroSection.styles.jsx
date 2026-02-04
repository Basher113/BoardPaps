import styled from "styled-components";

export const HeroGrid = styled.div`
  display: grid;
  gap: 3rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.75rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
`;

export const HeroText = styled.p`
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 36rem;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HeroVisual = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const BoardContainer = styled.div`
  background: white;
  border-radius: 16px; /* rounded-2xl */
  padding: 16px; /* p-4 */
  border: 1px solid #e5e7eb; /* border-gray-200 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  transform: scale(1);
  transition: transform 0.5s ease; /* duration-500 */

  &:hover {
    transform: scale(1.05);
  }
`

export const BoardWrapper = styled.div`
  background: linear-gradient(135deg, #3b82f6, #7c3aed);
  padding: 2rem;
  border-radius: 1.25rem;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  &:hover {
    transform: scale(1.05);
  }
`;

export const Column = styled.div`
  background: white;
  border-radius: 12px;
  padding: 10px;
  min-width: 140px;
  flex: 1;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ColumnTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
`;

export const CountBadge = styled.span`
  background: #e5e7eb;
  color: #374151;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 999px;
`;

export const Card = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: box-shadow 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }
`;

export const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

export const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const IssueId = styled.span`
  font-size: 10px;
  color: #6b7280;
  font-family: monospace;
`;

export const CardTitle = styled.h4`
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
`;


export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const priorityStyles = {
  LOW: { bg: "#f3f4f6", color: "#4b5563" },
  MEDIUM: { bg: "#dbeafe", color: "#2563eb" },
  HIGH: { bg: "#ffedd5", color: "#ea580c" },
  CRITICAL: { bg: "#fee2e2", color: "#dc2626" },
};

export const PriorityBadge = styled.span`
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 6px;
  background: ${({ priority }) => priorityStyles[priority].bg};
  color: ${({ priority }) => priorityStyles[priority].color};
`;


const assigneeGradients = {
  JD: "linear-gradient(135deg, #3b82f6, #9333ea)",
  SS: "linear-gradient(135deg, #22c55e, #14b8a6)",
  MW: "linear-gradient(135deg, #f97316, #ef4444)",
  EB: "linear-gradient(135deg, #ec4899, #9333ea)",
};

export const Avatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: ${({ assignee }) => assigneeGradients[assignee]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
`;



export const Board = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;






export const BoardHeaderActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const BoardDots = styled.div`
  display: flex;
  gap: 0.5rem;

  span {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }
`;