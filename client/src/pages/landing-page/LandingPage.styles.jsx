import styled, { css, keyframes } from "styled-components";

/* ========================
   ANIMATION KEYFRAMES
======================== */

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const underlineDraw = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

/* ========================
   ANIMATION HELPERS
======================== */

export const revealStyles = css`
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;

export const staggeredReveal = (delay = 0) => css`
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s;
`;

/* ========================
   LAYOUT
======================== */

export const Page = styled.div`
  min-height: 100vh;
  background: #fafafa;
  color: #18181b;
`;

export const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

export const Section = styled.section`
  padding: 6rem 0;

  @media (min-width: 768px) {
    padding: 8rem 0;
  }
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

/* ========================
   REVEAL WRAPPER
======================== */

export const RevealWrapper = styled.div`
  ${revealStyles}
  transition-delay: ${({ $delay }) => $delay || 0}s;
`;
