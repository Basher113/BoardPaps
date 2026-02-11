import styled from "styled-components";

export const PreviewSection = styled.section`
  padding: 0 0 6rem;

  @media (min-width: 768px) {
    padding: 0 0 8rem;
  }
`;

export const BoardFrame = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "32px")});
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const BoardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f4f4f5;
`;

export const BoardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #18181b;
`;

export const WindowDots = styled.div`
  display: flex;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e4e4e7;
  }
`;

export const ColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Column = styled.div`
  background: #fafafa;
  border-radius: 10px;
  padding: 0.75rem;
  min-height: 180px;
  transition: border-color 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    border-color: #e4e4e7;
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
  padding-bottom: 0.5rem;
`;

export const ColumnName = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #3f3f46;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const ColumnCount = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: #a1a1aa;
  background: #f4f4f5;
  padding: 1px 6px;
  border-radius: 999px;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 0.625rem;
  margin-bottom: 0.5rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? "0" : "12px")});
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)
      ${({ $delay }) => $delay || 0}s,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)
      ${({ $delay }) => $delay || 0}s,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

export const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

export const CardId = styled.span`
  font-size: 0.625rem;
  color: #a1a1aa;
  font-family: "SF Mono", "Fira Code", monospace;
`;

export const CardTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: #18181b;
  line-height: 1.35;
  margin-bottom: 0.5rem;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PriorityLabel = styled.span`
  font-size: 0.5625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: ${({ $priority }) => {
    if ($priority === "CRITICAL" || $priority === "HIGH") return "#3f3f46";
    return "#a1a1aa";
  }};
`;

export const AvatarCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 600;
  color: #71717a;
`;
