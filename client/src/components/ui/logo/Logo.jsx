import styled, { css } from "styled-components";
import { Link } from "react-router-dom";


const LogoWrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoMark = styled.div`
  display: grid;
  place-items: center;
  background: #18181b;
  color: #fafafa;
  font-weight: 700;
  letter-spacing: -0.02em;
  border-radius: 8px;

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`
          width: 24px;
          height: 24px;
          font-size: 0.75rem;
        `;
      case "lg":
        return css`
          width: 40px;
          height: 40px;
          font-size: 1.125rem;
        `;
      case "xl":
        return css`
          width: 48px;
          height: 48px;
          font-size: 1.25rem;
        `;
      default:
        return css`
          width: 32px;
          height: 32px;
          font-size: 1rem;
        `;
    }
  }}

  ${({ $variant, $color }) => {
    if ($variant === "outline") {
      return css`
        background: transparent;
        border: 2px solid ${$color || "#18181b"};
        color: ${$color || "#18181b"};
      `;
    }
    if ($variant === "white") {
      return css`
        background: #fafafa;
        color: #18181b;
      `;
    }
    return css`
      background: #18181b;
      color: #fafafa;
    `;
  }}
`;

const LogoText = styled.span`
  font-weight: 700;
  color: #18181b;
  letter-spacing: -0.02em;
  line-height: 1;

  &.sidebar-logo {
    color: white;
  }

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`
          font-size: 0.875rem;
        `;
      case "lg":
        return css`
          font-size: 1.375rem;
        `;
      case "xl":
        return css`
          font-size: 1.625rem;
        `;
      default:
        return css`
          font-size: 1.125rem;
        `;
    }
  }}

  ${({ $variant, $color }) => {
    if ($variant === "white") {
      return css`
        color: #fafafa;
      `;
    }
    if ($color) {
      return css`
        color: ${$color};
      `;
    }
    return css`
      color: #18181b;
    `;
  }}
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    opacity: ${({ $clickable }) => ($clickable ? 0.8 : 1)};
  }
`;

export function Logo({
  size = "md",
  variant = "default",
  color,
  showText = true,
  to = "/",
  iconOnly = false,
  ...props
}) {
  const logoContent = (
    <>
      <LogoMark $size={size} $variant={variant} $color={color}>
        BP
      </LogoMark>
      {!iconOnly && showText && (
        <LogoText $size={size} $variant={variant} $color={color}>
          BoardPaps
        </LogoText>
      )}
    </>
  );

  if (to) {
    return <LogoWrapper to={to}>{logoContent}</LogoWrapper>;
  }

  return (
    <LogoContainer $clickable={false} {...props}>
      {logoContent}
    </LogoContainer>
  );
}


export function LogoIcon({
  size = "md",
  variant = "default",
  color,
  ...props
}) {
  return (
    <LogoMark
      $size={size}
      $variant={variant}
      $color={color}
      {...props}
    >
      BP
    </LogoMark>
  );
}

export default Logo;
