import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  StyledCTASection,
  CTAContent,
  CTATitle,
  CTAText,
  CTAButton,
} from "./CTASection.styles";

export default function CTASection() {
  return (
    <StyledCTASection>
      <CTAContent>
        <CTATitle>Clarity Changes Everything.</CTATitle>
        <CTAText>
          Start organizing your work with focus and structure today.
        </CTAText>

        <Link to="/auth/sign-up" style={{ textDecoration: "none" }}>
          <CTAButton>
            Start Free
            <ArrowRight size={20} />
          </CTAButton>
        </Link>
      </CTAContent>
    </StyledCTASection>
  );
}
