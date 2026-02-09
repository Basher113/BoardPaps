import styled, { css } from 'styled-components';

const baseStyles = css`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #e4e4e7;
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #18181b;
  transition: all 0.15s ease;
  outline: none;

  &::placeholder {
    color: #a1a1aa;
  }

  &:focus {
    border-color: #18181b;
    box-shadow: 0 0 0 1px #18181b;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledInput = styled.input`
  ${baseStyles}
`;

const Input = ({ ...props }) => {
  return <StyledInput {...props} />;
};

export default Input;
