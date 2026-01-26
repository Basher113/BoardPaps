import styled, { css } from "styled-components";

const variantStyles = {
  primary: css`
    background-color: #2563eb; /* blue-600 */
    color: #fff;

    &:hover {
      background-color: #1d4ed8; /* blue-700 */
      transform: scale(1.05);
    }
  `,

  secondary: css`
    background-color: transparent;
    border: 2px solid #d1d5db; /* gray-300 */
    color: #374151; /* gray-700 */

    &:hover {
      border-color: #2563eb;
      color: #2563eb;
    }
  `,

  white: css`
    background-color: #fff;
    color: #2563eb;

    &:hover {
      background-color: #f3f4f6; /* gray-100 */
      transform: scale(1.05);
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  `,

  md: css`
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  `,

  lg: css`
    padding: 1rem 2rem;
    font-size: 1.125rem;
  `,
};

const StyledButton = styled.button`
  font-weight: 600;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;

  ${({ variant }) => variantStyles[variant]}
  ${({ size }) => sizeStyles[size]}
`;

const Button = ({
  variant = "primary",
  size = "md",
  children,
  ...props
}) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
