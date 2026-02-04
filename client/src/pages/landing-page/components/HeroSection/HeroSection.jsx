import Button from "../../../../components/ui/button/Button";
import { ArrowRight, Check, Bug, BookOpen } from "lucide-react";
import { Section, Container } from "../../LandingPage";


import {
  HeroGrid,
  HeroContent,
  HeroTitle,
  HeroText,
  HeroActions,
  HeroVisual,
  BoardWrapper,
  Column,
  ColumnHeader,
  ColumnTitle,
  CountBadge,
  Card, 
  CardMeta,
  MetaLeft,
  CardTitle,
  CardFooter,
  IssueId,
  PriorityBadge,
  Avatar,

} from "./heroSection.styles";

const IssueTypeIcon = ({ type }) => {
  const icons = {
    TASK: <Check size={12} color="#3b82f6" />,
    BUG: <Bug size={12} color="#ef4444" />,
    STORY: <BookOpen size={12} color="#22c55e" />,
  };

  return icons[type] || icons.TASK;
};

const IssueCard = ({ issue }) => (
  <Card>
    <CardMeta>
      <MetaLeft>
        <IssueTypeIcon type={issue.type} />
        <IssueId>TFD-{issue.id}</IssueId>
      </MetaLeft>
    </CardMeta>

    <CardTitle>{issue.title}</CardTitle>

    <CardFooter>
      <PriorityBadge priority={issue.priority}>
        {issue.priority}
      </PriorityBadge>
      <Avatar assignee={issue.assignee}>
        {issue.assignee}
      </Avatar>
    </CardFooter>
  </Card>
);

const BoardColumn = ({ column, issues }) => {
  const columnIssues = issues.filter(issue => issue.columnId === column.id);

  return (
    <Column bg={column.color}>
      <ColumnHeader>
        <ColumnTitle>{column.name}</ColumnTitle>
        <CountBadge>{columnIssues.length}</CountBadge>
      </ColumnHeader>

      {columnIssues.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </Column>
  );
};

export default function HeroSection() {

  const boardColumns = [
  { id: 1, name: "To Do", color: "#f3f4f6" },
  { id: 2, name: "In Progress", color: "#eff6ff" },
  { id: 3, name: "Done", color: "#ecfdf5" },
  ];

  const boardIssues = [
    { id: 1, columnId: 1, title: "Design System Updates", type: "TASK", priority: "HIGH", assignee: "JD" },
    { id: 2, columnId: 1, title: "Fix login bug", type: "BUG", priority: "CRITICAL", assignee: "SS" },
    { id: 3, columnId: 2, title: "API Integration", type: "STORY", priority: "MEDIUM", assignee: "MW" },
    { id: 4, columnId: 2, title: "Mobile Responsive", type: "TASK", priority: "HIGH", assignee: "EB" },
    { id: 5, columnId: 3, title: "User Dashboard", type: "TASK", priority: "LOW", assignee: "JD" },
  ];

  return (
    <Section background="gradient" style={{ paddingTop: "8rem" }}>
      <Container>
        <HeroGrid>
          {/* LEFT */}
          <HeroContent>

            <HeroTitle>
              Unleash the potential of every team
            </HeroTitle>

            <HeroText>
              From software teams to marketing, HR, and beyond.
              TeamFlow brings teams together to get work done.
            </HeroText>

            <HeroActions>
              <Button size="lg">
                Get it free
                <ArrowRight size={20} />
              </Button>

              <Button variant="secondary" size="lg">
                Watch demo
              </Button>
            </HeroActions>
          </HeroContent>

          {/* RIGHT */}
          <HeroVisual>

            

            <BoardWrapper>
              {boardColumns.map(column => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  issues={boardIssues}
                />
              ))}
            </BoardWrapper>
          </HeroVisual>
        </HeroGrid>
      </Container>
    </Section>
  );
}