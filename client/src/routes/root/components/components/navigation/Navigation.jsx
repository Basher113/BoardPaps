import styled from "styled-components";

import bpIcon from "../../../../../assets/bp_icon_minimalist.png";
import Button from "../../../../../components/button/Button";

const Nav = styled.nav`
  position: fixed;
  width: 100%;
  z-index: 50;
  background: ${({ scrolled }) => (scrolled ? "white" : "transparent")};
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 4px 10px rgba(0,0,0,.05)" : "none"};
  transition: all 0.3s;
  border-bottom: 1px solid var(--border);
`;

const NavInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <div
      style={{
        width: 50,
        height: 50,
        background: "#2563eb",
        borderRadius: 6,
        display: "grid",
        placeItems: "center",
      }}
    >
      <img src={bpIcon} />
    </div>
    <strong>BoardPaps</strong>
  </div>
);

export function Navigation() {
  return (
    <Nav >
      <NavInner>
        <Logo />
        <div>
          <Button>Get started</Button>
        </div>
      </NavInner>
    </Nav>
  );
}