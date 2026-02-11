import { CheckCircle2, Circle, Square, Minus } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

import {
  PreviewSection,
  BoardFrame,
  BoardContainer,
  BoardHeader,
  BoardTitle,
  WindowDots,
  ColumnsGrid,
  Column,
  ColumnHeader,
  ColumnName,
  ColumnCount,
  Card,
  CardMeta,
  CardId,
  CardTitle,
  CardFooter,
  PriorityLabel,
  AvatarCircle,
} from "./ProductPreview.styles";

const columns = [
  { id: "todo", name: "To Do", count: 3 },
  { id: "progress", name: "In Progress", count: 2 },
  { id: "review", name: "In Review", count: 2 },
  { id: "done", name: "Done", count: 4 },
];

const cards = [
  { id: "BP-1", column: "todo", title: "Design System Updates", priority: "HIGH" },
  { id: "BP-2", column: "todo", title: "Fix login bug", priority: "CRITICAL" },
  { id: "BP-3", column: "todo", title: "Update documentation", priority: "MEDIUM" },
  { id: "BP-4", column: "progress", title: "API Integration", priority: "HIGH" },
  { id: "BP-5", column: "progress", title: "Mobile Responsive", priority: "MEDIUM" },
  { id: "BP-6", column: "review", title: "User Dashboard", priority: "LOW" },
  { id: "BP-7", column: "review", title: "Team Settings", priority: "LOW" },
  { id: "BP-8", column: "done", title: "Initial Setup", priority: "COMPLETE" },
  { id: "BP-9", column: "done", title: "Auth Flow", priority: "COMPLETE" },
  { id: "BP-10", column: "done", title: "Database Schema", priority: "COMPLETE" },
  { id: "BP-11", column: "done", title: "Landing Page", priority: "COMPLETE" },
];

const IssueIcon = ({ type }) => {
  const icons = {
    TASK: <Square size={10} color="#71717a" />,
    BUG: <Circle size={10} strokeWidth={3} color="#3f3f46" />,
    STORY: <CheckCircle2 size={10} color="#71717a" />,
    COMPLETE: <CheckCircle2 size={10} color="#18181b" fill="#18181b" />,
  };
  return icons[type] || icons.TASK;
};

export default function ProductPreview() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  const getCardsForColumn = (columnId) =>
    cards.filter((card) => card.column === columnId);

  const getDelay = (index) => index * 0.08;

  return (
    <PreviewSection id="preview">
      <BoardFrame ref={ref} $visible={isVisible}>
        <BoardContainer>
          <BoardHeader>
            <BoardTitle>
              <WindowDots>
                <span></span>
                <span></span>
                <span></span>
              </WindowDots>
              <Minus size={14} color="#a1a1aa" style={{ marginLeft: 8 }} />
              <span style={{ marginLeft: 8 }}>Marketing Project</span>
            </BoardTitle>
          </BoardHeader>

          <ColumnsGrid>
            {columns.map((column) => (
              <Column key={column.id}>
                <ColumnHeader>
                  <ColumnName>{column.name}</ColumnName>
                  <ColumnCount>{getCardsForColumn(column.id).length}</ColumnCount>
                </ColumnHeader>

                {getCardsForColumn(column.id).map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    $visible={isVisible}
                    $delay={getDelay(cardIndex)}
                  >
                    <CardMeta>
                      <IssueIcon
                        type={
                          card.priority === "COMPLETE" ? "COMPLETE" : "TASK"
                        }
                      />
                      <CardId>{card.id}</CardId>
                    </CardMeta>
                    <CardTitle>{card.title}</CardTitle>
                    <CardFooter>
                      <PriorityLabel $priority={card.priority}>
                        {card.priority === "COMPLETE" ? "" : card.priority}
                      </PriorityLabel>
                      <AvatarCircle>
                        {card.priority === "COMPLETE" ? "✓" : card.id.slice(-2)}
                      </AvatarCircle>
                    </CardFooter>
                  </Card>
                ))}
              </Column>
            ))}
          </ColumnsGrid>
        </BoardContainer>
      </BoardFrame>
    </PreviewSection>
  );
}
