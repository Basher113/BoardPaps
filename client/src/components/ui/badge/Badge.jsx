import styled, { css } from 'styled-components';

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid transparent;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.15s ease;
`;

const variantStyles = {
  default: css`
    border-color: #e4e4e7;
    background-color: #f4f4f5;
    color: #18181b;
  `,
  secondary: css`
    border-color: #e4e4e7;
    background-color: #f4f4f5;
    color: #52525b;
  `,
  outline: css`
    border-color: #d4d4d8;
    background-color: transparent;
    color: #52525b;
  `,
  muted: css`
    border-color: #e4e4e7;
    background-color: #f4f4f5;
    color: #71717a;
  `,
};

const StyledBadge = styled.span`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant] || variantStyles.default}
`;

const Badge = ({ variant = 'default', children, ...props }) => {
  return (
    <StyledBadge $variant={variant} {...props}>
      {children}
    </StyledBadge>
  );
};

export default Badge;
