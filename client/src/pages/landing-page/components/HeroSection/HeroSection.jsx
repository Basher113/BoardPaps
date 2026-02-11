import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "../../LandingPage.styles";

import {
  HeroWrapper,
  HeroContent,
  HeroTitle,
  AnimatedWord,
  HeroText,
  HeroActions,
  PrimaryButton,
  SecondaryButton,
} from "./heroSection.styles";

export default function HeroSection() {
  return (
    <HeroWrapper>
      <Container>
        <HeroContent>
          <HeroTitle>
            Organize Work
            <br />
            Without the <AnimatedWord>Chaos.</AnimatedWord>
          </HeroTitle>

          <HeroText>
            A collaborative Kanban board that gives your team clarity,
            structure, and momentum — all in one place.
          </HeroText>

          <HeroActions>
            <Link to="/auth/sign-up" style={{ textDecoration: "none" }}>
              <PrimaryButton>
                Start Free
                <ArrowRight size={18} />
              </PrimaryButton>
            </Link>

            <SecondaryButton as="a" href="#features">
              Learn More
            </SecondaryButton>
          </HeroActions>
        </HeroContent>
      </Container>
    </HeroWrapper>
  );
}
