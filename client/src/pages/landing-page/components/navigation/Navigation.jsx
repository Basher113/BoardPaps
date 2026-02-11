import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { Menu, X } from "lucide-react";
import Button from "../../../../components/ui/button/Button";
import Logo from "../../../../components/ui/logo/Logo";

/* ========================
   STYLED COMPONENTS
======================== */

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: background 0.3s ease, border-color 0.3s ease,
    backdrop-filter 0.3s ease;

  ${({ $scrolled }) =>
    $scrolled
      ? css`
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e4e4e7;
        `
      : css`
          background: transparent;
          border-bottom: 1px solid transparent;
        `}
`;

const NavInner = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  color: #71717a;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #18181b;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #18181b;
  padding: 0;

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "300px" : "0")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: ${({ $open }) =>
    $open ? "1px solid #e4e4e7" : "1px solid transparent"};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuInner = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled.a`
  font-size: 1rem;
  font-weight: 500;
  color: #3f3f46;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.2s ease;

  &:hover {
    color: #18181b;
  }
`;

/* ========================
   COMPONENT
======================== */

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Teams", href: "#teams" },
    { label: "Dashboard", href: "#dashboard" },
  ];

  return (
    <>
      <Nav $scrolled={scrolled}>
        <NavInner>
          <Logo />

          <NavLinks>
            {navItems.map((item) => (
              <NavLink key={item.label} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </NavLinks>

          <NavActions>
            <Link to="/auth/sign-in" style={{ display: "none" }}>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>

            <Link
              to="/auth/sign-up"
              style={{ textDecoration: "none" }}
            >
              <Button size="sm">Get Started</Button>
            </Link>

            <HamburgerButton
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </HamburgerButton>
          </NavActions>
        </NavInner>
      </Nav>

      <MobileMenu $open={mobileOpen}>
        <MobileMenuInner>
          {navItems.map((item) => (
            <MobileNavLink
              key={item.label}
              href={item.href}
              onClick={handleLinkClick}
            >
              {item.label}
            </MobileNavLink>
          ))}
          <Link
            to="/auth/sign-up"
            onClick={handleLinkClick}
            style={{ textDecoration: "none" }}
          >
            <Button style={{ width: "100%" }}>Get Started</Button>
          </Link>
        </MobileMenuInner>
      </MobileMenu>
    </>
  );
}
