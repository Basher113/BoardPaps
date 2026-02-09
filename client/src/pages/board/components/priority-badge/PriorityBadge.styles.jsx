import styled, { css } from 'styled-components';

const priorityStyles = {
  LOW: css`
    background-color: #f4f4f5;
    color: #52525b;
  `,
  MEDIUM: css`
    background-color: #f4f4f5;
    color: #52525b;
  `,
  HIGH: css`
    background-color: #f4f4f5;
    color: #18181b;
  `,
  CRITICAL: css`
    background-color: #f4f4f5;
    color: #18181b;
    border: 1px solid #d4d4d8;
  `,
};

export const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => priorityStyles[props.$priority] || priorityStyles.MEDIUM}
`;

const priorityIconStyles = {
  LOW: css`
    color: #71717a;
  `,
  MEDIUM: css`
    color: #71717a;
  `,
  HIGH: css`
    color: #52525b;
  `,
  CRITICAL: css`
    color: #18181b;
  `,
};

export const PriorityIcon = styled.span`
  ${props => priorityIconStyles[props.$priority] || priorityIconStyles.MEDIUM}
`;

export const Label = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.6875rem;
`;
