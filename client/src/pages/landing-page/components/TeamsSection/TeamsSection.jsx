import { Check } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

import {
  StyledTeamsSection,
  SectionContainer,
  TeamsGrid,
  TeamsContent,
  TeamsTitle,
  TeamsText,
  TeamsList,
  TeamsListItem,
  InviteDiagram,
  InviteBox,
  InviteBoxLabel,
  InviteBoxSublabel,
  InviteArrow,
  AnimatedLine,
} from "./TeamsSection.styles";

export default function TeamsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const teamPoints = [
    "Invite teammates with a single link",
    "Assign Admin or Member roles",
    "Control project-level permissions",
    "Track progress transparently",
  ];

  return (
    <StyledTeamsSection id="teams">
      <SectionContainer>
        <TeamsGrid ref={ref}>
          <TeamsContent>
            <TeamsTitle>Built for teams that move fast</TeamsTitle>
            <TeamsText>
              Collaboration made simple. Invite your team, set permissions, and
              keep everyone aligned on what matters.
            </TeamsText>

            <TeamsList>
              {teamPoints.map((point, index) => (
                <TeamsListItem key={index}>
                  <Check size={18} />
                  {point}
                </TeamsListItem>
              ))}
            </TeamsList>
          </TeamsContent>

          <InviteDiagram>
            <InviteBox>
              <InviteBoxLabel>Owner</InviteBoxLabel>
              <InviteBoxSublabel>Create</InviteBoxSublabel>
            </InviteBox>

            <InviteArrow>
              <AnimatedLine $visible={isVisible} viewBox="0 0 60 20">
                <path d="M0,10 L50,10 L50,10" />
              </AnimatedLine>
            </InviteArrow>

            <InviteBox>
              <InviteBoxLabel>Invite</InviteBoxLabel>
              <InviteBoxSublabel>Send</InviteBoxSublabel>
            </InviteBox>

            <InviteArrow>
              <AnimatedLine $visible={isVisible} viewBox="0 0 60 20">
                <path d="M0,10 L50,10 L50,10" />
              </AnimatedLine>
            </InviteArrow>

            <InviteBox>
              <InviteBoxLabel>Member</InviteBoxLabel>
              <InviteBoxSublabel>Join</InviteBoxSublabel>
            </InviteBox>
          </InviteDiagram>
        </TeamsGrid>
      </SectionContainer>
    </StyledTeamsSection>
  );
}
