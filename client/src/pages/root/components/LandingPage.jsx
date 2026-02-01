import styled, {css} from "styled-components";

import { Goal, Users, Zap, Sparkles } from "lucide-react";
import icon from "../../../assets/bp_icon_minimalist.jpg";

import Button from "../../../components/ui/button/Button";
import { Navigation } from "./components/navigation/Navigation";
import HeroSection from "./components/HeroSection/HeroSection";

/* =======================
   STYLED COMPONENTS
======================= */

const Page = styled.div`
  min-height: 100vh;
  background: var(--background);
`;

export const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Section = styled.section`
  padding: 5rem 1rem;

  ${({ background }) =>
    background === "gray" &&
    css`
      background: #f9fafb;
    `}

  ${({ background }) =>
    background === "gradient" &&
    css`
      background: linear-gradient(135deg, #eff6ff, #ffffff, #f5f3ff);
    `}

  ${({ background }) =>
    background === "gradientBlue" &&
    css`
      background: linear-gradient(90deg, #2563eb, #7c3aed);
      color: white;
    `}
`;

const CTAContent = styled.div`
  max-width: 768px;
  margin: auto;
  text-align: center;
`;

const CTATitle = styled.h1`
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  color: oklch(0.25 0.02 260);
  margin-bottom: 2rem;
`;


const FeaturesSection = styled.section`
  background: white;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 10rem 1rem;
`;

const FeatureHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem; 
`

const FeatureHeaderTitle = styled.h2`
  font-size: 2.25rem; 
  font-weight: 700;  
  color: #111827;     
  margin-bottom: 16px; 
  
`;

const FeatureHeaderSubtitle = styled.p`
  font-size: 1.25rem;        /* text-xl */
  color: #4b5563;            /* text-gray-600 */
  max-width: 42rem;           /* max-w-2xl */
  margin-left: auto;          /* mx-auto */
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const FeatureCard = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${(props) => props.color || ''};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureText = styled.p`
  color: #4b5563;

`;

export default function LandingPage() {

  return (
    <Page>
      <Navigation icon={icon}/>

      {/* Hero */}
      <HeroSection />
        

      {/* Features */}
      <FeaturesSection>
        <div className="container">
          <FeatureHeader>
            <FeatureHeaderTitle>
              Built for how teams work today
            </FeatureHeaderTitle>

            <FeatureHeaderSubtitle>
              Powerful features that adapt to your workflow
            </FeatureHeaderSubtitle>
          </FeatureHeader>

          <FeaturesGrid>
            {[
              
              {
                icon: Users,
                color:"#5c4ddf",
                title: "Team Collaboration",
                description:
                  "Real-time updates keep everyone in sync. Work together seamlessly across time zones.",
              },
              
              {
                icon: Zap,
                color: "#76df4d" ,
                title: "Lightning fast performance",
                description:
                  "Built for speed and efficiency. Get more done in less time with intelligent automation and instant updates across your entire team.",
              },

              {
                icon: Goal,
                color: "#c74ddf",
                title: "Visual goal tracking",
                description: "Align your team around shared objectives and track progress with beautiful, intuitive dashboards that everyone can understand."
              }
            ].map((feature, i) => (
              <FeatureCard key={i} >
                <FeatureIcon color={feature.color}>
                  <feature.icon size={32} />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.description}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      {/* CTA */}
      <Section>
        <div className="container">
          <CTAContent>
            <CTATitle>Ready to transform your workflow?</CTATitle>
            <CTAText>
              Move fast, stay aligned, and build better - together
            </CTAText>

            <Button size="lg">
              Sign In Now
            </Button>
          </CTAContent>
        </div>
      </Section>

    
    </Page>
  );
}

