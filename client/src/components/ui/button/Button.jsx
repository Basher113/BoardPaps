import styled, { css } from 'styled-components';

// shadcn/ui-inspired Button with black/white/gray palette
const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;

  &:focus-visible {
    outline: 2px solid #18181b;
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const variantStyles = {
  primary: css`
    background-color: #18181b;
    color: #fafafa;

    &:hover:not(:disabled) {
      background-color: #27272a;
    }

    &:active:not(:disabled) {
      background-color: #3f3f46;
    }
  `,

  secondary: css`
    background-color: #f4f4f5;
    color: #18181b;

    &:hover:not(:disabled) {
      background-color: #e4e4e7;
    }

    &:active:not(:disabled) {
      background-color: #d4d4d8;
    }
  `,

  outline: css`
    background-color: transparent;
    border-color: #e4e4e7;
    color: #18181b;

    &:hover:not(:disabled) {
      background-color: #f4f4f5;
    }

    &:active:not(:disabled) {
      background-color: #e4e4e7;
    }
  `,

  ghost: css`
    background-color: transparent;
    color: #18181b;

    &:hover:not(:disabled) {
      background-color: #f4f4f5;
    }

    &:active:not(:disabled) {
      background-color: #e4e4e7;
    }
  `,

  destructive: css`
    background-color: #ef4444;
    color: #fafafa;

    &:hover:not(:disabled) {
      background-color: #dc2626;
    }

    &:active:not(:disabled) {
      background-color: #b91c1c;
    }
  `,
};

const sizeStyles = {
  sm: css`
    height: 2rem;
    padding: 0 0.75rem;
    font-size: 0.75rem;
  `,

  md: css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  `,

  lg: css`
    height: 3rem;
    padding: 0 1.5rem;
    font-size: 0.875rem;
  `,

  icon: css`
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
  `,
};

const StyledButton = styled.button`
  ${baseStyles}
  ${({ $variant }) => variantStyles[$variant] || variantStyles.primary}
  ${({ $size }) => sizeStyles[$size] || sizeStyles.md}
`;

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
